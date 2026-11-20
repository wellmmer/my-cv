import { notFound } from "next/navigation";
import { HomePage } from "@/components/HomePage";
import { isLocale } from "@/lib/locale";

/** The public page, built once at deploy time. Unlocked browsers are routed to ./unlocked instead (see proxy.ts). */
export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <HomePage locale={locale} today={new Date()} />;
}
