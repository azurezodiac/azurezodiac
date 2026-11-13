"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CONCERNS,
  type ConcernId,
  buildConsultationMessage,
  emailHref,
  whatsappHref,
} from "@/lib/consultation";

type Step = 1 | 2 | 3;

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

const fieldClass =
  "w-full border border-line bg-ink/60 px-4 py-3 text-cream outline-none transition-colors duration-300 placeholder:text-fog/50 focus:border-gold";

export function BeginFlow() {
  const [step, setStep] = useState<Step>(1);
  const [concernId, setConcernId] = useState<ConcernId | null>(null);
  const [name, setName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<CreatedRequest | null>(null);
  const [duplicate, setDuplicate] = useState<DuplicateInfo | null>(null);

  const concern = CONCERNS.find((item) => item.id === concernId) ?? null;

  const message = useMemo(() => {
    if (!concern || !created) return "";
    return buildConsultationMessage({
      concernId: concern.id,
      concernTitle: concern.title,
      name: name.trim(),
      motherName: motherName.trim(),
      location: location.trim(),
      phone: phone.trim(),
      note,
      trackingNumber: created.trackingNumber,
    });
  }, [concern, created, name, motherName, location, phone, note]);

  const detailsReady =
    name.trim().length > 1 &&
    motherName.trim().length > 1 &&
    location.trim().length > 1 &&
    phone.replace(/\D/g, "").length >= 10;

  function createStaticFallback() {
    const phoneKey = phone.replace(/\D/g, "");
    const storageKey = `rs-open-${phoneKey}`;
    const existing = window.localStorage.getItem(storageKey);
    if (existing) {
      setDuplicate({
        trackingNumber: existing,
        status: "pending",
        statusNote:
          "A request is already pending for this number on this device. Contact admin to clear, or notify again on WhatsApp/email.",
      });
      setStep(3);
      return;
    }

    const token = Math.random().toString(16).slice(2, 8).toUpperCase();
    const trackingNumber = `RS-${new Date().getFullYear()}-${token}`;
    window.localStorage.setItem(storageKey, trackingNumber);
    setCreated({
      trackingNumber,
      status: "pending",
      statusNote:
        "Your reference is ready. Send it on WhatsApp or email so guidance can begin.",
    });
    setStep(3);
  }

  async function submitRequest() {
    if (!concern || !detailsReady || submitting) return;
    setSubmitting(true);
    setError("");
    setDuplicate(null);

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
          note,
        }),
      });

      // cPanel static hosting has no API — fall back to WhatsApp/email flow.
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
        setStep(3);
        return;
      }

      if (!response.ok || !data.request) {
        setError(data.message || data.error || "Could not create request.");
        return;
      }

      setCreated({
        trackingNumber: data.request.trackingNumber,
        status: data.request.status,
        statusNote: data.request.statusNote ?? "",
      });
      setStep(3);
    } catch {
      createStaticFallback();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-10 flex items-center gap-3 text-xs tracking-[0.18em] uppercase text-fog">
        <StepPill active={step === 1} done={step > 1} label="01 Concern" />
        <span className="h-px flex-1 bg-line" />
        <StepPill active={step === 2} done={step > 2} label="02 Details" />
        <span className="h-px flex-1 bg-line" />
        <StepPill active={step === 3} done={false} label="03 Send" />
      </div>

      {step === 1 && (
        <section className="space-y-8">
          <div>
            <p className="text-xs tracking-[0.22em] uppercase text-gold">
              Begin healing
            </p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-cream md:text-5xl">
              What are you facing?
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-fog">
              Choose the concern closest to your heart. Next we ask only what is
              needed for a private, respectful consultation.
            </p>
          </div>

          <div className="grid gap-3">
            {CONCERNS.map((item) => {
              const selected = concernId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setConcernId(item.id)}
                  className={`border px-5 py-5 text-left transition-colors duration-300 ${
                    selected
                      ? "border-gold bg-gold/10"
                      : "border-line bg-ink/40 hover:border-fog/40"
                  }`}
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

          <button
            type="button"
            disabled={!concernId}
            onClick={() => setStep(2)}
            className="bg-gold px-7 py-3.5 text-sm tracking-[0.14em] uppercase text-ink transition-colors duration-300 hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue
          </button>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-8">
          <div>
            <p className="text-xs tracking-[0.22em] uppercase text-gold">
              Your details
            </p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-cream md:text-5xl">
              So we may know you properly.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-fog">
              Concern selected:{" "}
              <span className="text-cream">{concern?.title}</span>
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-fog/80">
              Privacy: your name, mother&apos;s name, phone, and location are
              used only to understand and respond to your request.
            </p>
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-xs tracking-[0.16em] uppercase text-fog">
                Your name
              </span>
              <input
                className={fieldClass}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Full name"
                autoComplete="name"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs tracking-[0.16em] uppercase text-fog">
                Mother&apos;s name
              </span>
              <input
                className={fieldClass}
                value={motherName}
                onChange={(event) => setMotherName(event.target.value)}
                placeholder="Walida ka name"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs tracking-[0.16em] uppercase text-fog">
                Closest location
              </span>
              <input
                className={fieldClass}
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="City / area"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs tracking-[0.16em] uppercase text-fog">
                Your WhatsApp / mobile
              </span>
              <input
                className={fieldClass}
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+92 3xx xxx xxxx"
                inputMode="tel"
                autoComplete="tel"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs tracking-[0.16em] uppercase text-fog">
                Optional note
              </span>
              <textarea
                className={fieldClass}
                rows={4}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="A few honest lines, if you wish."
              />
            </label>
          </div>

          {error ? <p className="text-sm text-red-300">{error}</p> : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="border border-mist/25 px-7 py-3.5 text-sm tracking-[0.14em] uppercase text-mist transition-colors duration-300 hover:border-gold hover:text-gold-bright"
            >
              Back
            </button>
            <button
              type="button"
              disabled={!detailsReady || submitting}
              onClick={submitRequest}
              className="bg-gold px-7 py-3.5 text-sm tracking-[0.14em] uppercase text-ink transition-colors duration-300 hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? "Saving..." : "Create tracking request"}
            </button>
          </div>
        </section>
      )}

      {step === 3 && duplicate && (
        <section className="space-y-8">
          <div>
            <p className="text-xs tracking-[0.22em] uppercase text-gold">
              Already pending
            </p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-cream md:text-5xl">
              Request already pending
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-fog">
              This WhatsApp / mobile already has an open request. A new one
              cannot be created until the admin clears it.
            </p>
          </div>

          <div className="border border-gold/40 bg-gold/10 px-5 py-5">
            <p className="text-xs tracking-[0.16em] uppercase text-gold">
              Your tracking number
            </p>
            <p className="mt-2 font-display text-3xl text-cream">
              {duplicate.trackingNumber}
            </p>
            <p className="mt-4 text-sm text-fog">{duplicate.statusNote}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/track?id=${encodeURIComponent(duplicate.trackingNumber)}`}
              className="bg-gold px-7 py-3.5 text-sm tracking-[0.14em] uppercase text-ink transition-colors duration-300 hover:bg-gold-bright"
            >
              Check status
            </Link>
            <button
              type="button"
              onClick={() => {
                setStep(2);
                setDuplicate(null);
              }}
              className="border border-mist/25 px-7 py-3.5 text-sm tracking-[0.14em] uppercase text-mist"
            >
              Back
            </button>
          </div>
        </section>
      )}

      {step === 3 && created && concern && (
        <section className="space-y-8">
          <div>
            <p className="text-xs tracking-[0.22em] uppercase text-gold">
              Request created
            </p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-cream md:text-5xl">
              Your message is ready
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-fog">
              Keep this reference. Send the prepared message on WhatsApp or
              email — then wait for a calm, private reply.
            </p>
          </div>

          <div className="border border-gold/40 bg-gold/10 px-5 py-5">
            <p className="text-xs tracking-[0.16em] uppercase text-gold">
              Tracking number
            </p>
            <p className="mt-2 font-display text-3xl text-cream">
              {created.trackingNumber}
            </p>
            <p className="mt-4 text-sm text-fog">{created.statusNote}</p>
          </div>

          <pre className="overflow-x-auto whitespace-pre-wrap border border-line bg-ink/50 px-5 py-5 font-sans text-sm leading-relaxed text-mist">
            {message}
          </pre>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/track?id=${encodeURIComponent(created.trackingNumber)}`}
              className="border border-mist/25 px-7 py-3.5 text-sm tracking-[0.14em] uppercase text-mist transition-colors duration-300 hover:border-gold hover:text-gold-bright"
            >
              Track status
            </Link>
            <a
              href={whatsappHref(message)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold px-7 py-3.5 text-sm tracking-[0.14em] uppercase text-ink transition-colors duration-300 hover:bg-gold-bright"
            >
              Notify on WhatsApp
            </a>
            <a
              href={emailHref(message)}
              className="border border-gold/50 px-7 py-3.5 text-sm tracking-[0.14em] uppercase text-gold transition-colors duration-300 hover:border-gold-bright hover:text-gold-bright"
            >
              Notify by email
            </a>
          </div>
        </section>
      )}
    </div>
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
