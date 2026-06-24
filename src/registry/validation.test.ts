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
  }
  readonly lifecycle?: {
    readonly implementationStatus: string
    readonly parityStatus: string
    readonly driftStatus: string
    readonly availability: string
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
    development: [],
  },
  examples: [],
  parity: parity ?? {
    itemId: id,
    originFixturePath: '',
    foldkitFixturePath: '',
    requiredComparisons: [],
    acceptedDeviationIds: [],
  },
  lifecycle: lifecycle ?? {
    implementationStatus: 'planned',
    parityStatus: 'not-started',
    driftStatus: 'unknown',
    availability: 'private',
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

  test('classifies origin React packages as replace-with-foldkit', () => {
    expect(classifyDependency('@radix-ui/react-slot')).toBe(
      'replace-with-foldkit',
    )
    expect(classifyDependency('base-ui/button')).toBe('registry-local')
  })
})
