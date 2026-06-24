import { Schema as S } from 'effect'
import { describe, expect, test } from 'vitest'

import { RegistryItemManifest } from './schema'

const validManifest = {
  schemaVersion: 1,
  id: 'local/example-preview',
  namespace: 'local',
  name: 'Example preview',
  kind: 'example',
  description: 'Private preview fixture used to validate registry schemas.',
  sourceRoot: 'registry-src/local/example-preview',
  installableSourcePaths: [],
  consumedThemeTokens: [],
  originProvenance: [],
  dependencies: {
    registry: [],
    runtime: [],
    development: [],
  },
  examples: [],
  parity: {
    itemId: 'local/example-preview',
    originFixturePath: '',
    foldkitFixturePath: '',
    requiredComparisons: [],
    acceptedDeviationIds: [],
  },
  lifecycle: {
    implementationStatus: 'planned',
    parityStatus: 'not-started',
    driftStatus: 'unknown',
    availability: 'private',
  },
  deviations: [],
}

describe('registry item manifest schema', () => {
  test('decodes a valid source manifest fixture', () => {
    const decoded = S.decodeUnknownSync(RegistryItemManifest)(validManifest)

    expect(decoded.id).toBe('local/example-preview')
    expect(decoded.lifecycle.availability).toBe('private')
  })

  test('rejects invalid lifecycle combinations at the schema boundary', () => {
    const invalidManifest = {
      ...validManifest,
      lifecycle: {
        ...validManifest.lifecycle,
        availability: 'public',
      },
    }

    expect(() =>
      S.decodeUnknownSync(RegistryItemManifest)(invalidManifest),
    ).toThrow(/public/u)
  })
})
