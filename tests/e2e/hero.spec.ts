import { expect, test } from "@playwright/test";
import { ui } from "@/content/ui";

test.describe("hero", () => {
  test("has no giant step numeral and shows the title line", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("[data-hero-numeral]")).toHaveCount(0);
    await expect(page.locator("h1")).toHaveText("Wellmmer Lucas");
    await expect(page.locator("[data-hero-title]")).toHaveText(ui.en.title);
  });

  test("avatar flips to the photo by click and keyboard", async ({ page }) => {
    await page.goto("/en", { waitUntil: "networkidle" });
    const avatar = page.locator("[data-avatar]");
    await expect(avatar).toHaveAttribute("aria-pressed", "false");
    await avatar.click();
    await expect(avatar).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator('img[alt="Wellmmer Lucas"]')).toBeVisible();
    await avatar.focus();
    await page.keyboard.press("Enter");
    await expect(avatar).toHaveAttribute("aria-pressed", "false");
    await page.keyboard.press("Space");
    await expect(avatar).toHaveAttribute("aria-pressed", "true");
  });

  test("copy sits beside the tower at 1090px, no blank column", async ({ page }) => {
    await page.setViewportSize({ width: 1090, height: 800 });
    await page.goto("/en");
    const copy = await page.locator("[data-hero-copy]").boundingBox();
    const tower = await page.locator("[data-hero-build]").boundingBox();
    expect(copy && tower).toBeTruthy();
    expect(copy!.x).toBeLessThan(80);
    expect(tower!.x).toBeGreaterThan(copy!.x + copy!.width - 10);
    expect(tower!.x + tower!.width).toBeLessThanOrEqual(1090);
    expect(Math.abs(copy!.y - tower!.y)).toBeLessThan(300);
  });

  test("a tower label takes you to its step, below the top bar", async ({ page }) => {
    await page.goto("/en", { waitUntil: "networkidle" });
    await page.locator('[data-hero-build] a[href="#step-3"]').click();
    await expect(page).toHaveURL(/#step-3$/);
    await page.waitForTimeout(900);
    const bar = await page.locator("header").first().boundingBox();
    const head = await page.locator("#step-3 h3").boundingBox();
    const vh = page.viewportSize()!.height;
    expect(head!.y).toBeGreaterThanOrEqual(bar!.y + bar!.height - 2);
    expect(head!.y).toBeLessThan(vh * 0.5);
  });
});

test("the hero summary does not repeat the title line", async ({ page }) => {
  await page.goto("/en");
  const text = await page.locator("[data-hero-copy] p").nth(1).textContent();
  expect(text?.startsWith("Senior Software Engineer")).toBe(false);
});

test("the year strip is ten bricks in their step colours, with studs", async ({ page }) => {
  await page.goto("/en");
  const links = page.locator("[data-strip] a");
  await expect(links).toHaveCount(10);
  const colors = await links.evaluateAll((as) => as.map((a) => a.getAttribute("data-color")));
  expect(colors).toEqual(["blue", "yellow", "black", "grey", "red", "blue", "yellow", "black", "blue", "red"]);
  for (const a of await links.all()) await expect(a.locator("svg")).toHaveCount(1);
});

test("the current year brick is not clipped and has no outline", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en");
  const strip = page.locator("[data-strip]");
  const last = page.locator("[data-strip] a").last();
  expect(await last.evaluate((a) => getComputedStyle(a).outlineStyle)).toBe("none");
  await expect(last).toHaveAttribute("aria-current", "step");
  const s = (await strip.boundingBox())!;
  const l = (await last.boundingBox())!;
  expect(l.x + l.width).toBeLessThanOrEqual(s.x + s.width);
});
