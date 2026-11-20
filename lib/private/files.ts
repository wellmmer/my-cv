// Server-only: private PDFs come from a private Vercel Blob store (or a local folder in tests).
import { readFile } from "node:fs/promises";
import path from "node:path";
import { get } from "@vercel/blob";
import type { Locale } from "@/content/types";

export type CvKind = "designed" | "ats";

const NAME = /^CV-(ATS-)?(EN|PT|ES)\.pdf$/;

/** `CV-EN.pdf` or `CV-ATS-EN.pdf`. */
export function privatePdfName(locale: Locale, kind: CvKind): string {
  return `CV-${kind === "ats" ? "ATS-" : ""}${locale.toUpperCase()}.pdf`;
}

/** The private PDF's bytes, or null when the name is odd, the file is missing or the store fails. */
export async function readPrivatePdf(name: string, env: NodeJS.ProcessEnv = process.env): Promise<Uint8Array | null> {
  if (!NAME.test(name)) return null;
  try {
    if (env.PRIVATE_FILES_DIR) {
      return new Uint8Array(await readFile(path.join(env.PRIVATE_FILES_DIR, name)));
    }
    const res = await get(`private-cv/${name}`, { access: "private", useCache: false });
    if (!res || res.statusCode !== 200) return null;
    return new Uint8Array(await new Response(res.stream).arrayBuffer());
  } catch {
    return null;
  }
}
