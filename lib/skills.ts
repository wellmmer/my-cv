import { SKILL_GROUPS, SKILLS, type SkillId } from "@/content/skills";
import type { SkillGroup } from "@/content/types";

type Entry = { since?: number; years?: number };

/** Years of use: the fixed count, or years since the first year; null for AI items. */
export function skillYearsFor(id: SkillId, today: Date): number | null {
  const s = SKILLS[id] as Entry;
  if (s.years !== undefined) return s.years;
  if (s.since !== undefined) return today.getFullYear() - s.since;
  return null;
}

/** Every group in display order; inside a group, most years first (stable). */
export function skillsByGroup(today: Date): { group: SkillGroup; items: { id: SkillId; years: number | null }[] }[] {
  const ids = Object.keys(SKILLS) as SkillId[];
  return SKILL_GROUPS.map((group) => ({
    group,
    items: ids
      .filter((id) => SKILLS[id].group === group)
      .map((id) => ({ id, years: skillYearsFor(id, today) }))
      .sort((a, b) => (b.years ?? 0) - (a.years ?? 0)),
  }));
}
