import {defineArrayMember, defineField} from 'sanity'

/** Shared page-builder array so every document that composes a page stays in sync. */
export const pageBuilderField = defineField({
  name: 'pageBuilder',
  title: 'Page builder',
  type: 'array',
  of: [
    defineArrayMember({type: 'heroSection'}),
    defineArrayMember({type: 'pageHeading'}),
    defineArrayMember({type: 'worksSection'}),
    defineArrayMember({type: 'productsSection'}),
    defineArrayMember({type: 'writingSection'}),
    defineArrayMember({type: 'infoSection'}),
    defineArrayMember({type: 'experienceSection'}),
    defineArrayMember({type: 'introSection'}),
    defineArrayMember({type: 'listColumnsSection'}),
    defineArrayMember({type: 'contactSection'}),
    defineArrayMember({type: 'richTextSection'}),
  ],
  options: {insertMenu: {views: [{name: 'list'}]}},
})
