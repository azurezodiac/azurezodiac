"use client";

import { useLang } from "@/lib/i18n";

export function Disclaimer() {
  const { t } = useLang();

  return (
    <section id="disclaimer" className="border-y border-line bg-ink-soft">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
        <p className="text-xs tracking-[0.22em] uppercase text-gold">
          {t.disclaimer.eyebrow}
        </p>
        <h2 className="mt-4 max-w-3xl font-display text-2xl leading-tight text-cream md:text-3xl">
          {t.disclaimer.title}
        </h2>
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-fog md:text-base">
          {t.disclaimer.body}
        </p>
      </div>
    </section>
  );
}
