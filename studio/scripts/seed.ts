/**
 * Seeds and migrates the dataset: pages built from sections, navigation and
 * footer links in Site Settings, experience from LinkedIn, and product links
 * as link objects. Works, products and experience content comes from the v1
 * site, github.com/heisdeku and LinkedIn.
 *
 * Idempotent: pages, works, products and experience are upserted by slug or
 * company; Site Settings is replaced; placeholder posts are recreated.
 *
 *   npm run seed   (needs SANITY_AUTH_TOKEN in studio/.env)
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-20'})

let keyCounter = 0
const key = () => `k${(keyCounter++).toString(36)}`
const ref = (id: string) => ({_type: 'reference', _ref: id})

type LinkInput =
  | {label: string; internal: string; params?: string}
  | {label: string; external: string}
  | {label: string; email: string}
  | {label: string; resume: true}

function linkFields(input: LinkInput) {
  const base = {_key: key(), label: input.label, target: '_self'}
  if ('internal' in input) return {...base, type: 'internal', internal: ref(input.internal), params: input.params}
  if ('external' in input) return {...base, type: 'external', external: input.external, target: '_blank'}
  if ('email' in input) return {...base, type: 'email', email: input.email}
  return {...base, type: 'resume'}
}

const link = (input: LinkInput) => ({_type: 'simpleLink', ...linkFields(input)})
const cta = (input: LinkInput, variant: 'default' | 'secondary' | 'text' = 'default') => ({
  _type: 'cta',
  ...linkFields(input),
  variant,
})

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'p'
const heading = (text: string, type: HeadingTag = 'h2', fontSize?: string) => ({_type: 'heading', text, type, fontSize})

type Inline = string | {text: string; internal: string} | {text: string; href: string}

/** A paragraph from plain strings and linked runs, e.g. ['See ', {text: 'a11ydesk', internal: id}, '.']. */
function paragraph(...parts: Inline[]) {
  const markDefs: Record<string, unknown>[] = []
  const children = parts.map((part) => {
    if (typeof part === 'string') return {_type: 'span', _key: key(), marks: [], text: part}
    const markKey = key()
    markDefs.push(
      'internal' in part
        ? {_type: 'link', _key: markKey, linkType: 'internal', internal: ref(part.internal), openInNewTab: false}
        : {_type: 'link', _key: markKey, linkType: 'external', href: part.href, openInNewTab: true},
    )
    return {_type: 'span', _key: key(), marks: [markKey], text: part.text}
  })
  return {_type: 'block', _key: key(), style: 'normal', markDefs, children}
}

function paragraphs(...texts: string[]) {
  return texts.map((text) => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{_type: 'span', _key: key(), marks: [], text}],
  }))
}

function listItem(text: string, internalId?: string) {
  return {
    _type: 'listItem',
    _key: key(),
    text,
    link: internalId ? link({label: text, internal: internalId}) : undefined,
  }
}

async function upsert(type: string, matchField: string, matchValue: string, doc: Record<string, unknown>) {
  const existingId = await client.fetch<string | null>(`*[_type == $type && ${matchField} == $value][0]._id`, {
    type,
    value: matchValue,
  })
  if (existingId) {
    await client.patch(existingId).set(doc).commit()
    return existingId
  }
  const created = await client.create({_type: type, ...doc})
  return created._id
}

const works = [
  {
    title: 'Couch Technologies',
    slug: 'couch',
    category: 'Web Platform',
    year: 2023,
    role: 'Sole Frontend Developer',
    stack: 'TBC',
    url: 'https://joincouch.co/landing',
    summary:
      'Couch is a therapy platform where I was the only frontend developer for the life of the project, building the user, admin and therapist interfaces and all the logic behind them.',
    scope: ['User interface', 'Admin interface', 'Therapist interface'],
  },
  {
    title: 'Fastrack',
    slug: 'fastrack',
    category: 'Mobile',
    year: 2023,
    role: 'Frontend Developer',
    stack: 'TBC',
    url: 'https://getfastrack.app/',
    summary:
      "Frontend for both the driver and user sides of Fastrack's delivery logistics mobile app, built to the stakeholders' and client's requirements.",
    scope: ['Driver app', 'User app'],
  },
  {
    title: 'Moski Portfolio',
    slug: 'moski',
    category: 'Portfolio',
    year: 2023,
    role: 'Frontend Developer',
    stack: 'SCSS, GSAP, JavaScript',
    url: 'https://mos-ki.com',
    summary:
      "Moski's portfolio page, built with a focus on micro animations, fast load times and responsiveness using SCSS, GSAP and JavaScript.",
    scope: ['Micro-animations', 'Performance', 'Responsive layout'],
  },
  {
    title: 'Maurice Portfolio',
    slug: 'maurice',
    category: 'Portfolio',
    year: 2022,
    role: 'Frontend Developer',
    stack: 'SCSS, GSAP, Locomotive Scroll',
    url: 'https://maurice-victor.netlify.app/',
    summary:
      "Collaborated with Pariola on Maurice's work and about pages. Styled with SCSS, with GSAP and Locomotive Scroll handling the animations.",
    scope: ['Work page', 'About page', 'Scroll animation'],
  },
  {
    title: 'Blaze Agency',
    slug: 'blaze',
    category: 'Concept',
    year: 2022,
    role: 'Frontend Developer',
    stack: 'SCSS, JavaScript',
    url: 'https://blaze-agency.netlify.app/',
    summary:
      'Collaborated with Pariola on a user-focused site for a fictional agency brand, emphasising simplicity, clarity and responsiveness while sharpening SCSS styling and micro-animations in an agile setting.',
    scope: ['Responsive layout', 'Micro-animations'],
  },
]

const products = [
  {
    name: 'a11ydesk',
    slug: 'a11ydesk',
    status: 'live',
    version: 'v0.1',
    tagline:
      'An accessibility design desk: scan multi-page sites across environments, dedupe WCAG findings, capture one screenshot per unique issue and ship client-ready Markdown and Word reports.',
    github: 'https://github.com/heisdeku/a11ydesk',
    features: [
      {title: 'Multi-environment scans', description: 'Run the same scan against local, staging and production, with URLs discovered from static lists, Sanity pages, sitemap.xml or a custom resolver.'},
      {title: 'Design report, not an axe dump', description: 'Design-related issues only (contrast, spacing, targets), deduped sitewide so shared chrome is listed once, each with its own screenshot crop.'},
      {title: 'Markdown and Word output', description: 'Client-ready .md and .docx reports with embedded images, plus a visual mode with full-page annotated HTML dashboards.'},
    ],
    changelog: [{version: 'v0.1', date: '2026-07-27', note: 'First public version on GitHub.'}],
  },
  {
    name: 'clean-injected-loader',
    slug: 'clean-injected-loader',
    status: 'live',
    version: 'v0.1',
    tagline:
      'A safe, git-only tool that detects and removes the injected-loader malware and its eval() backdoor from JavaScript repos, locally, across a folder of checkouts, or across a whole GitHub account.',
    github: 'https://github.com/heisdeku/clean-injected-loader',
    features: [
      {title: 'Never runs the payload', description: 'Uses only git plumbing and text tools. It never runs npm, build scripts or migrations, so the backdoor is never executed while it is being removed.'},
      {title: 'Real work is preserved', description: 'Restores the tampered file to its last clean version on the branch, or surgically strips only the malicious prologue when no clean version exists.'},
      {title: 'Clean or purge', description: 'Add a single fix commit on top, or rewrite history so the malware was never there. Everything happens in a throwaway worktree.'},
    ],
    changelog: [{version: 'v0.1', date: '2026-06-26', note: 'First public version on GitHub.'}],
  },
  {
    name: 'Content Architecture Kit',
    slug: 'content-architecture-kit',
    status: 'live',
    version: 'v0.1',
    tagline:
      'An open, agent-ready Sanity starter in two editions, Next.js 16 and Astro 7, that share one Sanity v6 workspace and the same architectural decisions.',
    github: 'https://github.com/heisdeku/sanity-content-architecture-kit',
    features: [
      {title: 'Schema as a system', description: 'Document roles, field factories with guaranteed type names, and a page builder with a closed section set plus per-document allow and deny lists.'},
      {title: 'Agent-ready in production', description: 'An editor-owned llms.txt, a Markdown twin of every page served via content negotiation, real 404s with a recovery map and a published OpenAPI spec.'},
      {title: 'Production plumbing included', description: 'Staging basic auth, CMS-managed redirects, inherited SEO defaults, OpenGraph images, sitemap, RSS, analytics, forms and a seed dataset.'},
    ],
    changelog: [{version: 'v0.1', date: '2026-09-06', note: 'First public version on GitHub.'}],
  },
  {
    name: 'irth',
    slug: 'irth',
    status: 'inProgress',
    version: 'v0.1',
    tagline: 'Calendly for birthdays. Share a link, friends drop in their birthday details, and you never miss one again.',
    github: 'https://github.com/heisdeku/irth',
    features: [{title: 'One link to share', description: 'Send a single link and let people add their own birthday details.'}],
    changelog: [{version: 'v0.1', date: '2023-02-09', note: 'Project started.'}],
  },
]

// From LinkedIn, most recent first.
const experience = [
  {
    company: 'Anyday',
    location: 'Toronto, Canada · Remote',
    roles: [{title: 'Full Stack Engineer', employmentType: 'contract', startDate: '2025-12-01'}],
  },
  {
    company: 'Zairaa',
    location: 'Lagos, Nigeria · Remote',
    roles: [
      {title: 'Frontend Engineer', employmentType: 'fullTime', startDate: '2025-07-01', endDate: '2026-04-01'},
      {title: 'Frontend Engineer (Mobile)', employmentType: 'contract', startDate: '2025-05-01', endDate: '2025-07-01'},
    ],
  },
  {
    company: 'Ekode Mega Touch Limited',
    location: 'Victoria Island, Lagos · Remote',
    stack: 'React, Next.js',
    roles: [
      {
        title: 'Frontend Engineer',
        employmentType: 'contract',
        startDate: '2024-06-01',
        endDate: '2025-07-01',
        highlights: [
          'Played an instrumental role in launching POS, agency banking and cross-border payment applications and dashboards for a public sector project generating over 100 million Naira per day in transaction volume.',
          'Collaborated with Business and Product operations to keep client relationships strong and retention high through operational support and compliance.',
        ],
      },
    ],
  },
  {
    company: 'The Maker Studio',
    location: 'Remote',
    roles: [
      {title: 'Frontend Engineer', employmentType: 'fullTime', startDate: '2024-01-01', endDate: '2024-12-01'},
      {title: 'Frontend Engineer', employmentType: 'freelance', startDate: '2023-10-01', endDate: '2024-01-01'},
    ],
  },
  {
    company: 'Mira',
    location: 'Lagos, Nigeria · Remote',
    stack: 'React Native, TypeScript',
    roles: [{title: 'Mobile Engineer', employmentType: 'contract', startDate: '2024-06-01', endDate: '2024-08-01'}],
  },
  {
    company: 'Zeddpay',
    url: 'https://zeddpay.com',
    location: 'Delaware, United States · Remote',
    stack: 'React',
    roles: [
      {title: 'Head of Product & Lead Frontend Engineer (Founding Member)', employmentType: 'fullTime', startDate: '2022-08-01', endDate: '2023-06-01'},
      {title: 'Frontend Engineer (Founding Member)', employmentType: 'freelance', startDate: '2021-09-01', endDate: '2022-08-01'},
    ],
  },
  {
    company: 'myStash',
    url: 'https://mystash.ng',
    location: 'United States · Remote',
    stack: 'React, React Native, Next.js, Chakra UI, Strapi',
    roles: [
      {
        title: 'Frontend Engineer (Web & Mobile)',
        employmentType: 'fullTime',
        startDate: '2021-09-01',
        endDate: '2022-04-01',
        highlights: [
          'Overhauled the pause, play and delete flows for money moves.',
          'Redesigned the Cash Reserve UI with a simpler flow for withdrawing and funding.',
          'Redesigned, architected, managed, fixed and built features as requested by the CTO.',
          'Built v1 of the blog with Next.js, Chakra UI and Strapi.',
          'Shipped version 2 of the landing page (React and Chakra UI) that tells the company story better.',
          'Worked with product and engineering on v1 and v2 of the myStash savings app, shipping cross-platform to the App Store and Google Play.',
        ],
      },
    ],
  },
]

async function seed() {
  const workIds: Record<string, string> = {}
  for (const [i, w] of works.entries()) {
    workIds[w.slug] = await upsert('work', 'slug.current', w.slug, {
      title: w.title,
      slug: {_type: 'slug', current: w.slug},
      category: w.category,
      year: w.year,
      role: w.role,
      stack: w.stack,
      url: w.url,
      summary: w.summary,
      scope: w.scope,
      order: i + 1,
    })
  }

  for (const [i, p] of products.entries()) {
    const id = await upsert('product', 'slug.current', p.slug, {
      name: p.name,
      slug: {_type: 'slug', current: p.slug},
      status: p.status,
      version: p.version,
      tagline: p.tagline,
      ctas: [cta({label: 'Source on GitHub', external: p.github}, 'secondary')],
      features: p.features.map((f) => ({_type: 'feature', _key: key(), ...f})),
      changelog: p.changelog.map((entry) => ({_type: 'changelogEntry', _key: key(), ...entry})),
      order: i + 1,
    })
    await client.patch(id).unset(['tryUrl', 'githubUrl', 'links']).commit()
  }

  const staleExperience = await client.fetch<string[]>(`*[_type == "experience" && !defined(roles)]._id`)
  await Promise.all(staleExperience.map((id) => client.delete(id)))
  for (const [i, e] of experience.entries()) {
    await upsert('experience', 'company', e.company, {
      company: e.company,
      url: e.url,
      location: e.location,
      stack: e.stack,
      roles: e.roles.map((r) => ({_type: 'role', _key: key(), ...r})),
      order: i + 1,
    })
  }

  const placeholderPosts = await client.fetch<string[]>(`*[_type == "post" && slug.current match "blog-post-title-*"]._id`)
  await Promise.all(placeholderPosts.map((id) => client.delete(id)))
  const postCount = await client.fetch<number>('count(*[_type == "post"])')
  if (postCount === 0) {
    await client.create({
      _type: 'post',
      title: 'Hello, world',
      slug: {_type: 'slug', current: 'hello-world'},
      publishedAt: '2026-10-20',
      readingTime: 2,
      excerpt: 'A first post to get the writing section going. Replace it with something real.',
      tags: ['Frontend'],
      body: [
        {
          _type: 'block',
          _key: key(),
          style: 'normal',
          markDefs: [{_type: 'link', _key: 'astro', linkType: 'external', href: 'https://astro.build', openInNewTab: true}],
          children: [
            {_type: 'span', _key: key(), marks: [], text: 'Writing goes here. Posts are Portable Text, so links like '},
            {_type: 'span', _key: key(), marks: ['astro'], text: 'this one'},
            {_type: 'span', _key: key(), marks: [], text: ', images and code blocks all come from the editor.'},
          ],
        },
      ],
    })
  }

  // Pages first, so navigation and in-page links can reference them.
  const pageIds: Record<string, string> = {}
  for (const slug of ['home', 'experience', 'products', 'writing', 'intro']) {
    pageIds[slug] = await upsert('page', 'slug.current', slug, {slug: {_type: 'slug', current: slug}})
  }

  await client.patch(pageIds.home).set({
    title: 'Home',
    theme: 'paper',
    chrome: 'full',
    seo: {_type: 'seo', metaDescription: 'Oluwaferanmi is a frontend engineer building user-focused interfaces for web and mobile.'},
    pageBuilder: [
      {
        _type: 'heroSection',
        _key: key(),
        meta: ['Oluwaferanmi Adedokun', 'Web & Mobile Frontend Engineer', 'Based in Lagos, working worldwide'],
        heading: heading('Oluwaferanmi is a <span>frontend engineer</span> building user-focused interfaces for web and mobile.', 'h1', 'XL'),
      },
      {_type: 'worksSection', _key: key(), heading: heading('Selected Works', 'h2', 'XS'), defaultView: 'grid'},
      {
        _type: 'writingSection',
        _key: key(),
        heading: heading('Writing', 'h2', 'XS'),
        link: link({label: 'Visit the blog', internal: pageIds.writing}),
        limit: 3,
        layout: 'split',
      },
      {
        _type: 'infoSection',
        _key: key(),
        heading: heading('Information', 'h2', 'XS'),
        body: paragraphs(
          'A creative and passionate Front-end Engineer with 5 years of experience developing pixel-perfect user interfaces and building scalable web and mobile applications. I tackle complex problems and deliver high-quality results with a high degree of proficiency. Proficient in Vue, React, and React Native.',
        ),
        columns: [
          {
            _type: 'infoColumn',
            _key: key(),
            label: 'Previous Experience',
            source: 'experience',
            link: link({label: 'Full experience', internal: pageIds.experience}),
          },
          {
            _type: 'infoColumn',
            _key: key(),
            label: 'Tools',
            source: 'manual',
            items: ['TypeScript', 'React', 'React Native', 'Vue', 'Astro', 'Sanity', 'Node & Express', 'SCSS', 'GSAP', 'PostgreSQL', 'MongoDB'],
          },
        ],
      },
    ],
  }).commit()

  await client.patch(pageIds.experience).set({
    title: 'Experience',
    theme: 'paper',
    chrome: 'full',
    pageBuilder: [
      {
        _type: 'pageHeading',
        _key: key(),
        heading: heading('Experience', 'h1', '3XL'),
        description: paragraphs('5 years building pixel-perfect interfaces and scalable web and mobile applications.'),
        cta: cta({label: 'Download résumé', resume: true}),
      },
      {_type: 'experienceSection', _key: key(), openFirst: true},
    ],
  }).commit()

  await client.patch(pageIds.products).set({
    title: 'Products',
    theme: 'paper',
    chrome: 'full',
    pageBuilder: [
      {_type: 'pageHeading', _key: key(), heading: heading('Products', 'h1', '3XL')},
      {_type: 'productsSection', _key: key()},
    ],
  }).commit()

  await client.patch(pageIds.writing).set({
    title: 'Writing',
    theme: 'paper',
    chrome: 'full',
    pageBuilder: [
      {_type: 'pageHeading', _key: key(), heading: heading('Writing', 'h1', '3XL')},
      {_type: 'writingSection', _key: key(), layout: 'stack'},
    ],
  }).commit()

  await client.patch(pageIds.intro).set({
    title: 'Intro',
    theme: 'accent',
    chrome: 'minimal',
    seo: {_type: 'seo', metaTitle: 'Hello from Oluwaferanmi', noIndex: true, noFollow: true},
    pageBuilder: [
      {
        _type: 'introSection',
        _key: key(),
        greeting: 'Hi there,',
        heading: heading(
          "I'm Oluwaferanmi, a frontend engineer with 5 years of experience building web and mobile interfaces in Vue, React and React Native.",
          'h1',
          'XXL',
        ),
      },
      {
        _type: 'listColumnsSection',
        _key: key(),
        columns: [
          {
            _type: 'listColumn',
            _key: key(),
            label: 'How I can help',
            items: ['Web applications', 'Mobile apps in React Native', 'Marketing and portfolio sites with motion', 'Sanity-powered content sites'].map((text) => listItem(text)),
          },
          {
            _type: 'listColumn',
            _key: key(),
            label: 'Recent work',
            items: [
              listItem('Couch Technologies', workIds.couch),
              listItem('Fastrack', workIds.fastrack),
              listItem('Moski Portfolio', workIds.moski),
            ],
          },
          {
            _type: 'listColumn',
            _key: key(),
            label: 'Quick facts',
            items: ['Based in Lagos, working worldwide', 'Available for work', 'Open to contract and full-time roles'].map((text) => listItem(text)),
          },
        ],
      },
      {
        _type: 'contactSection',
        _key: key(),
        heading: heading('Reply to my email, or write to', 'p', 'XS'),
        emailSubject: 'Hello Oluwaferanmi',
        ctas: [
          cta({label: 'Download résumé', resume: true}),
          cta({label: 'LinkedIn', external: 'https://linkedin.com/in/feranmi-deku'}, 'secondary'),
          cta({label: 'GitHub', external: 'https://github.com/heisdeku'}, 'secondary'),
        ],
      },
    ],
  }).commit()

  const experienceIds = Object.fromEntries(
    (await client.fetch<{company: string; _id: string}[]>(`*[_type == "experience"]{company, _id}`)).map((e) => [e.company, e._id]),
  )
  const productIds = Object.fromEntries(
    (await client.fetch<{slug: string; _id: string}[]>(`*[_type == "product"]{"slug": slug.current, _id}`)).map((p) => [p.slug, p._id]),
  )
  const reachId = await upsert('outreach', 'slug.current', 'reach-ai', {slug: {_type: 'slug', current: 'reach-ai'}})
  await client.patch(reachId).set({
    title: 'Reach AI · Frontend Engineer',
    recipient: 'José Velez',
    company: 'Reach AI',
    theme: 'paper',
    chrome: 'minimal',
    seo: {_type: 'seo', metaTitle: 'Oluwaferanmi for Reach AI'},
    pageBuilder: [
      {
        _type: 'introSection',
        _key: key(),
        greeting: 'Hi José,',
        heading: heading(
          "I'm Oluwaferanmi, a frontend engineer with 5 years of experience building <span>product interfaces for B2B and fintech teams</span>. I'd like to help Reach build the OS that wins AI search.",
          'h1',
          'XXL',
        ),
        description: paragraphs(
          'You said Reach is hiring across Portugal and the US. This page is my application for a Frontend Engineer role: the roles that are relevant, the work behind them, and why I think I fit.',
        ),
      },
      {
        _type: 'experienceSection',
        _key: key(),
        heading: heading('Relevant roles', 'h2', 'XS'),
        entries: ['Anyday', 'Ekode Mega Touch Limited', 'Zeddpay', 'myStash']
          .map((company) => experienceIds[company])
          .filter(Boolean)
          .map((id) => ({_type: 'reference', _key: key(), _ref: id})),
        openFirst: true,
      },
      {
        _type: 'worksSection',
        _key: key(),
        heading: heading('Selected Works', 'h2', 'XS'),
        works: [workIds.couch, workIds.fastrack].map((id) => ({_type: 'reference', _key: key(), _ref: id})),
        defaultView: 'index',
      },
      {
        _type: 'richTextSection',
        _key: key(),
        heading: heading('Why hire me?', 'h2', 'XS'),
        body: [
          ...paragraphs(
            'Reach turns SEO and AEO data into a workspace where marketing teams and agents work a roadmap together. That is a product with dashboards, dense data, long-running agent jobs and a lot of states to get right. It is the kind of interface I have spent the last five years building.',
            'At Ekode I shipped the dashboards behind POS, agency banking and cross-border payments for a public sector project moving over 100 million Naira a day, working directly with business and product operations. At Zeddpay I was a founding member, leading frontend and product as the company found its footing. At myStash I owned web and mobile, from the savings app on both stores to the marketing site and a Next.js blog on a headless CMS. Today at Anyday I work full stack on client products built on Sanity, Next.js and Astro.',
          ),
          paragraph(
            'Two things I think matter for Reach specifically. First, I build content-driven, SEO-aware frontends for a living: structured data, fast static pages, headless CMS integrations, and tooling like ',
            {text: 'a11ydesk', internal: productIds.a11ydesk},
            ' and the ',
            {text: 'Content Architecture Kit', internal: productIds['content-architecture-kit']},
            ' on ',
            {text: 'my GitHub', href: 'https://github.com/heisdeku'},
            '. I understand the pages your platform recommends to customers because I build them. Second, I have worked remotely across time zones for years, from Lagos with teams in the US and Europe, and I am comfortable owning a surface end to end with a small team.',
          ),
          ...paragraphs('I would be glad to walk through any of this on a call, or to take a small scoped task first if that is easier.'),
        ],
      },
      {
        _type: 'contactSection',
        _key: key(),
        heading: heading('Book a call, or write to', 'p', 'XS'),
        emailSubject: 'Frontend Engineer at Reach AI',
        ctas: [
          cta({label: 'Book 30 minutes', external: 'https://calendly.com/heyferanmi/30min'}),
          cta({label: 'Email me', email: 'heyferanmi@gmail.com'}, 'secondary'),
          cta({label: 'LinkedIn', external: 'https://linkedin.com/in/feranmi-deku'}, 'secondary'),
          cta({label: 'Download résumé', resume: true}, 'secondary'),
        ],
      },
    ],
  }).commit()

  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    displayName: 'Oluwaferanmi',
    fullName: 'Oluwaferanmi Adedokun',
    jobTitle: 'Web & Mobile Frontend Engineer',
    timeZone: 'Africa/Lagos',
    timeZoneLabel: 'Lagos',
    availableForWork: true,
    email: 'heyferanmi@gmail.com',
    showListeningPlayer: true,
    navigation: [
      link({label: 'Work', internal: pageIds.home, params: '#works'}),
      link({label: 'Products', internal: pageIds.products}),
      link({label: 'Experience', internal: pageIds.experience}),
      link({label: 'Writing', internal: pageIds.home, params: '#writing'}),
      link({label: 'Contact', internal: pageIds.intro}),
    ],
    footerLinks: [
      link({label: 'GitHub', external: 'https://github.com/heisdeku'}),
      link({label: 'LinkedIn', external: 'https://linkedin.com/in/feranmi-deku'}),
    ],
    footerPrompt: 'Have a project in mind?',
    siteUrl: 'https://feranmiadedokun.com',
    siteTitle: 'Oluwaferanmi Adedokun',
    seo: {
      _type: 'seo',
      metaDescription: 'Web and mobile frontend engineer based in Lagos, working worldwide.',
    },
  })

  const introPage = await client.fetch<string | null>(`*[_id == "introPage"][0]._id`)
  if (introPage) await client.delete(introPage)

  console.log(
    `Seeded ${Object.keys(pageIds).length} pages, 1 intro page, ${works.length} works, ${products.length} products, ${experience.length} experience entries and Site Settings.`,
  )
}

seed().catch((error) => {
  console.error(error)
  throw error
})
