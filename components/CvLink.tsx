import type { ReactNode } from "react";
import { BrickButton } from "@/components/brick/BrickButton";
import type { Locale } from "@/content/types";
import { cvPdfPath } from "@/lib/contact";

/** A CV download link; the server points it at the private PDF for an unlocked browser. */
export function CvLink({
  locale,
  kind,
  variant,
  className,
  unlocked,
  children,
}: {
  locale: Locale;
  kind: "designed" | "ats";
  variant: "button" | "plain";
  className?: string;
  unlocked: boolean;
  children: ReactNode;
}) {
  const href = unlocked ? `/api/private/cv?kind=${kind}&locale=${locale}` : cvPdfPath(locale, kind);
  if (variant === "button") {
    return (
      <BrickButton href={href} variant="pdf" icon="pdf" download data={{ "data-cv-link": kind }}>
        {children}
      </BrickButton>
    );
  }
  return (
    <a className={className} href={href} download data-cv-link={kind}>
      {children}
    </a>
  );
}
