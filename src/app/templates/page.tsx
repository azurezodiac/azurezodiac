import type { Metadata } from "next";
import { WaTemplatesContent } from "@/components/WaTemplatesContent";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute:
      "WhatsApp Message Templates | Nazar Sihr Bandish | Redeemysoul",
  },
  description:
    "Catalog WhatsApp openers for nazar, sihr, jinnat, bandish, home heaviness, family, and rizq — Spiritual Healing Shazli (Redeemysoul).",
  alternates: { canonical: absoluteUrl("/templates") },
  openGraph: {
    url: absoluteUrl("/templates"),
    title: "WhatsApp templates | Redeemysoul",
    description:
      "Ready first messages for common Islamic spiritual healing concerns.",
  },
};

export default function TemplatesPage() {
  return <WaTemplatesContent />;
}
