import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <p className="font-display text-2xl tracking-[0.06em] text-cream">
            Redeemysoul
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-fog">
            Islamic healing for nazar, spiritual pressure, and renewal —
            serving seekers with privacy and care.
          </p>
          <p className="mt-4 max-w-md text-xs leading-relaxed text-fog/80">
            Privacy note: your name, mother&apos;s name, phone, and location are
            collected only to understand and respond to your consultation
            request.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-xs tracking-[0.14em] uppercase text-fog">
          <Link href="/begin" className="hover:text-gold-bright">
            Begin healing
          </Link>
          <a
            href="mailto:Roohaniilajkarachi@gmail.com"
            className="hover:text-gold-bright"
          >
            Email
          </a>
          <a
            href="https://wa.me/923452845400"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold-bright"
          >
            WhatsApp
          </a>
          <p className="pt-2 text-fog/70">© 2026 Redeemysoul</p>
        </div>
      </div>
    </footer>
  );
}
