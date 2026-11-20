import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { hashCode, verifyCode } from "@/lib/private/code";
import { WORDS } from "@/lib/private/words";
import { newCode } from "@/scripts/private-code";
import { uploadPlan } from "@/scripts/private-publish";

describe("private code generator", () => {
  it("uses the full EFF short list, no duplicates", () => {
    expect(WORDS.length).toBe(1296);
    expect(new Set(WORDS).size).toBe(1296);
  });

  it("joins four words with dashes", () => {
    expect(newCode(() => 0)).toBe([WORDS[0], WORDS[0], WORDS[0], WORDS[0]].join("-"));
  });

  it("makes codes that verify against their own hash", () => {
    const code = newCode();
    expect(verifyCode(code, hashCode(code))).toBe(true);
  });
});

describe("publish plan", () => {
  const NAMES = ["EN", "PT", "ES"].flatMap((l) => [`Wellmmer-Lucas-CV-PRIVATE-${l}.pdf`, `Wellmmer-Lucas-CV-PRIVATE-ATS-${l}.pdf`]);

  it("maps the six private PDFs to fixed Blob paths", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "pub-"));
    for (const n of NAMES) writeFileSync(path.join(dir, n), "%PDF");
    expect(uploadPlan(dir).map((p) => p.pathname).sort()).toEqual(
      ["CV-EN.pdf", "CV-ATS-EN.pdf", "CV-PT.pdf", "CV-ATS-PT.pdf", "CV-ES.pdf", "CV-ATS-ES.pdf"].map((n) => `private-cv/${n}`).sort(),
    );
  });

  it("refuses when a PDF is missing", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "pub-"));
    for (const n of NAMES.filter((n) => !n.includes("ATS-ES"))) writeFileSync(path.join(dir, n), "%PDF");
    expect(() => uploadPlan(dir)).toThrow(/ATS-ES/);
  });
});
