"use client";

// Browser-side private-mode actions. The page itself is built on the server: an unlocked browser
// gets the whole private build (towers, counts, steps, downloads) in the HTML. This file only
// unlocks, locks, and remembers which private steps the unlock opened.
import type { Step } from "@/content/types";

/** Private step numbers, known after a successful unlock. */
let opened: number[] = [];

/** Asks the server which private steps this browser may see; true when at least one. */
async function check(): Promise<boolean> {
  try {
    const res = await fetch("/api/private/step", { cache: "no-store", credentials: "same-origin" });
    if (!res.ok) {
      // Drain the small 404 body so the request completes instead of hanging open.
      await res.text().catch(() => "");
      return false;
    }
    const data = (await res.json()) as { steps?: Pick<Step, "n">[] };
    opened = Array.isArray(data.steps) ? data.steps.map((s) => s.n).sort((a, b) => a - b) : [];
    return opened.length > 0;
  } catch {
    return false;
  }
}

/** Sends the code. "ok" only when private mode is really on (the cookie stuck and the steps load). */
export async function unlock(code: string): Promise<"ok" | "wrong" | "error"> {
  try {
    const res = await fetch("/api/private/unlock", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code }),
      credentials: "same-origin",
    });
    if (res.status === 204) return (await check()) ? "ok" : "error";
    return res.status === 401 || res.status === 400 ? "wrong" : "error";
  } catch {
    return "error";
  }
}

/** The first private step the last unlock opened, or null. */
export function firstPrivateStep(): number | null {
  return opened[0] ?? null;
}

/** Where to land after unlocking: the page, at the first private step (the reveal reads the hash). */
export function privateBuildUrl(locale: string): string {
  const n = firstPrivateStep();
  return n === null ? `/${locale}` : `/${locale}#step-${n}`;
}

/** Reloads this page as the private build, landing on the new step. */
export function showPrivateBuild(locale: string): void {
  const url = privateBuildUrl(locale);
  // Same path, new hash: replace the entry, then reload so the server sends the private build.
  window.history.replaceState(null, "", url);
  window.location.reload();
}

/** Clears the cookie and reloads the public page. */
export async function lock(): Promise<void> {
  try {
    await fetch("/api/private/lock", { method: "POST", credentials: "same-origin" });
  } finally {
    window.location.reload();
  }
}
