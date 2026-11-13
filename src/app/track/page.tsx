import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { TrackLookup } from "@/components/track/TrackLookup";

export const metadata: Metadata = {
  title: "Track request — Redeemysoul",
  description: "Check the status of your Redeemysoul consultation request.",
};

export default function TrackPage() {
  return (
    <div className="min-h-full bg-ink">
      <header className="border-b border-line">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-10">
          <Link
            href="/"
            className="font-display text-xl tracking-[0.08em] text-cream md:text-2xl"
          >
            Redeemysoul
          </Link>
          <Link
            href="/begin"
            className="text-xs tracking-[0.16em] uppercase text-fog transition-colors duration-300 hover:text-gold-bright"
          >
            Begin healing
          </Link>
        </div>
      </header>
      <main className="px-6 py-14 md:px-10 md:py-20">
        <Suspense
          fallback={
            <p className="text-center text-fog">Loading tracker...</p>
          }
        >
          <TrackLookup />
        </Suspense>
      </main>
    </div>
  );
}
