"use client";

import { useLang } from "@/lib/i18n";

export function Testimonials() {
  const { t } = useLang();

  return (
    <section id="experiences" className="bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="max-w-2xl">
          <p className="text-xs tracking-[0.22em] uppercase text-gold">
            {t.testimonials.eyebrow}
          </p>
          <h2 className="mt-5 font-display text-4xl leading-tight text-cream md:text-5xl">
            {t.testimonials.title}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-fog">
            {t.testimonials.intro}
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {t.testimonials.items.map((item) => (
            <figure
              key={`${item.name}-${item.place}`}
              className="border-t border-line pt-6"
            >
              <blockquote className="text-base leading-relaxed text-mist">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-5 text-sm text-gold">
                {item.name}
                <span className="text-fog"> · {item.place}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
