import {UlistIcon} from '@sanity/icons/Ulist'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {visibilityFields, visibilityFieldset} from './visibility'

export const listItem = defineType({
  name: 'listItem',
  title: 'Item',
  type: 'object',
  fields: [
    defineField({name: 'text', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'link', title: 'Link (optional)', type: 'simpleLink'}),
  ],
  preview: {
    select: {title: 'text', type: 'link.type'},
    prepare: ({title, type}) => ({title, subtitle: type ? `Links (${type})` : undefined}),
  },
})

export const listColumn = defineType({
  name: 'listColumn',
  title: 'Column',
  type: 'object',
  fields: [
    defineField({name: 'label', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'items', type: 'array', of: [defineArrayMember({type: 'listItem'})]}),
  ],
  preview: {
    select: {title: 'label', items: 'items'},
    prepare: ({title, items}) => ({title, subtitle: `${items?.length ?? 0} items`}),
  },
})

export const listColumnsSection = defineType({
  name: 'listColumnsSection',
  title: 'List columns',
  type: 'object',
  icon: UlistIcon,
  fieldsets: [visibilityFieldset],
  fields: [
    defineField({
      name: 'columns',
      type: 'array',
      of: [defineArrayMember({type: 'listColumn'})],
      validation: (rule) => rule.min(1).max(4),
    }),
    ...visibilityFields,
  ],
  preview: {
    select: {columns: 'columns'},
    prepare: ({columns}) => ({
      title: (columns ?? []).map((c: {label?: string}) => c.label).filter(Boolean).join(' · ') || 'List columns',
      subtitle: 'List columns',
    }),
  },
})
