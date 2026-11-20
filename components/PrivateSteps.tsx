"use client";

import { useEffect, useState } from "react";
import { Brick } from "@/components/brick/Brick";
import type { TowerStep } from "@/components/brick/Tower";
import { StepCard } from "@/components/StepCard";
import { BRICK_HEX, type Locale } from "@/content/types";
import { ui } from "@/content/ui";
import { lock, takeReveal, usePrivateMode } from "@/lib/private/client";
import styles from "@/components/PrivateSteps.module.css";

const GLOW_MS = 2400;

/** The private steps, after step 10, only while this browser is unlocked. Renders nothing otherwise. */
export function PrivateSteps({ locale, tower }: { locale: Locale; tower: TowerStep[] }) {
  const { status, steps } = usePrivateMode();
  const [glow, setGlow] = useState<number | null>(null);

  // Make the unlock visible: go to the new step (code box just used, or a link to #step-N) and glow it.
  useEffect(() => {
    if (status !== "on" || !steps.length) return;
    const ns = steps.map((s) => s.n).sort((a, b) => a - b);
    const asked = Number(/^#step-(\d+)$/.exec(window.location.hash)?.[1]);
    const target = ns.includes(asked) ? asked : takeReveal() ? ns[0] : null;
    if (target === null) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frame = requestAnimationFrame(() => {
      document.getElementById(`step-${target}`)?.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
      setGlow(target);
    });
    const done = window.setTimeout(() => setGlow(null), GLOW_MS);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(done);
    };
  }, [status, steps]);

  if (status !== "on") return null;
  const t = ui[locale].privateMode;
  const today = new Date();
  const full = [
    ...tower,
    ...[...steps].sort((a, b) => a.n - b.n).map((s) => ({ n: s.n, color: BRICK_HEX[s.brick], label: s.short ?? s.company })),
  ];
  return (
    <>
      {[...steps]
        .sort((a, b) => a.n - b.n)
        .map((s) => (
          <li key={s.n} className={styles.item} data-reveal={glow === s.n || undefined}>
            <p className={styles.badge} data-private-badge>
              <Brick color={BRICK_HEX.green} U={11} />
              <span>{t.on}</span>
              <button type="button" className={styles.lock} onClick={() => void lock()}>
                {t.lock}
              </button>
            </p>
            <StepCard step={s} locale={locale} today={today} tower={full} />
          </li>
        ))}
    </>
  );
}
