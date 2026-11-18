// Leak guard. Secret terms are stored only as salted SHA-256 hashes, so no
// tracked file holds them in any reversible form. The scanner hashes each
// candidate token of a text and compares.
import { createHash } from "node:crypto";

export type SecretKind = "word" | "digits" | "money";
export type Secret = { kind: SecretKind; len: number; hash: string };

const SALT = "my-cv-leak-v1:";

export function hashToken(token: string): string {
  return createHash("sha256").update(SALT + token).digest("hex");
}

/** Builds a secret entry. Used by tests and to add entries to SECRETS. */
export function toSecret(kind: SecretKind, token: string): Secret {
  return { kind, len: token.length, hash: hashToken(token) };
}

export const SECRETS: Secret[] = [
  // Two private company names (word), one tax ID (digits), one salary floor (money).
];

// Not secret, only forbidden: age phrases.
const PATTERNS: RegExp[] = [/\byears old\b|\banos de idade\b|\baños de edad\b/i];

function wordHashes(text: string, lengths: Set<number>): Set<string> {
  const out = new Set<string>();
  for (const [w] of text.matchAll(/\p{L}+/gu)) {
    for (const len of lengths) {
      for (let i = 0; i + len <= w.length; i++) out.add(hashToken(w.slice(i, i + len)));
    }
  }
  return out;
}

function digitHashes(text: string): Set<string> {
  const out = new Set<string>();
  for (const [run] of text.matchAll(/\d[\d.\/\-\s]*\d/g)) out.add(hashToken(run.replace(/\D/g, "")));
  return out;
}

function moneyHashes(text: string): Set<string> {
  const out = new Set<string>();
  for (const [m] of text.matchAll(/r\$\s?\d[\d.,]*\s?(?:k|mil)?/g)) {
    const norm = m.replace(/\s/g, "").replace(/[.,]/g, "").replace(/(k|mil)$/, "000");
    out.add(hashToken(norm));
  }
  return out;
}

/** Labels ("secret N", "pattern N") of everything in `text` that must not be public. */
export function findLeaks(text: string, secrets: Secret[] = SECRETS): string[] {
  const lower = text.toLowerCase();
  const lengths = new Set(secrets.filter((s) => s.kind === "word").map((s) => s.len));
  const words = lengths.size ? wordHashes(lower, lengths) : new Set<string>();
  const digits = secrets.some((s) => s.kind === "digits") ? digitHashes(lower) : new Set<string>();
  const money = secrets.some((s) => s.kind === "money") ? moneyHashes(lower) : new Set<string>();
  const pool: Record<SecretKind, Set<string>> = { word: words, digits, money };
  return [
    ...secrets.flatMap((s, i) => (pool[s.kind].has(s.hash) ? [`secret ${i + 1}`] : [])),
    ...PATTERNS.flatMap((re, i) => (re.test(text) ? [`pattern ${i + 1}`] : [])),
  ];
}
