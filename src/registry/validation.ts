import { Array, Schema as S } from 'effect'

import { RegistryItemManifest } from './schema'
import type {
  DependencyRecord,
  ExampleManifest,
  RegistryItemManifest as RegistryItemManifestType,
} from './schema'

export const registrySourceRoot = 'registry-src'

export interface ValidationError {
  readonly path: string
  readonly message: string
}

export type SourceFileReader = (path: string) => string
export type PathExists = (path: string) => boolean

export interface ManifestValidationInput {
  readonly manifestPath: string
  readonly rawManifest: unknown
  readonly allItemIds: ReadonlySet<string>
  readonly readInstallableSource: SourceFileReader
  readonly pathExists: PathExists
}

export interface ManifestValidationResult {
  readonly manifest: RegistryItemManifestType
  readonly errors: ReadonlyArray<ValidationError>
}

export const requiredCompleteDocsHeadings = [
  'Overview',
  'Foldkit Model',
  'Usage',
  'Examples',
  'Accessibility',
  'Foldkit Differences',
]

const generatedManifestFields = [
  'manifestHash',
  'generatedAt',
  'computedDependencyGraph',
  'driftReport',
  'parityResults',
  'generatedDocsUrl',
]

const allowedRuntimeSpecifiers = new Set([
  '@foldkit/ui',
  'clsx',
  'effect',
  'foldkit',
  'tailwind-merge',
])

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export const idFromManifestPath = (manifestPath: string): string => {
  const normalized = manifestPath.replaceAll('\\', '/')
  const sourcePrefix = `${registrySourceRoot}/`
  const itemSuffix = '/item.json'

  if (
    !normalized.startsWith(sourcePrefix) ||
    !normalized.endsWith(itemSuffix)
  ) {
    return ''
  }

  return normalized.slice(sourcePrefix.length, -itemSuffix.length)
}

export const sourceRootFromManifestPath = (manifestPath: string): string => {
  const normalized = manifestPath.replaceAll('\\', '/')

  return normalized.endsWith('/item.json')
    ? normalized.slice(0, -'/item.json'.length)
    : ''
}

export const isFixtureOnlyPath = (sourcePath: string): boolean => {
  const normalized = sourcePath.replaceAll('\\', '/')

  return (
    normalized.startsWith('tests/parity/') ||
    normalized.includes('/origin/fixtures/')
  )
}

export const classifyDependency = (
  specifier: string,
): DependencyRecord['classification'] => {
  if (
    specifier.startsWith('base-ui/') ||
    specifier.startsWith('shadcn/') ||
    specifier.startsWith('utils/') ||
    specifier.startsWith('themes/') ||
    specifier.startsWith('blocks/') ||
    specifier.startsWith('charts/') ||
    specifier.startsWith('local/')
  ) {
    return 'registry-local'
  }

  if (allowedRuntimeSpecifiers.has(specifier)) {
    return 'allowed-runtime'
  }

  if (specifier === 'react' || specifier === 'react-dom') {
    return 'dev-or-fixture-only'
  }

  if (
    specifier.startsWith('@radix-ui/react-') ||
    specifier.startsWith('@base-ui-components/react') ||
    specifier.startsWith('@base-ui/react')
  ) {
    return 'replace-with-foldkit'
  }

  return 'reject-or-defer'
}

export const isForbiddenRuntimeImport = (specifier: string): boolean =>
  specifier === 'react' ||
  specifier === 'react-dom' ||
  specifier.startsWith('@radix-ui/react-') ||
  specifier.startsWith('@base-ui-components/react') ||
  specifier.startsWith('@base-ui/react') ||
  specifier.includes('repos/')

export const extractImportSpecifiers = (
  source: string,
): ReadonlyArray<string> => {
  const staticMatches = Array.fromIterable(
    source.matchAll(
      /\b(?:import|export)\s+(?:type\s+)?(?:[^'"]*?\s+from\s*)?['"](?<specifier>[^'"]+)['"]/gu,
    ),
  )
  const dynamicMatches = Array.fromIterable(
    source.matchAll(/\bimport\s*\(\s*['"](?<specifier>[^'"]+)['"]\s*\)/gu),
  )

  return [...staticMatches, ...dynamicMatches].flatMap(match => {
    const { specifier } = match.groups ?? {}

    return typeof specifier === 'string' ? [specifier] : []
  })
}

export const exportedExampleNameFromSource = (
  source: string,
  example: ExampleManifest,
): string | undefined => {
  const escapedTitle = example.title.replaceAll(/[.*+?^${}()|[\]\\]/gu, '\\$&')
  const exportPattern = new RegExp(
    `(?:^|\\n)export\\s+const\\s+(${escapedTitle})\\b`,
    'u',
  )

  return exportPattern.test(source) ? example.title : undefined
}

export const extractExampleSnippet = (
  source: string,
  example: ExampleManifest,
): string => {
  const escapedTitle = example.title.replaceAll(/[.*+?^${}()|[\]\\]/gu, '\\$&')
  const exportPattern = new RegExp(
    `(?:^|\\n)export\\s+const\\s+${escapedTitle}\\b`,
    'u',
  )
  const exportMatch = exportPattern.exec(source)

  if (exportMatch === null) {
    return source.trim()
  }

  const startIndex =
    exportMatch[0].startsWith('\n') && exportMatch.index < source.length
      ? exportMatch.index + 1
      : exportMatch.index
  const remainingSource = source.slice(startIndex)
  const nextExportMatch = /\nexport\s+const\s+\w+\b/u.exec(
    remainingSource.slice(1),
  )
  const endIndex =
    nextExportMatch === null
      ? remainingSource.length
      : nextExportMatch.index + 1

  return remainingSource.slice(0, endIndex).trim()
}

const generatedFieldErrors = (
  manifestPath: string,
  rawManifest: unknown,
): ReadonlyArray<ValidationError> => {
  if (!isRecord(rawManifest)) {
    return []
  }

  return generatedManifestFields
    .filter(field => Object.hasOwn(rawManifest, field))
    .map(field => ({
      path: manifestPath,
      message: `Generated field "${field}" does not belong in source item.json.`,
    }))
}

const dependencyErrors = (
  manifestPath: string,
  manifest: RegistryItemManifestType,
  allItemIds: ReadonlySet<string>,
): ReadonlyArray<ValidationError> => {
  const registryDependencyErrors = manifest.dependencies.registry.flatMap(
    dependency => {
      if (dependency.classification !== 'registry-local') {
        return [
          {
            path: manifestPath,
            message: `Registry dependency "${dependency.specifier}" must be classified as registry-local.`,
          },
        ]
      }

      if (!allItemIds.has(dependency.target)) {
        return [
          {
            path: manifestPath,
            message: `Registry dependency "${dependency.target}" is not present in registry-src.`,
          },
        ]
      }

      return []
    },
  )

  const runtimeDependencyErrors =
    manifest.lifecycle.availability === 'installable'
      ? manifest.dependencies.runtime.flatMap(dependency => {
          if (dependency.classification !== 'allowed-runtime') {
            return [
              {
                path: manifestPath,
                message: `Installable item has unresolved runtime dependency "${dependency.specifier}".`,
              },
            ]
          }

          return []
        })
      : []

  return [...registryDependencyErrors, ...runtimeDependencyErrors]
}

const installabilityErrors = (
  manifestPath: string,
  manifest: RegistryItemManifestType,
): ReadonlyArray<ValidationError> => {
  if (manifest.lifecycle.availability !== 'installable') {
    return []
  }

  const implementationErrors =
    manifest.lifecycle.implementationStatus === 'implemented'
      ? []
      : [
          {
            path: manifestPath,
            message: 'Installable items must be implemented.',
          },
        ]
  const parityErrors =
    manifest.lifecycle.parityStatus === 'accepted' ||
    manifest.lifecycle.parityStatus === 'waived'
      ? []
      : [
          {
            path: manifestPath,
            message: 'Installable items must have accepted or waived parity.',
          },
        ]

  return [...implementationErrors, ...parityErrors]
}

const parityFixturePathErrors = (
  manifestPath: string,
  manifest: RegistryItemManifestType,
  pathExists: PathExists,
): ReadonlyArray<ValidationError> => {
  if (
    manifest.lifecycle.availability !== 'installable' ||
    manifest.lifecycle.parityStatus !== 'accepted'
  ) {
    return []
  }

  const fixturePaths = [
    {
      field: 'originFixturePath',
      path: manifest.parity.originFixturePath,
    },
    {
      field: 'foldkitFixturePath',
      path: manifest.parity.foldkitFixturePath,
    },
  ]

  return fixturePaths.flatMap(fixturePath => {
    if (fixturePath.path === '') {
      return [
        {
          path: manifestPath,
          message: `Accepted installable parity requires ${fixturePath.field}.`,
        },
      ]
    }

    if (!pathExists(fixturePath.path)) {
      return [
        {
          path: manifestPath,
          message: `Parity fixture path does not exist: ${fixturePath.path}`,
        },
      ]
    }

    return []
  })
}

const importErrors = (
  manifestPath: string,
  manifest: RegistryItemManifestType,
  readInstallableSource: SourceFileReader,
): ReadonlyArray<ValidationError> =>
  manifest.installableSourcePaths.flatMap(sourcePath => {
    if (isFixtureOnlyPath(sourcePath)) {
      return []
    }

    const source = readInstallableSource(sourcePath)

    return extractImportSpecifiers(source)
      .filter(isForbiddenRuntimeImport)
      .map(specifier => ({
        path: sourcePath,
        message: `Installable source must not import "${specifier}".`,
      }))
  })

export const docsMarkdownPathFromManifest = (
  manifest: RegistryItemManifestType,
): string => `${manifest.sourceRoot}/docs.md`

export const extractMarkdownHeadingTexts = (
  markdown: string,
): ReadonlyArray<string> =>
  globalThis.Array.from(markdown.matchAll(/^#{1,6}\s+(?<text>.+)$/gmu)).flatMap(
    match => {
      const { text } = match.groups ?? {}

      return typeof text === 'string' ? [text.trim()] : []
    },
  )

const rawHtmlPattern = /^\s*<(?<tag>[a-z][a-z0-9-]*)(?:\s|>|\/>)/imu

const docsReadinessErrors = (
  manifestPath: string,
  manifest: RegistryItemManifestType,
  readText: SourceFileReader,
  pathExists: PathExists,
): ReadonlyArray<ValidationError> => {
  if (manifest.lifecycle.docsStatus !== 'complete') {
    return []
  }

  const docsMarkdownPath = docsMarkdownPathFromManifest(manifest)

  if (!pathExists(docsMarkdownPath)) {
    return [
      {
        path: manifestPath,
        message: `Complete docs require ${docsMarkdownPath}.`,
      },
    ]
  }

  const markdown = readText(docsMarkdownPath)
  const headingTexts = new Set(extractMarkdownHeadingTexts(markdown))
  const requiredHeadings = [manifest.name, ...requiredCompleteDocsHeadings]
  const missingHeadings = requiredHeadings.filter(
    heading => !headingTexts.has(heading),
  )
  const rawHtmlErrors = rawHtmlPattern.test(markdown)
    ? [
        {
          path: docsMarkdownPath,
          message: 'Complete docs must not include raw HTML.',
        },
      ]
    : []

  return [
    ...missingHeadings.map(heading => ({
      path: docsMarkdownPath,
      message: `Complete docs require a "${heading}" heading.`,
    })),
    ...rawHtmlErrors,
  ]
}

const exampleSourceErrors = (
  manifestPath: string,
  manifest: RegistryItemManifestType,
  readText: SourceFileReader,
  pathExists: PathExists,
): ReadonlyArray<ValidationError> => {
  if (
    manifest.lifecycle.availability !== 'installable' &&
    manifest.lifecycle.availability !== 'preview'
  ) {
    return []
  }

  return manifest.examples.flatMap(example => {
    if (!pathExists(example.sourcePath)) {
      return [
        {
          path: manifestPath,
          message: `Example source path does not exist: ${example.sourcePath}`,
        },
      ]
    }

    const snippet = extractExampleSnippet(readText(example.sourcePath), example)

    return snippet.trim() === ''
      ? [
          {
            path: manifestPath,
            message: `Example source generated an empty snippet: ${example.sourcePath}`,
          },
        ]
      : []
  })
}

export const validateRegistryItemManifest = ({
  manifestPath,
  rawManifest,
  allItemIds,
  readInstallableSource,
  pathExists,
}: ManifestValidationInput): ManifestValidationResult => {
  const manifest = S.decodeUnknownSync(RegistryItemManifest)(rawManifest)
  const expectedId = idFromManifestPath(manifestPath)
  const expectedSourceRoot = sourceRootFromManifestPath(manifestPath)
  const idErrors =
    manifest.id === expectedId
      ? []
      : [
          {
            path: manifestPath,
            message: `Manifest id "${manifest.id}" must match path "${expectedId}".`,
          },
        ]
  const sourceRootErrors =
    manifest.sourceRoot === expectedSourceRoot
      ? []
      : [
          {
            path: manifestPath,
            message: `Manifest sourceRoot "${manifest.sourceRoot}" must match "${expectedSourceRoot}".`,
          },
        ]
  const parityErrors =
    manifest.parity.itemId === manifest.id
      ? []
      : [
          {
            path: manifestPath,
            message: `Parity contract itemId "${manifest.parity.itemId}" must match manifest id "${manifest.id}".`,
          },
        ]

  return {
    manifest,
    errors: [
      ...generatedFieldErrors(manifestPath, rawManifest),
      ...idErrors,
      ...sourceRootErrors,
      ...parityErrors,
      ...dependencyErrors(manifestPath, manifest, allItemIds),
      ...installabilityErrors(manifestPath, manifest),
      ...parityFixturePathErrors(manifestPath, manifest, pathExists),
      ...importErrors(manifestPath, manifest, readInstallableSource),
      ...docsReadinessErrors(
        manifestPath,
        manifest,
        readInstallableSource,
        pathExists,
      ),
      ...exampleSourceErrors(
        manifestPath,
        manifest,
        readInstallableSource,
        pathExists,
      ),
    ],
  }
}
