import type { Locale } from "@/content/types";
import { ui } from "@/content/ui";

export const CONTACT = {
  whatsapp: "5511987420114",
  phone: "+55 11 98742-0114",
  email: "wellmmer@gmail.com",
  linkedin: "https://www.linkedin.com/in/wellmmer",
  github: "https://github.com/wellmmer",
} as const;

export function whatsappUrl(locale: Locale): string {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(ui[locale].whatsappText)}`;
}

export function mailtoUrl(locale: Locale): string {
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(ui[locale].emailSubject)}`;
}

export function cvPdfPath(locale: Locale, kind: "designed" | "ats"): string {
  return `/cv/Wellmmer-Lucas-CV-${kind === "ats" ? "ATS-" : ""}${locale.toUpperCase()}.pdf`;
}
