// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { loadEnv } from "vite";

// User-confirmed production domain; SITE_URL can override it for a domain migration.
const siteUrl =
  process.env.SITE_URL ||
  loadEnv(process.env.NODE_ENV || "production", process.cwd(), "").SITE_URL ||
  "https://anpmovers.au";
if (
  siteUrl &&
  (!/^https:\/\/[^/]+\/?$/.test(siteUrl) ||
    new URL(siteUrl).search ||
    new URL(siteUrl).hash)
) {
  throw new Error(
    "SITE_URL must be your HTTPS production origin, without a path, query or fragment.",
  );
}

// https://astro.build/config
export default defineConfig({
  site: siteUrl || undefined,
  integrations: [
    react(),
    ...(siteUrl
      ? [
          sitemap({
            filter: (page) =>
              !["/terms-and-conditions", "/privacy-policy", "/404"].includes(
                new URL(page).pathname.replace(/\/$/, ""),
              ),
          }),
        ]
      : []),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
