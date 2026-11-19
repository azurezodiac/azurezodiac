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

/** Editable homepage / landing copy (EN + UR). Empty strings mean “use built-in defaults”. */
export type CmsLandingLocale = {
  brandLine: string;
  headline: string;
  support: string;
  ctaBegin: string;
  ctaServices: string;
};

export type CmsLanding = {
  en: CmsLandingLocale;
  ur: CmsLandingLocale;
  updatedAt: string;
};

export type CmsState = {
  posts: CmsPost[];
  features: CmsFeature[];
  promotions: CmsPromotion[];
  pricing: CmsPricingItem[];
  landing: CmsLanding;
};

export const EMPTY_LANDING_LOCALE: CmsLandingLocale = {
  brandLine: "",
  headline: "",
  support: "",
  ctaBegin: "",
  ctaServices: "",
};

export function emptyLanding(updatedAt = new Date().toISOString()): CmsLanding {
  return {
    en: { ...EMPTY_LANDING_LOCALE },
    ur: { ...EMPTY_LANDING_LOCALE },
    updatedAt,
  };
}

export const EMPTY_CMS: CmsState = {
  posts: [],
  features: [],
  promotions: [],
  pricing: [],
  landing: emptyLanding(""),
};
