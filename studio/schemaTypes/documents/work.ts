import {CaseIcon} from '@sanity/icons/Case'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {comingSoonField, hiddenField, manualOrdering, orderField} from './listingFields'
import {SlugWithUrlInput} from '../../components/SlugWithUrlInput'

export const work = defineType({
  name: 'work',
  title: 'Work',
  type: 'document',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      components: {input: SlugWithUrlInput},
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    hiddenField,
    comingSoonField,
    defineField({
      name: 'category',
      description: 'e.g. Web Platform, Mobile, Portfolio',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      type: 'number',
      validation: (rule) => rule.required().integer().min(2000),
    }),
    defineField({
      name: 'role',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'stack',
      description: 'Comma-separated list of technologies',
      type: 'string',
    }),
    defineField({name: 'url', title: 'Live URL', type: 'url'}),
    defineField({name: 'client', type: 'string'}),
    defineField({
      name: 'timeline',
      description: 'e.g. "Jan 2026 — May 2026" or "6 weeks"',
      type: 'string',
    }),
    defineField({
      name: 'collaborators',
      description: 'People you built it with, one per entry',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'links',
      description: 'Live site, App Store, repository… shown in the case study sidebar',
      type: 'array',
      of: [defineArrayMember({type: 'simpleLink'})],
    }),
    defineField({
      name: 'summary',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroImage',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', type: 'string', title: 'Alternative text'})],
    }),
    defineField({
      name: 'hoverImage',
      title: 'Hover image',
      description: 'Swapped in when the card is hovered on the work grid. A GIF works too.',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', type: 'string', title: 'Alternative text'})],
    }),
    defineField({
      name: 'gallery',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [defineField({name: 'alt', type: 'string', title: 'Alternative text'})],
        }),
      ],
    }),
    defineField({
      name: 'body',
      description: 'Optional longer case study below the overview',
      type: 'portableText',
    }),
    defineField({name: 'seo', type: 'seo'}),
    orderField,
  ],
  orderings: [manualOrdering],
  preview: {
    select: {title: 'title', subtitle: 'category', media: 'heroImage'},
  },
})
