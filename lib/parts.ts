import { cv } from "@/content/cv";
import { SKILLS } from "@/content/skills";
import type { SkillId } from "@/content/skills";

/** The parts that carry the whole build: core stack, web, mobile, cloud and data. */
const MAIN: SkillId[] = ["javascript", "typescript", "react", "nodejs", "aws", "nextjs", "postgresql", "react-native"];

/** Main parts of all steps, each with how many steps used it. */
export function mainParts(): { id: SkillId; label: string; count: number }[] {
  return MAIN.map((id) => ({
    id,
    label: SKILLS[id].label,
    count: cv.steps.filter((s) => s.uses.includes(id)).length,
  }));
}
