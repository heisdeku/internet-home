import {CaseIcon} from '@sanity/icons/Case'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const worksSection = defineType({
  name: 'worksSection',
  title: 'Works',
  type: 'object',
  icon: CaseIcon,
  fields: [
    defineField({name: 'heading', type: 'heading'}),
    defineField({
      name: 'works',
      title: 'Selected works',
      description: 'Pick the works to show, in order. Leave empty to show every work in its manual order.',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'work'}]})],
    }),
    defineField({
      name: 'defaultView',
      type: 'string',
      options: {list: ['grid', 'index'], layout: 'radio', direction: 'horizontal'},
      initialValue: 'grid',
    }),
  ],
  preview: {
    select: {title: 'heading.text', works: 'works'},
    prepare: ({title, works}) => ({
      title: title?.replace(/<\/?span>/g, '') || 'Works',
      subtitle: works?.length ? `${works.length} selected` : 'All works',
    }),
  },
})
