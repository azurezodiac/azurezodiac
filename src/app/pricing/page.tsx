import type { Metadata } from "next";
import { PricingContent } from "@/components/PricingContent";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Pricing — Diagnosis Hadiya",
  description:
    "Redeemysoul diagnosis Hadiya: PKR 5,000 via EasyPaisa in Pakistan or USD 50 via IBAN internationally. Further guidance discussed privately. Not medical treatment.",
  alternates: {
    canonical: absoluteUrl("/pricing"),
  },
  openGraph: {
    url: absoluteUrl("/pricing"),
    title: "Pricing — Spiritual diagnosis Hadiya | Redeemysoul",
    description:
      "Clear Hadiya for initial spiritual diagnosis. Further guidance after diagnosis if needed.",
  },
};

export default function PricingPage() {
  return <PricingContent />;
}
