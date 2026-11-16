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
      className="wa-float fixed bottom-5 z-40 inline-flex max-w-[min(16rem,calc(100vw-2rem))] items-center gap-2 border border-line bg-[#1a5c41] px-3 py-2.5 text-xs text-cream end-4 sm:end-5 sm:px-4 sm:py-3 max-md:bottom-24"
      aria-label={t.whatsappFloat}
    >
      <span
        className="flex h-5 w-5 shrink-0 items-center justify-center bg-cream/12 text-[10px] tracking-normal"
        dir="ltr"
        lang="en"
      >
        WA
      </span>
      <span className="truncate tracking-normal normal-case sm:tracking-[0.08em]">
        {t.whatsappFloat}
      </span>
    </a>
  );
}
