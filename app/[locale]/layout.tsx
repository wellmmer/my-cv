import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { notFound } from "next/navigation";
import { cv } from "@/content/cv";
import { LOCALES } from "@/content/types";
import { ui } from "@/content/ui";
import { yearsOfExperience } from "@/lib/dates";
import { isLocale } from "@/lib/locale";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

const rubik = Rubik({ subsets: ["latin"], weight: ["500", "700", "900"], variable: "--font-rubik" });

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const description = cv.summary[locale].replace("{years}", String(yearsOfExperience(new Date())));
  return {
    metadataBase: new URL(SITE_URL),
    title: ui[locale].metaTitle,
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", pt: "/pt", es: "/es", "x-default": "/en" },
    },
    openGraph: { title: ui[locale].metaTitle, description, url: `/${locale}`, type: "profile", locale },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale} className={rubik.variable}>
      <body>{children}</body>
    </html>
  );
}
