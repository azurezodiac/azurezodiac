"use client";

import { useEffect } from "react";

/**
 * Sitewide scroll motion: any [data-reveal] / [data-stagger] enters with CSS.
 * Respects prefers-reduced-motion.
 */
export function MotionRoot() {
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      document
        .querySelectorAll("[data-reveal], [data-stagger]")
        .forEach((el) => el.classList.add("is-in"));
      return;
    }

    const mark = (el: Element) => el.classList.add("is-in");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          mark(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
    );

    const watch = () => {
      document
        .querySelectorAll("[data-reveal]:not(.is-in), [data-stagger]:not(.is-in)")
        .forEach((el) => observer.observe(el));
    };

    watch();

    const mo = new MutationObserver(() => watch());
    mo.observe(document.body, { childList: true, subtree: true });

    // Soft parallax for [data-parallax]
    const parallaxEls = () =>
      Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const mid = window.innerHeight * 0.5;
        for (const el of parallaxEls()) {
          const rect = el.getBoundingClientRect();
          const progress = (mid - (rect.top + rect.height * 0.5)) / mid;
          const amount = Number(el.dataset.parallax || "12");
          el.style.transform = `translate3d(0, ${progress * amount}px, 0)`;
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const onPointer = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const btn = target.closest(".btn-primary");
      if (!(btn instanceof HTMLElement)) return;
      const rect = btn.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      btn.style.setProperty("--rx", `${x}%`);
      btn.style.setProperty("--ry", `${y}%`);
    };
    document.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      observer.disconnect();
      mo.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return null;
}
