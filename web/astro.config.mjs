// @ts-check
import sanity from '@sanity/astro';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

// astro.config runs before Astro's own env loading, so read the PUBLIC_ vars via Vite.
const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, PUBLIC_SITE_URL } = loadEnv(
	process.env.NODE_ENV ?? 'development',
	process.cwd(),
	'',
);

export default defineConfig({
	site: PUBLIC_SITE_URL || 'https://feranmiadedokun.com',
	// One URL per page: canonical tags, the sitemap and the server all agree on no trailing slash.
	trailingSlash: 'never',
	// Standalone Node server: Brimble runs `node web/dist/server/entry.mjs` and passes PORT.
	adapter: node({ mode: 'standalone' }),
	integrations: [
		sanity({
			projectId: PUBLIC_SANITY_PROJECT_ID,
			dataset: PUBLIC_SANITY_DATASET,
			apiVersion: '2026-10-20',
			useCdn: false,
		}),
		// Intro pages are personal outreach and stay out of the sitemap.
		sitemap({ filter: (page) => !/\/(intro|og|api)(\/|$)/.test(new URL(page).pathname) }),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
