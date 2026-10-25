import {defineField, type SortOrdering} from 'sanity'

export const hiddenField = defineField({
  name: 'hidden',
  title: 'Hide from the site',
  description: 'Keeps the entry in the Studio but removes it from every list and page',
  type: 'boolean',
  initialValue: false,
})

export const comingSoonField = defineField({
  name: 'comingSoon',
  title: 'Coming soon',
  description: 'Listed with a "Coming soon" badge, not clickable, and no page is published yet',
  type: 'boolean',
  initialValue: false,
})

export const orderField = defineField({
  name: 'order',
  description: 'Lower numbers appear first',
  type: 'number',
  validation: (rule) => rule.required().integer(),
})

export const manualOrdering: SortOrdering = {
  title: 'Manual order',
  name: 'order',
  by: [{field: 'order', direction: 'asc'}],
}
