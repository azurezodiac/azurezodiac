import type { NextConfig } from "next";

const isCpanelStatic = process.env.CPANEL_STATIC === "1";

const nextConfig: NextConfig = {
  ...(isCpanelStatic ? { output: "export" as const } : {}),
  images: {
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
