import {UsersIcon} from '@sanity/icons/Users'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {headingText} from '../objects/heading'
import {visibilityFields, visibilityFieldset} from './visibility'

export const experienceSection = defineType({
  name: 'experienceSection',
  title: 'Experience',
  type: 'object',
  icon: UsersIcon,
  fieldsets: [visibilityFieldset],
  fields: [
    defineField({name: 'heading', type: 'heading'}),
    defineField({
      name: 'entries',
      title: 'Relevant roles',
      description:
        'Pick the companies to show, in order. Leave empty to show every Experience document.',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'experience'}]})],
    }),
    defineField({
      name: 'openFirst',
      title: 'Open the first row by default',
      type: 'boolean',
      initialValue: true,
    }),
    ...visibilityFields,
  ],
  preview: {
    select: {title: 'heading.text', entries: 'entries'},
    prepare: ({title, entries}) => ({
      title: headingText(title) || 'Experience',
      subtitle: entries?.length ? `${entries.length} selected` : 'All experience',
    }),
  },
})
