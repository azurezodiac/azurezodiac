"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLang } from "@/lib/i18n";

export function SiteHeader({ variant = "home" }: { variant?: "home" | "page" }) {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const links =
    variant === "home"
      ? [
          { href: "#services", label: t.nav.services },
          { href: "#path", label: t.nav.path },
          { href: "#about", label: t.nav.about },
          { href: "#faq", label: t.nav.faq },
        ]
      : [
          { href: "/#services", label: t.nav.services },
          { href: "/topics", label: t.nav.topics },
          { href: "/blog", label: t.nav.blog },
          { href: "/pricing", label: t.nav.pricing },
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
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-1.5 px-3 py-3.5 sm:gap-3 sm:px-6 sm:py-5 md:px-10 md:py-6">
        <a
          href={variant === "home" ? "#top" : "/"}
          className="shrink-0 font-display text-[0.92rem] tracking-[0.03em] text-cream transition-opacity duration-300 hover:opacity-90 sm:text-xl sm:tracking-[0.08em] md:text-2xl"
          dir="ltr"
          lang="en"
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
        <div className="flex shrink-0 items-center gap-1 sm:gap-2 md:gap-3">
          <LanguageToggle />
          <Link
            href="/begin"
            className="btn-secondary !px-2 !py-1.5 text-[10px] whitespace-nowrap sm:!px-3 sm:!py-2 sm:text-[11px] md:!px-5 md:text-xs"
          >
            {t.nav.consultation}
          </Link>
        </div>
      </div>
    </header>
  );
}
