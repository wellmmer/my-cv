import type { NextRequest } from "next/server";
import { LOCALES, type Locale } from "@/content/types";
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
  const bytes = await readPrivatePdf(privatePdfName(locale, kind));
  if (!bytes) return notFound();
  const file = `Wellmmer-Lucas-CV-${kind === "ats" ? "ATS-" : ""}${locale.toUpperCase()}.pdf`;
  return new Response(bytes as BodyInit, {
    headers: {
      ...privateHeaders(),
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${file}"`,
    },
  });
}
