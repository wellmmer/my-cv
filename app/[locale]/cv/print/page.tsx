import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DesignedCv } from "@/components/print/DesignedCv";
import { loadPrivateSteps } from "@/content/private";
import { isLocale } from "@/lib/locale";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function PrintCv({ params }: PageProps<"/[locale]/cv/print">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <DesignedCv locale={locale} privateSteps={await loadPrivateSteps()} today={new Date()} />;
}
