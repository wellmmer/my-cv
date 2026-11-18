import { expect, test } from "@playwright/test";

function ratio(a: string, b: string) {
  const lum = (c: string) => {
    const [r, g, bl] = c.match(/[\d.]+/g)!.slice(0, 3).map((v) => {
      const s = Number(v) / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

test.describe("review fixes", () => {
  test("sticky tower links are never invisible", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en", { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    const opac = await page.locator('[data-tower="sticky"] a').evaluateAll((as) =>
      as.map((a) => {
        let o = 1;
        for (let e: Element | null = a; e; e = e.parentElement) o *= Number(getComputedStyle(e).opacity);
        return o;
      }),
    );
    expect(opac.length).toBe(10);
    for (const o of opac) expect(o).toBe(1);
  });

  for (const scheme of ["light", "dark"] as const) {
    test(`bullet markers are visible on every step (${scheme})`, async ({ browser }) => {
      const ctx = await browser.newContext({ colorScheme: scheme });
      const page = await ctx.newPage();
      await page.goto("/en");
      const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      const marks = await page.locator("ul[data-bullets] > li").evaluateAll((lis) =>
        lis.map((li) => {
          const m = getComputedStyle(li, "::before");
          return { border: m.borderTopColor, width: parseFloat(m.borderTopWidth) };
        }),
      );
      expect(marks.length).toBeGreaterThan(20);
      for (const m of marks) {
        expect(m.width).toBeGreaterThanOrEqual(2);
        expect(ratio(m.border, bg)).toBeGreaterThanOrEqual(3);
      }
      await ctx.close();
    });
  }

  test("toggle buttons keep a stable name; aria-pressed carries the state", async ({ page }) => {
    await page.goto("/en", { waitUntil: "networkidle" });
    for (const sel of ["[data-theme-toggle]", "[data-avatar]"]) {
      const el = page.locator(sel);
      const before = await el.getAttribute("aria-label");
      await el.click();
      expect(await el.getAttribute("aria-label")).toBe(before);
    }
  });

  test("card hover lift does not transition transform (GSAP owns it)", async ({ page }) => {
    await page.goto("/en");
    const props = await page.locator("#builds li[data-color]").first().evaluate((e) => getComputedStyle(e).transitionProperty);
    expect(props).not.toMatch(/\b(transform|all)\b/);
  });
});
