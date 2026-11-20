// npm run private:publish
// 1. Builds the six private PDFs (npm run pdf:private, with its 2-page and private-step checks).
// 2. Uploads them to the private Vercel Blob store at fixed paths, overwriting the old ones.
// 3. Prints the command that updates PRIVATE_STEPS_JSON from content/private.local.json.
// Needs BLOB_READ_WRITE_TOKEN (vercel env pull .env.local, then export it). Never prints private data.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { put } from "@vercel/blob";
import { LOCALES } from "../content/types";

export function uploadPlan(dir = "private"): { file: string; pathname: string }[] {
  return LOCALES.flatMap((l) =>
    (["", "ATS-"] as const).map((ats) => {
      const lang = l.toUpperCase();
      const file = path.join(dir, `Wellmmer-Lucas-CV-PRIVATE-${ats}${lang}.pdf`);
      if (!existsSync(file)) throw new Error(`missing ${file}: run npm run pdf:private first (CV-${ats}${lang})`);
      return { file, pathname: `private-cv/CV-${ats}${lang}.pdf` };
    }),
  );
}

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not set. Run `vercel env pull .env.local` and export it, then try again.");
  }
  execFileSync("npm", ["run", "pdf:private"], { stdio: "inherit" });
  for (const { file, pathname } of uploadPlan()) {
    await put(pathname, readFileSync(file), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/pdf",
    });
    console.log(`uploaded ${pathname}`);
  }
  console.log(
    "\nNow update the step data (Production) and redeploy:\n\n" +
      "  vercel env rm PRIVATE_STEPS_JSON production --yes\n" +
      "  node -e 'process.stdout.write(JSON.stringify(require(\"./content/private.local.json\")))' | vercel env add PRIVATE_STEPS_JSON production --sensitive\n",
  );
}

if (process.argv[1]?.endsWith("private-publish.ts")) {
  main().catch((e: unknown) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  });
}
