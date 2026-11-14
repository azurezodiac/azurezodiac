import { SITE } from "@/lib/seo";

export type PrepareGuideInput = {
  trackingNumber: string;
  concernTitle: string;
  name: string;
  lang: "en" | "ur";
  appointmentDayLabel: string;
  appointmentTimeLabel: string;
  hadiyaLabel: string;
  txnLast5: string;
  hasReceipt: boolean;
};

const EN_STEPS = [
  "Keep your reference number somewhere safe (screenshot this page if needed).",
  "Have the Hadiya receipt ready — last 5 transaction digits are already on your request.",
  "If you attached a receipt screenshot, send that same image in the WhatsApp chat after the message opens.",
  "Be ready to confirm your name and mother’s name spelling if asked.",
  "Write 3–5 honest lines about what you feel (sleep, fear, home, marriage, rizq) if you have not already.",
  "Choose a quiet moment to read the first reply — no rush, no public sharing.",
  "Continue any medical or professional care you already need. Spiritual care does not replace it.",
  "Baldia / Ittehad Town office visits are by appointment after the first message.",
];

const UR_STEPS = [
  "اپنا حوالہ نمبر محفوظ رکھیں (ضرورت ہو تو اس صفحے کا اسکرین شاٹ لیں)۔",
  "ہدیہ کی رسید تیار رکھیں — لین دین کے آخری ۵ ہندسے درخواست میں شامل ہیں۔",
  "اگر رسید کا اسکرین شاٹ منسلک کیا ہے تو واٹس ایپ کھلنے کے بعد وہی تصویر چیٹ میں بھیجیں۔",
  "اپنا نام اور والدہ کے نام کی ہجے درست بتانے کے لیے تیار رہیں۔",
  "اگر ابھی نہیں لکھا تو ۳–۵ سچی سطریں تیار رکھیں: نیند، خوف، گھر، شادی، رزق۔",
  "پہلا جواب پڑھنے کے لیے پرسکون لمحہ چنیں — جلدی یا عوامی شیئرنگ نہیں۔",
  "جو طبی یا پیشہ ورانہ علاج جاری ہے وہ جاری رکھیں — روحانی دیکھ بھال اس کی جگہ نہیں لیتی۔",
  "بلدیہ / اتحاد ٹاؤن دفتری ملاقات پہلے پیغام کے بعد بذریعہ اپائنٹمنٹ ہے۔",
];

/** Print-ready HTML (Save as PDF works in mobile browsers, including Urdu). */
export function buildPrepareGuideHtml(input: PrepareGuideInput): string {
  const ur = input.lang === "ur";
  const steps = ur ? UR_STEPS : EN_STEPS;
  const title = ur
    ? "تیاری کی فہرست — Redeemysoul"
    : "What to prepare — Redeemysoul";
  const disclaimer = ur
    ? "روحانی علاج طبی علاج کا متبادل نہیں۔ شفا صرف اللہ کے پاس ہے۔ شفا کی کوئی ضمانت نہیں۔"
    : "Spiritual healing is not a substitute for medical treatment. Shifa is from Allah alone. No guarantee of healing is offered.";

  const rows = [
    [ur ? "حوالہ" : "Reference", input.trackingNumber],
    [ur ? "مسئلہ" : "Concern", input.concernTitle],
    [ur ? "نام" : "Name", input.name],
    [ur ? "ہدیہ" : "Hadiya", `${input.hadiyaLabel} · ···${input.txnLast5}`],
    [
      ur ? "رسید تصویر" : "Receipt image",
      input.hasReceipt
        ? ur
          ? "منسلک (واٹس ایپ میں بھیجیں)"
          : "Attached (send in WhatsApp)"
        : ur
          ? "نہیں"
          : "Not attached",
    ],
    [
      ur ? "پسندیدہ ملاقات" : "Preferred visit",
      `${input.appointmentDayLabel} · ${input.appointmentTimeLabel}`,
    ],
  ];

  return `<!DOCTYPE html>
<html lang="${ur ? "ur" : "en"}" dir="${ur ? "rtl" : "ltr"}">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${escapeHtml(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&family=Outfit:wght@400;600&display=swap" rel="stylesheet"/>
<style>
  :root { color-scheme: light; }
  body { margin: 0; padding: 32px 24px; font-family: ${
    ur
      ? `"Noto Nastaliq Urdu", serif`
      : `"Outfit", system-ui, sans-serif`
  }; color: #061410; background: #f3efe6; line-height: 1.55; }
  h1 { font-size: 1.6rem; margin: 0 0 8px; }
  .meta { color: #3d5c4f; font-size: 0.92rem; margin-bottom: 24px; }
  table { width: 100%; border-collapse: collapse; margin: 16px 0 28px; }
  th, td { text-align: start; padding: 10px 8px; border-bottom: 1px solid #c9a65a55; font-size: 0.95rem; }
  th { width: 36%; color: #6b5a2e; font-weight: 600; }
  ol { padding-inline-start: 1.25rem; margin: 0; }
  li { margin: 0 0 10px; }
  .note { margin-top: 28px; padding: 14px; border: 1px solid #c9a65a88; font-size: 0.88rem; }
  .brand { color: #6b5a2e; font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; }
  @media print { body { padding: 12mm; background: white; } a { color: inherit; } }
</style>
</head>
<body>
  <p class="brand">${escapeHtml(SITE.businessName)}</p>
  <h1>${escapeHtml(title)}</h1>
  <p class="meta">${escapeHtml(SITE.name)} · ${escapeHtml(SITE.healer)} · ${escapeHtml(SITE.phoneDisplay)}</p>
  <table>
    ${rows
      .map(
        ([k, v]) =>
          `<tr><th>${escapeHtml(k)}</th><td>${escapeHtml(v)}</td></tr>`,
      )
      .join("")}
  </table>
  <h2 style="font-size:1.15rem;margin:0 0 12px">${
    ur ? "تیاری کے نکات" : "Preparation checklist"
  }</h2>
  <ol>
    ${steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
  </ol>
  <p class="note">${escapeHtml(disclaimer)}</p>
  <script>window.onload=function(){setTimeout(function(){window.print()},350)}</script>
</body>
</html>`;
}

export function openPrepareGuidePdf(input: PrepareGuideInput) {
  const html = buildPrepareGuideHtml(input);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank", "noopener,noreferrer");
  if (!win) {
    // Popup blocked — force download of HTML the user can open/print.
    const a = document.createElement("a");
    a.href = url;
    a.download = `redeemysoul-prepare-${input.trackingNumber}.html`;
    a.click();
  }
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
