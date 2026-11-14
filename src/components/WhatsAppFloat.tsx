"use client";

import { CONTACT_WHATSAPP } from "@/lib/consultation";
import { useLang } from "@/lib/i18n";

export function WhatsAppFloat() {
  const { t, lang } = useLang();
  const phone = CONTACT_WHATSAPP.replace(/\D/g, "");
  const preset =
    lang === "ur"
      ? "السلام علیکم، مجھے ریڈیمی سول سے اسلامی شفا کی رہنمائی درکار ہے۔"
      : "Assalamu alaikum, I need Islamic healing guidance from Redeemysoul.";

  return (
    <a
      href={`https://wa.me/${phone}?text=${encodeURIComponent(preset)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 z-40 inline-flex items-center gap-2 bg-[#1f6b4a] px-4 py-3 text-xs tracking-[0.14em] uppercase text-cream shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:scale-[1.03] end-5 max-md:bottom-24"
      aria-label={t.whatsappFloat}
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-cream/15 text-[11px]">
        WA
      </span>
      {t.whatsappFloat}
    </a>
  );
}
