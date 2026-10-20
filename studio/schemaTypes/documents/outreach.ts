import {EnvelopeIcon} from '@sanity/icons/Envelope'
import {defineField, defineType} from 'sanity'
import {pageBuilderField} from '../pageBuilder'

/** A personalised intro page at /intro/[slug], for job applications, cold emails and outreach. Never indexed. */
export const outreach = defineType({
  name: 'outreach',
  title: 'Intro page',
  type: 'document',
  icon: EnvelopeIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'settings', title: 'Settings'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      description: 'Internal name, e.g. "Reach AI · Frontend Engineer"',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      description: 'The page lives at /intro/<slug>',
      type: 'slug',
      group: 'content',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'recipient', description: 'Who this page is for', type: 'string', group: 'content'}),
    defineField({name: 'company', type: 'string', group: 'content'}),
    {...pageBuilderField, group: 'content'},
    defineField({
      name: 'theme',
      type: 'string',
      group: 'settings',
      options: {
        list: [
          {title: 'Paper', value: 'paper'},
          {title: 'Blue', value: 'accent'},
        ],
        layout: 'radio',
      },
      initialValue: 'paper',
    }),
    defineField({
      name: 'chrome',
      title: 'Header and footer',
      type: 'string',
      group: 'settings',
      options: {
        list: [
          {title: 'Minimal header, no footer', value: 'minimal'},
          {title: 'Full site header and footer', value: 'full'},
        ],
        layout: 'radio',
      },
      initialValue: 'minimal',
    }),
    defineField({name: 'seo', type: 'seo', group: 'seo'}),
  ],
  preview: {
    select: {title: 'title', slug: 'slug.current', company: 'company'},
    prepare: ({title, slug, company}) => ({title, subtitle: `/intro/${slug}${company ? ` · ${company}` : ''}`}),
  },
})
