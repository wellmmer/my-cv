import { defineConfig } from "@playwright/test";

const PORT = 3100;

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
  },
});
