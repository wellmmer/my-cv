import type { NextRequest } from "next/server";
import { privateConfig } from "@/lib/private/config";
import { isUnlocked, notFound, privateHeaders } from "@/lib/private/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** The private steps, in every language, for an unlocked browser only. */
export async function GET(req: NextRequest): Promise<Response> {
  const cfg = privateConfig();
  if (!cfg || !isUnlocked(req, cfg)) return notFound();
  return Response.json({ steps: cfg.steps }, { headers: privateHeaders() });
}
