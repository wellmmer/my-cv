import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/icons";
import styles from "@/components/brick/BrickButton.module.css";

export type BrickVariant = "red" | "white" | "whatsapp" | "email" | "linkedin" | "github" | "pdf";

interface BrickButtonProps {
  href: string;
  variant: BrickVariant;
  icon?: IconName;
  external?: boolean;
  download?: boolean;
  children: ReactNode;
  /** Visible label length decides the stud count; pass it when children is not plain text. */
  label?: string;
  /** Extra data-* attributes for the link. */
  data?: Record<`data-${string}`, string>;
}

/** A link drawn as a flat brick: ink keyline, darker bottom band, studs on top. */
export function BrickButton({ href, variant, icon, external, download, children, label, data }: BrickButtonProps) {
  const text = label ?? (typeof children === "string" ? children : "");
  const studs = text.length > 12 ? 4 : 2;
  return (
    <a
      href={href}
      data-variant={variant}
      className={`${styles.button} ${styles[variant]}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(download ? { download: "" } : {})}
      {...data}
    >
      <svg className={styles.studs} viewBox={`0 0 ${studs * 22} 12`} width={studs * 22} height={12} aria-hidden="true" focusable="false">
        {Array.from({ length: studs }, (_, i) => (
          <g key={i} transform={`translate(${i * 22 + 11} 0)`}>
            <path d="M-7 4 V8 A7 3.5 0 0 0 7 8 V4 Z" className={styles.studSide} stroke="#111" strokeWidth={2} />
            <ellipse cx={0} cy={4} rx={7} ry={3.5} className={styles.studTop} stroke="#111" strokeWidth={2} />
          </g>
        ))}
      </svg>
      <span className={styles.label}>
        {icon ? <Icon name={icon} size={19} /> : null}
        {children}
      </span>
    </a>
  );
}
