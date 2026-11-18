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

  async function withStep(edit: (s: Record<string, unknown>) => void) {
    const data = JSON.parse(await readFile(EXAMPLE, "utf8"));
    edit(data.steps[0]);
    const dir = await mkdtemp(path.join(tmpdir(), "cv-"));
    const file = path.join(dir, "step.json");
    await writeFile(file, JSON.stringify(data));
    return loadPrivateSteps(file);
  }

  it("accepts plain string bullets and bullets with a lead", async () => {
    const steps = await withStep((s) => {
      s.bullets = { en: ["plain", { lead: "A", text: "b" }], pt: ["x", "y"], es: ["x", "y"] };
    });
    expect(steps[0].bullets.en[1]).toEqual({ lead: "A", text: "b" });
  });

  it("rejects a bullet with empty text", async () => {
    await expect(
      withStep((s) => {
        s.bullets = { en: [{ lead: "A", text: "" }], pt: ["x"], es: ["x"] };
      }),
    ).rejects.toThrow(/steps\[0\]\.bullets is invalid/);
  });

  it("rejects pdfBullets of 0", async () => {
    await expect(withStep((s) => (s.pdfBullets = 0))).rejects.toThrow(/steps\[0\]\.pdfBullets is invalid/);
  });

  it("rejects a file that is not JSON", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "cv-"));
    const file = path.join(dir, "bad.json");
    await writeFile(file, "{ nope");
    await expect(loadPrivateSteps(file)).rejects.toThrow(/is not valid JSON/);
  });
});
