"use client";

import { useLang } from "@/lib/i18n";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useLang();

  return (
    <div
      className={`inline-flex items-center border border-line bg-ink/40 text-[11px] tracking-[0.12em] uppercase ${className}`}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`px-2.5 py-1.5 transition-colors duration-300 ${
          lang === "en" ? "bg-gold text-ink" : "text-fog hover:text-gold-bright"
        }`}
        aria-pressed={lang === "en"}
      >
        {t.langEn}
      </button>
      <button
        type="button"
        onClick={() => setLang("ur")}
        className={`px-2.5 py-1.5 transition-colors duration-300 ${
          lang === "ur" ? "bg-gold text-ink" : "text-fog hover:text-gold-bright"
        }`}
        aria-pressed={lang === "ur"}
      >
        {t.langUr}
      </button>
    </div>
  );
}
