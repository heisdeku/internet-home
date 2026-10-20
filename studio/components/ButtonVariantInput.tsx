import {Card, Flex, Stack, Text} from '@sanity/ui'
import {set, type StringInputProps} from 'sanity'

const VARIANTS = [
  {value: 'default', title: 'Default', hint: 'Blue pill'},
  {value: 'secondary', title: 'Secondary', hint: 'Outlined pill'},
  {value: 'text', title: 'Text', hint: 'Plain link with arrow'},
]

export function ButtonVariantInput(props: StringInputProps) {
  return (
    <Flex gap={3}>
      {VARIANTS.map((variant) => {
        const active = props.value === variant.value
        return (
          <Card
            key={variant.value}
            padding={3}
            radius={2}
            border
            tone={active ? 'primary' : 'default'}
            style={{cursor: 'pointer', flex: 1}}
            onClick={() => props.onChange(set(variant.value))}
          >
            <Stack gap={2}>
              <Text size={1} weight="medium" align="center">
                {variant.title}
              </Text>
              <Text size={0} muted align="center">
                {variant.hint}
              </Text>
            </Stack>
          </Card>
        )
      })}
    </Flex>
  )
}
