import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { SEO_TOPICS } from "@/lib/seo-topics";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const topics: MetadataRoute.Sitemap = SEO_TOPICS.map((topic) => ({
    url: `${SITE_URL}/topics/${topic.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.85,
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
