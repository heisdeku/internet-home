import type {ObjectSchemaType, Path, SanityClient, SanityDocument, Schema} from 'sanity'

export function usageTagNames(schema: Schema, doc: SanityDocument, path: Path): string[] {
  const docType = schema.get(doc._type) as ObjectSchemaType
  const typeTitle = docType.title ?? doc._type
  const names = [typeTitle]

  const titleField = docType.preview?.select?.title
  const docTitle = titleField ? doc[titleField] : undefined
  if (typeof docTitle === 'string' && docTitle.trim())
    names.push(`${typeTitle} · ${docTitle.trim()}`)

  const [field, item] = path
  const section =
    field === 'pageBuilder' && typeof item === 'object' && '_key' in item
      ? (doc.pageBuilder as {_key: string; _type: string}[]).find((s) => s._key === item._key)
      : undefined
  if (section) {
    names.push(`${schema.get(section._type)?.title ?? section._type} section`)
  } else {
    const fieldType = docType.fields.find((f) => f.name === field)
    names.push(fieldType?.type.title ?? String(field))
  }
  return names
}

export async function tagAsset(client: SanityClient, assetId: string, names: string[]) {
  const tagIds = await Promise.all(names.map((name) => ensureTag(client, name)))
  const existing = await client.fetch<string[] | null>(`*[_id == $id][0].opt.media.tags[]._ref`, {
    id: assetId,
  })
  const missing = tagIds.filter((id) => !existing?.includes(id))
  if (!missing.length) return

  await client
    .patch(assetId)
    .setIfMissing({opt: {media: {tags: []}}})
    .append(
      'opt.media.tags',
      missing.map((_ref) => ({_type: 'reference', _ref, _weak: true})),
    )
    .commit({autoGenerateArrayKeys: true})
}

async function ensureTag(client: SanityClient, name: string): Promise<string> {
  const existing = await client.fetch<string | null>(
    `*[_type == "media.tag" && name.current == $name][0]._id`,
    {name},
  )
  if (existing) return existing

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  const created = await client.createIfNotExists({
    _id: `media.tag.${slug}`,
    _type: 'media.tag',
    name: {_type: 'slug', current: name},
  })
  return created._id
}
