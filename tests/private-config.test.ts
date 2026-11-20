import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { codeFingerprint, hashCode } from "@/lib/private/code";
import { privateConfig } from "@/lib/private/config";
import { privatePdfName, readPrivatePdf } from "@/lib/private/files";

const STEPS = readFileSync("tests/fixtures/private/steps.json", "utf8");
const HASH = hashCode("test-brick-code-four");
const SECRET = "x".repeat(40);
const env = (over: Record<string, string | undefined> = {}) =>
  ({ PRIVATE_STEPS_JSON: STEPS, PRIVATE_CODE_HASH: HASH, UNLOCK_SECRET: SECRET, ...over }) as unknown as NodeJS.ProcessEnv;

describe("privateConfig", () => {
  it("reads a valid env", () => {
    const cfg = privateConfig(env());
    expect(cfg?.steps[0].company).toBe("Acme Test Co");
    expect(cfg?.v).toBe(codeFingerprint(HASH));
    expect(cfg?.secret).toBe(SECRET);
  });

  it.each(["PRIVATE_STEPS_JSON", "PRIVATE_CODE_HASH", "UNLOCK_SECRET"])("is null without %s", (k) => {
    expect(privateConfig(env({ [k]: undefined }))).toBeNull();
  });

  it("is null for broken JSON, a bad step or a short secret, and never throws", () => {
    expect(privateConfig(env({ PRIVATE_STEPS_JSON: "{not json" }))).toBeNull();
    expect(privateConfig(env({ PRIVATE_STEPS_JSON: JSON.stringify({ steps: "nope" }) }))).toBeNull();
    const bad = JSON.parse(STEPS);
    delete bad.steps[0].company;
    expect(privateConfig(env({ PRIVATE_STEPS_JSON: JSON.stringify(bad) }))).toBeNull();
    expect(privateConfig(env({ UNLOCK_SECRET: "short" }))).toBeNull();
  });
});

describe("private PDFs", () => {
  it("names the files", () => {
    expect(privatePdfName("pt", "ats")).toBe("CV-ATS-PT.pdf");
    expect(privatePdfName("en", "designed")).toBe("CV-EN.pdf");
  });

  it("reads from PRIVATE_FILES_DIR and refuses odd names or missing files", async () => {
    const dir = mkdtempSync(path.join(tmpdir(), "cvp-"));
    writeFileSync(path.join(dir, "CV-EN.pdf"), "%PDF-test");
    const bytes = await readPrivatePdf("CV-EN.pdf", { PRIVATE_FILES_DIR: dir } as unknown as NodeJS.ProcessEnv);
    expect(Buffer.from(bytes!).toString()).toBe("%PDF-test");
    expect(await readPrivatePdf("../x.pdf", { PRIVATE_FILES_DIR: dir } as unknown as NodeJS.ProcessEnv)).toBeNull();
    expect(await readPrivatePdf("CV-ES.pdf", { PRIVATE_FILES_DIR: dir } as unknown as NodeJS.ProcessEnv)).toBeNull();
  });
});
