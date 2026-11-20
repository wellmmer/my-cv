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

test.describe("easter egg", () => {
  async function tapAvatar(page: Page, n: number) {
    const avatar = page.locator("[data-avatar]");
    // The first click proves the page is hydrated (the avatar flips), so no tap is lost.
    await avatar.click();
    await expect(avatar).toHaveAttribute("aria-pressed", "true");
    for (let i = 1; i < n; i++) await avatar.click({ delay: 0 });
  }

  test("20 avatar clicks open the code box", async ({ page }) => {
    await page.goto("/en");
    await tapAvatar(page, 20);
    await expect(page.locator("dialog[open]")).toBeVisible();
    await expect(page.locator("dialog[open] input")).toBeFocused();
  });

  test("19 clicks do not", async ({ page }) => {
    await page.goto("/en");
    await tapAvatar(page, 19);
    await expect(page.locator("dialog[open]")).toHaveCount(0);
  });

  test("wrong code shows the error and keeps the box open", async ({ page }) => {
    await page.goto("/en");
    await tapAvatar(page, 20);
    await page.locator("dialog[open] input").fill("nope");
    await page.locator("dialog[open] button[type=submit]").click();
    await expect(page.locator("dialog[open] [role=alert]")).toHaveText("That piece doesn't fit. Check the code and try again.");
    await expect(page.locator("dialog[open]")).toBeVisible();
  });

  test("closing the box mid-check leaves no stale error on reopen", async ({ page }) => {
    await page.goto("/en");
    await tapAvatar(page, 20);
    await page.locator("dialog[open] input").fill("nope");
    await page.locator("dialog[open] button[type=submit]").click();
    await page.keyboard.press("Escape");
    await expect(page.locator("dialog[open]")).toHaveCount(0);
    await page.waitForTimeout(1500);
    await tapAvatar(page, 20);
    await expect(page.locator("dialog[open]")).toBeVisible();
    await expect(page.locator("dialog[open] [role=alert]")).toHaveText("");
  });

  test("right code unlocks from the box", async ({ page }) => {
    await page.goto("/en");
    await tapAvatar(page, 20);
    await page.locator("dialog[open] input").fill(CODE);
    await page.locator("dialog[open] button[type=submit]").click();
    await expect(page.locator("dialog[open]")).toHaveCount(0);
    await expect(page.locator("#step-11")).toContainText("Acme Test Co");
  });

  test("quick taps on the avatar never zoom the page on phones", async ({ page }) => {
    await page.goto("/en");
    expect(await page.locator("[data-avatar]").evaluate((el) => getComputedStyle(el).touchAction)).toBe("manipulation");
  });

  test("the avatar still flips on one click", async ({ page }) => {
    await page.goto("/en");
    await page.locator("[data-avatar]").click();
    await expect(page.locator("[data-avatar]")).toHaveAttribute("aria-pressed", "true");
  });
});
