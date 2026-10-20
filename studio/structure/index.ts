import {CogIcon} from '@sanity/icons/Cog'
import type {StructureResolver} from 'sanity/structure'

const SINGLETONS = ['siteSettings']
const LISTED = ['page', 'outreach', 'work', 'product', 'experience', 'post']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.documentTypeListItem('page').title('Pages'),
      S.documentTypeListItem('outreach').title('Intro pages'),
      S.divider(),
      S.documentTypeListItem('work').title('Works'),
      S.documentTypeListItem('product').title('Products'),
      S.documentTypeListItem('experience').title('Experience'),
      S.documentTypeListItem('post').title('Writing'),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => ![...SINGLETONS, ...LISTED].includes(item.getId() ?? ''),
      ),
    ])
