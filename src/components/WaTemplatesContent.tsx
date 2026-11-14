"use client";

import Link from "next/link";
import { useState } from "react";
import { HealingDisclaimer } from "@/components/HealingDisclaimer";
import { SeoChrome } from "@/components/SeoChrome";
import { useLang } from "@/lib/i18n";
import { WA_TEMPLATES, templateWhatsAppHref } from "@/lib/wa-templates";

export function WaTemplatesContent() {
  const { lang } = useLang();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function copyMessage(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(null);
    }
  }

  return (
    <div className="min-h-full bg-ink">
      <SeoChrome
        extraLinks={[
          { href: "/begin", label: "Begin" },
          { href: "/blog", label: "Blog" },
        ]}
      />
      <main className="mx-auto w-full max-w-7xl px-6 py-14 md:px-10 md:py-20">
        <p className="text-xs tracking-[0.22em] uppercase text-gold">
          WhatsApp catalog
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-4xl leading-tight text-cream md:text-5xl">
          Ready messages for common concerns
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-fog">
          Tap a template to open WhatsApp with a clear first message. For a
          tracking number and diagnosis Hadiya step, continue on{" "}
          <Link href="/begin" className="text-gold-bright hover:underline">
            Begin healing
          </Link>
          .
        </p>
        <HealingDisclaimer className="mt-6 max-w-2xl" />

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {WA_TEMPLATES.map((template) => {
            const message =
              lang === "ur" ? template.messageUr : template.messageEn;
            const title = lang === "ur" ? template.titleUr : template.titleEn;
            return (
              <article
                key={template.id}
                className="border border-line bg-ink-soft/40 p-6"
              >
                <h2 className="font-display text-2xl text-cream">{title}</h2>
                <p className="mt-2 text-sm text-fog">{template.concernHint}</p>
                <pre className="mt-5 whitespace-pre-wrap rounded-none border border-line/80 bg-ink/50 px-4 py-3 text-sm leading-relaxed text-cream/90">
                  {message}
                </pre>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={templateWhatsAppHref(
                      template,
                      lang === "ur" ? "ur" : "en",
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gold px-5 py-3 text-xs tracking-[0.14em] uppercase text-ink transition-colors duration-300 hover:bg-gold-bright"
                  >
                    Open WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => void copyMessage(template.id, message)}
                    className="border border-mist/25 px-5 py-3 text-xs tracking-[0.14em] uppercase text-mist transition-colors duration-300 hover:border-gold hover:text-gold-bright"
                  >
                    {copiedId === template.id ? "Copied" : "Copy text"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
