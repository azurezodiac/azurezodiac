export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <p className="font-display text-2xl tracking-[0.06em] text-cream">
            Redeemysoul
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-fog">
            Islamic healing for protection, clarity, and return — crafted with
            modern web technology for redeemysoul.com.
          </p>
        </div>
        <p className="text-xs tracking-[0.14em] uppercase text-fog/80">
          © 2026 Redeemysoul
        </p>
      </div>
    </footer>
  );
}
