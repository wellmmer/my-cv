"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/**
 * The page's one orchestrated moment: the hero tower builds itself, one brick at a
 * time, the newest landing last. Runs once. Without JavaScript or with reduced motion
 * the server-rendered tower simply stands there; `data-built` marks the end either way.
 */
export function HeroMotion() {
  const marker = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const build = marker.current?.closest("[data-hero-build]") as HTMLElement | null;
    if (!build) return;
    const done = () => build.setAttribute("data-built", "");
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const bricks = gsap.utils.toArray<SVGGElement>(build.querySelectorAll("g[data-step]"));
      gsap.from(bricks, {
        y: -90,
        opacity: 0,
        duration: 0.42,
        ease: "back.out(1.7)",
        stagger: 0.07,
        delay: 0.15,
        clearProps: "opacity,transform",
        onComplete: done,
      });
    });
    mm.add("(prefers-reduced-motion: reduce)", done);
    return () => mm.revert();
  });

  return <span ref={marker} hidden />;
}
