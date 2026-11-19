"use client";

import Image from "next/image";
import { useLang } from "@/lib/i18n";

export function Atmosphere() {
  const { t } = useLang();

  return (
    <section className="relative overflow-hidden bg-ink">
      <div className="absolute inset-0" data-parallax="18">
        <Image
          src="/images/stillness.jpg"
          alt="Mosque under soft evening light — Redeemysoul atmosphere"
          fill
          sizes="100vw"
          className="object-cover opacity-50 scale-105"
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(6,20,16,0.94)_0%,rgba(6,20,16,0.58)_52%,rgba(6,20,16,0.9)_100%)]" />
      </div>
      <div className="relative mx-auto flex min-h-[30rem] max-w-7xl items-center px-6 py-24 md:px-10 md:py-32">
        <blockquote className="max-w-2xl" data-reveal="zoom">
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
