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
              href="/"
              className="text-xs tracking-[0.16em] uppercase text-fog transition-colors duration-300 hover:text-gold-bright"
            >
              Home
            </Link>
          </div>
        </div>
      </header>
      <main className="px-6 py-14 md:px-10 md:py-20">
        <BeginFlow />
      </main>
    </div>
  );
}
