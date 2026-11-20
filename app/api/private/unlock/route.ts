import { NextResponse, type NextRequest } from "next/server";
import { verifyCode } from "@/lib/private/code";
import { privateConfig } from "@/lib/private/config";
import { COOKIE, MAX_AGE_S, holdUntilFloor, notFound, privateHeaders } from "@/lib/private/session";
import { signToken } from "@/lib/private/token";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BODY = 1024;

async function readCode(req: NextRequest): Promise<string | null> {
  const raw = await req.text();
  if (!raw || raw.length > MAX_BODY) return null;
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
  else if (!verifyCode(code, cfg.codeHash)) res = new Response(null, { status: 401, headers: privateHeaders() });
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
