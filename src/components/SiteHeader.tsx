"use client";

import Link from "next/link";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLang } from "@/lib/i18n";

export function SiteHeader({ variant = "home" }: { variant?: "home" | "page" }) {
  const { t } = useLang();
  const links = [
    { href: "#services", label: t.nav.services },
    { href: "#learn", label: t.nav.learn },
    { href: "/topics", label: t.nav.topics },
    { href: "/pricing", label: t.nav.pricing },
    { href: "#visit", label: t.nav.visit },
    { href: "/begin", label: t.nav.begin },
  ];

  return (
    <header
      className={
        variant === "home"
          ? "absolute inset-x-0 top-0 z-20"
          : "border-b border-line"
      }
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-6 py-6 md:px-10">
        <a
          href={variant === "home" ? "#top" : "/"}
          className="font-display text-xl tracking-[0.08em] text-cream md:text-2xl"
        >
          Redeemysoul
        </a>
        <nav className="hidden items-center gap-8 text-sm tracking-[0.14em] uppercase text-fog md:flex">
          {links.map((link) =>
            link.href.startsWith("/") ? (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors duration-300 hover:text-gold-bright"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={variant === "home" ? link.href : `/${link.href}`}
                className="transition-colors duration-300 hover:text-gold-bright"
              >
                {link.label}
              </a>
            ),
          )}
        </nav>
        <div className="flex items-center gap-2 md:gap-3">
          <LanguageToggle />
          <Link
            href="/begin"
            className="border border-gold/50 px-3 py-2 text-[11px] tracking-[0.14em] uppercase text-gold transition-colors duration-300 hover:border-gold-bright hover:text-gold-bright md:px-5 md:text-xs"
          >
            {t.nav.consultation}
          </Link>
        </div>
      </div>
    </header>
  );
}
