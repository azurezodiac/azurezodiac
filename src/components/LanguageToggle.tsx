"use client";

import { useLang } from "@/lib/i18n";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useLang();

  return (
    <div
      className={`inline-flex items-center border border-line bg-ink/40 text-[11px] ${className}`}
      role="group"
      aria-label="Language"
      dir="ltr"
    >
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`px-2.5 py-1.5 tracking-[0.12em] uppercase transition-colors duration-300 ${
          lang === "en" ? "bg-gold text-ink" : "text-fog hover:text-gold-bright"
        }`}
        aria-pressed={lang === "en"}
        lang="en"
      >
        {t.langEn}
      </button>
      <button
        type="button"
        onClick={() => setLang("ur")}
        className={`px-2.5 py-1.5 tracking-normal transition-colors duration-300 ${
          lang === "ur" ? "bg-gold text-ink" : "text-fog hover:text-gold-bright"
        }`}
        aria-pressed={lang === "ur"}
        lang="ur"
        dir="rtl"
      >
        {t.langUr}
      </button>
    </div>
  );
}
