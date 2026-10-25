import {CodeIcon} from '@sanity/icons/Code'
import {defineField, defineType} from 'sanity'
import {IconMark, SimpleIconInput} from '../../components/SimpleIconInput'

/** A language, framework or tool, listed in Information columns and linked from rich text. */
export const tool = defineType({
  name: 'tool',
  title: 'Tool',
  type: 'document',
  icon: CodeIcon,
  fields: [
    defineField({
      name: 'name',
      description: 'As it reads on the site, e.g. Node & Express',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'icon',
      description: 'Mark that slides in beside the name on hover',
      type: 'object',
      components: {input: SimpleIconInput},
      fields: [
        defineField({name: 'slug', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'title', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'path', type: 'string', validation: (rule) => rule.required()}),
      ],
    }),
    defineField({
      name: 'url',
      title: 'URL',
      description: 'Opened when the name is clicked',
      type: 'url',
    }),
  ],
  preview: {
    select: {title: 'name', path: 'icon.path', url: 'url'},
    prepare: ({title, path, url}) => ({
      title,
      subtitle: url,
      media: path ? <IconMark path={path} /> : CodeIcon,
    }),
  },
})
