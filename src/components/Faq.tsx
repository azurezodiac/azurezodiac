"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";

export function Faq() {
  const { t } = useLang();
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="bg-ink-soft">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-[0.9fr_1.1fr] md:px-10 md:py-32">
        <div>
          <p className="text-xs tracking-[0.22em] uppercase text-gold">
            {t.faq.eyebrow}
          </p>
          <h2 className="mt-5 font-display text-4xl leading-tight text-cream md:text-5xl">
            {t.faq.title}
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-fog">
            {t.faq.intro}
          </p>
        </div>

        <div className="divide-y divide-line border-y border-line">
          {t.faq.items.map((item, index) => {
            const isOpen = open === index;
            return (
              <div key={item.q} className="py-5">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  className="flex w-full items-start justify-between gap-4 text-start"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-xl text-cream md:text-2xl">
                    {item.q}
                  </span>
                  <span className="mt-1 text-gold">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen ? (
                  <p className="mt-3 max-w-xl text-base leading-relaxed text-fog">
                    {item.a}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
