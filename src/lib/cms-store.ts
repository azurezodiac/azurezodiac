import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type { QueryResultRow } from "pg";
import { BLOG_POSTS } from "@/lib/blog";
import {
  EMPTY_CMS,
  type CmsCollection,
  type CmsFeature,
  type CmsPost,
  type CmsPricingItem,
  type CmsPromotion,
  type CmsState,
} from "@/lib/cms-types";
import { HADIYA } from "@/lib/consultation";
import { getDb } from "@/lib/db";

const DATA_DIR = path.join(
  process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
    ? "/tmp"
    : process.cwd(),
  "redeemysoul-data",
);
const CMS_FILE = path.join(DATA_DIR, "cms.json");

function nowIso(): string {
  return new Date().toISOString();
}

function newId(): string {
  return randomBytes(6).toString("hex");
}

function seedState(): CmsState {
  const stamped = nowIso();
  return {
    posts: BLOG_POSTS.map((post) => ({
      id: newId(),
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      body: post.sections.map((s) => `## ${s.heading}\n\n${s.body}`).join("\n\n"),
      published: true,
      publishedAt: post.publishedAt,
      updatedAt: stamped,
    })),
    features: [
      {
        id: newId(),
        title: "Private Islamic consultation",
        body: "Online-first guidance with Spiritual Healing Shazli — discreet, ruqyah-centered, and respectful.",
        order: 1,
        published: true,
        updatedAt: stamped,
      },
      {
        id: newId(),
        title: "Hadiya for diagnosis review",
        body: `Pakistan ${HADIYA.pakistan.amountLabel} · International ${HADIYA.international.amountLabel} for first spiritual diagnosis only.`,
        order: 2,
        published: true,
        updatedAt: stamped,
      },
      {
        id: newId(),
        title: "Baldia office by appointment",
        body: "Ittehad Town office visits after the first message — preferred day/time collected in Begin flow.",
        order: 3,
        published: true,
        updatedAt: stamped,
      },
    ],
    promotions: [
      {
        id: newId(),
        title: "Begin your private consultation",
        body: "Share your concern online. Hadiya covers the first spiritual diagnosis review only.",
        ctaLabel: "Begin healing",
        ctaHref: "/begin",
        active: true,
        updatedAt: stamped,
      },
    ],
    pricing: [
      {
        id: newId(),
        label: "Pakistan — diagnosis Hadiya",
        amount: HADIYA.pakistan.amountLabel,
        method: `${HADIYA.pakistan.method} ${HADIYA.pakistan.account}`,
        note: "Initial spiritual diagnosis only. Not a medical fee.",
        order: 1,
        published: true,
        updatedAt: stamped,
      },
      {
        id: newId(),
        label: "International — diagnosis Hadiya",
        amount: HADIYA.international.amountLabel,
        method: `${HADIYA.international.method} ${HADIYA.international.account}`,
        note: "For UK/UAE diaspora and overseas seekers. Diagnosis review only.",
        order: 2,
        published: true,
        updatedAt: stamped,
      },
    ],
  };
}

function rowPost(row: QueryResultRow): CmsPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    body: row.body ?? "",
    published: Boolean(row.published),
    publishedAt: row.published_at,
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

function rowFeature(row: QueryResultRow): CmsFeature {
  return {
    id: row.id,
    title: row.title,
    body: row.body ?? "",
    order: Number(row.sort_order) || 0,
    published: Boolean(row.published),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

function rowPromo(row: QueryResultRow): CmsPromotion {
  return {
    id: row.id,
    title: row.title,
    body: row.body ?? "",
    ctaLabel: row.cta_label ?? "Begin",
    ctaHref: row.cta_href ?? "/begin",
    active: Boolean(row.active),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

function rowPricing(row: QueryResultRow): CmsPricingItem {
  return {
    id: row.id,
    label: row.label,
    amount: row.amount ?? "",
    method: row.method ?? "",
    note: row.note ?? "",
    order: Number(row.sort_order) || 0,
    published: Boolean(row.published),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

async function ensureCmsTables(): Promise<void> {
  const database = getDb();
  if (!database) return;
  const sql = await fs.readFile(
    path.join(process.cwd(), "migrations", "002_cms.sql"),
    "utf8",
  );
  await database.query(sql);
}

async function readCmsFromDb(): Promise<CmsState> {
  const database = getDb();
  if (!database) throw new Error("No database");
  await ensureCmsTables();

  const [posts, features, promotions, pricing] = await Promise.all([
    database.query(`SELECT * FROM cms_posts ORDER BY published_at DESC`),
    database.query(`SELECT * FROM cms_features ORDER BY sort_order ASC`),
    database.query(`SELECT * FROM cms_promotions ORDER BY updated_at DESC`),
    database.query(`SELECT * FROM cms_pricing ORDER BY sort_order ASC`),
  ]);

  const state: CmsState = {
    posts: posts.rows.map(rowPost),
    features: features.rows.map(rowFeature),
    promotions: promotions.rows.map(rowPromo),
    pricing: pricing.rows.map(rowPricing),
  };

  const empty =
    state.posts.length === 0 &&
    state.features.length === 0 &&
    state.promotions.length === 0 &&
    state.pricing.length === 0;

  if (empty) {
    return writeSeedToDb();
  }
  return state;
}

async function writeSeedToDb(): Promise<CmsState> {
  const database = getDb();
  if (!database) throw new Error("No database");
  await ensureCmsTables();
  const seeded = seedState();

  await database.query("BEGIN");
  try {
    await database.query("DELETE FROM cms_posts");
    await database.query("DELETE FROM cms_features");
    await database.query("DELETE FROM cms_promotions");
    await database.query("DELETE FROM cms_pricing");

    for (const post of seeded.posts) {
      await database.query(
        `INSERT INTO cms_posts
         (id, slug, title, excerpt, body, published, published_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          post.id,
          post.slug,
          post.title,
          post.excerpt,
          post.body,
          post.published,
          post.publishedAt,
          post.updatedAt,
        ],
      );
    }
    for (const feature of seeded.features) {
      await database.query(
        `INSERT INTO cms_features
         (id, title, body, sort_order, published, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [
          feature.id,
          feature.title,
          feature.body,
          feature.order,
          feature.published,
          feature.updatedAt,
        ],
      );
    }
    for (const promo of seeded.promotions) {
      await database.query(
        `INSERT INTO cms_promotions
         (id, title, body, cta_label, cta_href, active, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [
          promo.id,
          promo.title,
          promo.body,
          promo.ctaLabel,
          promo.ctaHref,
          promo.active,
          promo.updatedAt,
        ],
      );
    }
    for (const row of seeded.pricing) {
      await database.query(
        `INSERT INTO cms_pricing
         (id, label, amount, method, note, sort_order, published, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          row.id,
          row.label,
          row.amount,
          row.method,
          row.note,
          row.order,
          row.published,
          row.updatedAt,
        ],
      );
    }
    await database.query("COMMIT");
  } catch (error) {
    await database.query("ROLLBACK");
    throw error;
  }

  return seeded;
}

async function readCmsFromFile(): Promise<CmsState> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(CMS_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<CmsState>;
    return {
      posts: Array.isArray(parsed.posts) ? parsed.posts : [],
      features: Array.isArray(parsed.features) ? parsed.features : [],
      promotions: Array.isArray(parsed.promotions) ? parsed.promotions : [],
      pricing: Array.isArray(parsed.pricing) ? parsed.pricing : [],
    };
  } catch {
    const seeded = seedState();
    await fs.writeFile(CMS_FILE, JSON.stringify(seeded, null, 2));
    return seeded;
  }
}

async function writeCmsFile(state: CmsState): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(CMS_FILE, JSON.stringify(state, null, 2));
}

async function readCms(): Promise<CmsState> {
  if (getDb()) return readCmsFromDb();
  return readCmsFromFile();
}

export async function getCmsState(): Promise<CmsState> {
  return readCms();
}

export async function getPublicCms(): Promise<{
  posts: CmsPost[];
  features: CmsFeature[];
  promotions: CmsPromotion[];
  pricing: CmsPricingItem[];
}> {
  const state = await readCms();
  return {
    posts: state.posts
      .filter((p) => p.published)
      .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1)),
    features: state.features
      .filter((f) => f.published)
      .sort((a, b) => a.order - b.order),
    promotions: state.promotions.filter((p) => p.active),
    pricing: state.pricing
      .filter((p) => p.published)
      .sort((a, b) => a.order - b.order),
  };
}

export async function createCmsItem(
  collection: CmsCollection,
  input: Record<string, unknown>,
): Promise<CmsState> {
  const database = getDb();
  const stamped = nowIso();

  if (database) {
    await ensureCmsTables();
    if (collection === "posts") {
      const slug =
        String(input.slug || "")
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9-]+/g, "-")
          .replace(/^-|-$/g, "") || `post-${newId()}`;
      await database.query(
        `INSERT INTO cms_posts
         (id, slug, title, excerpt, body, published, published_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          newId(),
          slug,
          String(input.title || "Untitled").trim(),
          String(input.excerpt || "").trim(),
          String(input.body || "").trim(),
          Boolean(input.published),
          String(input.publishedAt || stamped.slice(0, 10)),
          stamped,
        ],
      );
    } else if (collection === "features") {
      await database.query(
        `INSERT INTO cms_features
         (id, title, body, sort_order, published, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [
          newId(),
          String(input.title || "Feature").trim(),
          String(input.body || "").trim(),
          Number(input.order) || 0,
          input.published !== false,
          stamped,
        ],
      );
    } else if (collection === "promotions") {
      await database.query(
        `INSERT INTO cms_promotions
         (id, title, body, cta_label, cta_href, active, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [
          newId(),
          String(input.title || "Promotion").trim(),
          String(input.body || "").trim(),
          String(input.ctaLabel || "Begin").trim(),
          String(input.ctaHref || "/begin").trim(),
          input.active !== false,
          stamped,
        ],
      );
    } else {
      await database.query(
        `INSERT INTO cms_pricing
         (id, label, amount, method, note, sort_order, published, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          newId(),
          String(input.label || "Plan").trim(),
          String(input.amount || "").trim(),
          String(input.method || "").trim(),
          String(input.note || "").trim(),
          Number(input.order) || 0,
          input.published !== false,
          stamped,
        ],
      );
    }
    return readCmsFromDb();
  }

  const state = await readCmsFromFile();
  if (collection === "posts") {
    const slug = String(input.slug || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-|-$/g, "");
    state.posts.unshift({
      id: newId(),
      slug: slug || `post-${newId()}`,
      title: String(input.title || "Untitled").trim(),
      excerpt: String(input.excerpt || "").trim(),
      body: String(input.body || "").trim(),
      published: Boolean(input.published),
      publishedAt: String(input.publishedAt || stamped.slice(0, 10)),
      updatedAt: stamped,
    });
  } else if (collection === "features") {
    state.features.push({
      id: newId(),
      title: String(input.title || "Feature").trim(),
      body: String(input.body || "").trim(),
      order: Number(input.order) || state.features.length + 1,
      published: input.published !== false,
      updatedAt: stamped,
    });
  } else if (collection === "promotions") {
    state.promotions.unshift({
      id: newId(),
      title: String(input.title || "Promotion").trim(),
      body: String(input.body || "").trim(),
      ctaLabel: String(input.ctaLabel || "Begin").trim(),
      ctaHref: String(input.ctaHref || "/begin").trim(),
      active: input.active !== false,
      updatedAt: stamped,
    });
  } else {
    state.pricing.push({
      id: newId(),
      label: String(input.label || "Plan").trim(),
      amount: String(input.amount || "").trim(),
      method: String(input.method || "").trim(),
      note: String(input.note || "").trim(),
      order: Number(input.order) || state.pricing.length + 1,
      published: input.published !== false,
      updatedAt: stamped,
    });
  }
  await writeCmsFile(state);
  return state;
}

export async function updateCmsItem(
  collection: CmsCollection,
  id: string,
  patch: Record<string, unknown>,
): Promise<CmsState | null> {
  const database = getDb();
  const stamped = nowIso();

  if (database) {
    await ensureCmsTables();
    if (collection === "posts") {
      const current = await database.query(
        `SELECT * FROM cms_posts WHERE id = $1`,
        [id],
      );
      if (!current.rows[0]) return null;
      const row = rowPost(current.rows[0]);
      await database.query(
        `UPDATE cms_posts SET
          slug = $1, title = $2, excerpt = $3, body = $4,
          published = $5, published_at = $6, updated_at = $7
         WHERE id = $8`,
        [
          patch.slug !== undefined
            ? String(patch.slug)
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9-]+/g, "-")
            : row.slug,
          patch.title !== undefined ? String(patch.title).trim() : row.title,
          patch.excerpt !== undefined
            ? String(patch.excerpt).trim()
            : row.excerpt,
          patch.body !== undefined ? String(patch.body) : row.body,
          patch.published !== undefined
            ? Boolean(patch.published)
            : row.published,
          patch.publishedAt !== undefined
            ? String(patch.publishedAt)
            : row.publishedAt,
          stamped,
          id,
        ],
      );
    } else if (collection === "features") {
      const current = await database.query(
        `SELECT * FROM cms_features WHERE id = $1`,
        [id],
      );
      if (!current.rows[0]) return null;
      const row = rowFeature(current.rows[0]);
      await database.query(
        `UPDATE cms_features SET
          title = $1, body = $2, sort_order = $3, published = $4, updated_at = $5
         WHERE id = $6`,
        [
          patch.title !== undefined ? String(patch.title).trim() : row.title,
          patch.body !== undefined ? String(patch.body).trim() : row.body,
          patch.order !== undefined ? Number(patch.order) : row.order,
          patch.published !== undefined
            ? Boolean(patch.published)
            : row.published,
          stamped,
          id,
        ],
      );
    } else if (collection === "promotions") {
      const current = await database.query(
        `SELECT * FROM cms_promotions WHERE id = $1`,
        [id],
      );
      if (!current.rows[0]) return null;
      const row = rowPromo(current.rows[0]);
      await database.query(
        `UPDATE cms_promotions SET
          title = $1, body = $2, cta_label = $3, cta_href = $4, active = $5, updated_at = $6
         WHERE id = $7`,
        [
          patch.title !== undefined ? String(patch.title).trim() : row.title,
          patch.body !== undefined ? String(patch.body).trim() : row.body,
          patch.ctaLabel !== undefined
            ? String(patch.ctaLabel).trim()
            : row.ctaLabel,
          patch.ctaHref !== undefined
            ? String(patch.ctaHref).trim()
            : row.ctaHref,
          patch.active !== undefined ? Boolean(patch.active) : row.active,
          stamped,
          id,
        ],
      );
    } else {
      const current = await database.query(
        `SELECT * FROM cms_pricing WHERE id = $1`,
        [id],
      );
      if (!current.rows[0]) return null;
      const row = rowPricing(current.rows[0]);
      await database.query(
        `UPDATE cms_pricing SET
          label = $1, amount = $2, method = $3, note = $4,
          sort_order = $5, published = $6, updated_at = $7
         WHERE id = $8`,
        [
          patch.label !== undefined ? String(patch.label).trim() : row.label,
          patch.amount !== undefined ? String(patch.amount).trim() : row.amount,
          patch.method !== undefined ? String(patch.method).trim() : row.method,
          patch.note !== undefined ? String(patch.note).trim() : row.note,
          patch.order !== undefined ? Number(patch.order) : row.order,
          patch.published !== undefined
            ? Boolean(patch.published)
            : row.published,
          stamped,
          id,
        ],
      );
    }
    return readCmsFromDb();
  }

  const state = await readCmsFromFile();
  const before = JSON.stringify(state[collection]);
  // Reuse prior file-path update logic via create/update pattern
  if (collection === "posts") {
    const index = state.posts.findIndex((item) => item.id === id);
    if (index < 0) return null;
    const current = state.posts[index];
    state.posts[index] = {
      ...current,
      slug:
        patch.slug !== undefined
          ? String(patch.slug)
              .trim()
              .toLowerCase()
              .replace(/[^a-z0-9-]+/g, "-")
          : current.slug,
      title:
        patch.title !== undefined ? String(patch.title).trim() : current.title,
      excerpt:
        patch.excerpt !== undefined
          ? String(patch.excerpt).trim()
          : current.excerpt,
      body: patch.body !== undefined ? String(patch.body) : current.body,
      published:
        patch.published !== undefined
          ? Boolean(patch.published)
          : current.published,
      publishedAt:
        patch.publishedAt !== undefined
          ? String(patch.publishedAt)
          : current.publishedAt,
      updatedAt: stamped,
    };
  } else if (collection === "features") {
    const index = state.features.findIndex((item) => item.id === id);
    if (index < 0) return null;
    const current = state.features[index];
    state.features[index] = {
      ...current,
      title:
        patch.title !== undefined ? String(patch.title).trim() : current.title,
      body: patch.body !== undefined ? String(patch.body).trim() : current.body,
      order: patch.order !== undefined ? Number(patch.order) : current.order,
      published:
        patch.published !== undefined
          ? Boolean(patch.published)
          : current.published,
      updatedAt: stamped,
    };
  } else if (collection === "promotions") {
    const index = state.promotions.findIndex((item) => item.id === id);
    if (index < 0) return null;
    const current = state.promotions[index];
    state.promotions[index] = {
      ...current,
      title:
        patch.title !== undefined ? String(patch.title).trim() : current.title,
      body: patch.body !== undefined ? String(patch.body).trim() : current.body,
      ctaLabel:
        patch.ctaLabel !== undefined
          ? String(patch.ctaLabel).trim()
          : current.ctaLabel,
      ctaHref:
        patch.ctaHref !== undefined
          ? String(patch.ctaHref).trim()
          : current.ctaHref,
      active:
        patch.active !== undefined ? Boolean(patch.active) : current.active,
      updatedAt: stamped,
    };
  } else {
    const index = state.pricing.findIndex((item) => item.id === id);
    if (index < 0) return null;
    const current = state.pricing[index];
    state.pricing[index] = {
      ...current,
      label:
        patch.label !== undefined ? String(patch.label).trim() : current.label,
      amount:
        patch.amount !== undefined
          ? String(patch.amount).trim()
          : current.amount,
      method:
        patch.method !== undefined
          ? String(patch.method).trim()
          : current.method,
      note: patch.note !== undefined ? String(patch.note).trim() : current.note,
      order: patch.order !== undefined ? Number(patch.order) : current.order,
      published:
        patch.published !== undefined
          ? Boolean(patch.published)
          : current.published,
      updatedAt: stamped,
    };
  }
  if (JSON.stringify(state[collection]) === before) return null;
  await writeCmsFile(state);
  return state;
}

export async function deleteCmsItem(
  collection: CmsCollection,
  id: string,
): Promise<CmsState | null> {
  const database = getDb();
  if (database) {
    await ensureCmsTables();
    const table =
      collection === "posts"
        ? "cms_posts"
        : collection === "features"
          ? "cms_features"
          : collection === "promotions"
            ? "cms_promotions"
            : "cms_pricing";
    const result = await database.query(
      `DELETE FROM ${table} WHERE id = $1 RETURNING id`,
      [id],
    );
    if (result.rowCount === 0) return null;
    return readCmsFromDb();
  }

  const state = await readCmsFromFile();
  const before = state[collection].length;
  if (collection === "posts") {
    state.posts = state.posts.filter((item) => item.id !== id);
  } else if (collection === "features") {
    state.features = state.features.filter((item) => item.id !== id);
  } else if (collection === "promotions") {
    state.promotions = state.promotions.filter((item) => item.id !== id);
  } else {
    state.pricing = state.pricing.filter((item) => item.id !== id);
  }
  if (state[collection].length === before) return null;
  await writeCmsFile(state);
  return state;
}

export async function resetCmsToSeed(): Promise<CmsState> {
  if (getDb()) return writeSeedToDb();
  const seeded = seedState();
  await writeCmsFile(seeded);
  return seeded;
}

export function emptyCms(): CmsState {
  return { ...EMPTY_CMS };
}

export function cmsUsesDatabase(): boolean {
  return Boolean(getDb());
}
