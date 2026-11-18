import { readFile } from "node:fs/promises";
import path from "node:path";
import { SKILLS } from "@/content/skills";
import { BRICK_HEX, LOCALES, type Step } from "@/content/types";

/** Gitignored file with private steps. Read at request time, never imported. */
export const PRIVATE_FILE = "content/private.local.json";

const YM = /^\d{4}-(0[1-9]|1[0-2])$/;

const isObj = (x: unknown): x is Record<string, unknown> => typeof x === "object" && x !== null && !Array.isArray(x);
const isStr = (x: unknown): x is string => typeof x === "string" && x.trim().length > 0;
const isL = (x: unknown) => isObj(x) && LOCALES.every((l) => isStr(x[l]));
const isLList = (x: unknown) =>
  isObj(x) && LOCALES.every((l) => Array.isArray(x[l]) && (x[l] as unknown[]).length > 0 && (x[l] as unknown[]).every(isStr));

const CHECKS: Record<string, (v: unknown) => boolean> = {
  n: (v) => Number.isInteger(v) && (v as number) > 0,
  id: isStr,
  company: isStr,
  role: isL,
  start: (v) => typeof v === "string" && YM.test(v),
  end: (v) => v === "now" || (typeof v === "string" && YM.test(v)),
  city: isL,
  brick: (v) => typeof v === "string" && v in BRICK_HEX,
  bullets: isLList,
  uses: (v) => Array.isArray(v) && v.every((u) => typeof u === "string" && u in SKILLS),
};

const OPTIONAL: Record<string, (v: unknown) => boolean> = {
  short: isStr,
  companyUrl: (v) => typeof v === "string" && v.startsWith("https://"),
  product: isStr,
  client: isStr,
  note: isL,
};

/** Returns the first invalid field name of a step, or null. */
function badField(x: unknown): string | null {
  if (!isObj(x)) return "";
  for (const [k, ok] of Object.entries(CHECKS)) if (!ok(x[k])) return k;
  for (const [k, ok] of Object.entries(OPTIONAL)) if (k in x && !ok(x[k])) return k;
  return null;
}

export function isStep(x: unknown): x is Step {
  return badField(x) === null;
}

/**
 * Private steps for the local-only PDF. Returns [] unless CV_PRIVATE=1 or a
 * path is given, so the public build never reads the file.
 */
export async function loadPrivateSteps(file?: string): Promise<Step[]> {
  if (!file && process.env.CV_PRIVATE !== "1") return [];
  const rel = file ?? PRIVATE_FILE;
  let raw: string;
  try {
    raw = await readFile(path.resolve(process.cwd(), rel), "utf8");
  } catch {
    throw new Error(`${rel} is missing`);
  }
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`${rel} is not valid JSON`);
  }
  if (!isObj(data) || !Array.isArray(data.steps)) throw new Error(`${rel}: steps is invalid`);
  data.steps.forEach((s, i) => {
    const bad = badField(s);
    if (bad !== null) throw new Error(`${rel}: steps[${i}]${bad ? "." + bad : ""} is invalid`);
  });
  return data.steps as Step[];
}
