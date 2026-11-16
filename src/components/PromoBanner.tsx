"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CmsPromotion } from "@/lib/cms-types";

export function PromoBanner() {
  const [promo, setPromo] = useState<CmsPromotion | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/cms/public");
        if (!res.ok) return;
        const data = (await res.json()) as {
          cms?: { promotions?: CmsPromotion[] };
        };
        const active = data.cms?.promotions?.[0] ?? null;
        if (!cancelled) setPromo(active);
      } catch {
        // Static hosting — no banner API.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!promo) return null;

  return (
    <section className="border-y border-line bg-ink-soft/80" data-reveal>
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10">
        <div className="max-w-2xl">
          <p className="eyebrow">Promotion</p>
          <h2 className="mt-2 font-display text-2xl text-cream md:text-3xl">
            {promo.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-fog md:text-base">
            {promo.body}
          </p>
        </div>
        <Link href={promo.ctaHref || "/begin"} className="btn-primary shrink-0">
          {promo.ctaLabel || "Begin"}
        </Link>
      </div>
    </section>
  );
}
