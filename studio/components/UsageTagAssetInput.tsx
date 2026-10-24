import {useToast} from '@sanity/ui/toast'
import {useEffect, useRef} from 'react'
import {
  useClient,
  useFormValue,
  useSchema,
  type InputProps,
  type Reference,
  type SanityDocument,
  type SchemaType,
} from 'sanity'
import {tagAsset, usageTagNames} from '../media/usageTags'

export function UsageTagAssetInput(props: InputProps) {
  for (let type: SchemaType | undefined = props.schemaType; type; type = type.type) {
    if (type.name === 'image' || type.name === 'file') return <AssetUsageTagger {...props} />
  }
  return props.renderDefault(props)
}

function AssetUsageTagger(props: InputProps) {
  const client = useClient({apiVersion: '2025-01-01'})
  const schema = useSchema()
  const toast = useToast()
  const doc = useFormValue([]) as SanityDocument
  const assetRef = (props.value as {asset?: Reference} | undefined)?.asset?._ref
  // The asset already on the field when the form opens was tagged when it was attached (or by the backfill).
  const baseline = useRef(assetRef)

  useEffect(() => {
    if (!assetRef || assetRef === baseline.current) {
      baseline.current = assetRef
      return
    }
    baseline.current = assetRef
    tagAsset(client, assetRef, usageTagNames(schema, doc, props.path)).catch((error: Error) =>
      toast.push({
        status: 'warning',
        title: 'Could not tag the asset in the media library',
        description: error.message,
      }),
    )
  }, [assetRef, client, schema, doc, props.path, toast])

  return props.renderDefault(props)
}
