import {CodeBlockIcon} from '@sanity/icons/CodeBlock'
import {defineField, defineType} from 'sanity'

/** Embedded content: YouTube, Vimeo, Loom, CodeSandbox, Figma, maps… Paste the page URL or the iframe src. */
export const embed = defineType({
  name: 'embed',
  title: 'Embed',
  type: 'object',
  icon: CodeBlockIcon,
  fields: [
    defineField({
      name: 'url',
      title: 'Embed URL',
      description: 'YouTube, Vimeo and Loom page links are converted to their players automatically',
      type: 'url',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      description: 'Read by screen readers',
      type: 'string',
    }),
    defineField({
      name: 'aspectRatio',
      description: 'Width to height of the embedded frame',
      type: 'string',
      options: {
        list: [
          {title: '16:9', value: '16/9'},
          {title: '4:3', value: '4/3'},
          {title: '1:1', value: '1/1'},
          {title: '9:16', value: '9/16'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: '16/9',
    }),
    defineField({name: 'caption', type: 'string'}),
  ],
  preview: {
    select: {title: 'title', url: 'url'},
    prepare: ({title, url}) => ({title: title || 'Embed', subtitle: url}),
  },
})
