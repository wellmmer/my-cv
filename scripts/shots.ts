// Captures a screenshot of every live project into public/shots/<id>.png.
import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { cv } from "../content/cv";

async function main() {
  await mkdir("public/shots", { recursive: true });
  const browser = await chromium.launch({ channel: "chrome" });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  for (const p of cv.projects) {
    if (!p.live || !p.shot) continue;
    await page.goto(p.live, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `public${p.shot}` });
    console.log(`saved public${p.shot}`);
  }
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
