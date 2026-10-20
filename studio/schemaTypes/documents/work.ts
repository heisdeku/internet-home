import {CaseIcon} from '@sanity/icons/Case'
import {defineArrayMember, defineField, defineType} from 'sanity'

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
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
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
    defineField({
      name: 'summary',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'scope',
      description: 'What the work covered, one item per line',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'heroImage',
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
    defineField({
      name: 'order',
      description: 'Lower numbers appear first',
      type: 'number',
      validation: (rule) => rule.required().integer(),
    }),
  ],
  orderings: [{title: 'Manual order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'title', subtitle: 'category', media: 'heroImage'},
  },
})
