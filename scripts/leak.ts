// Fails (exit 1) when any tracked or untracked-but-not-ignored file, any file
// in public/, or any built file in .next/ contains a private word.
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { findLeaks } from "./leak-patterns";
import { pdfText } from "./pdf-text";

const SKIP = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".ico", ".woff", ".woff2", ".ttf", ".avif"]);

async function walk(dir: string, skipDir?: (d: string) => boolean): Promise<string[]> {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!skipDir?.(p)) out.push(...(await walk(p, skipDir)));
    } else if (entry.isFile()) out.push(p);
  }
  return out;
}

export async function scanPaths(paths: string[]): Promise<{ path: string; hits: string[] }[]> {
  const results: { path: string; hits: string[] }[] = [];
  for (const p of paths) {
    const ext = path.extname(p).toLowerCase();
    if (SKIP.has(ext) || !existsSync(p)) continue;
    const text = ext === ".pdf" ? (await pdfText(p)).text : await readFile(p, "utf8");
    const hits = findLeaks(text);
    if (hits.length) results.push({ path: p, hits });
  }
  return results;
}

async function main() {
  const git = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], {
    encoding: "utf8",
  })
    .split("\0")
    .filter(Boolean);
  const pub = await walk("public");
  const built = await walk(".next", (d) => d === path.join(".next", "cache"));
  const all = [...new Set([...git, ...pub, ...built])];
  const leaks = await scanPaths(all);
  for (const l of leaks) console.log(`${l.path}: ${l.hits.join(", ")}`);
  if (leaks.length) {
    console.error(`leak check: ${leaks.length} file(s) with private words`);
    process.exit(1);
  }
  console.log(`leak check: ${all.length} files clean`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
