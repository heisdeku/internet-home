import {defineField, defineType} from 'sanity'
import {TitleInput} from '../../components/TitleInput'

/** A heading with its tag and size chosen by the editor. `<span>` inside the text is the accent highlight. */
export const heading = defineType({
  name: 'heading',
  title: 'Heading',
  type: 'object',
  components: {input: TitleInput},
  fields: [
    defineField({name: 'text', type: 'text', rows: 2, validation: (rule) => rule.required()}),
    defineField({
      name: 'type',
      title: 'Tag',
      type: 'string',
      options: {list: ['h1', 'h2', 'h3', 'h4', 'p']},
      initialValue: 'h2',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'fontSize',
      title: 'Size',
      description: 'Leave empty to match the tag',
      type: 'string',
      options: {list: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']},
    }),
  ],
  preview: {
    select: {text: 'text', type: 'type', fontSize: 'fontSize'},
    prepare: ({text, type, fontSize}) => ({
      title: text?.replace(/<\/?span>/g, '') || 'Heading',
      subtitle: `${type?.toUpperCase() ?? 'H2'}${fontSize ? ` · ${fontSize}` : ''}`,
    }),
  },
})
