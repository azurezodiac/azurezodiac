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
        <ul className="mt-8 max-w-3xl space-y-4 border-t border-line pt-8">
          {t.disclaimer.points.map((point) => (
            <li
              key={point.slice(0, 32)}
              className="text-sm leading-relaxed text-fog md:text-base"
            >
              <span className="me-3 text-gold" aria-hidden="true">
                —
              </span>
              {point}
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-3xl border-t border-line pt-6 text-sm font-medium leading-relaxed text-cream/90">
          {t.disclaimer.short}
        </p>
      </div>
    </section>
  );
}
