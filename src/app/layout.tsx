import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Redeemysoul — Islamic Healing | Nazar, Sihr & Spiritual Care",
  description:
    "Private Islamic healing for nazar, sihr concerns, and spiritual renewal — rooted in remembrance, dignity, and care.",
  metadataBase: new URL("https://redeemysoul.com"),
  openGraph: {
    title: "Redeemysoul — Islamic Healing",
    description:
      "Private Islamic healing for nazar, sihr concerns, and spiritual renewal.",
    url: "https://redeemysoul.com",
    siteName: "Redeemysoul",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-mist">{children}</body>
    </html>
  );
}
