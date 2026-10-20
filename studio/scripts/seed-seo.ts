/**
 * Fills the SEO fields (meta title, description, keywords) for every public
 * document. The site name is appended to titles on render (~24 chars), so
 * titles here stay under 36 characters and descriptions between 120 and 160,
 * which is what search results display in full. Re-run to reset; edit in
 * the Studio to fine-tune.
 *
 *   bun run --cwd studio seed:seo
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-20'})

type Seo = {metaTitle: string; metaDescription: string; keywords?: string; noIndex?: boolean; noFollow?: boolean}

const NAME = 'Oluwaferanmi Adedokun'

const settingsSeo: Seo = {
  metaTitle: `${NAME} — Web & Mobile Frontend Engineer`,
  metaDescription:
    'Oluwaferanmi Adedokun is a frontend engineer in Lagos building web and mobile products with React, React Native, Vue, Astro and Sanity. Available for remote work.',
  keywords: 'Oluwaferanmi Adedokun, frontend engineer Lagos, React Native developer Nigeria, React developer, Astro Sanity developer, web and mobile engineer',
}

const pages: Record<string, Seo> = {
  home: {
    metaTitle: `${NAME} — Web & Mobile Frontend Engineer`,
    metaDescription:
      'Portfolio of Oluwaferanmi Adedokun, a frontend engineer in Lagos with 5 years of experience shipping web and mobile products in React, React Native, Vue and Astro.',
    keywords: 'Oluwaferanmi Adedokun, frontend engineer portfolio, React Native engineer Lagos, Vue developer, frontend developer Nigeria, remote frontend engineer',
  },
  experience: {
    metaTitle: 'Frontend engineer experience',
    metaDescription:
      'Roles held by Oluwaferanmi Adedokun: Anyday, Zairaa, Ekode Mega Touch, The Maker Studio, Mira, Zeddpay and myStash. Fintech dashboards, mobile apps and content sites.',
    keywords: 'frontend engineer experience, fintech frontend developer, React Native contract engineer, founding frontend engineer, remote engineer Lagos',
  },
  products: {
    metaTitle: 'Open source products',
    metaDescription:
      'Open source tools by Oluwaferanmi Adedokun: a11ydesk accessibility reports, clean-injected-loader malware cleanup, and a Sanity content architecture kit.',
    keywords: 'open source frontend tools, accessibility audit tool, Sanity starter kit, Astro Sanity template, npm malware cleanup tool',
  },
  writing: {
    metaTitle: 'Writing on frontend engineering',
    metaDescription:
      'Articles by Oluwaferanmi Adedokun on frontend engineering: React and React Native, Astro, Sanity content modelling, animation, accessibility and shipping products.',
    keywords: 'frontend engineering blog, React Native articles, Astro blog, Sanity CMS tutorials, web animation, accessibility',
  },
}

const works: Record<string, Seo> = {
  couch: {
    metaTitle: 'Couch — therapy platform frontend',
    metaDescription:
      'Case study: Oluwaferanmi built the user, admin and therapist interfaces for Couch, a therapy platform, as its sole frontend developer. Web platform, 2023.',
    keywords: 'therapy platform frontend, healthtech web app, React frontend case study, admin dashboard, sole frontend developer',
  },
  fastrack: {
    metaTitle: 'Fastrack — delivery logistics app',
    metaDescription:
      'Case study: the driver and user sides of the Fastrack delivery logistics mobile app, built by Oluwaferanmi Adedokun to stakeholder and client requirements. 2023.',
    keywords: 'delivery app frontend, logistics mobile app, React Native case study, driver app, Nigeria mobile app developer',
  },
  moski: {
    metaTitle: 'Moski portfolio site',
    metaDescription:
      'Case study: a portfolio site for Moski focused on micro animations, fast load times and responsiveness, built with SCSS, GSAP and JavaScript by Oluwaferanmi Adedokun.',
    keywords: 'portfolio website developer, GSAP animations, SCSS, fast portfolio site, creative frontend developer',
  },
  maurice: {
    metaTitle: 'Maurice portfolio site',
    metaDescription:
      'Case study: work and about pages for Maurice’s portfolio, built with Pariola. SCSS styling with GSAP and Locomotive Scroll animations by Oluwaferanmi Adedokun. 2022.',
    keywords: 'portfolio website, Locomotive Scroll, GSAP, SCSS, creative developer collaboration',
  },
  blaze: {
    metaTitle: 'Blaze agency concept site',
    metaDescription:
      'Case study: a concept site for a fictional agency built with Pariola, focused on simplicity, clarity, responsiveness and micro-animations. Frontend by Oluwaferanmi. 2022.',
    keywords: 'agency website concept, responsive website, micro animations, SCSS, frontend developer',
  },
}

const products: Record<string, Seo> = {
  a11ydesk: {
    metaTitle: 'a11ydesk — accessibility reports',
    metaDescription:
      'a11ydesk scans multi-page sites across environments, dedupes WCAG findings, captures one screenshot per issue and ships client-ready Markdown and Word reports.',
    keywords: 'accessibility audit tool, WCAG report generator, pa11y, accessibility design report, open source a11y tool',
  },
  'clean-injected-loader': {
    metaTitle: 'Remove injected-loader malware',
    metaDescription:
      'A safe, git-only tool that detects and removes the injected-loader malware and its eval() backdoor from JavaScript repositories without ever executing the payload.',
    keywords: 'injected loader malware, npm supply chain malware cleanup, git malware removal tool, eval backdoor, JavaScript repo security',
  },
  'content-architecture-kit': {
    metaTitle: 'Content Architecture Kit for Sanity',
    metaDescription:
      'An open, agent-ready Sanity starter in Next.js 16 and Astro 7 editions that share one Sanity v6 workspace: page builder, SEO, redirects, forms and production plumbing.',
    keywords: 'Sanity starter kit, Astro Sanity template, Next.js Sanity template, page builder schema, headless CMS architecture',
  },
  irth: {
    metaTitle: 'irth — Calendly for birthdays',
    metaDescription:
      'irth is a small app in progress by Oluwaferanmi Adedokun: share one link, let friends add their birthday details, and never miss a birthday again.',
    keywords: 'birthday reminder app, birthday collection link, side project, Next.js app',
  },
}

// Intro pages are always noindex on the frontend; this only shapes the preview card.
const outreach: Record<string, Seo> = {
  'reach-ai': {
    metaTitle: 'Oluwaferanmi for Reach AI',
    metaDescription:
      'Oluwaferanmi Adedokun’s application for the Frontend Engineer role at Reach AI: relevant roles, selected works, why he is a fit, and how to get in touch.',
    noIndex: true,
    noFollow: true,
  },
}

// The placeholder post is kept out of the index until real writing replaces it.
const posts: Record<string, Seo> = {
  'hello-world': {
    metaTitle: 'Hello, world — Writing',
    metaDescription: 'A first post to get the writing section going.',
    noIndex: true,
  },
}

async function patchBySlug(type: string, entries: Record<string, Seo>) {
  for (const [slug, seo] of Object.entries(entries)) {
    const id = await client.fetch<string | null>(`*[_type == $type && slug.current == $slug][0]._id`, {type, slug})
    if (!id) {
      console.warn(`skip ${type}/${slug}: not found`)
      continue
    }
    await client
      .patch(id)
      .setIfMissing({seo: {_type: 'seo'}})
      .set(Object.fromEntries(Object.entries(seo).map(([k, v]) => [`seo.${k}`, v])))
      .commit()
  }
}

await client
  .patch('siteSettings')
  .setIfMissing({seo: {_type: 'seo'}})
  .set({'seo.metaTitle': settingsSeo.metaTitle, 'seo.metaDescription': settingsSeo.metaDescription, 'seo.keywords': settingsSeo.keywords})
  .commit()
await patchBySlug('page', pages)
await patchBySlug('work', works)
await patchBySlug('product', products)
await patchBySlug('outreach', outreach)
await patchBySlug('post', posts)
console.log('SEO fields seeded.')
