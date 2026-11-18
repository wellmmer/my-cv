import { expect, test } from "@playwright/test";
import { LOCALES } from "@/content/types";
import { cvPdfPath } from "@/lib/contact";
import { findLeaks } from "../../scripts/leak-patterns";

const towerOpacities = (page: import("@playwright/test").Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('[data-tower="sticky"] g[data-step]')].map((g) => getComputedStyle(g).opacity),
  );

for (const locale of LOCALES) {
  test.describe(`/${locale}`, () => {
    test("renders the CV page", async ({ page }) => {
      const res = await page.goto(`/${locale}`);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText("Wellmmer Lucas");
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("link[rel=alternate][hreflang]")).toHaveCount(4);
      await expect(page.locator("article[data-step]")).toHaveCount(10);
    });

    test("links both PDFs and they are served", async ({ page, request }) => {
      await page.goto(`/${locale}`);
      for (const kind of ["designed", "ats"] as const) {
        const href = cvPdfPath(locale, kind);
        await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible();
        const res = await request.get(href);
        expect(res.status()).toBe(200);
        expect(res.headers()["content-type"]).toContain("application/pdf");
      }
    });

    test("pre-fills WhatsApp", async ({ page }) => {
      await page.goto(`/${locale}`);
      const href = await page.locator('a[href^="https://wa.me/"]').first().getAttribute("href");
      expect(href).toMatch(/^https:\/\/wa\.me\/5511987420114\?text=/);
    });

    test("no horizontal scroll at 320px", async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 700 });
      await page.goto(`/${locale}`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
    });

    test("no private words in the page", async ({ page }) => {
      await page.goto(`/${locale}`);
      expect(findLeaks(await page.content())).toEqual([]);
    });
  });
}

test("redirects / by Accept-Language", async ({ browser }) => {
  const pt = await browser.newContext({ locale: "pt-BR", extraHTTPHeaders: { "Accept-Language": "pt-BR,pt;q=0.9" } });
  const p1 = await pt.newPage();
  await p1.goto("/");
  expect(new URL(p1.url()).pathname).toBe("/pt");
  const none = await browser.newContext({ extraHTTPHeaders: { "Accept-Language": "" } });
  const p2 = await none.newPage();
  await p2.goto("/");
  expect(new URL(p2.url()).pathname).toBe("/en");
});

test("full tower without JS", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto("/en");
  const ops = await towerOpacities(page);
  expect(ops).toHaveLength(10);
  expect(ops.every((o) => o === "1")).toBe(true);
});

test("full tower with reduced motion", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto("/en");
  await page.locator("#steps").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const ops = await towerOpacities(page);
  expect(ops).toHaveLength(10);
  expect(ops.every((o) => o === "1")).toBe(true);
});

test("language switch keeps the section", async ({ page }) => {
  await page.goto("/en#builds", { waitUntil: "networkidle" }); // hydrated
  // dispatchEvent: a real click does not scroll; Playwright's click would scroll the page first.
  await page.locator('ul[aria-label] a[hreflang="pt"]').dispatchEvent("click");
  await page.waitForURL(/\/pt#builds$/);
  expect(new URL(page.url()).hash).toBe("#builds");
});

test("language switch keeps the section in view after scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en#steps", { waitUntil: "networkidle" });
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  // dispatchEvent: a real click does not scroll; Playwright's click would scroll the page first.
  await page.locator('ul[aria-label] a[hreflang="pt"]').dispatchEvent("click");
  await page.waitForURL(/\/pt#contact$/);
  await page.goto("/en", { waitUntil: "networkidle" });
  await page.locator("#builds").evaluate((el) => el.scrollIntoView({ block: "start", behavior: "instant" }));
  await page.waitForTimeout(200);
  await page.locator('ul[aria-label] a[hreflang="es"]').dispatchEvent("click");
  await page.waitForURL(/\/es#builds$/);
});
