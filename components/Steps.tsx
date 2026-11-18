import { bulletKey, bulletParts } from "@/lib/bullets";
import { Brick } from "@/components/brick/Brick";
import { Tower } from "@/components/brick/Tower";
import { TowerMotion } from "@/components/TowerMotion";
import { cv } from "@/content/cv";
import { SKILLS } from "@/content/skills";
import { BRICK_HEX, type Locale } from "@/content/types";
import { ui } from "@/content/ui";
import { formatDuration, formatRange, inclusiveMonths } from "@/lib/dates";
import { newParts } from "@/lib/skills";
import styles from "@/components/Steps.module.css";

export function Steps({ locale, today }: { locale: Locale; today: Date }) {
  const t = ui[locale];
  const fresh = newParts(cv.steps);
  const tower = cv.steps.map((s) => ({ n: s.n, color: BRICK_HEX[s.brick], label: s.short ?? s.company }));
  return (
    <section id="steps" className={styles.section} aria-labelledby="steps-h">
      <h2 id="steps-h" className={styles.heading}>
        {t.sections.steps}
      </h2>
      <div className={styles.layout}>
        <div data-tower="sticky" className={styles.sticky}>
          <Tower steps={tower} U={24} labels ariaLabel={t.towerLabel} />
        </div>
        <ol className={styles.list}>
          {cv.steps.map((s, i) => (
            <li key={s.n}>
              <article id={`step-${s.n}`} data-step={s.n} className={styles.step}>
                <div data-tower="mini" className={styles.mini}>
                  <Tower steps={tower.slice(0, s.n)} U={9} />
                </div>
                <header className={styles.head}>
                  <span className={styles.numeral} aria-hidden="true">
                    {s.n}
                  </span>
                  <div>
                    <p className={styles.kicker}>
                      {t.step} {s.n}
                    </p>
                    <h3 className={styles.company}>
                      {s.companyUrl ? (
                        <a href={s.companyUrl} target="_blank" rel="noopener noreferrer">
                          {s.company}
                        </a>
                      ) : (
                        s.company
                      )}
                      {s.product ? <span className={styles.product}> · {s.product}</span> : null}
                    </h3>
                    <p className={styles.role}>{s.role[locale]}</p>
                    <p className={styles.meta}>
                      <span>{formatRange(s.start, s.end, locale)}</span>
                      <span>{formatDuration(inclusiveMonths(s.start, s.end, today), locale)}</span>
                      <span>{s.city[locale]}</span>
                      {s.client ? (
                        <span>
                          {t.client}: {s.client}
                        </span>
                      ) : null}
                    </p>
                  </div>
                </header>
                <ul className={styles.bullets}>
                  {s.bullets[locale].map((b) => {
                    const { lead, text } = bulletParts(b);
                    return (
                      <li key={bulletKey(b)}>
                        {lead ? <b>{lead}:</b> : null} {text}
                      </li>
                    );
                  })}
                </ul>
                {s.note ? <p className={styles.note}>{s.note[locale]}</p> : null}
                {fresh[i].length ? (
                  <div className={styles.parts}>
                    <p className={styles.partsLabel}>{t.newParts}</p>
                    <ul>
                      {fresh[i].map((id) => (
                        <li key={id}>
                          <Brick color={BRICK_HEX[s.brick]} U={8} />
                          {SKILLS[id as keyof typeof SKILLS].label}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </article>
            </li>
          ))}
        </ol>
      </div>
      <TowerMotion />
    </section>
  );
}
