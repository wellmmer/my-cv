import { describe, expect, it } from "vitest";
import { bulletParts, bulletText, pdfBulletsOf } from "@/lib/bullets";
import { cv } from "@/content/cv";
import type { Step } from "@/content/types";

const six = { en: ["a", "b", "c", "d", "e", "f"], pt: ["a", "b", "c", "d", "e", "f"], es: ["a", "b", "c", "d", "e", "f"] };
const base: Step = { ...cv.steps[0], bullets: six };

describe("bullets", () => {
  it("splits a plain bullet", () => {
    expect(bulletParts("x")).toEqual({ text: "x" });
  });
  it("keeps the lead of a bullet object", () => {
    expect(bulletParts({ lead: "A", text: "b" })).toEqual({ lead: "A", text: "b" });
  });
  it("writes a lead as 'Lead: text'", () => {
    expect(bulletText({ lead: "A", text: "b" })).toBe("A: b");
    expect(bulletText("x")).toBe("x");
  });
  it("limits PDF bullets to pdfBullets", () => {
    expect(pdfBulletsOf({ ...base, pdfBullets: 4 }, "en")).toHaveLength(4);
    expect(pdfBulletsOf(base, "en")).toHaveLength(6);
  });
});
