import { cv } from "@/content/cv";
import type { Locale } from "@/content/types";
import { ui } from "@/content/ui";
import { formatRange } from "@/lib/dates";
import styles from "@/components/Appendix.module.css";

export function Appendix({ locale }: { locale: Locale }) {
  const t = ui[locale];
  return (
    <section id="appendix" className={styles.section} aria-labelledby="appendix-h">
      <h2 id="appendix-h">{t.sections.appendix}</h2>
      <div className={styles.cols}>
        <div>
          <h3>{t.atsSections.education}</h3>
          <ul>
            {cv.education.map((e) => (
              <li key={e.degree.en}>
                <b>{e.degree[locale]}</b>
                <span>
                  {e.school}, {e.place[locale]} · {formatRange(e.start, e.end, locale)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>{t.atsSections.certifications}</h3>
          <ul>
            {cv.certifications[locale].map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>{t.atsSections.languages}</h3>
          <ul>
            {cv.languages.map((l) => (
              <li key={l.code}>
                {l.name[locale]}: {l.level[locale]}
              </li>
            ))}
          </ul>
          <h3 className={styles.award}>{t.atsSections.award}</h3>
          <p>{cv.award[locale]}</p>
        </div>
      </div>
    </section>
  );
}
