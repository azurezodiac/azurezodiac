import type { Metadata, Viewport } from "next";
import {
  Fraunces,
  Noto_Nastaliq_Urdu,
  Noto_Sans_Arabic,
  Outfit,
} from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import { Providers } from "@/components/Providers";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  KEYWORDS,
  SITE,
  SITE_URL,
  absoluteUrl,
} from "@/lib/seo";
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

/** Body / headlines — standard Urdu Nastaliq */
const nastaliq = Noto_Nastaliq_Urdu({
  variable: "--font-urdu",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

/** Nav / buttons — cleaner Arabic UI face */
const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-urdu-sans",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#061410",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | Redeemysoul",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [...KEYWORDS],
  applicationName: SITE.name,
  authors: [{ name: SITE.healer, url: SITE_URL }],
  creator: SITE.businessName,
  publisher: SITE.name,
  category: "Spiritual Healing",
  classification: "Islamic spiritual healing and ruqyah guidance",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-PK": "/",
      "ur-PK": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE_URL,
    siteName: SITE.name,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: absoluteUrl("/images/og.jpg"),
        width: 1200,
        height: 630,
        alt: "Spiritual Healing Shazli — Redeemysoul Islamic healing in Karachi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Spiritual Healing Shazli | Redeemysoul Karachi",
    description: DEFAULT_DESCRIPTION,
    images: [absoluteUrl("/images/og.jpg")],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" }],
    apple: [{ url: "/images/og.jpg" }],
  },
  manifest: "/site.webmanifest",
  other: {
    "geo.region": "PK-SD",
    "geo.placename": "Karachi, Baldia Town",
    "geo.position": "24.9225;66.9662",
    ICBM: "24.9225, 66.9662",
    "business:contact_data:street_address": SITE.address.street,
    "business:contact_data:locality": SITE.address.city,
    "business:contact_data:region": SITE.address.region,
    "business:contact_data:country_name": SITE.address.countryName,
    "business:contact_data:email": SITE.email,
    "business:contact_data:phone_number": SITE.phoneE164,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${fraunces.variable} ${outfit.variable} ${nastaliq.variable} ${notoSansArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-clip bg-ink text-mist">
        <JsonLd />
        <Providers>
          {children}
          <WhatsAppFloat />
        </Providers>
      </body>
    </html>
  );
}
