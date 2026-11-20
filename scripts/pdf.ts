// Prints the CV PDFs from the site's print routes with local Chrome.
//   npm run pdf          -> six public PDFs in public/cv/
//   npm run pdf:private  -> six PDFs (designed + ATS) with private steps in private/ (gitignored)
import { spawn, type ChildProcess } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, unlink } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { PRIVATE_FILE, loadPrivateSteps } from "../content/private";
import { LOCALES } from "../content/types";
import { cvPdfPath } from "../lib/contact";
import { loadTerms } from "./leak-patterns";
import { portInUse, publicPdfProblems } from "./pdf-guard";
import { pdfText } from "./pdf-text";

const PORT = 3999;
const BASE = `http://localhost:${PORT}`;
const isPrivate = process.argv.includes("--private");

let server: ChildProcess | undefined;

function stopServer() {
  try {
    if (server?.pid) process.kill(-server.pid);
  } catch {
    // already gone
  }
}

// Ctrl+C must not leave a server (possibly a private one) running on the port.
for (const sig of ["SIGINT", "SIGTERM"] as const) {
  process.on(sig, () => {
    stopServer();
    process.exit(130);
  });
}

async function waitForServer(url: string, ms: number, child: ChildProcess) {
  let exited: number | null = null;
  child.once("exit", (code) => {
    exited = code ?? 1;
  });
  const until = Date.now() + ms;
  while (Date.now() < until) {
    if (exited !== null) throw new Error(`next dev exited early (code ${exited})`);
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
  const terms = loadTerms();
  let privateCompanies: string[] = [];
  if (isPrivate) {
    // Fails with the loader's message when the file is missing or malformed.
    const steps = await loadPrivateSteps();
    if (!steps.length) throw new Error(`no private steps: set CV_PRIVATE=1 and fill ${PRIVATE_FILE}`);
    privateCompanies = steps.map((s) => s.company);
  } else if (existsSync(PRIVATE_FILE)) {
    // Public PDFs are checked against the private companies too.
    privateCompanies = (await loadPrivateSteps(PRIVATE_FILE)).map((s) => s.company);
  }

  if (await portInUse(PORT)) {
    throw new Error(`port ${PORT} is already in use; stop that server first (it may be a private one)`);
  }

  server = spawn("npx", ["next", "dev", "-p", String(PORT)], {
    env: { ...process.env, CV_PRIVATE: isPrivate ? "1" : "" },
    stdio: "ignore",
    detached: true,
  });

  try {
    await waitForServer(`${BASE}/en/cv/print`, 90_000, server);
    const browser = await chromium.launch({ channel: "chrome" });
    const page = await browser.newPage();
    const jobs = LOCALES.flatMap((locale) =>
      isPrivate
        ? [
            { route: `/${locale}/cv/print`, out: `private/Wellmmer-Lucas-CV-PRIVATE-${locale.toUpperCase()}.pdf` },
            { route: `/${locale}/cv/print/ats`, out: `private/Wellmmer-Lucas-CV-PRIVATE-ATS-${locale.toUpperCase()}.pdf` },
          ]
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
      if (isPrivate) {
        if (!text.includes(privateCompanies[0])) {
          throw new Error(`${job.out} does not contain the private step; is CV_PRIVATE reaching the server?`);
        }
      } else {
        const problems = publicPdfProblems(text, privateCompanies, terms);
        if (problems.length) {
          await unlink(job.out);
          throw new Error(`${job.out} removed: ${problems.join(", ")}`);
        }
      }
      console.log(`${job.out} (${pages} page${pages === 1 ? "" : "s"})`);
    }
    await browser.close();
  } finally {
    stopServer();
  }
}

main().catch((e) => {
  stopServer();
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
