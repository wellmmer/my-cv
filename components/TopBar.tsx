import type { Locale } from "@/content/types";
import { ui } from "@/content/ui";
import { LangSwitch } from "@/components/LangSwitch";
import { ThemeToggle } from "@/components/ThemeToggle";
import styles from "@/components/TopBar.module.css";

export function TopBar({ locale }: { locale: Locale }) {
  const t = ui[locale];
  return (
    <header className={styles.bar}>
      <a href="#main" className="skip">
        {locale === "en" ? "Skip to content" : locale === "pt" ? "Pular para o conteúdo" : "Saltar al contenido"}
      </a>
      <a href={`/${locale}`} className={styles.mark}>
        wellmmer<span className={styles.last}> lucas</span>
      </a>
      <nav className={styles.nav}>
        <a href="#steps">{t.nav.steps}</a>
        <a href="#builds">{t.nav.builds}</a>
        <a href="#contact">{t.nav.contact}</a>
      </nav>
      <LangSwitch current={locale} label={t.nav.language} />
      <ThemeToggle labels={t.theme} />
    </header>
  );
}
