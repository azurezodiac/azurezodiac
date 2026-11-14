import Link from "next/link";
import { HealingDisclaimer } from "@/components/HealingDisclaimer";
import { SeoChrome } from "@/components/SeoChrome";
import type { CityPage } from "@/lib/cities";
import { CITY_PAGES } from "@/lib/cities";
import { SITE, absoluteUrl } from "@/lib/seo";

export function CityLanding({ city }: { city: CityPage }) {
  const others = CITY_PAGES.filter((item) => item.slug !== city.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Islamic spiritual healing for ${city.name}`,
    provider: {
      "@type": "LocalBusiness",
      name: SITE.businessName,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Karachi",
        addressCountry: "PK",
      },
    },
    areaServed: city.name,
    url: absoluteUrl(`/locations/${city.slug}`),
    description: city.metaDescription,
  };

  return (
    <div className="min-h-full bg-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SeoChrome
        extraLinks={[
          { href: "/locations", label: "Cities" },
          { href: "/pricing", label: "Pricing" },
        ]}
      />

      <main className="mx-auto w-full max-w-3xl px-6 py-14 md:px-10 md:py-20">
        <p className="text-xs tracking-[0.22em] uppercase text-gold">
          {city.regionLabel} · {SITE.businessName}
        </p>
        <h1 className="mt-5 font-display text-4xl leading-tight text-cream md:text-5xl">
          {city.h1}
        </h1>
        <p className="mt-6 text-base leading-relaxed text-cream/95">
          {city.intro}
        </p>
        <p className="mt-4 border border-line bg-ink-soft/50 px-5 py-4 text-sm leading-relaxed text-gold-bright">
          {city.hadiyaNote}
        </p>
        <HealingDisclaimer className="mt-6" />

        <div className="mt-14 space-y-10">
          {city.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-2xl text-cream md:text-3xl">
                {section.heading}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-fog">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/begin"
            className="bg-gold px-7 py-3.5 text-sm tracking-[0.14em] uppercase text-ink transition-colors duration-300 hover:bg-gold-bright"
          >
            Begin healing
          </Link>
          <Link
            href="/templates"
            className="border border-mist/25 px-7 py-3.5 text-sm tracking-[0.14em] uppercase text-mist transition-colors duration-300 hover:border-gold hover:text-gold-bright"
          >
            WhatsApp templates
          </Link>
          <Link
            href="/pricing"
            className="border border-mist/25 px-7 py-3.5 text-sm tracking-[0.14em] uppercase text-mist transition-colors duration-300 hover:border-gold hover:text-gold-bright"
          >
            Pricing
          </Link>
        </div>

        <section className="mt-14 border-t border-line pt-10">
          <h2 className="font-display text-2xl text-cream">Also serving</h2>
          <ul className="mt-6 flex flex-wrap gap-3">
            {others.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/locations/${item.slug}`}
                  className="border border-line px-4 py-2 text-sm text-fog transition-colors duration-300 hover:border-gold hover:text-gold-bright"
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/topics/spiritual-healing-karachi"
                className="border border-line px-4 py-2 text-sm text-fog transition-colors duration-300 hover:border-gold hover:text-gold-bright"
              >
                Karachi
              </Link>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
