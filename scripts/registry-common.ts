import { Schema as S } from 'effect'

import { RegistryIndex } from '../src/registry/schema'
import {
  registrySourceRoot,
  validateRegistryItemManifest,
} from '../src/registry/validation'

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

export const buildRegistryIndex = () => {
  const result = checkRegistry()
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
    generatedAt: new Date().toISOString(),
    sourceRoot: registrySourceRoot,
    items,
  }

  return S.decodeUnknownSync(RegistryIndex)(index)
}

export const writeJson = (outputPath: string, value: unknown): void => {
  mkdirSync(pathModule.dirname(outputPath), { recursive: true })
  writeFileSync(outputPath, `${JSON.stringify(value, null, 2)}\n`)
}
