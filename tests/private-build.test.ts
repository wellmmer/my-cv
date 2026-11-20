import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { cv } from "@/content/cv";
import type { Step } from "@/content/types";
import { mainParts } from "@/lib/parts";
import { hashCode } from "@/lib/private/code";
import { privateConfig } from "@/lib/private/config";
import { stepsForToken } from "@/lib/private/session";
import { signToken } from "@/lib/private/token";

const STEPS = readFileSync("tests/fixtures/private/steps.json", "utf8");
const cfg = privateConfig({
  PRIVATE_STEPS_JSON: STEPS,
  PRIVATE_CODE_HASH: hashCode("test-brick-code-four"),
  UNLOCK_SECRET: "x".repeat(40),
} as unknown as NodeJS.ProcessEnv)!;
const NOW = 1_800_000_000_000;

describe("private build: which steps a cookie gets", () => {
  it("a valid cookie gets the private steps", () => {
    const token = signToken({ exp: NOW + 60_000, v: cfg.v }, cfg.secret);
    expect(stepsForToken(token, cfg, NOW).map((s) => s.company)).toEqual(["Acme Test Co"]);
  });

  it("no, forged, expired or old-code cookies get none", () => {
    expect(stepsForToken(undefined, cfg, NOW)).toEqual([]);
    expect(stepsForToken("forged.token", cfg, NOW)).toEqual([]);
    expect(stepsForToken(signToken({ exp: NOW + 60_000, v: cfg.v }, "y".repeat(40)), cfg, NOW)).toEqual([]);
    expect(stepsForToken(signToken({ exp: NOW - 1, v: cfg.v }, cfg.secret), cfg, NOW)).toEqual([]);
    expect(stepsForToken(signToken({ exp: NOW + 60_000, v: "old" }, cfg.secret), cfg, NOW)).toEqual([]);
  });

  it("with private mode switched off, nobody gets any", () => {
    const token = signToken({ exp: NOW + 60_000, v: cfg.v }, cfg.secret);
    expect(stepsForToken(token, null, NOW)).toEqual([]);
  });
});

describe("main parts count the whole build", () => {
  it("adds the private steps' parts when they are passed in", () => {
    const extra = JSON.parse(STEPS).steps as Step[];
    const pub = mainParts();
    const all = mainParts([...cv.steps, ...extra]);
    for (const p of all) {
      const before = pub.find((q) => q.id === p.id)!.count;
      expect(p.count).toBe(before + (extra[0].uses.includes(p.id) ? 1 : 0));
    }
  });
});
