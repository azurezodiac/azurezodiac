"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";

/** Mobile-only sticky Begin CTA that appears once the hero scrolls away. */
export function MobileStickyBegin() {
  const { t } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0.12, rootMargin: "-48px 0px 0px 0px" },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <div
      className="sticky-begin-bar fixed inset-x-0 bottom-0 z-50 border-t border-line bg-ink/92 px-4 py-3 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <Link href="/begin" className="btn-primary w-full">
        {t.hero.ctaBegin}
      </Link>
    </div>
  );
}
