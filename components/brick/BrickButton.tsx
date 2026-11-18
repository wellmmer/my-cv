import type { ReactNode } from "react";
import styles from "@/components/brick/BrickButton.module.css";

interface BrickButtonProps {
  href: string;
  variant: "red" | "white";
  external?: boolean;
  download?: boolean;
  children: ReactNode;
  /** Visible label length decides the stud count; pass it when children is not plain text. */
  label?: string;
}

/** A link drawn as a flat brick: ink keyline, darker bottom band, studs on top. */
export function BrickButton({ href, variant, external, download, children, label }: BrickButtonProps) {
  const text = label ?? (typeof children === "string" ? children : "");
  const studs = text.length > 12 ? 4 : 2;
  return (
    <a
      href={href}
      className={`${styles.button} ${variant === "red" ? styles.red : styles.white}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(download ? { download: "" } : {})}
    >
      <svg className={styles.studs} viewBox={`0 0 ${studs * 22} 12`} width={studs * 22} height={12} aria-hidden="true" focusable="false">
        {Array.from({ length: studs }, (_, i) => (
          <g key={i} transform={`translate(${i * 22 + 11} 0)`}>
            <path d="M-7 4 V8 A7 3.5 0 0 0 7 8 V4 Z" className={styles.studSide} stroke="#111" strokeWidth={2} />
            <ellipse cx={0} cy={4} rx={7} ry={3.5} className={styles.studTop} stroke="#111" strokeWidth={2} />
          </g>
        ))}
      </svg>
      <span>{children}</span>
    </a>
  );
}
