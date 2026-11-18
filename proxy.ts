import { NextResponse, type NextRequest } from "next/server";
import { pickLocale } from "@/lib/locale";

/** Sends `/` to /en, /pt or /es from the browser's Accept-Language. */
export function proxy(request: NextRequest) {
  const locale = pickLocale(request.headers.get("accept-language"));
  return NextResponse.redirect(new URL(`/${locale}`, request.url), 307);
}

export const config = { matcher: "/" };
