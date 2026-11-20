"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { BrickAvatar } from "@/components/brick/BrickAvatar";
import { UnlockDialog } from "@/components/UnlockDialog";
import type { Ui } from "@/content/ui";
import { tap, type Taps } from "@/lib/private/taps";
import styles from "@/components/Avatar.module.css";

/**
 * The brick build of Wellmmer; press it to flip to his photo, press again to flip back.
 * Twenty quick presses open the secret code box.
 */
export function Avatar({ labels, privateMode }: { labels: { showPhoto: string; showBricks: string }; privateMode: Ui["privateMode"] }) {
  const [photo, setPhoto] = useState(false);
  const [boxOpen, setBoxOpen] = useState(false);
  const taps = useRef<Taps>({ count: 0, last: 0 });
  return (
    <>
      <button
        type="button"
        data-avatar
        className={styles.avatar}
        aria-pressed={photo}
        aria-label={labels.showPhoto}
        title={photo ? labels.showBricks : labels.showPhoto}
        onClick={() => {
          setPhoto((p) => !p);
          const r = tap(taps.current, Date.now());
          taps.current = r.next;
          if (r.fire) setBoxOpen(true);
        }}
      >
        <span className={styles.flipper} data-flipped={photo || undefined}>
          <span className={styles.front} aria-hidden={photo} inert={photo}>
            <BrickAvatar size={136} />
          </span>
          <span className={styles.back} aria-hidden={!photo} inert={!photo}>
            <Image src="/me.webp" alt="Wellmmer Lucas" width={320} height={320} sizes="160px" priority />
          </span>
        </span>
      </button>
      <UnlockDialog open={boxOpen} onClose={() => setBoxOpen(false)} labels={privateMode} />
    </>
  );
}
