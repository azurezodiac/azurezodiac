"use client";

import Link from "next/link";
import { HealingDisclaimer } from "@/components/HealingDisclaimer";
import { useLang } from "@/lib/i18n";
import { SEO_TOPICS } from "@/lib/seo-topics";

export function Learn() {
  const { t } = useLang();

  return (
    <section id="learn" className="bg-ink-soft">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="max-w-3xl">
          <p className="text-xs tracking-[0.22em] uppercase text-gold">
            {t.learn.eyebrow}
          </p>
          <h2 className="mt-5 font-display text-4xl leading-tight text-cream md:text-5xl">
            {t.learn.title}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-fog">
            {t.learn.intro}
          </p>
          <p className="mt-5 text-sm leading-relaxed text-fog/90 md:text-base">
            {t.learn.audience}
          </p>
        </div>

        <div className="mt-16 divide-y divide-line border-y border-line">
          {t.learn.topics.map((topic, index) => (
            <article key={topic.title} className="grid gap-3 py-8 md:grid-cols-[4rem_1fr] md:gap-8">
              <span className="font-display text-2xl text-gold/70">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-2xl text-cream md:text-3xl">
                  {topic.title}
                </h3>
                <p className="mt-3 max-w-3xl text-base leading-relaxed text-fog">
                  {topic.copy}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20 max-w-3xl">
          <h3 className="font-display text-3xl leading-tight text-cream md:text-4xl">
            {t.learn.effectsTitle}
          </h3>
          <p className="mt-5 text-base leading-relaxed text-fog">
            {t.learn.effectsIntro}
          </p>
          <ul className="mt-8 space-y-4 border-t border-line pt-8">
            {t.learn.effects.map((effect) => (
              <li
                key={effect.slice(0, 40)}
                className="text-base leading-relaxed text-fog"
              >
                <span className="me-3 text-gold" aria-hidden="true">
                  —
                </span>
                {effect}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-20 max-w-3xl">
          <h3 className="font-display text-3xl leading-tight text-cream md:text-4xl">
            {t.learn.marriageTitle}
          </h3>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-fog">
            {t.learn.marriageBody.map((paragraph) => (
              <p key={paragraph.slice(0, 28)}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="mt-20 grid gap-12 border-t border-line pt-12 lg:grid-cols-2">
          <div>
            <p className="text-xs tracking-[0.18em] uppercase text-gold">
              {t.learn.refsTitle}
            </p>
            <h3 className="mt-4 font-display text-2xl text-cream">
              {t.learn.refsMuslimTitle}
            </h3>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-fog md:text-base">
              {t.learn.refsMuslim.map((ref) => (
                <li key={ref}>
                  <span className="me-2 text-gold" aria-hidden="true">
                    —
                  </span>
                  {ref}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs tracking-[0.18em] uppercase text-gold">
              {t.learn.refsTitle}
            </p>
            <h3 className="mt-4 font-display text-2xl text-cream">
              {t.learn.refsGeneralTitle}
            </h3>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-fog md:text-base">
              {t.learn.refsGeneral.map((ref) => (
                <li key={ref}>
                  <span className="me-2 text-gold" aria-hidden="true">
                    —
                  </span>
                  {ref}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-line pt-10">
          <h3 className="font-display text-2xl text-cream md:text-3xl">
            {t.nav.topics}
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-fog">
            Jadoo · Sihr · Sifli · Jinnat · Aseeb · Bandish · Taweez · Spiritual
            Reiki · SAMADA Energies · Magic Grimoire · Ruqyah Karachi
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {SEO_TOPICS.map((topic) => (
              <Link
                key={topic.slug}
                href={`/topics/${topic.slug}`}
                className="border border-line px-4 py-2 text-sm text-fog transition-colors duration-300 hover:border-gold hover:text-gold-bright"
              >
                {topic.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-16 max-w-3xl border-t border-line pt-8">
          <p className="text-base leading-relaxed text-fog">{t.learn.closing}</p>
          <HealingDisclaimer className="mt-6" />
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/begin"
              className="inline-flex bg-gold px-7 py-3.5 text-sm tracking-[0.14em] uppercase text-ink transition-colors duration-300 hover:bg-gold-bright"
            >
              {t.nav.begin}
            </Link>
            <Link
              href="/topics"
              className="inline-flex border border-mist/25 px-7 py-3.5 text-sm tracking-[0.14em] uppercase text-mist transition-colors duration-300 hover:border-gold hover:text-gold-bright"
            >
              {t.nav.topics}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
