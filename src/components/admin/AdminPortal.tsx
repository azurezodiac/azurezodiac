"use client";

import { useCallback, useEffect, useState } from "react";
import {
  STATUS_LABELS,
  STATUS_NOTES_DEFAULT,
  type ConsultationRequest,
  type RequestStatus,
} from "@/lib/types";

const statuses: RequestStatus[] = [
  "pending",
  "in_review",
  "active",
  "diagnosis_completed",
  "resolved",
  "cleared",
];

export function AdminPortal() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/requests");
      if (response.status === 401) {
        setAuthed(false);
        setRequests([]);
        return;
      }
      const data = (await response.json()) as { requests?: ConsultationRequest[] };
      setAuthed(true);
      setRequests(data.requests ?? []);
    } catch {
      setError("Could not load requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial session + queue fetch for the admin portal.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount fetch
    void loadRequests();
  }, [loadRequests]);

  async function login() {
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      setError("Invalid password.");
      return;
    }
    setPassword("");
    await loadRequests();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setRequests([]);
  }

  async function patchRequest(
    trackingNumber: string,
    patch: { status?: RequestStatus; statusNote?: string },
  ) {
    const response = await fetch("/api/admin/requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackingNumber, ...patch }),
    });
    if (!response.ok) {
      setError("Update failed.");
      return;
    }
    await loadRequests();
  }

  if (!authed) {
    return (
      <div className="mx-auto w-full max-w-md space-y-6">
        <div>
          <p className="text-xs tracking-[0.22em] uppercase text-gold">Admin</p>
          <h1 className="mt-4 font-display text-4xl text-cream">Sign in</h1>
          <p className="mt-3 text-sm text-fog">
            Manage consultation requests, status updates, and clears.
          </p>
        </div>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Admin password"
          className="w-full border border-line bg-ink/60 px-4 py-3 text-cream outline-none focus:border-gold"
          onKeyDown={(event) => {
            if (event.key === "Enter") void login();
          }}
        />
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <button
          type="button"
          onClick={() => void login()}
          className="bg-gold px-7 py-3.5 text-sm tracking-[0.14em] uppercase text-ink hover:bg-gold-bright"
        >
          Enter portal
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.22em] uppercase text-gold">Admin</p>
          <h1 className="mt-3 font-display text-4xl text-cream">
            Request portal
          </h1>
          <p className="mt-3 text-sm text-fog">
            Open requests stay locked for that phone until you clear them.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="border border-mist/25 px-5 py-2.5 text-xs tracking-[0.14em] uppercase text-mist"
        >
          Log out
        </button>
      </div>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      {loading ? <p className="text-fog">Loading...</p> : null}

      <div className="space-y-4">
        {requests.length === 0 && !loading ? (
          <p className="text-fog">No requests yet.</p>
        ) : null}
        {requests.map((request) => (
          <article
            key={request.id}
            className="border border-line bg-ink/40 px-5 py-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-2xl text-cream">
                  {request.trackingNumber}
                </p>
                <p className="mt-1 text-sm text-gold">
                  {STATUS_LABELS[request.status]}
                </p>
              </div>
              <p className="text-xs text-fog">
                {new Date(request.createdAt).toLocaleString()}
              </p>
            </div>

            <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
              <Item label="Name" value={request.name} />
              <Item label="Mother" value={request.motherName} />
              <Item label="Phone" value={request.phone} />
              <Item label="Location" value={request.location} />
              <Item label="Concern" value={request.concernTitle} />
              <Item label="Note" value={request.note || "—"} />
            </dl>

            <div className="mt-5 grid gap-3 md:grid-cols-[14rem_1fr_auto]">
              <select
                value={request.status}
                onChange={(event) =>
                  void patchRequest(request.trackingNumber, {
                    status: event.target.value as RequestStatus,
                  })
                }
                className="border border-line bg-ink px-3 py-2 text-cream outline-none"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
              <input
                defaultValue={request.statusNote}
                key={`${request.trackingNumber}-${request.updatedAt}`}
                onBlur={(event) => {
                  if (event.target.value !== request.statusNote) {
                    void patchRequest(request.trackingNumber, {
                      statusNote: event.target.value,
                    });
                  }
                }}
                className="border border-line bg-ink px-3 py-2 text-cream outline-none"
                placeholder="Status note shown to user"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    void patchRequest(request.trackingNumber, {
                      status: "diagnosis_completed",
                      statusNote:
                        STATUS_NOTES_DEFAULT.diagnosis_completed ??
                        "Diagnosis completed.",
                    })
                  }
                  className="border border-mist/30 px-4 py-2 text-xs tracking-[0.14em] uppercase text-mist hover:border-gold hover:text-gold-bright"
                >
                  Diagnosis done
                </button>
                <button
                  type="button"
                  onClick={() =>
                    void patchRequest(request.trackingNumber, {
                      status: "cleared",
                      statusNote:
                        "This request was cleared by admin. You may submit a new request.",
                    })
                  }
                  className="border border-gold/50 px-4 py-2 text-xs tracking-[0.14em] uppercase text-gold hover:border-gold-bright hover:text-gold-bright"
                >
                  Clear lock
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="uppercase tracking-[0.14em] text-fog/70">{label}</dt>
      <dd className="mt-1 text-cream">{value}</dd>
    </div>
  );
}
