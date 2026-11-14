import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicPageUr } from "@/components/topics/TopicPageUr";
import { absoluteUrl } from "@/lib/seo";
import { allTopicUrSlugs, getTopicUr } from "@/lib/seo-topics-ur";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return allTopicUrSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicUr(slug);
  if (!topic) return { title: "موضوع نہیں ملا" };

  const urUrl = absoluteUrl(`/topics/${topic.slug}/ur`);
  const enUrl = absoluteUrl(`/topics/${topic.slug}`);

  return {
    title: { absolute: topic.metaTitle },
    description: topic.metaDescription,
    keywords: topic.keywords,
    alternates: {
      canonical: urUrl,
      languages: {
        ur: urUrl,
        en: enUrl,
        "x-default": enUrl,
      },
    },
    openGraph: {
      url: urUrl,
      title: topic.metaTitle,
      description: topic.metaDescription,
      locale: "ur_PK",
      type: "article",
    },
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  };
}

export default async function UrduTopicRoute({ params }: Props) {
  const { slug } = await params;
  const topic = getTopicUr(slug);
  if (!topic) notFound();
  return <TopicPageUr topic={topic} />;
}

export const dynamicParams = false;
