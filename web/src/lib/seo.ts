import type { SITE_SETTINGS_QUERY_RESULT } from "@/sanity/types";

export type Settings = NonNullable<SITE_SETTINGS_QUERY_RESULT>;
export type SeoFields = Settings["seo"];

export type OgKind = "site" | "page" | "outreach" | "work" | "product" | "post";

export type PageMeta = {
  title: string;
  description: string | null;
  canonical: string;
  robots: string;
  keywords: string | null;
  siteName: string;
  ogType: "website" | "article";
  ogImage: string;
  jsonLdOverride: string | null;
};

export const siteName = (settings: Settings) =>
  settings.siteTitle ?? settings.fullName ?? "Portfolio";

export function siteOrigin(
  settings: Settings,
  astroSite: URL | undefined,
  requestUrl: URL,
): string {
  return (settings.siteUrl ?? astroSite?.origin ?? requestUrl.origin).replace(
    /\/$/,
    "",
  );
}

export function buildMeta({
  settings,
  origin,
  path,
  seo,
  title,
  description,
  ogType = "website",
  og,
  noIndex = false,
}: {
  settings: Settings;
  origin: string;
  path: string;
  seo?: SeoFields;
  title?: string | null;
  description?: string | null;
  ogType?: "website" | "article";
  og: { kind: OgKind; slug: string };
  noIndex?: boolean;
}): PageMeta {
  const name = siteName(settings);
  const resolvedTitle = seo?.metaTitle || title || null;
  const fullTitle =
    resolvedTitle && !resolvedTitle.includes(name)
      ? `${resolvedTitle} — ${name}`
      : (resolvedTitle ?? name);
  const index = !(noIndex || seo?.noIndex);
  const follow = !(noIndex || seo?.noFollow);

  return {
    title: fullTitle,
    description:
      seo?.metaDescription ||
      description ||
      settings.seo?.metaDescription ||
      null,
    canonical: seo?.canonicalUrl ?? `${origin}${path}`,
    robots: `${index ? "index" : "noindex"}, ${follow ? "follow" : "nofollow"}`,
    keywords: seo?.keywords ?? null,
    siteName: name,
    ogType,
    ogImage: seo?.ogImage
      ? `${seo.ogImage}?w=1200&h=630&fit=crop&auto=format`
      : `${origin}/og/${og.kind}/${og.slug}.png`,
    jsonLdOverride: seo?.structuredData?.trim() || null,
  };
}
