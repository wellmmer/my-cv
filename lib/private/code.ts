import { createHash, randomBytes, scrypt, scryptSync, timingSafeEqual } from "node:crypto";

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

/** True for a well-formed `scrypt$<salt>$<32-byte hash>` string. */
export function isCodeHash(stored: string): boolean {
  const [kind, salt, hash, extra] = stored.split("$");
  return kind === "scrypt" && !!salt && !!hash && extra === undefined && Buffer.from(hash, "base64url").length === KEYLEN;
}

/** Timing-safe check of a typed code against a stored hash, off the main thread. False for any malformed hash. */
export async function verifyCode(code: string, stored: string): Promise<boolean> {
  if (!isCodeHash(stored)) return false;
  const [, salt, hash] = stored.split("$");
  const got = await new Promise<Buffer>((resolve, reject) =>
    scrypt(normalize(code), Buffer.from(salt, "base64url"), KEYLEN, { N }, (err, key) => (err ? reject(err) : resolve(key))),
  );
  return timingSafeEqual(got, Buffer.from(hash, "base64url"));
}

/** Short fingerprint of the stored hash; a new code gives a new fingerprint, which voids old cookies. */
export function codeFingerprint(stored: string): string {
  return createHash("sha256").update(stored).digest("hex").slice(0, 12);
}
