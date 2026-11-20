import type { Locale } from "@/content/types";
import { ui } from "@/content/ui";

/** The contract note as plain text, with "Deel" in place of the link marker. */
export function contractText(locale: Locale): string {
  const c = ui[locale].contract;
  return `${c.lead} ${c.text.replace("{deel}", "Deel")}`;
}
