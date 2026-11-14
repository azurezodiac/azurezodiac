"use client";

import { useLang } from "@/lib/i18n";

export function HealingDisclaimer({
  className = "",
}: {
  className?: string;
}) {
  const { t } = useLang();

  return (
    <p
      className={`text-xs leading-relaxed text-fog/85 md:text-sm ${className}`.trim()}
      role="note"
    >
      {t.disclaimer.short}
    </p>
  );
}
