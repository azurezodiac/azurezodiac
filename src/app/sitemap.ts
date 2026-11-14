import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog";
import { CITY_PAGES } from "@/lib/cities";
import { SITE_URL } from "@/lib/seo";
import { SEO_TOPICS } from "@/lib/seo-topics";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const topics: MetadataRoute.Sitemap = SEO_TOPICS.flatMap((topic) => [
    {
      url: `${SITE_URL}/topics/${topic.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/topics/${topic.slug}/ur`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.84,
    },
  ]);

  const posts: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const cities: MetadataRoute.Sitemap = CITY_PAGES.map((city) => ({
    url: `${SITE_URL}/locations/${city.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/topics`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    ...topics,
    {
      url: `${SITE_URL}/blog`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...posts,
    {
      url: `${SITE_URL}/locations`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.88,
    },
    ...cities,
    {
      url: `${SITE_URL}/templates`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/begin`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/pricing`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/track`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}
