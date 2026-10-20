import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '1dyyk69c',
    dataset: 'production',
  },
  deployment: {
    autoUpdates: true,
  },
  typegen: {
    path: '../web/src/**/*.{ts,tsx,astro}',
    schema: 'schema.json',
    generates: '../web/src/sanity/types.ts',
  },
})
