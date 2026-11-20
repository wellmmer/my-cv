import type { Locale } from "@/content/types";
import { ui } from "@/content/ui";
import { CONTACT } from "@/lib/contact";

/** "Contract-ready:" in bold, then the note with Deel as a link. ChimpCode stays plain text. */
export function ContractNote({ locale }: { locale: Locale }) {
  const { lead, text } = ui[locale].contract;
  const [before, after] = text.split("{deel}");
  return (
    <>
      <b>{lead}</b> {before}
      <a href={CONTACT.deel} target="_blank" rel="noopener noreferrer">
        Deel
      </a>
      {after}
    </>
  );
}
