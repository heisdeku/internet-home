import {Button, Flex, Stack, Text} from '@sanity/ui'
import {useEffect} from 'react'
import {ObjectInputMember, set, type FieldMember, type ObjectInputProps} from 'sanity'

const TYPE_OPTIONS = ['h1', 'h2', 'h3', 'h4', 'p']
const SIZE_OPTIONS = ['', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']

export function TitleInput(props: ObjectInputProps) {
  const {onChange, readOnly} = props
  const members = props.members.filter((m): m is FieldMember => m.kind === 'field')
  const textField = members.find((m) => m.name === 'text')
  const otherFields = members.filter((m) => !['text', 'type', 'fontSize'].includes(m.name))
  const savedType = props.value?.type as string | undefined
  const currentType = savedType ?? 'h2'
  const currentSize = (props.value?.fontSize as string | undefined) ?? ''

  useEffect(() => {
    if (savedType === undefined && !readOnly) onChange(set('h2', ['type']))
  }, [savedType, readOnly, onChange])

  const renderProps = {
    renderAnnotation: props.renderAnnotation,
    renderBlock: props.renderBlock,
    renderField: props.renderField,
    renderInlineBlock: props.renderInlineBlock,
    renderInput: props.renderInput,
    renderItem: props.renderItem,
    renderPreview: props.renderPreview,
  }

  const pills = (label: string, options: string[], current: string, path: string) => (
    <Flex gap={2} wrap="wrap" align="center">
      <Text size={1} weight="medium" muted>
        {label}
      </Text>
      <Flex gap={1} wrap="wrap">
        {options.map((option) => {
          const active = current === option
          return (
            <Button
              key={option || 'none'}
              text={option ? option.toUpperCase() : 'Auto'}
              mode={active ? 'default' : 'bleed'}
              tone={active ? 'primary' : 'default'}
              padding={2}
              fontSize={0}
              radius="full"
              style={active ? undefined : {opacity: 0.55}}
              onClick={() => onChange(set(option, [path]))}
            />
          )
        })}
      </Flex>
    </Flex>
  )

  return (
    <Stack gap={4}>
      <Stack gap={2}>
        {textField && (
          <ObjectInputMember
            member={textField}
            {...renderProps}
            renderField={(fieldProps) => <>{fieldProps.children}</>}
          />
        )}
        {pills('Tag:', TYPE_OPTIONS, currentType, 'type')}
        {pills('Size:', SIZE_OPTIONS, currentSize, 'fontSize')}
        <Text size={0} muted>
          Wrap a phrase in &lt;span&gt; to render it in the accent colour.
        </Text>
      </Stack>
      {otherFields.map((member) => (
        <ObjectInputMember key={member.key} member={member} {...renderProps} />
      ))}
    </Stack>
  )
}
