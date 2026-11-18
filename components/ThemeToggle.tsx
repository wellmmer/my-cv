"use client";

import { useSyncExternalStore } from "react";
import { THEME_KEY, type Theme } from "@/lib/theme";
import styles from "@/components/ThemeToggle.module.css";

function current(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const CHANGE = "themechange";

function subscribe(onChange: () => void) {
  const mq = matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", onChange);
  window.addEventListener(CHANGE, onChange);
  return () => {
    mq.removeEventListener("change", onChange);
    window.removeEventListener(CHANGE, onChange);
  };
}

function flip() {
  const next: Theme = current() === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    // storage blocked: the choice lasts for this page view
  }
  window.dispatchEvent(new Event(CHANGE));
}

/** A two-stud brick switch: light or dark. A manual pick is remembered when storage allows. */
export function ThemeToggle({ labels }: { labels: { toDark: string; toLight: string } }) {
  const theme = useSyncExternalStore<Theme>(subscribe, current, () => "light");
  const dark = theme === "dark";
  return (
    <button
      type="button"
      data-theme-toggle
      className={styles.toggle}
      aria-pressed={dark}
      aria-label={labels.toDark}
      title={dark ? labels.toLight : labels.toDark}
      onClick={flip}
    >
      <span className={styles.knob} data-on={dark || undefined} aria-hidden="true" />
      <svg className={styles.sun} viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2.4" />
        <path
          d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
      <svg className={styles.moon} viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" fill="currentColor" />
      </svg>
    </button>
  );
}
