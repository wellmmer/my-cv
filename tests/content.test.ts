import { describe, expect, it } from "vitest";
import { ALLOWED_NUMBERS } from "@/content/allowed-numbers";
import { cv } from "@/content/cv";
import { SKILLS } from "@/content/skills";
import { BRICK_HEX, LOCALES } from "@/content/types";
import { ui } from "@/content/ui";
import { bulletText } from "@/lib/bullets";
import { contractText } from "@/lib/contract";

/** Every piece of free copy where a number could be invented. */
function copy(): string[] {
  const out: string[] = [];
  for (const l of LOCALES) {
    out.push(cv.summary[l], contractText(l));
    for (const s of cv.steps) {
      out.push(...s.bullets[l].map(bulletText));
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

  it("gives every step 2 to 6 bullets, the same count in each language", () => {
    for (const s of cv.steps) {
      expect(s.bullets.en.length, s.id).toBeGreaterThanOrEqual(2);
      expect(s.bullets.en.length, s.id).toBeLessThanOrEqual(6);
      expect(s.bullets.pt.length, s.id).toBe(s.bullets.en.length);
      expect(s.bullets.es.length, s.id).toBe(s.bullets.en.length);
    }
  });

  it("uses only confirmed numbers in copy", () => {
    for (const text of copy()) {
      const cleaned = text.replace(/UTC-3|COVID-19/g, "");
      for (const [n] of cleaned.matchAll(/\b\d+(?:,\d{3})*\b/g)) {
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

  it("lists JavaScript on every step (used in every role since 2013)", () => {
    for (const s of cv.steps) expect(s.uses, s.id).toContain("javascript");
  });

  it("links the companies Wellmmer supplied", () => {
    const url = (id: string) => cv.steps.find((s) => s.id === id)?.companyUrl;
    expect(url("iatec")).toBe("https://www.iatec.com");
    expect(url("ryelabs")).toBe("https://www.ryelabs.co");
  });

  it("references only known skills", () => {
    for (const id of [...cv.steps, ...cv.projects].flatMap((x) => x.uses)) {
      expect(Object.keys(SKILLS)).toContain(id);
    }
  });

  it("keeps tower labels short", () => {
    for (const s of cv.steps) expect((s.short ?? s.company).length, s.id).toBeLessThanOrEqual(12);
  });

  it("has no empty strings in any language", () => {
    for (const text of copy()) expect(text.trim().length).toBeGreaterThan(0);
  });

  it("opens with the approved summary", () => {
    expect(cv.summary.en).toBe(
      "Senior Software Engineer. I've been snapping JavaScript bricks together since 2013: web, mobile and backend, from React and React Native to Node.js and NestJS. These days AI agents build alongside me. Remote from Sorocaba, Brazil (UTC-3).",
    );
    for (const l of LOCALES) expect(cv.summary[l]).not.toContain("{years}");
  });

  it("uses the agreed title in each language", () => {
    expect(ui.en.title).toBe("Senior Software Engineer");
    expect(ui.pt.title).toBe("Engenheiro de Software Sênior");
    expect(ui.es.title).toBe("Ingeniero de Software Sénior");
  });

  it('writes "backend" and "frontend" as one word', () => {
    const all = JSON.stringify(cv) + JSON.stringify(ui);
    expect(all).not.toMatch(/\b(back|front)[ -]end\b/i);
  });

  it("gives CIAL six named bullets, four in the PDFs, via RyeLabs", () => {
    const cial = cv.steps.find((s) => s.id === "cial")!;
    for (const l of LOCALES) {
      expect(cial.bullets[l]).toHaveLength(6);
      expect(cial.bullets[l].map((b) => (typeof b === "string" ? null : b.lead))).toEqual([
        "CIAL360 Task Hub", "DUNS Doctor", "Pulso", l === "en" ? "AI-first workflow" : expect.any(String),
        "SAT Auth Flow", "Buró Auth Flow",
      ]);
    }
    expect(cial.pdfBullets).toBe(4);
    expect(cial.via).toBe("RyeLabs");
    const doctor = cial.bullets.en[1];
    expect(typeof doctor !== "string" && doctor.text).toContain("hackathon");
    expect(JSON.stringify(cial.bullets)).not.toMatch(/shipped/i);
  });

  it("names the office project ChimpCode Office", () => {
    expect(cv.projects.find((p) => p.id === "chimpcode-office")!.name).toBe("ChimpCode Office");
  });
});
