import type React from "react";
import { Brick } from "@/components/brick/Brick";
import { Icon } from "@/components/icons";
import { Tower, type TowerStep } from "@/components/brick/Tower";
import { SKILLS } from "@/content/skills";
import { BRICK_HEX, type Locale, type Step } from "@/content/types";
import { ui } from "@/content/ui";
import { bulletKey, bulletParts } from "@/lib/bullets";
import { formatDuration, formatRange, inclusiveMonths } from "@/lib/dates";
import styles from "@/components/Steps.module.css";

/** One step of the build. Plain markup, so the server list and the private (client) step share it. */
export function StepCard({
  step,
  locale,
  today,
  tower,
}: {
  step: Step;
  locale: Locale;
  today: Date;
  tower: TowerStep[];
}) {
  const t = ui[locale];
  return (
    <article
      id={`step-${step.n}`}
      data-step={step.n}
      className={styles.step}
    >
      <div data-tower="mini" className={styles.mini}>
        <Tower steps={tower.slice(0, step.n)} U={9} />
      </div>
      <header className={styles.head}>
        <span className={styles.numeral} aria-hidden="true">
          {step.n}
        </span>
        <div>
          <h3 className={styles.company}>
            {step.product ? (
              <>
                {step.company}
                <span className={styles.product}>
                  {" "}
                  ·{" "}
                  <NameTail
                    text={step.product}
                    url={step.companyUrl}
                    label={t.visit.replace("{name}", step.company)}
                  />
                </span>
              </>
            ) : (
              <NameTail
                text={step.company}
                url={step.companyUrl}
                label={t.visit.replace("{name}", step.company)}
              />
            )}
          </h3>
          <p className={styles.role}>{step.role[locale]}</p>
          <p className={styles.meta}>
            <span
              data-badge="range"
              className={`${styles.badge} ${styles[`b_${step.brick}`]}`}
            >
              {formatRange(step.start, step.end, locale)}
            </span>
            <span data-badge="duration" className={styles.badgeOutline}>
              {formatDuration(
                inclusiveMonths(step.start, step.end, today),
                locale,
              )}
            </span>
            <span className={styles.place}>
              <Icon name="pin" size={16} />
              {step.city[locale]}
            </span>
            {step.via ? (
              <span>
                {t.via} {step.via}
              </span>
            ) : null}
            {step.client ? (
              <span>
                {t.client}: {step.client}
              </span>
            ) : null}
          </p>
        </div>
      </header>
      <ul
        className={styles.bullets}
        data-bullets
        style={{ "--step": BRICK_HEX[step.brick] } as React.CSSProperties}
      >
        {step.bullets[locale].map((b) => {
          const { lead, text } = bulletParts(b);
          return (
            <li key={bulletKey(b)}>
              {lead ? <b>{lead}:</b> : null} {text}
            </li>
          );
        })}
      </ul>
      {step.note ? <p className={styles.note}>{step.note[locale]}</p> : null}
      {step.uses.length ? (
        <div className={styles.parts}>
          <p className={styles.partsLabel}>{t.partsInThisStep}</p>
          <ul>
            {step.uses.map((id) => (
              <li key={id}>
                <Brick color={BRICK_HEX[step.brick]} U={14} />
                {SKILLS[id as keyof typeof SKILLS].label}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}

/** The name with the visit link glued to its last word, so the icon never wraps onto a line alone. */
function NameTail({
  text,
  url,
  label,
}: {
  text: string;
  url?: string;
  label: string;
}) {
  if (!url) return <>{text}</>;
  const cut = text.lastIndexOf(" ") + 1;
  return (
    <>
      {text.slice(0, cut)}
      <span className={styles.glue}>
        {text.slice(cut)}
        <a
          className={styles.visit}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
        >
          <Icon name="external" size={18} />
        </a>
      </span>
    </>
  );
}
