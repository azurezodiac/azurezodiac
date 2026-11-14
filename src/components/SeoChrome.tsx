import Link from "next/link";
import { LanguageToggle } from "@/components/LanguageToggle";

export function SeoChrome({
  dir,
  lang,
  extraLinks,
}: {
  dir?: "ltr" | "rtl";
  lang?: string;
  extraLinks?: { href: string; label: string }[];
}) {
  return (
    <header className="border-b border-line" lang={lang} dir={dir}>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-6 py-6 md:px-10">
        <Link
          href="/"
          className="font-display text-xl tracking-[0.08em] text-cream md:text-2xl"
        >
          Redeemysoul
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <LanguageToggle />
          {(extraLinks ?? []).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs tracking-[0.16em] uppercase text-fog transition-colors duration-300 hover:text-gold-bright"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/begin"
            className="border border-gold/50 px-3 py-2 text-[11px] tracking-[0.14em] uppercase text-gold transition-colors duration-300 hover:border-gold-bright hover:text-gold-bright"
          >
            Begin
          </Link>
        </div>
      </div>
    </header>
  );
}
