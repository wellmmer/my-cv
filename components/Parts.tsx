import { cv } from "@/content/cv";
import { SKILL_GROUPS, SKILLS, type SkillId } from "@/content/skills";
import type { Locale } from "@/content/types";
import { ui } from "@/content/ui";
import { skillMonths, skillYears } from "@/lib/skills";
import styles from "@/components/Parts.module.css";

export function Parts({ locale, today }: { locale: Locale; today: Date }) {
  const t = ui[locale];
  const months = skillMonths(cv.steps, today);
  const inProjects = new Set(cv.projects.flatMap((p) => p.uses));
  const ids = Object.keys(SKILLS) as SkillId[];
  return (
    <section id="parts" className={styles.section} aria-labelledby="parts-h">
      <h2 id="parts-h">{t.sections.parts}</h2>
      <div className={styles.groups}>
        {SKILL_GROUPS.map((g) => {
          const rows = ids
            .filter((id) => SKILLS[id].group === g && (months.has(id) || inProjects.has(id)))
            .map((id) => ({ id, m: months.get(id) ?? 0 }))
            .sort((a, b) => b.m - a.m);
          if (!rows.length) return null;
          return (
            <div key={g} className={styles.group}>
              <h3>{t.groups[g]}</h3>
              <ul>
                {rows.map(({ id, m }) => {
                  const y = m ? skillYears(m) : 0;
                  return (
                    <li key={id}>
                      <span>{SKILLS[id].label}</span>
                      <span className={styles.count}>
                        {m ? `${y} ${t.years[y === 1 ? 0 : 1]}` : t.inProjects}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
