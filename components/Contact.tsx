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
        <BrickButton href={whatsappUrl(locale)} variant="white" external>
          {t.cta.whatsapp}
        </BrickButton>
        <BrickButton href={mailtoUrl(locale)} variant="white">
          {t.cta.email}
        </BrickButton>
        <BrickButton href={CONTACT.linkedin} variant="white" external>
          {t.cta.linkedin}
        </BrickButton>
        <BrickButton href={CONTACT.github} variant="white" external>
          {t.cta.github}
        </BrickButton>
        <BrickButton href={cvPdfPath(locale, "designed")} variant="red" download>
          {t.cta.download}
        </BrickButton>
      </div>
      <p className={styles.direct}>
        <a href={mailtoUrl(locale)}>{CONTACT.email}</a>
        <span aria-hidden="true"> · </span>
        <a href={`tel:${CONTACT.phone.replace(/[^+\d]/g, "")}`}>{CONTACT.phone}</a>
      </p>
      <p className={styles.note}>{t.contractNote}</p>
    </section>
  );
}
