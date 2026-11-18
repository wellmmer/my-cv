import Image from "next/image";
import { cv } from "@/content/cv";
import type { Locale, Project } from "@/content/types";
import { ui } from "@/content/ui";
import styles from "@/components/Builds.module.css";

function statusTag(p: Project, t: (typeof ui)[Locale]): string | null {
  if (p.status === "wip") return t.status.wip;
  if (p.status === "story") return p.live ? null : p.id === "tippou" ? t.status.shutDown : t.status.noLiveLink;
  return null;
}

export function Builds({ locale }: { locale: Locale }) {
  const t = ui[locale];
  return (
    <section id="builds" className={styles.section} aria-labelledby="builds-h">
      <h2 id="builds-h">{t.sections.builds}</h2>
      <ul className={styles.grid}>
        {cv.projects.map((p) => {
          const tag = statusTag(p, t);
          return (
            <li key={p.id} className={`${styles.box} ${styles[p.size]}`}>
              {p.shot ? (
                <div className={styles.shot}>
                  <Image
                    src={p.shot}
                    alt={`${t.screenshotOf} ${p.name}`}
                    width={1280}
                    height={800}
                    sizes="(max-width: 960px) 100vw, 66vw"
                  />
                </div>
              ) : null}
              <div className={styles.body}>
                <div className={styles.title}>
                  <h3>{p.name}</h3>
                  {tag ? <span className={styles.tag}>{tag}</span> : null}
                </div>
                <p>{p.what[locale]}</p>
                <p className={styles.role}>{p.role[locale]}</p>
                {p.stack.length ? <p className={styles.stack}>{p.stack.join(" · ")}</p> : null}
                {p.live || p.repo ? (
                  <p className={styles.links}>
                    {p.live ? (
                      <a href={p.live} target="_blank" rel="noopener noreferrer">
                        {t.links.live}
                      </a>
                    ) : null}
                    {p.repo ? (
                      <a href={p.repo} target="_blank" rel="noopener noreferrer">
                        {t.links.code}
                      </a>
                    ) : null}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
