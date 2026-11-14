/** Update these to your real inbox / WhatsApp (digits only, country code, no +). */
export const CONTACT_EMAIL = "Roohaniilajkarachi@gmail.com";
export const CONTACT_WHATSAPP = "923452845400";

/** Hadiya for initial spiritual diagnosis (manual verification). */
export const HADIYA = {
  pakistan: {
    amountLabel: "PKR 5,000",
    amountValue: 5000,
    currency: "PKR",
    method: "EasyPaisa",
    account: "03452845400",
  },
  international: {
    amountLabel: "USD 50",
    amountValue: 50,
    currency: "USD",
    method: "Bank IBAN",
    account: "PK50TMFB0000000014429642",
  },
} as const;

export type HadiyaRegion = keyof typeof HADIYA;

export const CONCERNS = [
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
] as const;

export type ConcernId = (typeof CONCERNS)[number]["id"];

export type ConsultationPayload = {
  concernId: ConcernId;
  concernTitle: string;
  name: string;
  motherName: string;
  location: string;
  phone: string;
  note?: string;
  trackingNumber?: string;
  hadiyaRegion?: HadiyaRegion;
  hadiyaTxnLast5?: string;
};

export function buildConsultationMessage(data: ConsultationPayload): string {
  const lines = [
    "Assalamu alaikum,",
    "",
    "I am requesting Islamic healing guidance from Redeemysoul.",
    "",
  ];

  if (data.trackingNumber) {
    lines.push(`Reference: ${data.trackingNumber}`, "");
  }

  lines.push(
    `Concern: ${data.concernTitle}`,
    `Name: ${data.name}`,
    `Mother's name: ${data.motherName}`,
    `Location: ${data.location}`,
    `WhatsApp: ${data.phone}`,
  );

  if (data.note?.trim()) {
    lines.push(`Details: ${data.note.trim()}`);
  }

  if (data.hadiyaRegion && data.hadiyaTxnLast5) {
    const hadiya = HADIYA[data.hadiyaRegion];
    lines.push(
      "",
      "Hadiya for spiritual diagnosis:",
      `Region: ${data.hadiyaRegion === "pakistan" ? "Pakistan" : "International"}`,
      `Amount: ${hadiya.amountLabel}`,
      `Method: ${hadiya.method} (${hadiya.account})`,
      `Transaction last 5 digits: ${data.hadiyaTxnLast5}`,
    );
  }

  lines.push(
    "",
    "Please guide me on the next step. JazakAllahu khairan.",
    "",
    "Note: Spiritual healing is not a substitute for medical treatment. Shifa is from Allah alone. No guarantee of healing is offered.",
  );
  return lines.join("\n");
}

export function whatsappHref(message: string): string {
  const phone = CONTACT_WHATSAPP.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function emailHref(message: string): string {
  const subject = "Redeemysoul consultation request";
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}
