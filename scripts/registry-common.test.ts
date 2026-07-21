import { Option, Schema as S } from 'effect'
import { describe, expect, test } from 'vitest'

import registryIndexJson from '../registry/index.json'
import type { RegistryIndex } from '../src/registry/schema'
import { RegistryIndex as RegistryIndexSchema } from '../src/registry/schema'
import {
  buildComponentDocsArtifacts,
  buildPublicRegistryArtifacts,
  componentDocsRouteForItem,
  checkPublicRegistryCurrent,
  registryIndexIsCurrent,
  publicInstallCommandForItemId,
  publicNameForItemId,
  selectRegistryGeneratedAt,
  writePublicRegistryArtifacts,
} from './registry-common'

import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'

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
        distinguishes: 'Provides the shadcn Button API for Foldkit.',
        behaviorExpectations: [
          'examples-render-without-errors',
          'examples-match-declared-behavior',
        ],
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
        distinguishes: 'Provides a private preview fixture.',
        behaviorExpectations: ['examples-render-without-errors'],
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

const actualRegistryIndex = (): RegistryIndex =>
  S.decodeUnknownSync(RegistryIndexSchema)(registryIndexJson)

const makeTempDir = (): string =>
  mkdtempSync(path.join(process.cwd(), 'tmp-public-registry-'))

const cleanupTempDir = (fixturePath: string): void => {
  rmSync(fixturePath, { recursive: true, force: true })
}

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
    const [buttonEntry] = index.items

    if (buttonEntry === undefined) {
      throw new Error('Expected the shadcn button registry fixture')
    }

    const route = componentDocsRouteForItem(buttonEntry.item)
    const docs = buildComponentDocsArtifacts(index)

    expect(route.docsArtifactPath).toBe('registry/docs/shadcn/button.json')
    expect(docs.index.routes).toContainEqual(route)
    expect(docs.artifacts[0]?.routePath).toBe('/components/shadcn/button')
    expect(docs.artifacts[0]?.docsStatus).toBe('missing')
  })

  test('generates example docs artifacts with snippets and dependencies', () => {
    const index = registryIndexWithDocsItems()
    const [buttonEntry] = index.items

    if (buttonEntry === undefined) {
      throw new Error('Expected the shadcn button registry fixture')
    }

    const docs = buildComponentDocsArtifacts({
      ...index,
      items: [
        {
          ...buttonEntry,
          item: {
            ...buttonEntry.item,
            examples: [
              {
                id: 'shadcn/button-default',
                title: 'ButtonDefault',
                description: 'Default shadcn Button example.',
                distinguishes: 'Shows the default Button configuration.',
                behaviorExpectations: [
                  'renders-without-errors',
                  'preview-contained',
                ],
                sourcePath: 'src/registry/shadcn/button/examples.ts',
                kind: 'demo',
              },
            ],
          },
        },
      ],
    })
    const example = docs.artifacts[0]?.examples[0]

    expect({
      componentItemId: example?.componentItemId,
      hasDefaultSnippet: example?.snippet.includes(
        'export const ButtonDefault',
      ),
      hasDemoSnippet: example?.snippet.includes('export const ButtonDemo'),
      previewStatus: example?.previewStatus,
      requiredRegistryItems: example?.requiredRegistryItems,
    }).toStrictEqual({
      componentItemId: 'shadcn/button',
      hasDefaultSnippet: true,
      hasDemoSnippet: false,
      previewStatus: 'live-ready',
      requiredRegistryItems: ['base-ui/button'],
    })
    expect(
      example === undefined
        ? ''
        : Option.match(example.previewExportName, {
            onNone: () => '',
            onSome: value => value,
          }),
    ).toBe('ButtonDefault')
  })

  test('leaves unregistered example exports static', () => {
    const index = registryIndexWithDocsItems()
    const [buttonEntry] = index.items

    if (buttonEntry === undefined) {
      throw new Error('Expected the shadcn button registry fixture')
    }

    const docs = buildComponentDocsArtifacts({
      ...index,
      items: [
        {
          ...buttonEntry,
          item: {
            ...buttonEntry.item,
            id: 'base-ui/button',
            examples: [
              {
                id: 'base-ui/button-default',
                title: 'ButtonDefault',
                description: 'Default Button example.',
                distinguishes: 'Shows the default Button configuration.',
                behaviorExpectations: [
                  'renders-without-errors',
                  'preview-contained',
                ],
                sourcePath: 'src/registry/shadcn/button/examples.ts',
                kind: 'demo',
              },
            ],
          },
        },
      ],
    })

    expect(docs.artifacts[0]?.examples[0]?.previewStatus).toBe('static')
  })

  test('includes dependency and source references in every component docs artifact', () => {
    const index = registryIndexWithDocsItems()
    const docs = buildComponentDocsArtifacts(index)

    expect({
      buttonInstallCommand:
        docs.artifacts[0] === undefined
          ? ''
          : Option.match(docs.artifacts[0].installCommand, {
              onNone: () => '',
              onSome: value => value,
            }),
      buttonRegistryDependency:
        docs.artifacts[0]?.dependencies.registry[0]?.target,
      buttonSourcePaths: docs.artifacts[0]?.installableSourcePaths,
    }).toStrictEqual({
      buttonInstallCommand: 'bunx shadcn@latest add @foldkitcn/shadcn-button',
      buttonRegistryDependency: 'base-ui/button',
      buttonSourcePaths: ['src/registry/shadcn/button/index.ts'],
    })
    expect({
      previewInstallCommandIsNone:
        docs.artifacts[1] === undefined
          ? true
          : Option.isNone(docs.artifacts[1].installCommand),
      previewRuntimeDependency:
        docs.artifacts[1]?.dependencies.runtime[0]?.specifier,
      previewSourceRoot: docs.artifacts[1]?.sourceRoot,
    }).toStrictEqual({
      previewInstallCommandIsNone: true,
      previewRuntimeDependency: 'foldkit',
      previewSourceRoot: 'registry-src/local/example-preview',
    })
  })
})

describe('public registry build helpers', () => {
  test('maps item ids to public registry names', () => {
    expect(publicNameForItemId('shadcn/button')).toBe('shadcn-button')
    expect(publicNameForItemId('base-ui/button')).toBe('base-ui-button')
    expect(publicNameForItemId('utils/cn')).toBe('utils-cn')
    expect(publicInstallCommandForItemId('shadcn/button')).toBe(
      'bunx shadcn@latest add @foldkitcn/shadcn-button',
    )
  })

  test('builds a public catalog and item payloads from the current registry index', () => {
    const index = actualRegistryIndex()
    const publicRegistry = buildPublicRegistryArtifacts(index)
    const itemNames = publicRegistry.catalog.items.map(item => item.name)
    const buttonCatalogItem = publicRegistry.catalog.items.find(
      item => item.name === 'shadcn-button',
    )

    expect(itemNames).toContain('shadcn-button')
    expect(itemNames.every(name => !name.startsWith('local-'))).toBeTruthy()
    expect(buttonCatalogItem?.files[0]).toMatchObject({
      target: 'src/components/foldkitcn/shadcn/button.ts',
      type: 'registry:ui',
    })
    expect(buttonCatalogItem?.files[0]?.content).toContain('Button')
  })

  test('builds a shadcn button item payload with rewritten dependencies', () => {
    const index = actualRegistryIndex()
    const publicRegistry = buildPublicRegistryArtifacts(index)
    const buttonItem = publicRegistry.items.find(
      item => item.name === 'shadcn-button',
    )

    expect(buttonItem).toMatchObject({
      name: 'shadcn-button',
      registryDependencies: expect.arrayContaining([
        '@foldkitcn/base-ui-button',
        '@foldkitcn/utils-cn',
      ]),
    })
    expect(buttonItem?.files[0]).toMatchObject({
      target: 'src/components/foldkitcn/shadcn/button.ts',
      type: 'registry:ui',
    })
    expect(
      buttonItem?.files.every(file =>
        [
          'react',
          'react-dom',
          '@radix-ui/react-',
          '@base-ui/react',
          'repos/',
        ].every(forbidden => !file.content.includes(forbidden)),
      ),
    ).toBeTruthy()
  })

  test('publishes only installed-source registry dependencies for shadcn input', () => {
    const index = actualRegistryIndex()
    const publicRegistry = buildPublicRegistryArtifacts(index)
    const docs = buildComponentDocsArtifacts(index)
    const inputItem = publicRegistry.items.find(
      item => item.name === 'shadcn-input',
    )
    const inputDocs = docs.artifacts.find(
      artifact => artifact.itemId === 'shadcn/input',
    )

    expect(inputItem?.registryDependencies).toStrictEqual([
      '@foldkitcn/base-ui-input',
      '@foldkitcn/utils-cn',
    ])
    expect(
      inputDocs?.dependencies.examples?.map(dependency => dependency.target),
    ).toStrictEqual([
      'shadcn/badge',
      'shadcn/button',
      'shadcn/button-group',
      'shadcn/field',
      'shadcn/input-group',
    ])
    expect(inputDocs?.examples[0]?.requiredRegistryItems).toStrictEqual([
      'base-ui/input',
      'utils/cn',
      'shadcn/badge',
      'shadcn/button',
      'shadcn/button-group',
      'shadcn/field',
      'shadcn/input-group',
    ])
  })

  test('fails when public registry artifacts are stale', () => {
    const index = actualRegistryIndex()
    const fixturePath = makeTempDir()

    try {
      const current = buildPublicRegistryArtifacts(index)
      const buttonItem = current.items.find(
        item => item.name === 'shadcn-button',
      )

      if (buttonItem === undefined) {
        throw new Error('Missing shadcn-button public registry item.')
      }

      writePublicRegistryArtifacts(current, fixturePath)
      writeFileSync(
        path.join(fixturePath, 'shadcn-button.json'),
        `${JSON.stringify(
          {
            ...buttonItem,
            description: 'Stale button description.',
          },
          null,
          2,
        )}\n`,
      )

      expect(() => checkPublicRegistryCurrent(index, fixturePath)).toThrow(
        /stale/u,
      )
    } finally {
      cleanupTempDir(fixturePath)
    }
  }, 30_000)
})
