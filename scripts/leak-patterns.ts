// Leak guard. The secret terms are never stored in git, in any form: they come
// from the LEAK_TERMS environment variable (a CI secret) or from the gitignored
// file leak-terms.local.json. Without either, the guard fails closed.
import { existsSync, readFileSync } from "node:fs";

export interface LeakTerms {
  /** Letters only, matched case-insensitively, also across separators. */
  words: string[];
  /** Digits only, matched inside any run of digits and separators. */
  digits: string[];
  /** Amounts in reais as plain digits, e.g. "99000" for R$99K. */
  money: string[];
}

export const TERMS_FILE = "leak-terms.local.json";

const EMPTY: LeakTerms = { words: [], digits: [], money: [] };

function parseTerms(raw: string, source: string): LeakTerms {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`leak terms in ${source} are invalid JSON`);
  }
  const d = data as Record<string, unknown>;
  const list = (k: keyof LeakTerms) => {
    const v = d?.[k] ?? [];
    if (!Array.isArray(v) || !v.every((x) => typeof x === "string" && x.length > 0)) {
      throw new Error(`leak terms in ${source}: ${k} is invalid`);
    }
    return v as string[];
  };
  return {
    words: list("words").map((w) => w.toLowerCase().replace(/[^\p{L}]/gu, "")),
    digits: list("digits").map((n) => n.replace(/\D/g, "")),
    money: list("money").map((n) => n.replace(/\D/g, "")),
  };
}

/** Loads the secret terms; throws when none are available unless LEAK_ALLOW_EMPTY=1. */
export function loadTerms(env: Record<string, string | undefined> = process.env, file = TERMS_FILE): LeakTerms {
  if (env.LEAK_TERMS) return parseTerms(env.LEAK_TERMS, "LEAK_TERMS");
  if (existsSync(file)) return parseTerms(readFileSync(file, "utf8"), file);
  if (env.LEAK_ALLOW_EMPTY === "1") return EMPTY;
  throw new Error(`no leak terms: create ${file} or set LEAK_TERMS (LEAK_ALLOW_EMPTY=1 skips the secret check)`);
}

// Not secret, only forbidden: age phrases.
const PATTERNS: RegExp[] = [/\byears old\b|\banos de idade\b|\baños de edad\b/i];

function amounts(lower: string): Set<string> {
  const out = new Set<string>();
  const add = (num: string, suffix?: string) => {
    const whole = num.replace(/[.,]\d{2}$/, "").replace(/[.,]/g, "");
    out.add(suffix ? whole + "000" : whole);
  };
  for (const m of lower.matchAll(/(?:r\$|brl)\s?(\d[\d.,]*)\s?(k|mil)?/g)) add(m[1], m[2]);
  for (const m of lower.matchAll(/(\d[\d.,]*)\s?(k|mil)?\s?brl/g)) add(m[1], m[2]);
  return out;
}

/** Labels ("term N", "pattern N") of everything in `text` that must not be public. */
export function findLeaks(text: string, terms: LeakTerms = loadTerms()): string[] {
  const lower = text.toLowerCase();
  const letters = lower.replace(/[^\p{L}]+/gu, "");
  const digitRuns = [...lower.matchAll(/\d[\d.\/\-\s]*\d/g)].map(([r]) => r.replace(/\D/g, ""));
  const money = terms.money.length ? amounts(lower) : new Set<string>();
  const checks = [
    ...terms.words.map((w) => letters.includes(w)),
    ...terms.digits.map((n) => digitRuns.some((r) => r.includes(n))),
    ...terms.money.map((n) => money.has(n)),
  ];
  return [
    ...checks.flatMap((hit, i) => (hit ? [`term ${i + 1}`] : [])),
    ...PATTERNS.flatMap((re, i) => (re.test(text) ? [`pattern ${i + 1}`] : [])),
  ];
}
