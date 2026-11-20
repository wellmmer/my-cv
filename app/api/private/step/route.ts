import type { NextRequest } from "next/server";
import type { Step } from "@/content/types";
import { privateConfig } from "@/lib/private/config";
import { isUnlocked, notFound, privateHeaders } from "@/lib/private/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** The private steps, in every language, for an unlocked browser only. */
export async function GET(req: NextRequest): Promise<Response> {
  const cfg = privateConfig();
  if (!cfg || !isUnlocked(req, cfg)) return notFound();
  return Response.json({ steps: cfg.steps.map(publicFields) }, { headers: privateHeaders() });
}

const FIELDS = [
  "n", "id", "company", "short", "companyUrl", "product", "client", "via",
  "role", "start", "end", "city", "brick", "bullets", "uses", "note",
] as const satisfies readonly (keyof Step)[];

/** Only the fields a step card shows; anything else in the private JSON stays on the server. */
function publicFields(s: Step): Partial<Step> {
  return Object.fromEntries(FIELDS.filter((k) => k in s).map((k) => [k, s[k]])) as Partial<Step>;
}
