import { siteName, type Settings } from "@/lib/seo";
import { resolveHref } from "@/sanity/links";

export type JsonLdNode = {
  "@type": string;
  "@id"?: string;
  [property: string]: unknown;
};

const websiteId = (origin: string) => `${origin}/#website`;
const personId = (origin: string) => `${origin}/#person`;
const webPageId = (url: string) => `${url}#webpage`;

/** WebSite + Person, emitted on every page so the other nodes can reference them. */
export function siteGraph(origin: string, settings: Settings): JsonLdNode[] {
  const name = siteName(settings);
  const sameAs = (settings.footerLinks ?? [])
    .filter((link) => link.type === "external")
    .map((link) => resolveHref(link, null))
    .filter((href): href is string => href !== null);
  return [
    {
      "@type": "WebSite",
      "@id": websiteId(origin),
      url: `${origin}/`,
      name,
      ...(settings.seo?.metaDescription && {
        description: settings.seo.metaDescription,
      }),
      inLanguage: "en",
      publisher: { "@id": personId(origin) },
    },
    {
      "@type": "Person",
      "@id": personId(origin),
      name: settings.fullName,
      url: `${origin}/`,
      jobTitle: settings.jobTitle,
      email: settings.email,
      ...(sameAs.length > 0 && { sameAs }),
    },
  ];
}

export function webPageNode({
  origin,
  path,
  name,
  description,
  updatedAt,
}: {
  origin: string;
  path: string;
  name: string;
  description?: string | null;
  updatedAt?: string | null;
}): JsonLdNode {
  const url = `${origin}${path}`;
  return {
    "@type": "WebPage",
    "@id": webPageId(url),
    url,
    name,
    ...(description && { description }),
    ...(updatedAt && { dateModified: updatedAt }),
    isPartOf: { "@id": websiteId(origin) },
    publisher: { "@id": personId(origin) },
  };
}

export function articleNode({
  origin,
  path,
  headline,
  description,
  publishedAt,
  updatedAt,
  imageUrl,
  keywords,
}: {
  origin: string;
  path: string;
  headline: string;
  description?: string | null;
  publishedAt?: string | null;
  updatedAt: string;
  imageUrl: string;
  keywords?: string[] | null;
}): JsonLdNode {
  const url = `${origin}${path}`;
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline,
    ...(description && { description }),
    image: imageUrl,
    ...(publishedAt && { datePublished: publishedAt }),
    dateModified: updatedAt,
    ...(keywords && keywords.length > 0 && { keywords: keywords.join(", ") }),
    author: { "@id": personId(origin) },
    publisher: { "@id": personId(origin) },
    mainEntityOfPage: { "@id": webPageId(url) },
    isPartOf: { "@id": websiteId(origin) },
  };
}

/** A portfolio piece or product, credited to the site owner. */
export function creativeWorkNode({
  origin,
  path,
  type,
  name,
  description,
  url,
  updatedAt,
}: {
  origin: string;
  path: string;
  type: "CreativeWork" | "SoftwareApplication";
  name: string;
  description?: string | null;
  url?: string | null;
  updatedAt: string;
}): JsonLdNode {
  const pageUrl = `${origin}${path}`;
  return {
    "@type": type,
    "@id": `${pageUrl}#work`,
    name,
    ...(description && { description }),
    ...(url && { sameAs: url }),
    dateModified: updatedAt,
    author: { "@id": personId(origin) },
    mainEntityOfPage: { "@id": webPageId(pageUrl) },
  };
}

export function breadcrumbNode(
  origin: string,
  items: { name: string; path: string }[],
): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${origin}${item.path}`,
    })),
  };
}
