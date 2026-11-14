import type { Metadata } from "next";
import Link from "next/link";
import { BeginFlow } from "@/components/begin/BeginFlow";
import { LanguageToggle } from "@/components/LanguageToggle";

export const metadata: Metadata = {
  title: "Begin healing — Redeemysoul",
  description:
    "Start a private Redeemysoul consultation. Spiritual healing is not a substitute for medical treatment. Shifa is from Allah alone. No guarantee of healing.",
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
