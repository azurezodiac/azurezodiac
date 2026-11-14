import type { Metadata } from "next";
import Link from "next/link";
import { BeginFlow } from "@/components/begin/BeginFlow";
import { LanguageToggle } from "@/components/LanguageToggle";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Begin Islamic Healing Consultation",
  description:
    "Start a private Redeemysoul consultation with Spiritual Healing Shazli in Karachi. Share your concern for nazar, sihr, bandish, or spiritual strain. Not a medical substitute. Shifa is from Allah alone. No guarantee of healing.",
  alternates: {
    canonical: absoluteUrl("/begin"),
  },
  openGraph: {
    url: absoluteUrl("/begin"),
    title: "Begin Islamic Healing Consultation | Redeemysoul",
    description:
      "Private consultation request for Islamic healing and ruqyah-centered guidance in Karachi.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BeginPage() {
  return (
    <div className="min-h-full bg-ink">
      <header className="border-b border-line bg-ink/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-6 py-5 md:px-10 md:py-6">
          <Link
            href="/"
            className="font-display text-xl tracking-[0.08em] text-cream md:text-2xl"
          >
            Redeemysoul
          </Link>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Link
              href="/"
              className="text-xs tracking-[0.16em] uppercase text-fog transition-colors duration-300 hover:text-gold-bright"
            >
              Home
            </Link>
          </div>
        </div>
      </header>
      <main className="relative px-6 py-14 md:px-10 md:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(201,166,90,0.08),transparent_65%)]"
        />
        <div className="relative">
          <BeginFlow />
        </div>
      </main>
    </div>
  );
}
