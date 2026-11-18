import { BrickButton } from "@/components/brick/BrickButton";
import type { Locale } from "@/content/types";
import { ui } from "@/content/ui";
import { CONTACT, cvPdfPath, mailtoUrl, whatsappUrl } from "@/lib/contact";
import styles from "@/components/Contact.module.css";

export function Contact({ locale }: { locale: Locale }) {
  const t = ui[locale];
  return (
    <section id="contact" className={styles.contact} aria-labelledby="contact-h">
      <h2 id="contact-h">{t.contactHeading}</h2>
      <div className={styles.ctas}>
        <BrickButton href={whatsappUrl(locale)} variant="whatsapp" icon="whatsapp" external>
          {t.cta.whatsapp}
        </BrickButton>
        <BrickButton href={mailtoUrl(locale)} variant="email" icon="gmail">
          {t.cta.email}
        </BrickButton>
        <BrickButton href={CONTACT.linkedin} variant="linkedin" icon="linkedin" external>
          {t.cta.linkedin}
        </BrickButton>
        <BrickButton href={CONTACT.github} variant="github" icon="github" external>
          {t.cta.github}
        </BrickButton>
        <BrickButton href={cvPdfPath(locale, "designed")} variant="pdf" icon="pdf" download>
          {t.cta.download}
        </BrickButton>
      </div>
      <p className={styles.direct} data-direct>
        <a href={mailtoUrl(locale)}>{CONTACT.email}</a>
        <span aria-hidden="true"> — </span>
        <a href={`tel:${CONTACT.phone.replace(/[^+\d]/g, "")}`}>{CONTACT.phone}</a>
      </p>
      <p className={styles.note}>{t.contractNote}</p>
    </section>
  );
}
