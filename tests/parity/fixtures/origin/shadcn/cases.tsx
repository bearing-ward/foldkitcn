import type * as React from 'react'

import ButtonDefault from '../../../../../repos/ui/apps/v4/examples/base/button-default'
import ButtonRender from '../../../../../repos/ui/apps/v4/examples/base/button-render'
import type { ShadcnOriginCaseMetadata } from './case-metadata'
import { shadcnOriginCaseMetadata } from './case-metadata'

export interface ShadcnOriginCase extends ShadcnOriginCaseMetadata {
  readonly Component: () => React.ReactElement
}

const components: Readonly<Record<string, () => React.ReactElement>> = {
  'button-default': ButtonDefault,
  'button-render': ButtonRender,
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
