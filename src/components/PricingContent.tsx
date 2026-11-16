"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HealingDisclaimer } from "@/components/HealingDisclaimer";
import { LanguageToggle } from "@/components/LanguageToggle";
import type { CmsPricingItem } from "@/lib/cms-types";
import { HADIYA } from "@/lib/consultation";
import { useLang } from "@/lib/i18n";

export function PricingContent() {
  const { t } = useLang();
  const [cmsPricing, setCmsPricing] = useState<CmsPricingItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/cms/public");
        if (!res.ok) return;
        const data = (await res.json()) as {
          cms?: { pricing?: CmsPricingItem[] };
        };
        if (!cancelled) setCmsPricing(data.cms?.pricing ?? []);
      } catch {
        // static fallback
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-full bg-ink">
      <header className="border-b border-line">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-6 py-6 md:px-10">
          <Link
            href="/"
            className="font-display text-xl tracking-[0.08em] text-cream md:text-2xl"
          >
            Redeemysoul
          </Link>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Link
              href="/begin"
              className="border border-gold/50 px-3 py-2 text-[11px] tracking-[0.14em] uppercase text-gold transition-colors duration-300 hover:border-gold-bright hover:text-gold-bright"
            >
              {t.nav.begin}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-6 py-14 md:px-10 md:py-20">
        <p className="text-xs tracking-[0.22em] uppercase text-gold">
          {t.pricing.eyebrow}
        </p>
        <h1 className="mt-5 font-display text-4xl leading-tight text-cream md:text-5xl">
          {t.pricing.title}
        </h1>
        <p className="mt-6 text-base leading-relaxed text-fog">
          {t.pricing.intro}
        </p>
        <HealingDisclaimer className="mt-6" />

        <section className="mt-14 border-y border-line py-10">
          <h2 className="font-display text-3xl text-cream">
            {t.pricing.diagnosisTitle}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-fog">
            {t.pricing.diagnosisBody}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {cmsPricing.length > 0
              ? cmsPricing.map((row) => (
                  <div key={row.id} className="border border-line px-5 py-6">
                    <p className="text-xs tracking-[0.16em] uppercase text-gold">
                      {row.label}
                    </p>
                    <p className="mt-3 font-display text-3xl text-cream">
                      {row.amount}
                    </p>
                    <p className="mt-3 break-all text-sm text-fog">
                      {row.method}
                    </p>
                    <p className="mt-2 text-xs text-fog/70">{row.note}</p>
                  </div>
                ))
              : (
                  <>
                    <div className="border border-line px-5 py-6">
                      <p className="text-xs tracking-[0.16em] uppercase text-gold">
                        {t.pricing.pkLabel}
                      </p>
                      <p className="mt-3 font-display text-3xl text-cream">
                        {t.pricing.pkAmount}
                      </p>
                      <p className="mt-3 text-sm text-fog">{t.pricing.pkMethod}</p>
                      <p className="mt-2 text-xs text-fog/70">
                        {HADIYA.pakistan.method}
                      </p>
                    </div>
                    <div className="border border-line px-5 py-6">
                      <p className="text-xs tracking-[0.16em] uppercase text-gold">
                        {t.pricing.intlLabel}
                      </p>
                      <p className="mt-3 font-display text-3xl text-cream">
                        {t.pricing.intlAmount}
                      </p>
                      <p className="mt-3 break-all text-sm text-fog">
                        {t.pricing.intlMethod}
                      </p>
                      <p className="mt-2 text-xs text-fog/70">
                        {HADIYA.international.method}
                      </p>
                    </div>
                  </>
                )}
          </div>
        </section>

        <section className="mt-12 space-y-8">
          <div>
            <h2 className="font-display text-2xl text-cream md:text-3xl">
              {t.pricing.furtherTitle}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-fog">
              {t.pricing.furtherBody}
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl text-cream md:text-3xl">
              {t.pricing.appointmentTitle}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-fog">
              {t.pricing.appointmentBody}
            </p>
          </div>
        </section>

        <p className="mt-10 text-sm leading-relaxed text-fog/85">
          {t.pricing.note}
        </p>

        <Link href="/begin" className="btn-primary mt-8">
          {t.pricing.cta}
        </Link>
      </main>
    </div>
  );
}
