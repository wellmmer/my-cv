import type { ReactNode } from "react";
import type { BrickColor } from "@/content/types";
import styles from "@/components/brick/BrickCard.module.css";

interface BrickCardProps {
  color: BrickColor | "white";
  as?: "div" | "li" | "article" | "aside";
  className?: string;
  children: ReactNode;
  /** Passed through for headings: aria-labelledby. */
  labelledBy?: string;
  /** Studs on the top edge, spread evenly. */
  studs?: number;
}

function Stud() {
  return (
    <svg viewBox="-8 0 16 12" width="22" height="14" aria-hidden="true" focusable="false">
      <path d="M-7 4 V8 A7 3.5 0 0 0 7 8 V4 Z" fill="var(--brick-dark)" stroke="#111" strokeWidth={1.6} />
      <ellipse cx={0} cy={4} rx={7} ry={3.5} fill="var(--brick)" stroke="#111" strokeWidth={1.6} />
    </svg>
  );
}

/**
 * A container drawn as a brick seen from the front: keyline, a coloured top band with
 * studs on it, a darker bottom band. Content sits on the card colour, never on the band.
 */
export function BrickCard({ color, as: Tag = "div", className, children, labelledBy, studs = 6 }: BrickCardProps) {
  return (
    <Tag
      data-color={color}
      aria-labelledby={labelledBy}
      className={[styles.card, styles[color], className].filter(Boolean).join(" ")}
    >
      <span className={styles.studs} aria-hidden="true">
        {Array.from({ length: studs }, (_, i) => (
          <Stud key={i} />
        ))}
      </span>
      {children}
    </Tag>
  );
}
