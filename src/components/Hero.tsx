"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";

export function Hero() {
  const { t } = useLang();

  return (
    <section
      id="top"
      className="relative isolate min-h-[100svh] overflow-hidden"
    >
      <div className="absolute inset-0">
        <Image
          src="/images/hero.jpg"
          alt="Islamic spiritual atmosphere — Redeemysoul Spiritual Healing Shazli Karachi"
          fill
          priority
          sizes="100vw"
          className="hero-media object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,20,16,0.5)_0%,rgba(6,20,16,0.68)_42%,rgba(6,20,16,0.96)_100%)]" />
        <div className="hero-glow absolute -left-24 top-24 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
        <div className="hero-glow absolute bottom-16 right-0 h-80 w-80 rounded-full bg-fog/8 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-end px-6 pb-20 pt-32 md:px-10 md:pb-28">
        <p className="reveal font-display text-5xl leading-none tracking-[0.04em] text-cream sm:text-6xl md:text-8xl lg:text-9xl">
          Redeemysoul
        </p>
        <p className="reveal reveal-delay-1 mt-4 text-xs tracking-[0.18em] uppercase text-gold md:text-sm">
          {t.hero.brandLine}
        </p>
        <div className="gold-rule reveal reveal-delay-1 mt-7 h-px w-40 bg-gold md:w-56" />
        <h1 className="reveal reveal-delay-2 mt-8 max-w-2xl font-display text-2xl leading-tight text-cream sm:text-3xl md:text-4xl">
          {t.hero.headline}
        </h1>
        <p className="reveal reveal-delay-3 mt-5 max-w-xl text-base leading-relaxed text-fog md:text-lg">
          {t.hero.support}
        </p>
        <div className="reveal reveal-delay-4 mt-11 flex flex-wrap items-center gap-3 md:gap-4">
          <Link href="/begin" className="btn-primary">
            {t.hero.ctaBegin}
          </Link>
          <a href="#services" className="btn-ghost">
            {t.hero.ctaServices}
          </a>
        </div>
      </div>
    </section>
  );
}
