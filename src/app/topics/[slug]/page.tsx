import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicPage } from "@/components/topics/TopicPage";
import { absoluteUrl } from "@/lib/seo";
import { getTopicIntelligence } from "@/lib/seo-intelligence";
import { allTopicSlugs, getTopic } from "@/lib/seo-topics";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return allTopicSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) {
    return { title: "Topic not found" };
  }

  const intel = getTopicIntelligence(topic);
  const url = absoluteUrl(`/topics/${topic.slug}`);
  const urUrl = absoluteUrl(`/topics/${topic.slug}/ur`);

  return {
    title: {
      absolute: topic.metaTitle,
    },
    description: topic.metaDescription,
    keywords: intel.phoneticLattice,
    alternates: {
      canonical: url,
      languages: {
        en: url,
        ur: urUrl,
        "x-default": url,
      },
    },
    openGraph: {
      url,
      title: topic.metaTitle,
      description: intel.snippetAnswer.slice(0, 200),
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: topic.metaTitle,
      description: topic.metaDescription,
    },
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
    other: {
      "ai:intent_cascade": intel.intentCascade.map((s) => s.stage).join(","),
      "ai:phonetic_count": String(intel.phoneticLattice.length),
    },
  };
}

export default async function SeoTopicRoute({ params }: Props) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();
  return <TopicPage topic={topic} />;
}

// Keep a reference so the topic list stays tree-shaken-safe for static export.
export const dynamicParams = false;
