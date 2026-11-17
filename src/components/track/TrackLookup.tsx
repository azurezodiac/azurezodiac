"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/client-api";
import { STATUS_LABELS } from "@/lib/types";
import { useLang } from "@/lib/i18n";

type TrackResult = {
  trackingNumber: string;
  concernTitle: string;
  name: string;
  location: string;
  status: string;
  statusLabel: string;
  statusNote: string;
  createdAt: string;
  updatedAt: string;
};

export function TrackLookup() {
  const { t } = useLang();
  const searchParams = useSearchParams();
  const presetId = searchParams.get("id") ?? "";
  const [trackingNumber, setTrackingNumber] = useState(presetId);
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!presetId) return;
    void lookup(presetId);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- lookup on first preset only
  }, [presetId]);

  function fromLocalStorage(id: string): TrackResult | null {
    try {
      const raw = window.localStorage.getItem(`rs-req-${id}`);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<TrackResult>;
      if (!parsed.trackingNumber) return null;
      const status = parsed.status ?? "pending";
      return {
        trackingNumber: parsed.trackingNumber,
        concernTitle: parsed.concernTitle ?? "",
        name: parsed.name ?? "",
        location: parsed.location ?? "",
        status,
        statusLabel:
          t.track.statusLabels[status] ??
          STATUS_LABELS[status as keyof typeof STATUS_LABELS] ??
          status,
        statusNote: parsed.statusNote ?? "",
        createdAt: parsed.createdAt ?? new Date().toISOString(),
        updatedAt: parsed.updatedAt ?? new Date().toISOString(),
      };
    } catch {
      return null;
    }
  }

  async function lookup(value?: string) {
    const id = (value ?? trackingNumber).trim();
    if (!id) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch(
        apiUrl(`track/${encodeURIComponent(id)}`),
      );
      if (response.status === 404 || response.status === 405) {
        const local = fromLocalStorage(id);
        if (local) {
          setResult(local);
          return;
        }
        setError("Tracking number not found.");
        return;
      }
      const data = (await response.json()) as {
        error?: string;
        request?: TrackResult;
      };
      if (!response.ok || !data.request) {
        const local = fromLocalStorage(id);
        if (local) {
          setResult(local);
          return;
        }
        setError(data.error || "Tracking number not found.");
        return;
      }
      const status = data.request.status;
      setResult({
        ...data.request,
        statusLabel:
          t.track.statusLabels[status] ??
          data.request.statusLabel ??
          status,
      });
    } catch {
      const local = fromLocalStorage(id);
      if (local) {
        setResult(local);
        return;
      }
      setError("Unable to check status right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <div>
        <p className="text-xs tracking-[0.22em] uppercase text-gold">
          {t.track.eyebrow}
        </p>
        <h1 className="mt-4 font-display text-4xl leading-tight text-cream md:text-5xl">
          {t.track.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-fog">
          {t.track.intro}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={trackingNumber}
          onChange={(event) => setTrackingNumber(event.target.value)}
          placeholder={t.track.placeholder}
          className="w-full border border-line bg-ink/60 px-4 py-3 text-cream outline-none focus:border-gold"
        />
        <button
          type="button"
          onClick={() => void lookup()}
          disabled={loading}
          className="bg-gold px-7 py-3.5 text-sm tracking-[0.14em] uppercase text-ink hover:bg-gold-bright disabled:opacity-40"
        >
          {loading ? t.track.checking : t.track.check}
        </button>
      </div>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      {result ? (
        <div className="space-y-4 border border-line bg-ink/40 px-5 py-6">
          <p className="font-display text-3xl text-cream">
            {result.trackingNumber}
          </p>
          <p className="text-sm uppercase tracking-[0.16em] text-gold">
            {result.statusLabel}
          </p>
          <p className="text-base text-fog">{result.statusNote}</p>
          <dl className="grid gap-3 pt-2 text-sm text-fog md:grid-cols-2">
            <div>
              <dt className="uppercase tracking-[0.14em] text-fog/70">
                Concern
              </dt>
              <dd className="mt-1 text-cream">{result.concernTitle}</dd>
            </div>
            <div>
              <dt className="uppercase tracking-[0.14em] text-fog/70">Name</dt>
              <dd className="mt-1 text-cream">{result.name}</dd>
            </div>
            <div>
              <dt className="uppercase tracking-[0.14em] text-fog/70">
                Location
              </dt>
              <dd className="mt-1 text-cream">{result.location}</dd>
            </div>
            <div>
              <dt className="uppercase tracking-[0.14em] text-fog/70">
                Updated
              </dt>
              <dd className="mt-1 text-cream">
                {new Date(result.updatedAt).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>
      ) : null}
    </div>
  );
}
