"use client";

import { useEffect, useState } from "react";
import type { CmsFeature } from "@/lib/cms-types";

export function CmsFeatures() {
  const [features, setFeatures] = useState<CmsFeature[]>([]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/cms/public");
        if (!res.ok) return;
        const data = (await res.json()) as {
          cms?: { features?: CmsFeature[] };
        };
        if (!cancelled) setFeatures(data.cms?.features ?? []);
      } catch {
        // ignore offline
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (features.length === 0) return null;

  return (
    <section className="bg-ink" aria-label="Featured highlights">
      <div
        className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-3 md:px-10 md:py-20"
        data-stagger
      >
        {features.map((feature) => (
          <div key={feature.id} className="hover-lift border-t border-line pt-6">
            <h2 className="font-display text-2xl text-cream">{feature.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-fog md:text-base">
              {feature.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
