"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "ur";

type Dictionary = {
  nav: {
    services: string;
    path: string;
    learn: string;
    topics: string;
    blog: string;
    locations: string;
    templates: string;
    about: string;
    visit: string;
    pricing: string;
    privacy: string;
    faq: string;
    begin: string;
    consultation: string;
    backHome: string;
  };
  hero: {
    brandLine: string;
    headline: string;
    support: string;
    ctaBegin: string;
    ctaServices: string;
  };
  services: {
    eyebrow: string;
    title: string;
    intro: string;
    items: { title: string; copy: string }[];
  };
  atmosphere: {
    quote: string;
    credit: string;
  };
  path: {
    eyebrow: string;
    title: string;
    intro: string;
    steps: { title: string; copy: string }[];
  };
  learn: {
    eyebrow: string;
    title: string;
    intro: string;
    audience: string;
    topics: { title: string; copy: string }[];
    effectsTitle: string;
    effectsIntro: string;
    effects: string[];
    marriageTitle: string;
    marriageBody: string[];
    refsTitle: string;
    refsMuslimTitle: string;
    refsMuslim: string[];
    refsGeneralTitle: string;
    refsGeneral: string[];
    closing: string;
  };
  trust: {
    items: { eyebrow: string; title: string; copy: string }[];
  };
  testimonials: {
    eyebrow: string;
    title: string;
    intro: string;
    items: { name: string; place: string; quote: string }[];
  };
  about: {
    eyebrow: string;
    title: string;
    body: string[];
  };
  hours: {
    eyebrow: string;
    title: string;
    intro: string;
    items: { label: string; value: string }[];
    note: string;
  };
  location: {
    eyebrow: string;
    title: string;
    business: string;
    address: string;
    intro: string;
    openMaps: string;
  };
  disclaimer: {
    eyebrow: string;
    title: string;
    body: string;
    short: string;
    points: string[];
  };
  faq: {
    eyebrow: string;
    title: string;
    intro: string;
    items: { q: string; a: string }[];
  };
  contact: {
    eyebrow: string;
    title: string;
    intro: string;
    ctaBegin: string;
    ctaWhatsapp: string;
  };
  footer: {
    blurb: string;
    privacy: string;
    begin: string;
    email: string;
    whatsapp: string;
  };
  begin: {
    stepConcern: string;
    stepDetails: string;
    stepHadiya: string;
    stepSend: string;
    eyebrow: string;
    title: string;
    intro: string;
    continue: string;
    detailsEyebrow: string;
    detailsTitle: string;
    concernSelected: string;
    privacy: string;
    name: string;
    mother: string;
    location: string;
    phone: string;
    note: string;
    namePh: string;
    motherPh: string;
    locationPh: string;
    phonePh: string;
    notePh: string;
    appointmentDay: string;
    appointmentTime: string;
    appointmentHint: string;
    appointmentDays: Record<string, string>;
    appointmentTimes: Record<string, string>;
    back: string;
    toHadiya: string;
    submit: string;
    submitting: string;
    autoWaHint: string;
    openWaNow: string;
    hadiyaEyebrow: string;
    hadiyaTitle: string;
    hadiyaIntro: string;
    hadiyaPakistan: string;
    hadiyaInternational: string;
    hadiyaPkAmount: string;
    hadiyaIntlAmount: string;
    hadiyaEasyPaisa: string;
    hadiyaIban: string;
    hadiyaCopy: string;
    hadiyaCopied: string;
    hadiyaTxnLabel: string;
    hadiyaTxnPh: string;
    hadiyaTxnHint: string;
    hadiyaTxnError: string;
    hadiyaNote: string;
    readyTitle: string;
    readyIntro: string;
    reference: string;
    track: string;
    notifyWa: string;
    notifyEmail: string;
    pendingTitle: string;
    pendingIntro: string;
    checkStatus: string;
    concerns: { id: string; title: string; hint: string }[];
  };
  track: {
    eyebrow: string;
    title: string;
    intro: string;
    placeholder: string;
    check: string;
    checking: string;
    statusLabels: Record<string, string>;
  };
  pricing: {
    eyebrow: string;
    title: string;
    intro: string;
    diagnosisTitle: string;
    diagnosisBody: string;
    pkLabel: string;
    pkAmount: string;
    pkMethod: string;
    intlLabel: string;
    intlAmount: string;
    intlMethod: string;
    furtherTitle: string;
    furtherBody: string;
    appointmentTitle: string;
    appointmentBody: string;
    cta: string;
    note: string;
  };
  whatsappFloat: string;
  langEn: string;
  langUr: string;
};

const en: Dictionary = {
  nav: {
    services: "Services",
    path: "How it works",
    learn: "Learn",
    topics: "Topics",
    blog: "Blog",
    locations: "Cities",
    templates: "WhatsApp",
    about: "About",
    visit: "Visit",
    pricing: "Pricing",
    privacy: "Privacy",
    faq: "FAQ",
    begin: "Begin",
    consultation: "Consultation",
    backHome: "Back home",
  },
  hero: {
    brandLine: "Spiritual Healing Shazli · Karachi",
    headline: "Islamic healing for a heart under pressure.",
    support:
      "Ruqyah-centered guidance for nazar, sihr concerns, and spiritual heaviness — private, respectful, and rooted in remembrance.",
    ctaBegin: "Begin healing",
    ctaServices: "Explore services",
  },
  services: {
    eyebrow: "Services",
    title: "Care that listens before it speaks.",
    intro:
      "Redeemysoul serves seekers who want Islamic healing without noise, shortcuts, or public display. Every consultation stays private.",
    items: [
      {
        title: "Nazar & hasad",
        copy: "For sudden heaviness, unexplained fear, or the sense that envy has settled on your home, work, or children — with calm ruqyah-centered care.",
      },
      {
        title: "Sihr & dark disturbance",
        copy: "When dreams, pressure, or household strain feel beyond ordinary hardship, we begin with discernment, dignity, and faith — never fear spectacle.",
      },
      {
        title: "Islamic healing",
        copy: "Private ruqyah-centered healing for spiritual heaviness, inner unrest, and matters that need quiet Islamic care — guided with adab, not haste.",
      },
      {
        title: "Spiritual cleansing",
        copy: "When the heart, thoughts, or daily life feel clouded or spiritually unclean. Cleansing rooted in remembrance, dua, and patient guidance.",
      },
      {
        title: "Home cleansing",
        copy: "For a house that feels heavy, restless, or unsettled — so barakah and calm can return to the rooms where your family lives.",
      },
      {
        title: "Business & rizq blockage",
        copy: "When work stalls, doors stay shut, or provision feels spiritually blocked. Guidance for clarity, effort, and trust in Allah’s rizq.",
      },
      {
        title: "Family & children care",
        copy: "Protective spiritual care when children, marriage, or the household carry fear, disturbed sleep, or unexplained strain.",
      },
      {
        title: "Spiritual renewal",
        copy: "For a heart that feels distant from salah, dua, and inner quiet. A paced return to remembrance and daily rhythm that fits real life.",
      },
    ],
  },
  atmosphere: {
    quote:
      "“Healing begins where fear is met with remembrance — not with noise.”",
    credit: "The Redeemysoul way",
  },
  path: {
    eyebrow: "How it works",
    title: "A simple path from worry to clarity.",
    intro:
      "No public exposure. No pressure. Just a private consultation flow designed for trust.",
    steps: [
      {
        title: "Share",
        copy: "Tell us what you are carrying — sleep, dreams, family strain, fear, or the heaviness that will not lift.",
      },
      {
        title: "Understand",
        copy: "We listen carefully and separate spiritual concern from ordinary hardship, so guidance stays honest.",
      },
      {
        title: "Guide",
        copy: "You receive a clear next step through dua, ruqyah-centered practice, and a rhythm you can keep.",
      },
    ],
  },
  learn: {
    eyebrow: "Learn",
    title: "What sihr, jinn, bandish, and paranormal strain can mean.",
    intro:
      "Many viewers — Muslim and non-Muslim — arrive with the same quiet questions: What is jadoo? What are jinn? Why does a home feel heavy? Can spiritual harm delay marriage or push spouses apart? This section offers clear information without fear spectacle.",
    audience:
      "Muslims may read this through Qur’an and Sunnah. Non-Muslims may recognise similar concerns under other names — curse, spirit affliction, paranormal disturbance, or household ritual harm. In every case: seek medical and psychological care when needed. Spiritual guidance here is not a substitute for treatment, shifa is from Allah alone, and no healing is guaranteed.",
    topics: [
      {
        title: "Sihr / jadoo (magic)",
        copy: "In Islamic teaching, sihr is real, condemned, and harmful when practiced against people (Qur’an 2:102). People often describe sudden heaviness, disrupted sleep, fear without clear cause, or repeated life blockage after envy or conflict. Across many non-Muslim cultures, similar beliefs appear as curses, hexes, or malefic ritual. Careful guidance never treats this as entertainment, nor as a label for every difficulty.",
      },
      {
        title: "Jinn",
        copy: "The Qur’an affirms jinn as a creation of Allah (Qur’an 72; 55:15). Some seekers report presence, whispers, nightmares, pressure, or household unrest they connect to jinn. Other traditions speak of spirits or unseen entities. Honest care asks what is spiritual, what is ordinary hardship, and what needs a doctor — without rushing to dramatic claims.",
      },
      {
        title: "Paranormal activity",
        copy: "Unexplained sounds, movement, cold spots, a watched feeling, objects disturbed, or recurring nightmares. Some interpret these spiritually; others first check environment, stress, sleep disorders, or health. Redeemysoul listens with respect while urging viewers not to ignore medical or safety concerns.",
      },
      {
        title: "Bandish (spiritual binding)",
        copy: "In South Asian spiritual language, bandish often means a sensed binding or freeze: stalled proposals, blocked rizq, closed opportunities, or emotional distance that feels forced. It is a pastoral way of naming a pattern — not a medical diagnosis and not a promise that every delay is spiritual.",
      },
    ],
    effectsTitle: "How these concerns may affect daily life",
    effectsIntro:
      "People commonly report one or more of the patterns below. Presence of a pattern does not prove sihr by itself; it is a reason to seek calm clarity.",
    effects: [
      "Disturbed sleep, heavy dreams, waking fear, or a sense of pressure at night",
      "A home that feels restless, tense, or spiritually unclean",
      "Work, business, or rizq that repeatedly stalls without clear worldly cause",
      "Family conflict that escalates beyond ordinary disagreement",
      "Children unsettled, fearful, or affected in mood and sleep",
      "Marriage delayed, proposals failing, or nikah facing repeated unexplained obstacles",
      "Coldness, suspicion, sudden dislike, or distance between husband and wife",
    ],
    marriageTitle: "Marriage delays and distance between spouses",
    marriageBody: [
      "Viewers often ask whether jadoo or bandish can block marriage — failed rishtas, last-minute obstacles, or years of unexplained delay. Others ask how spiritual harm is said to create coldness, arguments, or emotional distance between husband and wife after nikah.",
      "In Islamic spiritual care, such patterns are taken seriously and handled with privacy. At the same time, ordinary causes must be checked: communication, family pressure, finances, personality conflict, trauma, and health. Non-Muslim couples may describe the same strain as curse-related conflict or paranormal stress in the home.",
      "Guidance may include dua, ruqyah-centered practice, and practical next steps — never fear, never public exposure, and never a claim that results are guaranteed. Shifa is from Allah alone.",
    ],
    refsTitle: "References for further reading",
    refsMuslimTitle: "Islamic sources",
    refsMuslim: [
      "Qur’an 2:102 — on sihr and its harm",
      "Qur’an 113 (Al-Falaq) — seeking protection from envy and magic",
      "Qur’an 114 (An-Nas) — seeking protection from whispers",
      "Qur’an 72 (Al-Jinn) and 55:15 — on the creation and reality of jinn",
      "Authentic Hadith literature on ruqyah and seeking refuge with Allah (collections such as Sahih al-Bukhari and Sahih Muslim)",
    ],
    refsGeneralTitle: "For a wider audience",
    refsGeneral: [
      "Anthropology of religion — cross-cultural studies of witchcraft, spirit affliction, and household ritual beliefs",
      "Comparative religion writing on spirits, possession narratives, and protective prayer across faith communities",
      "Clinical caution: unexplained fear, sleep disruption, or relationship crisis should also be assessed by qualified medical and mental-health professionals",
    ],
    closing:
      "Information here is for understanding. It is not a diagnosis, not medical advice, and not a guarantee of outcome. If you wish private guidance, begin a consultation with dignity and calm.",
  },
  trust: {
    items: [
      {
        eyebrow: "Privacy",
        title: "Your matter stays with us.",
        copy: "Name, mother's name, phone, and location are used only for consultation and guidance — never sold, posted, or shared publicly.",
      },
      {
        eyebrow: "Respect",
        title: "Faith before fear.",
        copy: "We do not dramatize pain. Guidance stays within Islamic manners, patience, and clear speech.",
      },
      {
        eyebrow: "Clarity",
        title: "One honest next step.",
        copy: "After you share your concern, you receive a practical reply — what to do now, and how to continue if needed.",
      },
    ],
  },
  testimonials: {
    eyebrow: "Experiences",
    title: "Quiet words from those who reached out.",
    intro:
      "First names only. Shared with permission. No dramatic claims — only honest notes of relief and clarity.",
    items: [
      {
        name: "Ayesha",
        place: "Karachi",
        quote:
          "I was carrying heavy fear at night. The guidance was calm, private, and helped me return to dua with a steadier heart.",
      },
      {
        name: "Bilal",
        place: "Lahore",
        quote:
          "I felt stuck between worry and confusion. The reply was clear, respectful, and gave me a practical next step.",
      },
      {
        name: "Fatima",
        place: "Islamabad",
        quote:
          "No shouting, no pressure. Just careful listening and a path I could follow with my family.",
      },
      {
        name: "Usman",
        place: "Hyderabad",
        quote:
          "I came with suspicion of nazar on my work. The consultation stayed dignified and focused on remembrance.",
      },
      {
        name: "Sana",
        place: "Multan",
        quote:
          "I appreciated the adab. My matter felt safe, and the guidance did not make my fear louder.",
      },
      {
        name: "Hamza",
        place: "Faisalabad",
        quote:
          "Short, honest answers helped more than long promises. I knew what to do after the first reply.",
      },
    ],
  },
  about: {
    eyebrow: "About the healer",
    title: "Ejaz Noor Shazli",
    body: [
      "Ejaz Noor Shazli is a Karachi-based spiritual healer serving through Redeemysoul with a quiet, adab-first approach to Islamic healing.",
      "His work focuses on private consultation for nazar, spiritual pressure, and concerns of sihr — guided by remembrance, dua, and ruqyah-centered care rather than fear or spectacle.",
      "Seekers are received with dignity. Matters stay confidential. Spiritual healing is not a substitute for medical treatment; shifa is from Allah alone, and no guarantee of healing is offered. Where medical care is needed, that path is respected.",
    ],
  },
  hours: {
    eyebrow: "Hours",
    title: "When you can expect a reply.",
    intro:
      "Messages are read with care. We reply as soon as a calm, proper response can be given.",
    items: [
      { label: "Online messages", value: "Saturday – Thursday" },
      { label: "Usual reply window", value: "Within 24–48 hours" },
      { label: "Friday", value: "Limited replies / urgent notes only" },
      { label: "Office consultation", value: "By appointment after first message" },
    ],
    note: "If your matter feels urgent, mention it clearly in WhatsApp so it can be prioritized with care.",
  },
  location: {
    eyebrow: "Visit",
    title: "Find Spiritual Healing Shazli",
    business: "Spiritual Healing Shazli",
    address:
      "H#953, Street #22, Block D, Ittehad Town, Baldia Town, Karachi",
    intro:
      "Office consultations are by appointment after the first message. You can open the Google Business location below for directions.",
    openMaps: "Open in Google Maps",
  },
  disclaimer: {
    eyebrow: "Disclaimer",
    title: "Spiritual healing is not medical treatment.",
    body: "Redeemysoul offers Islamic spiritual guidance and ruqyah-centered support only. Please read this carefully before you begin.",
    short:
      "Spiritual healing is not a substitute for medical treatment. Shifa is from Allah alone. No guarantee of healing is offered.",
    points: [
      "This is not a substitute for medical, psychological, or emergency care. Continue seeing qualified doctors for any health concern.",
      "Shifa (healing) is from Allah alone. We only offer spiritual means, dua, and guidance with humility.",
      "There is no guarantee of shifa, results, or timelines. Outcomes rest with Allah.",
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Questions people ask before beginning.",
    intro: "Short answers so you can take the next step with a calm heart.",
    items: [
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
        a: "Sihr (jadoo) refers to harmful magic condemned in the Qur’an. Jinn are a creation mentioned in the Qur’an. Bandish is a common South Asian term for sensed spiritual binding or blockage. Read the Learn section for fuller definitions, life effects, and references for Muslim and non-Muslim readers.",
      },
      {
        q: "Can this affect marriage or create distance between spouses?",
        a: "Many people report delayed marriage, repeated obstacles before nikah, or sudden coldness between husband and wife. Spiritual care takes such reports seriously while also checking ordinary causes. There is no guaranteed outcome; shifa is from Allah alone.",
      },
      {
        q: "How fast will I get a reply?",
        a: "We aim to respond with care, not haste. Most messages receive a first reply within 24–48 hours.",
      },
    ],
  },
  contact: {
    eyebrow: "Begin",
    title: "Ready to share what you are carrying?",
    intro:
      "Start a private consultation request. Your details become a ready WhatsApp or email message — so guidance can begin with clarity and respect.",
    ctaBegin: "Begin healing",
    ctaWhatsapp: "WhatsApp directly",
  },
  footer: {
    blurb:
      "Islamic healing for nazar, spiritual pressure, and renewal — serving seekers with privacy and care.",
    privacy:
      "Privacy note: your name, mother's name, phone, and location are collected only to understand and respond to your consultation request.",
    begin: "Begin healing",
    email: "Email",
    whatsapp: "WhatsApp",
  },

  begin: {
    stepConcern: "01 Concern",
    stepDetails: "02 Details",
    stepHadiya: "03 Hadiya",
    stepSend: "04 Send",
    eyebrow: "Begin healing",
    title: "What are you facing?",
    intro:
      "Choose the concern closest to your heart. Next we ask only what is needed for a private, respectful consultation.",
    continue: "Continue",
    detailsEyebrow: "Your details",
    detailsTitle: "So we may know you properly.",
    concernSelected: "Concern selected:",
    privacy:
      "Privacy: your name, mother's name, phone, and location are used only to understand and respond to your request.",
    name: "Your name",
    mother: "Mother's name",
    location: "Closest location",
    phone: "Your WhatsApp / mobile",
    note: "Optional note",
    namePh: "Full name",
    motherPh: "Mother's name",
    locationPh: "City / area",
    phonePh: "+92 3xx xxx xxxx",
    notePh: "A few honest lines, if you wish.",
    appointmentDay: "Preferred office day",
    appointmentTime: "Preferred time",
    appointmentHint:
      "For Baldia / Ittehad Town office visits after first message. Online guidance can begin sooner.",
    appointmentDays: {
      "no-preference": "No preference",
      saturday: "Saturday",
      sunday: "Sunday",
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
    },
    appointmentTimes: {
      "no-preference": "No preference",
      morning: "Morning",
      afternoon: "Afternoon",
      evening: "Evening",
    },
    back: "Back",
    toHadiya: "Continue to Hadiya",
    submit: "Create request",
    submitting: "Saving...",
    autoWaHint:
      "WhatsApp is opening with your full request (including Hadiya digits). If it does not open, tap the button below.",
    openWaNow: "Open WhatsApp now",
    hadiyaEyebrow: "Spiritual diagnosis",
    hadiyaTitle: "Send Hadiya for initial diagnosis",
    hadiyaIntro:
      "Before your request is created, send a Hadiya for spiritual diagnosis. Then enter the last 5 digits of your transaction so it can be verified.",
    hadiyaPakistan: "Pakistan",
    hadiyaInternational: "International",
    hadiyaPkAmount: "PKR 5,000 — initial diagnosis only",
    hadiyaIntlAmount: "USD 50 — initial diagnosis only",
    hadiyaEasyPaisa: "EasyPaisa account",
    hadiyaIban: "IBAN (international)",
    hadiyaCopy: "Copy",
    hadiyaCopied: "Copied",
    hadiyaTxnLabel: "Last 5 digits of transaction",
    hadiyaTxnPh: "e.g. 48291",
    hadiyaTxnHint:
      "After sending Hadiya, type only the last 5 digits from your transfer / transaction ID.",
    hadiyaTxnError: "Enter exactly 5 digits from your transaction.",
    hadiyaNote:
      "This Hadiya is for initial spiritual diagnosis only. It is not a medical fee. Shifa is from Allah alone; no guarantee of healing is offered.",
    readyTitle: "Your message is ready",
    readyIntro:
      "Keep this reference. Send the prepared message on WhatsApp or email — your Hadiya transaction digits are included so diagnosis can be verified.",
    reference: "Reference",
    track: "Track status",
    notifyWa: "Notify on WhatsApp",
    notifyEmail: "Notify by email",
    pendingTitle: "Request already pending",
    pendingIntro:
      "This WhatsApp / mobile already has an open request. A new one cannot be created until it is cleared.",
    checkStatus: "Check status",
    concerns: [
      {
        id: "evil-eye",
        title: "Nazar & hasad",
        hint: "Sudden heaviness, envy, or unsettled protection around home or family.",
      },
      {
        id: "black-magic",
        title: "Sihr & dark disturbance",
        hint: "Unusual fear, dreams, or strain that feels beyond ordinary hardship.",
      },
      {
        id: "healing",
        title: "Islamic healing",
        hint: "Spiritual heaviness or unrest that needs private ruqyah-centered care.",
      },
      {
        id: "cleansing",
        title: "Spiritual cleansing",
        hint: "A heart or daily life that feels clouded and needs purification.",
      },
      {
        id: "home-cleansing",
        title: "Home cleansing",
        hint: "A house that feels heavy, restless, or spiritually unsettled.",
      },
      {
        id: "rizq",
        title: "Business & rizq blockage",
        hint: "Work, doors, or provision that feel spiritually blocked.",
      },
      {
        id: "family",
        title: "Family & children care",
        hint: "Fear, disturbed sleep, or strain affecting children or the household.",
      },
      {
        id: "renewal",
        title: "Spiritual renewal",
        hint: "Distance from salah, dua, clarity, or inner peace.",
      },
      {
        id: "other",
        title: "Something else",
        hint: "Another burden you want to share privately and carefully.",
      },
    ],
  },
  track: {
    eyebrow: "Track",
    title: "Check your request status",
    intro: "Enter the reference number you received when the request was created.",
    placeholder: "RS-2026-XXXXXX",
    check: "Check",
    checking: "Checking...",
    statusLabels: {
      pending: "Pending",
      in_review: "In review",
      active: "Active / in progress",
      diagnosis_completed: "Diagnosis completed",
      resolved: "Resolved",
      cleared: "Cleared — new request allowed",
    },
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Hadiya for diagnosis — clear and honest.",
    intro:
      "Initial spiritual diagnosis uses a fixed Hadiya so verification stays simple. Further guidance, if needed, is discussed privately after diagnosis — never as a medical fee, never with a guarantee of shifa.",
    diagnosisTitle: "Initial spiritual diagnosis",
    diagnosisBody:
      "Send Hadiya, share the last 5 transaction digits, and create your request. This covers the first diagnosis review only.",
    pkLabel: "Pakistan",
    pkAmount: "PKR 5,000",
    pkMethod: "EasyPaisa 03452845400",
    intlLabel: "International",
    intlAmount: "USD 50",
    intlMethod: "IBAN PK50TMFB0000000014429642",
    furtherTitle: "Further guidance",
    furtherBody:
      "If deeper care or an office appointment is needed after diagnosis, next steps and any further Hadiya are explained privately on WhatsApp. Nothing is forced. Outcomes rest with Allah.",
    appointmentTitle: "Office appointment",
    appointmentBody:
      "Baldia / Ittehad Town visits are by appointment after the first message. You can suggest a preferred day and time when you begin.",
    cta: "Begin diagnosis request",
    note: "Spiritual healing is not a substitute for medical treatment. Shifa is from Allah alone. No guarantee of healing is offered.",
  },
  whatsappFloat: "WhatsApp",
  langEn: "EN",
  langUr: "اردو",
};

const ur: Dictionary = {
  nav: {
    services: "خدمات",
    path: "طریقہ کار",
    learn: "سمجھیں",
    topics: "موضوعات",
    blog: "بلاگ",
    locations: "شہر",
    templates: "واٹس ایپ",
    about: "تعارف",
    visit: "مقام",
    pricing: "اخراجات",
    privacy: "رازداری",
    faq: "سوالات",
    begin: "شروع",
    consultation: "مشاورت",
    backHome: "واپس صفحہ اول",
  },
  hero: {
    brandLine: "سپریچوئل ہیلنگ شاذلی · کراچی",
    headline: "دباؤ میں دل کے لیے اسلامی شفا۔",
    support:
      "نظر، سحر کی پریشانی اور روحانی بوجھ کے لیے رقیہ پر مبنی رہنمائی — نجی، ادب کے ساتھ، اور ذکر پر قائم۔",
    ctaBegin: "شفا شروع کریں",
    ctaServices: "خدمات دیکھیں",
  },
  services: {
    eyebrow: "خدمات",
    title: "ایسی نگہداشت جو بولنے سے پہلے سنتی ہے۔",
    intro:
      "ریڈیمی سول ان لوگوں کے لیے ہے جو شور، جلدی اور نمائش کے بغیر اسلامی شفا چاہتے ہیں۔ ہر مشاورت نجی رہتی ہے۔",
    items: [
      {
        title: "نظر و حسد",
        copy: "اچانک بوجھ، بے وجہ خوف، یا یہ احساس کہ حسد گھر، کام یا بچوں پر اثر انداز ہے — پرسکون رقیہ پر مبنی نگہداشت۔",
      },
      {
        title: "سحر و پریشانی",
        copy: "جب خواب، دباؤ یا گھر کا تناؤ عام مشکلات سے زیادہ لگے، ہم پہچان، وقار اور ایمان کے ساتھ شروع کرتے ہیں — خوف کی نمائش کے بغیر۔",
      },
      {
        title: "اسلامی شفا",
        copy: "روحانی بوجھ، اندرونی بے چینی، اور ان معاملات کے لیے نجی رقیہ پر مبنی شفا جنہیں ادب اور خاموشی چاہیے — جلدی نہیں، ادب کے ساتھ۔",
      },
      {
        title: "روحانی صفائی",
        copy: "جب دل، خیالات یا روزمرہ زندگی آلودہ یا ابر آلود محسوس ہو۔ ذکر، دعا اور صبر بھری رہنمائی پر مبنی صفائی۔",
      },
      {
        title: "گھر کی صفائی",
        copy: "جب گھر بھاری، بے چین یا غیر مطمئن لگے — تاکہ برکت اور سکون ان کمروں میں لوٹ آئے جہاں آپ کا خاندان رہتا ہے۔",
      },
      {
        title: "کاروبار و رزق کی رکاوٹ",
        copy: "جب کام رکے، دروازے بند رہیں، یا رزق روحانی طور پر بند محسوس ہو۔ وضاحت، محنت اور اللہ کے رزق پر بھروسے کی رہنمائی۔",
      },
      {
        title: "خاندان و بچوں کی نگہداشت",
        copy: "حفاظتی روحانی نگہداشت جب بچے، ازدواجی زندگی یا گھر خوف، خراب نیند یا بے وجہ دباؤ کا شکار ہوں۔",
      },
      {
        title: "روحانی تجدید",
        copy: "جب دل نماز، دعا اور سکون سے دور محسوس ہو۔ ذکر اور روزمرہ نظم کی طرف وہ واپسی جو حقیقی زندگی کے ساتھ چل سکے۔",
      },
    ],
  },
  atmosphere: {
    quote: "“شفا وہیں شروع ہوتی ہے جہاں خوف کا جواب ذکر سے دیا جائے — شور سے نہیں۔”",
    credit: "ریڈیمی سول کا طریقہ",
  },
  path: {
    eyebrow: "طریقہ کار",
    title: "پریشانی سے وضاحت تک ایک آسان راستہ۔",
    intro: "نہ عوامی نمائش، نہ دباؤ۔ صرف اعتماد کے لیے بنایا گیا نجی مشاورت کا عمل۔",
    steps: [
      {
        title: "بتائیں",
        copy: "جو بوجھ ہے وہ شیئر کریں — نیند، خواب، گھریلو تناؤ، خوف، یا وہ سنگینی جو اترتی نہیں۔",
      },
      {
        title: "سمجھیں",
        copy: "ہم غور سے سنتے ہیں اور روحانی پریشانی کو عام مشکلات سے الگ کرتے ہیں، تاکہ رہنمائی سچی رہے۔",
      },
      {
        title: "رہنمائی",
        copy: "آپ کو دعا، رقیہ پر مبنی عمل اور ایک ایسا عملی قدم ملتا ہے جسے آپ جاری رکھ سکیں۔",
      },
    ],
  },
  learn: {
    eyebrow: "سمجھیں",
    title: "سحر، جنات، بندش اور غیر معمولی پریشانی کیا ہو سکتی ہے۔",
    intro:
      "بہت سے ناظرین — مسلم اور غیر مسلم — ایک ہی خاموش سوالات لے کر آتے ہیں: جادو کیا ہے؟ جنات کیا ہیں؟ گھر بھاری کیوں لگتا ہے؟ کیا روحانی نقصان شادی روک سکتا ہے یا میاں بیوی میں دوری پیدا کر سکتا ہے؟ یہ حصہ خوف کی نمائش کے بغیر واضح معلومات دیتا ہے۔",
    audience:
      "مسلم قارئین اسے قرآن و سنت کی روشنی میں پڑھ سکتے ہیں۔ غیر مسلم قارئین ملتے جلتے خدشات کو لعنت، روحانی ایذا، غیر معمولی واقعات، یا گھریلو رسم کے نقصان کے نام سے پہچان سکتے ہیں۔ ہر صورت میں: جہاں ضرورت ہو طبی اور نفسیاتی علاج ضرور لیں۔ یہاں روحانی رہنمائی علاج کا متبادل نہیں، شفا صرف اللہ کی طرف سے ہے، اور شفا کی کوئی ضمانت نہیں۔",
    topics: [
      {
        title: "سحر / جادو",
        copy: "اسلامی تعلیم میں سحر حقیقت ہے، حرام ہے، اور لوگوں کے خلاف استعمال ہونے پر نقصان دہ ہے (القرآن ۲:۱۰۲)۔ لوگ اکثر اچانک بوجھ، خراب نیند، بے وجہ خوف، یا حسد و جھگڑے کے بعد بار بار زندگی کی رکاوٹ بیان کرتے ہیں۔ بہت سی غیر مسلم تہذیبوں میں بھی لعنت، ہیکس، یا نقصان دہ رسم کے عقائد ملتے ہیں۔ محتاط رہنمائی اسے نہ تفریح بناتی ہے، نہ ہر مشکل کا لیبل۔",
      },
      {
        title: "جنات",
        copy: "قرآن جنات کو اللہ کی مخلوق قرار دیتا ہے (القرآن ۷۲؛ ۵۵:۱۵)۔ کچھ طالبین موجودگی، وسوسہ، خوفناک خواب، دباؤ، یا گھریلو بے چینی جنات سے جوڑتے ہیں۔ دوسری روایات میں ارواح یا غیر مرئی مخلوق کا ذکر ہوتا ہے۔ سچی نگہداشت پوچھتی ہے کیا روحانی ہے، کیا عام مشکل ہے، اور کیا ڈاکٹر کی ضرورت ہے — ڈرامائی دعووں کے بغیر۔",
      },
      {
        title: "غیر معمولی / پار نارمل سرگرمی",
        copy: "غیر واضح آوازیں، حرکت، سردی، نگاہیں محسوس ہونا، چیزوں کا ہلنا، یا بار بار خوفناک خواب۔ کچھ اسے روحانی سمجھتے ہیں؛ کچھ پہلے ماحول، تناؤ، نیند کی خرابی یا صحت چیک کرتے ہیں۔ ریڈیمی سول احترام سے سنتا ہے اور طبی یا حفاظتی خدشات نظرانداز نہ کرنے کی تاکید کرتا ہے۔",
      },
      {
        title: "بندش",
        copy: "جنوبی ایشیائی روحانی زبان میں بندش اکثر ایک محسوس شدہ جکڑ یا جمود کو کہتے ہیں: رشتے رک جانا، رزق بند ہونا، مواقع بند ہونا، یا جذباتی دوری جو زبردستی لگے۔ یہ ایک شبانی انداز میں پیٹرن کا نام ہے — طبی تشخیص نہیں، اور نہ یہ وعدہ کہ ہر تاخیر روحانی ہوتی ہے۔",
      },
    ],
    effectsTitle: "ان پریشانیوں کا روزمرہ زندگی پر ممکنہ اثر",
    effectsIntro:
      "لوگ اکثر نیچے دیے گئے ایک یا کئی پیٹرن بتاتے ہیں۔ کسی پیٹرن کا ہونا خود سحر ثابت نہیں کرتا؛ یہ پرسکون وضاحت تلاش کرنے کی وجہ ہو سکتا ہے۔",
    effects: [
      "خراب نیند، بھاری خواب، جاگتے خوف، یا رات کو دباؤ کا احساس",
      "گھر جو بے چین، تناؤ بھرا، یا روحانی طور پر غیر مطمئن لگے",
      "کام، کاروبار یا رزق جو بار بار رکے بغیر واضح دنیاوی وجہ کے",
      "خاندانی جھگڑے جو عام اختلاف سے زیادہ بڑھ جائیں",
      "بچے بے چین، خوفزدہ، یا مزاج و نیند میں متاثر",
      "شادی میں تاخیر، رشتے ٹوٹنا، یا نکاح سے پہلے بار بار غیر واضح رکاوٹیں",
      "میاں بیوی میں سرد مہری، بدگمانی، اچانک نفرت، یا دوری",
    ],
    marriageTitle: "شادی میں رکاوٹ اور میاں بیوی میں دوری",
    marriageBody: [
      "ناظرین اکثر پوچھتے ہیں کہ کیا جادو یا بندش شادی روک سکتی ہے — ناکام رشتے، آخری لمحے کی رکاوٹیں، یا سالوں کی غیر واضح تاخیر۔ کچھ پوچھتے ہیں کہ نکاح کے بعد میاں بیوی میں سرد مہری، جھگڑے، یا جذباتی دوری روحانی نقصان سے کیسے پیدا ہو سکتی ہے۔",
      "اسلامی روحانی نگہداشت ایسے پیٹرن کو سنجیدگی اور رازداری سے لیتی ہے۔ ساتھ ہی عام وجوہات بھی دیکھنی چاہئیں: بات چیت، خاندانی دباؤ، مالیات، مزاج کا ٹکراؤ، صدمہ، اور صحت۔ غیر مسلم جوڑے بھی اسے گھر میں لعنت یا غیر معمولی تناؤ کہہ کر بیان کر سکتے ہیں۔",
      "رہنمائی میں دعا، رقیہ پر مبنی عمل، اور عملی اگلا قدم شامل ہو سکتا ہے — نہ خوف، نہ عوامی نمائش، نہ نتائج کی ضمانت۔ شفا صرف اللہ کی طرف سے ہے۔",
    ],
    refsTitle: "مزید مطالعہ کے حوالے",
    refsMuslimTitle: "اسلامی مصادر",
    refsMuslim: [
      "القرآن ۲:۱۰۲ — سحر اور اس کے نقصان پر",
      "القرآن ۱۱۳ (الفلق) — حسد اور جادو سے پناہ",
      "القرآن ۱۱۴ (الناس) — وسوسوں سے پناہ",
      "القرآن ۷۲ (الجن) اور ۵۵:۱۵ — جنات کی حقیقت پر",
      "رقیہ اور اللہ کی پناہ سے متعلق معتبر احادیث (جیسے صحیح بخاری و صحیح مسلم)",
    ],
    refsGeneralTitle: "وسیع تر سامعین کے لیے",
    refsGeneral: [
      "مذہب کی بشریات — جادو ٹونا، روحانی ایذا، اور گھریلو رسم کے عقائد پر تہذیبی مطالعات",
      "تقابلی مذہب کی تحریریں — ارواح، قبضے کی روایات، اور مختلف ایمانوں میں حفاظتی دعا",
      "طبی احتیاط: بے وجہ خوف، نیند کی خرابی، یا ازدواجی بحران کا جائزہ اہل ڈاکٹر اور ذہنی صحت کے ماہرین سے بھی کروائیں",
    ],
    closing:
      "یہ معلومات سمجھنے کے لیے ہیں۔ یہ تشخیص نہیں، طبی مشورہ نہیں، اور نتیجے کی ضمانت نہیں۔ اگر نجی رہنمائی چاہیں تو ادب اور سکون کے ساتھ مشاورت شروع کریں۔",
  },
  trust: {
    items: [
      {
        eyebrow: "رازداری",
        title: "آپ کا معاملہ ہمارے پاس محفوظ ہے۔",
        copy: "نام، والدہ کا نام، فون اور مقام صرف مشاورت کے لیے استعمال ہوتے ہیں — نہ بیچے جاتے، نہ عام کیے جاتے۔",
      },
      {
        eyebrow: "ادب",
        title: "ایمان پہلے، خوف بعد میں۔",
        copy: "ہم درد کو ڈرامہ نہیں بناتے۔ رہنمائی اسلامی ادب، صبر اور واضح بات میں رہتی ہے۔",
      },
      {
        eyebrow: "وضاحت",
        title: "ایک سچا اگلا قدم۔",
        copy: "اپنی پریشانی بتانے کے بعد آپ کو عملی جواب ملتا ہے — اب کیا کریں، اور اگر ضرورت ہو تو آگے کیسے بڑھیں۔",
      },
    ],
  },
  testimonials: {
    eyebrow: "تجربات",
    title: "جنہوں نے رابطہ کیا، ان کی مختصر باتیں۔",
    intro:
      "صرف پہلا نام۔ اجازت کے ساتھ۔ کوئی بڑے دعوے نہیں — صرف اطمینان اور وضاحت کے سچے نوٹس۔",
    items: [
      {
        name: "عائشہ",
        place: "کراچی",
        quote:
          "راتوں کو شدید خوف تھا۔ رہنمائی پرسکون اور نجی تھی، اور دعا کی طرف دل زیادہ مطمئن ہو کر لوٹا۔",
      },
      {
        name: "بلال",
        place: "لاہور",
        quote:
          "پریشانی اور الجھن کے درمیان پھنسا محسوس ہوتا تھا۔ جواب واضح، باادب اور عملی اگلے قدم والا تھا۔",
      },
      {
        name: "فاطمہ",
        place: "اسلام آباد",
        quote:
          "نہ شور، نہ دباؤ۔ صرف غور سے سننا اور ایک ایسا راستہ جو خاندان کے ساتھ چل سکے۔",
      },
      {
        name: "عثمان",
        place: "حیدرآباد",
        quote:
          "کام پر نظر کا شبہ تھا۔ مشاورت وقار کے ساتھ رہی اور ذکر پر مرکوز رہی۔",
      },
      {
        name: "ثنا",
        place: "ملتان",
        quote:
          "ادب پسند آیا۔ میرا معاملہ محفوظ لگا، اور رہنمائی نے خوف کو بڑا نہیں بنایا۔",
      },
      {
        name: "حمزہ",
        place: "فیصل آباد",
        quote:
          "لمبے وعدوں سے زیادہ مختصر سچے جوابات نے فائدہ دیا۔ پہلے جواب کے بعد مجھے معلوم تھا آگے کیا کرنا ہے۔",
      },
    ],
  },
  about: {
    eyebrow: "معالج کا تعارف",
    title: "اجاز نور شاذلی",
    body: [
      "اجاز نور شاذلی کراچی میں مقیم روحانی معالج ہیں، جو ریڈیمی سول کے ذریعے ادب اور خاموشی کے ساتھ اسلامی شفا کی خدمت کرتے ہیں۔",
      "ان کا کام نظر، روحانی دباؤ اور سحر کی پریشانیوں کے لیے نجی مشاورت پر مرکوز ہے — ذکر، دعا اور رقیہ پر مبنی نگہداشت کے ساتھ، خوف یا نمائش کے بغیر۔",
      "طالبین کو وقار کے ساتھ سنا جاتا ہے۔ معاملات راز میں رہتے ہیں۔ روحانی شفا طبی علاج کا متبادل نہیں؛ شفا صرف اللہ کی طرف سے ہے، اور شفا کی کوئی ضمانت نہیں۔ جہاں طبی علاج درکار ہو اس کا احترام کیا جاتا ہے۔",
    ],
  },
  hours: {
    eyebrow: "اوقات",
    title: "جواب کب کی توقع رکھیں؟",
    intro:
      "پیغامات احتیاط سے پڑھے جاتے ہیں۔ جب پرسکون اور درست جواب ممکن ہو، تب جواب دیا جاتا ہے۔",
    items: [
      { label: "آن لائن پیغامات", value: "ہفتہ تا جمعرات" },
      { label: "عمومی جواب کا وقت", value: "۲۴ تا ۴۸ گھنٹوں میں" },
      { label: "جمعہ", value: "محدود جواب / صرف فوری نوٹس" },
      { label: "دفتری مشاورت", value: "پہلے پیغام کے بعد بذریعہ اپائنٹمنٹ" },
    ],
    note: "اگر معاملہ فوری لگے تو واٹس ایپ میں واضح لکھیں تاکہ احتیاط کے ساتھ ترجیح دی جا سکے۔",
  },
  location: {
    eyebrow: "مقام",
    title: "سپریچوئل ہیلنگ شاذلی تلاش کریں",
    business: "Spiritual Healing Shazli",
    address:
      "مکان نمبر ۹۵۳، گلی نمبر ۲۲، بلاک ڈی، اتحاد ٹاؤن، بلدیہ ٹاؤن، کراچی",
    intro:
      "دفتری مشاورت پہلے پیغام کے بعد بذریعہ اپائنٹمنٹ ہوتی ہے۔ نیچے گوگل بزنس مقام کھول کر راستہ دیکھ سکتے ہیں۔",
    openMaps: "گوگل میپس میں کھولیں",
  },
  disclaimer: {
    eyebrow: "وضاحت نامہ",
    title: "روحانی شفا طبی علاج نہیں ہے۔",
    body: "ریڈیمی سول صرف اسلامی روحانی رہنمائی اور رقیہ پر مبنی معاونت دیتا ہے۔ شروع سے پہلے یہ بات غور سے پڑھیں۔",
    short:
      "روحانی شفا طبی علاج کا متبادل نہیں۔ شفا صرف اللہ کی طرف سے ہے۔ شفا کی کوئی ضمانت نہیں دی جاتی۔",
    points: [
      "یہ طبی، نفسیاتی یا ایمرجنسی علاج کا متبادل نہیں۔ صحت کی کسی بھی پریشانی کے لیے اہل ڈاکٹروں سے رجوع جاری رکھیں۔",
      "شفا صرف اللہ کی طرف سے ہے۔ ہم صرف روحانی وسائل، دعا اور عاجزی کے ساتھ رہنمائی پیش کرتے ہیں۔",
      "شفا، نتیجے یا وقت کی کوئی ضمانت نہیں۔ انجام اللہ کے ہاتھ میں ہے۔",
    ],
  },
  faq: {
    eyebrow: "عمومی سوالات",
    title: "شروع سے پہلے اکثر پوچھے جانے والے سوالات۔",
    intro: "مختصر جوابات تاکہ اگلا قدم اطمینان سے اٹھا سکیں۔",
    items: [
      {
        q: "کیا یہ نجی ہے؟",
        a: "جی ہاں۔ آپ کا نام، والدہ کا نام، فون اور تفصیل صرف مشاورت کے لیے رکھے جاتے ہیں۔ کچھ بھی عام نہیں کیا جاتا۔",
      },
      {
        q: "کیا خود آنا ضروری ہے؟",
        a: "بہت سی مشاورتیں واٹس ایپ یا ای میل سے شروع ہوتی ہیں۔ اگر ذاتی ملاقات درکار ہو تو واضح رہنمائی دی جائے گی۔",
      },
      {
        q: "کیا تیار رکھوں؟",
        a: "پورا نام، والدہ کا نام، قریبی مقام، واٹس ایپ نمبر، اور جو مسئلہ ہے اس کی مختصر سچی تفصیل۔",
      },
      {
        q: "کیا یہ طبی علاج کا متبادل ہے؟",
        a: "نہیں۔ روحانی شفا طبی علاج کا متبادل نہیں۔ شفا صرف اللہ کی طرف سے ہے، اور شفا کی کوئی ضمانت نہیں دی جاتی۔ جو طبی یا پیشہ ورانہ علاج درکار ہو وہ جاری رکھیں۔",
      },
      {
        q: "سحر، جنات اور بندش کیا ہیں؟",
        a: "سحر (جادو) نقصان دہ جادو ہے جسے قرآن میں محکوم کیا گیا۔ جنات قرآن میں مذکور مخلوق ہیں۔ بندش جنوبی ایشیا میں محسوس شدہ روحانی جکڑ یا رکاوٹ کے لیے عام اصطلاح ہے۔ مکمل تعریف، زندگی پر اثر، اور مسلم و غیر مسلم حوالوں کے لیے «سمجھیں» سیکشن پڑھیں۔",
      },
      {
        q: "کیا اس سے شادی یا میاں بیوی میں دوری متاثر ہو سکتی ہے؟",
        a: "بہت سے لوگ شادی میں تاخیر، نکاح سے پہلے بار بار رکاوٹ، یا میاں بیوی میں اچانک سرد مہری بتاتے ہیں۔ روحانی نگہداشت ایسے بیانات کو سنجیدگی سے لیتی ہے، ساتھ عام وجوہات بھی دیکھتی ہے۔ نتیجے کی ضمانت نہیں؛ شفا اللہ کی طرف سے ہے۔",
      },
      {
        q: "جواب کتنی جلدی آتا ہے؟",
        a: "ہم جلدی سے زیادہ احتیاط کو ترجیح دیتے ہیں۔ زیادہ تر پیغامات کا پہلا جواب ۲۴ سے ۴۸ گھنٹوں میں آنے کی کوشش ہوتی ہے۔",
      },
    ],
  },
  contact: {
    eyebrow: "شروع کریں",
    title: "کیا آپ اپنا بوجھ شیئر کرنے کے لیے تیار ہیں؟",
    intro:
      "نجی مشاورت کی درخواست شروع کریں۔ آپ کی تفصیل تیار واٹس ایپ یا ای میل پیغام بن جاتی ہے تاکہ رہنمائی ادب سے شروع ہو۔",
    ctaBegin: "شفا شروع کریں",
    ctaWhatsapp: "براہ راست واٹس ایپ",
  },
  footer: {
    blurb:
      "نظر، روحانی دباؤ اور تجدید کے لیے اسلامی شفا — رازداری اور نگہداشت کے ساتھ۔",
    privacy:
      "رازداری: آپ کا نام، والدہ کا نام، فون اور مقام صرف آپ کی درخواست سمجھنے اور جواب دینے کے لیے لیا جاتا ہے۔",
    begin: "شفا شروع کریں",
    email: "ای میل",
    whatsapp: "واٹس ایپ",
  },
  begin: {
    stepConcern: "۰۱ مسئلہ",
    stepDetails: "۰۲ تفصیل",
    stepHadiya: "۰۳ ہدیہ",
    stepSend: "۰۴ ارسال",
    eyebrow: "شفا شروع کریں",
    title: "آپ کس چیز کا سامنا کر رہے ہیں؟",
    intro:
      "دل کے قریب ترین مسئلہ چنیں۔ اگلے مرحلے میں صرف وہی پوچھیں گے جو نجی اور محترمانہ مشاورت کے لیے ضروری ہے۔",
    continue: "آگے بڑھیں",
    detailsEyebrow: "آپ کی تفصیل",
    detailsTitle: "تاکہ ہم آپ کو درست طریقے سے جان سکیں۔",
    concernSelected: "منتخب مسئلہ:",
    privacy:
      "رازداری: آپ کا نام، والدہ کا نام، فون اور مقام صرف آپ کی درخواست سمجھنے اور جواب دینے کے لیے استعمال ہوتے ہیں۔",
    name: "آپ کا نام",
    mother: "والدہ کا نام",
    location: "قریبی مقام",
    phone: "آپ کا واٹس ایپ / موبائل",
    note: "اضافی نوٹ (اختیاری)",
    namePh: "پورا نام",
    motherPh: "والدہ کا نام",
    locationPh: "شہر / علاقہ",
    phonePh: "+۹۲ ۳xx xxx xxxx",
    notePh: "چند سچی سطریں، اگر چاہیں۔",
    appointmentDay: "پسندیدہ دفتری دن",
    appointmentTime: "پسندیدہ وقت",
    appointmentHint:
      "بلدیہ / اتحاد ٹاؤن دفتری ملاقات پہلے پیغام کے بعد بذریعہ اپائنٹمنٹ۔ آن لائن رہنمائی جلد شروع ہو سکتی ہے۔",
    appointmentDays: {
      "no-preference": "کوئی ترجیح نہیں",
      saturday: "ہفتہ",
      sunday: "اتوار",
      monday: "پیر",
      tuesday: "منگل",
      wednesday: "بدھ",
      thursday: "جمعرات",
    },
    appointmentTimes: {
      "no-preference": "کوئی ترجیح نہیں",
      morning: "صبح",
      afternoon: "دوپہر",
      evening: "شام",
    },
    back: "واپس",
    toHadiya: "ہدیہ کی طرف جائیں",
    submit: "درخواست بنائیں",
    submitting: "محفوظ ہو رہا ہے...",
    autoWaHint:
      "واٹس ایپ آپ کی پوری درخواست (ہدیہ کے ہندسوں سمیت) کے ساتھ کھل رہا ہے۔ اگر نہ کھلے تو نیچے والا بٹن دبائیں۔",
    openWaNow: "ابھی واٹس ایپ کھولیں",
    hadiyaEyebrow: "روحانی تشخیص",
    hadiyaTitle: "ابتدائی تشخیص کے لیے ہدیہ بھیجیں",
    hadiyaIntro:
      "درخواست بنانے سے پہلے روحانی تشخیص کے لیے ہدیہ بھیجیں۔ پھر لین دین کے آخری ۵ ہندسے درج کریں تاکہ تصدیق ہو سکے۔",
    hadiyaPakistan: "پاکستان",
    hadiyaInternational: "بین الاقوامی",
    hadiyaPkAmount: "۵،۰۰۰ روپے — صرف ابتدائی تشخیص",
    hadiyaIntlAmount: "۵۰ ڈالر — صرف ابتدائی تشخیص",
    hadiyaEasyPaisa: "ایزی پیسہ اکاؤنٹ",
    hadiyaIban: "آئی بی اے این (بین الاقوامی)",
    hadiyaCopy: "کاپی",
    hadiyaCopied: "کاپی ہو گیا",
    hadiyaTxnLabel: "لین دین کے آخری ۵ ہندسے",
    hadiyaTxnPh: "مثلاً ۴۸۲۹۱",
    hadiyaTxnHint:
      "ہدیہ بھیجنے کے بعد صرف ٹرانزیکشن آئی ڈی / رسید کے آخری ۵ ہندسے لکھیں۔",
    hadiyaTxnError: "بالکل ۵ ہندسے درج کریں۔",
    hadiyaNote:
      "یہ ہدیہ صرف ابتدائی روحانی تشخیص کے لیے ہے۔ یہ طبی فیس نہیں۔ شفا اللہ کی طرف سے ہے؛ شفا کی کوئی ضمانت نہیں۔",
    readyTitle: "آپ کا پیغام تیار ہے",
    readyIntro:
      "یہ حوالہ محفوظ رکھیں۔ تیار پیغام واٹس ایپ یا ای میل پر بھیجیں — ہدیہ کے لین دین کے ہندسے شامل ہیں تاکہ تشخیص کی تصدیق ہو سکے۔",
    reference: "حوالہ نمبر",
    track: "حالت دیکھیں",
    notifyWa: "واٹس ایپ پر بھیجیں",
    notifyEmail: "ای میل پر بھیجیں",
    pendingTitle: "درخواست پہلے سے زیر التوا ہے",
    pendingIntro:
      "اس واٹس ایپ / موبائل پر ایک کھلی درخواست موجود ہے۔ صاف ہونے تک نئی درخواست نہیں بنے گی۔",
    checkStatus: "حالت چیک کریں",
    concerns: [
      {
        id: "evil-eye",
        title: "نظر و حسد",
        hint: "اچانک بوجھ، حسد، یا گھر و خاندان کے گرد غیر مطمئن حفاظت۔",
      },
      {
        id: "black-magic",
        title: "سحر و پریشانی",
        hint: "غیر معمولی خوف، خواب، یا تناؤ جو عام مشکل سے زیادہ لگے۔",
      },
      {
        id: "healing",
        title: "اسلامی شفا",
        hint: "روحانی بوجھ یا بے چینی جس کے لیے نجی رقیہ پر مبنی نگہداشت درکار ہو۔",
      },
      {
        id: "cleansing",
        title: "روحانی صفائی",
        hint: "دل یا روزمرہ زندگی جو ابر آلود محسوس ہو اور صفائی چاہتی ہو۔",
      },
      {
        id: "home-cleansing",
        title: "گھر کی صفائی",
        hint: "گھر جو بھاری، بے چین یا روحانی طور پر غیر مطمئن لگے۔",
      },
      {
        id: "rizq",
        title: "کاروبار و رزق کی رکاوٹ",
        hint: "کام، مواقع یا رزق جو روحانی طور پر بند محسوس ہو۔",
      },
      {
        id: "family",
        title: "خاندان و بچوں کی نگہداشت",
        hint: "خوف، خراب نیند یا دباؤ جو بچوں یا گھر پر اثر انداز ہو۔",
      },
      {
        id: "renewal",
        title: "روحانی تجدید",
        hint: "نماز، دعا، وضاحت یا اندرونی سکون سے دوری۔",
      },
      {
        id: "other",
        title: "کچھ اور",
        hint: "کوئی اور بوجھ جو آپ نجی طور پر بتانا چاہتے ہیں۔",
      },
    ],
  },
  track: {
    eyebrow: "ٹریک",
    title: "اپنی درخواست کی حالت دیکھیں",
    intro: "وہ حوالہ نمبر درج کریں جو درخواست بنتے وقت ملا تھا۔",
    placeholder: "RS-2026-XXXXXX",
    check: "چیک کریں",
    checking: "چیک ہو رہا ہے...",
    statusLabels: {
      pending: "زیر التوا",
      in_review: "جائزہ میں",
      active: "جاری / فعال",
      diagnosis_completed: "تشخیص مکمل",
      resolved: "حل شدہ",
      cleared: "صاف — نئی درخواست ممکن",
    },
  },
  pricing: {
    eyebrow: "اخراجات",
    title: "تشخیص کے لیے ہدیہ — واضح اور ایماندار۔",
    intro:
      "ابتدائی روحانی تشخیص کے لیے مقررہ ہدیہ ہے تاکہ تصدیق آسان رہے۔ مزید رہنمائی، اگر درکار ہو، تشخیص کے بعد نجی طور پر بتائی جاتی ہے — نہ طبی فیس کے طور پر، نہ شفا کی ضمانت کے ساتھ۔",
    diagnosisTitle: "ابتدائی روحانی تشخیص",
    diagnosisBody:
      "ہدیہ بھیجیں، لین دین کے آخری ۵ ہندسے بتائیں، اور درخواست بنائیں۔ یہ صرف پہلی تشخیص کے جائزے کے لیے ہے۔",
    pkLabel: "پاکستان",
    pkAmount: "۵،۰۰۰ روپے",
    pkMethod: "ایزی پیسہ ۰۳۴۵۲۸۴۵۴۰۰",
    intlLabel: "بین الاقوامی",
    intlAmount: "۵۰ ڈالر",
    intlMethod: "آئی بی اے این PK50TMFB0000000014429642",
    furtherTitle: "مزید رہنمائی",
    furtherBody:
      "اگر تشخیص کے بعد گہری نگہداشت یا دفتری ملاقات درکار ہو تو اگلے قدم اور مزید ہدیہ واٹس ایپ پر نجی طور پر بتائے جاتے ہیں۔ کچھ زبردستی نہیں۔ انجام اللہ کے ہاتھ میں ہے۔",
    appointmentTitle: "دفتری اپائنٹمنٹ",
    appointmentBody:
      "بلدیہ / اتحاد ٹاؤن کی ملاقات پہلے پیغام کے بعد بذریعہ اپائنٹمنٹ ہوتی ہے۔ شروع کرتے وقت پسندیدہ دن اور وقت بتا سکتے ہیں۔",
    cta: "تشخیص کی درخواست شروع کریں",
    note: "روحانی شفا طبی علاج کا متبادل نہیں۔ شفا صرف اللہ کی طرف سے ہے۔ شفا کی کوئی ضمانت نہیں دی جاتی۔",
  },
  whatsappFloat: "واٹس ایپ",
  langEn: "EN",
  langUr: "اردو",
};

const dictionaries = { en, ur };

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dictionary;
  dir: "ltr" | "rtl";
};

const LangContext = createContext<LangContextValue | null>(null);

function readSavedLang(): Lang {
  if (typeof window === "undefined") return "en";
  const saved = window.localStorage.getItem("rs-lang");
  return saved === "ur" ? "ur" : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readSavedLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    window.localStorage.setItem("rs-lang", next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "ur" ? "ur" : "en";
    document.documentElement.dir = lang === "ur" ? "rtl" : "ltr";
    document.body.classList.toggle("font-urdu", lang === "ur");
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: dictionaries[lang],
      dir: lang === "ur" ? ("rtl" as const) : ("ltr" as const),
    }),
    [lang, setLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
