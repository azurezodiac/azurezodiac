"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HealingDisclaimer } from "@/components/HealingDisclaimer";
import { SeoChrome } from "@/components/SeoChrome";
import { BLOG_POSTS } from "@/lib/blog";
import type { CmsPost } from "@/lib/cms-types";

type Card = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  source: "static" | "cms";
};

export function BlogIndexContent() {
  const [cards, setCards] = useState<Card[]>(() =>
    BLOG_POSTS.map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      publishedAt: post.publishedAt,
      source: "static" as const,
    })).sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1)),
  );

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/cms/public");
        if (!res.ok) return;
        const data = (await res.json()) as { cms?: { posts?: CmsPost[] } };
        const cmsPosts = data.cms?.posts ?? [];
        if (!cmsPosts.length || cancelled) return;

        const bySlug = new Map<string, Card>();
        for (const post of BLOG_POSTS) {
          bySlug.set(post.slug, {
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            publishedAt: post.publishedAt,
            source: "static",
          });
        }
        for (const post of cmsPosts) {
          bySlug.set(post.slug, {
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            publishedAt: post.publishedAt,
            source: "cms",
          });
        }
        const merged = Array.from(bySlug.values()).sort((a, b) =>
          a.publishedAt < b.publishedAt ? 1 : -1,
        );
        setCards(merged);
      } catch {
        // keep static
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-full bg-ink">
      <SeoChrome
        extraLinks={[
          { href: "/topics", label: "Topics" },
          { href: "/locations", label: "Cities" },
        ]}
      />
      <main className="mx-auto w-full max-w-7xl px-6 py-14 md:px-10 md:py-20">
        <p className="eyebrow">Blog</p>
        <h1 className="mt-5 max-w-3xl font-display text-4xl leading-tight text-cream md:text-5xl">
          Clear writing for heavy questions.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-fog">
          Short articles for Pakistan and diaspora seekers — bandish, nazar,
          sihr language, and home unrest — always with a path back to private
          consultation.
        </p>
        <HealingDisclaimer className="mt-6 max-w-2xl" />

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((post) => (
            <Link
              key={`${post.source}-${post.slug}`}
              href={`/blog/${post.slug}`}
              className="hover-lift border border-line bg-ink-soft/40 p-6 transition-colors duration-300 hover:border-gold/60"
            >
              <p className="text-xs text-fog">{post.publishedAt}</p>
              <h2 className="mt-3 font-display text-2xl text-cream">
                {post.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-fog">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
