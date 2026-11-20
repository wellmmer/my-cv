import { Appendix } from "@/components/Appendix";
import { Builds } from "@/components/Builds";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Parts } from "@/components/Parts";
import { Steps } from "@/components/Steps";
import { TopBar } from "@/components/TopBar";
import { cv } from "@/content/cv";
import type { Locale, Step } from "@/content/types";

/**
 * The whole CV page. The public page passes no private steps; the private build (an unlocked
 * browser only, built per request) passes them, and every place that counts steps includes them.
 */
export function HomePage({ locale, today, privateSteps = [] }: { locale: Locale; today: Date; privateSteps?: readonly Step[] }) {
  const steps = [...cv.steps, ...privateSteps].sort((a, b) => a.n - b.n);
  const privateNs = privateSteps.map((s) => s.n);
  const unlocked = privateNs.length > 0;
  return (
    <>
      <TopBar locale={locale} />
      <main id="main">
        <Hero locale={locale} steps={steps} unlocked={unlocked} />
        <Steps locale={locale} today={today} steps={steps} privateNs={privateNs} />
        <Builds locale={locale} />
        <Parts locale={locale} today={today} />
        <Appendix locale={locale} />
        <Contact locale={locale} unlocked={unlocked} />
      </main>
    </>
  );
}
