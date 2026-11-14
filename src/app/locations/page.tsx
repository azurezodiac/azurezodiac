import type { Metadata } from "next";
import Link from "next/link";
import { HealingDisclaimer } from "@/components/HealingDisclaimer";
import { SeoChrome } from "@/components/SeoChrome";
import { CITY_PAGES } from "@/lib/cities";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute:
      "Spiritual Healing Lahore Islamabad UK UAE | Online | Redeemysoul",
  },
  description:
    "City and diaspora landing pages: Lahore, Islamabad, UK, UAE — private online Islamic spiritual healing with Spiritual Healing Shazli. Pakistan PKR 5,000 / International USD 50 Hadiya.",
  alternates: { canonical: absoluteUrl("/locations") },
};

export default function LocationsIndexPage() {
  return (
    <div className="min-h-full bg-ink">
      <SeoChrome
        extraLinks={[
          { href: "/pricing", label: "Pricing" },
          { href: "/blog", label: "Blog" },
        ]}
      />
      <main className="mx-auto w-full max-w-7xl px-6 py-14 md:px-10 md:py-20">
        <p className="text-xs tracking-[0.22em] uppercase text-gold">
          Cities & diaspora
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-4xl leading-tight text-cream md:text-5xl">
          Online from Karachi — serving Lahore, Islamabad, UK & UAE
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-fog">
          Spiritual Healing Shazli consults privately online first. Pakistan
          Hadiya PKR 5,000 · International Hadiya USD 50 for first diagnosis
          review. Baldia office visits by appointment after first message.
        </p>
        <HealingDisclaimer className="mt-6 max-w-2xl" />

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {CITY_PAGES.map((city) => (
            <Link
              key={city.slug}
              href={`/locations/${city.slug}`}
              className="border border-line bg-ink-soft/40 p-6 transition-colors duration-300 hover:border-gold/60"
            >
              <p className="text-xs tracking-[0.16em] uppercase text-gold">
                {city.regionLabel}
              </p>
              <h2 className="mt-3 font-display text-3xl text-cream">
                {city.name}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-fog">
                {city.intro.slice(0, 140)}…
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
