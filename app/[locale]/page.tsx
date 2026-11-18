import { notFound } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { isLocale } from "@/lib/locale";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <>
      <TopBar locale={locale} />
      <main id="main">
        <h1>Wellmmer Lucas</h1>
        <section id="steps" />
        <section id="builds" />
        <section id="parts" />
        <section id="appendix" />
        <section id="contact" />
      </main>
    </>
  );
}
