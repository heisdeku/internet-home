import { defineQuery } from "groq";

const IMAGE = `{ asset, hotspot, crop, alt, "lqip": asset->metadata.lqip }`;
const LINK = `{ ..., internal->{ _type, "slug": slug.current, comingSoon } }`;
const HEADING = `{ text, type, fontSize }`;
const SEO = `{ metaTitle, metaDescription, keywords, noIndex, noFollow, canonicalUrl, "ogImage": ogImage.asset->url, structuredData }`;

// Proportions of the image as shown: a cropped image (e.g. one screen cut from a Figma board) uses its crop, not the whole asset.
const ASPECT = `"aspectRatio": select(
  defined(crop) => (asset->metadata.dimensions.width * (1 - crop.left - crop.right)) / (asset->metadata.dimensions.height * (1 - crop.top - crop.bottom)),
  asset->metadata.dimensions.aspectRatio
)`;

const RICH_TEXT = `[]{
  ...,
  markDefs[]{ ..., internal->{ _type, "slug": slug.current }, company->{ company, url, "logo": logo.asset->url, brandColor }, tool->{ name, url, "icon": icon.path } },
  _type == "image" => { "lqip": asset->metadata.lqip, ${ASPECT} },
  _type == "imageGrid" => { images[]{ ..., "lqip": asset->metadata.lqip, ${ASPECT} } },
  _type == "video" => { "url": coalesce(file.asset->url, url), poster ${IMAGE} }
}`;
const BODY = `body${RICH_TEXT}`;
const DESCRIPTION = `description${RICH_TEXT}`;

const WORK_CARD = `{ _id, title, "slug": slug.current, category, year, summary, comingSoon, heroImage ${IMAGE}, hoverImage ${IMAGE} }`;
const PRODUCT_CARD = `{ _id, name, "slug": slug.current, status, version, tagline, comingSoon, preview ${IMAGE} }`;
const POST_CARD = `{ _id, title, "slug": slug.current, publishedAt, readingTime, excerpt, tags, comingSoon }`;
const EXPERIENCE = `{ _id, company, url, location, stack, roles[]{ _key, title, employmentType, startDate, endDate, highlights } }`;

/** Shared by `page` and `outreach` documents. */
const PAGE_BUILDER = `pageBuilder[hidden != true]{
  _key, _type, hideOnMobile, hideOnDesktop,
  _type == "heroSection" => { meta, heading ${HEADING} },
  _type == "pageHeading" => { heading ${HEADING}, ${DESCRIPTION}, cta ${LINK} },
  _type == "worksSection" => {
    heading ${HEADING}, defaultView, limit, showFilters, link ${LINK},
    "works": select(
      count(works) > 0 => works[@->hidden != true]-> ${WORK_CARD},
      *[_type == "work" && defined(slug.current) && hidden != true] | order(order asc) ${WORK_CARD}
    )
  },
  _type == "productsSection" => {
    "products": select(
      count(products) > 0 => products[@->hidden != true]-> ${PRODUCT_CARD},
      *[_type == "product" && defined(slug.current) && hidden != true] | order(order asc) ${PRODUCT_CARD}
    )
  },
  _type == "writingSection" => {
    heading ${HEADING}, link ${LINK}, limit, layout,
    "posts": *[_type == "post" && defined(slug.current) && hidden != true] | order(publishedAt desc) ${POST_CARD}
  },
  _type == "infoSection" => {
    heading ${HEADING}, ${BODY}, columns[]{ _key, label, source, tools[]->{ _id, name, url, "icon": icon.path }, link ${LINK} },
    "companies": *[_type == "experience" && hidden != true] | order(order asc){ _id, company, url, "logo": logo.asset->url, brandColor }
  },
  _type == "experienceSection" => {
    heading ${HEADING}, openFirst,
    "entries": select(
      count(entries) > 0 => entries[@->hidden != true]-> ${EXPERIENCE},
      *[_type == "experience" && hidden != true] | order(order asc) ${EXPERIENCE}
    )
  },
  _type == "introSection" => { greeting, heading ${HEADING}, ${DESCRIPTION} },
  _type == "listColumnsSection" => { columns[]{ _key, label, items[]{ _key, text, link ${LINK} } } },
  _type == "contactSection" => { heading ${HEADING}, emailSubject, ctas[] ${LINK} },
  _type == "richTextSection" => { heading ${HEADING}, ${BODY} }
}`;

export const SITE_SETTINGS_QUERY = defineQuery(`*[_id == "siteSettings"][0]{
  displayName, fullName, jobTitle, timeZone, timeZoneLabel, availableForWork, availabilityLabel, notFound, email,
  "resumeUrl": resume.asset->url, "portraitUrl": portrait.asset->url, showListeningPlayer,
  navigation[] ${LINK}, footerLinks[] ${LINK}, footerPrompt, siteUrl, siteTitle, seo ${SEO}
}`);

export const PAGE_SLUGS_QUERY = defineQuery(
  `*[_type == "page" && defined(slug.current)]{ "slug": slug.current }`,
);

export const PAGE_QUERY =
  defineQuery(`*[_type == "page" && slug.current == $slug][0]{
  _id, _type, _updatedAt, title, "slug": slug.current, theme, chrome, seo ${SEO}, ${PAGE_BUILDER}
}`);

export const OUTREACH_SLUGS_QUERY = defineQuery(
  `*[_type == "outreach" && defined(slug.current)]{ "slug": slug.current }`,
);

export const OUTREACH_QUERY =
  defineQuery(`*[_type == "outreach" && slug.current == $slug][0]{
  _id, _type, _updatedAt, title, "slug": slug.current, recipient, company, theme, chrome, seo ${SEO}, ${PAGE_BUILDER}
}`);

/** Published works only: coming-soon entries have no page. */
export const WORK_SLUGS_QUERY =
  defineQuery(`*[_type == "work" && defined(slug.current) && comingSoon != true && hidden != true] | order(order asc){
  "slug": slug.current, title, category, year
}`);

export const WORK_QUERY =
  defineQuery(`*[_type == "work" && slug.current == $slug][0]{
  _id, _updatedAt, title, "slug": slug.current, category, year, role, stack, url, client, timeline, collaborators,
  links[] ${LINK}, summary, heroImage ${IMAGE}, hoverImage ${IMAGE}, gallery[] ${IMAGE}, ${BODY}, seo ${SEO}
}`);

export const PRODUCTS_QUERY = defineQuery(
  `*[_type == "product" && defined(slug.current) && hidden != true] | order(order asc) ${PRODUCT_CARD}`,
);

export const PRODUCT_SLUGS_QUERY = defineQuery(
  `*[_type == "product" && defined(slug.current) && comingSoon != true && hidden != true] | order(order asc){ "slug": slug.current }`,
);

export const PRODUCT_QUERY =
  defineQuery(`*[_type == "product" && slug.current == $slug][0]{
  _id, _updatedAt, name, "slug": slug.current, status, version, tagline, ctas[] ${LINK},
  preview ${IMAGE},
  features[]{ _key, title, description },
  ${BODY},
  changelog[]{ _key, version, date, note },
  seo ${SEO}
}`);

export const POSTS_QUERY = defineQuery(
  `*[_type == "post" && defined(slug.current) && hidden != true] | order(publishedAt desc) ${POST_CARD}`,
);

export const POST_SLUGS_QUERY = defineQuery(
  `*[_type == "post" && defined(slug.current) && comingSoon != true && hidden != true] | order(publishedAt desc){ "slug": slug.current, title }`,
);

export const POST_QUERY =
  defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  _id, _updatedAt, title, "slug": slug.current, publishedAt, readingTime, excerpt, tags, ${BODY}, seo ${SEO}
}`);

/** The few fields the generated share image needs, for any document type with a slug. */
export const OG_DOC_QUERY =
  defineQuery(`*[_type == $type && _type in ["page", "outreach", "work", "product", "post"] && slug.current == $slug][0]{
  _type,
  "title": coalesce(seo.metaTitle, title, name),
  "description": coalesce(seo.metaDescription, excerpt, summary, tagline),
  "label": coalesce(category, status, string(year)),
  publishedAt, recipient, company
}`);
