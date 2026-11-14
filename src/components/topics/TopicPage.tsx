import Link from "next/link";
import { HealingDisclaimer } from "@/components/HealingDisclaimer";
import { LanguageToggle } from "@/components/LanguageToggle";
import type { SeoTopic } from "@/lib/seo-topics";
import { SEO_TOPICS, getTopic } from "@/lib/seo-topics";
import {
  buildTopicRichJsonLd,
  getTopicIntelligence,
} from "@/lib/seo-intelligence";
import { SITE } from "@/lib/seo";

function TopicJsonLd({ topic }: { topic: SeoTopic }) {
  const data = buildTopicRichJsonLd(topic);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function TopicPage({ topic }: { topic: SeoTopic }) {
  const intel = getTopicIntelligence(topic);
  const related = topic.related
    .map((slug) => getTopic(slug))
    .filter((item): item is SeoTopic => Boolean(item));
  const mesh = intel.coOccurWith
    .map((slug) => getTopic(slug))
    .filter((item): item is SeoTopic => Boolean(item));

  return (
    <div className="min-h-full bg-ink">
      <TopicJsonLd topic={topic} />
      <header className="border-b border-line">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-6 py-6 md:px-10">
          <Link
            href="/"
            className="font-display text-xl tracking-[0.08em] text-cream md:text-2xl"
          >
            Redeemysoul
          </Link>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Link
              href="/topics"
              className="text-xs tracking-[0.16em] uppercase text-fog transition-colors duration-300 hover:text-gold-bright"
            >
              Topics
            </Link>
            <Link
              href="/begin"
              className="border border-gold/50 px-3 py-2 text-[11px] tracking-[0.14em] uppercase text-gold transition-colors duration-300 hover:border-gold-bright hover:text-gold-bright"
            >
              Begin
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-6 py-14 md:px-10 md:py-20">
        <p className="text-xs tracking-[0.22em] uppercase text-gold">
          {SITE.businessName} · Karachi
        </p>
        <h1 className="mt-5 font-display text-4xl leading-tight text-cream md:text-5xl">
          {topic.h1}
        </h1>

        {/* AI Overview / featured-snippet capsule */}
        <p className="seo-snippet seo-speakable mt-6 border border-line bg-ink-soft/50 px-5 py-4 text-base leading-relaxed text-cream/95">
          {intel.snippetAnswer}
        </p>

        <HealingDisclaimer className="mt-6" />

        {/* Intent cascade — mirrors how AI search ranks passages */}
        <div className="mt-14 space-y-10">
          {intel.intentCascade.map((block) => (
            <section key={block.stage} data-intent={block.stage}>
              <h2 className="font-display text-2xl text-cream md:text-3xl">
                {block.heading}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-fog">
                {block.body}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-14 space-y-10 border-t border-line pt-12">
          {topic.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-2xl text-cream md:text-3xl">
                {section.heading}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-fog">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        {/* People Also Ask — crawlable, schema-backed */}
        <section className="mt-14 border-t border-line pt-12" id="paa">
          <h2 className="font-display text-2xl text-cream md:text-3xl">
            People also ask
          </h2>
          <div className="mt-8 divide-y divide-line border-y border-line">
            {intel.paa.map((item) => (
              <div key={item.q} className="py-5">
                <h3 className="font-display text-xl text-cream">{item.q}</h3>
                <p className="mt-3 text-base leading-relaxed text-fog">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Topical co-occurrence mesh */}
        {mesh.length > 0 ? (
          <section className="mt-14 border-t border-line pt-12">
            <h2 className="font-display text-2xl text-cream">
              Often searched together
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-fog">
              Google and AI assistants frequently connect these concerns. Exploring
              them together strengthens clear understanding — and helps the right
              seekers find {SITE.businessName}.
            </p>
            <ul className="mt-6 flex flex-wrap gap-3">
              {mesh.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/topics/${item.slug}`}
                    className="border border-line px-4 py-2 text-sm text-fog transition-colors duration-300 hover:border-gold hover:text-gold-bright"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Phonetic lattice — natural sentence, not stuffing */}
        <section className="mt-14 border-t border-line pt-10">
          <h2 className="font-display text-2xl text-cream">
            Related search spellings
          </h2>
          <p className="seo-speakable mt-4 text-sm leading-relaxed text-fog">
            This guidance also helps people who searched close spellings such as{" "}
            {intel.phoneticLattice.slice(0, 14).join(", ")}. Whatever spelling
            brought you here, {SITE.name} / {SITE.businessName} in Karachi can
            receive your matter privately with {SITE.healer}.
          </p>
        </section>

        <section className="mt-14 border-t border-line pt-10">
          <h2 className="font-display text-2xl text-cream">
            Related search topics
          </h2>
          <ul className="mt-6 flex flex-wrap gap-3">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/topics/${item.slug}`}
                  className="border border-line px-4 py-2 text-sm text-fog transition-colors duration-300 hover:border-gold hover:text-gold-bright"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/begin"
            className="bg-gold px-7 py-3.5 text-sm tracking-[0.14em] uppercase text-ink transition-colors duration-300 hover:bg-gold-bright"
          >
            Begin healing
          </Link>
          <Link
            href="/topics"
            className="border border-mist/25 px-7 py-3.5 text-sm tracking-[0.14em] uppercase text-mist transition-colors duration-300 hover:border-gold hover:text-gold-bright"
          >
            All topics
          </Link>
        </div>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-4 px-6 py-8 text-xs text-fog md:px-10">
          {SEO_TOPICS.map((item) => (
            <Link
              key={item.slug}
              href={`/topics/${item.slug}`}
              className="hover:text-gold-bright"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
