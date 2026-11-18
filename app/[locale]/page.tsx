import { notFound } from "next/navigation";
import { Appendix } from "@/components/Appendix";
import { Builds } from "@/components/Builds";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Parts } from "@/components/Parts";
import { Steps } from "@/components/Steps";
import { TopBar } from "@/components/TopBar";
import { isLocale } from "@/lib/locale";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const today = new Date();
  return (
    <>
      <TopBar locale={locale} />
      <main id="main">
        <Hero locale={locale} />
        <Steps locale={locale} today={today} />
        <Builds locale={locale} />
        <Parts locale={locale} today={today} />
        <Appendix locale={locale} />
        <Contact locale={locale} />
      </main>
    </>
  );
}
