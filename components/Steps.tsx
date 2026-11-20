import { PrivateBadge } from "@/components/PrivateBadge";
import { PrivateReveal } from "@/components/PrivateReveal";
import { StepCard } from "@/components/StepCard";
import { Tower } from "@/components/brick/Tower";
import { TowerMotion } from "@/components/TowerMotion";
import { BRICK_HEX, type Locale, type Step } from "@/content/types";
import { ui } from "@/content/ui";
import badge from "@/components/PrivateBadge.module.css";
import styles from "@/components/Steps.module.css";

/** `steps` is the whole build; `privateNs` marks the private steps an unlocked browser also gets. */
export function Steps({
  locale,
  today,
  steps,
  privateNs = [],
}: {
  locale: Locale;
  today: Date;
  steps: readonly Step[];
  privateNs?: readonly number[];
}) {
  const t = ui[locale];
  const tower = steps.map((s) => ({
    n: s.n,
    color: BRICK_HEX[s.brick],
    label: s.short ?? s.company,
  }));
  return (
    <section id="steps" className={styles.section} aria-labelledby="steps-h">
      <h2 id="steps-h" className={styles.heading}>
        {t.sections.steps}
      </h2>
      <div className={styles.layout}>
        <div data-tower="sticky" className={styles.sticky}>
          <Tower
            steps={tower}
            U={24}
            labels
            ariaLabel={t.towerLabel}
            labelHref={(n) => `#step-${n}`}
          />
        </div>
        <ol className={styles.list}>
          {steps.map((s) =>
            privateNs.includes(s.n) ? (
              <li key={s.n} className={badge.item} data-private-step={s.n}>
                <PrivateBadge on={t.privateMode.on} lockLabel={t.privateMode.lock} />
                <StepCard step={s} locale={locale} today={today} tower={tower} />
              </li>
            ) : (
              <li key={s.n}>
                <StepCard step={s} locale={locale} today={today} tower={tower} />
              </li>
            ),
          )}
        </ol>
      </div>
      {privateNs.length ? <PrivateReveal ns={[...privateNs]} /> : null}
      <TowerMotion />
    </section>
  );
}
