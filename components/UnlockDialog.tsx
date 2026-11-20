"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { BrickCard } from "@/components/brick/BrickCard";
import type { Ui } from "@/content/ui";
import { showPrivateBuild, unlock } from "@/lib/private/client";
import styles from "@/components/UnlockDialog.module.css";

/** The secret code box the avatar easter egg opens. */
export function UnlockDialog({
  open,
  onClose,
  labels,
  locale,
}: {
  open: boolean;
  onClose: () => void;
  labels: Ui["privateMode"];
  locale: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const id = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      input.current?.focus();
    } else if (!open && d.open) d.close();
  }, [open]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const code = input.current?.value ?? "";
    if (!code.trim() || busy) return;
    setBusy(true);
    setMessage("");
    const result = await unlock(code);
    setBusy(false);
    // Closed while checking: drop the answer so it can't show up on the next open.
    if (!ref.current?.open) return;
    if (result === "ok") {
      if (input.current) input.current.value = "";
      onClose();
      // The server builds the private page: reload into it, landing on the new step.
      showPrivateBuild(locale);
    } else setMessage(result === "wrong" ? labels.wrong : labels.error);
  }

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby={`${id}-t`}
      onClose={() => {
        setMessage("");
        onClose();
      }}
    >
      <BrickCard color="green" studs={4} className={styles.card}>
        <form onSubmit={submit} className={styles.form}>
          <h2 id={`${id}-t`} className={styles.title}>
            {labels.title}
          </h2>
          <p className={styles.text}>{labels.text}</p>
          <label htmlFor={`${id}-c`} className={styles.label}>
            {labels.label}
          </label>
          <input
            ref={input}
            id={`${id}-c`}
            type="password"
            autoComplete="off"
            spellCheck={false}
            maxLength={200}
            className={styles.input}
          />
          <p role="alert" className={styles.alert}>
            {message}
          </p>
          <div className={styles.actions}>
            <button type="submit" className={styles.unlock} disabled={busy}>
              {labels.button}
            </button>
            <button type="button" className={styles.close} onClick={() => ref.current?.close()}>
              {labels.close}
            </button>
          </div>
        </form>
      </BrickCard>
    </dialog>
  );
}
