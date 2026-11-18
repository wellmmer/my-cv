"use client";

import { Flag } from "@/components/Flag";
import type { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { LOCALES, type Locale } from "@/content/types";
import styles from "@/components/TopBar.module.css";

/** The id of the section the visitor is reading: the last one whose top passed 30% of the viewport, or the last section at the page end. */
function sectionInView(): string | null {
  const sections = [...document.querySelectorAll<HTMLElement>("main > section[id]")];
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  if (atBottom && sections.length) return sections[sections.length - 1].id;
  const line = window.innerHeight * 0.3;
  let current: string | null = null;
  for (const s of sections) {
    if (s.getBoundingClientRect().top <= line) current = s.id;
  }
  return current;
}

const FLAG = { en: "us", pt: "br", es: "es" } as const;

/** EN PT ES links. With JavaScript, the switch keeps the visitor on the section in view. */
export function LangSwitch({ current, label }: { current: Locale; label: string }) {
  const router = useRouter();
  function keepSection(e: MouseEvent<HTMLAnchorElement>) {
    const id = sectionInView();
    if (!id) return;
    e.preventDefault();
    router.push(`${e.currentTarget.getAttribute("href")}#${id}`);
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
            onClick={keepSection}
          >
            <Flag code={FLAG[l]} size={18} />
            {l.toUpperCase()}
          </a>
        </li>
      ))}
    </ul>
  );
}
