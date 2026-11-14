import Link from "next/link";
import { HealingDisclaimer } from "@/components/HealingDisclaimer";
import { SeoChrome } from "@/components/SeoChrome";
import type { SeoTopicUr } from "@/lib/seo-topics-ur";
import { getTopicUr } from "@/lib/seo-topics-ur";
import { SITE } from "@/lib/seo";

function TopicUrJsonLd({ topic }: { topic: SeoTopicUr }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    inLanguage: "ur",
    headline: topic.h1,
    description: topic.metaDescription,
    author: { "@type": "Person", name: SITE.healer },
    publisher: {
      "@type": "Organization",
      name: SITE.businessName,
      url: "https://redeemysoul.com",
    },
    about: topic.keywords.slice(0, 8),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function TopicPageUr({ topic }: { topic: SeoTopicUr }) {
  const related = topic.related
    .map((slug) => getTopicUr(slug))
    .filter((item): item is SeoTopicUr => Boolean(item));

  return (
    <div className="min-h-full bg-ink" lang="ur" dir="rtl">
      <TopicUrJsonLd topic={topic} />
      <SeoChrome
        lang="ur"
        dir="rtl"
        extraLinks={[
          { href: "/topics", label: "موضوعات" },
          { href: `/topics/${topic.slug}`, label: topic.langSwitchLabel },
        ]}
      />

      <main className="mx-auto w-full max-w-3xl px-6 py-14 md:px-10 md:py-20">
        <p className="text-xs tracking-[0.22em] uppercase text-gold">
          {SITE.businessName} · کراچی
        </p>
        <h1 className="mt-5 font-display text-4xl leading-tight text-cream md:text-5xl">
          {topic.h1}
        </h1>
        <p className="mt-6 text-base leading-relaxed text-cream/95">
          {topic.intro}
        </p>
        <HealingDisclaimer className="mt-6" />

        <div className="mt-14 space-y-10">
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

        <section className="mt-14 border-t border-line pt-10">
          <h2 className="font-display text-2xl text-cream">متعلقہ تلاش الفاظ</h2>
          <p className="mt-4 text-sm leading-relaxed text-fog">
            {topic.keywords.join(" · ")}
          </p>
        </section>

        {related.length > 0 ? (
          <section className="mt-14 border-t border-line pt-10">
            <h2 className="font-display text-2xl text-cream">متعلقہ موضوعات</h2>
            <ul className="mt-6 flex flex-wrap gap-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/topics/${item.slug}/ur`}
                    className="border border-line px-4 py-2 text-sm text-fog transition-colors duration-300 hover:border-gold hover:text-gold-bright"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/begin"
            className="bg-gold px-7 py-3.5 text-sm tracking-[0.14em] uppercase text-ink transition-colors duration-300 hover:bg-gold-bright"
          >
            علاج شروع کریں
          </Link>
          <Link
            href={`/topics/${topic.slug}`}
            className="border border-mist/25 px-7 py-3.5 text-sm tracking-[0.14em] uppercase text-mist transition-colors duration-300 hover:border-gold hover:text-gold-bright"
          >
            {topic.langSwitchLabel}
          </Link>
        </div>
      </main>
    </div>
  );
}
