import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicPage } from "@/components/topics/TopicPage";
import { absoluteUrl } from "@/lib/seo";
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

  const url = absoluteUrl(`/topics/${topic.slug}`);

  return {
    title: {
      absolute: topic.metaTitle,
    },
    description: topic.metaDescription,
    keywords: topic.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      url,
      title: topic.metaTitle,
      description: topic.metaDescription,
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
