"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Drops each step's brick onto the sticky tower as the step scrolls into view.
 * Desktop with motion allowed only: on phones, under reduced motion, and without
 * JavaScript the server-rendered full tower stays as it is.
 */
export function TowerMotion() {
  const marker = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const root = marker.current?.closest("section");
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 961px) and (prefers-reduced-motion: no-preference)", () => {
      const bricks = gsap.utils.toArray<SVGGElement>(root.querySelectorAll('[data-tower="sticky"] g[data-step]'));
      for (const brick of bricks) {
        const n = brick.dataset.step;
        const step = root.querySelector(`article[data-step="${n}"]`);
        if (!step || n === "1") continue;
        gsap.set(brick, { y: -120, opacity: 0 });
        gsap.to(brick, {
          y: 0,
          opacity: 1,
          duration: 0.45,
          ease: "back.out(1.4)",
          scrollTrigger: { trigger: step, start: "top 60%", toggleActions: "play none none reverse" },
        });
      }
    });
    return () => mm.revert();
  });

  return <span ref={marker} hidden />;
}
