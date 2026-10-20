import {Flex, Stack, Text} from '@sanity/ui'
import {useEffect} from 'react'
import {FormFieldValidationStatus, ObjectInputMember, set, type FieldMember, type ObjectInputProps} from 'sanity'

/**
 * Lays out a link object as: label, then [type picker | type-specific field],
 * then the remaining fields. Mirrors the AAIF Studio's LinkInput.
 */
export function LinkInput(props: ObjectInputProps) {
  const members = props.members.filter((m): m is FieldMember => m.kind === 'field')
  const [labelField, typeField, ...rest] = members
  const type = (props.value?.type as string | undefined) ?? 'internal'
  const linkField = rest.find((m) => m.name === type) ?? rest[0]
  const otherFields = rest.filter(
    (m) => !['internal', 'external', 'relative', 'email', 'phone', 'resume'].includes(m.name),
  )

  useEffect(() => {
    if (!props.value?.type && !props.readOnly) props.onChange(set('internal', ['type']))
  }, [props.value?.type, props.readOnly, props.onChange])

  const renderProps = {
    renderAnnotation: props.renderAnnotation,
    renderBlock: props.renderBlock,
    renderField: props.renderField,
    renderInlineBlock: props.renderInlineBlock,
    renderInput: props.renderInput,
    renderItem: props.renderItem,
    renderPreview: props.renderPreview,
  }
  const untitled = (member: FieldMember): FieldMember => ({
    ...member,
    field: {...member.field, schemaType: {...member.field.schemaType, title: undefined}},
  })
  const validation = linkField?.field.validation ?? []

  return (
    <Stack gap={4}>
      <ObjectInputMember member={labelField} {...renderProps} />
      <Stack gap={3}>
        <Flex align="center" gap={2}>
          <Text as="label" weight="medium" size={1}>
            Link
          </Text>
          {validation.length > 0 && (
            <FormFieldValidationStatus fontSize={1} placement="top" validation={validation} />
          )}
        </Flex>
        <Flex gap={2} align="flex-start">
          <ObjectInputMember member={untitled(typeField)} {...renderProps} />
          <Stack gap={2} style={{width: '100%'}}>
            {type !== 'resume' && linkField && (
              <ObjectInputMember member={untitled(linkField)} {...renderProps} />
            )}
            {type === 'resume' && (
              <Text size={1} muted style={{paddingTop: 10}}>
                Downloads the PDF uploaded in Site Settings.
              </Text>
            )}
          </Stack>
        </Flex>
      </Stack>
      {otherFields.map((member) => (
        <ObjectInputMember key={member.key} member={member} {...renderProps} />
      ))}
    </Stack>
  )
}
