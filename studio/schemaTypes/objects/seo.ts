import {defineField, defineType} from 'sanity'

/** Per-document SEO overrides. Everything falls back to the document's own title and summary. */
export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      description: 'Browser tab and search result title. Keep under 60 characters.',
      type: 'string',
      validation: (rule) =>
        rule.max(70).warning('Titles over 60 characters get cut off in search results'),
    }),
    defineField({
      name: 'metaDescription',
      description: 'Shown under the title in search results. Aim for 120 to 160 characters.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(170).warning('Descriptions over 160 characters get cut off'),
    }),
    defineField({
      name: 'keywords',
      description: 'Comma-separated keywords related to this page',
      type: 'string',
    }),
    defineField({
      name: 'ogImage',
      title: 'Share image',
      description: '1200 × 630. Leave empty to generate one from the title automatically.',
      type: 'image',
    }),
    defineField({
      name: 'canonicalUrl',
      description: 'Only when this page is a copy of another URL',
      type: 'url',
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'noFollow',
      title: 'Do not follow links on this page',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'structuredData',
      title: 'Structured data (JSON-LD)',
      description:
        'Usually leave empty. Anything pasted here replaces the generated description of this page.',
      type: 'text',
      rows: 8,
    }),
  ],
})
