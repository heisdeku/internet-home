import {PackageIcon} from '@sanity/icons/Package'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {visibilityFields, visibilityFieldset} from './visibility'

export const productsSection = defineType({
  name: 'productsSection',
  title: 'Products grid',
  type: 'object',
  icon: PackageIcon,
  fieldsets: [visibilityFieldset],
  fields: [
    defineField({
      name: 'products',
      description: 'Leave empty to show every product in its manual order',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'product'}]})],
    }),
    ...visibilityFields,
  ],
  preview: {
    select: {products: 'products'},
    prepare: ({products}) => ({title: 'Products grid', subtitle: products?.length ? `${products.length} selected` : 'All products'}),
  },
})
