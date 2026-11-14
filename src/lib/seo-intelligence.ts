import type { SeoTopic } from "@/lib/seo-topics";
import { SEO_TOPICS, getTopic } from "@/lib/seo-topics";
import { SITE, absoluteUrl } from "@/lib/seo";

/**
 * AI-only SEO intelligence layer
 * ---------------------------
 * Humans usually add keywords. This layer builds a search lattice:
 * 1) Intent cascade (awareness → fear → validation → action)
 * 2) Phonetic / Roman-Urdu / misspelling fan-out
 * 3) People-Also-Ask capsules shaped for AI Overviews / featured snippets
 * 4) Knowledge-graph sameAs anchors
 * 5) Co-occurrence mesh (topics that should reinforce each other)
 */

export type IntentStage =
  | "awareness"
  | "fear"
  | "validation"
  | "symptoms"
  | "impact"
  | "action";

export type PaaItem = { q: string; a: string };

export type TopicIntelligence = {
  slug: string;
  snippetAnswer: string;
  speakable: string[];
  phoneticLattice: string[];
  paa: PaaItem[];
  intentCascade: { stage: IntentStage; heading: string; body: string }[];
  sameAs: string[];
  coOccurWith: string[];
  entityMentions: string[];
};

const ENTITY_CORE = [
  SITE.businessName,
  SITE.name,
  SITE.healer,
  "Karachi",
  "Baldia Town",
  "Islamic ruqyah",
] as const;

/** Roman-Urdu + phonetic + near-miss variants Google/AI actually see. */
const PHONETIC_MAP: Record<string, string[]> = {
  "jadoo-sihr-sifli": [
    "jadoo",
    "jadu",
    "jaadu",
    "kala jadoo",
    "kala jadu",
    "sihr",
    "sehr",
    "seher",
    "sifli sihr",
    "sifli sihar",
    "sifli sehr",
    "black magic ka ilaj",
    "jadoo ka tor",
    "sihr ka ilaj karachi",
  ],
  "jinnat-aseeb": [
    "jinnat",
    "jinat",
    "jinn",
    "djinn",
    "aseeb",
    "asaib",
    "asayab",
    "jinnat ka asar",
    "jinn possession symptoms",
    "rohani dabao",
  ],
  bandish: [
    "bandish",
    "bandishh",
    "shadi bandish",
    "rishta bandish",
    "rizq bandish",
    "bandish ka tor",
    "spiritual blockage",
    "marriage locked spiritually",
  ],
  taweez: [
    "taweez",
    "taveez",
    "taviz",
    "taweezat",
    "haram taweez",
    "taweez ka asar",
    "amulet fear",
  ],
  "magic-grimoire": [
    "grimoire",
    "grimorie",
    "occult book",
    "spell book harm",
    "dark ritual effects",
    "magic after effects",
    "occult disturbance",
  ],
  "spiritual-reiki": [
    "spiritual reiki",
    "reiki healing karachi",
    "reiki master near me",
    "energy healing pakistan",
    "reiki vs ruqyah",
    "chakra cleansing karachi",
  ],
  "samada-energies": [
    "samada energies",
    "samada energy",
    "samada healing",
    "energy cleanse karachi",
    "spiritual energies healer",
  ],
  "ruqyah-karachi": [
    "ruqyah karachi",
    "roqya",
    "ruqya",
    "roohani ilaj",
    "rohani ilaj karachi",
    "islamic exorcism karachi",
  ],
  "nazar-hasad": [
    "nazar",
    "nazar e bad",
    "buri nazar",
    "hasad",
    "evil eye pakistan",
    "nazar utarna",
    "nazar ka tor",
  ],
  "home-cleansing": [
    "home cleansing",
    "house cleansing spiritual",
    "ghar ki rohani safai",
    "negative energy ghar",
    "house ruqyah",
    "flat cleansing karachi",
  ],
  "spiritual-healing-karachi": [
    "spiritual healing karachi",
    "spiritual healer karachi",
    "best rohani amil karachi",
    "spiritual healing shazli",
    "baldia spiritual healer",
    "online rohani ilaj",
  ],
};

const SAME_AS: Record<string, string[]> = {
  "jadoo-sihr-sifli": [
    "https://en.wikipedia.org/wiki/Sihr",
    "https://en.wikipedia.org/wiki/Magic_in_Islam",
  ],
  "jinnat-aseeb": [
    "https://en.wikipedia.org/wiki/Jinn",
    "https://en.wikipedia.org/wiki/Spirit_possession",
  ],
  bandish: ["https://en.wikipedia.org/wiki/Curse"],
  taweez: ["https://en.wikipedia.org/wiki/Ta%27wiz"],
  "magic-grimoire": [
    "https://en.wikipedia.org/wiki/Grimoire",
    "https://en.wikipedia.org/wiki/Magic_(supernatural)",
  ],
  "spiritual-reiki": ["https://en.wikipedia.org/wiki/Reiki"],
  "samada-energies": ["https://en.wikipedia.org/wiki/Energy_medicine"],
  "ruqyah-karachi": ["https://en.wikipedia.org/wiki/Ruqyah"],
  "nazar-hasad": ["https://en.wikipedia.org/wiki/Evil_eye"],
  "home-cleansing": ["https://en.wikipedia.org/wiki/Spiritual_cleansing"],
  "spiritual-healing-karachi": [
    "https://en.wikipedia.org/wiki/Spiritual_healing",
    "https://en.wikipedia.org/wiki/Karachi",
  ],
};

function unique(items: string[]): string[] {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

function buildPaa(topic: SeoTopic): PaaItem[] {
  const label = topic.title;
  return [
    {
      q: `What is ${label.toLowerCase()} in simple words?`,
      a: `${topic.intro.split(".").slice(0, 2).join(".")}. Spiritual Healing Shazli (Redeemysoul) in Karachi offers private Islamic guidance for this concern. It is not medical treatment; shifa is from Allah alone.`,
    },
    {
      q: `How do I know if ${label.toLowerCase()} is affecting me?`,
      a: `People often notice repeated unexplained fear, heavy dreams, household unrest, stalled marriage/rizq, or sudden coldness between spouses. These signs need calm discernment — and medical care when health is involved. No pattern alone is absolute proof.`,
    },
    {
      q: `Is ${label.toLowerCase()} real according to Islam?`,
      a: `Islamic sources discuss unseen harm such as sihr, nazar, and jinn. Whatever name you searched — including modern energy or occult terms — Redeemysoul responds with Qur’an-rooted care, privacy, and no fear spectacle.`,
    },
    {
      q: `Where can I get help for ${label.toLowerCase()} in Karachi?`,
      a: `Spiritual Healing Shazli (Redeemysoul), with Ejaz Noor Shazli, serves Karachi seekers online first via WhatsApp/email consultation, then office appointment in Baldia / Ittehad Town if needed.`,
    },
    {
      q: `Is spiritual healing a medical substitute for ${label.toLowerCase()}?`,
      a: `No. Spiritual healing is not a substitute for medical treatment. Shifa is from Allah alone. No guarantee of healing is offered.`,
    },
  ];
}

function buildCascade(topic: SeoTopic): TopicIntelligence["intentCascade"] {
  return [
    {
      stage: "awareness",
      heading: "If you typed this into Google",
      body: `You may have searched ${topic.keywords.slice(0, 3).join(", ")}, or a near spelling of those words. This page exists so that query can resolve to clear Islamic spiritual guidance — not fear content or occult instruction.`,
    },
    {
      stage: "fear",
      heading: "The quiet fear behind the search",
      body: `Most visitors are not chasing thrills. They want sleep, peace at home, a marriage that moves forward, or relief from a sensed pressure. ${SITE.businessName} hears that fear with adab.`,
    },
    {
      stage: "validation",
      heading: "Your concern can be named without panic",
      body: topic.intro,
    },
    {
      stage: "symptoms",
      heading: "Patterns people associate with this topic",
      body: `Disturbed sleep, heavy dreams, watched feelings, stalled rizq, delayed nikah, spouse distance, or a restless house. Use these as conversation starters with a trusted guide — and with a doctor when the body is involved.`,
    },
    {
      stage: "impact",
      heading: "Life areas that can feel touched",
      body: `Home atmosphere, children’s rest, business doors, marital warmth, and inner salah/dua rhythm can all feel strained. ${SITE.name} focuses on private next steps, not public claims.`,
    },
    {
      stage: "action",
      heading: "A calm next action",
      body: `Begin a private consultation on Redeemysoul. Mention ${topic.title} in your note. Online first. Office in Karachi by appointment. Reminder: not medical care; shifa from Allah alone; no guarantee.`,
    },
  ];
}

export function getTopicIntelligence(topic: SeoTopic): TopicIntelligence {
  const phoneticLattice = unique([
    ...(PHONETIC_MAP[topic.slug] ?? []),
    ...topic.keywords,
    ...topic.keywords.map((k) => k.toLowerCase()),
    `${topic.keywords[0] ?? topic.title} karachi`,
    `${topic.keywords[0] ?? topic.title} pakistan`,
  ]);

  const coOccurWith = topic.related.filter((slug) => Boolean(getTopic(slug)));

  const snippetAnswer = `${topic.title}: ${topic.intro} At ${SITE.businessName} (${SITE.name}) in Karachi, seekers receive private Islamic ruqyah-centered guidance with ${SITE.healer}. Spiritual healing is not a medical substitute. Shifa is from Allah alone. No guarantee of healing.`;

  return {
    slug: topic.slug,
    snippetAnswer,
    speakable: [
      snippetAnswer,
      `Contact ${SITE.businessName} in Karachi for private consultation about ${topic.title}.`,
    ],
    phoneticLattice,
    paa: buildPaa(topic),
    intentCascade: buildCascade(topic),
    sameAs: SAME_AS[topic.slug] ?? [],
    coOccurWith,
    entityMentions: [...ENTITY_CORE],
  };
}

export function buildTopicRichJsonLd(topic: SeoTopic) {
  const intel = getTopicIntelligence(topic);
  const pageUrl = absoluteUrl(`/topics/${topic.slug}`);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: topic.h1,
        description: topic.metaDescription,
        inLanguage: ["en", "ur"],
        isAccessibleForFree: true,
        author: {
          "@type": "Person",
          name: SITE.healer,
          worksFor: { "@type": "Organization", name: SITE.businessName },
        },
        publisher: {
          "@type": "Organization",
          name: SITE.businessName,
          alternateName: [SITE.name, SITE.healer],
          url: absoluteUrl("/"),
        },
        mainEntityOfPage: pageUrl,
        keywords: intel.phoneticLattice.join(", "),
        about: intel.phoneticLattice.slice(0, 12).map((name) => ({
          "@type": "Thing",
          name,
        })),
        mentions: intel.entityMentions.map((name) => ({
          "@type": "Thing",
          name,
        })),
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [".seo-snippet", ".seo-speakable"],
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: intel.paa.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
      {
        "@type": "DefinedTermSet",
        "@id": `${pageUrl}#terms`,
        name: `${topic.title} search terms`,
        hasDefinedTerm: intel.phoneticLattice.slice(0, 16).map((name) => ({
          "@type": "DefinedTerm",
          name,
          description: `Search variant related to ${topic.title} addressed by ${SITE.businessName} in Karachi.`,
          inDefinedTermSet: `${pageUrl}#terms`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: absoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Topics",
            item: absoluteUrl("/topics"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: topic.title,
            item: pageUrl,
          },
        ],
      },
      ...(intel.sameAs.length
        ? [
            {
              "@type": "Thing",
              "@id": `${pageUrl}#concept`,
              name: topic.title,
              sameAs: intel.sameAs,
              url: pageUrl,
            },
          ]
        : []),
    ],
  };
}

/** Sitewide co-occurrence edge list for topical authority mesh. */
export function buildTopicalMesh() {
  return SEO_TOPICS.map((topic) => {
    const intel = getTopicIntelligence(topic);
    return {
      topic: topic.slug,
      title: topic.title,
      edges: intel.coOccurWith,
      phonetics: intel.phoneticLattice.length,
      paa: intel.paa.length,
    };
  });
}
