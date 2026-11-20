import { expect, test } from "@playwright/test";

test.describe("steps", () => {
  test("no uppercase step kicker", async ({ page }) => {
    await page.goto("/en");
    const kickers = await page
      .locator("article[data-step] *")
      .evaluateAll(
        (els) =>
          els.filter(
            (e) =>
              /^STEP \d+$/i.test(e.textContent?.trim() ?? "") ||
              getComputedStyle(e).textTransform === "uppercase",
          ).length,
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
    for (const a of await page.locator("header nav a").all())
      await expect(a.locator("svg")).toHaveCount(1);
    for (const a of await page.locator("header [hreflang]").all())
      await expect(a.locator("svg")).toHaveCount(1);
  });
});

test("on a phone the visit icon sits on the line of the name's last word", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/en");
  for (let width = 320; width <= 560; width += 4) {
    await page.setViewportSize({ width, height: 844 });
    const off = await page.evaluate(() =>
      [...document.querySelectorAll("article[id^=step-] h3 a")].map((a) => {
        const range = document.createRange();
        range.selectNodeContents(a.parentElement!.firstChild!);
        const rects = [...range.getClientRects()];
        const word = rects[rects.length - 1];
        const ic = a.getBoundingClientRect();
        return Math.abs(word.top + word.height / 2 - (ic.top + ic.height / 2));
      }),
    );
    expect(off.length).toBeGreaterThan(0);
    for (const d of off) expect(d, `at ${width}px`).toBeLessThan(8);
  }
});
