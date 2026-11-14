import { CONTACT_WHATSAPP, whatsappHref } from "@/lib/consultation";

export type WaTemplate = {
  id: string;
  titleEn: string;
  titleUr: string;
  concernHint: string;
  messageEn: string;
  messageUr: string;
};

/**
 * Catalog-style WhatsApp openers for common concerns.
 * Seekers tap → wa.me with a ready message (they still complete Begin + Hadiya for tracking).
 */
export const WA_TEMPLATES: WaTemplate[] = [
  {
    id: "nazar-hasad",
    titleEn: "Nazar & hasad",
    titleUr: "نظر اور حسد",
    concernHint: "Heaviness after praise, envy, unsettled protection",
    messageEn: `Assalamu alaikum,
I am contacting Spiritual Healing Shazli (Redeemysoul) about nazar / hasad.
I feel sudden heaviness or unrest and would like private Islamic guidance.
Please tell me the next step for spiritual diagnosis.
JazakAllahu khairan.`,
    messageUr: `السلام علیکم،
میں Spiritual Healing Shazli (Redeemysoul) سے نظر / حسد کے بارے میں رابطہ کر رہا/رہی ہوں۔
مجھے اچانک بھاری پن یا بےچینی محسوس ہوتی ہے اور نجی اسلامی رہنمائی چاہیے۔
براہ کرم روحانی تشخیص کا اگلا قدم بتائیں۔
جزاک اللہ خیراً۔`,
  },
  {
    id: "jadoo-sihr",
    titleEn: "Jadoo / sihr",
    titleUr: "جادو / سحر",
    concernHint: "Fear, dreams, strain beyond ordinary hardship",
    messageEn: `Assalamu alaikum,
I am requesting guidance from Redeemysoul regarding jadoo / sihr concerns.
I am experiencing fear, heavy dreams, or life blockage that feels spiritual.
I want private, ruqyah-centered Islamic care — not public display.
Please guide me on how to begin diagnosis.
JazakAllahu khairan.`,
    messageUr: `السلام علیکم،
میں Redeemysoul سے جادو / سحر کی پریشانی پر رہنمائی چاہتا/چاہتی ہوں۔
مجھے خوف، بھاری خواب یا ایسی رکاوٹ محسوس ہوتی ہے جو روحانی لگتی ہے۔
نجی، رقیہ مرکوز اسلامی دیکھ بھال چاہیے — عوامی نمائش نہیں۔
براہ کرم تشخیص کیسے شروع کریں بتائیں۔
جزاک اللہ خیراً۔`,
  },
  {
    id: "jinnat-aseeb",
    titleEn: "Jinnat & aseeb",
    titleUr: "جنات اور آسیب",
    concernHint: "Presence, pressure, nightmares, household unrest",
    messageEn: `Assalamu alaikum,
I am writing to Spiritual Healing Shazli about jinnat / aseeb-related concern.
I feel pressure, disturbed sleep, or unrest at home and need calm private guidance.
Please advise the next step.
JazakAllahu khairan.`,
    messageUr: `السلام علیکم،
میں Spiritual Healing Shazli سے جنات / آسیب سے متعلق رابطہ کر رہا/رہی ہوں۔
دباؤ، خراب نیند یا گھر کی بےچینی ہے — پرسکون نجی رہنمائی درکار ہے۔
براہ کرم اگلا قدم بتائیں۔
جزاک اللہ خیراً۔`,
  },
  {
    id: "bandish",
    titleEn: "Bandish / blockage",
    titleUr: "بندش / رکاوٹ",
    concernHint: "Stalled marriage, rizq, or closed doors",
    messageEn: `Assalamu alaikum,
I need guidance from Redeemysoul about bandish / spiritual blockage.
Marriage, rizq, or important doors feel stuck despite effort.
Please help me begin a private spiritual diagnosis.
JazakAllahu khairan.`,
    messageUr: `السلام علیکم،
مجھے Redeemysoul سے بندش / روحانی رکاوٹ پر رہنمائی چاہیے۔
شادی، رزق یا اہم دروازے کوشش کے باوجود بند محسوس ہوتے ہیں۔
براہ کرم نجی روحانی تشخیص شروع کرنے میں مدد کریں۔
جزاک اللہ خیراً۔`,
  },
  {
    id: "home-cleansing",
    titleEn: "Home feels heavy",
    titleUr: "گھر بھاری محسوس ہوتا ہے",
    concernHint: "Restless house, fear in rooms, family tension",
    messageEn: `Assalamu alaikum,
Our home feels heavy / restless and I am seeking spiritual home cleansing guidance from Spiritual Healing Shazli.
Please tell me how to start a private consultation.
JazakAllahu khairan.`,
    messageUr: `السلام علیکم،
ہمارا گھر بھاری / بے چین محسوس ہوتا ہے اور میں Spiritual Healing Shazli سے روحانی ہوم کلینزنگ رہنمائی چاہتا/چاہتی ہوں۔
براہ کرم نجی مشورہ کیسے شروع کریں بتائیں۔
جزاک اللہ خیراً۔`,
  },
  {
    id: "family-children",
    titleEn: "Family & children",
    titleUr: "خاندان اور بچے",
    concernHint: "Children’s fear, sleep, household strain",
    messageEn: `Assalamu alaikum,
I am contacting Redeemysoul about spiritual concern affecting family / children.
There is fear, disturbed sleep, or strain in the household.
I request private Islamic guidance and the next step for diagnosis.
JazakAllahu khairan.`,
    messageUr: `السلام علیکم،
میں Redeemysoul سے خاندان / بچوں سے متعلق روحانی پریشانی پر رابطہ کر رہا/رہی ہوں۔
خوف، خراب نیند یا گھر میں تناؤ ہے۔
نجی اسلامی رہنمائی اور تشخیص کا اگلا قدم چاہیے۔
جزاک اللہ خیراً۔`,
  },
  {
    id: "rizq",
    titleEn: "Business & rizq",
    titleUr: "کاروبار اور رزق",
    concernHint: "Work doors closed, provision feels blocked",
    messageEn: `Assalamu alaikum,
I am seeking Redeemysoul guidance for business / rizq blockage that feels spiritual.
Please advise how to begin private diagnosis with Spiritual Healing Shazli.
JazakAllahu khairan.`,
    messageUr: `السلام علیکم،
میں Redeemysoul سے کاروبار / رزق کی روحانی بندش پر رہنمائی چاہتا/چاہتی ہوں۔
براہ کرم Spiritual Healing Shazli کے ساتھ نجی تشخیص کیسے شروع کریں بتائیں۔
جزاک اللہ خیراً۔`,
  },
  {
    id: "general",
    titleEn: "General spiritual heaviness",
    titleUr: "عام روحانی بھاری پن",
    concernHint: "Unclear burden — need calm first reply",
    messageEn: `Assalamu alaikum,
I am reaching Spiritual Healing Shazli (Redeemysoul) for Islamic spiritual guidance.
I am carrying heaviness / fear and want a private first consultation.
Please tell me the next step (including Hadiya for diagnosis review).
JazakAllahu khairan.`,
    messageUr: `السلام علیکم،
میں Spiritual Healing Shazli (Redeemysoul) سے اسلامی روحانی رہنمائی کے لیے رابطہ کر رہا/رہی ہوں۔
بھاری پن / خوف ہے اور نجی پہلا مشورہ چاہیے۔
براہ کرم اگلا قدم بتائیں (تشخیصی ہدیہ سمیت)۔
جزاک اللہ خیراً۔`,
  },
];

export function templateWhatsAppHref(
  template: WaTemplate,
  lang: "en" | "ur" = "en",
): string {
  const message = lang === "ur" ? template.messageUr : template.messageEn;
  return whatsappHref(message);
}

export function templatesPageWhatsAppNumber(): string {
  return CONTACT_WHATSAPP;
}
