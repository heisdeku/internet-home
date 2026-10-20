import {DocumentIcon} from '@sanity/icons/Document'
import {defineField, defineType} from 'sanity'
import {SlugWithUrlInput} from '../../components/SlugWithUrlInput'
import {pageBuilderField} from '../pageBuilder'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'settings', title: 'Settings'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      description: 'The page URL. Use "home" for the front page.',
      type: 'slug',
      components: {input: SlugWithUrlInput},
      group: 'content',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    {...pageBuilderField, group: 'content'},
    defineField({
      name: 'theme',
      type: 'string',
      group: 'settings',
      options: {
        list: [
          {title: 'Paper (default)', value: 'paper'},
          {title: 'Blue', value: 'accent'},
        ],
        layout: 'radio',
      },
      initialValue: 'paper',
    }),
    defineField({
      name: 'chrome',
      title: 'Header and footer',
      type: 'string',
      group: 'settings',
      options: {
        list: [
          {title: 'Full site header and footer', value: 'full'},
          {title: 'Minimal header, no footer (intro page)', value: 'minimal'},
        ],
        layout: 'radio',
      },
      initialValue: 'full',
    }),
    defineField({name: 'seo', type: 'seo', group: 'seo'}),
  ],
  preview: {
    select: {title: 'title', slug: 'slug.current'},
    prepare: ({title, slug}) => ({title, subtitle: slug === 'home' ? '/' : `/${slug}`}),
  },
})
