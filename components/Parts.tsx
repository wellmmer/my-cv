import { SKILLS } from "@/content/skills";
import type { Locale } from "@/content/types";
import { ui } from "@/content/ui";
import { skillsByGroup } from "@/lib/skills";
import styles from "@/components/Parts.module.css";

export function Parts({ locale, today }: { locale: Locale; today: Date }) {
  const t = ui[locale];
  return (
    <section id="parts" className={styles.section} aria-labelledby="parts-h">
      <h2 id="parts-h">{t.sections.parts}</h2>
      <div className={styles.groups}>
        {skillsByGroup(today).map(({ group, items }) => (
          <div key={group} className={styles.group}>
            <h3>{t.groups[group]}</h3>
            <ul>
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
          </div>
        ))}
      </div>
    </section>
  );
}
