"use client";

import Image from "next/image";
import { useLang } from "@/lib/i18n";

export function Atmosphere() {
  const { t } = useLang();

  return (
    <section className="relative overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <Image
          src="/images/stillness.jpg"
          alt="Peaceful mosque light — Islamic spiritual healing atmosphere in Karachi"
          fill
          sizes="100vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,20,16,0.92)_0%,rgba(6,20,16,0.55)_55%,rgba(6,20,16,0.88)_100%)]" />
      </div>
      <div className="relative mx-auto flex min-h-[28rem] max-w-7xl items-center px-6 py-24 md:px-10 md:py-28">
        <blockquote className="max-w-2xl">
          <div className="mb-8 h-px w-16 bg-gold" />
          <p className="font-display text-3xl leading-snug text-cream md:text-5xl">
            {t.atmosphere.quote}
          </p>
          <footer className="mt-8 text-sm tracking-[0.18em] uppercase text-gold">
            {t.atmosphere.credit}
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
