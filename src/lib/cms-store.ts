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

async function readCms(): Promise<CmsState> {
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

async function writeCms(state: CmsState): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(CMS_FILE, JSON.stringify(state, null, 2));
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
  const state = await readCms();
  const stamped = nowIso();

  if (collection === "posts") {
    const slug = String(input.slug || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-|-$/g, "");
    const item: CmsPost = {
      id: newId(),
      slug: slug || `post-${newId()}`,
      title: String(input.title || "Untitled").trim(),
      excerpt: String(input.excerpt || "").trim(),
      body: String(input.body || "").trim(),
      published: Boolean(input.published),
      publishedAt: String(input.publishedAt || stamped.slice(0, 10)),
      updatedAt: stamped,
    };
    state.posts.unshift(item);
  } else if (collection === "features") {
    const item: CmsFeature = {
      id: newId(),
      title: String(input.title || "Feature").trim(),
      body: String(input.body || "").trim(),
      order: Number(input.order) || state.features.length + 1,
      published: input.published !== false,
      updatedAt: stamped,
    };
    state.features.push(item);
  } else if (collection === "promotions") {
    const item: CmsPromotion = {
      id: newId(),
      title: String(input.title || "Promotion").trim(),
      body: String(input.body || "").trim(),
      ctaLabel: String(input.ctaLabel || "Begin").trim(),
      ctaHref: String(input.ctaHref || "/begin").trim(),
      active: input.active !== false,
      updatedAt: stamped,
    };
    state.promotions.unshift(item);
  } else {
    const item: CmsPricingItem = {
      id: newId(),
      label: String(input.label || "Plan").trim(),
      amount: String(input.amount || "").trim(),
      method: String(input.method || "").trim(),
      note: String(input.note || "").trim(),
      order: Number(input.order) || state.pricing.length + 1,
      published: input.published !== false,
      updatedAt: stamped,
    };
    state.pricing.push(item);
  }

  await writeCms(state);
  return state;
}

export async function updateCmsItem(
  collection: CmsCollection,
  id: string,
  patch: Record<string, unknown>,
): Promise<CmsState | null> {
  const state = await readCms();
  const stamped = nowIso();

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

  await writeCms(state);
  return state;
}

export async function deleteCmsItem(
  collection: CmsCollection,
  id: string,
): Promise<CmsState | null> {
  const state = await readCms();
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
  await writeCms(state);
  return state;
}

export async function resetCmsToSeed(): Promise<CmsState> {
  const seeded = seedState();
  await writeCms(seeded);
  return seeded;
}

export function emptyCms(): CmsState {
  return { ...EMPTY_CMS };
}
