/**
 * Uploads a square photo and sets it as Site Settings → portrait.
 *   bunx sanity exec scripts/upload-portrait.ts --with-user-token -- /path/to/photo.png
 */
import {createReadStream} from 'node:fs'
import {basename} from 'node:path'
import {getCliClient} from 'sanity/cli'

const file = process.argv.at(-1)
if (!file || file.endsWith('.ts')) throw new Error('Pass the image path as the last argument')

const client = getCliClient({apiVersion: '2026-10-20'})
const asset = await client.assets.upload('image', createReadStream(file), {filename: basename(file)})
await client.patch('siteSettings').set({portrait: {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}}).commit()
console.log(`Portrait set: ${asset.url}`)
