import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityLanding } from "@/components/CityLanding";
import { allCitySlugs, getCity } from "@/lib/cities";
import { absoluteUrl } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return allCitySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) return { title: "Location not found" };
  const url = absoluteUrl(`/locations/${city.slug}`);
  return {
    title: { absolute: city.metaTitle },
    description: city.metaDescription,
    keywords: city.keywords,
    alternates: { canonical: url },
    openGraph: {
      url,
      title: city.metaTitle,
      description: city.metaDescription,
      type: "website",
    },
  };
}

export default async function CityRoute({ params }: Props) {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) notFound();
  return <CityLanding city={city} />;
}

export const dynamicParams = false;
