"use client";

import Link from "next/link";
import { HealingDisclaimer } from "@/components/HealingDisclaimer";
import { useLang } from "@/lib/i18n";

export function Contact() {
  const { t } = useLang();

  return (
    <section id="contact" className="relative overflow-hidden bg-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(201,166,90,0.1),transparent_60%)]"
      />
      <div
        className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-36"
        data-reveal
      >
        <p className="eyebrow">{t.contact.eyebrow}</p>
        <h2 className="mt-5 max-w-2xl font-display text-4xl leading-tight text-cream md:text-6xl">
          {t.contact.title}
        </h2>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-fog md:text-lg">
          {t.contact.intro}
        </p>
        <HealingDisclaimer className="mt-6 max-w-lg" />
        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/begin" className="btn-primary">
            {t.contact.ctaBegin}
          </Link>
          <a
            href="https://wa.me/923452845400"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            {t.contact.ctaWhatsapp}
          </a>
        </div>
      </div>
    </section>
  );
}
