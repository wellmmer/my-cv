"use client";

import type { ReactNode } from "react";
import { BrickButton } from "@/components/brick/BrickButton";
import type { Locale } from "@/content/types";
import { cvPdfPath } from "@/lib/contact";
import { usePrivateMode } from "@/lib/private/client";

/** A CV download link that points at the private PDF while private mode is on. */
export function CvLink({
  locale,
  kind,
  variant,
  className,
  children,
}: {
  locale: Locale;
  kind: "designed" | "ats";
  variant: "button" | "plain";
  className?: string;
  children: ReactNode;
}) {
  const { status } = usePrivateMode();
  const href = status === "on" ? `/api/private/cv?kind=${kind}&locale=${locale}` : cvPdfPath(locale, kind);
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
