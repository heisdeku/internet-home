import {ClockIcon} from '@sanity/icons/Clock'
import {defineField, defineType} from 'sanity'

export const changelogEntry = defineType({
  name: 'changelogEntry',
  title: 'Changelog entry',
  type: 'object',
  icon: ClockIcon,
  fields: [
    defineField({name: 'version', description: 'e.g. v1.0', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'date', type: 'date', validation: (rule) => rule.required()}),
    defineField({name: 'note', type: 'text', rows: 2, validation: (rule) => rule.required()}),
  ],
  preview: {
    select: {title: 'version', subtitle: 'note'},
  },
})
