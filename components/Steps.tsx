import { bulletKey, bulletParts } from "@/lib/bullets";
import type React from "react";
import { Brick } from "@/components/brick/Brick";
import { Icon } from "@/components/icons";
import { Tower } from "@/components/brick/Tower";
import { TowerMotion } from "@/components/TowerMotion";
import { cv } from "@/content/cv";
import { SKILLS } from "@/content/skills";
import { BRICK_HEX, type Locale } from "@/content/types";
import { ui } from "@/content/ui";
import { formatDuration, formatRange, inclusiveMonths } from "@/lib/dates";
import styles from "@/components/Steps.module.css";

export function Steps({ locale, today }: { locale: Locale; today: Date }) {
  const t = ui[locale];
  const tower = cv.steps.map((s) => ({ n: s.n, color: BRICK_HEX[s.brick], label: s.short ?? s.company }));
  return (
    <section id="steps" className={styles.section} aria-labelledby="steps-h">
      <h2 id="steps-h" className={styles.heading}>
        {t.sections.steps}
      </h2>
      <div className={styles.layout}>
        <div data-tower="sticky" className={styles.sticky}>
          <Tower steps={tower} U={24} labels ariaLabel={t.towerLabel} labelHref={(n) => `#step-${n}`} />
        </div>
        <ol className={styles.list}>
          {cv.steps.map((s) => (
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
                    <h3 className={styles.company}>
                      {s.product ? (
                        <>
                          {s.company}
                          <span className={styles.product}>
                            {" "}
                            · <NameTail text={s.product} url={s.companyUrl} label={t.visit.replace("{name}", s.company)} />
                          </span>
                        </>
                      ) : (
                        <NameTail text={s.company} url={s.companyUrl} label={t.visit.replace("{name}", s.company)} />
                      )}
                    </h3>
                    <p className={styles.role}>{s.role[locale]}</p>
                    <p className={styles.meta}>
                      <span data-badge="range" className={`${styles.badge} ${styles[`b_${s.brick}`]}`}>
                        {formatRange(s.start, s.end, locale)}
                      </span>
                      <span data-badge="duration" className={styles.badgeOutline}>
                        {formatDuration(inclusiveMonths(s.start, s.end, today), locale)}
                      </span>
                      <span className={styles.place}>
                        <Icon name="pin" size={16} />
                        {s.city[locale]}
                      </span>
                      {s.via ? (
                        <span>
                          {t.via} {s.via}
                        </span>
                      ) : null}
                      {s.client ? (
                        <span>
                          {t.client}: {s.client}
                        </span>
                      ) : null}
                    </p>
                  </div>
                </header>
                <ul className={styles.bullets} data-bullets style={{ "--step": BRICK_HEX[s.brick] } as React.CSSProperties}>
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
                {s.uses.length ? (
                  <div className={styles.parts}>
                    <p className={styles.partsLabel}>{t.partsInThisStep}</p>
                    <ul>
                      {s.uses.map((id) => (
                        <li key={id}>
                          <Brick color={BRICK_HEX[s.brick]} U={14} />
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

/** The name with the visit link glued to its last word, so the icon never wraps onto a line alone. */
function NameTail({ text, url, label }: { text: string; url?: string; label: string }) {
  if (!url) return <>{text}</>;
  const cut = text.lastIndexOf(" ") + 1;
  return (
    <>
      {text.slice(0, cut)}
      <span className={styles.glue}>
        {text.slice(cut)}
        <a className={styles.visit} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>
          <Icon name="external" size={18} />
        </a>
      </span>
    </>
  );
}
