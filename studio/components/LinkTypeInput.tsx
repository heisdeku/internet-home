import {ChevronDownIcon} from '@sanity/icons/ChevronDown'
import {DocumentIcon} from '@sanity/icons/Document'
import {DownloadIcon} from '@sanity/icons/Download'
import {EarthAmericasIcon} from '@sanity/icons/EarthAmericas'
import {EnvelopeIcon} from '@sanity/icons/Envelope'
import {LinkIcon} from '@sanity/icons/Link'
import {Button} from '@sanity/ui'
import {Menu, MenuButton, MenuItem} from '@sanity/ui/menu'
import type {ComponentType} from 'react'
import {set, type StringInputProps} from 'sanity'

export const LINK_TYPES: {title: string; value: string; icon: ComponentType}[] = [
  {title: 'Internal', value: 'internal', icon: LinkIcon},
  {title: 'URL', value: 'external', icon: EarthAmericasIcon},
  {title: 'Relative Path', value: 'relative', icon: DocumentIcon},
  {title: 'Email', value: 'email', icon: EnvelopeIcon},
  {title: 'Phone', value: 'phone', icon: LinkIcon},
  {title: 'Résumé file', value: 'resume', icon: DownloadIcon},
]

/** Compact type picker rendered beside the link field (same UX as the AAIF Studio). */
export function LinkTypeInput({value, onChange}: StringInputProps) {
  const selected = LINK_TYPES.find((type) => type.value === value) ?? LINK_TYPES[0]

  return (
    <MenuButton
      id="link-type"
      button={
        <Button
          type="button"
          mode="ghost"
          icon={selected.icon}
          iconRight={ChevronDownIcon}
          title="Select link type"
          aria-label={`Select link type (currently: ${selected.title})`}
          style={{height: 35}}
        />
      }
      menu={
        <Menu>
          {LINK_TYPES.map((type) => (
            <MenuItem
              key={type.value}
              text={type.title}
              icon={type.icon}
              selected={type.value === value}
              onClick={() => onChange(set(type.value))}
            />
          ))}
        </Menu>
      }
    />
  )
}
