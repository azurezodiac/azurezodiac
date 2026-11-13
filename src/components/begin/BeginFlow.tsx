"use client";

import { useMemo, useState } from "react";
import {
  CONCERNS,
  type ConcernId,
  buildConsultationMessage,
  emailHref,
  whatsappHref,
} from "@/lib/consultation";

type Step = 1 | 2 | 3;

const fieldClass =
  "w-full border border-line bg-ink/60 px-4 py-3 text-cream outline-none transition-colors duration-300 placeholder:text-fog/50 focus:border-gold";

export function BeginFlow() {
  const [step, setStep] = useState<Step>(1);
  const [concernId, setConcernId] = useState<ConcernId | null>(null);
  const [name, setName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");

  const concern = CONCERNS.find((item) => item.id === concernId) ?? null;

  const message = useMemo(() => {
    if (!concern) return "";
    return buildConsultationMessage({
      concernId: concern.id,
      concernTitle: concern.title,
      name: name.trim(),
      motherName: motherName.trim(),
      location: location.trim(),
      note,
    });
  }, [concern, name, motherName, location, note]);

  const detailsReady =
    name.trim().length > 1 &&
    motherName.trim().length > 1 &&
    location.trim().length > 1;

  function goToDetails() {
    if (!concernId) return;
    setStep(2);
  }

  function goToSend() {
    if (!detailsReady) return;
    setStep(3);
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
              Choose the concern closest to your heart. Next, we will ask only
              what is needed for a respectful consultation.
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
            onClick={goToDetails}
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
                autoComplete="address-level2"
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
              disabled={!detailsReady}
              onClick={goToSend}
              className="bg-gold px-7 py-3.5 text-sm tracking-[0.14em] uppercase text-ink transition-colors duration-300 hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-40"
            >
              Review &amp; send
            </button>
          </div>
        </section>
      )}

      {step === 3 && concern && (
        <section className="space-y-8">
          <div>
            <p className="text-xs tracking-[0.22em] uppercase text-gold">
              Send
            </p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-cream md:text-5xl">
              Your message is ready.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-fog">
              Choose WhatsApp or email. Your details open as a ready message —
              you only confirm send.
            </p>
          </div>

          <pre className="overflow-x-auto whitespace-pre-wrap border border-line bg-ink/50 px-5 py-5 font-sans text-sm leading-relaxed text-mist">
            {message}
          </pre>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="border border-mist/25 px-7 py-3.5 text-sm tracking-[0.14em] uppercase text-mist transition-colors duration-300 hover:border-gold hover:text-gold-bright"
            >
              Back
            </button>
            <a
              href={whatsappHref(message)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold px-7 py-3.5 text-sm tracking-[0.14em] uppercase text-ink transition-colors duration-300 hover:bg-gold-bright"
            >
              Send on WhatsApp
            </a>
            <a
              href={emailHref(message)}
              className="border border-gold/50 px-7 py-3.5 text-sm tracking-[0.14em] uppercase text-gold transition-colors duration-300 hover:border-gold-bright hover:text-gold-bright"
            >
              Send by email
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
    <span
      className={
        active || done ? "text-gold-bright" : "text-fog/70"
      }
    >
      {label}
    </span>
  );
}
