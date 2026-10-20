import {experience, role} from './documents/experience'
import {outreach} from './documents/outreach'
import {page} from './documents/page'
import {post} from './documents/post'
import {product} from './documents/product'
import {siteSettings} from './documents/siteSettings'
import {work} from './documents/work'
import {changelogEntry} from './objects/changelogEntry'
import {feature} from './objects/feature'
import {heading} from './objects/heading'
import {cta, simpleLink} from './objects/links'
import {portableText} from './objects/portableText'
import {seo} from './objects/seo'
import {contactSection} from './sections/contactSection'
import {experienceSection} from './sections/experienceSection'
import {heroSection} from './sections/heroSection'
import {infoColumn, infoSection} from './sections/infoSection'
import {introSection} from './sections/introSection'
import {listColumn, listColumnsSection, listItem} from './sections/listColumnsSection'
import {pageHeading} from './sections/pageHeading'
import {productsSection} from './sections/productsSection'
import {richTextSection} from './sections/richTextSection'
import {worksSection} from './sections/worksSection'
import {writingSection} from './sections/writingSection'

export const schemaTypes = [
  // Documents
  siteSettings,
  page,
  outreach,
  work,
  product,
  experience,
  post,
  // Objects
  heading,
  portableText,
  simpleLink,
  cta,
  seo,
  feature,
  changelogEntry,
  role,
  infoColumn,
  listColumn,
  listItem,
  // Page builder sections
  heroSection,
  pageHeading,
  worksSection,
  productsSection,
  writingSection,
  infoSection,
  experienceSection,
  introSection,
  listColumnsSection,
  contactSection,
  richTextSection,
]
