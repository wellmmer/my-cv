import { expect, test, type Page } from "@playwright/test";

const SEL = '#builds [data-color], #parts [data-color], #appendix [data-color], [data-hero-build] g[data-step]';
const opacities = (page: Page) =>
  page.locator(SEL).evaluateAll((els) => els.map((e) => getComputedStyle(e).opacity));
const toBottom = async (page: Page) => {
  for (let y = 0; y < 30; y++) {
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(60);
  }
};

test.describe("motion", () => {
  test("everything is visible without JavaScript", async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto("/en");
    const o = await opacities(page);
    expect(o.length).toBeGreaterThan(20);
    expect(o.every((v) => v === "1")).toBe(true);
    await ctx.close();
  });

  test("everything is visible with reduced motion", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto("/en", { waitUntil: "networkidle" });
    expect((await opacities(page)).every((v) => v === "1")).toBe(true);
    await toBottom(page);
    expect((await opacities(page)).every((v) => v === "1")).toBe(true);
    await ctx.close();
  });

  test("with motion, everything has landed after scrolling through", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en", { waitUntil: "networkidle" });
    await toBottom(page);
    await page.waitForTimeout(1500);
    expect((await opacities(page)).every((v) => v === "1")).toBe(true);
  });

  test("the hero tower builds itself on load", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en");
    await page.waitForSelector("[data-hero-build][data-built]", { timeout: 10_000 });
  });
});
