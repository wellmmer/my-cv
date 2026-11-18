import { expect, test, type Page } from "@playwright/test";

const bg = (page: Page) => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
const DARK = "rgb(22, 25, 30)";
const toggle = (page: Page) => page.locator("[data-theme-toggle]");

/** WCAG contrast ratio of two computed rgb() strings. */
function ratio(a: string, b: string) {
  const lum = (c: string) => {
    const [r, g, bl] = c.match(/\d+/g)!.slice(0, 3).map((v) => {
      const s = Number(v) / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

test.describe("theme", () => {
  test("follows a dark system setting when nothing is stored", async ({ browser }) => {
    const ctx = await browser.newContext({ colorScheme: "dark" });
    const page = await ctx.newPage();
    await page.goto("/en");
    expect(await bg(page)).toBe(DARK);
    await ctx.close();
  });

  test("toggle flips the theme and remembers it", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/en", { waitUntil: "networkidle" });
    const light = await bg(page);
    expect(light).not.toBe(DARK);
    await expect(toggle(page)).toHaveAttribute("aria-pressed", "false");
    await toggle(page).click();
    expect(await bg(page)).toBe(DARK);
    await expect(toggle(page)).toHaveAttribute("aria-pressed", "true");
    await page.reload({ waitUntil: "networkidle" });
    expect(await bg(page)).toBe(DARK);
  });

  test("ignores a junk stored value", async ({ browser }) => {
    const ctx = await browser.newContext({ colorScheme: "dark" });
    await ctx.addInitScript(() => localStorage.setItem("theme", "purple"));
    const page = await ctx.newPage();
    await page.goto("/en");
    expect(await bg(page)).toBe(DARK);
    await ctx.close();
  });

  test("works when storage throws", async ({ browser }) => {
    const ctx = await browser.newContext({ colorScheme: "light" });
    await ctx.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        get() {
          throw new Error("blocked");
        },
      });
    });
    const page = await ctx.newPage();
    await page.goto("/en", { waitUntil: "networkidle" });
    await toggle(page).click();
    expect(await bg(page)).toBe(DARK);
    await ctx.close();
  });

  for (const scheme of ["light", "dark"] as const) {
    test(`body text contrast is AA in ${scheme}`, async ({ browser }) => {
      const ctx = await browser.newContext({ colorScheme: scheme });
      const page = await ctx.newPage();
      await page.goto("/en");
      const [fg, back] = await page.evaluate(() => [
        getComputedStyle(document.body).color,
        getComputedStyle(document.body).backgroundColor,
      ]);
      expect(ratio(fg, back)).toBeGreaterThanOrEqual(4.5);
      await ctx.close();
    });
  }
});
