import {InfoOutlineIcon} from '@sanity/icons/InfoOutline'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const infoColumn = defineType({
  name: 'infoColumn',
  title: 'Column',
  type: 'object',
  fields: [
    defineField({name: 'label', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'source',
      type: 'string',
      options: {
        list: [
          {title: 'Items below', value: 'manual'},
          {title: 'Companies from Experience', value: 'experience'},
        ],
        layout: 'radio',
      },
      initialValue: 'manual',
    }),
    defineField({
      name: 'items',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      hidden: ({parent}) => parent?.source === 'experience',
    }),
    defineField({name: 'link', description: 'Optional link under the list', type: 'simpleLink'}),
  ],
  preview: {
    select: {title: 'label', source: 'source'},
    prepare: ({title, source}) => ({title, subtitle: source === 'experience' ? 'From Experience' : 'Manual list'}),
  },
})

export const infoSection = defineType({
  name: 'infoSection',
  title: 'Information',
  type: 'object',
  icon: InfoOutlineIcon,
  fields: [
    defineField({name: 'heading', type: 'heading'}),
    defineField({name: 'body', type: 'portableText', validation: (rule) => rule.required()}),
    defineField({
      name: 'columns',
      type: 'array',
      of: [defineArrayMember({type: 'infoColumn'})],
      validation: (rule) => rule.max(3),
    }),
  ],
  preview: {
    select: {title: 'heading.text'},
    prepare: ({title}) => ({title: title || 'Information', subtitle: 'Information'}),
  },
})
