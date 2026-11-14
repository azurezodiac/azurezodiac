"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLang } from "@/lib/i18n";

export function SiteHeader({ variant = "home" }: { variant?: "home" | "page" }) {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const links = [
    { href: "#services", label: t.nav.services },
    { href: "#learn", label: t.nav.learn },
    { href: "/topics", label: t.nav.topics },
    { href: "/blog", label: t.nav.blog },
    { href: "/pricing", label: t.nav.pricing },
    { href: "#visit", label: t.nav.visit },
    { href: "/begin", label: t.nav.begin },
  ];

  useEffect(() => {
    if (variant !== "home") return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  return (
    <header
      className={
        variant === "home"
          ? "site-header-shell fixed inset-x-0 top-0 z-30"
          : "border-b border-line bg-ink/90 backdrop-blur-md"
      }
      data-scrolled={variant === "home" ? scrolled : undefined}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-6 py-5 md:px-10 md:py-6">
        <a
          href={variant === "home" ? "#top" : "/"}
          className="font-display text-xl tracking-[0.08em] text-cream transition-opacity duration-300 hover:opacity-90 md:text-2xl"
        >
          Redeemysoul
        </a>
        <nav
          className="hidden items-center gap-7 text-[11px] tracking-[0.16em] uppercase text-fog lg:flex"
          aria-label="Primary"
        >
          {links.map((link) =>
            link.href.startsWith("/") ? (
              <Link
                key={link.href}
                href={link.href}
                className="relative transition-colors duration-300 hover:text-gold-bright after:absolute after:-bottom-1 after:start-0 after:h-px after:w-0 after:bg-gold after:transition-[width] after:duration-300 hover:after:w-full"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={variant === "home" ? link.href : `/${link.href}`}
                className="relative transition-colors duration-300 hover:text-gold-bright after:absolute after:-bottom-1 after:start-0 after:h-px after:w-0 after:bg-gold after:transition-[width] after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ),
          )}
        </nav>
        <div className="flex items-center gap-2 md:gap-3">
          <LanguageToggle />
          <Link href="/begin" className="btn-secondary !px-3 !py-2 text-[11px] md:!px-5 md:text-xs">
            {t.nav.consultation}
          </Link>
        </div>
      </div>
    </header>
  );
}
