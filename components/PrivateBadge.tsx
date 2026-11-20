"use client";

import { Brick } from "@/components/brick/Brick";
import { BRICK_HEX } from "@/content/types";
import { lock } from "@/lib/private/client";
import styles from "@/components/PrivateBadge.module.css";

/** "Private build on", with the button that locks this browser again. */
export function PrivateBadge({ on, lockLabel }: { on: string; lockLabel: string }) {
  return (
    <p className={styles.badge} data-private-badge>
      <Brick color={BRICK_HEX.green} U={11} />
      <span>{on}</span>
      <button type="button" className={styles.lock} onClick={() => void lock()}>
        {lockLabel}
      </button>
    </p>
  );
}
