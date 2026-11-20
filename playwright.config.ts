import { readFileSync } from "node:fs";
import { defineConfig } from "@playwright/test";
import { hashCode } from "./lib/private/code";

const PORT = 3100;

// Fake private data (tests/fixtures/private) so e2e can drive private mode. It is also present
// at build time, which lets the private spec prove the build output never contains it.
const PRIVATE_ENV = {
  PRIVATE_STEPS_JSON: readFileSync("tests/fixtures/private/steps.json", "utf8"),
  PRIVATE_CODE_HASH: hashCode("test-brick-code-four", Buffer.alloc(16, 7)),
  UNLOCK_SECRET: "e2e-only-unlock-secret-0123456789abcdef",
  PRIVATE_FILES_DIR: "tests/fixtures/private",
};

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    // Local runs use the installed Chrome; CI installs Playwright's Chromium.
    channel: process.env.CI ? undefined : "chrome",
  },
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}/en`,
    timeout: 240_000,
    reuseExistingServer: !process.env.CI,
    env: PRIVATE_ENV,
  },
});
