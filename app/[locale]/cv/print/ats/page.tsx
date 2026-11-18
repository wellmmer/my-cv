import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AtsCv } from "@/components/print/AtsCv";
import { loadPrivateSteps } from "@/content/private";
import { isLocale } from "@/lib/locale";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function PrintAtsCv({ params }: PageProps<"/[locale]/cv/print/ats">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <AtsCv locale={locale} privateSteps={await loadPrivateSteps()} today={new Date()} />;
}
