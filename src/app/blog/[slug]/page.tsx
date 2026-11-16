import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/blog/BlogArticle";
import { allPostSlugs, getPost, type BlogPost } from "@/lib/blog";
import { getPublicCms } from "@/lib/cms-store";
import type { CmsPost } from "@/lib/cms-types";
import { absoluteUrl } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

const isStatic = process.env.CPANEL_STATIC === "1";

function cmsToBlogPost(post: CmsPost): BlogPost {
  const sections = post.body
    .split(/\n(?=##\s)/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block.split("\n");
      const heading = lines[0].replace(/^##\s*/, "").trim() || "Note";
      const body = lines.slice(1).join("\n").trim() || post.excerpt;
      return { heading, body };
    });

  return {
    slug: post.slug,
    title: post.title,
    metaTitle: `${post.title} | Redeemysoul`,
    metaDescription: post.excerpt || post.title,
    publishedAt: post.publishedAt,
    readingMinutes: Math.max(3, Math.round(post.body.split(/\s+/).length / 180)),
    excerpt: post.excerpt,
    keywords: [post.slug.replace(/-/g, " ")],
    relatedTopics: [],
    sections:
      sections.length > 0
        ? sections
        : [{ heading: "Article", body: post.body || post.excerpt }],
  };
}

export function generateStaticParams() {
  return allPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const staticPost = getPost(slug);
  if (staticPost) {
    const url = absoluteUrl(`/blog/${staticPost.slug}`);
    return {
      title: { absolute: staticPost.metaTitle },
      description: staticPost.metaDescription,
      keywords: staticPost.keywords,
      alternates: { canonical: url },
      openGraph: {
        url,
        title: staticPost.metaTitle,
        description: staticPost.metaDescription,
        type: "article",
        publishedTime: staticPost.publishedAt,
      },
    };
  }

  if (!isStatic) {
    try {
      const cms = await getPublicCms();
      const cmsPost = cms.posts.find((item) => item.slug === slug);
      if (cmsPost) {
        const url = absoluteUrl(`/blog/${cmsPost.slug}`);
        return {
          title: { absolute: `${cmsPost.title} | Redeemysoul` },
          description: cmsPost.excerpt,
          alternates: { canonical: url },
        };
      }
    } catch {
      // ignore
    }
  }

  return { title: "Article not found" };
}

export default async function BlogPostRoute({ params }: Props) {
  const { slug } = await params;
  const staticPost = getPost(slug);
  if (staticPost) return <BlogArticle post={staticPost} />;

  if (!isStatic) {
    try {
      const cms = await getPublicCms();
      const cmsPost = cms.posts.find((item) => item.slug === slug);
      if (cmsPost) return <BlogArticle post={cmsToBlogPost(cmsPost)} />;
    } catch {
      // ignore
    }
  }

  notFound();
}

export const dynamicParams = !isStatic;
