"use client";

// Browser-side private-mode state. Asks the server once whether this browser is unlocked;
// the page stays the public site until the server says yes.
import { useSyncExternalStore } from "react";
import type { Step } from "@/content/types";

export interface PrivateState {
  status: "unknown" | "locked" | "on";
  steps: Step[];
}

const INITIAL: PrivateState = { status: "unknown", steps: [] };
let state: PrivateState = INITIAL;
let started = false;
const listeners = new Set<() => void>();

function set(next: PrivateState) {
  state = next;
  for (const l of listeners) l();
}

async function load(): Promise<void> {
  try {
    const res = await fetch("/api/private/step", { cache: "no-store", credentials: "same-origin" });
    if (!res.ok) {
      // Drain the small 404 body so the request completes instead of hanging open.
      await res.text().catch(() => "");
      return set({ status: "locked", steps: [] });
    }
    const data = (await res.json()) as { steps?: Step[] };
    set(Array.isArray(data.steps) && data.steps.length ? { status: "on", steps: data.steps } : { status: "locked", steps: [] });
  } catch {
    set({ status: "locked", steps: [] });
  }
}

function subscribe(l: () => void) {
  listeners.add(l);
  if (!started) {
    started = true;
    void load();
  }
  return () => listeners.delete(l);
}

export function usePrivateMode(): PrivateState {
  return useSyncExternalStore(subscribe, () => state, () => INITIAL);
}

/** Sends the code; on success loads the private steps. "ok" only when private mode is really on. */
export async function unlock(code: string): Promise<"ok" | "wrong" | "error"> {
  try {
    const res = await fetch("/api/private/unlock", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code }),
      credentials: "same-origin",
    });
    if (res.status === 204) {
      await load();
      // The cookie may not have stuck (e.g. blocked); only report success when the step really loaded.
      return state.status === "on" ? "ok" : "error";
    }
    return res.status === 401 || res.status === 400 ? "wrong" : "error";
  } catch {
    return "error";
  }
}

/** Clears the cookie and reloads the public page. */
export async function lock(): Promise<void> {
  try {
    await fetch("/api/private/lock", { method: "POST", credentials: "same-origin" });
  } finally {
    window.location.reload();
  }
}
