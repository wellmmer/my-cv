import { NextResponse, type NextRequest } from "next/server";
import { verifyCode } from "@/lib/private/code";
import { privateConfig } from "@/lib/private/config";
import { COOKIE, MAX_AGE_S, holdUntilFloor, notFound, privateHeaders } from "@/lib/private/session";
import { signToken } from "@/lib/private/token";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BODY = 1024;

/** Reads at most MAX_BODY bytes; null when the body is larger, whatever the request claims. */
async function readBounded(req: NextRequest): Promise<string | null> {
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY) return null;
  if (!req.body) return "";
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY) {
        await reader.cancel().catch(() => undefined);
        return null;
      }
      chunks.push(value);
    }
  } catch {
    // The client went away mid-body.
    return null;
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function readCode(req: NextRequest): Promise<string | null> {
  const raw = await readBounded(req);
  if (!raw) return null;
  try {
    const code = (JSON.parse(raw) as { code?: unknown } | null)?.code;
    return typeof code === "string" && code.trim() ? code : null;
  } catch {
    return null;
  }
}

/** Checks the code; the right one sets a signed 30-day cookie. Every answer takes at least the floor. */
export async function POST(req: NextRequest): Promise<Response> {
  const started = Date.now();
  const cfg = privateConfig();
  const code = cfg ? await readCode(req) : null;
  let res: Response;
  if (!cfg) res = notFound();
  else if (code === null) res = new Response(null, { status: 400, headers: privateHeaders() });
  else if (!(await verifyCode(code, cfg.codeHash))) res = new Response(null, { status: 401, headers: privateHeaders() });
  else {
    const ok = new NextResponse(null, { status: 204, headers: privateHeaders() });
    ok.cookies.set(COOKIE, signToken({ exp: Date.now() + MAX_AGE_S * 1000, v: cfg.v }, cfg.secret), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: MAX_AGE_S,
    });
    res = ok;
  }
  await holdUntilFloor(started);
  return res;
}
