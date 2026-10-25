# Portfolio

Sanity Studio and Astro site side by side, built from the "Portfolio redesign concept" Claude Design.

```
portfolio/
├── studio/   # Sanity Studio (project 1dyyk69c, dataset production)
└── web/      # Astro site (Tailwind v4, @sanity/astro, Node adapter, hosted on Brimble)
```

## Run it

```bash
bun run dev          # Studio on :3333 and site on :4321 together (run-p)
bun run dev:studio   # http://localhost:3333
bun run dev:web      # http://localhost:4321
```

`studio` and `web` are bun workspaces, so a single `bun install` at the root installs everything.

## Environment

- `studio/.env` — `SANITY_AUTH_TOKEN` (the developer token). Used by the CLI for `schema:deploy`, `deploy` and `typegen`. The dataset is public, so the site reads without a token.
- `web/.env` — `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, `PUBLIC_SITE_URL`, `PUBLIC_GA_MEASUREMENT_ID` (Google Analytics) and `PUBLIC_BRIMBLE_WEBSITE_ID` (Brimble analytics) and `PUBLIC_QUALITY_SITE_ID` (Quality comment widget; empty disables any of the three tags) and the three `SPOTIFY_*` values for the "Listening now" player. The refresh token needs the `user-read-currently-playing` and `user-read-recently-played` scopes: the second lets the card fall back to the last track played when nothing is playing (without it the card hides when idle). Copy `web/.env.example` to get started.

## Content model

Pages are composed in the Studio, following the AAIF conventions: a `page` document holds a `pageBuilder` array of sections; headings are `heading` objects (text plus tag and size, with `<span>` marking the accent phrase); descriptions are `portableText`; every link is a `simpleLink` or `cta` object (internal document, URL, relative path, email, phone, or the résumé file, plus target and URL parameters; `cta` adds a button variant); navigation lives in Site Settings. Nothing about page structure or links is hardcoded in the Astro app.

| Type | What it is |
| --- | --- |
| `siteSettings` (singleton) | Identity, email, résumé file, header links, footer links, SEO defaults |
| `page` | Slug (`home` is the front page), theme, chrome, SEO and the page builder. Rendered by `web/src/pages/[...slug].astro` |
| `outreach` ("Intro page") | A personalised page at `/intro/<slug>` for job applications, cold emails and outreach, with the same page builder. `noindex` by default. See `/intro/reach-ai` for a sample |
| `work`, `product`, `post` | Detail documents under `/work`, `/products` and `/writing`. Posts and the optional work body are Portable Text |
| `experience` | A company with its roles (title, employment type, dates, highlights) |
| `tool` | A language, framework or tool with its Simple Icons mark and URL, listed in Information columns and linked from rich text |

Sections: hero, page heading (heading, description, button), works (pick which works, grid/index), products grid, writing list, information (text plus columns that can list companies from Experience), experience (pick which companies), intro greeting (supports `?to=Acme` on `/intro`), list columns, contact band (email plus buttons), rich text.

Adding a section: define it in `studio/schemaTypes/sections`, register it in `schemaTypes/pageBuilder.ts` and `schemaTypes/index.ts`, project its fields in `PAGE_BUILDER` (`web/src/sanity/queries.ts`), run `bun run typegen`, then add a component under `web/src/components/sections` and a case in `PageBuilder.astro`.

## Scripts (from the root)

| Script | What it does |
| --- | --- |
| `bun run schema:deploy` | Pushes the schema to Sanity so MCP and agent tooling can see it |
| `bun run format` | Runs Prettier over `web` and `studio`, each with its own config in its `package.json` |
| `bun run typegen` | Extracts the schema and generates `web/src/sanity/types.ts` from the GROQ queries. Re-run after changing schema or queries |

## Code style

Each workspace has a Prettier config in its `package.json`. `studio` uses Sanity's settings (single quotes, no semicolons, 100 columns); `web` uses Prettier's defaults with the Astro and Tailwind plugins, so class lists stay sorted. `bun run format` applies both. Shared rules live in one place each: document URLs in `pathFor` (`web/src/sanity/links.ts`), date and `N°01` formatting in `web/src/lib/format.ts`, and the fields every listed document shares in `studio/schemaTypes/documents/listingFields.ts`.

## Motion

The feel borrows from pariola.work and victorwilliams.me. Everything respects `prefers-reduced-motion`.

- **Smooth scroll** with Lenis (`web/src/scripts/lenis.ts`), including eased in-page anchor jumps that clear the sticky header.
- **Reveal on enter**: add `data-reveal` to one element, or `data-reveal-stagger` to a container whose children should blur-up one after another (`web/src/scripts/reveal.ts`, styles under "Reveal" in `global.css`).
- **Micro-interactions** as Tailwind utilities in `global.css`: `link-underline` (sliding underline), `dim-siblings` (hovering one row quietens the rest), `wordmark-more` (the header name grows to the full name), `img-frame` (pixelated LQIP that the real image fades over once decoded).
- Icons come from [Reicon](https://reicon.dev) via `reicon-astro`, imported per icon (`reicon-astro/icons/ArrowRight.astro`). `SmartLink` adds the matching arrow for a link's type with `icon="auto"`, so link labels in the Studio stay plain text.
- Pill buttons press down slightly, arrows nudge on hover, and the Experience accordion eases open (see Accordion below).
- **Page transitions**: Astro's `ClientRouter` swaps pages in place with a cross-fade; a work's cover image morphs from the grid card into the case-study hero (`transition:name="work-<slug>"`). Every script boots from `astro:page-load`, so new page content is wired up after each navigation.
- **Split headings**: display-size headings (`XL` and up) and case-study titles are split into `.split-word` spans on the server (`Heading.astro`) and rise in word by word.
- **Brand links**: company names (link type "Company", referencing an Experience entry with its URL, logo and brand colour) and tool names (link type "Tool or language", referencing a `tool` document whose mark is picked from Simple Icons in the Studio) take the brand colour on hover and show a mark (`BrandLink.astro`). In running text the mark floats above the word so the line never reflows (`mode="float"`); in the Information lists it slides in beside the name (`mode="slide"`). Company marks are uploaded on the Experience document.
- **Footer social marks**: external footer links whose host is a known network (GitHub, LinkedIn, X, Instagram, Dribbble, Behance, YouTube, Spotify, Medium, dev.to) show their mark before the label (`lib/socialIcons.ts`); other links keep the arrow.
- **Accordion**: `<details data-accordion>` panels animate open and closed by height (`scripts/accordion.ts`), so the experience list glides in every browser including iOS Safari.
- **Rotating word**: inside any heading text, `<rotate>frontend|mobile|backend</rotate>` cycles its options with a slide every couple of seconds (`scripts/rotate.ts`); it sits beside the `<span>` accent markup the Studio's title input already supports.
- **Works grid**: the home page shows the first six (`limit`) with an "All work" link; the `/work` page shows everything with category filter chips (`showFilters`). Both have the grid/index toggle and a hover image that swaps in over the cover.
- **Media in rich text**: `image` (with caption), `imageGrid` (2–4 up), `video` (uploaded file or direct URL, poster, autoplay loop or play button) and `embed` (YouTube, Vimeo, Loom links become players; any other iframe URL works, with a chosen aspect ratio). All Sanity images are served as WebP.
- **Case studies**: a sticky fact sheet (role, client, timeline, year, stack, team, links) beside the long read, `h2` rendered as small labels, Sparkle bullets, natural-aspect figures, image grids, video and embed blocks, then a link to the next project.


## SEO

Follows the same approach as the AAIF and Medspa sites.

- **Per-document `seo` object**: meta title and description, keywords, share image, canonical URL, noindex/nofollow and a JSON-LD override. Everything falls back to the document's own title and summary, then to the defaults in Site Settings (which also holds `siteUrl`).
- **Head** (`web/src/lib/seo.ts`, `Base.astro`): title template, description, canonical, robots, Open Graph and Twitter cards.
- **Meta copy**: edit meta titles, descriptions and keywords in each document's SEO tab. Titles get the site name appended on render, so keep them under ~36 characters.
- **One URL per page**: `trailingSlash: 'never'` in `astro.config.mjs`, so canonical tags, the sitemap and the server's 301s all agree.
- **Structured data** (`web/src/lib/structuredData.ts`): WebSite and Person on every page, WebPage per page, BlogPosting for posts, CreativeWork or SoftwareApplication for works and products, BreadcrumbList on detail pages.
- **Share images on the fly**: `/og/<kind>/<slug>.png` is a server route (`web/src/pages/og/[kind]/[slug].png.ts`) that renders a 1200×630 card with satori from the document's title and summary. Uploading an image in the SEO tab overrides it.
- **Sitemap and robots**: `web/src/pages/sitemap.xml.ts` lists every page, work, product and post from Sanity on request; `robots.txt` points at it. Both exclude `/intro`.
- **Intro pages** are always `noindex, nofollow` and excluded from the sitemap and robots, but still get full meta tags and a generated share image so links unfurl in email and chat.

Set `PUBLIC_SITE_URL` (and `siteUrl` in Site Settings) to the production origin.

## Spotify "Listening now"

`web/src/pages/api/now-playing.json.ts` is an on-demand route on the Node server that refreshes a Spotify access token and returns the current track, or the last one played. The footer player polls it (more often while a track is playing) and stays hidden when there is nothing to show or the env vars are missing.

To wire it up: create an app at developer.spotify.com, authorise it once with the `user-read-currently-playing` and `user-read-recently-played` scopes to obtain a refresh token, then fill the `SPOTIFY_*` values in `web/.env` (and in the Brimble service's environment).

## Deploy

The site is hosted on Brimble as a Node web service, configured by `brimble.toml` at the repo root: `bun install --frozen-lockfile` and `bun run build` from the root (the workspaces share one lockfile), then `npm start`, which runs the standalone Node server from `@astrojs/node`. That server renders every page from Sanity on request (see Caching below) and runs the share-image and Spotify routes. Public env vars are in `brimble.toml`; add the `SPOTIFY_*` secrets and `SANITY_REVALIDATE_SECRET` in the Brimble dashboard. The Studio is hosted by Sanity at https://oluwaferanmi.sanity.studio. It redeploys automatically through GitHub Actions (`.github/workflows/deploy-studio.yml`) on every push to `main` that touches `studio/`, or manually with `bun run --cwd studio deploy`. The workflow needs one repository secret, `SANITY_AUTH_TOKEN` (a token with Deploy Studio permission), and optionally the variables `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET` and `SANITY_STUDIO_STUDIO_HOST`, which default to `1dyyk69c`, `production` and `oluwaferanmi`.

## Caching and revalidation

Pages are server-rendered (`output: "server"`) and kept in Astro's in-memory route cache (`cache` and `routeRules` in `web/astro.config.mjs`), so a repeat visit is served from memory instead of querying Sanity. Every cached route carries the `sanity` tag.

A Sanity webhook posts to `/api/revalidate` on every create, update and delete of a published document. The route checks the signature against `SANITY_REVALIDATE_SECRET` and drops everything tagged `sanity`, so the next visit renders fresh content. Every page reads Site Settings and the home page lists every entry, which is why one publish clears the whole cache rather than single pages. Without the webhook, entries still go stale after an hour and are refreshed in the background.

Set up the webhook once under sanity.io/manage → API → Webhooks: URL `https://feranmiadedokun.com/api/revalidate`, dataset `production`, trigger on create, update and delete, method `POST`, and the same secret as `SANITY_REVALIDATE_SECRET`. The cache lives in the Node process, so it is per instance and empties on each deploy.

## Publishing controls

- **Coming soon** (`comingSoon` on works, products and posts): the entry stays in its list with a "Coming soon" badge but is not clickable, its detail URL returns 404, it is left out of the sitemap, and any Studio link pointing at it renders as plain text with the badge.
- **Hide from the site** (`hidden` on works, products, posts and experience entries): the entry stays in the Studio but disappears from every list, the companies column, routes and the sitemap.

## Accessibility and responsiveness

- Every page has a skip link to `#main`, one `h1`, labelled landmarks (header, main, footer, the "Now playing" aside, the breadcrumb and next-project navs) and `alt` on every image.
- Small inline links and buttons use the `hit` utility, which pads the hit area to 24px+ without moving the layout. Filter chips and the copy pill are sized to the same minimum.
- Text tokens pass WCAG AA: `--color-faint` is 4.95:1 on paper, `--color-muted` 5.9:1, `--color-mist` 7.6:1 on ink.
- `prefers-reduced-motion` disables the reveal, split, rotating word, equaliser, pulse dot and image fades, and turns autoplaying clips into poster-plus-controls.
- Images render as WebP with width descriptors and a `sizes` hint; heroes carry `fetchpriority="high"` and the Sanity CDN is preconnected.
- Dates format in UTC so builds anywhere print the same month. Scroll offsets follow the real header height (`--header-h`).
- Filters and the grid/index view on works sections are kept in the URL (`?category=`, `?view=`).
- **Gate**: `bun run a11y` runs axe-core (WCAG 2.x A/AA and best practices) against every page type of a running build, including `/intro`, the one page on the blue theme, and fails on any violation. `.github/workflows/a11y.yml` runs it on every push and pull request that touches `web/`. Locally: `bun run build`, serve with `HOST=127.0.0.1 PORT=4999 node web/dist/server/entry.mjs`, then `bun run a11y` (or point `A11Y_BASE_URL` at the dev server). Lighthouse on the same build was clean at the last check.
