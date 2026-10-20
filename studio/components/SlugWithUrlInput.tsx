import {Stack, Text} from '@sanity/ui'
import {useEffect, useState} from 'react'
import {SlugInput, type SlugInputProps, useClient, useFormValue} from 'sanity'

/** Same routing as `web/src/sanity/links.ts` `pathFor`. */
const pathFor = (type: string, slug: string) => {
  switch (type) {
    case 'page':
      return slug === 'home' ? '/' : `/${slug}`
    case 'outreach':
      return `/intro/${slug}`
    case 'work':
      return `/work/${slug}`
    case 'product':
      return `/products/${slug}`
    case 'post':
      return `/writing/${slug}`
    default:
      return `/${slug}`
  }
}

/** The slug field with the page's full public URL shown underneath, as on VosCollection. */
export function SlugWithUrlInput(props: SlugInputProps) {
  const client = useClient({apiVersion: '2026-10-20'})
  const type = useFormValue(['_type']) as string
  const slug = props.value?.current
  const [origin, setOrigin] = useState<string | null>(null)

  useEffect(() => {
    client
      .fetch<string | null>('*[_id == "siteSettings"][0].siteUrl')
      .then((url) => setOrigin(url?.replace(/\/$/, '') ?? null))
  }, [client])

  const url = slug && origin ? `${origin}${pathFor(type, slug)}` : null

  return (
    <Stack gap={2}>
      <SlugInput {...props} />
      {url && (
        <Text size={1} muted>
          URL:{' '}
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        </Text>
      )}
    </Stack>
  )
}
