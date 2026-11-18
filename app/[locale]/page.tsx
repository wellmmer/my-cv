import { notFound } from "next/navigation";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { TopBar } from "@/components/TopBar";
import { yearsOfExperience } from "@/lib/dates";
import { isLocale } from "@/lib/locale";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const years = yearsOfExperience(new Date());
  return (
    <>
      <TopBar locale={locale} />
      <main id="main">
        <Hero locale={locale} years={years} />
        <section id="steps" />
        <section id="builds" />
        <section id="parts" />
        <section id="appendix" />
        <Contact locale={locale} />
      </main>
    </>
  );
}
