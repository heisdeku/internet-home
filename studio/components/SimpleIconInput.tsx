import {CloseIcon} from '@sanity/icons/Close'
import {SearchIcon} from '@sanity/icons/Search'
import {Box, Button, Card, Flex, Grid, Stack, Text, TextInput} from '@sanity/ui'
import {useEffect, useMemo, useState} from 'react'
import {set, unset, useFormValue, type ObjectInputProps} from 'sanity'
import type {SimpleIcon} from 'simple-icons'

type IconValue = {slug: string; title: string; path: string}

const MAX_RESULTS = 36

export function IconMark({path, size = 20}: {path: string; size?: number}) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
      <path d={path} />
    </svg>
  )
}

export function SimpleIconInput(props: ObjectInputProps) {
  const {onChange, readOnly} = props
  const value = props.value as IconValue | undefined
  const name = useFormValue(['name']) as string | undefined
  const [query, setQuery] = useState(value?.title ?? name ?? '')
  const [icons, setIcons] = useState<SimpleIcon[]>([])

  useEffect(() => {
    import('simple-icons').then((module) => setIcons(Object.values(module) as SimpleIcon[]))
  }, [])

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return []
    return icons
      .filter((icon) => icon.title.toLowerCase().includes(term) || icon.slug.includes(term))
      .sort((a, b) => a.title.length - b.title.length)
      .slice(0, MAX_RESULTS)
  }, [icons, query])

  return (
    <Stack gap={3}>
      {value && (
        <Card padding={3} radius={2} border>
          <Flex align="center" gap={3}>
            <IconMark path={value.path} size={24} />
            <Box flex={1}>
              <Text weight="medium">{value.title}</Text>
            </Box>
            <Button
              icon={CloseIcon}
              mode="bleed"
              text="Remove"
              disabled={readOnly}
              onClick={() => onChange(unset())}
            />
          </Flex>
        </Card>
      )}
      <TextInput
        icon={SearchIcon}
        placeholder="Search Simple Icons, e.g. React"
        value={query}
        readOnly={readOnly}
        onChange={(event) => setQuery(event.currentTarget.value)}
      />
      {query.trim() && results.length === 0 && (
        <Text size={1} muted>
          {icons.length === 0 ? 'Loading icons…' : 'No icons match'}
        </Text>
      )}
      <Grid gridTemplateColumns={[3, 4, 6]} gap={2}>
        {results.map((icon) => (
          <Button
            key={icon.slug}
            mode={icon.slug === value?.slug ? 'default' : 'ghost'}
            tone={icon.slug === value?.slug ? 'primary' : 'default'}
            padding={3}
            title={icon.title}
            disabled={readOnly}
            onClick={() => onChange(set({slug: icon.slug, title: icon.title, path: icon.path}))}
          >
            <Stack gap={2} style={{justifyItems: 'center'}}>
              <IconMark path={icon.path} />
              <Text size={0} textOverflow="ellipsis">
                {icon.title}
              </Text>
            </Stack>
          </Button>
        ))}
      </Grid>
    </Stack>
  )
}
