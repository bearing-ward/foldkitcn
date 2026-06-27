import { describe, expect, test } from 'vitest'

import type { RegistryIndex } from '../src/registry/schema'
import {
  buildComponentDocsArtifacts,
  componentDocsRouteForItem,
  registryIndexIsCurrent,
  selectRegistryGeneratedAt,
} from './registry-common'

const emptyIndex = (generatedAt: string): RegistryIndex => ({
  schemaVersion: 1,
  generatedAt,
  sourceRoot: 'registry-src',
  items: [],
})

const registryIndexWithDocsItems = (): RegistryIndex => ({
  schemaVersion: 1,
  generatedAt: '2026-06-24T18:00:00.000Z',
  sourceRoot: 'registry-src',
  items: [
    {
      item: {
        schemaVersion: 1,
        id: 'shadcn/button',
        namespace: 'shadcn',
        name: 'Button',
        kind: 'component',
        description: 'Foldkit-native shadcn Button wrapper.',
        sourceRoot: 'registry-src/shadcn/button',
        installableSourcePaths: ['src/registry/shadcn/button/index.ts'],
        consumedThemeTokens: [],
        originProvenance: [],
        dependencies: {
          registry: [
            {
              specifier: 'base-ui/button',
              classification: 'registry-local',
              target: 'base-ui/button',
              reason: 'Button composes Base UI Button.',
            },
          ],
          runtime: [],
          development: [],
        },
        examples: [],
        parity: {
          itemId: 'shadcn/button',
          originFixturePath: '',
          foldkitFixturePath: '',
          requiredComparisons: [],
          acceptedDeviationIds: [],
        },
        lifecycle: {
          implementationStatus: 'implemented',
          parityStatus: 'accepted',
          driftStatus: 'current',
          availability: 'installable',
          docsStatus: 'missing',
        },
        deviations: [],
      },
      manifestHash: 'button-hash',
      artifacts: [],
    },
    {
      item: {
        schemaVersion: 1,
        id: 'local/example-preview',
        namespace: 'local',
        name: 'Example preview',
        kind: 'example',
        description: 'Private preview fixture.',
        sourceRoot: 'registry-src/local/example-preview',
        installableSourcePaths: [],
        consumedThemeTokens: [],
        originProvenance: [],
        dependencies: {
          registry: [],
          runtime: [
            {
              specifier: 'foldkit',
              classification: 'allowed-runtime',
              target: 'npm:foldkit',
              reason: 'Provides Foldkit Html types.',
            },
          ],
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
          docsStatus: 'missing',
        },
        deviations: [],
      },
      manifestHash: 'example-preview-hash',
      artifacts: [],
    },
  ],
})

describe('registry build helpers', () => {
  test('preserves generatedAt when registry index content is unchanged', () => {
    const previousIndex = emptyIndex('2026-06-24T18:00:00.000Z')
    const nextIndex = emptyIndex('2026-06-24T19:00:00.000Z')

    expect(
      selectRegistryGeneratedAt(nextIndex, {
        previousIndex,
        generatedAt: '2026-06-24T20:00:00.000Z',
      }),
    ).toBe('2026-06-24T18:00:00.000Z')
  })

  test('uses a fresh generatedAt value when registry index content changes', () => {
    const previousIndex = emptyIndex('2026-06-24T18:00:00.000Z')
    const nextIndex: RegistryIndex = {
      ...emptyIndex('2026-06-24T19:00:00.000Z'),
      sourceRoot: 'registry-src-next',
    }

    expect(
      selectRegistryGeneratedAt(nextIndex, {
        previousIndex,
        generatedAt: '2026-06-24T20:00:00.000Z',
      }),
    ).toBe('2026-06-24T20:00:00.000Z')
  })

  test('treats unchanged registry index content as current', () => {
    const previousIndex = emptyIndex('2026-06-24T18:00:00.000Z')
    const nextIndex = emptyIndex('2026-06-24T18:00:00.000Z')

    expect(registryIndexIsCurrent(previousIndex, nextIndex)).toBeTruthy()
  })

  test('treats changed registry index content as stale', () => {
    const previousIndex = emptyIndex('2026-06-24T18:00:00.000Z')
    const nextIndex: RegistryIndex = {
      ...emptyIndex('2026-06-24T18:00:00.000Z'),
      sourceRoot: 'registry-src-next',
    }

    expect(registryIndexIsCurrent(previousIndex, nextIndex)).toBeFalsy()
  })

  test('treats changed generatedAt alone as current after timestamp preservation', () => {
    const previousIndex = emptyIndex('2026-06-24T18:00:00.000Z')
    const nextIndex = emptyIndex('2026-06-24T19:00:00.000Z')
    const nextIndexWithPreservedGeneratedAt = {
      ...nextIndex,
      generatedAt: selectRegistryGeneratedAt(nextIndex, {
        previousIndex,
        generatedAt: nextIndex.generatedAt,
      }),
    }

    expect(
      registryIndexIsCurrent(previousIndex, nextIndexWithPreservedGeneratedAt),
    ).toBeTruthy()
  })

  test('builds the generated docs artifact route for shadcn button', () => {
    const index = registryIndexWithDocsItems()
    const route = componentDocsRouteForItem(index.items[0].item)
    const docs = buildComponentDocsArtifacts(index)

    expect(route.docsArtifactPath).toBe('registry/docs/shadcn/button.json')
    expect(docs.index.routes).toContainEqual(route)
    expect(docs.artifacts[0]?.routePath).toBe('/components/shadcn/button')
    expect(docs.artifacts[0]?.docsStatus).toBe('missing')
  })

  test('includes dependency and source references in every component docs artifact', () => {
    const index = registryIndexWithDocsItems()
    const docs = buildComponentDocsArtifacts(index)

    expect(docs.artifacts[0]?.dependencies.registry[0]?.target).toBe(
      'base-ui/button',
    )
    expect(docs.artifacts[0]?.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/button/index.ts',
    ])
    expect(docs.artifacts[1]?.sourceRoot).toBe(
      'registry-src/local/example-preview',
    )
    expect(docs.artifacts[1]?.dependencies.runtime[0]?.specifier).toBe(
      'foldkit',
    )
  })
})
