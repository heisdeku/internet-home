import {BlockContentIcon} from '@sanity/icons/BlockContent'
import {defineField, defineType} from 'sanity'
import {headingText} from '../objects/heading'
import {visibilityFields, visibilityFieldset} from './visibility'

export const pageHeading = defineType({
  name: 'pageHeading',
  title: 'Page heading',
  type: 'object',
  icon: BlockContentIcon,
  fieldsets: [visibilityFieldset],
  fields: [
    defineField({name: 'heading', type: 'heading', validation: (rule) => rule.required()}),
    defineField({name: 'description', type: 'portableText'}),
    defineField({name: 'cta', title: 'Button', type: 'cta'}),
    ...visibilityFields,
  ],
  preview: {
    select: {title: 'heading.text'},
    prepare: ({title}) => ({title: headingText(title), subtitle: 'Page heading'}),
  },
})
