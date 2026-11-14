import { DYNAMIC_SEO_KEYWORDS } from "@/lib/seo-topics";

export const SITE_URL = "https://redeemysoul.com";

export const SITE = {
  name: "Redeemysoul",
  businessName: "Spiritual Healing Shazli",
  healer: "Ejaz Noor Shazli",
  tagline: "Islamic healing, ruqyah-centered care, and private spiritual guidance in Karachi",
  email: "Roohaniilajkarachi@gmail.com",
  phoneDisplay: "+92 345 2845400",
  phoneE164: "+923452845400",
  whatsapp: "https://wa.me/923452845400",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Spiritual%20Healing%20Shazli%20Karachi",
  address: {
    street: "H#953, Street #22, Block D, Ittehad Town, Baldia Town",
    city: "Karachi",
    region: "Sindh",
    postalCode: "",
    country: "PK",
    countryName: "Pakistan",
  },
  locale: "en_PK",
  languages: ["en", "ur"],
} as const;

export const DEFAULT_TITLE =
  "Spiritual Healing Shazli Karachi | Jadoo Sihr Jinnat Bandish Taweez Ruqyah | Redeemysoul";

export const DEFAULT_DESCRIPTION =
  "Spiritual Healing Shazli (Redeemysoul) — Karachi Islamic healing for jadoo, sihr, sifli sihr, jinnat, aseeb, bandish, taweez, nazar, home cleansing, and seekers of Spiritual Reiki, SAMADA Energies, or magic/grimoire clarity. Not medical treatment. Shifa from Allah alone. No guarantee of healing.";

export const KEYWORDS = Array.from(
  new Set([
    "Spiritual Healing Shazli",
    "Redeemysoul",
    "Islamic healing Karachi",
    "ruqyah Karachi",
    "spiritual healer Karachi",
    "nazar ka ilaj",
    "jadoo ka ilaj",
    "sihr treatment Karachi",
    "roohani ilaj Karachi",
    "home cleansing spiritual",
    "bandish ka ilaj",
    "jinn spiritual care",
    "Baldia Town spiritual healing",
    "Ejaz Noor Shazli",
    "Islamic ruqyah Pakistan",
    "Spiritual Reiki",
    "SAMADA Energies",
    "Magic Grimoire",
    "Taweez",
    "Jadoo",
    "Jinnat",
    "Bandish",
    "Sifli Sihar",
    "Sifli Sihr",
    "Aseeb",
    ...DYNAMIC_SEO_KEYWORDS,
  ]),
);

/** English FAQ for FAQPage schema (matches default indexed language). */
export const FAQ_SCHEMA_ITEMS = [
  {
    q: "Is this private?",
    a: "Yes. Your name, mother's name, phone, and details stay for consultation only. Nothing is posted publicly.",
  },
  {
    q: "Do I need to visit in person?",
    a: "Many consultations begin online through WhatsApp or email. If an in-person step is needed, you will be guided clearly.",
  },
  {
    q: "What should I prepare?",
    a: "Your full name, mother's name, closest location, WhatsApp number, and a brief honest note about what you are facing.",
  },
  {
    q: "Is this a replacement for medical care?",
    a: "No. Spiritual healing is not a substitute for medical treatment. Shifa is from Allah alone, and no guarantee of healing is offered. Please continue any medical or professional care you need.",
  },
  {
    q: "What are sihr, jinn, and bandish?",
    a: "Sihr (jadoo) refers to harmful magic condemned in the Qur’an. Jinn are a creation mentioned in the Qur’an. Bandish is a common South Asian term for sensed spiritual binding or blockage.",
  },
  {
    q: "Can this affect marriage or create distance between spouses?",
    a: "Many people report delayed marriage, repeated obstacles before nikah, or sudden coldness between husband and wife. Spiritual care takes such reports seriously while also checking ordinary causes. There is no guaranteed outcome; shifa is from Allah alone.",
  },
  {
    q: "How fast will I get a reply?",
    a: "We aim to respond with care, not haste. Most messages receive a first reply within 24–48 hours.",
  },
] as const;

export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized === "/" ? "" : normalized}`;
}

export function buildGraphJsonLd() {
  const fullAddress = `${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region}, ${SITE.address.countryName}`;

  const organization = {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE.name,
    alternateName: [SITE.businessName, SITE.healer],
    url: SITE_URL,
    email: SITE.email,
    telephone: SITE.phoneE164,
    logo: absoluteUrl("/images/og.jpg"),
    image: absoluteUrl("/images/og.jpg"),
    description: DEFAULT_DESCRIPTION,
    foundingLocation: {
      "@type": "Place",
      name: "Karachi, Pakistan",
    },
    areaServed: [
      { "@type": "City", name: "Karachi" },
      { "@type": "Country", name: "Pakistan" },
    ],
    sameAs: [SITE.mapsUrl, SITE.whatsapp],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: SITE.phoneE164,
        contactType: "customer service",
        areaServed: "PK",
        availableLanguage: ["English", "Urdu"],
      },
    ],
  };

  const localBusiness = {
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": `${SITE_URL}/#localbusiness`,
    name: SITE.businessName,
    alternateName: [SITE.name, SITE.healer],
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    image: absoluteUrl("/images/og.jpg"),
    telephone: SITE.phoneE164,
    email: SITE.email,
    priceRange: "$$",
    currenciesAccepted: "PKR",
    paymentAccepted: "Cash, Bank Transfer",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      // Approximate Baldia / Ittehad Town area — refine in Google Business if needed
      latitude: 24.9225,
      longitude: 66.9662,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Saturday",
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
        ],
        opens: "10:00",
        closes: "20:00",
      },
    ],
    areaServed: {
      "@type": "City",
      name: "Karachi",
    },
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
    sameAs: [SITE.mapsUrl],
    hasMap: SITE.mapsUrl,
    knowsAbout: [
      "Islamic ruqyah",
      "Nazar and hasad",
      "Sihr and spiritual disturbance",
      "Jadoo and sifli sihr",
      "Jinnat and aseeb",
      "Bandish and marriage obstacles",
      "Taweez-related concerns",
      "Home spiritual cleansing",
      "Spiritual Reiki seekers",
      "SAMADA Energies seekers",
      "Magic and grimoire spiritual strain",
      "Jinn-related spiritual care",
    ],
    slogan: SITE.tagline,
    disambiguatingDescription: fullAddress,
  };

  const website = {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE.name,
    alternateName: SITE.businessName,
    description: DEFAULT_DESCRIPTION,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: ["en", "ur"],
    potentialAction: {
      "@type": "SeekAction",
      target: absoluteUrl("/begin"),
      name: "Begin healing consultation",
    },
  };

  const webPage = {
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#localbusiness` },
    primaryImageOfPage: absoluteUrl("/images/og.jpg"),
    inLanguage: "en",
  };

  const services = [
    "Nazar & hasad",
    "Sihr & dark disturbance",
    "Islamic healing",
    "Spiritual cleansing",
    "Home cleansing",
    "Business & rizq blockage",
    "Family & children care",
    "Spiritual renewal",
  ].map((name, index) => ({
    "@type": "Service",
    "@id": `${SITE_URL}/#service-${index + 1}`,
    name,
    provider: { "@id": `${SITE_URL}/#localbusiness` },
    areaServed: { "@type": "City", name: "Karachi" },
    serviceType: "Islamic spiritual healing",
  }));

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: FAQ_SCHEMA_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const person = {
    "@type": "Person",
    "@id": `${SITE_URL}/#healer`,
    name: SITE.healer,
    jobTitle: "Islamic spiritual healer",
    worksFor: { "@id": `${SITE_URL}/#localbusiness` },
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.address.city,
      addressCountry: SITE.address.country,
    },
    url: SITE_URL,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      localBusiness,
      website,
      webPage,
      person,
      faqPage,
      ...services,
    ],
  };
}
