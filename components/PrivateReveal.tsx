"use client";

import { useEffect } from "react";

const GLOW_MS = 2400;

/**
 * Makes an unlock visible: when the address points at a private step (#step-N, set by the code box
 * and the private link), go there and let it glow once.
 */
export function PrivateReveal({ ns }: { ns: number[] }) {
  useEffect(() => {
    const n = Number(/^#step-(\d+)$/.exec(window.location.hash)?.[1]);
    if (!ns.includes(n)) return;
    const item = document.querySelector<HTMLElement>(`[data-private-step="${n}"]`);
    if (!item) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frame = requestAnimationFrame(() => {
      document.getElementById(`step-${n}`)?.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
      item.setAttribute("data-reveal", "");
    });
    const done = window.setTimeout(() => item.removeAttribute("data-reveal"), GLOW_MS);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(done);
    };
  }, [ns]);
  return null;
}
