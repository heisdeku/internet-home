import type { APIRoute } from 'astro';

/** Intro pages are personal outreach, so crawlers are kept out of them here as well as via noindex. */
export const GET: APIRoute = ({ site }) => {
	const origin = site?.origin ?? '';
	const body = ['User-agent: *', 'Allow: /', 'Disallow: /intro', 'Disallow: /og/', 'Disallow: /api/', '', `Sitemap: ${origin}/sitemap-index.xml`, ''].join('\n');
	return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
