import {UsersIcon} from '@sanity/icons/Users'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const experienceSection = defineType({
  name: 'experienceSection',
  title: 'Experience',
  type: 'object',
  icon: UsersIcon,
  fields: [
    defineField({name: 'heading', type: 'heading'}),
    defineField({
      name: 'entries',
      title: 'Relevant roles',
      description: 'Pick the companies to show, in order. Leave empty to show every Experience document.',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'experience'}]})],
    }),
    defineField({
      name: 'openFirst',
      title: 'Open the first row by default',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'heading.text', entries: 'entries'},
    prepare: ({title, entries}) => ({
      title: title || 'Experience',
      subtitle: entries?.length ? `${entries.length} selected` : 'All experience',
    }),
  },
})
