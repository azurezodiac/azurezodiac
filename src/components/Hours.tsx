"use client";

import { useLang } from "@/lib/i18n";

export function Hours() {
  const { t } = useLang();

  return (
    <section id="hours" className="bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="max-w-2xl" data-reveal>
          <p className="eyebrow">{t.hours.eyebrow}</p>
          <h2 className="mt-5 font-display text-4xl leading-tight text-cream md:text-5xl">
            {t.hours.title}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-fog">
            {t.hours.intro}
          </p>
        </div>

        <dl
          className="mt-12 grid gap-6 border-y border-line py-8 md:grid-cols-2"
          data-stagger
        >
          {t.hours.items.map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-6"
            >
              <dt className="text-xs tracking-[0.16em] uppercase text-fog">
                {item.label}
              </dt>
              <dd className="font-display text-xl text-cream md:text-end">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-fog">
          {t.hours.note}
        </p>
      </div>
    </section>
  );
}
