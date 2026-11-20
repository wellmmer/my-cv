import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { HomePage } from "@/components/HomePage";
import { isLocale } from "@/lib/locale";
import { privateConfig } from "@/lib/private/config";
import { COOKIE, stepsForToken } from "@/lib/private/session";

// The private build: rendered per request, never prerendered or cached, never indexed.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * proxy.ts sends /<locale> here when the browser holds the private cookie. The cookie is checked
 * again here: a missing, forged, expired or old-code cookie gets the plain public page.
 */
export default async function Unlocked({ params }: PageProps<"/[locale]/unlocked">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const token = (await cookies()).get(COOKIE)?.value;
  return <HomePage locale={locale} today={new Date()} privateSteps={stepsForToken(token, privateConfig())} />;
}
