"use client";

import Image from "next/image";
import { useState } from "react";
import { BrickAvatar } from "@/components/brick/BrickAvatar";
import styles from "@/components/Avatar.module.css";

/** The brick build of Wellmmer; press it to flip to his photo, press again to flip back. */
export function Avatar({ labels }: { labels: { showPhoto: string; showBricks: string } }) {
  const [photo, setPhoto] = useState(false);
  return (
    <button
      type="button"
      data-avatar
      className={styles.avatar}
      aria-pressed={photo}
      aria-label={photo ? labels.showBricks : labels.showPhoto}
      title={photo ? labels.showBricks : labels.showPhoto}
      onClick={() => setPhoto((p) => !p)}
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
  );
}
