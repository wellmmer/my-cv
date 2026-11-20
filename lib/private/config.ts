// Server-only: read by the /api/private/* route handlers, never by pages or components.
import "server-only";
import { isStep } from "@/content/private";
import type { Step } from "@/content/types";
import { codeFingerprint, isCodeHash } from "@/lib/private/code";

export interface PrivateConfig {
  steps: Step[];
  codeHash: string;
  secret: string;
  /** Fingerprint of the code hash; part of every cookie. */
  v: string;
}

/** Private-mode settings from the environment, or null when anything is missing or invalid. Never throws. */
export function privateConfig(env: NodeJS.ProcessEnv = process.env): PrivateConfig | null {
  const raw = env.PRIVATE_STEPS_JSON;
  const codeHash = env.PRIVATE_CODE_HASH;
  const secret = env.UNLOCK_SECRET;
  if (!raw || !codeHash || !secret) return null;
  if (!isCodeHash(codeHash)) {
    console.warn("private mode off: PRIVATE_CODE_HASH is not a valid code hash");
    return null;
  }
  if (secret.length < 32) {
    console.warn("private mode off: UNLOCK_SECRET is too short");
    return null;
  }
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    console.warn("private mode off: PRIVATE_STEPS_JSON is not JSON");
    return null;
  }
  const steps = (data as { steps?: unknown } | null)?.steps;
  if (!Array.isArray(steps) || !steps.length || !steps.every(isStep)) {
    console.warn("private mode off: PRIVATE_STEPS_JSON steps are invalid");
    return null;
  }
  return { steps, codeHash, secret, v: codeFingerprint(codeHash) };
}
