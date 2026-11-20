import type { NextRequest } from "next/server";
import { LOCALES, type Locale } from "@/content/types";
import { cvPdfPath } from "@/lib/contact";
import { privateConfig } from "@/lib/private/config";
import { privatePdfName, readPrivatePdf, type CvKind } from "@/lib/private/files";
import { isUnlocked, notFound, privateHeaders } from "@/lib/private/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const KINDS: CvKind[] = ["designed", "ats"];

/** Streams the private PDF for an unlocked browser, under the same file name as the public one. */
export async function GET(req: NextRequest): Promise<Response> {
  const cfg = privateConfig();
  if (!cfg || !isUnlocked(req, cfg)) return notFound();
  const kind = req.nextUrl.searchParams.get("kind") as CvKind | null;
  const locale = req.nextUrl.searchParams.get("locale") as Locale | null;
  if (!kind || !KINDS.includes(kind) || !locale || !LOCALES.includes(locale)) return notFound();
  const name = privatePdfName(locale, kind);
  const bytes = await readPrivatePdf(name);
  if (!bytes) {
    // The visitor is unlocked but the private file is missing: hand them the public CV instead of an error.
    console.warn(`private PDF unavailable: ${name}`);
    return new Response(null, {
      status: 302,
      headers: { ...privateHeaders(), Location: new URL(cvPdfPath(locale, kind), req.url).toString() },
    });
  }
  const file = `Wellmmer-Lucas-CV-${kind === "ats" ? "ATS-" : ""}${locale.toUpperCase()}.pdf`;
  return new Response(bytes as BodyInit, {
    headers: {
      ...privateHeaders(),
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${file}"`,
    },
  });
}
