import Link from "next/link";

const links = [
  { href: "#services", label: "Services" },
  { href: "#path", label: "How it works" },
  { href: "#trust", label: "Privacy" },
  { href: "/begin", label: "Begin" },
];

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <a
          href="#top"
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
                href={link.href}
                className="transition-colors duration-300 hover:text-gold-bright"
              >
                {link.label}
              </a>
            ),
          )}
        </nav>
        <Link
          href="/begin"
          className="border border-gold/50 px-4 py-2 text-xs tracking-[0.16em] uppercase text-gold transition-colors duration-300 hover:border-gold-bright hover:text-gold-bright md:px-5"
        >
          Consultation
        </Link>
      </div>
    </header>
  );
}
