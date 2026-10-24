import {codeInput} from '@sanity/code-input'
import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {media, mediaAssetSource} from 'sanity-plugin-media'
import {UsageTagAssetInput} from './components/UsageTagAssetInput'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

const SINGLETONS = new Set(['siteSettings'])

export default defineConfig({
  name: 'default',
  title: 'Portfolio',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '1dyyk69c',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [structureTool({structure}), media(), visionTool(), codeInput()],

  form: {
    components: {input: UsageTagAssetInput},
    image: {assetSources: () => [mediaAssetSource]},
    file: {assetSources: () => [mediaAssetSource]},
  },

  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter((t) => !SINGLETONS.has(t.schemaType)),
  },

  document: {
    actions: (actions, {schemaType}) =>
      SINGLETONS.has(schemaType)
        ? actions.filter(({action}) => action !== 'unpublish' && action !== 'delete' && action !== 'duplicate')
        : actions,
  },
})
