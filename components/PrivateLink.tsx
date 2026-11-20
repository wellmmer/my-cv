"use client";

import { useEffect, useRef, useState } from "react";
import { BrickCard } from "@/components/brick/BrickCard";
import type { Locale } from "@/content/types";
import type { Ui } from "@/content/ui";
import { privateSnapshot, unlock } from "@/lib/private/client";
import styles from "@/components/PrivateLink.module.css";

/**
 * The private link: /<locale>/private#<code>. The code rides after the "#", which browsers never send,
 * so it stays out of server logs. It leaves the address bar first, then goes to the unlock route.
 */
export function PrivateLink({ locale, labels }: { locale: Locale; labels: Ui["privateMode"] }) {
  const [state, setState] = useState<"opening" | "bad" | "error">("opening");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    let code = "";
    try {
      code = decodeURIComponent(window.location.hash.slice(1));
    } catch {
      code = "";
    }
    window.history.replaceState(null, "", window.location.pathname);
    // No code is the same as a wrong one; both answer asynchronously, so the effect never sets state itself.
    const check = code.trim() ? unlock(code) : Promise.resolve("wrong" as const);
    void check.then((result) => {
      const first = privateSnapshot().steps.map((s) => s.n).sort((a, b) => a - b)[0];
      if (result === "ok" && first) window.location.replace(`/${locale}#step-${first}`);
      else setState(result === "error" ? "error" : "bad");
    });
  }, [locale]);

  return (
    <main id="main" className={styles.page}>
      <BrickCard color="green" studs={4} className={styles.card}>
        <div data-private-link className={styles.body} aria-live="polite">
          {state === "opening" ? (
            <p className={styles.text}>{labels.opening}</p>
          ) : (
            <>
              <p className={styles.text}>{state === "bad" ? labels.linkBad : labels.error}</p>
              <a href={`/${locale}`} className={styles.open}>
                {labels.openCv}
              </a>
            </>
          )}
        </div>
      </BrickCard>
    </main>
  );
}
