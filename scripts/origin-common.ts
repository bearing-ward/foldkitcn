import { Schema as S } from 'effect'

import { OriginResolution } from '../src/registry/schema'

import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import pathModule from 'node:path'

const normalizePath = (filePath: string): string =>
  filePath.replaceAll('\\', '/')

export const ensurePinnedRepo = (localRepoPath: string): string => {
  if (!existsSync(localRepoPath) || !statSync(localRepoPath).isDirectory()) {
    throw new Error(`Local origin repo is missing: ${localRepoPath}`)
  }

  const pinnedRef = execFileSync(
    'git',
    ['-C', localRepoPath, 'rev-parse', 'HEAD'],
    { encoding: 'utf-8' },
  ).trim()

  if (pinnedRef.length === 0) {
    throw new Error(
      `Pinned ref is missing for local origin repo: ${localRepoPath}`,
    )
  }

  return pinnedRef
}

const requirePaths = (paths: ReadonlyArray<string>): ReadonlyArray<string> =>
  paths.map(filePath => {
    if (!existsSync(filePath)) {
      throw new Error(`Origin evidence path is missing: ${filePath}`)
    }

    return normalizePath(filePath)
  })

const existingPaths = (paths: ReadonlyArray<string>): ReadonlyArray<string> =>
  paths.filter(existsSync).map(normalizePath)

const baseUiButtonResolution = (docsUrl: string) => {
  const localRepoPath = 'repos/base-ui'
  const pinnedRef = ensurePinnedRepo(localRepoPath)
  const resolution = {
    originKind: 'base-ui',
    originName: 'Base UI Button',
    docsUrl,
    localRepoPath,
    pinnedRef,
    sourcePaths: requirePaths([
      'repos/base-ui/packages/react/src/button/Button.tsx',
      'repos/base-ui/packages/react/src/button/ButtonDataAttributes.tsx',
      'repos/base-ui/packages/react/src/button/index.ts',
      'repos/base-ui/packages/react/src/internals/use-button/useButton.ts',
    ]),
    docsPaths: requirePaths([
      'repos/base-ui/docs/src/app/(docs)/react/components/button/page.mdx',
      'repos/base-ui/docs/src/app/(docs)/react/components/button/types.md',
      'repos/base-ui/docs/src/app/(docs)/react/components/button/types.ts',
    ]),
    demoPaths: requirePaths([
      'repos/base-ui/docs/src/app/(docs)/react/components/button/demos/hero/tailwind/index.tsx',
      'repos/base-ui/docs/src/app/(docs)/react/components/button/demos/loading/tailwind/index.tsx',
      'repos/base-ui/docs/src/app/(docs)/react/components/button/demos/hero/css-modules/index.tsx',
      'repos/base-ui/docs/src/app/(docs)/react/components/button/demos/loading/css-modules/index.tsx',
    ]),
    testPaths: requirePaths([
      'repos/base-ui/packages/react/src/button/Button.test.tsx',
    ]),
    specPaths: requirePaths([
      'repos/base-ui/packages/react/src/button/Button.spec.tsx',
    ]),
    apiReferencePaths: requirePaths([
      'repos/base-ui/docs/src/app/(docs)/react/components/button/types.ts',
      'repos/base-ui/docs/src/app/(docs)/react/components/button/types.md',
    ]),
    styleVariantPaths: [],
    registryDependencyHints: [],
    runtimeDependencyHints: ['@base-ui-components/react/button'],
    confidence: 'high',
    unresolvedQuestions: [],
  }

  return S.decodeUnknownSync(OriginResolution)(resolution)
}

const shadcnButtonResolution = (docsUrl: string) => {
  const localRepoPath = 'repos/ui'
  const pinnedRef = ensurePinnedRepo(localRepoPath)
  const styleVariantPaths = existingPaths([
    'repos/ui/apps/v4/styles/base-luma/ui/button.tsx',
    'repos/ui/apps/v4/styles/base-lyra/ui/button.tsx',
    'repos/ui/apps/v4/styles/base-maia/ui/button.tsx',
    'repos/ui/apps/v4/styles/base-mira/ui/button.tsx',
    'repos/ui/apps/v4/styles/base-nova/ui/button.tsx',
    'repos/ui/apps/v4/styles/base-rhea/ui/button.tsx',
    'repos/ui/apps/v4/styles/base-sera/ui/button.tsx',
    'repos/ui/apps/v4/styles/base-vega/ui/button.tsx',
    'repos/ui/apps/v4/styles/radix-nova/ui/button.tsx',
  ])
  const resolution = {
    originKind: 'shadcn',
    originName: 'shadcn Button',
    docsUrl,
    localRepoPath,
    pinnedRef,
    sourcePaths: requirePaths([
      'repos/ui/apps/v4/styles/base-nova/ui/button.tsx',
    ]),
    docsPaths: existingPaths([
      'repos/ui/apps/v4/content/docs/components/base/button.mdx',
      'repos/ui/apps/v4/content/docs/components/radix/button.mdx',
    ]),
    demoPaths: existingPaths([
      'repos/ui/apps/v4/examples/base/button-demo.tsx',
      'repos/ui/apps/v4/examples/base/button-default.tsx',
      'repos/ui/apps/v4/examples/base/button-destructive.tsx',
      'repos/ui/apps/v4/examples/base/button-ghost.tsx',
      'repos/ui/apps/v4/examples/base/button-outline.tsx',
      'repos/ui/apps/v4/examples/base/button-render.tsx',
      'repos/ui/apps/v4/examples/base/button-size.tsx',
      'repos/ui/apps/v4/examples/base/button-spinner.tsx',
      'repos/ui/apps/v4/examples/base/button-with-icon.tsx',
    ]),
    testPaths: existingPaths([
      'repos/ui/packages/tests/src/tests/add.test.ts',
      'repos/ui/packages/tests/src/tests/view.test.ts',
    ]),
    specPaths: [],
    apiReferencePaths: existingPaths([
      'repos/ui/apps/v4/content/docs/components/base/button.mdx',
    ]),
    styleVariantPaths,
    registryDependencyHints: ['base-ui/button', 'utils/cn'],
    runtimeDependencyHints: ['class-variance-authority'],
    confidence: 'medium',
    unresolvedQuestions: [
      'Select the first shadcn style pack for Foldkit parity fixtures.',
      'Replace CVA variant handling with Effect Schema literals and pure class maps.',
    ],
  }

  return S.decodeUnknownSync(OriginResolution)(resolution)
}

export const resolveOriginUrl = (docsUrl: string) => {
  if (docsUrl === 'https://base-ui.com/react/components/button') {
    return baseUiButtonResolution(docsUrl)
  }

  if (
    docsUrl === 'https://ui.shadcn.com/docs/components/button' ||
    docsUrl.includes('/components/button') ||
    docsUrl.includes('/button.json')
  ) {
    return shadcnButtonResolution(docsUrl)
  }

  throw new Error(`Unsupported origin URL: ${docsUrl}`)
}

const expandInventoryPath = (inventoryPath: string): ReadonlyArray<string> => {
  if (!existsSync(inventoryPath)) {
    throw new Error(`Inventory path is missing: ${inventoryPath}`)
  }

  const stat = statSync(inventoryPath)

  if (stat.isFile()) {
    return [normalizePath(inventoryPath)]
  }

  return readdirSync(inventoryPath, { withFileTypes: true }).flatMap(entry =>
    expandInventoryPath(pathModule.join(inventoryPath, entry.name)),
  )
}

export const inventoryOrigin = (
  localRepoPath: string,
  paths: ReadonlyArray<string>,
) => {
  const pinnedRef = ensurePinnedRepo(localRepoPath)
  const inventoryPaths = (paths.length > 0 ? paths : [localRepoPath])
    .flatMap(expandInventoryPath)
    .toSorted((left, right) => left.localeCompare(right))
  const hash = inventoryPaths.reduce((currentHash, inventoryPath) => {
    currentHash.update(inventoryPath)
    currentHash.update('\0')
    currentHash.update(readFileSync(inventoryPath))
    currentHash.update('\0')

    return currentHash
  }, createHash('sha256'))

  return {
    localRepoPath,
    pinnedRef,
    inventoryHash: hash.digest('hex'),
    files: inventoryPaths,
  }
}
