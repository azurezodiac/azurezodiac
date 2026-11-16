"use client";

import { useLang } from "@/lib/i18n";

const EN = [
  "Ruqyah-centered",
  "Private consultation",
  "Karachi · Baldia",
  "Nazar & hasad",
  "Sihr guidance",
  "Bandish care",
  "Online first",
  "Shifa from Allah alone",
];

const UR = [
  "رقیہ مرکوز",
  "نجی مشاورت",
  "کراچی · بلدیہ",
  "نظر و حسد",
  "سحر رہنمائی",
  "بندش",
  "پہلے آن لائن",
  "شفا اللہ کے پاس",
];

/** Soft continuous ribbon — motion without noisy UI. */
export function TrustMarquee() {
  const { lang } = useLang();
  const items = lang === "ur" ? UR : EN;
  const loop = [...items, ...items];

  return (
    <div className="trust-marquee bg-ink" aria-hidden="true">
      <div className="trust-marquee__track">
        {loop.map((label, index) => (
          <span key={`${label}-${index}`}>
            <strong>·</strong> {label}
          </span>
        ))}
      </div>
    </div>
  );
}
