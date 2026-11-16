export type CmsCollection =
  | "posts"
  | "features"
  | "promotions"
  | "pricing";

export type CmsPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  published: boolean;
  publishedAt: string;
  updatedAt: string;
};

export type CmsFeature = {
  id: string;
  title: string;
  body: string;
  order: number;
  published: boolean;
  updatedAt: string;
};

export type CmsPromotion = {
  id: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  active: boolean;
  updatedAt: string;
};

export type CmsPricingItem = {
  id: string;
  label: string;
  amount: string;
  method: string;
  note: string;
  order: number;
  published: boolean;
  updatedAt: string;
};

export type CmsState = {
  posts: CmsPost[];
  features: CmsFeature[];
  promotions: CmsPromotion[];
  pricing: CmsPricingItem[];
};

export const EMPTY_CMS: CmsState = {
  posts: [],
  features: [],
  promotions: [],
  pricing: [],
};
