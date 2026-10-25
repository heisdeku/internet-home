import {CaseIcon} from '@sanity/icons/Case'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {headingText} from '../objects/heading'
import {visibilityFields, visibilityFieldset} from './visibility'

export const worksSection = defineType({
  name: 'worksSection',
  title: 'Works',
  type: 'object',
  icon: CaseIcon,
  fieldsets: [visibilityFieldset],
  fields: [
    defineField({name: 'heading', type: 'heading'}),
    defineField({
      name: 'works',
      title: 'Selected works',
      description:
        'Pick the works to show, in order. Leave empty to show every work in its manual order.',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'work'}]})],
    }),
    defineField({
      name: 'limit',
      description: 'Show only the first N works (e.g. 6 on the home page). Leave empty for all.',
      type: 'number',
      validation: (rule) => rule.integer().min(1),
    }),
    defineField({
      name: 'showFilters',
      title: 'Show category filters',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'link',
      title: 'Link',
      description: 'e.g. "All work" pointing at the Work page, shown beside the heading',
      type: 'simpleLink',
    }),
    defineField({
      name: 'defaultView',
      type: 'string',
      options: {list: ['grid', 'index'], layout: 'radio', direction: 'horizontal'},
      initialValue: 'grid',
    }),
    ...visibilityFields,
  ],
  preview: {
    select: {title: 'heading.text', works: 'works'},
    prepare: ({title, works}) => ({
      title: headingText(title) || 'Works',
      subtitle: works?.length ? `${works.length} selected` : 'All works',
    }),
  },
})
