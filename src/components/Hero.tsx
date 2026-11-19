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
          alt="Sacred light at the Kaaba — Redeemysoul Islamic healing"
          fill
          priority
          sizes="100vw"
          className="hero-media object-cover object-[center_28%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,14,11,0.42)_0%,rgba(6,20,16,0.62)_38%,rgba(6,20,16,0.94)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,transparent,rgba(6,20,16,1))]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-end px-4 pb-20 pt-28 sm:px-6 md:px-10 md:pb-24 md:pt-32">
        <p
          className="reveal font-display text-[clamp(2.75rem,12vw,8.5rem)] leading-[0.9] tracking-[0.03em] text-cream"
          dir="ltr"
          lang="en"
        >
          Redeemysoul
        </p>
        <h1 className="reveal reveal-delay-1 mt-8 max-w-2xl font-display text-[clamp(1.45rem,3.4vw,2.35rem)] leading-[1.15] text-cream/95">
          {t.hero.headline}
        </h1>
        <p className="reveal reveal-delay-2 mt-5 max-w-xl text-base leading-relaxed text-fog md:text-lg">
          {t.hero.support}
        </p>
        <div className="reveal reveal-delay-3 mt-10 flex flex-wrap items-center gap-3 md:gap-4">
          <Link href="/begin" className="btn-primary">
            {t.hero.ctaBegin}
          </Link>
          <a href="#services" className="btn-ghost">
            {t.hero.ctaServices}
          </a>
        </div>
        <p className="reveal reveal-delay-4 mt-8 text-[11px] tracking-[0.18em] uppercase text-fog/70">
          {t.hero.brandLine}
        </p>
      </div>
    </section>
  );
}
