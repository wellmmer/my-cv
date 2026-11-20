import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEYLEN = 32;
const N = 16384;

/** Case-insensitive; spaces and any dash between words count as "-", so "Brick Tango" equals "brick-tango". */
function normalize(code: string): string {
  return code
    .trim()
    .toLowerCase()
    .replace(/[\s\u2010-\u2015\u2212-]+/g, "-");
}

/** Hash of the unlock code: `scrypt$<salt>$<hash>`, both base64url. The code itself is never stored. */
export function hashCode(code: string, salt: Buffer = randomBytes(16)): string {
  const hash = scryptSync(normalize(code), salt, KEYLEN, { N });
  return `scrypt$${salt.toString("base64url")}$${hash.toString("base64url")}`;
}

/** Timing-safe check of a typed code against a stored hash. False for any malformed hash. */
export function verifyCode(code: string, stored: string): boolean {
  const [kind, salt, hash] = stored.split("$");
  if (kind !== "scrypt" || !salt || !hash) return false;
  const want = Buffer.from(hash, "base64url");
  if (want.length !== KEYLEN) return false;
  const got = scryptSync(normalize(code), Buffer.from(salt, "base64url"), KEYLEN, { N });
  return timingSafeEqual(got, want);
}

/** Short fingerprint of the stored hash; a new code gives a new fingerprint, which voids old cookies. */
export function codeFingerprint(stored: string): string {
  return createHash("sha256").update(stored).digest("hex").slice(0, 12);
}
