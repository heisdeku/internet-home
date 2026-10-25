import { pathFor } from "@/sanity/links";
import { SITEMAP_QUERY } from "@/sanity/queries";
import type { APIRoute } from "astro";
import { sanityClient } from "sanity:client";

export const GET: APIRoute = async ({ site }) => {
  const origin = site?.origin ?? "";
  const docs = await sanityClient.fetch(SITEMAP_QUERY);
  const urls = docs.map(
    (doc) =>
      `<url><loc>${origin}${pathFor(doc._type, doc.slug)}</loc><lastmod>${doc._updatedAt}</lastmod></url>`,
  );
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
  return new Response(body, {
    headers: { "content-type": "application/xml; charset=utf-8" },
  });
};
