import type { End, YearMonth } from "@/lib/dates";
import type { SkillId } from "@/content/skills";

export const LOCALES = ["en", "pt", "es"] as const;
export type Locale = (typeof LOCALES)[number];

/** One value per language. A missing language fails the type check. */
export type L<T = string> = Record<Locale, T>;

export type BrickColor = "red" | "yellow" | "blue" | "black" | "grey";

export const BRICK_HEX: Record<BrickColor, string> = {
  red: "#D0021B",
  yellow: "#F7D117",
  blue: "#0057B8",
  black: "#2B2B2B",
  grey: "#D9D9D6",
};

export type SkillGroup = "languages" | "frontend" | "backend" | "data" | "cloud" | "ai";

export interface Step {
  n: number;
  id: string;
  company: string;
  companyUrl?: string;
  /** Product built at this step, e.g. Finove. */
  product?: string;
  /** Client the work was for, e.g. Deutsche Bank. */
  client?: string;
  role: L;
  start: YearMonth;
  end: End;
  city: L;
  brick: BrickColor;
  bullets: L<string[]>;
  uses: SkillId[];
  note?: L;
}

export interface Project {
  id: string;
  name: string;
  size: "lg" | "md" | "sm";
  what: L;
  role: L;
  stack: string[];
  uses: SkillId[];
  live?: string;
  repo?: string;
  shot?: string;
  status: "live" | "story" | "wip";
}

export interface Education {
  degree: L;
  school: string;
  place: L;
  start: YearMonth;
  end: YearMonth;
}

export interface Cv {
  name: string;
  /** `{years}` is replaced with yearsOfExperience() at render time. */
  summary: L;
  steps: Step[];
  projects: Project[];
  education: Education[];
  certifications: L<string[]>;
  languages: L<string[]>;
  award: L;
}
