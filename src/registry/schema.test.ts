import { Schema as S } from 'effect'
import { describe, expect, test } from 'vitest'

import {
  ComponentDocsArtifact,
  ComponentDocsRoute,
  ComponentBehaviorExpectation,
  DocsStatus,
  ExampleDocsArtifact,
  ExampleBehaviorExpectation,
  InstallerConfig,
  InstallerItemId,
  InstallerWritePlan,
  InstallTargetPath,
  PublicRegistryCatalog,
  PublicRegistryItem,
  RegistryItemManifest,
} from './schema'
import type { ExamplePreviewStatus } from './schema'

import { readFileSync } from 'node:fs'

const exampleDocsArtifact = (previewStatus: ExamplePreviewStatus) => ({
  id: `shadcn/button-${previewStatus}`,
  title: `Button ${previewStatus}`,
  description: `Button ${previewStatus} example.`,
  distinguishes:
    'Shows the default button treatment without additional composition.',
  behaviorExpectations: ['renders-without-errors', 'preview-contained'],
  componentItemId: 'shadcn/button',
  sourcePath: 'src/registry/shadcn/button/examples.ts',
  snippet: 'export const ButtonDefault = (): Html => {}',
  previewStatus,
  previewExportName: 'ButtonDefault',
  requiredRegistryItems: ['base-ui/button', 'utils/cn'],
  notes: [],
})

describe('installer schemas', () => {
  test('decodes valid installer config and write plan boundaries', () => {
    const config = S.decodeUnknownSync(InstallerConfig)({
      itemId: 'shadcn/button',
      cwd: '/tmp/foldkitcn-fixture',
      registryIndexPath: 'registry/index.json',
      dryRun: true,
      conflictPolicy: 'preserve',
    })
    const plan = S.decodeUnknownSync(InstallerWritePlan)({
      itemId: 'shadcn/button',
      cwd: '/tmp/foldkitcn-fixture',
      registryIndexPath: 'registry/index.json',
      conflictPolicy: 'preserve',
      dependencies: ['base-ui/button', 'utils/cn'],
      operations: [
        {
          itemId: 'shadcn/button',
          sourcePath: 'src/registry/shadcn/button/index.ts',
          targetPath: 'src/components/foldkitcn/shadcn/button.ts',
          targetAbsolutePath:
            '/tmp/foldkitcn-fixture/src/components/foldkitcn/shadcn/button.ts',
          sha256:
            'f899e5b745c3d75ece719a5d3d0f2ef1a470812f7ace09cb1be642641f75e714',
          content: 'export const Button = {}',
          status: 'create',
        },
      ],
      hasConflicts: false,
    })

    expect(config.itemId).toBe('shadcn/button')
    expect(plan.operations[0]?.targetPath).toBe(
      'src/components/foldkitcn/shadcn/button.ts',
    )
  })

  test('rejects invalid installer item ids and target paths', () => {
    expect(() => S.decodeUnknownSync(InstallerItemId)('../button')).toThrow(
      /\.\.\/button/u,
    )
    expect(() =>
      S.decodeUnknownSync(InstallTargetPath)(
        'src/components/ui/shadcn/button.ts',
      ),
    ).toThrow(/src\/components\/ui\/shadcn\/button\.ts/u)
  })
})

const validManifest = {
  schemaVersion: 1,
  id: 'local/example-preview',
  namespace: 'local',
  name: 'Example preview',
  kind: 'example',
  description: 'Private preview fixture used to validate registry schemas.',
  distinguishes:
    'Provides a private schema fixture rather than a public UI component.',
  behaviorExpectations: ['examples-render-without-errors'],
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
  test('documents every supported behavior expectation', () => {
    const contractDocumentation = readFileSync(
      'docs/behavior-contracts.md',
      'utf-8',
    )
    const expectationNames = [
      ...ComponentBehaviorExpectation.literals,
      ...ExampleBehaviorExpectation.literals,
    ]

    expect(
      expectationNames.filter(
        expectation => !contractDocumentation.includes(`\`${expectation}\``),
      ),
    ).toStrictEqual([])
  })

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

  test('requires component and example behavior declarations', () => {
    const { distinguishes: _distinguishes, ...missingComponentDeclaration } =
      validManifest

    expect(() =>
      S.decodeUnknownSync(RegistryItemManifest)(missingComponentDeclaration),
    ).toThrow(/distinguishes/u)

    expect(() =>
      S.decodeUnknownSync(RegistryItemManifest)({
        ...validManifest,
        examples: [
          {
            id: 'local/example-preview-default',
            title: 'Default',
            description: 'Default preview.',
            sourcePath: 'src/example.ts',
            kind: 'demo',
          },
        ],
      }),
    ).toThrow(/distinguishes|behaviorExpectations/u)
  })
})

describe('generated docs artifact schemas', () => {
  test('decodes public registry catalogs', () => {
    const catalog = S.decodeUnknownSync(PublicRegistryCatalog)({
      $schema: 'https://ui.shadcn.com/schema/registry.json',
      name: 'foldkitcn',
      homepage: 'https://bearing-ward.github.io/foldkitcn/',
      items: [
        {
          $schema: 'https://ui.shadcn.com/schema/registry-item.json',
          name: 'shadcn-button',
          type: 'registry:ui',
          title: 'Button',
          description: 'Foldkit-native shadcn button wrapper.',
          dependencies: ['clsx'],
          registryDependencies: ['@foldkitcn/base-ui-button'],
          files: [
            {
              path: 'src/registry/shadcn/button/index.ts',
              type: 'registry:ui',
              target: 'src/components/foldkitcn/shadcn/button.ts',
              content: "import * as BaseButton from '../base-ui/button'",
            },
          ],
        },
      ],
    })

    expect(catalog.items[0]?.name).toBe('shadcn-button')
    expect(catalog.items[0]?.files[0]?.target).toBe(
      'src/components/foldkitcn/shadcn/button.ts',
    )
  })

  test('decodes public registry items with resolved file content', () => {
    const item = S.decodeUnknownSync(PublicRegistryItem)({
      $schema: 'https://ui.shadcn.com/schema/registry-item.json',
      name: 'shadcn-button',
      type: 'registry:ui',
      title: 'Button',
      description: 'Foldkit-native shadcn button wrapper.',
      distinguishes:
        'Provides Foldkit-native button semantics with shadcn styling.',
      behaviorExpectations: [
        'examples-render-without-errors',
        'examples-match-declared-behavior',
      ],
      dependencies: ['clsx'],
      registryDependencies: ['@foldkitcn/base-ui-button'],
      files: [
        {
          path: 'src/registry/shadcn/button/index.ts',
          type: 'registry:ui',
          target: 'src/components/foldkitcn/shadcn/button.ts',
          content: "import * as BaseButton from '../base-ui/button'",
        },
      ],
    })

    expect(item.files[0]?.target).toBe(
      'src/components/foldkitcn/shadcn/button.ts',
    )
  })

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
      distinguishes:
        'Provides Foldkit-native button semantics with shadcn styling.',
      behaviorExpectations: [
        'examples-render-without-errors',
        'examples-match-declared-behavior',
      ],
      docsStatus: 'complete',
      markdownPath: 'registry-src/shadcn/button/docs.md',
      markdown: '# Usage\n',
      headings: [{ id: 'usage', text: 'Usage', level: 1 }],
      installCommand: 'bunx shadcn@latest add @foldkitcn/shadcn-button',
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
        distinguishes:
          'Provides a private schema fixture rather than a public component.',
        behaviorExpectations: ['examples-render-without-errors'],
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
