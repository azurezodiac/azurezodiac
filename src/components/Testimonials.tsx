"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";

export function Testimonials() {
  const { t } = useLang();
  const items = t.testimonials.items;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length < 2) return;
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % items.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, [paused, items.length]);

  return (
    <section id="experiences" className="bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="max-w-2xl" data-reveal>
          <p className="eyebrow">{t.testimonials.eyebrow}</p>
          <h2 className="mt-5 font-display text-4xl leading-tight text-cream md:text-5xl">
            {t.testimonials.title}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-fog">
            {t.testimonials.intro}
          </p>
        </div>

        <div
          className="relative mt-14"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          data-reveal="zoom"
        >
          <div className="overflow-hidden border-y border-line">
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transform: `translateX(-${active * 100}%)` }}
            >
              {items.map((item) => (
                <figure
                  key={`${item.name}-${item.place}`}
                  className="min-w-full px-1 py-10 md:px-4 md:py-12"
                >
                  <blockquote className="mx-auto max-w-3xl font-display text-2xl leading-snug text-cream md:text-4xl">
                    “{item.quote}”
                  </blockquote>
                  <figcaption className="mx-auto mt-8 max-w-3xl text-sm text-gold">
                    {item.name}
                    <span className="text-fog"> · {item.place}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between gap-4">
            <div className="flex gap-2" role="tablist" aria-label="Experiences">
              {items.map((item, index) => (
                <button
                  key={`${item.name}-dot`}
                  type="button"
                  role="tab"
                  aria-selected={active === index}
                  aria-label={`Show experience ${index + 1}`}
                  onClick={() => setActive(index)}
                  className={`h-1.5 w-8 transition-colors duration-300 ${
                    active === index ? "bg-gold" : "bg-line hover:bg-fog/40"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn-ghost !px-3 !py-2 text-[11px]"
                aria-label="Previous"
                onClick={() =>
                  setActive((prev) => (prev - 1 + items.length) % items.length)
                }
              >
                Prev
              </button>
              <button
                type="button"
                className="btn-ghost !px-3 !py-2 text-[11px]"
                aria-label="Next"
                onClick={() => setActive((prev) => (prev + 1) % items.length)}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Crawlable list for SEO (visually muted) */}
        <ul className="sr-only">
          {items.map((item) => (
            <li key={`seo-${item.name}`}>
              {item.quote} — {item.name}, {item.place}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
