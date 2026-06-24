import type * as React from 'react'

import ButtonDefault from '../../../../../repos/ui/apps/v4/examples/base/button-default'
import ButtonDemo from '../../../../../repos/ui/apps/v4/examples/base/button-demo'
import ButtonDestructive from '../../../../../repos/ui/apps/v4/examples/base/button-destructive'
import ButtonGhost from '../../../../../repos/ui/apps/v4/examples/base/button-ghost'
import ButtonIcon from '../../../../../repos/ui/apps/v4/examples/base/button-icon'
import ButtonLink from '../../../../../repos/ui/apps/v4/examples/base/button-link'
import ButtonOutline from '../../../../../repos/ui/apps/v4/examples/base/button-outline'
import ButtonRender from '../../../../../repos/ui/apps/v4/examples/base/button-render'
import ButtonRounded from '../../../../../repos/ui/apps/v4/examples/base/button-rounded'
import { ButtonRtl } from '../../../../../repos/ui/apps/v4/examples/base/button-rtl'
import ButtonSecondary from '../../../../../repos/ui/apps/v4/examples/base/button-secondary'
import ButtonSize from '../../../../../repos/ui/apps/v4/examples/base/button-size'
import ButtonSpinner from '../../../../../repos/ui/apps/v4/examples/base/button-spinner'
import ButtonWithIcon from '../../../../../repos/ui/apps/v4/examples/base/button-with-icon'
import type { ShadcnOriginCaseMetadata } from './case-metadata'
import { shadcnOriginCaseMetadata } from './case-metadata'

export interface ShadcnOriginCase extends ShadcnOriginCaseMetadata {
  readonly Component: () => React.ReactElement
}

const components: Readonly<Record<string, () => React.ReactElement>> = {
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
}

export const shadcnOriginCases: ReadonlyArray<ShadcnOriginCase> =
  shadcnOriginCaseMetadata.map(metadata => {
    const Component = components[metadata.id]

    if (Component === undefined) {
      throw new Error(`Missing shadcn origin component for ${metadata.id}`)
    }

    return {
      ...metadata,
      Component,
    }
  })

export const findShadcnOriginCase = (id: string): ShadcnOriginCase => {
  const originCase = shadcnOriginCases.find(candidate => candidate.id === id)

  if (originCase === undefined) {
    throw new Error(`Unknown shadcn origin fixture case: ${id}`)
  }

  return originCase
}
