"use client";

import type { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { LOCALES, type Locale } from "@/content/types";
import styles from "@/components/TopBar.module.css";

/** EN PT ES links. With JavaScript, the current #section is kept on switch. */
export function LangSwitch({ current, label }: { current: Locale; label: string }) {
  const router = useRouter();
  function keepHash(e: MouseEvent<HTMLAnchorElement>) {
    const hash = window.location.hash;
    if (!hash) return;
    e.preventDefault();
    router.push(`${e.currentTarget.getAttribute("href")}${hash}`);
  }
  return (
    <ul className={styles.lang} aria-label={label}>
      {LOCALES.map((l) => (
        <li key={l}>
          <a
            href={`/${l}`}
            hrefLang={l}
            lang={l}
            aria-current={l === current ? "page" : undefined}
            className={l === current ? styles.langOn : undefined}
            onClick={keepHash}
          >
            {l.toUpperCase()}
          </a>
        </li>
      ))}
    </ul>
  );
}
