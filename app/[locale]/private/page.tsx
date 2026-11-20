import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrivateLink } from "@/components/PrivateLink";
import { ui } from "@/content/ui";
import { isLocale } from "@/lib/locale";

// The link page holds no private content; it only hands the code to the unlock route. Keep it out of search.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function PrivateLinkPage({ params }: PageProps<"/[locale]/private">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <PrivateLink locale={locale} labels={ui[locale].privateMode} />;
}
