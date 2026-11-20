import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("ignore files", () => {
  it("only ignore the root private/ output folder, never lib/private or test fixtures", () => {
    for (const file of [".gitignore", ".vercelignore"]) {
      const lines = readFileSync(file, "utf8").split("\n").map((l) => l.trim());
      for (const l of lines.filter((x) => /(^|\/)private\/$/.test(x))) expect(l, `${file}: ${l}`).toBe("/private/");
    }
  });
});
