import { createHmac, timingSafeEqual } from "node:crypto";

export interface TokenPayload {
  /** Expiry, epoch ms. */
  exp: number;
  /** Fingerprint of the code hash the token was issued under. */
  v: string;
}

function mac(data: string, secret: string): Buffer {
  return createHmac("sha256", secret).update(data).digest();
}

/** `<payload>.<hmac>`, both base64url. */
export function signToken(p: TokenPayload, secret: string): string {
  const data = Buffer.from(JSON.stringify({ exp: p.exp, v: p.v })).toString("base64url");
  return `${data}.${mac(data, secret).toString("base64url")}`;
}

/** True only for an untampered, unexpired token issued under the current code fingerprint. */
export function verifyToken(token: string | undefined, secret: string, v: string, now: number): boolean {
  if (!token) return false;
  const [data, sig, extra] = token.split(".");
  if (!data || !sig || extra !== undefined) return false;
  const got = Buffer.from(sig, "base64url");
  const want = mac(data, secret);
  if (got.length !== want.length || !timingSafeEqual(got, want)) return false;
  try {
    const p = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as Partial<TokenPayload>;
    return typeof p.exp === "number" && p.exp > now && p.v === v;
  } catch {
    return false;
  }
}
