import Link from "next/link";
import { HealingDisclaimer } from "@/components/HealingDisclaimer";
import { SeoChrome } from "@/components/SeoChrome";
import type { BlogPost } from "@/lib/blog";
import { SITE, absoluteUrl } from "@/lib/seo";
import { getTopic } from "@/lib/seo-topics";

export function BlogArticle({ post }: { post: BlogPost }) {
  const related = post.relatedTopics
    .map((slug) => getTopic(slug))
    .filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { "@type": "Person", name: SITE.healer },
    publisher: {
      "@type": "Organization",
      name: SITE.businessName,
      url: SITE.name ? absoluteUrl("/") : "https://redeemysoul.com",
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    keywords: post.keywords.join(", "),
  };

  return (
    <div className="min-h-full bg-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SeoChrome
        extraLinks={[
          { href: "/blog", label: "Blog" },
          { href: "/topics", label: "Topics" },
        ]}
      />

      <main className="mx-auto w-full max-w-3xl px-6 py-14 md:px-10 md:py-20">
        <p className="text-xs tracking-[0.22em] uppercase text-gold">
          Blog · {SITE.businessName}
        </p>
        <h1 className="mt-5 font-display text-4xl leading-tight text-cream md:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-sm text-fog">
          {post.publishedAt} · {post.readingMinutes} min read
        </p>
        <p className="mt-6 text-base leading-relaxed text-cream/95">
          {post.excerpt}
        </p>
        <HealingDisclaimer className="mt-6" />

        <div className="mt-14 space-y-10">
          {post.sections.map((section) => (
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

        {related.length > 0 ? (
          <section className="mt-14 border-t border-line pt-10">
            <h2 className="font-display text-2xl text-cream">Related topics</h2>
            <ul className="mt-6 flex flex-wrap gap-3">
              {related.map((topic) =>
                topic ? (
                  <li key={topic.slug}>
                    <Link
                      href={`/topics/${topic.slug}`}
                      className="border border-line px-4 py-2 text-sm text-fog transition-colors duration-300 hover:border-gold hover:text-gold-bright"
                    >
                      {topic.title}
                    </Link>
                  </li>
                ) : null,
              )}
            </ul>
          </section>
        ) : null}

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/begin"
            className="bg-gold px-7 py-3.5 text-sm tracking-[0.14em] uppercase text-ink transition-colors duration-300 hover:bg-gold-bright"
          >
            Begin healing
          </Link>
          <Link
            href="/templates"
            className="border border-mist/25 px-7 py-3.5 text-sm tracking-[0.14em] uppercase text-mist transition-colors duration-300 hover:border-gold hover:text-gold-bright"
          >
            WhatsApp templates
          </Link>
        </div>
      </main>
    </div>
  );
}
