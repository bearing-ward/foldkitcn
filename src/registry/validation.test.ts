import { describe, expect, test } from 'vitest'

import { classifyDependency, validateRegistryItemManifest } from './validation'

const makeManifest = ({
  id,
  sourceRoot,
  installableSourcePaths,
  dependencies,
  lifecycle,
  parity,
}: {
  readonly id: string
  readonly sourceRoot: string
  readonly installableSourcePaths: ReadonlyArray<string>
  readonly dependencies?: {
    readonly registry?: ReadonlyArray<{
      readonly specifier: string
      readonly classification: string
      readonly target: string
      readonly reason: string
    }>
    readonly runtime?: ReadonlyArray<{
      readonly specifier: string
      readonly classification: string
      readonly target: string
      readonly reason: string
    }>
    readonly development?: ReadonlyArray<{
      readonly specifier: string
      readonly classification: string
      readonly target: string
      readonly reason: string
    }>
  }
  readonly lifecycle?: {
    readonly implementationStatus: string
    readonly parityStatus: string
    readonly driftStatus: string
    readonly availability: string
    readonly docsStatus?: string
  }
  readonly parity?: {
    readonly itemId: string
    readonly originFixturePath: string
    readonly foldkitFixturePath: string
    readonly requiredComparisons: ReadonlyArray<string>
    readonly acceptedDeviationIds: ReadonlyArray<string>
  }
}) => ({
  schemaVersion: 1,
  id,
  namespace: id.startsWith('shadcn/') ? 'shadcn' : 'local',
  name: id,
  kind: 'component',
  description: `${id} test fixture`,
  sourceRoot,
  installableSourcePaths,
  consumedThemeTokens: [],
  originProvenance: [],
  dependencies: {
    registry: dependencies?.registry ?? [],
    runtime: dependencies?.runtime ?? [],
    development: dependencies?.development ?? [],
  },
  examples: [],
  parity: parity ?? {
    itemId: id,
    originFixturePath: '',
    foldkitFixturePath: '',
    requiredComparisons: [],
    acceptedDeviationIds: [],
  },
  lifecycle: {
    implementationStatus: lifecycle?.implementationStatus ?? 'planned',
    parityStatus: lifecycle?.parityStatus ?? 'not-started',
    driftStatus: lifecycle?.driftStatus ?? 'unknown',
    availability: lifecycle?.availability ?? 'private',
    docsStatus: lifecycle?.docsStatus ?? 'missing',
  },
  deviations: [],
})

const validateFixture = (
  manifestPath: string,
  rawManifest: unknown,
  allItemIds: ReadonlySet<string>,
  sourceByPath: ReadonlyMap<string, string>,
  existingPaths: ReadonlySet<string> = new Set(sourceByPath.keys()),
) =>
  validateRegistryItemManifest({
    manifestPath,
    rawManifest,
    allItemIds,
    readInstallableSource: sourcePath => sourceByPath.get(sourcePath) ?? '',
    pathExists: path => existingPaths.has(path),
  })

describe('registry validation', () => {
  test('rejects React imports from installable runtime source', () => {
    const sourcePath = 'src/registry/bad-runtime.ts'
    const result = validateFixture(
      'registry-src/local/react-import/item.json',
      makeManifest({
        id: 'local/react-import',
        sourceRoot: 'registry-src/local/react-import',
        installableSourcePaths: [sourcePath],
      }),
      new Set(['local/react-import']),
      new Map([[sourcePath, `import React from ${"'react'"}\n`]]),
    )

    expect(result.errors).toStrictEqual([
      {
        path: sourcePath,
        message: 'Installable source must not import "react".',
      },
    ])
  })

  test('allows React imports in origin fixture paths', () => {
    const sourcePath =
      'registry-src/local/react-fixture/origin/fixtures/button.tsx'
    const result = validateFixture(
      'registry-src/local/react-fixture/item.json',
      makeManifest({
        id: 'local/react-fixture',
        sourceRoot: 'registry-src/local/react-fixture',
        installableSourcePaths: [sourcePath],
      }),
      new Set(['local/react-fixture']),
      new Map([[sourcePath, `import React from ${"'react'"}\n`]]),
    )

    expect(result.errors).toStrictEqual([])
  })

  test('allows shadcn manifests to depend on local base-ui items', () => {
    const result = validateFixture(
      'registry-src/shadcn/button/item.json',
      makeManifest({
        id: 'shadcn/button',
        sourceRoot: 'registry-src/shadcn/button',
        installableSourcePaths: [],
        dependencies: {
          registry: [
            {
              specifier: 'base-ui/button',
              classification: 'registry-local',
              target: 'base-ui/button',
              reason: 'shadcn Button composes the local Base UI primitive.',
            },
          ],
        },
      }),
      new Set(['base-ui/button', 'shadcn/button']),
      new Map(),
    )

    expect(result.errors).toStrictEqual([])
  })

  test('prevents installable items with unresolved runtime dependencies', () => {
    const originFixturePath = 'tests/parity/origin/installable.fixture.ts'
    const foldkitFixturePath = 'tests/parity/foldkit/installable.fixture.ts'
    const result = validateFixture(
      'registry-src/local/installable/item.json',
      makeManifest({
        id: 'local/installable',
        sourceRoot: 'registry-src/local/installable',
        installableSourcePaths: [],
        parity: {
          itemId: 'local/installable',
          originFixturePath,
          foldkitFixturePath,
          requiredComparisons: ['attributes'],
          acceptedDeviationIds: [],
        },
        dependencies: {
          runtime: [
            {
              specifier: 'some-runtime-package',
              classification: 'reject-or-defer',
              target: '',
              reason: 'No local Foldkit replacement exists yet.',
            },
          ],
        },
        lifecycle: {
          implementationStatus: 'implemented',
          parityStatus: 'accepted',
          driftStatus: 'current',
          availability: 'installable',
        },
      }),
      new Set(['local/installable']),
      new Map(),
      new Set([originFixturePath, foldkitFixturePath]),
    )

    expect(result.errors).toStrictEqual([
      {
        path: 'registry-src/local/installable/item.json',
        message:
          'Installable item has unresolved runtime dependency "some-runtime-package".',
      },
    ])
  })

  test('prevents installable items with React runtime dependencies', () => {
    const originFixturePath = 'tests/parity/origin/installable.fixture.ts'
    const foldkitFixturePath = 'tests/parity/foldkit/installable.fixture.ts'
    const result = validateFixture(
      'registry-src/local/installable/item.json',
      makeManifest({
        id: 'local/installable',
        sourceRoot: 'registry-src/local/installable',
        installableSourcePaths: [],
        parity: {
          itemId: 'local/installable',
          originFixturePath,
          foldkitFixturePath,
          requiredComparisons: ['attributes'],
          acceptedDeviationIds: [],
        },
        dependencies: {
          runtime: [
            {
              specifier: 'react',
              classification: 'dev-or-fixture-only',
              target: '',
              reason: 'React is only used by origin fixture infrastructure.',
            },
          ],
        },
        lifecycle: {
          implementationStatus: 'implemented',
          parityStatus: 'accepted',
          driftStatus: 'current',
          availability: 'installable',
        },
      }),
      new Set(['local/installable']),
      new Map(),
      new Set([originFixturePath, foldkitFixturePath]),
    )

    expect(result.errors).toStrictEqual([
      {
        path: 'registry-src/local/installable/item.json',
        message: 'Installable item has unresolved runtime dependency "react".',
      },
    ])
  })

  test('prevents installable items with React DOM runtime dependencies', () => {
    const originFixturePath = 'tests/parity/origin/installable.fixture.ts'
    const foldkitFixturePath = 'tests/parity/foldkit/installable.fixture.ts'
    const result = validateFixture(
      'registry-src/local/installable/item.json',
      makeManifest({
        id: 'local/installable',
        sourceRoot: 'registry-src/local/installable',
        installableSourcePaths: [],
        parity: {
          itemId: 'local/installable',
          originFixturePath,
          foldkitFixturePath,
          requiredComparisons: ['attributes'],
          acceptedDeviationIds: [],
        },
        dependencies: {
          runtime: [
            {
              specifier: 'react-dom',
              classification: 'dev-or-fixture-only',
              target: '',
              reason:
                'React DOM is only used by origin fixture infrastructure.',
            },
          ],
        },
        lifecycle: {
          implementationStatus: 'implemented',
          parityStatus: 'accepted',
          driftStatus: 'current',
          availability: 'installable',
        },
      }),
      new Set(['local/installable']),
      new Map(),
      new Set([originFixturePath, foldkitFixturePath]),
    )

    expect(result.errors).toStrictEqual([
      {
        path: 'registry-src/local/installable/item.json',
        message:
          'Installable item has unresolved runtime dependency "react-dom".',
      },
    ])
  })

  test('allows preview items to record fixture-only runtime hints', () => {
    const result = validateFixture(
      'registry-src/local/preview/item.json',
      makeManifest({
        id: 'local/preview',
        sourceRoot: 'registry-src/local/preview',
        installableSourcePaths: [],
        dependencies: {
          runtime: [
            {
              specifier: 'react',
              classification: 'dev-or-fixture-only',
              target: '',
              reason: 'Preview planning captured an origin fixture dependency.',
            },
          ],
        },
        lifecycle: {
          implementationStatus: 'implemented',
          parityStatus: 'partial',
          driftStatus: 'current',
          availability: 'preview',
        },
      }),
      new Set(['local/preview']),
      new Map(),
    )

    expect(result.errors).toStrictEqual([])
  })

  test('allows installable items with fixture-only development dependencies', () => {
    const originFixturePath = 'tests/parity/origin/installable.fixture.ts'
    const foldkitFixturePath = 'tests/parity/foldkit/installable.fixture.ts'
    const result = validateFixture(
      'registry-src/local/installable/item.json',
      makeManifest({
        id: 'local/installable',
        sourceRoot: 'registry-src/local/installable',
        installableSourcePaths: [],
        parity: {
          itemId: 'local/installable',
          originFixturePath,
          foldkitFixturePath,
          requiredComparisons: ['attributes'],
          acceptedDeviationIds: [],
        },
        dependencies: {
          development: [
            {
              specifier: 'react',
              classification: 'dev-or-fixture-only',
              target: '',
              reason: 'React is only used by origin fixture infrastructure.',
            },
          ],
        },
        lifecycle: {
          implementationStatus: 'implemented',
          parityStatus: 'accepted',
          driftStatus: 'current',
          availability: 'installable',
        },
      }),
      new Set(['local/installable']),
      new Map(),
      new Set([originFixturePath, foldkitFixturePath]),
    )

    expect(result.errors).toStrictEqual([])
  })

  test('requires accepted installable parity fixture paths to exist', () => {
    const result = validateFixture(
      'registry-src/local/installable/item.json',
      makeManifest({
        id: 'local/installable',
        sourceRoot: 'registry-src/local/installable',
        installableSourcePaths: [],
        parity: {
          itemId: 'local/installable',
          originFixturePath: 'tests/parity/missing-origin.fixture.ts',
          foldkitFixturePath: 'tests/parity/missing-foldkit.fixture.ts',
          requiredComparisons: ['attributes'],
          acceptedDeviationIds: [],
        },
        lifecycle: {
          implementationStatus: 'implemented',
          parityStatus: 'accepted',
          driftStatus: 'current',
          availability: 'installable',
        },
      }),
      new Set(['local/installable']),
      new Map(),
    )

    expect(result.errors).toStrictEqual([
      {
        path: 'registry-src/local/installable/item.json',
        message:
          'Parity fixture path does not exist: tests/parity/missing-origin.fixture.ts',
      },
      {
        path: 'registry-src/local/installable/item.json',
        message:
          'Parity fixture path does not exist: tests/parity/missing-foldkit.fixture.ts',
      },
    ])
  })

  test('allows installable items to keep missing docs during migration', () => {
    const originFixturePath = 'tests/parity/origin/installable.fixture.ts'
    const foldkitFixturePath = 'tests/parity/foldkit/installable.fixture.ts'
    const result = validateFixture(
      'registry-src/local/installable/item.json',
      makeManifest({
        id: 'local/installable',
        sourceRoot: 'registry-src/local/installable',
        installableSourcePaths: [],
        parity: {
          itemId: 'local/installable',
          originFixturePath,
          foldkitFixturePath,
          requiredComparisons: ['attributes'],
          acceptedDeviationIds: [],
        },
        lifecycle: {
          implementationStatus: 'implemented',
          parityStatus: 'accepted',
          driftStatus: 'current',
          availability: 'installable',
          docsStatus: 'missing',
        },
      }),
      new Set(['local/installable']),
      new Map(),
      new Set([originFixturePath, foldkitFixturePath]),
    )

    expect(result.errors).toStrictEqual([])
  })

  test('rejects complete docs without a docs sidecar', () => {
    const result = validateFixture(
      'registry-src/local/complete/item.json',
      makeManifest({
        id: 'local/complete',
        sourceRoot: 'registry-src/local/complete',
        installableSourcePaths: [],
        lifecycle: {
          implementationStatus: 'planned',
          parityStatus: 'not-started',
          driftStatus: 'unknown',
          availability: 'private',
          docsStatus: 'complete',
        },
      }),
      new Set(['local/complete']),
      new Map(),
    )

    expect(result.errors).toStrictEqual([
      {
        path: 'registry-src/local/complete/item.json',
        message: 'Complete docs require registry-src/local/complete/docs.md.',
      },
    ])
  })

  test('rejects complete docs with missing required headings', () => {
    const docsPath = 'registry-src/local/complete/docs.md'
    const result = validateFixture(
      'registry-src/local/complete/item.json',
      makeManifest({
        id: 'local/complete',
        sourceRoot: 'registry-src/local/complete',
        installableSourcePaths: [],
        lifecycle: {
          implementationStatus: 'planned',
          parityStatus: 'not-started',
          driftStatus: 'unknown',
          availability: 'private',
          docsStatus: 'complete',
        },
      }),
      new Set(['local/complete']),
      new Map([[docsPath, '# Usage\n\n## Examples\n']]),
    )

    expect(result.errors).toStrictEqual([
      {
        path: docsPath,
        message: 'Complete docs require a "API" heading.',
      },
      {
        path: docsPath,
        message: 'Complete docs require a "Quality" heading.',
      },
    ])
  })

  test('allows stub docs status without a sidecar', () => {
    const result = validateFixture(
      'registry-src/local/stub/item.json',
      makeManifest({
        id: 'local/stub',
        sourceRoot: 'registry-src/local/stub',
        installableSourcePaths: [],
        lifecycle: {
          implementationStatus: 'planned',
          parityStatus: 'not-started',
          driftStatus: 'unknown',
          availability: 'private',
          docsStatus: 'stub',
        },
      }),
      new Set(['local/stub']),
      new Map(),
    )

    expect(result.errors).toStrictEqual([])
  })

  test('classifies registry-local dependency hints', () => {
    expect(classifyDependency('shadcn/table')).toBe('registry-local')
    expect(classifyDependency('base-ui/toast')).toBe('registry-local')
    expect(classifyDependency('utils/cn')).toBe('registry-local')
  })

  test('classifies React packages as dev-or-fixture-only', () => {
    expect(classifyDependency('react')).toBe('dev-or-fixture-only')
    expect(classifyDependency('react-dom')).toBe('dev-or-fixture-only')
  })

  test('classifies unsupported table and chart runtimes as reject-or-defer', () => {
    expect(classifyDependency('@tanstack/react-table')).toBe('reject-or-defer')
    expect(classifyDependency('@dnd-kit/core')).toBe('reject-or-defer')
    expect(classifyDependency('@dnd-kit/sortable')).toBe('reject-or-defer')
    expect(classifyDependency('recharts')).toBe('reject-or-defer')
    expect(classifyDependency('sonner')).toBe('reject-or-defer')
  })

  test('classifies unsupported date runtimes as reject-or-defer', () => {
    expect(classifyDependency('date-fns')).toBe('reject-or-defer')
    expect(classifyDependency('chrono-node')).toBe('reject-or-defer')
    expect(classifyDependency('react-day-picker')).toBe('reject-or-defer')
  })

  test('classifies origin React primitive packages as replace-with-foldkit', () => {
    expect(classifyDependency('@radix-ui/react-slot')).toBe(
      'replace-with-foldkit',
    )
  })
})
