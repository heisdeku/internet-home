# Portfolio

Sanity Studio and Astro site side by side, built from the "Portfolio redesign concept" Claude Design.

```
portfolio/
├── studio/   # Sanity Studio (project 1dyyk69c, dataset production)
└── web/      # Astro site (Tailwind v4, @sanity/astro, Vercel adapter)
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
- `web/.env` — `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, `PUBLIC_SITE_URL`, `PUBLIC_GA_MEASUREMENT_ID` (Google Analytics) and `PUBLIC_BRIMBLE_WEBSITE_ID` (Brimble analytics) and `PUBLIC_QUALITY_SITE_ID` (Quality comment widget; empty disables any of the three tags) and the three `SPOTIFY_*` values for the "Listening now" player. Copy `web/.env.example` to get started.

## Content model

Pages are composed in the Studio, following the AAIF conventions: a `page` document holds a `pageBuilder` array of sections; headings are `heading` objects (text plus tag and size, with `<span>` marking the accent phrase); descriptions are `portableText`; every link is a `simpleLink` or `cta` object (internal document, URL, relative path, email, phone, or the résumé file, plus target and URL parameters; `cta` adds a button variant); navigation lives in Site Settings. Nothing about page structure or links is hardcoded in the Astro app.

| Type | What it is |
| --- | --- |
| `siteSettings` (singleton) | Identity, email, résumé file, header links, footer links, SEO defaults |
| `page` | Slug (`home` is the front page), theme, chrome, SEO and the page builder. Rendered by `web/src/pages/[...slug].astro` |
| `outreach` ("Intro page") | A personalised page at `/intro/<slug>` for job applications, cold emails and outreach, with the same page builder. `noindex` by default. See `/intro/reach-ai` for a sample |
| `work`, `product`, `post` | Detail documents under `/work`, `/products` and `/writing`. Posts and the optional work body are Portable Text |
| `experience` | A company with its roles (title, employment type, dates, highlights) |

Sections: hero, page heading (heading, description, button), works (pick which works, grid/index), products grid, writing list, information (text plus columns that can list companies from Experience), experience (pick which companies), intro greeting (supports `?to=Acme` on `/intro`), list columns, contact band (email plus buttons), rich text.

Adding a section: define it in `studio/schemaTypes/sections`, register it in `schemaTypes/pageBuilder.ts` and `schemaTypes/index.ts`, project its fields in `PAGE_BUILDER` (`web/src/sanity/queries.ts`), run `bun run typegen`, then add a component under `web/src/components/sections` and a case in `PageBuilder.astro`.

## Scripts (from the root)

| Script | What it does |
| --- | --- |
| `bun run schema:deploy` | Pushes the schema to Sanity so MCP and agent tooling can see it |
| `bun run typegen` | Extracts the schema and generates `web/src/sanity/types.ts` from the GROQ queries. Re-run after changing schema or queries |

## Motion

The feel borrows from pariola.work and victorwilliams.me. Everything respects `prefers-reduced-motion`.

- **Smooth scroll** with Lenis (`web/src/scripts/lenis.ts`), including eased in-page anchor jumps that clear the sticky header.
- **Reveal on enter**: add `data-reveal` to one element, or `data-reveal-stagger` to a container whose children should blur-up one after another (`web/src/scripts/reveal.ts`, styles under "Reveal" in `global.css`).
- **Micro-interactions** as Tailwind utilities in `global.css`: `link-underline` (sliding underline), `dim-siblings` (hovering one row quietens the rest), `wordmark-more` (the header name grows to the full name), `img-frame` (pixelated LQIP that the real image fades over once decoded).
- Icons come from [Reicon](https://reicon.dev) via `reicon-astro`, imported per icon (`reicon-astro/icons/ArrowRight.astro`). `SmartLink` adds the matching arrow for a link's type with `icon="auto"`, so link labels in the Studio stay plain text.
- Pill buttons press down slightly, arrows nudge on hover, and the Experience accordion eases open in browsers that support `::details-content`.
- **Page transitions**: Astro's `ClientRouter` swaps pages in place with a cross-fade; a work's cover image morphs from the grid card into the case-study hero (`transition:name="work-<slug>"`). Every script boots from `astro:page-load`, so new page content is wired up after each navigation.
- **Split headings**: display-size headings (`XL` and up) and case-study titles carry `data-split` and rise in word by word.
- **Brand links**: company names (link type "Company", referencing an Experience entry with its URL, logo and brand colour) and tool names (link type "Tool or language", looked up in `simple-icons` by name via `lib/toolIcons.ts`) take the brand colour on hover and show a mark (`BrandLink.astro`). In running text the mark floats above the word so the line never reflows (`mode="float"`); in the Information lists it slides in beside the name (`mode="slide"`). Company marks are uploaded on the Experience document.
- **Footer social marks**: external footer links whose host is a known network (GitHub, LinkedIn, X, Instagram, Dribbble, Behance, YouTube, Spotify, Medium, dev.to) render as marks with the label kept for assistive tech (`lib/socialIcons.ts`); other links keep their text.
- **Accordion**: `<details data-accordion>` panels animate open and closed by height (`scripts/accordion.ts`), so the experience list glides in every browser including iOS Safari.
- **Rotating word**: inside any heading text, `<rotate>frontend|mobile|backend</rotate>` cycles its options with a slide every couple of seconds (`scripts/rotate.ts`); it sits beside the `<span>` accent markup the Studio's title input already supports.
- **Works grid**: the home page shows the first six (`limit`) with an "All work" link; the `/work` page shows everything with category filter chips (`showFilters`). Both have the grid/index toggle and a hover image that swaps in over the cover.
- **Media in rich text**: `image` (with caption), `imageGrid` (2–4 up), `video` (uploaded file or direct URL, poster, autoplay loop or play button) and `embed` (YouTube, Vimeo, Loom links become players; any other iframe URL works, with a chosen aspect ratio). All Sanity images are served as WebP.
- **Case studies**: a sticky fact sheet (role, client, timeline, year, stack, team, scope, links) beside the long read, `h2` rendered as small labels, Sparkle bullets, natural-aspect figures, image grids, video and embed blocks, then a table of the other projects.


## SEO

Follows the same approach as the AAIF and Medspa sites.

- **Per-document `seo` object**: meta title and description, keywords, share image, canonical URL, noindex/nofollow and a JSON-LD override. Everything falls back to the document's own title and summary, then to the defaults in Site Settings (which also holds `siteUrl`).
- **Head** (`web/src/lib/seo.ts`, `Base.astro`): title template, description, canonical, robots, Open Graph and Twitter cards.
- **Meta copy**: edit meta titles, descriptions and keywords in each document's SEO tab. Titles get the site name appended on render, so keep them under ~36 characters.
- **One URL per page**: `trailingSlash: 'never'` in `astro.config.mjs`, so canonical tags, the sitemap and the server's 301s all agree.
- **Structured data** (`web/src/lib/structuredData.ts`): WebSite and Person on every page, WebPage per page, BlogPosting for posts, CreativeWork or SoftwareApplication for works and products, BreadcrumbList on detail pages.
- **Share images on the fly**: `/og/<kind>/<slug>.png` is a server route (`web/src/pages/og/[kind]/[slug].png.ts`) that renders a 1200×630 card with satori from the document's title and summary. Uploading an image in the SEO tab overrides it.
- **Sitemap and robots**: `@astrojs/sitemap` builds `sitemap-index.xml` from the static routes; `robots.txt` points at it. Both exclude `/intro`.
- **Intro pages** are always `noindex, nofollow` and excluded from the sitemap and robots, but still get full meta tags and a generated share image so links unfurl in email and chat.

Set `PUBLIC_SITE_URL` (and `siteUrl` in Site Settings) to the production origin.

## Spotify "Listening now"

`web/src/pages/api/now-playing.json.ts` is an on-demand route (runs as a Vercel function) that refreshes a Spotify access token and returns the current track. The footer player polls it every 30 seconds and stays hidden when nothing is playing or the env vars are missing.

To wire it up: create an app at developer.spotify.com, authorise it once with the `user-read-currently-playing` scope to obtain a refresh token, then fill the `SPOTIFY_*` values in `web/.env` (and in the Vercel project settings).

## Deploy

The site is hosted on Brimble as a Node web service, configured by `brimble.toml` at the repo root: `bun install --frozen-lockfile` and `bun run build` from the root (the workspaces share one lockfile), then `npm start`, which runs the standalone Node server from `@astrojs/node`. That server serves the prerendered pages and runs the share-image and Spotify routes on demand. Public env vars are in `brimble.toml`; add the `SPOTIFY_*` secrets in the Brimble dashboard. The Studio is hosted by Sanity at https://oluwaferanmi.sanity.studio. It redeploys automatically through GitHub Actions (`.github/workflows/deploy-studio.yml`) on every push to `main` that touches `studio/`, or manually with `bun run --cwd studio deploy`. The workflow needs one repository secret, `SANITY_AUTH_TOKEN` (a token with Deploy Studio permission), and optionally the variables `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET` and `SANITY_STUDIO_STUDIO_HOST`, which default to `1dyyk69c`, `production` and `oluwaferanmi`.

## Publishing controls

- **Coming soon** (`comingSoon` on works, products and posts): the entry stays in its list with a "Coming soon" badge but is not clickable, no detail page is built, it is left out of the sitemap, and any Studio link pointing at it renders as plain text with the badge.
- **Hide from the site** (`hidden` on works, products, posts and experience entries): the entry stays in the Studio but disappears from every list, the companies column, routes and the sitemap.

## Accessibility and responsiveness

- Every page has a skip link to `#main`, one `h1`, labelled landmarks (header, main, footer, the "Now playing" aside, the breadcrumb and next-project navs) and `alt` on every image.
- Small inline links and buttons use the `hit` utility, which pads the hit area to 24px+ without moving the layout. Filter chips and the copy pill are sized to the same minimum.
- Text tokens pass WCAG AA: `--color-faint` is 4.95:1 on paper, `--color-muted` 5.9:1, `--color-mist` 7.6:1 on ink.
- `prefers-reduced-motion` disables the reveal, split, rotating word, equaliser, pulse dot and image fades, and turns autoplaying clips into poster-plus-controls.
- Images render as WebP with width descriptors and a `sizes` hint; heroes carry `fetchpriority="high"` and the Sanity CDN is preconnected.
- Dates format in UTC so builds anywhere print the same month. Scroll offsets follow the real header height (`--header-h`).
- Filters and the grid/index view on works sections are kept in the URL (`?category=`, `?view=`).
- Audit with Lighthouse against a production build (`bun run build && HOST=127.0.0.1 PORT=4999 node web/dist/server/entry.mjs`), and axe-core in the browser; both were clean at the last check.
