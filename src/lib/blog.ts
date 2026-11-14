export type BlogPost = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  publishedAt: string;
  readingMinutes: number;
  excerpt: string;
  keywords: string[];
  relatedTopics: string[];
  sections: { heading: string; body: string }[];
};

/**
 * Starter blog cadence — one practical article per concern cluster.
 * Expand weekly; keep disclaimer + Begin CTA on every post.
 */
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "bandish-signs",
    title: "Bandish signs people often notice before they ask for help",
    metaTitle: "Bandish Signs: Marriage, Rizq & Closed Doors | Redeemysoul",
    metaDescription:
      "Common bandish signs seekers describe — stalled rishtas, frozen rizq, sudden coldness — and how Spiritual Healing Shazli approaches private Islamic guidance. Not medical advice.",
    publishedAt: "2026-11-10",
    readingMinutes: 6,
    excerpt:
      "Bandish is not a medical label. It is the word many families use when life feels spiritually bound — proposals that die at the last step, work that will not open, or a marriage that suddenly goes cold.",
    keywords: [
      "bandish signs",
      "bandish ka ilaj",
      "shadi bandish",
      "rizq bandish",
      "marriage blockage signs",
    ],
    relatedTopics: ["bandish", "jadoo-sihr-sifli", "nazar-hasad"],
    sections: [
      {
        heading: "What “bandish” usually means in everyday speech",
        body: "In South Asian Muslim homes, bandish often points to a sensed binding: doors that should open stay shut. People link it to delayed nikah, last-minute wedding obstacles, business that stalls after a good start, or emotional distance that feels forced rather than chosen. Redeemysoul treats these reports with adab — without turning them into spectacle.",
      },
      {
        heading: "Signs seekers commonly describe",
        body: "Repeated rishta failures with no clear worldly reason. Engagements that break after unexplained conflict. Rizq that looks open then closes. Sudden coldness between spouses after a period of ease. A heavy feeling that “something is holding us.” None of these alone prove sihr or bandish; they are reasons to seek clarity — spiritual and practical.",
      },
      {
        heading: "What to check alongside spiritual concern",
        body: "Family pressure, finances, communication, and health still matter. Spiritual guidance does not replace medical care, counselling, or lawful problem-solving. Shifa is from Allah alone. No guarantee of healing is offered.",
      },
      {
        heading: "A calm next step",
        body: "If these patterns sound familiar, begin a private consultation with Spiritual Healing Shazli (Redeemysoul). Share your concern, complete the Hadiya step for first diagnosis review, and receive careful guidance — online first, Baldia office by appointment when needed.",
      },
    ],
  },
  {
    slug: "nazar-vs-sihr",
    title: "Nazar vs sihr — how seekers can tell the difference in language",
    metaTitle: "Nazar vs Sihr: Evil Eye and Black Magic Concerns | Redeemysoul",
    metaDescription:
      "Clear, calm distinction between nazar/hasad language and sihr/jadoo concerns. Islamic spiritual guidance from Spiritual Healing Shazli in Karachi. Not a medical diagnosis.",
    publishedAt: "2026-11-12",
    readingMinutes: 7,
    excerpt:
      "People often mix “nazar” and “sihr” in one sentence. The words feel similar when you are afraid — but in careful Islamic spiritual care, they point to different kinds of concern.",
    keywords: [
      "nazar vs sihr",
      "nazar ka ilaj",
      "sihr vs nazar",
      "evil eye vs black magic",
      "hasad",
      "jadoo",
    ],
    relatedTopics: ["nazar-hasad", "jadoo-sihr-sifli", "ruqyah-karachi"],
    sections: [
      {
        heading: "Nazar and hasad — envy, praise, sudden heaviness",
        body: "Nazar (evil eye) and hasad (envy) language usually follows visibility: a child praised, a business seen, a home admired — then fatigue of spirit, unsettled sleep, or a dip in ease. Many families seek protective dua and ruqyah-centered care when this pattern repeats.",
      },
      {
        heading: "Sihr and jadoo — harmful interference language",
        body: "Sihr (and everyday “jadoo”) points to feared harmful spiritual interference: unusual fear, heavy dreams, household unrest, or life blockage that feels beyond ordinary hardship. Islamic teaching takes sihr seriously and condemns it. Care stays private and remembrance-centered — never theatrical.",
      },
      {
        heading: "Why the mix-up happens",
        body: "Fear collapses vocabulary. Someone may say “jadoo” when they mean envy after a wedding post, or “nazar” when nightmares and pressure feel deeper. A careful consultation listens to the story first, then guides — without rushing to a dramatic label.",
      },
      {
        heading: "How Redeemysoul responds",
        body: "Spiritual Healing Shazli offers private Islamic guidance for both nazar/hasad and sihr concerns. Medical treatment is never replaced. Shifa is from Allah alone. No outcome guarantee. Begin online; office visits in Baldia / Ittehad Town are by appointment after first contact.",
      },
    ],
  },
  {
    slug: "home-feel-heavy",
    title: "When the home feels heavy — spiritual home unrest explained gently",
    metaTitle: "Home Feels Heavy: Spiritual House Unrest Guidance | Redeemysoul",
    metaDescription:
      "What families mean when they say the home feels heavy or restless — and how Islamic spiritual home cleansing guidance works with Spiritual Healing Shazli. Not medical or pest control.",
    publishedAt: "2026-11-14",
    readingMinutes: 6,
    excerpt:
      "“The house feels heavy” is one of the most common lines in a first message. Families mean restlessness, fear in rooms, repeated conflict, or a sense that peace will not settle — even when the walls look fine.",
    keywords: [
      "home feels heavy",
      "spiritual home cleansing",
      "house ruqyah",
      "ghar ki safai rohani",
      "negative energy home",
      "home unrest spiritual",
    ],
    relatedTopics: ["home-cleansing", "jinnat-aseeb", "ruqyah-karachi"],
    sections: [
      {
        heading: "What “heavy home” language often includes",
        body: "Disturbed sleep in one room. Children afraid without a clear reason. Arguments that flare in the same spaces. Guests who feel uneasy. A watched or pressured feeling after dark. These reports bring people to spiritual home cleansing searches — ghar ki safai, house ruqyah, negative energy at home.",
      },
      {
        heading: "Safety and health first",
        body: "Check ordinary safety, electrical issues, and health needs before assuming a spiritual cause. Spiritual care sits beside — never instead of — medical and practical help. Redeemysoul does not offer pest control or clinical treatment.",
      },
      {
        heading: "Faith-centered home guidance",
        body: "Our approach is Islamic: privacy, dua, ruqyah-centered remembrance, and clear next steps for the household. No fear marketing. No public display. Shifa is from Allah alone; results are never guaranteed.",
      },
      {
        heading: "Begin from where you are",
        body: "Online consultation can start from Karachi, Lahore, Islamabad, or abroad (international Hadiya USD 50). Baldia office visits are by appointment after the first message. Use Begin healing to send your matter privately.",
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function allPostSlugs(): string[] {
  return BLOG_POSTS.map((post) => post.slug);
}
