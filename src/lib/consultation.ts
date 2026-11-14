/** Update these to your real inbox / WhatsApp (digits only, country code, no +). */
export const CONTACT_EMAIL = "Roohaniilajkarachi@gmail.com";
export const CONTACT_WHATSAPP = "923452845400";

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

  lines.push(
    "",
    "Please guide me on the next step. JazakAllahu khairan.",
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
