import type { Metadata } from "next";
import Link from "next/link";
import { HealingDisclaimer } from "@/components/HealingDisclaimer";
import { SeoChrome } from "@/components/SeoChrome";
import { BLOG_POSTS } from "@/lib/blog";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute: "Spiritual Healing Blog | Bandish Nazar Home Unrest | Redeemysoul",
  },
  description:
    "Practical Islamic spiritual healing articles: bandish signs, nazar vs sihr, when the home feels heavy — from Spiritual Healing Shazli (Redeemysoul).",
  alternates: { canonical: absoluteUrl("/blog") },
  openGraph: {
    url: absoluteUrl("/blog"),
    title: "Redeemysoul blog",
    description:
      "Weekly-style guidance articles for seekers of ruqyah-centered Islamic care.",
  },
};

export default function BlogIndexPage() {
  const posts = [...BLOG_POSTS].sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : -1,
  );

  return (
    <div className="min-h-full bg-ink">
      <SeoChrome
        extraLinks={[
          { href: "/topics", label: "Topics" },
          { href: "/locations", label: "Cities" },
        ]}
      />
      <main className="mx-auto w-full max-w-7xl px-6 py-14 md:px-10 md:py-20">
        <p className="text-xs tracking-[0.22em] uppercase text-gold">Blog</p>
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
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="border border-line bg-ink-soft/40 p-6 transition-colors duration-300 hover:border-gold/60"
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
