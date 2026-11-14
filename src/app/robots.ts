import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

/**
 * Allow major AI answer-engine crawlers so citations can surface
 * Redeemysoul in ChatGPT/Perplexity/Google AI answers — while still
 * blocking admin/api.
 */
const AI_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "Google-Extended",
  "Googlebot",
  "Googlebot-Image",
  "Bingbot",
  "DuckDuckBot",
  "PerplexityBot",
  "ClaudeBot",
  "Anthropic-AI",
  "Bytespider",
  "CCBot",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/topics", "/topics/", "/llms.txt"],
        disallow: ["/admin", "/admin/", "/api/", "/api"],
      },
      ...AI_AGENTS.map((userAgent) => ({
        userAgent,
        allow: ["/", "/topics", "/llms.txt", "/ai-citation.json"],
        disallow: ["/admin", "/admin/", "/api/", "/api"],
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
