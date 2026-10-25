import {LinkIcon} from '@sanity/icons/Link'
import {defineField, defineType} from 'sanity'
import {ButtonVariantInput} from '../../components/ButtonVariantInput'
import {LinkInput} from '../../components/LinkInput'
import {LinkTypeInput} from '../../components/LinkTypeInput'

export const INTERNAL_TARGETS = [
  {type: 'page'},
  {type: 'outreach'},
  {type: 'work'},
  {type: 'product'},
  {type: 'post'},
]

type LinkOptions = {name: string; title: string; withVariant: boolean}

function createLinkType({name, title, withVariant}: LinkOptions) {
  return defineType({
    name,
    title,
    type: 'object',
    icon: LinkIcon,
    components: {input: LinkInput},
    fieldsets: [
      {
        name: 'advanced',
        title: 'Advanced (optional)',
        options: {collapsible: true, collapsed: true},
      },
    ],
    fields: [
      defineField({name: 'label', type: 'string', validation: (rule) => rule.required()}),
      defineField({
        name: 'type',
        type: 'string',
        initialValue: 'internal',
        components: {input: LinkTypeInput},
      }),
      defineField({
        name: 'internal',
        type: 'reference',
        to: INTERNAL_TARGETS,
        hidden: ({parent}) => parent?.type !== 'internal',
      }),
      defineField({
        name: 'external',
        type: 'url',
        placeholder: 'https://example.com',
        hidden: ({parent}) => parent?.type !== 'external',
        validation: (rule) => rule.uri({scheme: ['http', 'https']}),
      }),
      defineField({
        name: 'relative',
        title: 'Relative path',
        type: 'string',
        placeholder: '/writing?tag=astro',
        hidden: ({parent}) => parent?.type !== 'relative',
      }),
      defineField({name: 'email', type: 'email', hidden: ({parent}) => parent?.type !== 'email'}),
      defineField({name: 'phone', type: 'string', hidden: ({parent}) => parent?.type !== 'phone'}),
      ...(withVariant
        ? [
            defineField({
              name: 'variant',
              title: 'Button variant',
              type: 'string',
              options: {list: ['default', 'secondary', 'text']},
              initialValue: 'default',
              components: {input: ButtonVariantInput},
            }),
          ]
        : []),
      defineField({
        name: 'target',
        title: 'Open in',
        type: 'string',
        fieldset: 'advanced',
        options: {
          layout: 'radio',
          direction: 'horizontal',
          list: [
            {title: 'Same window', value: '_self'},
            {title: 'New window', value: '_blank'},
          ],
        },
        initialValue: '_self',
        hidden: ({parent}) => ['email', 'phone'].includes(parent?.type),
      }),
      defineField({
        name: 'params',
        title: 'URL parameters',
        placeholder: 'e.g. #works or ?ref=email',
        type: 'string',
        fieldset: 'advanced',
        hidden: ({parent}) => ['email', 'phone', 'resume'].includes(parent?.type),
      }),
    ],
    preview: {
      select: {label: 'label', type: 'type', variant: 'variant'},
      prepare: ({label, type, variant}) => ({
        title: label || title,
        subtitle: [type ?? 'internal', variant].filter(Boolean).join(' | '),
      }),
    },
  })
}

export const simpleLink = createLinkType({name: 'simpleLink', title: 'Link', withVariant: false})
export const cta = createLinkType({name: 'cta', title: 'Button', withVariant: true})
