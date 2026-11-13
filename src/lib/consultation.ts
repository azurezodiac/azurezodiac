/** Update these to your real inbox / WhatsApp (digits only, country code, no +). */
export const CONTACT_EMAIL = "Roohaniilajkarachi@gmail.com";
export const CONTACT_WHATSAPP = "923001234567";

export const CONCERNS = [
  {
    id: "evil-eye",
    title: "Evil eye & envy",
    hint: "Hasad, heaviness, or unsettled protection.",
  },
  {
    id: "black-magic",
    title: "Black magic concerns",
    hint: "Fear, unusual strain, or spiritual disturbance.",
  },
  {
    id: "renewal",
    title: "Spiritual renewal",
    hint: "Distance from remembrance, clarity, or peace.",
  },
  {
    id: "other",
    title: "Something else",
    hint: "Another burden you want to name carefully.",
  },
] as const;

export type ConcernId = (typeof CONCERNS)[number]["id"];

export type ConsultationPayload = {
  concernId: ConcernId;
  concernTitle: string;
  name: string;
  motherName: string;
  location: string;
  note?: string;
};

export function buildConsultationMessage(data: ConsultationPayload): string {
  const lines = [
    "Assalamu alaikum — Redeemysoul consultation request",
    "",
    `Concern: ${data.concernTitle}`,
    `Name: ${data.name}`,
    `Mother's name: ${data.motherName}`,
    `Closest location: ${data.location}`,
  ];

  if (data.note?.trim()) {
    lines.push(`Note: ${data.note.trim()}`);
  }

  lines.push("", "Please guide me on the next step.");
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
