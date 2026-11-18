import { bulletKey, bulletParts, pdfBulletsOf } from "@/lib/bullets";
import { Brick } from "@/components/brick/Brick";
import { Tower } from "@/components/brick/Tower";
import { cv } from "@/content/cv";
import { BRICK_HEX, type Locale, type Step } from "@/content/types";
import { ui } from "@/content/ui";
import { CONTACT } from "@/lib/contact";
import { formatDuration, formatRange, inclusiveMonths, yearsOfExperience } from "@/lib/dates";
import { SITE_URL } from "@/lib/site";
import { companyLine, printModel } from "@/components/print/model";
import styles from "@/components/print/designed.module.css";

/** The build-manual CV: one text column, a brick per step in the left rail. */
export function DesignedCv({ locale, privateSteps, today }: { locale: Locale; privateSteps: Step[]; today: Date }) {
  const t = ui[locale];
  const m = printModel(privateSteps, today);
  return (
    <main className={styles.page}>
      <header className={styles.top}>
        <div className={styles.rail} aria-hidden="true">
          <Tower steps={m.tower.map((s) => ({ n: s.n, color: BRICK_HEX[s.brick] }))} U={7} />
        </div>
        <div>
          <h1>{cv.name}</h1>
          <p className={styles.title}>{t.metaTitle.split(", ")[1]}</p>
          <p className={styles.contact}>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <span>{CONTACT.phone}</span>
            <a href={CONTACT.linkedin}>linkedin.com/in/wellmmer</a>
            <a href={CONTACT.github}>github.com/wellmmer</a>
            <a href={SITE_URL}>{SITE_URL.replace("https://", "")}</a>
          </p>
        </div>
      </header>

      <section className={styles.block}>
        <h2>{t.atsSections.summary}</h2>
        <p>{cv.summary[locale].replace("{years}", String(yearsOfExperience(today)))}</p>
        <p className={styles.note}>{t.contractNote}</p>
      </section>

      <section className={styles.block}>
        <h2>{t.atsSections.experience}</h2>
        {m.experience.map((s) => (
          <article key={`${s.id}-${s.n}`} className={styles.job}>
            <div className={styles.rail} aria-hidden="true">
              <span className={styles.n}>{s.n}</span>
              <Brick color={BRICK_HEX[s.brick]} U={7} />
            </div>
            <div>
              <h3>
                {s.role[locale]}, {companyLine(s)}
              </h3>
              <p className={styles.meta}>
                {formatRange(s.start, s.end, locale)} · {formatDuration(inclusiveMonths(s.start, s.end, today), locale)} ·{" "}
                {s.city[locale]}
              </p>
              <ul>
                {pdfBulletsOf(s, locale).map((b) => {
                  const { lead, text } = bulletParts(b);
                  return (
                    <li key={bulletKey(b)}>
                      {lead ? <b>{lead}:</b> : null} {text}
                    </li>
                  );
                })}
              </ul>
              {s.note ? <p className={styles.small}>{s.note[locale]}</p> : null}
            </div>
          </article>
        ))}
      </section>

      <section className={styles.block}>
        <h2>{t.atsSections.projects}</h2>
        {cv.projects.map((p) => (
          <p key={p.id} className={styles.project}>
            <b>{p.name}</b>: {p.what[locale]} {p.role[locale]}
            {p.live ? (
              <>
                {" "}
                <a href={p.live}>{p.live.replace("https://", "")}</a>
              </>
            ) : null}
          </p>
        ))}
      </section>

      <section className={styles.block}>
        <h2>{t.atsSections.skills}</h2>
        {m.skills.map((g) => (
          <p key={g.group} className={styles.small}>
            <b>{t.groups[g.group]}:</b> {g.labels.join(", ")}
          </p>
        ))}
      </section>

      <section className={`${styles.block} ${styles.cols}`}>
        <div>
          <h2>{t.atsSections.education}</h2>
          {cv.education.map((e) => (
            <p key={e.degree.en} className={styles.small}>
              <b>{e.degree[locale]}</b>, {e.school} · {formatRange(e.start, e.end, locale)}
            </p>
          ))}
        </div>
        <div>
          <h2>{t.atsSections.certifications}</h2>
          {cv.certifications[locale].map((c) => (
            <p key={c} className={styles.small}>
              {c}
            </p>
          ))}
        </div>
        <div>
          <h2>{t.atsSections.languages}</h2>
          <p className={styles.small}>{cv.languages.map((l) => `${l.name[locale]}: ${l.level[locale]}`).join(" · ")}</p>
          <h2 className={styles.gap}>{t.atsSections.award}</h2>
          <p className={styles.small}>{cv.award[locale]}</p>
        </div>
      </section>
    </main>
  );
}
