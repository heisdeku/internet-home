import {CommentIcon} from '@sanity/icons/Comment'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const contactSection = defineType({
  name: 'contactSection',
  title: 'Contact band',
  type: 'object',
  icon: CommentIcon,
  description: 'Dark band with the site email and a row of buttons',
  fields: [
    defineField({name: 'heading', type: 'heading'}),
    defineField({name: 'emailSubject', description: 'Pre-filled subject for the mailto link', type: 'string'}),
    defineField({name: 'ctas', title: 'Buttons', type: 'array', of: [defineArrayMember({type: 'cta'})]}),
  ],
  preview: {
    select: {title: 'heading.text'},
    prepare: ({title}) => ({title: title || 'Contact band', subtitle: 'Contact band'}),
  },
})
