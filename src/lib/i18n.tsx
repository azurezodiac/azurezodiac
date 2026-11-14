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
    privacy: string;
    faq: string;
    begin: string;
    consultation: string;
    backHome: string;
  };
  hero: {
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
  trust: {
    items: { eyebrow: string; title: string; copy: string }[];
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
    back: string;
    submit: string;
    submitting: string;
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
  };
  whatsappFloat: string;
  langEn: string;
  langUr: string;
};

const en: Dictionary = {
  nav: {
    services: "Services",
    path: "How it works",
    privacy: "Privacy",
    faq: "FAQ",
    begin: "Begin",
    consultation: "Consultation",
    backHome: "Back home",
  },
  hero: {
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
        a: "No. Redeemysoul offers faith-centered spiritual guidance. Please continue any medical or professional care you need.",
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
    stepSend: "03 Send",
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
    back: "Back",
    submit: "Create request",
    submitting: "Saving...",
    readyTitle: "Your message is ready",
    readyIntro:
      "Keep this reference. Send the prepared message on WhatsApp or email — then wait for a calm, private reply.",
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
  },
  whatsappFloat: "WhatsApp",
  langEn: "EN",
  langUr: "اردو",
};

const ur: Dictionary = {
  nav: {
    services: "خدمات",
    path: "طریقہ کار",
    privacy: "رازداری",
    faq: "سوالات",
    begin: "شروع",
    consultation: "مشاورت",
    backHome: "واپس صفحہ اول",
  },
  hero: {
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
        a: "نہیں۔ ریڈیمی سول ایمانی روحانی رہنمائی دیتا ہے۔ جو طبی یا پیشہ ورانہ علاج درکار ہو وہ جاری رکھیں۔",
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
    stepSend: "۰۳ ارسال",
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
    back: "واپس",
    submit: "درخواست بنائیں",
    submitting: "محفوظ ہو رہا ہے...",
    readyTitle: "آپ کا پیغام تیار ہے",
    readyIntro:
      "یہ حوالہ محفوظ رکھیں۔ تیار پیغام واٹس ایپ یا ای میل پر بھیجیں — پھر پرسکون، نجی جواب کا انتظار کریں۔",
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
