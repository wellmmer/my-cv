import { Avatar } from "@/components/Avatar";
import { Brick } from "@/components/brick/Brick";
import { BrickButton } from "@/components/brick/BrickButton";
import { BrickCard } from "@/components/brick/BrickCard";
import { Tower } from "@/components/brick/Tower";
import { cv } from "@/content/cv";
import { SKILLS } from "@/content/skills";
import { BRICK_HEX, type BrickColor, type Locale } from "@/content/types";
import { ui } from "@/content/ui";
import { CONTACT, cvPdfPath, mailtoUrl, whatsappUrl } from "@/lib/contact";
import styles from "@/components/Hero.module.css";

const PART_COLORS: BrickColor[] = ["red", "blue", "yellow", "black", "grey", "green"];

export function Hero({ locale }: { locale: Locale }) {
  const t = ui[locale];
  const newest = cv.steps[cv.steps.length - 1];
  // The title line already says it; the summary on the page starts after it.
  const lead = `${t.title}. `;
  const summary = cv.summary[locale].startsWith(lead) ? cv.summary[locale].slice(lead.length) : cv.summary[locale];
  const towerSteps = cv.steps.map((s) => ({ n: s.n, color: BRICK_HEX[s.brick], label: s.short ?? s.company }));
  return (
    <section className={styles.hero} aria-labelledby="hero-name">
      <div className={styles.copy} data-hero-copy>
        <Avatar labels={t.avatar} />
        <h1 id="hero-name" className={styles.name}>
          <span>Wellmmer</span> <span>Lucas</span>
        </h1>
        <p className={styles.title} data-hero-title>
          {t.title}
        </p>
        <p className={styles.summary}>{summary}</p>
        <div className={styles.ctas}>
          <BrickButton href={cvPdfPath(locale, "designed")} variant="pdf" icon="pdf" download>
            {t.cta.download}
          </BrickButton>
          <BrickButton href={whatsappUrl(locale)} variant="whatsapp" icon="whatsapp" external>
            {t.cta.whatsapp}
          </BrickButton>
          <BrickButton href={mailtoUrl(locale)} variant="email" icon="gmail">
            {t.cta.email}
          </BrickButton>
          <BrickButton href={CONTACT.linkedin} variant="linkedin" icon="linkedin" external>
            {t.cta.linkedin}
          </BrickButton>
          <BrickButton href={CONTACT.github} variant="github" icon="github" external>
            {t.cta.github}
          </BrickButton>
        </div>
        <a className={styles.plain} href={cvPdfPath(locale, "ats")} download>
          {t.cta.plainText}
        </a>
        <p className={styles.note}>{t.contractNote}</p>
      </div>

      <div className={styles.build} data-hero-build>
        <Tower
          steps={towerSteps}
          U={33}
          liftTop
          labels
          ariaLabel={t.towerLabel}
          labelHref={(n) => `#step-${n}`}
          className={styles.tower}
        />
      </div>

      <BrickCard color="red" as="aside" className={styles.box} labelledBy="parts-now" studs={5}>
        <h2 id="parts-now">{t.partsInStep.replace("{n}", String(newest.n))}</h2>
        <ul>
          {(newest.keyParts ?? []).map((id, i) => (
            <li key={id}>
              <Brick color={BRICK_HEX[PART_COLORS[i % PART_COLORS.length]]} U={17} />
              <span>
                <b>1x</b>
                {SKILLS[id].label}
              </span>
            </li>
          ))}
        </ul>
        <span className={styles.scale} aria-hidden="true">
          1:1
        </span>
      </BrickCard>

      <ol className={styles.strip}>
        {cv.steps.map((s) => (
          <li key={s.n} className={s.n === newest.n ? styles.on : undefined}>
            <a href={`#step-${s.n}`}>
              <b>{s.n}</b>
              <span>{s.start.slice(0, 4)}</span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
