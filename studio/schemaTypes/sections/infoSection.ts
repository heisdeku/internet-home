import {InfoOutlineIcon} from '@sanity/icons/InfoOutline'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {headingText} from '../objects/heading'
import {visibilityFields, visibilityFieldset} from './visibility'

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
          {title: 'Tools below', value: 'manual'},
          {title: 'Companies from Experience', value: 'experience'},
        ],
        layout: 'radio',
      },
      initialValue: 'manual',
    }),
    defineField({
      name: 'tools',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'tool'}]})],
      hidden: ({parent}) => parent?.source === 'experience',
    }),
    defineField({name: 'link', description: 'Optional link under the list', type: 'simpleLink'}),
  ],
  preview: {
    select: {title: 'label', source: 'source'},
    prepare: ({title, source}) => ({
      title,
      subtitle: source === 'experience' ? 'From Experience' : 'Tools',
    }),
  },
})

export const infoSection = defineType({
  name: 'infoSection',
  title: 'Information',
  type: 'object',
  icon: InfoOutlineIcon,
  fieldsets: [visibilityFieldset],
  fields: [
    defineField({name: 'heading', type: 'heading'}),
    defineField({name: 'body', type: 'portableText', validation: (rule) => rule.required()}),
    defineField({
      name: 'columns',
      type: 'array',
      of: [defineArrayMember({type: 'infoColumn'})],
      validation: (rule) => rule.max(3),
    }),
    ...visibilityFields,
  ],
  preview: {
    select: {title: 'heading.text'},
    prepare: ({title}) => ({title: headingText(title) || 'Information', subtitle: 'Information'}),
  },
})
