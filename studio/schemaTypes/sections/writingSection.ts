import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {defineField, defineType} from 'sanity'
import {visibilityFields, visibilityFieldset} from './visibility'

export const writingSection = defineType({
  name: 'writingSection',
  title: 'Writing',
  type: 'object',
  icon: DocumentTextIcon,
  fieldsets: [visibilityFieldset],
  fields: [
    defineField({name: 'heading', type: 'heading'}),
    defineField({name: 'link', description: 'e.g. "Visit the blog"', type: 'simpleLink'}),
    defineField({
      name: 'limit',
      description: 'Leave empty to list every post',
      type: 'number',
      validation: (rule) => rule.integer().positive(),
    }),
    defineField({
      name: 'layout',
      type: 'string',
      options: {
        list: [
          {title: 'Split (heading beside the list)', value: 'split'},
          {title: 'Stacked with excerpts', value: 'stack'},
        ],
        layout: 'radio',
      },
      initialValue: 'split',
    }),
    ...visibilityFields,
  ],
  preview: {
    select: {title: 'heading.text', limit: 'limit'},
    prepare: ({title, limit}) => ({title: title || 'Writing', subtitle: limit ? `Latest ${limit} posts` : 'All posts'}),
  },
})
