import {TextIcon} from '@sanity/icons/Text'
import {defineField, defineType} from 'sanity'

export const richTextSection = defineType({
  name: 'richTextSection',
  title: 'Rich text',
  type: 'object',
  icon: TextIcon,
  fields: [
    defineField({name: 'heading', type: 'heading'}),
    defineField({name: 'body', type: 'portableText', validation: (rule) => rule.required()}),
  ],
  preview: {
    select: {title: 'heading.text'},
    prepare: ({title}) => ({title: title || 'Rich text', subtitle: 'Rich text'}),
  },
})
