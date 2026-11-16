"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { HealingDisclaimer } from "@/components/HealingDisclaimer";
import {
  APPOINTMENT_DAYS,
  APPOINTMENT_TIMES,
  HADIYA,
  type AppointmentDay,
  type AppointmentTime,
  type ConcernId,
  type HadiyaRegion,
  buildConsultationMessage,
  emailHref,
  whatsappHref,
} from "@/lib/consultation";
import { useLang } from "@/lib/i18n";
import { openPrepareGuidePdf } from "@/lib/prepare-guide";

type Step = 1 | 2 | 3 | 4;

type CreatedRequest = {
  trackingNumber: string;
  status: string;
  statusNote: string;
};

type DuplicateInfo = {
  trackingNumber: string;
  status: string;
  statusNote: string;
};

type FieldErrors = {
  concern?: string;
  name?: string;
  mother?: string;
  location?: string;
  phone?: string;
  txn?: string;
  receipt?: string;
};

const MAX_RECEIPT_BYTES = 2 * 1024 * 1024;
const RECEIPT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
]);

const fieldClass = "field-input";
const fieldErrorClass = "field-input field-input-error";

export function BeginFlow() {
  const { t, lang } = useLang();
  const [step, setStep] = useState<Step>(1);
  const [concernId, setConcernId] = useState<ConcernId | null>(null);
  const [name, setName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [appointmentDay, setAppointmentDay] =
    useState<AppointmentDay>("no-preference");
  const [appointmentTime, setAppointmentTime] =
    useState<AppointmentTime>("no-preference");
  const [hadiyaRegion, setHadiyaRegion] =
    useState<HadiyaRegion>("pakistan");
  const [txnLast5, setTxnLast5] = useState("");
  const [receiptName, setReceiptName] = useState("");
  const [receiptPreview, setReceiptPreview] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [created, setCreated] = useState<CreatedRequest | null>(null);
  const [duplicate, setDuplicate] = useState<DuplicateInfo | null>(null);
  const [waOpened, setWaOpened] = useState(false);

  const concern =
    t.begin.concerns.find((item) => item.id === concernId) ?? null;

  const txnClean = txnLast5.replace(/\D/g, "").slice(0, 5);
  const hadiyaReady = txnClean.length === 5;
  const phoneDigits = phone.replace(/\D/g, "");

  const appointmentDayLabel =
    t.begin.appointmentDays[appointmentDay] ?? appointmentDay;
  const appointmentTimeLabel =
    t.begin.appointmentTimes[appointmentTime] ?? appointmentTime;

  const message = useMemo(() => {
    if (!concern || !created) return "";
    return buildConsultationMessage({
      concernId: concern.id as ConcernId,
      concernTitle: concern.title,
      name: name.trim(),
      motherName: motherName.trim(),
      location: location.trim(),
      phone: phone.trim(),
      note,
      trackingNumber: created.trackingNumber,
      hadiyaRegion,
      hadiyaTxnLast5: txnClean,
      appointmentDay,
      appointmentTime,
      appointmentDayLabel,
      appointmentTimeLabel,
    });
  }, [
    concern,
    created,
    name,
    motherName,
    location,
    phone,
    note,
    hadiyaRegion,
    txnClean,
    appointmentDay,
    appointmentTime,
    appointmentDayLabel,
    appointmentTimeLabel,
  ]);

  const selectedHadiya = HADIYA[hadiyaRegion];
  const waLink = message ? whatsappHref(message) : "";

  useEffect(() => {
    if (!created || !waLink || waOpened || duplicate) return;
    setWaOpened(true);
    const timer = window.setTimeout(() => {
      window.open(waLink, "_blank", "noopener,noreferrer");
    }, 700);
    return () => window.clearTimeout(timer);
  }, [created, waLink, waOpened, duplicate]);

  async function copyText(key: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 1800);
    } catch {
      setCopiedKey(null);
    }
  }

  function validateDetails(): FieldErrors {
    const next: FieldErrors = {};
    if (name.trim().length < 2) next.name = t.begin.errors.name;
    if (motherName.trim().length < 2) next.mother = t.begin.errors.mother;
    if (location.trim().length < 2) next.location = t.begin.errors.location;
    if (phoneDigits.length === 0) next.phone = t.begin.errors.phone;
    else if (phoneDigits.length < 10) next.phone = t.begin.errors.phoneShort;
    return next;
  }

  function validateHadiya(): FieldErrors {
    const next: FieldErrors = {};
    if (txnClean.length !== 5) next.txn = t.begin.errors.txn;
    return next;
  }

  function tryStep2() {
    if (!concernId) {
      setFieldErrors({ concern: t.begin.errors.pickConcern });
      return;
    }
    setFieldErrors({});
    setStep(2);
  }

  function tryStep3() {
    const next = validateDetails();
    setFieldErrors(next);
    if (Object.keys(next).length > 0) {
      setError(t.begin.errors.fixDetails);
      return;
    }
    setError("");
    setStep(3);
  }

  function onReceiptChange(file: File | null) {
    setFieldErrors((prev) => ({ ...prev, receipt: undefined }));
    if (!file) {
      setReceiptName("");
      setReceiptPreview("");
      return;
    }
    if (!RECEIPT_TYPES.has(file.type)) {
      setFieldErrors((prev) => ({
        ...prev,
        receipt: t.begin.receiptErrorType,
      }));
      setReceiptName("");
      setReceiptPreview("");
      return;
    }
    if (file.size > MAX_RECEIPT_BYTES) {
      setFieldErrors((prev) => ({
        ...prev,
        receipt: t.begin.receiptErrorSize,
      }));
      setReceiptName("");
      setReceiptPreview("");
      return;
    }
    setReceiptName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setReceiptPreview(result);
    };
    reader.readAsDataURL(file);
  }

  function clearReceipt() {
    setReceiptName("");
    setReceiptPreview("");
    setFieldErrors((prev) => ({ ...prev, receipt: undefined }));
  }

  function createStaticFallback() {
    const phoneKey = phone.replace(/\D/g, "");
    const storageKey = `rs-open-${phoneKey}`;
    const existing = window.localStorage.getItem(storageKey);
    if (existing) {
      setDuplicate({
        trackingNumber: existing,
        status: "pending",
        statusNote: t.begin.pendingIntro,
      });
      setStep(4);
      return;
    }

    const token = Math.random().toString(16).slice(2, 8).toUpperCase();
    const trackingNumber = `RS-${new Date().getFullYear()}-${token}`;
    window.localStorage.setItem(storageKey, trackingNumber);
    window.localStorage.setItem(
      `rs-req-${trackingNumber}`,
      JSON.stringify({
        trackingNumber,
        status: "pending",
        statusLabel: t.track.statusLabels.pending,
        statusNote: t.begin.readyIntro,
        concernTitle: concern?.title ?? "",
        name: name.trim(),
        location: location.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    );
    if (receiptPreview) {
      try {
        window.localStorage.setItem(
          `rs-receipt-${trackingNumber}`,
          JSON.stringify({ name: receiptName, dataUrl: receiptPreview }),
        );
      } catch {
        // Quota — preview still in memory for this session.
      }
    }
    setCreated({
      trackingNumber,
      status: "pending",
      statusNote: t.begin.readyIntro,
    });
    setStep(4);
  }

  function buildNoteWithExtras() {
    const extras = [
      `Hadiya (${hadiyaRegion === "pakistan" ? "Pakistan" : "International"}): ${selectedHadiya.amountLabel}`,
      `Method: ${selectedHadiya.method} ${selectedHadiya.account}`,
      `Txn last 5: ${txnClean}`,
      `Preferred day: ${appointmentDayLabel}`,
      `Preferred time: ${appointmentTimeLabel}`,
      receiptName
        ? `Receipt screenshot: ${receiptName} (send image in WhatsApp)`
        : "Receipt screenshot: not attached",
    ].join(" | ");
    const base = note.trim();
    return base ? `${base}\n\n${extras}` : extras;
  }

  async function submitRequest() {
    const hadiyaErrors = validateHadiya();
    setFieldErrors(hadiyaErrors);
    if (Object.keys(hadiyaErrors).length > 0) {
      setError(t.begin.errors.fixHadiya);
      return;
    }
    if (!concern || submitting) return;
    setSubmitting(true);
    setError("");
    setDuplicate(null);
    setWaOpened(false);

    const noteWithExtras = buildNoteWithExtras();

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          concernId: concern.id,
          name,
          motherName,
          location,
          phone,
          note: noteWithExtras,
          hadiyaRegion,
          hadiyaTxnLast5: txnClean,
          appointmentDay,
          appointmentTime,
          receiptFilename: receiptName || undefined,
        }),
      });

      if (response.status === 404 || response.status === 405) {
        createStaticFallback();
        return;
      }

      const data = (await response.json()) as {
        error?: string;
        message?: string;
        request?: CreatedRequest & { statusNote?: string };
      };

      if (response.status === 409 && data.request) {
        setDuplicate({
          trackingNumber: data.request.trackingNumber,
          status: data.request.status,
          statusNote: data.request.statusNote ?? data.message ?? "",
        });
        setStep(4);
        return;
      }

      if (!response.ok || !data.request) {
        setError(data.message || data.error || t.begin.errors.submit);
        return;
      }

      if (receiptPreview) {
        try {
          window.localStorage.setItem(
            `rs-receipt-${data.request.trackingNumber}`,
            JSON.stringify({ name: receiptName, dataUrl: receiptPreview }),
          );
        } catch {
          // ignore quota
        }
      }

      setCreated({
        trackingNumber: data.request.trackingNumber,
        status: data.request.status,
        statusNote: data.request.statusNote ?? "",
      });
      setStep(4);
    } catch {
      createStaticFallback();
    } finally {
      setSubmitting(false);
    }
  }

  function downloadPrep() {
    if (!created || !concern) return;
    openPrepareGuidePdf({
      trackingNumber: created.trackingNumber,
      concernTitle: concern.title,
      name: name.trim(),
      lang,
      appointmentDayLabel,
      appointmentTimeLabel,
      hadiyaLabel: selectedHadiya.amountLabel,
      txnLast5: txnClean,
      hasReceipt: Boolean(receiptName),
    });
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-8 space-y-4">
        <div className="step-rail" aria-hidden="true">
          <span className="step-rail__seg" data-on={step >= 1} />
          <span className="step-rail__seg" data-on={step >= 2} />
          <span className="step-rail__seg" data-on={step >= 3} />
          <span className="step-rail__seg" data-on={step >= 4} />
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] tracking-[0.14em] uppercase text-fog sm:text-xs sm:tracking-[0.16em]">
          <StepPill active={step === 1} done={step > 1} label={t.begin.stepConcern} />
          <StepPill active={step === 2} done={step > 2} label={t.begin.stepDetails} />
          <StepPill active={step === 3} done={step > 3} label={t.begin.stepHadiya} />
          <StepPill active={step === 4} done={false} label={t.begin.stepSend} />
        </div>
      </div>

      <HealingDisclaimer className="surface-panel mb-10 px-4 py-3.5" />

      {step === 1 && (
        <section key="step-1" className="begin-step-enter space-y-8">
          <div>
            <p className="text-xs tracking-[0.22em] uppercase text-gold">
              {t.begin.eyebrow}
            </p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-cream md:text-5xl">
              {t.begin.title}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-fog">
              {t.begin.intro}
            </p>
          </div>

          <div className="grid gap-3">
            {t.begin.concerns.map((item) => {
              const selected = concernId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setConcernId(item.id as ConcernId);
                    setFieldErrors((prev) => ({ ...prev, concern: undefined }));
                  }}
                  className="choice-tile"
                  data-selected={selected}
                >
                  <span className="font-display text-2xl text-cream">
                    {item.title}
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-fog">
                    {item.hint}
                  </span>
                </button>
              );
            })}
          </div>

          {fieldErrors.concern ? (
            <p className="text-sm text-red-300" role="alert">
              {fieldErrors.concern}
            </p>
          ) : null}

          <button type="button" onClick={tryStep2} className="btn-primary">
            {t.begin.continue}
          </button>
        </section>
      )}

      {step === 2 && (
        <section key="step-2" className="begin-step-enter space-y-8">
          <div>
            <p className="text-xs tracking-[0.22em] uppercase text-gold">
              {t.begin.detailsEyebrow}
            </p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-cream md:text-5xl">
              {t.begin.detailsTitle}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-fog">
              {t.begin.concernSelected}{" "}
              <span className="text-cream">{concern?.title}</span>
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-fog/80">
              {t.begin.privacy}
            </p>
          </div>

          {error ? (
            <p className="text-sm text-red-300" role="alert">
              {error}
            </p>
          ) : null}

          <div className="space-y-5">
            <Field
              label={t.begin.name}
              error={fieldErrors.name}
              value={name}
              onChange={setName}
              placeholder={t.begin.namePh}
              autoComplete="name"
              clearError={() =>
                setFieldErrors((prev) => ({ ...prev, name: undefined }))
              }
            />
            <Field
              label={t.begin.mother}
              error={fieldErrors.mother}
              value={motherName}
              onChange={setMotherName}
              placeholder={t.begin.motherPh}
              clearError={() =>
                setFieldErrors((prev) => ({ ...prev, mother: undefined }))
              }
            />
            <Field
              label={t.begin.location}
              error={fieldErrors.location}
              value={location}
              onChange={setLocation}
              placeholder={t.begin.locationPh}
              clearError={() =>
                setFieldErrors((prev) => ({ ...prev, location: undefined }))
              }
            />
            <Field
              label={t.begin.phone}
              error={fieldErrors.phone}
              value={phone}
              onChange={setPhone}
              placeholder={t.begin.phonePh}
              inputMode="tel"
              autoComplete="tel"
              clearError={() =>
                setFieldErrors((prev) => ({ ...prev, phone: undefined }))
              }
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs tracking-[0.16em] uppercase text-fog">
                  {t.begin.appointmentDay}
                </span>
                <select
                  className={fieldClass}
                  value={appointmentDay}
                  onChange={(event) =>
                    setAppointmentDay(event.target.value as AppointmentDay)
                  }
                >
                  {APPOINTMENT_DAYS.map((day) => (
                    <option key={day} value={day}>
                      {t.begin.appointmentDays[day]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-xs tracking-[0.16em] uppercase text-fog">
                  {t.begin.appointmentTime}
                </span>
                <select
                  className={fieldClass}
                  value={appointmentTime}
                  onChange={(event) =>
                    setAppointmentTime(event.target.value as AppointmentTime)
                  }
                >
                  {APPOINTMENT_TIMES.map((slot) => (
                    <option key={slot} value={slot}>
                      {t.begin.appointmentTimes[slot]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <p className="text-sm leading-relaxed text-fog/80">
              {t.begin.appointmentHint}
            </p>

            <label className="block">
              <span className="mb-2 block text-xs tracking-[0.16em] uppercase text-fog">
                {t.begin.note}
              </span>
              <textarea
                className={fieldClass}
                rows={4}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder={t.begin.notePh}
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setError("");
                setFieldErrors({});
                setStep(1);
              }}
              className="btn-ghost"
            >
              {t.begin.back}
            </button>
            <button type="button" onClick={tryStep3} className="btn-primary">
              {t.begin.toHadiya}
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section key="step-3" className="begin-step-enter space-y-8">
          <div>
            <p className="text-xs tracking-[0.22em] uppercase text-gold">
              {t.begin.hadiyaEyebrow}
            </p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-cream md:text-5xl">
              {t.begin.hadiyaTitle}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-fog">
              {t.begin.hadiyaIntro}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setHadiyaRegion("pakistan")}
              className="choice-tile"
              data-selected={hadiyaRegion === "pakistan"}
            >
              <span className="font-display text-2xl text-cream">
                {t.begin.hadiyaPakistan}
              </span>
              <span className="mt-2 block text-sm text-fog">
                {t.begin.hadiyaPkAmount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setHadiyaRegion("international")}
              className="choice-tile"
              data-selected={hadiyaRegion === "international"}
            >
              <span className="font-display text-2xl text-cream">
                {t.begin.hadiyaInternational}
              </span>
              <span className="mt-2 block text-sm text-fog">
                {t.begin.hadiyaIntlAmount}
              </span>
            </button>
          </div>

          <div className="surface-panel space-y-4 px-5 py-5">
            <div>
              <p className="text-xs tracking-[0.16em] uppercase text-fog">
                {hadiyaRegion === "pakistan"
                  ? t.begin.hadiyaEasyPaisa
                  : t.begin.hadiyaIban}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <p className="break-all font-display text-xl text-cream md:text-2xl">
                  {selectedHadiya.account}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    copyText(hadiyaRegion, selectedHadiya.account)
                  }
                  className="border border-gold/40 px-3 py-1.5 text-[11px] tracking-[0.14em] uppercase text-gold transition-colors hover:border-gold-bright hover:text-gold-bright"
                >
                  {copiedKey === hadiyaRegion
                    ? t.begin.hadiyaCopied
                    : t.begin.hadiyaCopy}
                </button>
              </div>
              <p className="mt-3 text-sm text-fog">
                {hadiyaRegion === "pakistan"
                  ? t.begin.hadiyaPkAmount
                  : t.begin.hadiyaIntlAmount}
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs tracking-[0.16em] uppercase text-fog">
                {t.begin.hadiyaTxnLabel}
              </span>
              <input
                className={fieldErrors.txn ? fieldErrorClass : fieldClass}
                value={txnLast5}
                onChange={(event) => {
                  setTxnLast5(
                    event.target.value.replace(/\D/g, "").slice(0, 5),
                  );
                  setFieldErrors((prev) => ({ ...prev, txn: undefined }));
                }}
                placeholder={t.begin.hadiyaTxnPh}
                inputMode="numeric"
                maxLength={5}
                autoComplete="off"
                aria-invalid={Boolean(fieldErrors.txn)}
              />
              <span className="mt-2 block text-sm leading-relaxed text-fog/80">
                {t.begin.hadiyaTxnHint}
              </span>
              {fieldErrors.txn ? (
                <span className="mt-2 block text-sm text-red-300" role="alert">
                  {fieldErrors.txn}
                </span>
              ) : !hadiyaReady && txnLast5.length > 0 ? (
                <span className="mt-2 block text-sm text-gold">
                  {t.begin.hadiyaTxnError}
                </span>
              ) : null}
            </label>

            <div className="block">
              <span className="mb-2 flex items-center gap-2 text-xs tracking-[0.16em] uppercase text-fog">
                {t.begin.receiptLabel}
                <span className="text-fog/60">({t.begin.receiptOptional})</span>
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="block w-full text-sm text-fog file:me-3 file:border-0 file:bg-gold/90 file:px-3 file:py-2 file:text-xs file:tracking-[0.12em] file:uppercase file:text-ink"
                onChange={(event) =>
                  onReceiptChange(event.target.files?.[0] ?? null)
                }
              />
              <span className="mt-2 block text-sm leading-relaxed text-fog/80">
                {t.begin.receiptHint}
              </span>
              {fieldErrors.receipt ? (
                <span className="mt-2 block text-sm text-red-300" role="alert">
                  {fieldErrors.receipt}
                </span>
              ) : null}
              {receiptPreview ? (
                <div className="mt-4 flex items-start gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={receiptPreview}
                    alt=""
                    className="h-20 w-20 object-cover border border-line"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-cream">
                      {t.begin.receiptChosen}: {receiptName}
                    </p>
                    <button
                      type="button"
                      onClick={clearReceipt}
                      className="mt-2 text-xs tracking-[0.12em] uppercase text-gold hover:text-gold-bright"
                    >
                      {t.begin.receiptClear}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <p className="text-sm leading-relaxed text-fog/85">
            {t.begin.hadiyaNote}
          </p>

          {error ? (
            <p className="text-sm text-red-300" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setError("");
                setFieldErrors({});
                setStep(2);
              }}
              className="btn-ghost"
            >
              {t.begin.back}
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => void submitRequest()}
              className="btn-primary"
            >
              {submitting ? t.begin.submitting : t.begin.submit}
            </button>
          </div>
        </section>
      )}

      {step === 4 && duplicate && (
        <section key="step-4-dup" className="begin-step-enter space-y-8">
          <div>
            <p className="text-xs tracking-[0.22em] uppercase text-gold">
              {t.begin.stepSend}
            </p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-cream md:text-5xl">
              {t.begin.pendingTitle}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-fog">
              {t.begin.pendingIntro}
            </p>
          </div>

          <div className="surface-panel border-gold/40 px-5 py-5">
            <p className="text-xs tracking-[0.16em] uppercase text-gold">
              {t.begin.reference}
            </p>
            <p className="mt-2 font-display text-3xl text-cream">
              {duplicate.trackingNumber}
            </p>
            <p className="mt-4 text-sm text-fog">{duplicate.statusNote}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/track?id=${encodeURIComponent(duplicate.trackingNumber)}`}
              className="btn-primary"
            >
              {t.begin.checkStatus}
            </Link>
            <button
              type="button"
              onClick={() => {
                setStep(3);
                setDuplicate(null);
              }}
              className="btn-ghost"
            >
              {t.begin.back}
            </button>
          </div>
        </section>
      )}

      {step === 4 && created && concern && (
        <section key="step-4-ok" className="begin-step-enter space-y-8">
          <div>
            <p className="text-xs tracking-[0.22em] uppercase text-gold">
              {t.begin.stepSend}
            </p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-cream md:text-5xl">
              {t.begin.readyTitle}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-fog">
              {t.begin.readyIntro}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-gold">
              {t.begin.autoWaHint}
            </p>
          </div>

          <div className="surface-panel border-gold/35 px-5 py-6">
            <p className="text-xs tracking-[0.16em] uppercase text-gold">
              {t.begin.reference}
            </p>
            <p className="mt-2 font-display text-3xl text-cream md:text-4xl">
              {created.trackingNumber}
            </p>
            <p className="mt-4 text-sm text-fog">{created.statusNote}</p>
            <p className="mt-3 text-sm text-fog">
              Hadiya txn ···{txnClean} · {appointmentDayLabel} ·{" "}
              {appointmentTimeLabel}
            </p>
          </div>

          {receiptPreview ? (
            <div className="surface-panel px-5 py-5">
              <p className="text-sm text-gold">{t.begin.receiptWaHint}</p>
              <div className="mt-4 flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={receiptPreview}
                  alt=""
                  className="h-24 w-24 object-cover border border-line"
                />
                <p className="text-sm text-fog">{receiptName}</p>
              </div>
            </div>
          ) : null}

          <pre className="surface-panel overflow-x-auto whitespace-pre-wrap px-5 py-5 font-sans text-sm leading-relaxed text-mist">
            {message}
          </pre>

          <div className="flex flex-wrap gap-3">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              {t.begin.openWaNow}
            </a>
            <button type="button" onClick={downloadPrep} className="btn-secondary">
              {t.begin.downloadPrepPdf}
            </button>
            <a href={emailHref(message)} className="btn-ghost">
              {t.begin.notifyEmail}
            </a>
            <Link
              href={`/track?id=${encodeURIComponent(created.trackingNumber)}`}
              className="btn-ghost"
            >
              {t.begin.track}
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

function Field({
  label,
  error,
  value,
  onChange,
  placeholder,
  inputMode,
  autoComplete,
  clearError,
}: {
  label: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  inputMode?: "tel" | "text";
  autoComplete?: string;
  clearError: () => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs tracking-[0.16em] uppercase text-fog">
        {label}
      </span>
      <input
        className={error ? fieldErrorClass : fieldClass}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          clearError();
        }}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
      />
      {error ? (
        <span className="mt-2 block text-sm text-red-300" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function StepPill({
  label,
  active,
  done,
}: {
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <span className={active || done ? "text-gold-bright" : "text-fog/70"}>
      {label}
    </span>
  );
}
