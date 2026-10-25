import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import type { APIRoute } from "astro";

/**
 * Sanity webhook target. Every page reads Site Settings and the home page
 * lists every work, product and post, so any publish drops the whole cache.
 */
export const POST: APIRoute = async ({ request, cache }) => {
  // Read at runtime: import.meta.env would bake the value in at build time.
  const { SANITY_REVALIDATE_SECRET } = process.env;
  if (!SANITY_REVALIDATE_SECRET)
    return new Response("SANITY_REVALIDATE_SECRET is not set", { status: 500 });

  const signature = request.headers.get(SIGNATURE_HEADER_NAME);
  const body = await request.text();
  if (
    !signature ||
    !(await isValidSignature(body, signature, SANITY_REVALIDATE_SECRET))
  )
    return new Response("Invalid signature", { status: 401 });

  await cache.invalidate({ tags: ["sanity"] });
  return Response.json({ revalidated: true });
};
