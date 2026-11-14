"use client";

import { useLang } from "@/lib/i18n";

export function Trust() {
  const { t } = useLang();

  return (
    <section id="trust" className="border-y border-line bg-ink">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-3 md:px-10 md:py-24">
        {t.trust.items.map((item) => (
          <div key={item.title}>
            <p className="text-xs tracking-[0.22em] uppercase text-gold">
              {item.eyebrow}
            </p>
            <h2 className="mt-4 font-display text-2xl text-cream md:text-3xl">
              {item.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-fog md:text-base">
              {item.copy}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
