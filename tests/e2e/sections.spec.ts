import { expect, test } from "@playwright/test";

test.describe("sections", () => {
  test("side builds are brick cards", async ({ page }) => {
    await page.goto("/en");
    expect(await page.locator("#builds li[data-color]").count()).toBe(5);
    await expect(page.locator("#builds")).toContainText("ChimpCode Office");
  });

  test("parts bin: eight coloured groups, years, AI without numbers", async ({ page }) => {
    await page.goto("/en");
    const colors = await page.locator("#parts [data-color]").evaluateAll((els) => els.map((e) => e.getAttribute("data-color")));
    expect(colors).toEqual(["red", "blue", "yellow", "black", "grey", "green", "red", "blue"]);
    await expect(page.locator("#parts li", { hasText: "JavaScript" })).toContainText("13 yrs");
    const ai = await page.locator('#parts [data-group="ai"] li').allTextContents();
    expect(ai.length).toBe(10);
    for (const t of ai) expect(t).not.toMatch(/\d/);
  });

  test("extra pieces: cards, flags, level badges", async ({ page }) => {
    await page.goto("/en");
    expect(await page.locator("#appendix [data-color]").count()).toBeGreaterThanOrEqual(3);
    await expect(page.locator("#appendix [data-languages] svg")).toHaveCount(3);
  });

  test("contact: five icon bricks and the em dash line", async ({ page }) => {
    await page.goto("/en");
    const links = page.locator("#contact [data-variant]");
    await expect(links).toHaveCount(5);
    for (const l of await links.all()) await expect(l.locator("svg").last()).toBeVisible();
    await expect(page.locator("#contact [data-direct]")).toHaveText(/@.+ — \+55/);
  });

  test("contact row fits at 320px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto("/pt");
    const right = await page.locator("#contact [data-variant]").evaluateAll((els) =>
      Math.max(...els.map((e) => e.getBoundingClientRect().right)),
    );
    expect(right).toBeLessThanOrEqual(320);
  });
});
