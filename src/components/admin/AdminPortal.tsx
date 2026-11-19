"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiUrl } from "@/lib/client-api";
import {
  EMPTY_CMS,
  emptyLanding,
  type CmsCollection,
  type CmsFeature,
  type CmsLanding,
  type CmsLandingLocale,
  type CmsPost,
  type CmsPricingItem,
  type CmsPromotion,
  type CmsState,
} from "@/lib/cms-types";
import {
  STATUS_LABELS,
  STATUS_NOTES_DEFAULT,
  type ConsultationRequest,
  type RequestStatus,
} from "@/lib/types";

type Tab =
  | "overview"
  | "landing"
  | "leads"
  | "track"
  | "posts"
  | "features"
  | "promotions"
  | "pricing";

const statuses: RequestStatus[] = [
  "pending",
  "in_review",
  "active",
  "diagnosis_completed",
  "resolved",
  "cleared",
];

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "landing", label: "Landing" },
  { id: "leads", label: "Leads" },
  { id: "track", label: "Track" },
  { id: "posts", label: "Posts" },
  { id: "features", label: "Features" },
  { id: "promotions", label: "Promotions" },
  { id: "pricing", label: "Pricing" },
];

export function AdminPortal() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [apiMode, setApiMode] = useState<"live" | "offline" | "loading">(
    "loading",
  );
  const [tab, setTab] = useState<Tab>("overview");
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [cms, setCms] = useState<CmsState>(EMPTY_CMS);
  const [loading, setLoading] = useState(true);
  const [trackQuery, setTrackQuery] = useState("");

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [reqRes, cmsRes] = await Promise.all([
        fetch(apiUrl("admin/requests")),
        fetch(apiUrl("admin/cms")),
      ]);

      if (reqRes.status === 404 || cmsRes.status === 404) {
        setApiMode("offline");
        setAuthed(false);
        return;
      }

      if (reqRes.status === 401 || cmsRes.status === 401) {
        setApiMode("live");
        setAuthed(false);
        setRequests([]);
        setCms(EMPTY_CMS);
        return;
      }

      if (!reqRes.ok || !cmsRes.ok) {
        setError("Could not load admin data.");
        setApiMode("live");
        return;
      }

      const reqData = (await reqRes.json()) as {
        requests?: ConsultationRequest[];
      };
      const cmsData = (await cmsRes.json()) as { cms?: CmsState };
      setRequests(reqData.requests ?? []);
      const nextCms = cmsData.cms ?? EMPTY_CMS;
      setCms({
        ...EMPTY_CMS,
        ...nextCms,
        landing: nextCms.landing ?? emptyLanding(),
      });
      setAuthed(true);
      setApiMode("live");
    } catch {
      setApiMode("offline");
      setAuthed(false);
      setError("Admin API unreachable. Node hosting required for full portal.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount bootstrap
    void loadAll();
  }, [loadAll]);

  async function login() {
    setError("");
    let response: Response;
    try {
      response = await fetch(apiUrl("admin/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
    } catch {
      setApiMode("offline");
      setError(
        "API not reachable. Upload rs-api.php.txt into public_html, rename to rs-api.php, and add config.php.",
      );
      return;
    }
    if (response.status === 404 || response.status === 403) {
      setApiMode("offline");
      setError(
        "rs-api.php missing in public_html. Upload rs-api.php.txt → rename to rs-api.php.",
      );
      return;
    }
    if (response.status === 503) {
      setError(
        "config.php missing next to rs-api.php. Copy config.sample.php.txt → config.php and set admin_password.",
      );
      return;
    }
    if (response.status === 500) {
      setError(
        "Database connection failed. Check db_name / db_user / db_pass in config.php.",
      );
      return;
    }
    if (!response.ok) {
      setError(
        "Invalid password. Use admin_password from config.php (not MySQL db_pass).",
      );
      return;
    }
    setPassword("");
    await loadAll();
  }

  async function logout() {
    await fetch(apiUrl("admin/logout"), { method: "POST" });
    setAuthed(false);
    setRequests([]);
    setCms(EMPTY_CMS);
  }

  async function patchRequest(
    trackingNumber: string,
    patch: { status?: RequestStatus; statusNote?: string },
  ) {
    const response = await fetch(apiUrl("admin/requests"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackingNumber, ...patch }),
    });
    if (!response.ok) {
      setError("Lead update failed.");
      return;
    }
    await loadAll();
  }

  async function cmsAction(
    action: "create" | "update" | "delete" | "reset" | "updateLanding",
    collection?: CmsCollection,
    id?: string,
    item?: Record<string, unknown>,
  ) {
    const response = await fetch(apiUrl("admin/cms"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, collection, id, item }),
    });
    if (!response.ok) {
      setError("CMS update failed.");
      return;
    }
    const data = (await response.json()) as { cms?: CmsState };
    if (data.cms) {
      setCms({
        ...EMPTY_CMS,
        ...data.cms,
        landing: data.cms.landing ?? emptyLanding(),
      });
    }
  }

  const filteredTrack = useMemo(() => {
    const q = trackQuery.trim().toUpperCase();
    if (!q) return requests;
    return requests.filter(
      (r) =>
        r.trackingNumber.toUpperCase().includes(q) ||
        r.phone.includes(q) ||
        r.name.toUpperCase().includes(q),
    );
  }, [requests, trackQuery]);

  const openLeads = requests.filter((r) =>
    ["pending", "in_review", "active", "diagnosis_completed"].includes(r.status),
  ).length;

  if (apiMode === "offline") {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <h1 className="font-display text-4xl text-cream">Admin portal</h1>
        <p className="text-base leading-relaxed text-fog">
          <code className="text-gold">rs-api.php</code> is missing in{" "}
          <code className="text-gold">public_html</code>.
        </p>
        <ul className="space-y-2 text-sm text-fog">
          <li>1. Upload <code className="text-gold">rs-api.php.txt</code> into public_html → Rename to <code className="text-gold">rs-api.php</code></li>
          <li>2. Upload <code className="text-gold">config.sample.php.txt</code> → Rename to <code className="text-gold">config.php</code></li>
          <li>3. Edit config.php: MySQL details + <code className="text-gold">admin_password</code></li>
          <li>4. Upload <code className="text-gold">schema.sql</code> into public_html (optional)</li>
        </ul>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="mx-auto w-full max-w-md space-y-6">
        <h1 className="font-display text-4xl text-cream">Admin portal</h1>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Admin password"
          className="field-input"
          onKeyDown={(event) => {
            if (event.key === "Enter") void login();
          }}
        />
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <button type="button" onClick={() => void login()} className="btn-primary">
          Enter portal
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-3 font-display text-4xl text-cream">Control portal</h1>
          <p className="mt-3 max-w-xl text-sm text-fog">
            Landing hero copy, posts, features, promotions, pricing, leads, and
            track — saved via <code className="text-gold">/api</code> (JSON file
            locally, MySQL on cPanel / Node with{" "}
            <code className="text-gold">MYSQL_*</code>).
          </p>
        </div>
        <button type="button" onClick={() => void logout()} className="btn-ghost !py-2.5 !text-xs">
          Log out
        </button>
      </div>

      <nav className="flex flex-wrap gap-2 border-b border-line pb-3">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`px-3 py-2 text-xs tracking-[0.14em] uppercase transition-colors ${
              tab === item.id
                ? "bg-gold text-ink"
                : "border border-line text-fog hover:border-gold hover:text-gold-bright"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      {loading ? <p className="text-fog">Loading...</p> : null}

      {tab === "overview" && !loading ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-stagger>
          <Stat label="Open leads" value={String(openLeads)} />
          <Stat label="All leads" value={String(requests.length)} />
          <Stat label="Posts" value={String(cms.posts.length)} />
          <Stat label="Active promos" value={String(cms.promotions.filter((p) => p.active).length)} />
          <div className="surface-panel sm:col-span-2 lg:col-span-4 px-5 py-5">
            <p className="text-sm text-fog">
              Tip: edit Landing for homepage hero text, publish posts for the blog
              API, activate one promotion for the homepage banner, and keep pricing
              in sync with Hadiya amounts.
            </p>
            <button
              type="button"
              className="btn-secondary mt-4 !py-2 !text-xs"
              onClick={() => void cmsAction("reset")}
            >
              Reset CMS to seed content
            </button>
          </div>
        </section>
      ) : null}

      {tab === "landing" && !loading ? (
        <LandingPanel
          landing={cms.landing ?? emptyLanding()}
          onSave={(item) => void cmsAction("updateLanding", undefined, undefined, item)}
        />
      ) : null}

      {tab === "leads" && !loading ? (
        <LeadsPanel requests={requests} onPatch={patchRequest} />
      ) : null}

      {tab === "track" && !loading ? (
        <section className="space-y-4">
          <input
            className="field-input max-w-md"
            value={trackQuery}
            onChange={(e) => setTrackQuery(e.target.value)}
            placeholder="Search tracking #, phone, or name"
          />
          <LeadsPanel requests={filteredTrack} onPatch={patchRequest} compact />
        </section>
      ) : null}

      {tab === "posts" && !loading ? (
        <PostsPanel
          posts={cms.posts}
          onCreate={(item) => void cmsAction("create", "posts", undefined, item)}
          onUpdate={(id, item) => void cmsAction("update", "posts", id, item)}
          onDelete={(id) => void cmsAction("delete", "posts", id)}
        />
      ) : null}

      {tab === "features" && !loading ? (
        <FeaturesPanel
          features={cms.features}
          onCreate={(item) => void cmsAction("create", "features", undefined, item)}
          onUpdate={(id, item) => void cmsAction("update", "features", id, item)}
          onDelete={(id) => void cmsAction("delete", "features", id)}
        />
      ) : null}

      {tab === "promotions" && !loading ? (
        <PromosPanel
          promotions={cms.promotions}
          onCreate={(item) => void cmsAction("create", "promotions", undefined, item)}
          onUpdate={(id, item) => void cmsAction("update", "promotions", id, item)}
          onDelete={(id) => void cmsAction("delete", "promotions", id)}
        />
      ) : null}

      {tab === "pricing" && !loading ? (
        <PricingPanel
          pricing={cms.pricing}
          onCreate={(item) => void cmsAction("create", "pricing", undefined, item)}
          onUpdate={(id, item) => void cmsAction("update", "pricing", id, item)}
          onDelete={(id) => void cmsAction("delete", "pricing", id)}
        />
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-panel px-5 py-5">
      <p className="text-xs tracking-[0.16em] uppercase text-fog">{label}</p>
      <p className="mt-3 font-display text-4xl text-cream">{value}</p>
    </div>
  );
}

const LANDING_FIELDS: { key: keyof CmsLandingLocale; label: string; multiline?: boolean }[] = [
  { key: "headline", label: "Headline" },
  { key: "support", label: "Supporting sentence", multiline: true },
  { key: "ctaBegin", label: "Primary CTA (Begin)" },
  { key: "ctaServices", label: "Secondary CTA (Services)" },
  { key: "brandLine", label: "Brand line (under CTAs)" },
];

function LandingPanel({
  landing,
  onSave,
}: {
  landing: CmsLanding;
  onSave: (item: Record<string, unknown>) => void;
}) {
  const [en, setEn] = useState<CmsLandingLocale>(landing.en);
  const [ur, setUr] = useState<CmsLandingLocale>(landing.ur);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEn(landing.en);
    setUr(landing.ur);
    // Sync when server returns a new stamp after save / reset.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional stamp key
  }, [landing.updatedAt]);

  function updateLocale(
    locale: "en" | "ur",
    key: keyof CmsLandingLocale,
    value: string,
  ) {
    if (locale === "en") setEn((prev) => ({ ...prev, [key]: value }));
    else setUr((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="space-y-6">
      <div className="surface-panel space-y-3 px-5 py-5">
        <h2 className="font-display text-2xl text-cream">Homepage hero</h2>
        <p className="text-sm text-fog">
          Controls the first viewport on redeemysoul.com. Empty fields fall back
          to the built-in English / Urdu defaults. Brand name “Redeemysoul” stays
          fixed in the layout.
        </p>
        {landing.updatedAt ? (
          <p className="text-xs text-fog/70">
            Last saved {new Date(landing.updatedAt).toLocaleString()}
          </p>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {(["en", "ur"] as const).map((locale) => {
          const values = locale === "en" ? en : ur;
          return (
            <section key={locale} className="surface-panel space-y-4 px-5 py-5">
              <h3 className="font-display text-xl text-cream">
                {locale === "en" ? "English" : "Urdu"}
              </h3>
              {LANDING_FIELDS.map((field) =>
                field.multiline ? (
                  <label key={field.key} className="block space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.14em] text-fog/70">
                      {field.label}
                    </span>
                    <textarea
                      className="field-input"
                      rows={3}
                      dir={locale === "ur" ? "rtl" : "ltr"}
                      value={values[field.key]}
                      onChange={(e) =>
                        updateLocale(locale, field.key, e.target.value)
                      }
                    />
                  </label>
                ) : (
                  <label key={field.key} className="block space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.14em] text-fog/70">
                      {field.label}
                    </span>
                    <input
                      className="field-input"
                      dir={locale === "ur" ? "rtl" : "ltr"}
                      value={values[field.key]}
                      onChange={(e) =>
                        updateLocale(locale, field.key, e.target.value)
                      }
                    />
                  </label>
                ),
              )}
            </section>
          );
        })}
      </div>

      <button
        type="button"
        className="btn-primary"
        disabled={saving}
        onClick={() => {
          setSaving(true);
          onSave({ en, ur });
          window.setTimeout(() => setSaving(false), 400);
        }}
      >
        {saving ? "Saving…" : "Save landing copy"}
      </button>
    </div>
  );
}

function LeadsPanel({
  requests,
  onPatch,
  compact,
}: {
  requests: ConsultationRequest[];
  onPatch: (
    trackingNumber: string,
    patch: { status?: RequestStatus; statusNote?: string },
  ) => void;
  compact?: boolean;
}) {
  if (requests.length === 0) {
    return <p className="text-fog">No leads found.</p>;
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <article key={request.id} className="surface-panel px-5 py-5">
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
            {!compact ? <Item label="Note" value={request.note || "—"} /> : null}
          </dl>

          <div className="mt-5 grid gap-3 md:grid-cols-[14rem_1fr_auto]">
            <select
              value={request.status}
              onChange={(event) =>
                onPatch(request.trackingNumber, {
                  status: event.target.value as RequestStatus,
                })
              }
              className="field-input"
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
                  onPatch(request.trackingNumber, {
                    statusNote: event.target.value,
                  });
                }
              }}
              className="field-input"
              placeholder="Status note shown to user"
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  onPatch(request.trackingNumber, {
                    status: "diagnosis_completed",
                    statusNote:
                      STATUS_NOTES_DEFAULT.diagnosis_completed ??
                      "Diagnosis completed.",
                  })
                }
                className="btn-ghost !px-4 !py-2 !text-xs"
              >
                Diagnosis done
              </button>
              <button
                type="button"
                onClick={() =>
                  onPatch(request.trackingNumber, {
                    status: "cleared",
                    statusNote:
                      "This request was cleared by admin. You may submit a new request.",
                  })
                }
                className="btn-secondary !px-4 !py-2 !text-xs"
              >
                Clear lock
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function PostsPanel({
  posts,
  onCreate,
  onUpdate,
  onDelete,
}: {
  posts: CmsPost[];
  onCreate: (item: Record<string, unknown>) => void;
  onUpdate: (id: string, item: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
}) {
  const [draft, setDraft] = useState({
    title: "",
    slug: "",
    excerpt: "",
    body: "",
    published: true,
  });

  return (
    <div className="space-y-8">
      <form
        className="surface-panel space-y-4 px-5 py-5"
        onSubmit={(event) => {
          event.preventDefault();
          onCreate(draft);
          setDraft({ title: "", slug: "", excerpt: "", body: "", published: true });
        }}
      >
        <h2 className="font-display text-2xl text-cream">New post</h2>
        <input
          className="field-input"
          placeholder="Title"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          required
        />
        <input
          className="field-input"
          placeholder="slug-like-this"
          value={draft.slug}
          onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
        />
        <input
          className="field-input"
          placeholder="Short excerpt"
          value={draft.excerpt}
          onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
        />
        <textarea
          className="field-input"
          rows={6}
          placeholder="Body (markdown-ish headings ok)"
          value={draft.body}
          onChange={(e) => setDraft({ ...draft, body: e.target.value })}
        />
        <label className="flex items-center gap-2 text-sm text-fog">
          <input
            type="checkbox"
            checked={draft.published}
            onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
          />
          Published
        </label>
        <button type="submit" className="btn-primary">
          Add post
        </button>
      </form>

      <div className="space-y-4">
        {posts.map((post) => (
          <article key={post.id} className="surface-panel space-y-3 px-5 py-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-xl text-cream">{post.title}</h3>
              <span className="text-xs text-gold">
                {post.published ? "Published" : "Draft"} · /blog/{post.slug}
              </span>
            </div>
            <textarea
              className="field-input"
              rows={4}
              defaultValue={post.body}
              key={`${post.id}-body-${post.updatedAt}`}
              onBlur={(e) => {
                if (e.target.value !== post.body) {
                  onUpdate(post.id, { body: e.target.value });
                }
              }}
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-ghost !py-2 !text-xs"
                onClick={() =>
                  onUpdate(post.id, { published: !post.published })
                }
              >
                {post.published ? "Unpublish" : "Publish"}
              </button>
              <button
                type="button"
                className="btn-ghost !py-2 !text-xs"
                onClick={() => onDelete(post.id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function FeaturesPanel({
  features,
  onCreate,
  onUpdate,
  onDelete,
}: {
  features: CmsFeature[];
  onCreate: (item: Record<string, unknown>) => void;
  onUpdate: (id: string, item: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  return (
    <div className="space-y-6">
      <form
        className="surface-panel space-y-3 px-5 py-5"
        onSubmit={(e) => {
          e.preventDefault();
          onCreate({ title, body, published: true });
          setTitle("");
          setBody("");
        }}
      >
        <h2 className="font-display text-2xl text-cream">Add feature</h2>
        <input
          className="field-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Feature title"
          required
        />
        <textarea
          className="field-input"
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Short description"
        />
        <button type="submit" className="btn-primary">
          Save feature
        </button>
      </form>
      {features
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((feature) => (
          <article key={feature.id} className="surface-panel space-y-3 px-5 py-5">
            <input
              className="field-input"
              defaultValue={feature.title}
              key={`${feature.id}-t-${feature.updatedAt}`}
              onBlur={(e) => {
                if (e.target.value !== feature.title) {
                  onUpdate(feature.id, { title: e.target.value });
                }
              }}
            />
            <textarea
              className="field-input"
              rows={3}
              defaultValue={feature.body}
              key={`${feature.id}-b-${feature.updatedAt}`}
              onBlur={(e) => {
                if (e.target.value !== feature.body) {
                  onUpdate(feature.id, { body: e.target.value });
                }
              }}
            />
            <div className="flex gap-2">
              <button
                type="button"
                className="btn-ghost !py-2 !text-xs"
                onClick={() =>
                  onUpdate(feature.id, { published: !feature.published })
                }
              >
                {feature.published ? "Hide" : "Show"}
              </button>
              <button
                type="button"
                className="btn-ghost !py-2 !text-xs"
                onClick={() => onDelete(feature.id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
    </div>
  );
}

function PromosPanel({
  promotions,
  onCreate,
  onUpdate,
  onDelete,
}: {
  promotions: CmsPromotion[];
  onCreate: (item: Record<string, unknown>) => void;
  onUpdate: (id: string, item: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
}) {
  const [draft, setDraft] = useState({
    title: "",
    body: "",
    ctaLabel: "Begin healing",
    ctaHref: "/begin",
    active: true,
  });

  return (
    <div className="space-y-6">
      <form
        className="surface-panel space-y-3 px-5 py-5"
        onSubmit={(e) => {
          e.preventDefault();
          onCreate(draft);
          setDraft({
            title: "",
            body: "",
            ctaLabel: "Begin healing",
            ctaHref: "/begin",
            active: true,
          });
        }}
      >
        <h2 className="font-display text-2xl text-cream">New promotion</h2>
        <input
          className="field-input"
          placeholder="Title"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          required
        />
        <textarea
          className="field-input"
          rows={3}
          placeholder="Promo text"
          value={draft.body}
          onChange={(e) => setDraft({ ...draft, body: e.target.value })}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            className="field-input"
            placeholder="CTA label"
            value={draft.ctaLabel}
            onChange={(e) => setDraft({ ...draft, ctaLabel: e.target.value })}
          />
          <input
            className="field-input"
            placeholder="/begin"
            value={draft.ctaHref}
            onChange={(e) => setDraft({ ...draft, ctaHref: e.target.value })}
          />
        </div>
        <button type="submit" className="btn-primary">
          Add promotion
        </button>
      </form>

      {promotions.map((promo) => (
        <article key={promo.id} className="surface-panel space-y-3 px-5 py-5">
          <p className="font-display text-xl text-cream">{promo.title}</p>
          <p className="text-sm text-fog">{promo.body}</p>
          <p className="text-xs text-gold">
            {promo.active ? "Active on site" : "Inactive"} · {promo.ctaLabel} →{" "}
            {promo.ctaHref}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn-ghost !py-2 !text-xs"
              onClick={() => onUpdate(promo.id, { active: !promo.active })}
            >
              {promo.active ? "Deactivate" : "Activate"}
            </button>
            <button
              type="button"
              className="btn-ghost !py-2 !text-xs"
              onClick={() => onDelete(promo.id)}
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function PricingPanel({
  pricing,
  onCreate,
  onUpdate,
  onDelete,
}: {
  pricing: CmsPricingItem[];
  onCreate: (item: Record<string, unknown>) => void;
  onUpdate: (id: string, item: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
}) {
  const [draft, setDraft] = useState({
    label: "",
    amount: "",
    method: "",
    note: "",
    published: true,
  });

  return (
    <div className="space-y-6">
      <form
        className="surface-panel space-y-3 px-5 py-5"
        onSubmit={(e) => {
          e.preventDefault();
          onCreate(draft);
          setDraft({
            label: "",
            amount: "",
            method: "",
            note: "",
            published: true,
          });
        }}
      >
        <h2 className="font-display text-2xl text-cream">Add pricing row</h2>
        <input
          className="field-input"
          placeholder="Label"
          value={draft.label}
          onChange={(e) => setDraft({ ...draft, label: e.target.value })}
          required
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            className="field-input"
            placeholder="Amount"
            value={draft.amount}
            onChange={(e) => setDraft({ ...draft, amount: e.target.value })}
          />
          <input
            className="field-input"
            placeholder="Method / account"
            value={draft.method}
            onChange={(e) => setDraft({ ...draft, method: e.target.value })}
          />
        </div>
        <input
          className="field-input"
          placeholder="Note"
          value={draft.note}
          onChange={(e) => setDraft({ ...draft, note: e.target.value })}
        />
        <button type="submit" className="btn-primary">
          Save pricing
        </button>
      </form>

      {pricing
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((row) => (
          <article key={row.id} className="surface-panel space-y-3 px-5 py-5">
            <p className="font-display text-xl text-cream">{row.label}</p>
            <p className="text-gold">{row.amount}</p>
            <p className="break-all text-sm text-fog">{row.method}</p>
            <p className="text-sm text-fog/80">{row.note}</p>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn-ghost !py-2 !text-xs"
                onClick={() =>
                  onUpdate(row.id, { published: !row.published })
                }
              >
                {row.published ? "Unpublish" : "Publish"}
              </button>
              <button
                type="button"
                className="btn-ghost !py-2 !text-xs"
                onClick={() => onDelete(row.id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.14em] text-fog/70">
        {label}
      </dt>
      <dd className="mt-1 text-cream">{value}</dd>
    </div>
  );
}
