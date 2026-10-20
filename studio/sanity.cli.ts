import {defineCliConfig} from 'sanity/cli'

// Env vars let CI (see .github/workflows/deploy-studio.yml) target another project or host.
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '1dyyk69c'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineCliConfig({
  api: {projectId, dataset},
  studioHost: process.env.SANITY_STUDIO_STUDIO_HOST || 'oluwaferanmi',
  deployment: {
    appId: 'd4z3bjlpomk9n8xsk0w1gnd2',
    autoUpdates: true,
  },
  typegen: {
    path: '../web/src/**/*.{ts,tsx,astro}',
    schema: 'schema.json',
    generates: '../web/src/sanity/types.ts',
  },
})
