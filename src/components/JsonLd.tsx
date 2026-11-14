import { buildGraphJsonLd } from "@/lib/seo";

export function JsonLd() {
  const data = buildGraphJsonLd();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
