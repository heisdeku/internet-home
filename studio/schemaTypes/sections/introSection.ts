import {EnvelopeIcon} from '@sanity/icons/Envelope'
import {defineField, defineType} from 'sanity'

export const introSection = defineType({
  name: 'introSection',
  title: 'Intro greeting',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'greeting',
      description: 'On /intro, ?to=Acme replaces this with "Hi Acme team,"',
      type: 'string',
      initialValue: 'Hi there,',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'heading', type: 'heading', validation: (rule) => rule.required()}),
    defineField({name: 'description', type: 'portableText'}),
  ],
  preview: {
    select: {title: 'heading.text', greeting: 'greeting'},
    prepare: ({title, greeting}) => ({title: title?.replace(/<\/?span>/g, ''), subtitle: greeting}),
  },
})
