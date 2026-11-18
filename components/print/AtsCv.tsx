import { cv } from "@/content/cv";
import type { Locale, Step } from "@/content/types";
import { ui } from "@/content/ui";
import { CONTACT } from "@/lib/contact";
import { formatRange, yearsOfExperience } from "@/lib/dates";
import { SITE_URL } from "@/lib/site";
import { companyLine, printModel } from "@/components/print/model";
import styles from "@/components/print/ats.module.css";

/** Plain single-column CV for applicant tracking systems: no images, no SVG. */
export function AtsCv({ locale, privateSteps, today }: { locale: Locale; privateSteps: Step[]; today: Date }) {
  const t = ui[locale];
  const m = printModel(privateSteps, today);
  return (
    <main className={styles.page}>
      <h1>{cv.name}</h1>
      <p className={styles.title}>{t.metaTitle.split(", ")[1]}</p>
      <p className={styles.contact}>
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> | {CONTACT.phone} |{" "}
        <a href={CONTACT.linkedin}>linkedin.com/in/wellmmer</a> | <a href={CONTACT.github}>github.com/wellmmer</a> |{" "}
        <a href={SITE_URL}>{SITE_URL.replace("https://", "")}</a>
      </p>

      <h2>{t.atsSections.summary}</h2>
      <p>{cv.summary[locale].replace("{years}", String(yearsOfExperience(today)))}</p>
      <p>{t.contractNote}</p>

      <h2>{t.atsSections.experience}</h2>
      {m.experience.map((s) => (
        <section key={`${s.id}-${s.n}`} className={styles.job}>
          <h3>
            {s.role[locale]}, {companyLine(s)}
          </h3>
          <p className={styles.meta}>
            {formatRange(s.start, s.end, locale)} | {s.city[locale]}
          </p>
          <ul>
            {s.bullets[locale].map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          {s.note ? <p>{s.note[locale]}</p> : null}
        </section>
      ))}

      <h2>{t.atsSections.projects}</h2>
      {cv.projects.map((p) => (
        <section key={p.id} className={styles.job}>
          <h3>{p.name}</h3>
          <p>
            {p.what[locale]} {p.role[locale]}
            {p.stack.length ? ` ${p.stack.join(", ")}.` : ""}
            {p.live ? (
              <>
                {" "}
                <a href={p.live}>{p.live.replace("https://", "")}</a>
              </>
            ) : null}
          </p>
        </section>
      ))}

      <h2>{t.atsSections.skills}</h2>
      {m.skills.map((g) => (
        <p key={g.group}>
          {t.groups[g.group]}: {g.labels.join(", ")}
        </p>
      ))}

      <h2>{t.atsSections.education}</h2>
      {cv.education.map((e) => (
        <p key={e.degree.en}>
          {e.degree[locale]}, {e.school}, {e.place[locale]} | {formatRange(e.start, e.end, locale)}
        </p>
      ))}

      <h2>{t.atsSections.certifications}</h2>
      <p>{cv.certifications[locale].join("; ")}</p>

      <h2>{t.atsSections.languages}</h2>
      <p>{cv.languages[locale].join("; ")}</p>

      <h2>{t.atsSections.award}</h2>
      <p>{cv.award[locale]}</p>
    </main>
  );
}
