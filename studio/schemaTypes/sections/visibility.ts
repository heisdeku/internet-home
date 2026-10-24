import {defineField} from 'sanity'

/** Shared by every page-builder section. Mobile/desktop split at the site's `md` breakpoint (768px). */
export const visibilityFieldset = {
  name: 'visibility',
  title: 'Visibility',
  options: {collapsible: true, collapsed: true},
}

export const visibilityFields = [
  defineField({
    name: 'hidden',
    title: 'Hidden',
    description: 'Hide this section on every screen size. It stays in the Studio, ready to switch back on.',
    type: 'boolean',
    initialValue: false,
    fieldset: 'visibility',
  }),
  defineField({
    name: 'hideOnMobile',
    title: 'Hide on mobile',
    description: 'Hide this section on screens narrower than 768px.',
    type: 'boolean',
    initialValue: false,
    fieldset: 'visibility',
  }),
  defineField({
    name: 'hideOnDesktop',
    title: 'Hide on desktop',
    description: 'Hide this section on screens 768px and wider.',
    type: 'boolean',
    initialValue: false,
    fieldset: 'visibility',
  }),
]
