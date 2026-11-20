import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";

const CODE = "test-brick-code-four";

async function unlock(page: Page) {
  const res = await page.request.post("/api/private/unlock", { data: { code: CODE } });
  expect(res.status()).toBe(204);
}

test("fresh browser sees no private mode", async ({ page }) => {
  await page.goto("/en", { waitUntil: "networkidle" });
  await expect(page.locator("#step-10")).toBeVisible();
  await expect(page.locator("#step-11")).toHaveCount(0);
  await expect(page.locator("[data-private-badge]")).toHaveCount(0);
  for (const href of await page.locator("[data-cv-link]").evaluateAll((as) => as.map((a) => a.getAttribute("href")))) {
    expect(href).toMatch(/^\/cv\//);
  }
  expect(await page.locator("body").innerText()).not.toContain("Acme Test Co");
});

test("after unlocking, step 11 shows and downloads switch", async ({ page }) => {
  await unlock(page);
  await page.goto("/en");
  await expect(page.locator("#step-11")).toContainText("Acme Test Co");
  await expect(page.locator("#step-11")).toContainText("Test Brick Engineer");
  const designed = page.locator('[data-cv-link="designed"]');
  await expect(designed).toHaveCount(2);
  for (const href of await designed.evaluateAll((as) => as.map((a) => a.getAttribute("href")))) {
    expect(href).toBe("/api/private/cv?kind=designed&locale=en");
  }
  const ats = await page.locator('[data-cv-link="ats"]').getAttribute("href");
  expect(ats).toBe("/api/private/cv?kind=ats&locale=en");
  const pdf = await page.request.get(ats!);
  expect(pdf.headers()["content-type"]).toBe("application/pdf");
  await page.reload();
  await expect(page.locator("#step-11")).toBeVisible();
});

test("lock removes private mode", async ({ page }) => {
  await unlock(page);
  await page.goto("/en");
  await page.locator("[data-private-badge] button").click();
  await page.waitForLoadState("load");
  await page.waitForTimeout(500);
  await expect(page.locator("#step-11")).toHaveCount(0);
  await expect(page.locator('[data-cv-link="designed"]').first()).toHaveAttribute("href", /^\/cv\//);
});

test("PT page shows step 11 in Portuguese", async ({ page }) => {
  await unlock(page);
  await page.goto("/pt");
  await expect(page.locator("#step-11")).toContainText("Engenheiro de Blocos de Teste");
  await expect(page.locator('[data-cv-link="ats"]')).toHaveAttribute("href", "/api/private/cv?kind=ats&locale=pt");
});

test("build output has no private words", () => {
  const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap((f) => {
      const p = path.join(dir, f);
      return statSync(p).isDirectory() ? (f === "cache" ? [] : walk(p)) : [p];
    });
  const hits = walk(".next").filter((f) => /\.(html|js|json|rsc|txt|body|meta)$/.test(f) && readFileSync(f, "utf8").includes("Acme Test Co"));
  expect(hits).toEqual([]);
});
