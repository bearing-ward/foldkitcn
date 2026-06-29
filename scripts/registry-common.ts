import { Schema as S } from 'effect'

import {
  ComponentDocsArtifact,
  ComponentDocsIndex,
  RegistryIndex,
} from '../src/registry/schema'
import type {
  ComponentDocsArtifact as ComponentDocsArtifactType,
  ComponentDocsIndex as ComponentDocsIndexType,
  ComponentDocsRoute,
  ExampleManifest,
  ExamplePreviewStatus,
  RegistryIndex as RegistryIndexType,
  RegistryItemManifest,
} from '../src/registry/schema'
import {
  docsMarkdownPathFromManifest,
  exportedExampleNameFromSource,
  extractExampleSnippet,
  registrySourceRoot,
  validateRegistryItemManifest,
} from '../src/registry/validation'

import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import pathModule from 'node:path'

interface RawManifestEntry {
  readonly manifestPath: string
  readonly rawManifest: unknown
}

interface RegistryCheckResult {
  readonly manifests: ReadonlyArray<
    ReturnType<typeof validateRegistryItemManifest>['manifest']
  >
  readonly entries: ReadonlyArray<RawManifestEntry>
}

interface BuildRegistryIndexOptions {
  readonly previousIndex?: RegistryIndexType
  readonly generatedAt?: string
}

interface ComponentDocsBuildResult {
  readonly index: ComponentDocsIndexType
  readonly artifacts: ReadonlyArray<ComponentDocsArtifactType>
}

interface RawExampleDocsArtifact {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly componentItemId: string
  readonly sourcePath: string
  readonly snippet: string
  readonly previewStatus: ExamplePreviewStatus
  readonly previewExportName: string | null
  readonly requiredRegistryItems: ReadonlyArray<string>
  readonly notes: ReadonlyArray<string>
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const normalizePath = (path: string): string => path.replaceAll('\\', '/')

export const hashText = (text: string): string =>
  createHash('sha256').update(text).digest('hex')

export const normalizeForHash = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(normalizeForHash)
  }

  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value)
        .toSorted(([left], [right]) => left.localeCompare(right))
        .map(([key, entryValue]) => [key, normalizeForHash(entryValue)]),
    )
  }

  return value
}

export const hashJson = (value: unknown): string =>
  hashText(JSON.stringify(normalizeForHash(value)))

const walkManifestPaths = (root: string): ReadonlyArray<string> => {
  if (!existsSync(root)) {
    return []
  }

  return readdirSync(root, { withFileTypes: true }).flatMap(entry => {
    const entryPath = pathModule.join(root, entry.name)

    if (entry.isDirectory()) {
      return walkManifestPaths(entryPath)
    }

    return entry.isFile() && entry.name === 'item.json'
      ? [normalizePath(entryPath)]
      : []
  })
}

const readJson = (path: string): unknown =>
  JSON.parse(readFileSync(path, 'utf-8'))

export const readRegistryIndex = (
  outputPath: string,
): RegistryIndexType | undefined => {
  if (!existsSync(outputPath)) {
    return undefined
  }

  try {
    return S.decodeUnknownSync(RegistryIndex)(readJson(outputPath))
  } catch {
    return undefined
  }
}

export const readComponentDocsIndex = (
  outputPath: string,
): ComponentDocsIndexType | undefined => {
  if (!existsSync(outputPath)) {
    return undefined
  }

  try {
    return S.decodeUnknownSync(ComponentDocsIndex)(readJson(outputPath))
  } catch {
    return undefined
  }
}

export const registryIndexIsCurrent = (
  previousIndex: RegistryIndexType,
  nextIndex: RegistryIndexType,
): boolean => hashJson(previousIndex) === hashJson(nextIndex)

export const componentDocsIndexIsCurrent = (
  previousIndex: ComponentDocsIndexType,
  nextIndex: ComponentDocsIndexType,
): boolean => hashJson(previousIndex) === hashJson(nextIndex)

const readInstallableSource = (sourcePath: string): string => {
  if (!existsSync(sourcePath)) {
    throw new Error(`Installable source path does not exist: ${sourcePath}`)
  }

  return readFileSync(sourcePath, 'utf-8')
}

export const loadRawManifestEntries = (): ReadonlyArray<RawManifestEntry> =>
  walkManifestPaths(registrySourceRoot)
    .toSorted((left, right) => left.localeCompare(right))
    .map(manifestPath => ({
      manifestPath,
      rawManifest: readJson(manifestPath),
    }))

export const checkRegistry = (): RegistryCheckResult => {
  const entries = loadRawManifestEntries()
  const allItemIds = new Set(
    entries.flatMap(entry =>
      isRecord(entry.rawManifest) && typeof entry.rawManifest.id === 'string'
        ? [entry.rawManifest.id]
        : [],
    ),
  )
  const validationResults = entries.map(entry =>
    validateRegistryItemManifest({
      ...entry,
      allItemIds,
      readInstallableSource,
      pathExists: existsSync,
    }),
  )
  const errors = validationResults.flatMap(result => result.errors)

  if (errors.length > 0) {
    throw new Error(
      errors.map(error => `${error.path}: ${error.message}`).join('\n'),
    )
  }

  return {
    entries,
    manifests: validationResults.map(result => result.manifest),
  }
}

const registryIndexSemanticHash = (index: RegistryIndexType): string =>
  hashJson({
    schemaVersion: index.schemaVersion,
    sourceRoot: index.sourceRoot,
    items: index.items,
  })

export const selectRegistryGeneratedAt = (
  nextIndex: RegistryIndexType,
  options: BuildRegistryIndexOptions = {},
): string =>
  options.previousIndex !== undefined &&
  registryIndexSemanticHash(options.previousIndex) ===
    registryIndexSemanticHash(nextIndex)
    ? options.previousIndex.generatedAt
    : (options.generatedAt ?? new Date().toISOString())

export const buildRegistryIndex = (options: BuildRegistryIndexOptions = {}) => {
  const result = checkRegistry()
  const generatedAt = options.generatedAt ?? new Date().toISOString()
  const manifestById = new Map(
    result.entries.map(entry =>
      isRecord(entry.rawManifest) && typeof entry.rawManifest.id === 'string'
        ? [entry.rawManifest.id, entry]
        : ['', entry],
    ),
  )
  const items = result.manifests.map(manifest => {
    const entry = manifestById.get(manifest.id)

    if (entry === undefined) {
      throw new Error(`Missing raw manifest entry for ${manifest.id}`)
    }

    const manifestRaw = readFileSync(entry.manifestPath, 'utf-8')
    const manifestArtifact = {
      path: entry.manifestPath,
      sha256: hashText(manifestRaw),
      sizeBytes: statSync(entry.manifestPath).size,
      role: 'manifest',
    }
    const sourceArtifacts = manifest.installableSourcePaths.map(sourcePath => ({
      path: sourcePath,
      sha256: hashText(readFileSync(sourcePath, 'utf-8')),
      sizeBytes: statSync(sourcePath).size,
      role: 'source',
    }))

    return {
      item: manifest,
      manifestHash: hashJson(entry.rawManifest),
      artifacts: [manifestArtifact, ...sourceArtifacts],
    }
  })
  const index = {
    schemaVersion: 1,
    generatedAt,
    sourceRoot: registrySourceRoot,
    items,
  }

  const decodedIndex = S.decodeUnknownSync(RegistryIndex)(index)

  return {
    ...decodedIndex,
    generatedAt: selectRegistryGeneratedAt(decodedIndex, {
      ...options,
      generatedAt,
    }),
  }
}

export const componentDocsRouteForItem = (
  item: RegistryItemManifest,
): ComponentDocsRoute => ({
  itemId: item.id,
  routePath: `/components/${item.id}`,
  docsArtifactPath: `registry/docs/${item.id}.json`,
})

const slugifyHeading = (text: string): string =>
  text
    .trim()
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/gu, '-')
    .replaceAll(/^-|-$/gu, '')

const extractMarkdownHeadings = (
  markdown: string,
): ComponentDocsArtifactType['headings'] =>
  globalThis.Array.from(
    markdown.matchAll(/^(?<marks>#{1,6})\s+(?<text>.+)$/gmu),
  ).flatMap(match => {
    const { marks, text } = match.groups ?? {}

    return typeof marks === 'string' && typeof text === 'string'
      ? [
          {
            id: slugifyHeading(text),
            text: text.trim(),
            level: marks.length,
          },
        ]
      : []
  })

const localInstallPathForItem = (item: RegistryItemManifest): string => {
  const [firstSourcePath] = item.installableSourcePaths

  return firstSourcePath === undefined
    ? item.sourceRoot
    : normalizePath(pathModule.dirname(firstSourcePath))
}

const requiredRegistryItemsForItem = (
  item: RegistryItemManifest,
): ReadonlyArray<string> =>
  item.dependencies.registry.map(dependency => dependency.target)

const liveReadyExampleExportsByItemId: Readonly<
  Record<string, ReadonlySet<string>>
> = {
  'base-ui/button': new Set([
    'ButtonDemo',
    'ButtonDisabled',
    'ButtonNonNative',
    'ButtonTypes',
    'ButtonLoading',
  ]),
  'base-ui/input': new Set(['InputDemo', 'InputDisabled']),
  'shadcn/button': new Set([
    'ButtonDefault',
    'ButtonDemo',
    'ButtonOutline',
    'ButtonSecondary',
    'ButtonGhost',
    'ButtonDestructive',
    'ButtonLink',
    'ButtonIcon',
    'ButtonWithIcon',
    'ButtonSize',
    'ButtonRounded',
    'ButtonSpinner',
    'ButtonRender',
    'ButtonRtl',
  ]),
  'shadcn/button-group': new Set([
    'ButtonGroupDemo',
    'ButtonGroupDropdown',
    'ButtonGroupInput',
    'ButtonGroupOrientation',
    'ButtonGroupPopover',
    'ButtonGroupRtl',
    'ButtonGroupSelect',
    'ButtonGroupSeparatorDemo',
    'ButtonGroupSize',
    'ButtonGroupSplit',
  ]),
  'shadcn/input-group': new Set([
    'InputGroupDemo',
    'InputGroupBasic',
    'InputGroupInlineStart',
    'InputGroupInlineEnd',
    'InputGroupBlockStart',
    'InputGroupBlockEnd',
    'InputGroupWithButtons',
    'InputGroupButtonGroup',
    'InputGroupDropdown',
    'InputGroupIcon',
    'InputGroupKbd',
    'InputGroupLabel',
    'InputGroupTextExample',
    'InputGroupTextareaExample',
    'InputGroupInCard',
    'InputGroupWithKbd',
    'InputGroupRtl',
  ]),
  'shadcn/item': new Set([
    'ItemAvatar',
    'ItemDemo',
    'ItemDropdown',
    'ItemGroupExample',
    'ItemHeaderDemo',
    'ItemIcon',
    'ItemImage',
    'ItemLink',
    'ItemRtl',
    'ItemSizeDemo',
    'ItemVariant',
  ]),
  'shadcn/radio-group': new Set([
    'RadioGroupDemo',
    'RadioGroupDescription',
    'RadioGroupChoiceCard',
    'RadioGroupDisabled',
    'RadioGroupFieldset',
    'RadioGroupInvalid',
    'RadioGroupRtl',
  ]),
}

const previewStatusForExample = (
  item: RegistryItemManifest,
  exportName: string | undefined,
): ExamplePreviewStatus => {
  if (
    exportName !== undefined &&
    liveReadyExampleExportsByItemId[item.id]?.has(exportName) === true
  ) {
    return 'live-ready'
  }

  return 'static'
}

const buildExampleDocsArtifact = (
  item: RegistryItemManifest,
  example: ExampleManifest,
): RawExampleDocsArtifact => {
  const source = readFileSync(example.sourcePath, 'utf-8')
  const exportName = exportedExampleNameFromSource(source, example)
  const artifact = {
    id: example.id,
    title: example.title,
    description: example.description,
    componentItemId: item.id,
    sourcePath: example.sourcePath,
    snippet: extractExampleSnippet(source, example),
    previewStatus: previewStatusForExample(item, exportName),
    previewExportName: exportName ?? null,
    requiredRegistryItems: requiredRegistryItemsForItem(item),
    notes: [],
  }

  return artifact
}

export const writeJson = (outputPath: string, value: unknown): void => {
  mkdirSync(pathModule.dirname(outputPath), { recursive: true })
  writeFileSync(outputPath, `${JSON.stringify(value, null, 2)}\n`)
  execFileSync('bun', ['x', 'oxfmt', '--write', outputPath], {
    stdio: 'ignore',
  })
}

export const buildComponentDocsArtifacts = (
  registryIndex: RegistryIndexType,
): ComponentDocsBuildResult => {
  const artifacts = registryIndex.items.map(entry => {
    const { item } = entry
    const docsMarkdownPath = docsMarkdownPathFromManifest(item)
    const hasMarkdown = existsSync(docsMarkdownPath)
    const markdown = hasMarkdown ? readFileSync(docsMarkdownPath, 'utf-8') : ''
    const route = componentDocsRouteForItem(item)
    const artifact = {
      schemaVersion: 1,
      itemId: item.id,
      routePath: route.routePath,
      title: item.name,
      description: item.description,
      docsStatus: hasMarkdown ? item.lifecycle.docsStatus : 'missing',
      markdownPath: hasMarkdown ? docsMarkdownPath : null,
      markdown: hasMarkdown ? markdown : null,
      headings: hasMarkdown ? extractMarkdownHeadings(markdown) : [],
      installCommand: null,
      localInstallPath: localInstallPathForItem(item),
      defaultImportPath: item.id,
      sourceRoot: item.sourceRoot,
      installableSourcePaths: item.installableSourcePaths,
      originProvenance: item.originProvenance,
      dependencies: item.dependencies,
      examples: item.examples.map(example =>
        buildExampleDocsArtifact(item, example),
      ),
      quality: {
        availability: item.lifecycle.availability,
        implementationStatus: item.lifecycle.implementationStatus,
        parityStatus: item.lifecycle.parityStatus,
        driftStatus: item.lifecycle.driftStatus,
        deviations: item.deviations,
      },
    }

    return S.decodeUnknownSync(ComponentDocsArtifact)(artifact)
  })
  const index = {
    schemaVersion: 1,
    generatedAt: registryIndex.generatedAt,
    routes: registryIndex.items.map(entry =>
      componentDocsRouteForItem(entry.item),
    ),
  }

  return {
    artifacts,
    index: S.decodeUnknownSync(ComponentDocsIndex)(index),
  }
}

export const writeComponentDocsArtifacts = (
  result: ComponentDocsBuildResult,
): void => {
  writeJson(
    'registry/docs/index.json',
    S.encodeSync(ComponentDocsIndex)(result.index),
  )

  void result.artifacts.map(artifact =>
    writeJson(
      `registry/docs/${artifact.itemId}.json`,
      S.encodeSync(ComponentDocsArtifact)(artifact),
    ),
  )
}

export const checkComponentDocsCurrent = (
  registryIndex: RegistryIndexType,
): ComponentDocsIndexType => {
  const outputPath = 'registry/docs/index.json'

  if (!existsSync(outputPath)) {
    throw new Error(`${outputPath} is missing; run bun run registry:build`)
  }

  const previousIndex = readComponentDocsIndex(outputPath)

  if (previousIndex === undefined) {
    throw new Error(`${outputPath} is invalid; run bun run registry:build`)
  }

  const nextResult = buildComponentDocsArtifacts(registryIndex)

  if (!componentDocsIndexIsCurrent(previousIndex, nextResult.index)) {
    throw new Error(`${outputPath} is stale; run bun run registry:build`)
  }

  void nextResult.artifacts.map(nextArtifact => {
    const artifactPath = `registry/docs/${nextArtifact.itemId}.json`

    if (!existsSync(artifactPath)) {
      throw new Error(`${artifactPath} is missing; run bun run registry:build`)
    }

    const previousArtifact = S.decodeUnknownSync(ComponentDocsArtifact)(
      readJson(artifactPath),
    )

    if (hashJson(previousArtifact) !== hashJson(nextArtifact)) {
      throw new Error(`${artifactPath} is stale; run bun run registry:build`)
    }

    return artifactPath
  })

  return previousIndex
}

export const checkRegistryIndexCurrent = (
  outputPath: string,
): RegistryIndexType => {
  if (!existsSync(outputPath)) {
    throw new Error(`${outputPath} is missing; run bun run registry:build`)
  }

  const previousIndex = readRegistryIndex(outputPath)

  if (previousIndex === undefined) {
    throw new Error(`${outputPath} is invalid; run bun run registry:build`)
  }

  const nextIndex = buildRegistryIndex({ previousIndex })

  if (!registryIndexIsCurrent(previousIndex, nextIndex)) {
    throw new Error(`${outputPath} is stale; run bun run registry:build`)
  }

  checkComponentDocsCurrent(previousIndex)

  return previousIndex
}
