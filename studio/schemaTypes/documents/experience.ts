import {UsersIcon} from '@sanity/icons/Users'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {hiddenField, manualOrdering, orderField} from './listingFields'

const EMPLOYMENT_TYPES = [
  {title: 'Full-time', value: 'fullTime'},
  {title: 'Contract', value: 'contract'},
  {title: 'Freelance', value: 'freelance'},
  {title: 'Part-time', value: 'partTime'},
  {title: 'Internship', value: 'internship'},
]

export const role = defineType({
  name: 'role',
  title: 'Role',
  type: 'object',
  fields: [
    defineField({name: 'title', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'employmentType',
      type: 'string',
      options: {list: EMPLOYMENT_TYPES},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'startDate',
      description: 'The day is ignored; only month and year are shown',
      type: 'date',
      options: {dateFormat: 'MMM YYYY'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      description: 'Leave empty for a current role',
      type: 'date',
      options: {dateFormat: 'MMM YYYY'},
    }),
    defineField({
      name: 'highlights',
      description: 'What you built and the impact it had, one per line',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
  ],
  preview: {
    select: {title: 'title', startDate: 'startDate', endDate: 'endDate'},
    prepare: ({title, startDate, endDate}) => ({
      title,
      subtitle: `${startDate?.slice(0, 7) ?? ''} — ${endDate?.slice(0, 7) ?? 'Present'}`,
    }),
  },
})

export const experience = defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({name: 'company', type: 'string', validation: (rule) => rule.required()}),
    hiddenField,
    defineField({
      name: 'logo',
      description: 'Square mark shown beside the company name on hover',
      type: 'image',
    }),
    defineField({
      name: 'brandColor',
      description: 'Hex colour the name turns on hover, e.g. #635bff',
      type: 'string',
      validation: (rule) => rule.regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, {name: 'hex colour'}),
    }),
    defineField({name: 'url', title: 'Company URL', type: 'url'}),
    defineField({name: 'location', description: 'e.g. Lagos, Nigeria · Remote', type: 'string'}),
    defineField({
      name: 'roles',
      description: 'Most recent first',
      type: 'array',
      of: [defineArrayMember({type: 'role'})],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({name: 'stack', type: 'string'}),
    orderField,
  ],
  orderings: [manualOrdering],
  preview: {
    select: {title: 'company', role: 'roles.0.title'},
    prepare: ({title, role}) => ({title, subtitle: role}),
  },
})
