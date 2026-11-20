"use client";

import { Brick } from "@/components/brick/Brick";
import type { TowerStep } from "@/components/brick/Tower";
import { StepCard } from "@/components/StepCard";
import { BRICK_HEX, type Locale } from "@/content/types";
import { ui } from "@/content/ui";
import { lock, usePrivateMode } from "@/lib/private/client";
import styles from "@/components/PrivateSteps.module.css";

/** The private steps, after step 10, only while this browser is unlocked. Renders nothing otherwise. */
export function PrivateSteps({ locale, tower }: { locale: Locale; tower: TowerStep[] }) {
  const { status, steps } = usePrivateMode();
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
          <li key={s.n} className={styles.item}>
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
