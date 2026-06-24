import { Schema as S } from 'effect'

import { OriginResolution } from '../src/registry/schema'
import { extractImportSpecifiers } from '../src/registry/validation'

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

const uniqueSortedPaths = (
  paths: ReadonlyArray<string>,
): ReadonlyArray<string> =>
  [...new Set(paths.map(normalizePath))].toSorted((left, right) =>
    left.localeCompare(right),
  )

const expandExistingPath = (inventoryPath: string): ReadonlyArray<string> => {
  if (!existsSync(inventoryPath)) {
    return []
  }

  const stat = statSync(inventoryPath)

  if (stat.isFile()) {
    return [normalizePath(inventoryPath)]
  }

  return readdirSync(inventoryPath, { withFileTypes: true }).flatMap(entry =>
    expandExistingPath(pathModule.join(inventoryPath, entry.name)),
  )
}

const requireInventoryFiles = (
  inventoryPath: string,
): ReadonlyArray<string> => {
  if (!existsSync(inventoryPath)) {
    throw new Error(`Origin evidence path is missing: ${inventoryPath}`)
  }

  return uniqueSortedPaths(expandExistingPath(inventoryPath))
}

const titleCaseSlug = (slug: string): string =>
  slug
    .split('-')
    .map(part => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(' ')

const parseBaseUiComponentSlug = (docsUrl: string): string | undefined => {
  const url = new URL(docsUrl)
  const match = url.pathname.match(/^\/react\/components\/(?<slug>[^/]+)$/u)

  return match?.groups?.slug
}

const parseShadcnComponentSlug = (docsUrl: string): string | undefined => {
  const url = new URL(docsUrl)
  const docsMatch = url.pathname.match(/^\/docs\/components\/(?<slug>[^/]+)$/u)
  const registryMatch = url.pathname.match(/\/(?<slug>[^/]+)\.json$/u)

  return docsMatch?.groups?.slug ?? registryMatch?.groups?.slug
}

const isTestPath = (filePath: string): boolean =>
  /(?:^|\/)[^/]+\.test\.[cm]?[tj]sx?$/u.test(filePath)

const isSpecPath = (filePath: string): boolean =>
  /(?:^|\/)[^/]+\.spec\.[cm]?[tj]sx?$/u.test(filePath)

const isSourceLikePath = (filePath: string): boolean =>
  /\.[cm]?[tj]sx?$/u.test(filePath)

const baseUiComponentRoot = (slug: string): string =>
  `repos/base-ui/packages/react/src/${slug}`

const baseUiDocsRoot = (slug: string): string =>
  `repos/base-ui/docs/src/app/(docs)/react/components/${slug}`

const hasBaseUiComponentEvidence = (slug: string): boolean =>
  existsSync(baseUiComponentRoot(slug)) && existsSync(baseUiDocsRoot(slug))

const baseUiButtonSourceOverrides = existingPaths([
  'repos/base-ui/packages/react/src/internals/use-button/useButton.ts',
])

const baseUiButtonTestOverrides = existingPaths([
  'repos/base-ui/packages/react/src/internals/use-button/useButton.test.tsx',
])

const baseUiResolution = (docsUrl: string, slug: string) => {
  const localRepoPath = 'repos/base-ui'
  const pinnedRef = ensurePinnedRepo(localRepoPath)
  const componentRoot = baseUiComponentRoot(slug)
  const docsRoot = baseUiDocsRoot(slug)
  const componentFiles = requireInventoryFiles(componentRoot)
  const docsFiles = requireInventoryFiles(docsRoot)
  const sourcePaths = uniqueSortedPaths([
    ...componentFiles.filter(
      filePath => !isTestPath(filePath) && !isSpecPath(filePath),
    ),
    ...(slug === 'button' ? baseUiButtonSourceOverrides : []),
  ])
  const docsPaths = docsFiles.filter(filePath => !filePath.includes('/demos/'))
  const demoPaths = docsFiles.filter(filePath => filePath.includes('/demos/'))
  const testPaths = uniqueSortedPaths([
    ...componentFiles.filter(isTestPath),
    ...(slug === 'button' ? baseUiButtonTestOverrides : []),
  ])
  const resolution = {
    originKind: 'base-ui',
    originName: `Base UI ${titleCaseSlug(slug)}`,
    docsUrl,
    localRepoPath,
    pinnedRef,
    sourcePaths,
    docsPaths,
    demoPaths,
    testPaths,
    specPaths: componentFiles.filter(isSpecPath),
    apiReferencePaths: docsPaths.filter(filePath =>
      /\/types\.(?:md|ts)$/u.test(filePath),
    ),
    styleVariantPaths: [],
    registryDependencyHints: [],
    runtimeDependencyHints: [`@base-ui-components/react/${slug}`],
    confidence: 'high',
    unresolvedQuestions: [],
  }

  return S.decodeUnknownSync(OriginResolution)(resolution)
}

const shadcnStyleVariantPaths = (slug: string): ReadonlyArray<string> => {
  const styleRoot = 'repos/ui/apps/v4/styles'

  if (!existsSync(styleRoot)) {
    throw new Error(`Origin evidence path is missing: ${styleRoot}`)
  }

  const baseStylePaths = readdirSync(styleRoot, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && entry.name.startsWith('base-'))
    .flatMap(entry =>
      existingPaths([
        pathModule.join(styleRoot, entry.name, 'ui', `${slug}.tsx`),
        pathModule.join(styleRoot, entry.name, 'ui-rtl', `${slug}.tsx`),
      ]),
    )
  const buttonRadixPrecedentPaths =
    slug === 'button'
      ? existingPaths([
          'repos/ui/apps/v4/styles/radix-nova/ui/button.tsx',
          'repos/ui/apps/v4/styles/radix-nova/ui-rtl/button.tsx',
        ])
      : []

  return uniqueSortedPaths([...baseStylePaths, ...buttonRadixPrecedentPaths])
}

const shadcnDocsPaths = (slug: string): ReadonlyArray<string> =>
  existingPaths([
    `repos/ui/apps/v4/content/docs/components/base/${slug}.mdx`,
    `repos/ui/apps/v4/content/docs/components/radix/${slug}.mdx`,
  ])

const shadcnComponentSlugs = (): ReadonlyArray<string> => {
  const componentRoot = 'repos/ui/apps/v4/styles/base-nova/ui'

  if (!existsSync(componentRoot)) {
    throw new Error(`Origin evidence path is missing: ${componentRoot}`)
  }

  return readdirSync(componentRoot, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.endsWith('.tsx'))
    .map(entry => entry.name.slice(0, -'.tsx'.length))
}

const isNestedComponentExample = (slug: string, fileName: string): boolean =>
  shadcnComponentSlugs().some(
    componentSlug =>
      componentSlug !== slug &&
      componentSlug.startsWith(`${slug}-`) &&
      fileName.startsWith(`${componentSlug}-`),
  )

const shadcnExamplePaths = (slug: string): ReadonlyArray<string> => {
  const examplesRoot = 'repos/ui/apps/v4/examples/base'

  if (!existsSync(examplesRoot)) {
    throw new Error(`Origin evidence path is missing: ${examplesRoot}`)
  }

  return uniqueSortedPaths(
    readdirSync(examplesRoot, { withFileTypes: true })
      .filter(
        entry =>
          entry.isFile() &&
          entry.name.startsWith(`${slug}-`) &&
          entry.name.endsWith('.tsx') &&
          !isNestedComponentExample(slug, entry.name),
      )
      .map(entry => pathModule.join(examplesRoot, entry.name)),
  )
}

const importedSpecifiers = (
  paths: ReadonlyArray<string>,
): ReadonlyArray<string> =>
  uniqueSortedPaths(
    paths
      .filter(isSourceLikePath)
      .flatMap(filePath =>
        extractImportSpecifiers(readFileSync(filePath, 'utf-8')),
      ),
  )

const shadcnRegistryHintFromImport = (
  currentSlug: string,
  specifier: string,
): string | undefined => {
  if (specifier === '@/lib/utils') {
    return 'utils/cn'
  }

  const styleMatch = specifier.match(
    /^@\/styles\/base-[^/]+\/ui(?:-rtl)?\/(?<slug>[^/]+)$/u,
  )

  if (styleMatch?.groups?.slug !== undefined) {
    const { slug } = styleMatch.groups

    return slug === currentSlug ? undefined : `shadcn/${slug}`
  }

  const baseUiMatch = specifier.match(/^@base-ui\/react\/(?<slug>[^/]+)$/u)

  if (
    baseUiMatch?.groups?.slug !== undefined &&
    hasBaseUiComponentEvidence(baseUiMatch.groups.slug)
  ) {
    return `base-ui/${baseUiMatch.groups.slug}`
  }

  return undefined
}

const isLocalShadcnImport = (specifier: string): boolean =>
  specifier === '@/lib/utils' ||
  /^@\/styles\/base-[^/]+\/ui(?:-rtl)?\/[^/]+$/u.test(specifier)

const isRelativeImport = (specifier: string): boolean =>
  specifier.startsWith('./') || specifier.startsWith('../')

const shadcnRuntimeHintFromImport = (specifier: string): string | undefined => {
  if (isRelativeImport(specifier) || isLocalShadcnImport(specifier)) {
    return undefined
  }

  return specifier
}

const shadcnResolution = (docsUrl: string, slug: string) => {
  const localRepoPath = 'repos/ui'
  const pinnedRef = ensurePinnedRepo(localRepoPath)
  const primarySourcePath = `repos/ui/apps/v4/styles/base-nova/ui/${slug}.tsx`
  const sourcePaths = requirePaths([primarySourcePath])
  const docsPaths = shadcnDocsPaths(slug)
  const demoPaths = shadcnExamplePaths(slug)
  const specifiers = importedSpecifiers([...sourcePaths, ...demoPaths])
  const registryDependencyHints = uniqueSortedPaths(
    specifiers.flatMap(specifier => {
      const maybeRegistryHint = shadcnRegistryHintFromImport(slug, specifier)

      return maybeRegistryHint === undefined ? [] : [maybeRegistryHint]
    }),
  )
  const runtimeDependencyHints = uniqueSortedPaths(
    specifiers.flatMap(specifier => {
      const maybeRuntimeHint = shadcnRuntimeHintFromImport(specifier)

      return maybeRuntimeHint === undefined ? [] : [maybeRuntimeHint]
    }),
  )
  const resolution = {
    originKind: 'shadcn',
    originName: `shadcn ${titleCaseSlug(slug)}`,
    docsUrl,
    localRepoPath,
    pinnedRef,
    sourcePaths,
    docsPaths,
    demoPaths,
    testPaths:
      slug === 'button'
        ? existingPaths([
            'repos/ui/packages/tests/src/tests/add.test.ts',
            'repos/ui/packages/tests/src/tests/view.test.ts',
          ])
        : [],
    specPaths: [],
    apiReferencePaths: docsPaths,
    styleVariantPaths: shadcnStyleVariantPaths(slug),
    registryDependencyHints,
    runtimeDependencyHints,
    confidence: 'medium',
    unresolvedQuestions: runtimeDependencyHints.includes(
      'class-variance-authority',
    )
      ? [
          'Select the first shadcn style pack for Foldkit parity fixtures.',
          'Replace CVA variant handling with Effect Schema literals and pure class maps.',
        ]
      : ['Select the first shadcn style pack for Foldkit parity fixtures.'],
  }

  return S.decodeUnknownSync(OriginResolution)(resolution)
}

export const resolveOriginUrl = (docsUrl: string) => {
  if (docsUrl.startsWith('https://base-ui.com/react/components/')) {
    const maybeSlug = parseBaseUiComponentSlug(docsUrl)

    if (maybeSlug !== undefined) {
      return baseUiResolution(docsUrl, maybeSlug)
    }
  }

  if (
    docsUrl.startsWith('https://ui.shadcn.com/docs/components/') ||
    docsUrl.includes('.json')
  ) {
    const maybeSlug = parseShadcnComponentSlug(docsUrl)

    if (maybeSlug !== undefined) {
      return shadcnResolution(docsUrl, maybeSlug)
    }
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
