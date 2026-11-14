"use client";

import Link from "next/link";
import { HealingDisclaimer } from "@/components/HealingDisclaimer";
import { useLang } from "@/lib/i18n";
import { SITE } from "@/lib/seo";

export function SiteFooter() {
  const { t } = useLang();

  return (
    <footer className="border-t border-line bg-ink max-md:pb-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-12 md:px-10 md:py-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-display text-2xl tracking-[0.06em] text-cream">
              Redeemysoul
            </p>
            <p className="mt-2 text-sm text-gold">{SITE.businessName}</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-fog">
              {t.footer.blurb}
            </p>
            <HealingDisclaimer className="mt-4 max-w-md" />
            <p className="mt-4 max-w-md text-xs leading-relaxed text-fog/80">
              {t.footer.privacy}
            </p>
          </div>

          <address className="not-italic text-sm leading-relaxed text-fog">
            <p className="text-xs tracking-[0.16em] uppercase text-gold">
              Contact
            </p>
            <p className="mt-3 font-display text-lg text-cream">
              {SITE.healer}
            </p>
            <p className="mt-3 max-w-xs">{SITE.address.street}</p>
            <p>
              {SITE.address.city}, {SITE.address.region},{" "}
              {SITE.address.countryName}
            </p>
            <p className="mt-3">
              <a
                href={`tel:${SITE.phoneE164}`}
                className="hover:text-gold-bright"
              >
                {SITE.phoneDisplay}
              </a>
            </p>
            <p className="mt-1">
              <a
                href={`mailto:${SITE.email}`}
                className="hover:text-gold-bright"
              >
                {SITE.email}
              </a>
            </p>
            <p className="mt-1">
              <a
                href={SITE.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold-bright"
              >
                Google Maps — {SITE.businessName}
              </a>
            </p>
          </address>

          <div className="flex flex-col gap-3 text-xs tracking-[0.14em] uppercase text-fog">
            <Link href="/begin" className="hover:text-gold-bright">
              {t.footer.begin}
            </Link>
            <Link href="/#learn" className="hover:text-gold-bright">
              {t.nav.learn}
            </Link>
            <Link href="/topics" className="hover:text-gold-bright">
              {t.nav.topics}
            </Link>
            <Link href="/blog" className="hover:text-gold-bright">
              {t.nav.blog}
            </Link>
            <Link href="/locations" className="hover:text-gold-bright">
              {t.nav.locations}
            </Link>
            <Link href="/templates" className="hover:text-gold-bright">
              {t.nav.templates}
            </Link>
            <Link href="/pricing" className="hover:text-gold-bright">
              {t.nav.pricing}
            </Link>
            <Link href="/#services" className="hover:text-gold-bright">
              {t.nav.services}
            </Link>
            <Link href="/topics/jadoo-sihr-sifli" className="hover:text-gold-bright">
              Jadoo / Sihr
            </Link>
            <Link href="/topics/jadoo-sihr-sifli/ur" className="hover:text-gold-bright">
              جادو / سحر
            </Link>
            <Link href="/locations/lahore" className="hover:text-gold-bright">
              Lahore
            </Link>
            <Link href="/locations/uk" className="hover:text-gold-bright">
              UK
            </Link>
            <a
              href={`mailto:${SITE.email}`}
              className="hover:text-gold-bright"
            >
              {t.footer.email}
            </a>
            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold-bright"
            >
              {t.footer.whatsapp}
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-line pt-6 text-xs text-fog/70 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name} · {SITE.businessName}
          </p>
          <p>Karachi, Pakistan · Islamic spiritual healing</p>
        </div>
      </div>
    </footer>
  );
}
