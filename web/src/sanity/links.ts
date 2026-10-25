import type { SITE_SETTINGS_QUERY_RESULT } from "@/sanity/types";

type NavLink = NonNullable<
  NonNullable<SITE_SETTINGS_QUERY_RESULT>["navigation"]
>[number];

/** A `simpleLink` or `cta` object after the LINK projection. `cta` adds `variant`. */
export type LinkData = Omit<NavLink, "_key" | "_type"> & {
  variant?: "default" | "secondary" | "text" | null;
};

export type RoutedType = NonNullable<LinkData["internal"]>["_type"];

/** The one place a document's URL is decided. `studio/components/SlugWithUrlInput.tsx` mirrors it. */
export function pathFor(type: RoutedType, slug: string): string {
  switch (type) {
    case "page":
      return slug === "home" ? "/" : `/${slug}`;
    case "outreach":
      return `/intro/${slug}`;
    case "work":
      return `/work/${slug}`;
    case "product":
      return `/products/${slug}`;
    case "post":
      return `/writing/${slug}`;
  }
}

export function resolveHref(
  link: LinkData,
  resumeUrl: string | null,
): string | null {
  const params = link.params ?? "";
  switch (link.type) {
    case "external":
      return link.external ? `${link.external}${params}` : null;
    case "relative":
      return link.relative ? `${link.relative}${params}` : null;
    case "email":
      return link.email ? `mailto:${link.email}` : null;
    case "phone":
      return link.phone ? `tel:${link.phone}` : null;
    case "resume":
      return resumeUrl ? `${resumeUrl}?dl=` : null;
    default: {
      if (!link.internal || link.internal.comingSoon) return null;
      return `${pathFor(link.internal._type, link.internal.slug)}${params}`;
    }
  }
}

export const opensInNewTab = (link: LinkData) => link.target === "_blank";
