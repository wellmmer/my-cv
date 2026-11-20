// Server-only helpers shared by the /api/private/* route handlers.
import type { NextRequest } from "next/server";
import type { PrivateConfig } from "@/lib/private/config";
import { verifyToken } from "@/lib/private/token";

export const COOKIE = "cv_private";
export const MAX_AGE_S = 30 * 24 * 60 * 60;

let minDelayMs = 1000;

/** Tests set 0 to skip the anti-guessing floor. */
export function setMinDelay(ms: number): void {
  minDelayMs = ms;
}

/** Waits until at least the floor has passed since `started`. */
export async function holdUntilFloor(started: number): Promise<void> {
  const left = minDelayMs - (Date.now() - started);
  if (left > 0) await new Promise((r) => setTimeout(r, left));
}

export function isUnlocked(req: NextRequest, cfg: PrivateConfig | null, now = Date.now()): boolean {
  if (!cfg) return false;
  return verifyToken(req.cookies.get(COOKIE)?.value, cfg.secret, cfg.v, now);
}

export function privateHeaders(): Record<string, string> {
  return { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" };
}

/** A 404 that looks like any missing route. */
export function notFound(): Response {
  return new Response("Not found", { status: 404, headers: privateHeaders() });
}
