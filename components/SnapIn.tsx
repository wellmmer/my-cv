"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Brick cards in this section drop onto the page and land as it scrolls into view,
 * once. Content is server-rendered visible; the drop only exists with JS and motion.
 */
export function SnapIn({ selector = "[data-color]" }: { selector?: string }) {
  const marker = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const section = marker.current?.closest("section");
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray<HTMLElement>(section.querySelectorAll(selector));
      gsap.from(cards, {
        y: -26,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(1.6)",
        stagger: 0.08,
        clearProps: "opacity,transform",
        scrollTrigger: { trigger: section, start: "top 78%", once: true },
      });
    });
    return () => mm.revert();
  });

  return <span ref={marker} hidden />;
}
