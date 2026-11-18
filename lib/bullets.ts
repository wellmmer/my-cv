import type { Bullet, Locale, Step } from "@/content/types";

export function bulletParts(b: Bullet): { lead?: string; text: string } {
  return typeof b === "string" ? { text: b } : { lead: b.lead, text: b.text };
}

/** Plain text form: "Lead: text", or the bullet itself. */
export function bulletText(b: Bullet): string {
  return typeof b === "string" ? b : `${b.lead}: ${b.text}`;
}

/** The bullets the PDFs show: the first `pdfBullets`, or all. */
export function pdfBulletsOf(s: Step, locale: Locale): Bullet[] {
  const all = s.bullets[locale];
  return s.pdfBullets ? all.slice(0, s.pdfBullets) : all;
}

export const bulletKey = (b: Bullet) => bulletText(b);
