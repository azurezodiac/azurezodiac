import type { Metadata } from "next";
import Link from "next/link";
import { AdminPortal } from "@/components/admin/AdminPortal";

export const metadata: Metadata = {
  title: "Admin — Redeemysoul",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
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
          <span className="text-xs tracking-[0.16em] uppercase text-fog">
            Leads · Posts · Pricing · Promos
          </span>
        </div>
      </header>
      <main className="px-6 py-14 md:px-10 md:py-20">
        <AdminPortal />
      </main>
    </div>
  );
}
