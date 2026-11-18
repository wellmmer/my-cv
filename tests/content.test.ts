import { describe, expect, it } from "vitest";
import { ALLOWED_NUMBERS } from "@/content/allowed-numbers";
import { cv } from "@/content/cv";
import { SKILLS } from "@/content/skills";
import { BRICK_HEX, LOCALES } from "@/content/types";
import { ui } from "@/content/ui";

/** Every piece of free copy where a number could be invented. */
function copy(): string[] {
  const out: string[] = [];
  for (const l of LOCALES) {
    out.push(cv.summary[l], ui[l].contractNote);
    for (const s of cv.steps) {
      out.push(...s.bullets[l]);
      if (s.note) out.push(s.note[l]);
    }
    for (const p of cv.projects) out.push(p.what[l], p.role[l]);
  }
  return out;
}

describe("content", () => {
  it("has 10 public steps numbered 1..10, oldest first", () => {
    expect(cv.steps.map((s) => s.n)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(cv.steps.map((s) => s.id)).toEqual([
      "ipt", "valemobi", "iatec", "gft-1", "tippou", "gft-2", "fyture", "stickchart", "ryelabs", "cial",
    ]);
  });

  it("uses the white-page brick colours in order", () => {
    expect(cv.steps.map((s) => BRICK_HEX[s.brick])).toEqual([
      "#0057B8", "#F7D117", "#2B2B2B", "#D9D9D6", "#D0021B", "#0057B8", "#F7D117", "#2B2B2B", "#0057B8", "#D0021B",
    ]);
  });

  it("gives every step 2 to 4 bullets, the same count in each language", () => {
    for (const s of cv.steps) {
      expect(s.bullets.en.length, s.id).toBeGreaterThanOrEqual(2);
      expect(s.bullets.en.length, s.id).toBeLessThanOrEqual(4);
      expect(s.bullets.pt.length, s.id).toBe(s.bullets.en.length);
      expect(s.bullets.es.length, s.id).toBe(s.bullets.en.length);
    }
  });

  it("uses only confirmed numbers in copy", () => {
    for (const text of copy()) {
      const cleaned = text.replace(/UTC-3|COVID-19/g, "");
      for (const [n] of cleaned.matchAll(/\b\d+\b/g)) {
        expect(ALLOWED_NUMBERS, `"${n}" in: ${text}`).toContain(n);
      }
    }
  });

  it("has well-formed dates, start before end", () => {
    for (const s of cv.steps) {
      expect(s.start).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
      if (s.end !== "now") {
        expect(s.end).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
        expect(s.end >= s.start, s.id).toBe(true);
      }
    }
  });

  it("uses https for every link", () => {
    const urls = [
      ...cv.steps.map((s) => s.companyUrl),
      ...cv.projects.flatMap((p) => [p.live, p.repo]),
    ].filter((u): u is string => Boolean(u));
    for (const u of urls) expect(u).toMatch(/^https:\/\//);
  });

  it("references only known skills", () => {
    for (const id of [...cv.steps, ...cv.projects].flatMap((x) => x.uses)) {
      expect(Object.keys(SKILLS)).toContain(id);
    }
  });

  it("keeps tower labels short", () => {
    for (const s of cv.steps) expect((s.short ?? s.company).length, s.id).toBeLessThanOrEqual(12);
  });

  it("names the key parts of the newest step for the first screen", () => {
    const newest = cv.steps[cv.steps.length - 1];
    expect(newest.keyParts?.length).toBe(6);
    for (const id of newest.keyParts ?? []) expect(newest.uses).toContain(id);
  });

  it("has no empty strings in any language", () => {
    for (const text of copy()) expect(text.trim().length).toBeGreaterThan(0);
  });
});
