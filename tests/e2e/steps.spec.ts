import { expect, test } from "@playwright/test";

test.describe("steps", () => {
  test("no uppercase step kicker", async ({ page }) => {
    await page.goto("/en");
    const kickers = await page.locator("article[data-step] *").evaluateAll((els) =>
      els.filter((e) => /^STEP \d+$/i.test(e.textContent?.trim() ?? "") || getComputedStyle(e).textTransform === "uppercase").length,
    );
    expect(kickers).toBe(0);
  });

  test("every step has range and duration badges", async ({ page }) => {
    await page.goto("/en");
    for (const a of await page.locator("article[data-step]").all()) {
      await expect(a.locator('[data-badge="range"]')).toHaveCount(1);
      await expect(a.locator('[data-badge="duration"]')).toHaveCount(1);
    }
  });

  test("CIAL shows via RyeLabs and six bold-lead bullets", async ({ page }) => {
    await page.goto("/en");
    const cial = page.locator('article[data-step="10"]');
    await expect(cial).toContainText("via RyeLabs");
    await expect(cial.locator("ul[data-bullets] > li")).toHaveCount(6);
    await expect(cial.locator("ul[data-bullets] > li > b")).toHaveCount(6);
  });

  test("nav links and language links carry icons", async ({ page }) => {
    await page.goto("/en");
    for (const a of await page.locator("header nav a").all()) await expect(a.locator("svg")).toHaveCount(1);
    for (const a of await page.locator("header [hreflang]").all()) await expect(a.locator("svg")).toHaveCount(1);
  });
});
