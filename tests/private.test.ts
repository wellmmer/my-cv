import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { loadPrivateSteps } from "@/content/private";

const EXAMPLE = "content/private.example.json";

afterEach(() => {
  delete process.env.CV_PRIVATE;
});

describe("loadPrivateSteps", () => {
  it("returns nothing when CV_PRIVATE is unset", async () => {
    expect(await loadPrivateSteps()).toEqual([]);
  });

  it("loads and validates the example file", async () => {
    const steps = await loadPrivateSteps(EXAMPLE);
    expect(steps[0].company).toBe("Example Co");
    expect(steps[0].n).toBe(11);
  });

  it("names the file when it is missing", async () => {
    await expect(loadPrivateSteps("content/nope.json")).rejects.toThrow(/content\/nope\.json is missing/);
  });

  it("names the bad field", async () => {
    const data = JSON.parse(await readFile(EXAMPLE, "utf8"));
    data.steps[0].role = "x";
    const dir = await mkdtemp(path.join(tmpdir(), "cv-"));
    const file = path.join(dir, "bad.json");
    await writeFile(file, JSON.stringify(data));
    await expect(loadPrivateSteps(file)).rejects.toThrow(/steps\[0\]\.role is invalid/);
  });

  it("rejects a file that is not JSON", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "cv-"));
    const file = path.join(dir, "bad.json");
    await writeFile(file, "{ nope");
    await expect(loadPrivateSteps(file)).rejects.toThrow(/is not valid JSON/);
  });
});
