export type SeoTopic = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  keywords: string[];
  sections: { heading: string; body: string }[];
  related: string[];
};

/**
 * Dynamic SEO topic clusters — each becomes /topics/[slug]
 * so Google can match many search intents to Redeemysoul.
 */
export const SEO_TOPICS: SeoTopic[] = [
  {
    slug: "jadoo-sihr-sifli",
    title: "Jadoo, Sihr & Sifli Sihr",
    metaTitle: "Jadoo Sihr Sifli Sihr Ilaj Karachi | Spiritual Healing Shazli",
    metaDescription:
      "Private Islamic guidance for jadoo, sihr, and sifli sihr concerns in Karachi. Spiritual Healing Shazli (Redeemysoul) — ruqyah-centered care. Not medical treatment. Shifa from Allah alone.",
    h1: "Jadoo, sihr, and sifli sihr — calm Islamic guidance",
    intro:
      "People search for jadoo ka ilaj, sihr treatment, and sifli sihr when fear, dreams, household strain, or sudden life blockage feel beyond ordinary hardship. Redeemysoul / Spiritual Healing Shazli offers private, adab-first Islamic spiritual care in Karachi.",
    keywords: [
      "jadoo",
      "jadoo ka ilaj",
      "sihr",
      "sifli sihr",
      "sifli sihar",
      "black magic",
      "kala jadoo",
      "sihr ka tor",
      "jadoo removal Karachi",
    ],
    sections: [
      {
        heading: "What seekers usually mean by jadoo / sihr",
        body: "In Islamic teaching, sihr is real and condemned. In daily language people say jadoo, kala jadoo, or sifli sihr when they sense harmful spiritual interference — disturbed sleep, unexplained fear, repeated obstacles, or family unrest. We listen carefully and never turn pain into spectacle.",
      },
      {
        heading: "How life can feel affected",
        body: "Common reports include night pressure, heavy dreams, stalled rizq, marriage delays, coldness between spouses, and a home that feels restless. These patterns are reasons to seek clarity — not automatic proof of sihr. Medical care should continue whenever needed.",
      },
      {
        heading: "How Redeemysoul responds",
        body: "Consultation stays private. Guidance may include dua, ruqyah-centered practice, and practical next steps. Spiritual healing is not a substitute for medical treatment. Shifa is from Allah alone. No guarantee of healing is offered.",
      },
    ],
    related: ["jinnat-aseeb", "bandish", "taweez", "magic-grimoire"],
  },
  {
    slug: "jinnat-aseeb",
    title: "Jinnat & Aseeb",
    metaTitle: "Jinnat Aseeb Ruqyah Karachi | Spiritual Healing Shazli",
    metaDescription:
      "Guidance for jinnat and aseeb-related spiritual concerns in Karachi. Private Islamic ruqyah-centered care by Spiritual Healing Shazli. Not a medical substitute.",
    h1: "Jinnat and aseeb — private spiritual care",
    intro:
      "Searches for jinnat, jinn, and aseeb often come from people facing presence, whispers, nightmares, pressure, or household unrest. Spiritual Healing Shazli serves Muslim and non-Muslim seekers with dignity and confidentiality.",
    keywords: [
      "jinnat",
      "jinn",
      "aseeb",
      "jinnat ka ilaj",
      "aseeb ka ilaj",
      "jinn possession",
      "ruqyah for jinn",
      "jinnat Karachi",
    ],
    sections: [
      {
        heading: "Understanding jinnat and aseeb in spiritual language",
        body: "The Qur’an affirms jinn as a creation of Allah. Aseeb is a common South Asian term for sensed spiritual affliction or pressure. Other cultures may use words like spirit disturbance. Honest care separates spiritual concern, ordinary hardship, and medical need.",
      },
      {
        heading: "Signs people associate with these concerns",
        body: "Recurring nightmares, a watched feeling, sudden fear, disturbed sleep, or unexplained household tension. Always rule out health and safety issues with qualified professionals alongside any spiritual path.",
      },
      {
        heading: "Our approach",
        body: "Private consultation, calm speech, remembrance-centered guidance. No fear marketing. Shifa is from Allah alone; results are never guaranteed.",
      },
    ],
    related: ["jadoo-sihr-sifli", "bandish", "spiritual-reiki", "ruqyah-karachi"],
  },
  {
    slug: "bandish",
    title: "Bandish",
    metaTitle: "Bandish Ka Ilaj Karachi | Marriage & Rizq Blockage Healing",
    metaDescription:
      "Bandish guidance for stalled marriage, rizq blockage, and closed doors. Spiritual Healing Shazli — Islamic spiritual care in Karachi. Shifa from Allah alone.",
    h1: "Bandish — when life feels spiritually bound",
    intro:
      "Bandish is a widely searched term for sensed spiritual binding: failed rishtas, frozen business, closed opportunities, or emotional distance that feels forced. Redeemysoul helps seekers understand and address this with private Islamic guidance.",
    keywords: [
      "bandish",
      "bandish ka ilaj",
      "bandish torna",
      "shadi bandish",
      "rizq bandish",
      "marriage blockage",
      "spiritual binding",
    ],
    sections: [
      {
        heading: "What bandish often refers to",
        body: "A pastoral / spiritual term for blockage — not a medical diagnosis. People link it to delayed nikah, last-minute wedding obstacles, rizq that will not open, or sudden coldness between husband and wife.",
      },
      {
        heading: "Marriage and spouse distance",
        body: "Many ask whether bandish can create distance between mia-biwi or stop proposals. Spiritual care takes such reports seriously while also checking communication, family pressure, finances, and health.",
      },
      {
        heading: "Next step",
        body: "Begin a private consultation. Guidance is faith-centered and confidential. No healing guarantee; medical treatment is never replaced.",
      },
    ],
    related: ["jadoo-sihr-sifli", "taweez", "jinnat-aseeb", "spiritual-healing-karachi"],
  },
  {
    slug: "taweez",
    title: "Taweez",
    metaTitle: "Taweez Concerns & Islamic Guidance Karachi | Redeemysoul",
    metaDescription:
      "Private guidance for taweez-related fear, suspicion, or spiritual concern in Karachi. Spiritual Healing Shazli — Islamic ruqyah-centered care with clear disclaimer.",
    h1: "Taweez-related concerns — respectful Islamic guidance",
    intro:
      "People search taweez, taweez ka asar, and related terms when they fear an amulet, object, or practice is affecting their home, marriage, or peace. We provide private consultation without drama.",
    keywords: [
      "taweez",
      "taweez ka ilaj",
      "taweez ka asar",
      "haram taweez",
      "taweez removal",
      "amulet spiritual harm",
    ],
    sections: [
      {
        heading: "Why people ask about taweez",
        body: "Fear after finding an object, suspicion after conflict, or family stories about taweez can create deep anxiety. Some cases need spiritual discernment; some need reassurance and ordinary problem-solving.",
      },
      {
        heading: "How we help",
        body: "Listen privately, guide with Islamic manners, and point to remembrance and ruqyah-centered care where appropriate. We do not promote fear or public exposure.",
      },
      {
        heading: "Disclaimer",
        body: "Spiritual healing is not a substitute for medical treatment. Shifa is from Allah alone. No guarantee of healing is offered.",
      },
    ],
    related: ["jadoo-sihr-sifli", "bandish", "magic-grimoire", "jinnat-aseeb"],
  },
  {
    slug: "magic-grimoire",
    title: "Magic & Grimoire Concerns",
    metaTitle: "Magic Grimoire Spiritual Harm Guidance | Spiritual Healing Shazli",
    metaDescription:
      "For those searching magic, grimoire, occult ritual harm, or dark practice effects — private Islamic spiritual guidance in Karachi. Not medical care. Shifa from Allah alone.",
    h1: "Magic and grimoire-related spiritual strain",
    intro:
      "Some viewers arrive after searching magic, occult books, grimoire, or ritual harm. Whether Muslim or non-Muslim, if you feel spiritually unsettled by these topics, Redeemysoul offers calm, private Islamic-centered guidance — never instruction in harmful magic.",
    keywords: [
      "magic",
      "grimoire",
      "occult",
      "dark magic",
      "spell harm",
      "ritual magic effects",
      "magic removal spiritual",
    ],
    sections: [
      {
        heading: "Who this page is for",
        body: "People who fear they were targeted, who experimented and now feel disturbed, or whose family is shaken by occult talk. We address the spiritual distress — we do not teach grimoire practice.",
      },
      {
        heading: "Islamic framing",
        body: "Sihr and harmful magic are condemned. Protection and healing are sought through Allah, dua, and lawful spiritual means. Curiosity about dark arts is redirected toward remembrance and safety.",
      },
      {
        heading: "Care pathway",
        body: "Private consultation via WhatsApp/email flow, optional in-person appointment later. Continue any medical or psychological care you need.",
      },
    ],
    related: ["jadoo-sihr-sifli", "taweez", "samada-energies", "spiritual-reiki"],
  },
  {
    slug: "spiritual-reiki",
    title: "Spiritual Reiki Seekers",
    metaTitle: "Spiritual Reiki Alternative Islamic Healing Karachi | Redeemysoul",
    metaDescription:
      "Searching Spiritual Reiki or energy healing in Karachi? Spiritual Healing Shazli offers Islamic ruqyah-centered spiritual care as a faith-rooted alternative path.",
    h1: "If you are searching Spiritual Reiki",
    intro:
      "Many people type Spiritual Reiki when they want energetic calm, cleansing, or healing. Redeemysoul serves those seekers with Islamic spiritual healing — remembrance, dua, and ruqyah-centered care — especially if Reiki alone did not settle the heart.",
    keywords: [
      "Spiritual Reiki",
      "reiki Karachi",
      "reiki healing",
      "energy healing Karachi",
      "reiki alternative Islamic",
      "spiritual energy healing",
    ],
    sections: [
      {
        heading: "Why Reiki searchers land here",
        body: "Google often overlaps energy-healing queries with spiritual healer searches. If you want faith-aligned care in Karachi, Spiritual Healing Shazli provides private Islamic guidance for heaviness, fear, and home unrest.",
      },
      {
        heading: "What we offer instead of spectacle",
        body: "Quiet consultation, clear next steps, and respect for both Muslim and non-Muslim visitors. We do not claim to replace doctors or guarantee outcomes.",
      },
      {
        heading: "Begin carefully",
        body: "Start a consultation online. Share what you feel. Receive guidance with adab. Shifa is from Allah alone.",
      },
    ],
    related: ["samada-energies", "spiritual-healing-karachi", "ruqyah-karachi", "home-cleansing"],
  },
  {
    slug: "samada-energies",
    title: "SAMADA Energies",
    metaTitle: "SAMADA Energies Seekers | Islamic Spiritual Healing Karachi",
    metaDescription:
      "Looking up SAMADA Energies or similar energy work? Find private Islamic spiritual healing with Spiritual Healing Shazli (Redeemysoul) in Karachi.",
    h1: "SAMADA Energies — and faith-centered spiritual care",
    intro:
      "Some visitors discover Redeemysoul while searching SAMADA Energies or related energy-healing names. If you need grounded spiritual support for fear, blockage, or household strain, our door is open for private Islamic guidance.",
    keywords: [
      "SAMADA Energies",
      "Samada",
      "energy healing",
      "spiritual energies",
      "energy cleanser Karachi",
    ],
    sections: [
      {
        heading: "Meeting energy-healing search intent",
        body: "People compare many spiritual brands. Redeemysoul’s path is Islamic: dua, ruqyah-centered care, privacy, and no fear show. Suitable for those who want Karachi-based spiritual consultation with clear ethical boundaries.",
      },
      {
        heading: "What to expect",
        body: "A structured begin flow, WhatsApp/email message, and careful reply. Office visits by appointment after first contact.",
      },
      {
        heading: "Disclaimer",
        body: "Not a medical substitute. Shifa from Allah alone. No guarantee of healing.",
      },
    ],
    related: ["spiritual-reiki", "spiritual-healing-karachi", "bandish", "jadoo-sihr-sifli"],
  },
  {
    slug: "ruqyah-karachi",
    title: "Ruqyah Karachi",
    metaTitle: "Ruqyah Karachi | Islamic Ruqyah Spiritual Healing Shazli",
    metaDescription:
      "Ruqyah-centered Islamic spiritual healing in Karachi by Spiritual Healing Shazli (Redeemysoul). Private care for nazar, sihr concerns, and spiritual pressure.",
    h1: "Ruqyah in Karachi — private Islamic care",
    intro:
      "Searching ruqyah Karachi, Islamic ruqyah, or roohani ilaj? Redeemysoul provides respectful, private ruqyah-centered guidance with Spiritual Healing Shazli.",
    keywords: [
      "ruqyah Karachi",
      "ruqyah",
      "islamic ruqyah",
      "roohani ilaj",
      "roohani ilaj Karachi",
      "ruqyah shariah",
    ],
    sections: [
      {
        heading: "Ruqyah-centered, not theatrical",
        body: "Our focus is remembrance, Qur’anic refuge, and practical spiritual discipline — not loud rituals or public display.",
      },
      {
        heading: "Who seeks ruqyah here",
        body: "Those facing nazar, sihr fears, jinn concerns, bandish patterns, or spiritual heaviness. Muslims and non-Muslims seeking calm guidance are both addressed with clarity.",
      },
      {
        heading: "Start",
        body: "Use Begin healing to send a private request. Continue medical care as needed. No outcome guarantee.",
      },
    ],
    related: ["jadoo-sihr-sifli", "jinnat-aseeb", "spiritual-healing-karachi", "nazar-hasad"],
  },
  {
    slug: "nazar-hasad",
    title: "Nazar & Hasad",
    metaTitle: "Nazar Hasad Ka Ilaj Karachi | Spiritual Healing Shazli",
    metaDescription:
      "Nazar and hasad spiritual care in Karachi. Private Islamic guidance for envy-related heaviness, fear, and family protection concerns.",
    h1: "Nazar and hasad — protective spiritual guidance",
    intro:
      "Nazar ka ilaj and hasad concerns are among the most common searches. Sudden heaviness after praise, children’s fear, or home unrest often bring people to Spiritual Healing Shazli.",
    keywords: [
      "nazar",
      "nazar ka ilaj",
      "hasad",
      "evil eye",
      "nazar e bad",
      "buri nazar",
    ],
    sections: [
      {
        heading: "What people experience",
        body: "Unexplained fatigue of spirit, children’s disturbed sleep, business dips after visibility, or family tension following envy. Spiritual care and ordinary causes should both be considered.",
      },
      {
        heading: "Care with Redeemysoul",
        body: "Private consultation, dua-centered guidance, and clear next steps. Faith before fear.",
      },
      {
        heading: "Disclaimer",
        body: "Not medical treatment. Shifa from Allah alone. No guarantee.",
      },
    ],
    related: ["ruqyah-karachi", "bandish", "home-cleansing", "jadoo-sihr-sifli"],
  },
  {
    slug: "home-cleansing",
    title: "Home Cleansing",
    metaTitle: "Spiritual Home Cleansing Karachi | House Ruqyah Guidance",
    metaDescription:
      "Spiritual home cleansing guidance in Karachi for heavy, restless, or unsettled houses. Islamic care by Spiritual Healing Shazli.",
    h1: "Spiritual home cleansing",
    intro:
      "Searches for home cleansing, house cleaning spiritual, and ghar ki safai often mean a home that feels heavy or unsafe spiritually. We guide families privately.",
    keywords: [
      "home cleansing",
      "spiritual home cleansing",
      "house ruqyah",
      "ghar ki safai rohani",
      "negative energy home",
      "house cleansing Karachi",
    ],
    sections: [
      {
        heading: "When a home feels unsettled",
        body: "Restlessness, repeated conflict, fear in rooms, or strange disturbances lead families to seek cleansing. Check safety and health first; then consider spiritual guidance.",
      },
      {
        heading: "Our home-focused care",
        body: "Appointment-based office consultation after first message when needed, plus remote guidance for many cases.",
      },
      {
        heading: "Disclaimer",
        body: "Spiritual cleansing is not a medical or pest-control service. Shifa from Allah alone. No guarantee.",
      },
    ],
    related: ["jinnat-aseeb", "jadoo-sihr-sifli", "spiritual-reiki", "ruqyah-karachi"],
  },
  {
    slug: "spiritual-healing-karachi",
    title: "Spiritual Healing Karachi",
    metaTitle: "Spiritual Healing Karachi | Spiritual Healing Shazli Redeemysoul",
    metaDescription:
      "Top spiritual healing in Karachi — Spiritual Healing Shazli (Redeemysoul). Islamic ruqyah, nazar, jadoo, jinnat, bandish guidance. Baldia / citywide private care.",
    h1: "Spiritual healing in Karachi",
    intro:
      "If you searched spiritual healing Karachi, spiritual healer Karachi, or Spiritual Healing Shazli, you are in the right place. Redeemysoul serves seekers across Karachi with private Islamic spiritual care.",
    keywords: [
      "spiritual healing Karachi",
      "spiritual healer Karachi",
      "Spiritual Healing Shazli",
      "rohani ilaj Karachi",
      "best spiritual healer Karachi",
      "Baldia spiritual healing",
    ],
    sections: [
      {
        heading: "Local spiritual care with a clear name",
        body: "Google Business: Spiritual Healing Shazli. Website: redeemysoul.com. Healer: Ejaz Noor Shazli. Address: Ittehad Town, Baldia Town, Karachi. Online consultation available first.",
      },
      {
        heading: "Concerns we commonly hear",
        body: "Jadoo/sihr, jinnat/aseeb, bandish, taweez fear, nazar, marriage blockage, home unrest, and general spiritual heaviness — including visitors who first searched Reiki, SAMADA Energies, or magic/grimoire topics.",
      },
      {
        heading: "Begin today",
        body: "Use the Begin page. WhatsApp +92 345 2845400. Email Roohaniilajkarachi@gmail.com. Disclaimer always applies.",
      },
    ],
    related: [
      "ruqyah-karachi",
      "jadoo-sihr-sifli",
      "jinnat-aseeb",
      "bandish",
      "spiritual-reiki",
      "samada-energies",
    ],
  },
];

export function getTopic(slug: string): SeoTopic | undefined {
  return SEO_TOPICS.find((topic) => topic.slug === slug);
}

export function allTopicSlugs(): string[] {
  return SEO_TOPICS.map((topic) => topic.slug);
}

/** Flat keyword list for sitewide meta + schema. */
export const DYNAMIC_SEO_KEYWORDS: string[] = Array.from(
  new Set(
    SEO_TOPICS.flatMap((topic) => topic.keywords).concat([
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
      "Redeemysoul",
      "Spiritual Healing Shazli",
    ]),
  ),
);
