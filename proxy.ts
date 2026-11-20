import { NextResponse, type NextRequest } from "next/server";
import { pickLocale } from "@/lib/locale";

/** Same name as COOKIE in lib/private/session.ts (server-only, so not imported here). */
const PRIVATE_COOKIE = "__Host-cv_private";

/**
 * `/` goes to /en, /pt or /es from the browser's Accept-Language.
 * `/<locale>` with the private cookie is served by the per-request private build (which checks the
 * cookie itself); everyone else gets the static public page.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/") {
    const locale = pickLocale(request.headers.get("accept-language"));
    return NextResponse.redirect(new URL(`/${locale}`, request.url), 307);
  }
  if (!request.cookies.has(PRIVATE_COOKIE)) return NextResponse.next();
  const res = NextResponse.rewrite(new URL(`${pathname}/unlocked`, request.url));
  res.headers.set("Cache-Control", "private, no-store");
  res.headers.set("X-Robots-Tag", "noindex");
  return res;
}

export const config = { matcher: ["/", "/en", "/pt", "/es"] };
