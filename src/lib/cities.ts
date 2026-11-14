import { HADIYA } from "@/lib/consultation";

export type CityPage = {
  slug: string;
  name: string;
  regionLabel: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  keywords: string[];
  hadiyaNote: string;
  sections: { heading: string; body: string }[];
  audience: "pakistan" | "international";
};

export const CITY_PAGES: CityPage[] = [
  {
    slug: "lahore",
    name: "Lahore",
    regionLabel: "Punjab, Pakistan",
    metaTitle:
      "Spiritual Healing Lahore Online | Ruqyah Jadoo Bandish | Redeemysoul",
    metaDescription:
      "Islamic spiritual healing for Lahore seekers — nazar, sihr, jinnat, bandish, home unrest. Online consultation with Spiritual Healing Shazli (Karachi). Hadiya PKR 5,000 for first diagnosis.",
    h1: "Spiritual healing for Lahore — private online Islamic guidance",
    intro:
      "Based in Karachi as Spiritual Healing Shazli, Redeemysoul serves Lahore families who need calm ruqyah-centered care without local spectacle. Begin online; office visits in Baldia remain by appointment when travel is possible.",
    keywords: [
      "spiritual healing Lahore",
      "ruqyah Lahore",
      "jadoo ka ilaj Lahore",
      "bandish Lahore",
      "rohani ilaj Lahore",
      "nazar ka ilaj Lahore",
    ],
    audience: "pakistan",
    hadiyaNote: `Pakistan Hadiya for first spiritual diagnosis: ${HADIYA.pakistan.amountLabel} via ${HADIYA.pakistan.method} ${HADIYA.pakistan.account}.`,
    sections: [
      {
        heading: "Why Lahore seekers choose online-first care",
        body: "Many want privacy, distance from fear marketing, and a clear Islamic frame. WhatsApp/email consultation lets you share your matter from Lahore, receive diagnosis-oriented guidance, and decide later about any Karachi visit.",
      },
      {
        heading: "Concerns we commonly hear from Punjab",
        body: "Nazar after family events, bandish around rishtas, sihr fears, home heaviness, and children’s unsettled sleep. Every case stays confidential. Medical care continues whenever needed.",
      },
      {
        heading: "How to start from Lahore",
        body: "Use Begin healing, complete the Hadiya step, and send your request. You can also open a WhatsApp template for your concern. Shifa is from Allah alone — no guarantee of healing.",
      },
    ],
  },
  {
    slug: "islamabad",
    name: "Islamabad",
    regionLabel: "Islamabad Capital Territory, Pakistan",
    metaTitle:
      "Spiritual Healing Islamabad & Rawalpindi Online | Redeemysoul",
    metaDescription:
      "Private Islamic spiritual guidance for Islamabad and Rawalpindi — ruqyah, nazar, jadoo, jinnat, bandish. Spiritual Healing Shazli online. First diagnosis Hadiya PKR 5,000.",
    h1: "Spiritual healing for Islamabad & Rawalpindi",
    intro:
      "Redeemysoul / Spiritual Healing Shazli supports capital-region seekers with private Islamic spiritual care. Online consultation first; Karachi Baldia office by appointment if you later travel.",
    keywords: [
      "spiritual healing Islamabad",
      "ruqyah Islamabad",
      "rohani ilaj Rawalpindi",
      "jadoo Islamabad",
      "bandish Islamabad",
      "nazar Islamabad",
    ],
    audience: "pakistan",
    hadiyaNote: `Pakistan Hadiya for first spiritual diagnosis: ${HADIYA.pakistan.amountLabel} via ${HADIYA.pakistan.method} ${HADIYA.pakistan.account}.`,
    sections: [
      {
        heading: "Quiet care for a busy capital",
        body: "Islamabad and Rawalpindi families often need discretion. Our begin flow and WhatsApp path keep your name, mother’s name, and details for consultation only — never public posts.",
      },
      {
        heading: "What guidance can cover",
        body: "Nazar and hasad, sihr concerns, jinnat/aseeb language, bandish patterns, taweez fear, and homes that feel heavy. Faith before fear; remembrance-centered steps.",
      },
      {
        heading: "Start today",
        body: "Open Begin healing from your phone in Islamabad. Complete Hadiya verification for diagnosis review. Disclaimer always applies: not medical treatment; Shifa from Allah alone.",
      },
    ],
  },
  {
    slug: "uk",
    name: "United Kingdom",
    regionLabel: "UK diaspora",
    metaTitle:
      "Islamic Spiritual Healing UK Diaspora Online | Redeemysoul USD 50",
    metaDescription:
      "UK Pakistani and Muslim diaspora: private online Islamic healing with Spiritual Healing Shazli (Karachi). Nazar, sihr, bandish, home unrest. International Hadiya USD 50 for first diagnosis.",
    h1: "Spiritual healing for the UK diaspora — online from Karachi",
    intro:
      "Living in London, Birmingham, Manchester, or elsewhere in the UK and carrying spiritual heaviness from back-home fears? Redeemysoul offers private Islamic guidance online. International first-diagnosis Hadiya is USD 50.",
    keywords: [
      "spiritual healing UK",
      "ruqyah UK Pakistani",
      "jadoo ilaj UK",
      "bandish UK",
      "Islamic healer online UK",
      "rohani ilaj Britain",
    ],
    audience: "international",
    hadiyaNote: `International Hadiya for first spiritual diagnosis: ${HADIYA.international.amountLabel} via ${HADIYA.international.method} ${HADIYA.international.account}.`,
    sections: [
      {
        heading: "Diaspora concerns we hear often",
        body: "Family bandish stories from Pakistan, nazar after visits home, unsettled houses abroad, marriage delays across borders, and fear that followed a relative’s conflict. Distance does not block a careful first consultation.",
      },
      {
        heading: "Timezone-friendly private path",
        body: "Use the Begin flow, select International Hadiya (USD 50), share last 5 transaction digits, and open WhatsApp with your tracking message. We reply with adab — not drama.",
      },
      {
        heading: "Office visits",
        body: "In-person care remains at Ittehad Town, Baldia Town, Karachi by appointment after first message — useful if you travel to Pakistan. Until then, online guidance can begin.",
      },
    ],
  },
  {
    slug: "uae",
    name: "United Arab Emirates",
    regionLabel: "UAE diaspora",
    metaTitle:
      "Islamic Spiritual Healing UAE Dubai Online | Redeemysoul USD 50",
    metaDescription:
      "Dubai, Abu Dhabi, Sharjah seekers: private online ruqyah-centered Islamic healing with Spiritual Healing Shazli. International Hadiya USD 50 for first diagnosis review.",
    h1: "Spiritual healing for UAE — Dubai, Abu Dhabi, Sharjah online",
    intro:
      "Expatriates in the UAE often need discreet Islamic spiritual care while working far from home. Spiritual Healing Shazli (Redeemysoul) consults online first. International Hadiya for diagnosis review: USD 50.",
    keywords: [
      "spiritual healing Dubai",
      "ruqyah UAE",
      "jadoo ka ilaj Dubai",
      "rohani ilaj Abu Dhabi",
      "bandish UAE",
      "Islamic healer Dubai online",
    ],
    audience: "international",
    hadiyaNote: `International Hadiya for first spiritual diagnosis: ${HADIYA.international.amountLabel} via ${HADIYA.international.method} ${HADIYA.international.account}.`,
    sections: [
      {
        heading: "Why UAE seekers write us",
        body: "Home unrest after relocating, children’s fear, rizq strain, sihr/jadoo worry tied to family disputes, and the wish for a Pakistani Islamic healer who answers privately on WhatsApp.",
      },
      {
        heading: "International Hadiya path",
        body: "On Begin, choose International, send USD 50 to the listed IBAN, enter the last 5 digits of the transaction, then create your request. A prefilled WhatsApp message opens with your reference.",
      },
      {
        heading: "Disclaimer",
        body: "Spiritual healing is not a substitute for medical treatment. Shifa is from Allah alone. No guarantee of healing is offered.",
      },
    ],
  },
];

export function getCity(slug: string): CityPage | undefined {
  return CITY_PAGES.find((city) => city.slug === slug);
}

export function allCitySlugs(): string[] {
  return CITY_PAGES.map((city) => city.slug);
}
