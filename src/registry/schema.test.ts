import { Schema as S } from 'effect'
import { describe, expect, test } from 'vitest'

import {
  ComponentDocsArtifact,
  ComponentDocsRoute,
  DocsStatus,
  ExampleDocsArtifact,
  RegistryItemManifest,
} from './schema'
import type { ExamplePreviewStatus } from './schema'

const exampleDocsArtifact = (previewStatus: ExamplePreviewStatus) => ({
  id: `shadcn/button-${previewStatus}`,
  title: `Button ${previewStatus}`,
  description: `Button ${previewStatus} example.`,
  componentItemId: 'shadcn/button',
  sourcePath: 'src/registry/shadcn/button/examples.ts',
  snippet: 'export const ButtonDefault = (): Html => {}',
  previewStatus,
  previewExportName: 'ButtonDefault',
  requiredRegistryItems: ['base-ui/button', 'utils/cn'],
  notes: [],
})

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
    docsStatus: 'missing',
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

describe('generated docs artifact schemas', () => {
  test('decodes docs status values', () => {
    expect(S.decodeUnknownSync(DocsStatus)('missing')).toBe('missing')
    expect(() => S.decodeUnknownSync(DocsStatus)('draft')).toThrow(/draft/u)
  })

  test('decodes component docs routes', () => {
    const route = S.decodeUnknownSync(ComponentDocsRoute)({
      itemId: 'shadcn/button',
      routePath: '/components/shadcn/button',
      docsArtifactPath: 'registry/docs/shadcn/button.json',
    })

    expect(route.docsArtifactPath).toBe('registry/docs/shadcn/button.json')
  })

  test.each(['static', 'live-ready', 'blocked'] as const)(
    'encodes and decodes %s example docs artifacts',
    previewStatus => {
      const example = S.decodeUnknownSync(ExampleDocsArtifact)(
        exampleDocsArtifact(previewStatus),
      )

      expect(
        S.decodeUnknownSync(ExampleDocsArtifact)(
          S.encodeSync(ExampleDocsArtifact)(example),
        ),
      ).toStrictEqual(example)
    },
  )

  test('encodes and decodes component docs artifacts', () => {
    const artifact = S.decodeUnknownSync(ComponentDocsArtifact)({
      schemaVersion: 1,
      itemId: 'shadcn/button',
      routePath: '/components/shadcn/button',
      title: 'Button',
      description: 'Foldkit-native shadcn button wrapper.',
      docsStatus: 'complete',
      markdownPath: 'registry-src/shadcn/button/docs.md',
      markdown: '# Usage\n',
      headings: [{ id: 'usage', text: 'Usage', level: 1 }],
      installCommand: null,
      localInstallPath: 'src/registry/shadcn/button',
      defaultImportPath: 'shadcn/button',
      sourceRoot: 'registry-src/shadcn/button',
      installableSourcePaths: ['src/registry/shadcn/button/index.ts'],
      originProvenance: [],
      dependencies: {
        registry: [],
        runtime: [],
        development: [],
      },
      examples: [exampleDocsArtifact('static')],
      quality: {
        availability: 'installable',
        implementationStatus: 'implemented',
        parityStatus: 'accepted',
        driftStatus: 'current',
        deviations: [],
      },
    })

    expect(
      S.decodeUnknownSync(ComponentDocsArtifact)(
        S.encodeSync(ComponentDocsArtifact)(artifact),
      ),
    ).toStrictEqual(artifact)
  })

  test('requires source and dependency metadata on component docs artifacts', () => {
    expect(() =>
      S.decodeUnknownSync(ComponentDocsArtifact)({
        schemaVersion: 1,
        itemId: 'local/example-preview',
        routePath: '/components/local/example-preview',
        title: 'Example preview',
        description: 'Private preview fixture.',
        docsStatus: 'missing',
        markdownPath: null,
        markdown: null,
        headings: [],
        installCommand: null,
        localInstallPath: 'registry-src/local/example-preview',
        defaultImportPath: 'local/example-preview',
        examples: [],
        quality: {
          availability: 'private',
          implementationStatus: 'planned',
          parityStatus: 'not-started',
          driftStatus: 'unknown',
          deviations: [],
        },
      }),
    ).toThrow(/sourceRoot/u)
  })
})
