import { monthYear } from "@/lib/format";
import { siteName, type OgKind } from "@/lib/seo";
import { OG_DOC_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/queries";
import { Resvg } from "@resvg/resvg-js";
import type { APIRoute } from "astro";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { sanityClient } from "sanity:client";
import satori from "satori";

const KIND_TO_TYPE: Record<Exclude<OgKind, "site">, string> = {
  page: "page",
  outreach: "outreach",
  work: "work",
  product: "product",
  post: "post",
};

const COLORS = {
  ink: "#0f0f10",
  paper: "#f1f1ef",
  muted: "#5c5c58",
  faint: "#7d7d78",
  accent: "#2a51c8",
  line: "#d7d7d3",
};

const require = createRequire(import.meta.url);
const fontFile = (weight: 400 | 500 | 600) =>
  readFile(
    require.resolve(
      `@fontsource/geist/files/geist-latin-${weight}-normal.woff`,
    ),
  );
const fonts = Promise.all([fontFile(400), fontFile(500), fontFile(600)]).then(
  ([regular, medium, semibold]) => [
    {
      name: "Geist",
      data: regular,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Geist",
      data: medium,
      weight: 500 as const,
      style: "normal" as const,
    },
    {
      name: "Geist",
      data: semibold,
      weight: 600 as const,
      style: "normal" as const,
    },
  ],
);

const truncate = (text: string, max: number) =>
  text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;

type Card = {
  eyebrow: string;
  title: string;
  description: string | null;
  wordmark: string;
  footer: string;
  portrait: string | null;
  availability: string | null;
};

function titleSize(title: string) {
  if (title.length <= 40) return 76;
  if (title.length <= 80) return 60;
  return 48;
}

const el = (
  type: string,
  style: Record<string, unknown>,
  children?: unknown,
) => ({ type, props: { style, children } });

function card({
  eyebrow,
  title,
  description,
  wordmark,
  footer,
  portrait,
  availability,
}: Card) {
  return el(
    "div",
    {
      width: 1200,
      height: 630,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "56px 64px",
      background: COLORS.paper,
      color: COLORS.ink,
      fontFamily: "Geist",
    },
    [
      el(
        "div",
        {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 22,
        },
        [
          el(
            "div",
            { fontWeight: 600, letterSpacing: "0.08em" },
            wordmark.toUpperCase(),
          ),
          el(
            "div",
            {
              color: COLORS.faint,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            },
            truncate(eyebrow, 48),
          ),
        ],
      ),
      el(
        "div",
        {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 48,
        },
        [
          el(
            "div",
            {
              display: "flex",
              flexDirection: "column",
              gap: 24,
              maxWidth: portrait ? 800 : 1000,
            },
            [
              el("div", {
                width: 64,
                height: 6,
                background: COLORS.accent,
                borderRadius: 3,
              }),
              el(
                "div",
                {
                  fontSize: titleSize(title),
                  fontWeight: 500,
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                },
                title,
              ),
              ...(description
                ? [
                    el(
                      "div",
                      { fontSize: 28, lineHeight: 1.4, color: COLORS.muted },
                      description,
                    ),
                  ]
                : []),
            ],
          ),
          ...(portrait
            ? [
                {
                  type: "img",
                  props: {
                    src: portrait,
                    width: 220,
                    height: 220,
                    style: {
                      borderRadius: 28,
                      objectFit: "cover",
                      flexShrink: 0,
                    },
                  },
                },
              ]
            : []),
        ],
      ),
      el(
        "div",
        {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 22,
          color: COLORS.muted,
          borderTop: `1px solid ${COLORS.line}`,
          paddingTop: 24,
        },
        [
          el("div", {}, footer),
          el("div", { display: "flex", alignItems: "center", gap: 12 }, [
            el("div", {
              width: 10,
              height: 10,
              borderRadius: 5,
              background: COLORS.accent,
            }),
            el("div", {}, availability ?? "Available for work"),
          ]),
        ],
      ),
    ],
  );
}

export const GET: APIRoute = async ({ params }) => {
  const kind = params.kind as OgKind;
  const slug = params.slug ?? "";

  const settings = await sanityClient.fetch(SITE_SETTINGS_QUERY);
  if (!settings) return new Response("Site Settings missing", { status: 500 });

  const name = siteName(settings);
  const wordmark = settings.displayName ?? name;
  const domain = (settings.siteUrl ?? "").replace(/^https?:\/\//, "") || name;
  const type =
    kind in KIND_TO_TYPE
      ? KIND_TO_TYPE[kind as keyof typeof KIND_TO_TYPE]
      : null;
  const doc = type
    ? await sanityClient.fetch(OG_DOC_QUERY, { type, slug })
    : null;

  const portrait = settings.portraitUrl
    ? `${settings.portraitUrl}?w=440&h=440&fit=crop&fm=png`
    : null;
  let content: Card = {
    eyebrow: settings.jobTitle ?? "",
    title: name,
    description: settings.seo?.metaDescription ?? null,
    wordmark,
    footer: domain,
    portrait,
    availability: settings.availabilityLabel ?? null,
  };
  if (doc?.title) {
    const EYEBROW: Record<string, string> = {
      page: name,
      work: "Selected work",
      product: "Product",
      post: "Writing",
      outreach: "Hello",
    };
    let eyebrow = EYEBROW[doc._type] ?? name;
    if (doc._type === "post" && doc.publishedAt)
      eyebrow = `Writing · ${monthYear(doc.publishedAt)}`;
    if ((doc._type === "work" || doc._type === "product") && doc.label)
      eyebrow = `${eyebrow} · ${doc.label}`;
    if (doc._type === "outreach")
      eyebrow = doc.recipient
        ? `For ${doc.recipient}${doc.company ? ` · ${doc.company}` : ""}`
        : (doc.company ?? "Hello");
    content = {
      eyebrow,
      title: truncate(doc.title, 110),
      description: doc.description ? truncate(doc.description, 160) : null,
      wordmark,
      footer: `${settings.fullName} · ${settings.jobTitle}`,
      portrait,
      availability: settings.availabilityLabel ?? null,
    };
  }

  const svg = await satori(card(content) as never, {
    width: 1200,
    height: 630,
    fonts: await fonts,
  });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } })
    .render()
    .asPng();

  return new Response(new Uint8Array(png), {
    headers: {
      "content-type": "image/png",
      "cache-control":
        "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
};
