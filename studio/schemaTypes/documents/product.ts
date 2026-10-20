import {PackageIcon} from '@sanity/icons/Package'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {SlugWithUrlInput} from '../../components/SlugWithUrlInput'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: PackageIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      components: {input: SlugWithUrlInput},
      options: {source: 'name'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      type: 'string',
      options: {
        list: [
          {title: 'Live', value: 'live'},
          {title: 'Beta', value: 'beta'},
          {title: 'In progress', value: 'inProgress'},
          {title: 'Archived', value: 'archived'},
        ],
        layout: 'radio',
      },
      initialValue: 'live',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'version', description: 'e.g. v1.0', type: 'string'}),
    defineField({
      name: 'tagline',
      description: 'One line on what the product does and who it is for',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'ctas',
      title: 'Buttons',
      type: 'array',
      of: [defineArrayMember({type: 'cta'})],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: 'preview',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', type: 'string', title: 'Alternative text'})],
    }),
    defineField({
      name: 'features',
      type: 'array',
      of: [defineArrayMember({type: 'feature'})],
    }),
    defineField({
      name: 'changelog',
      type: 'array',
      of: [defineArrayMember({type: 'changelogEntry'})],
    }),
    defineField({name: 'seo', type: 'seo'}),
    defineField({
      name: 'order',
      description: 'Lower numbers appear first',
      type: 'number',
      validation: (rule) => rule.required().integer(),
    }),
  ],
  orderings: [{title: 'Manual order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'name', subtitle: 'status', media: 'preview'},
  },
})
