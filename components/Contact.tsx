import { Brick } from "@/components/brick/Brick";
import { ContractNote } from "@/components/ContractNote";
import { CvLink } from "@/components/CvLink";
import { BrickButton } from "@/components/brick/BrickButton";
import { Icon } from "@/components/icons";
import { BRICK_HEX, type Locale } from "@/content/types";
import { ui } from "@/content/ui";
import { CONTACT, mailtoUrl, whatsappUrl } from "@/lib/contact";
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
        <CvLink locale={locale} kind="designed" variant="button">
          {t.cta.download}
        </CvLink>
      </div>
      <p className={styles.direct} data-direct>
        <a href={mailtoUrl(locale)}>
          <Icon name="mail" size={20} />
          {CONTACT.email}
        </a>
        <a href={`tel:${CONTACT.phone.replace(/[^+\d]/g, "")}`}>
          <Icon name="phone" size={20} />
          {CONTACT.phone}
        </a>
      </p>
      <p className={styles.note}>
          <Brick color={BRICK_HEX.red} U={11} />
          <span>
            <ContractNote locale={locale} />
          </span>
        </p>
    </section>
  );
}
