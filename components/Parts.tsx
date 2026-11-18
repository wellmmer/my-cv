import { SnapIn } from "@/components/SnapIn";
import { BrickCard } from "@/components/brick/BrickCard";
import { SKILLS } from "@/content/skills";
import type { BrickColor, Locale, SkillGroup } from "@/content/types";
import { ui } from "@/content/ui";
import { skillsByGroup } from "@/lib/skills";
import styles from "@/components/Parts.module.css";

/** Eight groups, six brick colours: two repeats, never side by side. */
const GROUP_COLOR: Record<SkillGroup, BrickColor> = {
  languages: "red",
  frontend: "blue",
  backend: "yellow",
  data: "black",
  cloud: "grey",
  versioning: "green",
  analytics: "red",
  ai: "blue",
};

export function Parts({ locale, today }: { locale: Locale; today: Date }) {
  const t = ui[locale];
  return (
    <section id="parts" className={styles.section} aria-labelledby="parts-h">
      <h2 id="parts-h">{t.sections.parts}</h2>
      <div className={styles.groups}>
        {skillsByGroup(today).map(({ group, items }) => (
          <BrickCard key={group} color={GROUP_COLOR[group]} className={styles.group} studs={5}>
            <h3>{t.groups[group]}</h3>
            <ul data-group={group} className={group === "ai" ? styles.chips : styles.rows}>
              {items.map(({ id, years }) => (
                <li key={id}>
                  <span>{SKILLS[id].label}</span>
                  {years !== null ? (
                    <span className={styles.count}>
                      {years} {t.years[years === 1 ? 0 : 1]}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </BrickCard>
        ))}
      </div>
      <SnapIn />
    </section>
  );
}
