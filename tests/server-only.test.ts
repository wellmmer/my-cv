import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("server-only modules", () => {
  it.each(["config", "files", "session"])("lib/private/%s.ts can never be bundled for the browser", (m) => {
    expect(readFileSync(`lib/private/${m}.ts`, "utf8")).toMatch(/^(\/\/.*\n)*import "server-only";/);
  });
});
