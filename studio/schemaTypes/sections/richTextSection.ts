import {TextIcon} from '@sanity/icons/Text'
import {defineField, defineType} from 'sanity'
import {headingText} from '../objects/heading'
import {visibilityFields, visibilityFieldset} from './visibility'

export const richTextSection = defineType({
  name: 'richTextSection',
  title: 'Rich text',
  type: 'object',
  icon: TextIcon,
  fieldsets: [visibilityFieldset],
  fields: [
    defineField({name: 'heading', type: 'heading'}),
    defineField({name: 'body', type: 'portableText', validation: (rule) => rule.required()}),
    ...visibilityFields,
  ],
  preview: {
    select: {title: 'heading.text'},
    prepare: ({title}) => ({title: headingText(title) || 'Rich text', subtitle: 'Rich text'}),
  },
})
