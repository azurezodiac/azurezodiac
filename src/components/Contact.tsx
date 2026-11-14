"use client";

import Link from "next/link";
import { HealingDisclaimer } from "@/components/HealingDisclaimer";
import { useLang } from "@/lib/i18n";

export function Contact() {
  const { t } = useLang();

  return (
    <section id="contact" className="bg-ink-soft">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <p className="text-xs tracking-[0.22em] uppercase text-gold">
          {t.contact.eyebrow}
        </p>
        <h2 className="mt-5 max-w-2xl font-display text-4xl leading-tight text-cream md:text-5xl">
          {t.contact.title}
        </h2>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-fog">
          {t.contact.intro}
        </p>
        <HealingDisclaimer className="mt-6 max-w-lg" />
        <div className="mt-10 flex flex-wrap gap-3">
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
