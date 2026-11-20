import { NextResponse } from "next/server";
import { COOKIE, privateHeaders } from "@/lib/private/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Clears the unlock cookie. */
export async function POST(): Promise<Response> {
  const res = new NextResponse(null, { status: 204, headers: privateHeaders() });
  res.cookies.set(COOKIE, "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });
  return res;
}
