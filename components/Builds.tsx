import { SnapIn } from "@/components/SnapIn";
import Image from "next/image";
import { cv } from "@/content/cv";
import { BrickCard } from "@/components/brick/BrickCard";
import { Icon } from "@/components/icons";
import type { BrickColor, Locale, Project } from "@/content/types";
import { ui } from "@/content/ui";
import styles from "@/components/Builds.module.css";

const COLOR: Record<string, BrickColor> = {
  computable: "blue",
  campeonato: "green",
  tippou: "red",
  megasenha: "yellow",
  "chimpcode-office": "black",
};

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
            <BrickCard key={p.id} as="li" color={COLOR[p.id] ?? "white"} className={`${styles.box} ${styles[p.size]}`} studs={p.size === "sm" ? 4 : 8}>
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
                {p.stack.length ? (
                  <ul className={styles.stack}>
                    {p.stack.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                ) : null}
                {p.live || p.repo ? (
                  <p className={styles.links}>
                    {p.live ? (
                      <a href={p.live} target="_blank" rel="noopener noreferrer">
                        <Icon name="live" size={17} />
                        {t.links.live}
                      </a>
                    ) : null}
                    {p.repo ? (
                      <a href={p.repo} target="_blank" rel="noopener noreferrer">
                        <Icon name="code" size={17} />
                        {t.links.code}
                      </a>
                    ) : null}
                  </p>
                ) : null}
              </div>
            </BrickCard>
          );
        })}
      </ul>
      <SnapIn />
    </section>
  );
}
