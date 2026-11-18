// Prints the CV PDFs from the site's print routes with local Chrome.
//   npm run pdf          -> six public PDFs in public/cv/
//   npm run pdf:private  -> three designed PDFs with private steps in private/ (gitignored)
import { spawn, type ChildProcess } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { loadPrivateSteps } from "../content/private";
import { LOCALES } from "../content/types";
import { cvPdfPath } from "../lib/contact";
import { pdfText } from "./pdf-text";

const PORT = 3999;
const BASE = `http://localhost:${PORT}`;
const isPrivate = process.argv.includes("--private");

async function waitForServer(url: string, ms: number) {
  const until = Date.now() + ms;
  while (Date.now() < until) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`server did not answer at ${url} within ${ms / 1000} s`);
}

async function main() {
  let privateCompany: string | undefined;
  if (isPrivate) {
    // Fails with the loader's message when the file is missing or malformed.
    const steps = await loadPrivateSteps();
    if (!steps.length) throw new Error("no private steps: set CV_PRIVATE=1 and fill content/private.local.json");
    privateCompany = steps[0].company;
  }

  const server: ChildProcess = spawn("npx", ["next", "dev", "-p", String(PORT)], {
    env: { ...process.env, CV_PRIVATE: isPrivate ? "1" : "" },
    stdio: "ignore",
    detached: true,
  });
  const stop = () => {
    try {
      if (server.pid) process.kill(-server.pid);
    } catch {
      // already gone
    }
  };

  try {
    await waitForServer(`${BASE}/en/cv/print`, 90_000);
    const browser = await chromium.launch({ channel: "chrome" });
    const page = await browser.newPage();
    const jobs = LOCALES.flatMap((locale) =>
      isPrivate
        ? [{ route: `/${locale}/cv/print`, out: `private/Wellmmer-Lucas-CV-PRIVATE-${locale.toUpperCase()}.pdf` }]
        : (["designed", "ats"] as const).map((kind) => ({
            route: kind === "ats" ? `/${locale}/cv/print/ats` : `/${locale}/cv/print`,
            out: `public${cvPdfPath(locale, kind)}`,
          })),
    );
    await mkdir(isPrivate ? "private" : "public/cv", { recursive: true });
    for (const job of jobs) {
      await page.goto(`${BASE}${job.route}`, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await page.pdf({ path: job.out, format: "A4", printBackground: true, preferCSSPageSize: true });
      const { pages, text } = await pdfText(job.out);
      if (privateCompany && !text.includes(privateCompany)) {
        throw new Error(`${job.out} does not contain the private step; is CV_PRIVATE reaching the server?`);
      }
      console.log(`${job.out} (${pages} page${pages === 1 ? "" : "s"})`);
    }
    await browser.close();
  } finally {
    stop();
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
