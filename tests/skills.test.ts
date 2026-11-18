import { describe, expect, it } from "vitest";
import { SKILLS, type SkillId } from "@/content/skills";
import { skillYearsFor, skillsByGroup } from "@/lib/skills";

const today = new Date("2026-11-18T12:00:00Z");

describe("skillYearsFor", () => {
  const cases: [SkillId, number | null][] = [
    ["javascript", 13], ["typescript", 13], ["java", 15], ["react", 13], ["nextjs", 10], ["tailwind", 9],
    ["redux", 11], ["php", 2], ["dotnet", 3], ["sqlserver", 4], ["oracle", 4], ["db2", 2], ["redis", 4],
    ["posthog", 4], ["claude", null],
  ];
  it.each(cases)("%s → %s", (id, years) => {
    expect(skillYearsFor(id, today)).toBe(years);
  });
});

describe("SKILLS", () => {
  it("drops the removed skills", () => {
    for (const id of ["aws-lambda", "aws-step-functions", "azure-devops"]) expect(id in SKILLS).toBe(false);
  });
  it("uses the agreed labels", () => {
    expect(SKILLS.dotnet.label).toBe(".NET Core");
    expect(SKILLS.gcp.label).toBe("Google Cloud (GCP)");
    expect(SKILLS["ai-agents"].label).toBe("AI Coding Agents");
  });
});

describe("skillsByGroup", () => {
  const groups = skillsByGroup(today);
  it("has the eight groups in order, none empty", () => {
    expect(groups.map((g) => g.group)).toEqual([
      "languages", "frontend", "backend", "data", "cloud", "versioning", "analytics", "ai",
    ]);
    for (const g of groups) expect(g.items.length, g.group).toBeGreaterThan(0);
  });
  it("gives AI items no year count", () => {
    for (const i of groups.find((g) => g.group === "ai")!.items) expect(i.years).toBeNull();
  });
  it("sorts by years, most first", () => {
    for (const g of groups) {
      const ys = g.items.map((i) => i.years ?? 0);
      expect(ys).toEqual([...ys].sort((a, b) => b - a));
    }
  });
});
