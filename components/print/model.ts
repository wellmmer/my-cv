import { cv } from "@/content/cv";
import { SKILL_GROUPS, SKILLS, type SkillId } from "@/content/skills";
import type { Locale, SkillGroup, Step } from "@/content/types";
import { skillMonths } from "@/lib/skills";

export interface PrintModel {
  /** Newest first: private steps (if any), then public steps. */
  experience: Step[];
  /** Oldest first, for the tower. */
  tower: Step[];
  skills: { group: SkillGroup; labels: string[] }[];
}

export function printModel(privateSteps: Step[], today: Date): PrintModel {
  const tower = [...cv.steps, ...[...privateSteps].sort((a, b) => a.n - b.n)];
  const months = skillMonths(tower, today);
  const inProjects = new Set(cv.projects.flatMap((p) => p.uses));
  const ids = Object.keys(SKILLS) as SkillId[];
  const skills = SKILL_GROUPS.map((group) => ({
    group,
    labels: ids
      .filter((id) => SKILLS[id].group === group && (months.has(id) || inProjects.has(id)))
      .sort((a, b) => (months.get(b) ?? 0) - (months.get(a) ?? 0))
      .map((id) => SKILLS[id].label),
  })).filter((g) => g.labels.length);
  return { experience: [...tower].reverse(), tower, skills };
}

export const companyLine = (s: Step) =>
  [s.company, s.product, s.client].filter(Boolean).join(" · ");

export type { Locale };
