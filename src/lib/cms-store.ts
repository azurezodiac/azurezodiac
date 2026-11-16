import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
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
import { dbQuery, getDb, type DbRow } from "@/lib/db";

const DATA_DIR = path.join(
  process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
    ? "/tmp"
    : process.cwd(),
  "redeemysoul-data",
);
const CMS_FILE = path.join(DATA_DIR, "cms.json");

let schemaReady = false;

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

function rowPost(row: DbRow): CmsPost {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    excerpt: String(row.excerpt ?? ""),
    body: String(row.body ?? ""),
    published: Boolean(row.published),
    publishedAt: String(row.published_at),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
  };
}

function rowFeature(row: DbRow): CmsFeature {
  return {
    id: String(row.id),
    title: String(row.title),
    body: String(row.body ?? ""),
    order: Number(row.sort_order) || 0,
    published: Boolean(row.published),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
  };
}

function rowPromo(row: DbRow): CmsPromotion {
  return {
    id: String(row.id),
    title: String(row.title),
    body: String(row.body ?? ""),
    ctaLabel: String(row.cta_label ?? "Begin"),
    ctaHref: String(row.cta_href ?? "/begin"),
    active: Boolean(row.active),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
  };
}

function rowPricing(row: DbRow): CmsPricingItem {
  return {
    id: String(row.id),
    label: String(row.label),
    amount: String(row.amount ?? ""),
    method: String(row.method ?? ""),
    note: String(row.note ?? ""),
    order: Number(row.sort_order) || 0,
    published: Boolean(row.published),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
  };
}

async function ensureCmsTables(): Promise<void> {
  if (schemaReady || !getDb()) return;
  const dialect = getDb()!.dialect;
  const file =
    dialect === "mysql"
      ? path.join(process.cwd(), "migrations", "mysql", "001_schema.sql")
      : path.join(process.cwd(), "migrations", "002_cms.sql");
  const raw = await fs.readFile(file, "utf8");
  const statements = raw
    .split(/;\s*\n/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0 && !part.startsWith("--"));
  for (const statement of statements) {
    await dbQuery(statement);
  }
  schemaReady = true;
}

async function readCmsFromDb(): Promise<CmsState> {
  await ensureCmsTables();

  const [posts, features, promotions, pricing] = await Promise.all([
    dbQuery(`SELECT * FROM cms_posts ORDER BY published_at DESC`),
    dbQuery(`SELECT * FROM cms_features ORDER BY sort_order ASC`),
    dbQuery(`SELECT * FROM cms_promotions ORDER BY updated_at DESC`),
    dbQuery(`SELECT * FROM cms_pricing ORDER BY sort_order ASC`),
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
  await ensureCmsTables();
  const seeded = seedState();

  await dbQuery("DELETE FROM cms_posts");
  await dbQuery("DELETE FROM cms_features");
  await dbQuery("DELETE FROM cms_promotions");
  await dbQuery("DELETE FROM cms_pricing");

  for (const post of seeded.posts) {
    await dbQuery(
      `INSERT INTO cms_posts
       (id, slug, title, excerpt, body, published, published_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        post.id,
        post.slug,
        post.title,
        post.excerpt,
        post.body,
        post.published ? 1 : 0,
        post.publishedAt,
        post.updatedAt,
      ],
    );
  }
  for (const feature of seeded.features) {
    await dbQuery(
      `INSERT INTO cms_features
       (id, title, body, sort_order, published, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        feature.id,
        feature.title,
        feature.body,
        feature.order,
        feature.published ? 1 : 0,
        feature.updatedAt,
      ],
    );
  }
  for (const promo of seeded.promotions) {
    await dbQuery(
      `INSERT INTO cms_promotions
       (id, title, body, cta_label, cta_href, active, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        promo.id,
        promo.title,
        promo.body,
        promo.ctaLabel,
        promo.ctaHref,
        promo.active ? 1 : 0,
        promo.updatedAt,
      ],
    );
  }
  for (const row of seeded.pricing) {
    await dbQuery(
      `INSERT INTO cms_pricing
       (id, label, amount, method, note, sort_order, published, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        row.id,
        row.label,
        row.amount,
        row.method,
        row.note,
        row.order,
        row.published ? 1 : 0,
        row.updatedAt,
      ],
    );
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
  const stamped = nowIso();

  if (getDb()) {
    await ensureCmsTables();
    if (collection === "posts") {
      const slug =
        String(input.slug || "")
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9-]+/g, "-")
          .replace(/^-|-$/g, "") || `post-${newId()}`;
      await dbQuery(
        `INSERT INTO cms_posts
         (id, slug, title, excerpt, body, published, published_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newId(),
          slug,
          String(input.title || "Untitled").trim(),
          String(input.excerpt || "").trim(),
          String(input.body || "").trim(),
          input.published ? 1 : 0,
          String(input.publishedAt || stamped.slice(0, 10)),
          stamped,
        ],
      );
    } else if (collection === "features") {
      await dbQuery(
        `INSERT INTO cms_features
         (id, title, body, sort_order, published, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          newId(),
          String(input.title || "Feature").trim(),
          String(input.body || "").trim(),
          Number(input.order) || 0,
          input.published !== false ? 1 : 0,
          stamped,
        ],
      );
    } else if (collection === "promotions") {
      await dbQuery(
        `INSERT INTO cms_promotions
         (id, title, body, cta_label, cta_href, active, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          newId(),
          String(input.title || "Promotion").trim(),
          String(input.body || "").trim(),
          String(input.ctaLabel || "Begin").trim(),
          String(input.ctaHref || "/begin").trim(),
          input.active !== false ? 1 : 0,
          stamped,
        ],
      );
    } else {
      await dbQuery(
        `INSERT INTO cms_pricing
         (id, label, amount, method, note, sort_order, published, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newId(),
          String(input.label || "Plan").trim(),
          String(input.amount || "").trim(),
          String(input.method || "").trim(),
          String(input.note || "").trim(),
          Number(input.order) || 0,
          input.published !== false ? 1 : 0,
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
  const stamped = nowIso();

  if (getDb()) {
    await ensureCmsTables();
    if (collection === "posts") {
      const current = await dbQuery(`SELECT * FROM cms_posts WHERE id = ?`, [
        id,
      ]);
      if (!current.rows[0]) return null;
      const row = rowPost(current.rows[0]);
      await dbQuery(
        `UPDATE cms_posts SET
          slug = ?, title = ?, excerpt = ?, body = ?,
          published = ?, published_at = ?, updated_at = ?
         WHERE id = ?`,
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
          (patch.published !== undefined
            ? Boolean(patch.published)
            : row.published)
            ? 1
            : 0,
          patch.publishedAt !== undefined
            ? String(patch.publishedAt)
            : row.publishedAt,
          stamped,
          id,
        ],
      );
    } else if (collection === "features") {
      const current = await dbQuery(`SELECT * FROM cms_features WHERE id = ?`, [
        id,
      ]);
      if (!current.rows[0]) return null;
      const row = rowFeature(current.rows[0]);
      await dbQuery(
        `UPDATE cms_features SET
          title = ?, body = ?, sort_order = ?, published = ?, updated_at = ?
         WHERE id = ?`,
        [
          patch.title !== undefined ? String(patch.title).trim() : row.title,
          patch.body !== undefined ? String(patch.body).trim() : row.body,
          patch.order !== undefined ? Number(patch.order) : row.order,
          (patch.published !== undefined
            ? Boolean(patch.published)
            : row.published)
            ? 1
            : 0,
          stamped,
          id,
        ],
      );
    } else if (collection === "promotions") {
      const current = await dbQuery(
        `SELECT * FROM cms_promotions WHERE id = ?`,
        [id],
      );
      if (!current.rows[0]) return null;
      const row = rowPromo(current.rows[0]);
      await dbQuery(
        `UPDATE cms_promotions SET
          title = ?, body = ?, cta_label = ?, cta_href = ?, active = ?, updated_at = ?
         WHERE id = ?`,
        [
          patch.title !== undefined ? String(patch.title).trim() : row.title,
          patch.body !== undefined ? String(patch.body).trim() : row.body,
          patch.ctaLabel !== undefined
            ? String(patch.ctaLabel).trim()
            : row.ctaLabel,
          patch.ctaHref !== undefined
            ? String(patch.ctaHref).trim()
            : row.ctaHref,
          (patch.active !== undefined ? Boolean(patch.active) : row.active)
            ? 1
            : 0,
          stamped,
          id,
        ],
      );
    } else {
      const current = await dbQuery(`SELECT * FROM cms_pricing WHERE id = ?`, [
        id,
      ]);
      if (!current.rows[0]) return null;
      const row = rowPricing(current.rows[0]);
      await dbQuery(
        `UPDATE cms_pricing SET
          label = ?, amount = ?, method = ?, note = ?,
          sort_order = ?, published = ?, updated_at = ?
         WHERE id = ?`,
        [
          patch.label !== undefined ? String(patch.label).trim() : row.label,
          patch.amount !== undefined ? String(patch.amount).trim() : row.amount,
          patch.method !== undefined ? String(patch.method).trim() : row.method,
          patch.note !== undefined ? String(patch.note).trim() : row.note,
          patch.order !== undefined ? Number(patch.order) : row.order,
          (patch.published !== undefined
            ? Boolean(patch.published)
            : row.published)
            ? 1
            : 0,
          stamped,
          id,
        ],
      );
    }
    return readCmsFromDb();
  }

  const state = await readCmsFromFile();
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
  await writeCmsFile(state);
  return state;
}

export async function deleteCmsItem(
  collection: CmsCollection,
  id: string,
): Promise<CmsState | null> {
  if (getDb()) {
    await ensureCmsTables();
    const table =
      collection === "posts"
        ? "cms_posts"
        : collection === "features"
          ? "cms_features"
          : collection === "promotions"
            ? "cms_promotions"
            : "cms_pricing";
    const result = await dbQuery(`DELETE FROM ${table} WHERE id = ?`, [id]);
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
