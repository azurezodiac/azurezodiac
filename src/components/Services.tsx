"use client";

import { useLang } from "@/lib/i18n";

export function Services() {
  const { t } = useLang();

  return (
    <section id="services" className="relative bg-ink-soft">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 md:grid-cols-[0.9fr_1.1fr] md:px-10 md:py-32">
        <div>
          <p className="text-xs tracking-[0.22em] uppercase text-gold">
            {t.services.eyebrow}
          </p>
          <h2 className="mt-5 font-display text-4xl leading-tight text-cream md:text-5xl">
            {t.services.title}
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-fog">
            {t.services.intro}
          </p>
        </div>

        <div className="divide-y divide-line border-y border-line">
          {t.services.items.map((service, index) => (
            <article
              key={service.title}
              className="group grid gap-3 py-8 transition-colors duration-300 md:grid-cols-[4rem_1fr] md:gap-8"
            >
              <span className="font-display text-2xl text-gold/70 transition-colors duration-300 group-hover:text-gold-bright">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-2xl text-cream md:text-3xl">
                  {service.title}
                </h3>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-fog">
                  {service.copy}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
