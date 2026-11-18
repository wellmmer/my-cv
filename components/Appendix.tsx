import { BrickCard } from "@/components/brick/BrickCard";
import { Flag } from "@/components/Flag";
import { Icon } from "@/components/icons";
import { cv } from "@/content/cv";
import type { Locale } from "@/content/types";
import { ui } from "@/content/ui";
import { formatRange } from "@/lib/dates";
import styles from "@/components/Appendix.module.css";

const FLAG = { pt: "br", en: "us", es: "es" } as const;

export function Appendix({ locale }: { locale: Locale }) {
  const t = ui[locale];
  return (
    <section id="appendix" className={styles.section} aria-labelledby="appendix-h">
      <h2 id="appendix-h">{t.sections.appendix}</h2>
      <div className={styles.cols}>
        <BrickCard color="blue" studs={5}>
          <h3>{t.atsSections.education}</h3>
          <ul className={styles.list}>
            {cv.education.map((e) => (
              <li key={e.degree.en}>
                <b>{e.degree[locale]}</b>
                <span>
                  {e.school}, {e.place[locale]}
                </span>
                <span className={styles.badge}>{formatRange(e.start, e.end, locale)}</span>
              </li>
            ))}
          </ul>
        </BrickCard>
        <BrickCard color="green" studs={5}>
          <h3>{t.atsSections.certifications}</h3>
          <ul className={styles.checks}>
            {cv.certifications[locale].map((c) => (
              <li key={c}>
                <Icon name="check" size={18} />
                {c}
              </li>
            ))}
          </ul>
        </BrickCard>
        <BrickCard color="yellow" studs={5}>
          <h3>{t.atsSections.languages}</h3>
          <ul className={styles.langs} data-languages>
            {cv.languages.map((l) => (
              <li key={l.code}>
                <Flag code={FLAG[l.code]} size={24} />
                <span>{l.name[locale]}</span>
                <span className={styles.level}>{l.level[locale]}</span>
              </li>
            ))}
          </ul>
          <h3 className={styles.award}>{t.atsSections.award}</h3>
          <p className={styles.trophy}>
            <Icon name="trophy" size={22} />
            <span>{cv.award[locale]}</span>
          </p>
        </BrickCard>
      </div>
    </section>
  );
}
