import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const origin = site?.origin ?? "";
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /intro",
    "Disallow: /og/",
    "Disallow: /api/",
    "",
    `Sitemap: ${origin}/sitemap.xml`,
    "",
  ].join("\n");
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
};
