import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
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
      name: 'publishedAt',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'readingTime',
      description: 'Minutes',
      type: 'number',
      validation: (rule) => rule.integer().positive(),
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tags',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'body',
      type: 'portableText',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'seo', type: 'seo'}),
  ],
  orderings: [
    {title: 'Newest first', name: 'publishedAtDesc', by: [{field: 'publishedAt', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'title', subtitle: 'publishedAt'},
  },
})
