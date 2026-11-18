import { cv } from "@/content/cv";
import { SKILLS, type SkillId } from "@/content/skills";
import type { Locale, SkillGroup, Step } from "@/content/types";
import { skillsByGroup } from "@/lib/skills";

export interface PrintModel {
  /** Newest first: private steps (if any), then public steps. */
  experience: Step[];
  /** Oldest first, for the tower. */
  tower: Step[];
  skills: { group: SkillGroup; items: { id: SkillId; label: string; years: number | null }[] }[];
}

export function printModel(privateSteps: Step[], today: Date): PrintModel {
  const tower = [...cv.steps, ...[...privateSteps].sort((a, b) => a.n - b.n)];
  const skills = skillsByGroup(today).map((g) => ({
    group: g.group,
    items: g.items.map((i) => ({ ...i, label: SKILLS[i.id].label })),
  }));
  return { experience: [...tower].reverse(), tower, skills };
}

export const companyLine = (s: Step) =>
  [s.company, s.product, s.client].filter(Boolean).join(" · ");

export type { Locale };
