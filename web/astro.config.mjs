// @ts-check
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";
import sanity from "@sanity/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import { loadEnv } from "vite";

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, PUBLIC_SITE_URL } =
  loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "");

export default defineConfig({
  site: PUBLIC_SITE_URL || "https://feranmiadedokun.com",
  trailingSlash: "never",
  adapter: node({ mode: "standalone" }),
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Geist",
      cssVariable: "--font-geist",
      weights: ["400 600"],
      styles: ["normal"],
      fallbacks: ["Helvetica", "Arial", "sans-serif"],
    },
    {
      provider: fontProviders.google(),
      name: "Geist Mono",
      cssVariable: "--font-geist-mono",
      weights: ["400 500"],
      styles: ["normal"],
      fallbacks: ["ui-monospace", "monospace"],
    },
  ],
  build: { inlineStylesheets: "always" },
  integrations: [
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET,
      apiVersion: "2026-10-20",
      useCdn: false,
    }),
    sitemap({
      filter: (page) => !/\/(intro|og|api)(\/|$)/.test(new URL(page).pathname),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
