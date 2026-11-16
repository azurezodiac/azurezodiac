"use client";

import { HealingDisclaimer } from "@/components/HealingDisclaimer";
import { useLang } from "@/lib/i18n";

export function About() {
  const { t } = useLang();

  return (
    <section id="about" className="bg-ink-soft">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-24 md:grid-cols-[0.9fr_1.1fr] md:px-10 md:py-32">
        <div data-reveal="left">
          <p className="eyebrow">{t.about.eyebrow}</p>
          <h2 className="mt-5 font-display text-4xl leading-tight text-cream md:text-5xl">
            {t.about.title}
          </h2>
        </div>
        <div className="space-y-5 text-base leading-relaxed text-fog" data-reveal="right">
          {t.about.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
          <HealingDisclaimer className="border-t border-line pt-6" />
        </div>
      </div>
    </section>
  );
}
