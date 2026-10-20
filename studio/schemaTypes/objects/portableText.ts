import {defineArrayMember, defineField, defineType} from 'sanity'

export const linkAnnotation = defineArrayMember({
  name: 'link',
  title: 'Link',
  type: 'object',
  options: {modal: {type: 'popover', width: 1}},
  fields: [
    defineField({
      name: 'linkType',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'URL', value: 'external'},
          {title: 'Page on this site', value: 'internal'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'external',
    }),
    defineField({
      name: 'href',
      title: 'Link',
      description: 'A web, email, phone or relative link',
      type: 'url',
      hidden: ({parent}) => parent?.linkType === 'internal',
      validation: (rule) => rule.uri({scheme: ['http', 'https', 'mailto', 'tel'], allowRelative: true}),
    }),
    defineField({
      name: 'internal',
      title: 'Document',
      type: 'reference',
      to: [{type: 'page'}, {type: 'outreach'}, {type: 'work'}, {type: 'product'}, {type: 'post'}],
      hidden: ({parent}) => parent?.linkType !== 'internal',
    }),
    defineField({name: 'openInNewTab', type: 'boolean', initialValue: false}),
  ],
})

/** Rich text used by sections, post bodies and case studies. */
export const portableText = defineType({
  name: 'portableText',
  title: 'Portable Text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'Quote', value: 'blockquote'},
      ],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
          {title: 'Code', value: 'code'},
          {title: 'Underline', value: 'underline'},
        ],
        annotations: [linkAnnotation],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', type: 'string', title: 'Alternative text'}),
        defineField({name: 'caption', type: 'string'}),
      ],
    }),
    defineArrayMember({
      type: 'code',
      options: {
        languageAlternatives: [
          {title: 'TypeScript', value: 'typescript'},
          {title: 'JavaScript', value: 'javascript'},
          {title: 'TSX', value: 'tsx'},
          {title: 'Vue', value: 'vue'},
          {title: 'HTML', value: 'html'},
          {title: 'CSS', value: 'css'},
          {title: 'Shell', value: 'sh'},
          {title: 'JSON', value: 'json'},
        ],
      },
    }),
  ],
})
