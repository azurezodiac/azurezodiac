"use client";

import { HealingDisclaimer } from "@/components/HealingDisclaimer";
import { useLang } from "@/lib/i18n";

const MAPS_QUERY = "Spiritual Healing Shazli Karachi";
const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(MAPS_QUERY)}&hl=en&z=16&output=embed`;
const MAPS_OPEN_HREF = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAPS_QUERY)}`;

export function Location() {
  const { t } = useLang();

  return (
    <section id="visit" className="bg-ink-soft">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="max-w-2xl" data-reveal>
          <p className="eyebrow">{t.location.eyebrow}</p>
          <h2 className="mt-5 font-display text-4xl leading-tight text-cream md:text-5xl">
            {t.location.title}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-fog">
            {t.location.intro}
          </p>
          <HealingDisclaimer className="mt-6" />
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <div
            className="flex flex-col justify-between gap-8 border-y border-line py-8 lg:border-y-0 lg:border-s lg:py-0 lg:ps-10"
            data-reveal="left"
          >
            <div>
              <p className="text-xs tracking-[0.18em] uppercase text-fog">
                Google Business
              </p>
              <p className="mt-3 font-display text-2xl text-cream md:text-3xl">
                {t.location.business}
              </p>
              <p className="mt-5 max-w-md text-base leading-relaxed text-fog">
                {t.location.address}
              </p>
            </div>
            <a
              href={MAPS_OPEN_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-3 border border-gold/50 px-5 py-3 text-xs tracking-[0.16em] uppercase text-gold transition-colors duration-300 hover:border-gold-bright hover:text-gold-bright"
            >
              {t.location.openMaps}
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <div
            className="relative min-h-[280px] overflow-hidden border border-line bg-ink md:min-h-[360px]"
            data-reveal="right"
          >
            <iframe
              title={`${t.location.business} map`}
              src={MAP_EMBED_SRC}
              className="absolute inset-0 h-full w-full border-0 grayscale-[20%] contrast-[1.05] transition-[filter] duration-500 hover:grayscale-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
