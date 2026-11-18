import { describe, expect, it } from "vitest";
import { newParts, skillMonths, skillYears } from "@/lib/skills";

const d = (s: string) => new Date(`${s}T12:00:00Z`);

describe("skillMonths", () => {
  it("counts overlapping months once", () => {
    const m = skillMonths(
      [
        { start: "2020-01", end: "2020-12", uses: ["ts"] },
        { start: "2020-07", end: "2021-06", uses: ["ts", "aws"] },
      ],
      d("2026-11-18"),
    );
    expect(m.get("ts")).toBe(18);
    expect(m.get("aws")).toBe(12);
  });
});

describe("skillYears", () => {
  it("rounds and never shows less than one year", () => {
    expect(skillYears(5)).toBe(1);
    expect(skillYears(31)).toBe(3);
  });
});

describe("newParts", () => {
  it("lists only skills unseen in earlier steps", () => {
    expect(newParts([{ uses: ["a", "b"] }, { uses: ["b", "c"] }])).toEqual([["a", "b"], ["c"]]);
  });
});
