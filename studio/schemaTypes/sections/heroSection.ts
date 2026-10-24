import {StarIcon} from '@sanity/icons/Star'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {visibilityFields, visibilityFieldset} from './visibility'

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero',
  type: 'object',
  icon: StarIcon,
  fieldsets: [visibilityFieldset],
  fields: [
    defineField({
      name: 'meta',
      title: 'Small lines',
      description: 'Short lines beside the heading, e.g. name, role, location',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.max(4),
    }),
    defineField({name: 'heading', type: 'heading', validation: (rule) => rule.required()}),
    ...visibilityFields,
  ],
  preview: {
    select: {title: 'heading.text'},
    prepare: ({title}) => ({title: title?.replace(/<\/?span>/g, ''), subtitle: 'Hero'}),
  },
})
