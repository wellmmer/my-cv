import { PrivateSteps } from "@/components/PrivateSteps";
import { StepCard } from "@/components/StepCard";
import { Tower } from "@/components/brick/Tower";
import { TowerMotion } from "@/components/TowerMotion";
import { cv } from "@/content/cv";
import { BRICK_HEX, type Locale } from "@/content/types";
import { ui } from "@/content/ui";
import styles from "@/components/Steps.module.css";

export function Steps({ locale, today }: { locale: Locale; today: Date }) {
  const t = ui[locale];
  const tower = cv.steps.map((s) => ({
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
          {cv.steps.map((s) => (
            <li key={s.n}>
              <StepCard step={s} locale={locale} today={today} tower={tower} />
            </li>
          ))}
          <PrivateSteps locale={locale} tower={tower} />
        </ol>
      </div>
      <TowerMotion />
    </section>
  );
}
