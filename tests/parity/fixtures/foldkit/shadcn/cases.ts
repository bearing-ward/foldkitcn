import type { Html } from 'foldkit/html'

import {
  BadgeColors,
  BadgeDemo,
  BadgeIcon,
  BadgeLink,
  BadgeRtl,
  BadgeSpinner,
  BadgeVariants,
} from '../../../../../src/registry/shadcn/badge/examples'
import {
  ButtonDefault,
  ButtonDemo,
  ButtonDestructive,
  ButtonGhost,
  ButtonIcon,
  ButtonLink,
  ButtonOutline,
  ButtonRender,
  ButtonRounded,
  ButtonRtl,
  ButtonSecondary,
  ButtonSize,
  ButtonSpinner,
  ButtonWithIcon,
} from '../../../../../src/registry/shadcn/button/examples'
import {
  SeparatorDemo,
  SeparatorList,
  SeparatorMenu,
  SeparatorRtl,
  SeparatorVertical,
} from '../../../../../src/registry/shadcn/separator/examples'
import type { ShadcnOriginCaseMetadata } from '../../origin/shadcn/case-metadata'
import { shadcnOriginCaseMetadata } from '../../origin/shadcn/case-metadata'

export interface ShadcnFoldkitCase extends ShadcnOriginCaseMetadata {
  readonly view: () => Html
}

const components: Readonly<Record<string, () => Html>> = {
  'badge-colors': BadgeColors,
  'badge-demo': BadgeDemo,
  'badge-icon': BadgeIcon,
  'badge-link': BadgeLink,
  'badge-rtl': BadgeRtl,
  'badge-spinner': BadgeSpinner,
  'badge-variants': BadgeVariants,
  'button-default': ButtonDefault,
  'button-demo': ButtonDemo,
  'button-outline': ButtonOutline,
  'button-secondary': ButtonSecondary,
  'button-ghost': ButtonGhost,
  'button-destructive': ButtonDestructive,
  'button-link': ButtonLink,
  'button-icon': ButtonIcon,
  'button-with-icon': ButtonWithIcon,
  'button-size': ButtonSize,
  'button-rounded': ButtonRounded,
  'button-spinner': ButtonSpinner,
  'button-render': ButtonRender,
  'button-rtl': ButtonRtl,
  'separator-demo': SeparatorDemo,
  'separator-list': SeparatorList,
  'separator-menu': SeparatorMenu,
  'separator-vertical': SeparatorVertical,
  'separator-rtl': SeparatorRtl,
}

const foldkitSourcePath = (id: string): string => {
  if (id.startsWith('badge-')) {
    return 'src/registry/shadcn/badge/examples.ts'
  }

  if (id.startsWith('separator-')) {
    return 'src/registry/shadcn/separator/examples.ts'
  }

  return 'src/registry/shadcn/button/examples.ts'
}

export const shadcnFoldkitCases: ReadonlyArray<ShadcnFoldkitCase> =
  shadcnOriginCaseMetadata.map(metadata => {
    const view = components[metadata.id]

    if (view === undefined) {
      throw new Error(`Missing shadcn Foldkit component for ${metadata.id}`)
    }

    return {
      ...metadata,
      originFilePath: foldkitSourcePath(metadata.id),
      view,
    }
  })

export const findShadcnFoldkitCase = (id: string): ShadcnFoldkitCase => {
  const foldkitCase = shadcnFoldkitCases.find(candidate => candidate.id === id)

  if (foldkitCase === undefined) {
    throw new Error(`Unknown shadcn Foldkit fixture case: ${id}`)
  }

  return foldkitCase
}
