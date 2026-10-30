"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * One motion system for the whole site, driven by data attributes so server components stay server
 * components — they just add a class/attribute:
 *   [data-reveal]          → fades and rises in when scrolled into view
 *   [data-stagger] > *     → its direct children reveal one after another
 *   [data-hero] > *        → rises in on load (the one orchestrated entrance)
 *   [data-rail]            → draws itself from the top (the queue's signature line)
 *   [data-rail-dot]        → the rail's stops pop in after it
 *
 * The initial hidden state lives in CSS gated on `.has-js`, so no-JS visitors and crawlers see
 * everything, and a failsafe reveals the content if the bundle ever fails to run. All motion is
 * vertical only (opacity + small Y), so nothing can push the layout sideways on a phone, and it is
 * switched off entirely under prefers-reduced-motion.
 */
export function Motion() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  // Smooth scroll, wired into ScrollTrigger. Skipped for reduced motion (native scroll stays).
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const onRaf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onRaf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // New page: jump to top and recalculate trigger positions.
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
    ScrollTrigger.refresh();
  }, [pathname]);

  useGSAP(
    () => {
      // GSAP is running: cancel the "reveal everything" failsafe set by the inline script.
      const failsafe = (window as unknown as { __motionFailsafe?: number }).__motionFailsafe;
      if (failsafe) window.clearTimeout(failsafe);
      if (prefersReducedMotion()) return;

      const reveal = (targets: Element[] | Element, extra?: gsap.TweenVars) =>
        gsap.to(targets, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", ...extra });

      // Hero: one entrance on load.
      const heroChildren = gsap.utils.toArray<HTMLElement>("[data-hero] > *");
      if (heroChildren.length) reveal(heroChildren, { stagger: 0.08, delay: 0.05 });

      // Sections reveal once, in view.
      ScrollTrigger.batch("[data-reveal]", {
        start: "top 88%",
        once: true,
        onEnter: (els) => reveal(els, { stagger: 0.08 }),
      });

      // Staggered groups (cards): children rise together, slightly offset.
      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((group) => {
        const items = gsap.utils.toArray<HTMLElement>(":scope > *", group);
        ScrollTrigger.create({
          trigger: group,
          start: "top 85%",
          once: true,
          onEnter: () => reveal(items, { stagger: 0.07 }),
        });
      });

      // The queue rail draws itself, then its stops pop in.
      gsap.utils.toArray<HTMLElement>("[data-rail]").forEach((rail) => {
        const container = rail.closest("[data-rail-container]") ?? rail.parentElement ?? rail;
        const dots = gsap.utils.toArray<HTMLElement>("[data-rail-dot]", container);
        const tl = gsap.timeline({ scrollTrigger: { trigger: container, start: "top 80%", once: true } });
        tl.to(rail, { scaleY: 1, duration: 0.6, ease: "power2.out" });
        if (dots.length) tl.to(dots, { opacity: 1, scale: 1, duration: 0.35, stagger: 0.08, ease: "back.out(1.6)" }, "-=0.3");
      });
    },
    { dependencies: [pathname] },
  );

  return null;
}
