import type { Metadata } from "next";
import { BlogIndexContent } from "@/components/blog/BlogIndexContent";
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
  return <BlogIndexContent />;
}
