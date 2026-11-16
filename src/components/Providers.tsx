"use client";

import type { ReactNode } from "react";
import { MotionRoot } from "@/components/MotionRoot";
import { LanguageProvider } from "@/lib/i18n";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <MotionRoot />
      {children}
    </LanguageProvider>
  );
}
