import {
  Array as EffectArray,
  Effect,
  FileSystem,
  Option,
  Path,
  Schema as S,
} from 'effect'

import {
  InstallerConfig,
  InstallerError,
  InstallerWriteOperation,
  InstallerWritePlan,
  RegistryIndex,
} from '../registry/schema'
import type {
  InstallerConfig as InstallerConfigType,
  InstallerConflictPolicy,
  InstallerItemId,
  InstallerWriteOperation as InstallerWriteOperationType,
  InstallerWritePlan as InstallerWritePlanType,
  RegistryIndex as RegistryIndexType,
  RegistryIndexEntry,
} from '../registry/schema'

type InstallerEffect<Value> = Effect.Effect<
  Value,
  InstallerError,
  FileSystem.FileSystem | Path.Path
>

type OperationInput = Readonly<{
  entry: RegistryIndexEntry
  sourcePath: string
  targetPath: string
}>

const runtimeSourcePathForItem = (
  entry: RegistryIndexEntry,
): ReadonlyArray<string> =>
  entry.item.installableSourcePaths.filter(
    sourcePath =>
      sourcePath.endsWith('/index.ts') || sourcePath === 'src/utils/cn.ts',
  )

const optionNone = Option.none<string>()
const optionSome = (value: string) => Option.some(value)

const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error)

export const decodeInstallerConfig = (
  input: unknown,
): Effect.Effect<InstallerConfigType, InstallerError> =>
  Effect.try({
    try: () => S.decodeUnknownSync(InstallerConfig)(input),
    catch: error =>
      new InstallerError({
        reason: 'InvalidConfig',
        message: errorMessage(error),
        path: optionNone,
      }),
  })

const readText = (path: string, reason: InstallerError['reason']) =>
  Effect.gen(function* readTextProgram() {
    const fileSystem = yield* FileSystem.FileSystem

    return yield* fileSystem.readFileString(path).pipe(
      Effect.mapError(
        error =>
          new InstallerError({
            reason,
            message: error.message,
            path: optionSome(path),
          }),
      ),
    )
  })

const readRegistryIndex = (
  registryIndexPath: string,
): InstallerEffect<RegistryIndexType> =>
  Effect.gen(function* readRegistryIndexProgram() {
    const text = yield* readText(registryIndexPath, 'RegistryReadFailed')
    const raw = yield* Effect.try({
      try: () => {
        const parsed: unknown = JSON.parse(text)

        return parsed
      },
      catch: error =>
        new InstallerError({
          reason: 'RegistryReadFailed',
          message: errorMessage(error),
          path: optionSome(registryIndexPath),
        }),
    })

    return yield* Effect.try({
      try: () => S.decodeUnknownSync(RegistryIndex)(raw),
      catch: error =>
        new InstallerError({
          reason: 'RegistryReadFailed',
          message: errorMessage(error),
          path: optionSome(registryIndexPath),
        }),
    })
  })

const registryEntryById = (
  index: RegistryIndexType,
): ReadonlyMap<string, RegistryIndexEntry> =>
  new Map(index.items.map(entry => [entry.item.id, entry]))

const collectRegistryClosure = (
  entriesById: ReadonlyMap<string, RegistryIndexEntry>,
  itemId: string,
  visited: ReadonlySet<string> = new Set(),
): Effect.Effect<ReadonlyArray<RegistryIndexEntry>, InstallerError> => {
  if (visited.has(itemId)) {
    return Effect.succeed([])
  }

  const entry = entriesById.get(itemId)

  if (entry === undefined) {
    return Effect.fail(
      new InstallerError({
        reason: 'RegistryItemNotFound',
        message: `Registry item "${itemId}" was not found.`,
        path: optionSome(itemId),
      }),
    )
  }

  const nextVisited = new Set([...visited, itemId])

  return Effect.map(
    Effect.forEach(dependency =>
      collectRegistryClosure(entriesById, dependency.target, nextVisited),
    )(entry.item.dependencies.registry),
    dependencyGroups => [...dependencyGroups.flat(), entry],
  )
}

const dedupeEntries = (
  entries: ReadonlyArray<RegistryIndexEntry>,
): ReadonlyArray<RegistryIndexEntry> => {
  const initialEntries: ReadonlyArray<RegistryIndexEntry> = []

  return EffectArray.reduce(entries, initialEntries, (accumulator, entry) =>
    accumulator.some(candidate => candidate.item.id === entry.item.id)
      ? accumulator
      : [...accumulator, entry],
  )
}

const requireInstallableEntry = (
  entry: RegistryIndexEntry,
): Effect.Effect<RegistryIndexEntry, InstallerError> =>
  entry.item.lifecycle.availability === 'installable'
    ? Effect.succeed(entry)
    : Effect.fail(
        new InstallerError({
          reason: 'RegistryItemNotInstallable',
          message: `Registry item "${entry.item.id}" is not installable.`,
          path: optionSome(entry.item.id),
        }),
      )

const collectInstallableEntries = (
  index: RegistryIndexType,
  itemId: InstallerItemId,
): Effect.Effect<ReadonlyArray<RegistryIndexEntry>, InstallerError> =>
  Effect.flatMap(
    collectRegistryClosure(registryEntryById(index), itemId),
    entries =>
      Effect.map(
        Effect.forEach(dedupeEntries(entries), requireInstallableEntry),
        installableEntries => installableEntries,
      ),
  )

const targetPathForItem = (itemId: string): string =>
  `src/components/foldkitcn/${itemId}.ts`

const sourceArtifactHash = (
  entry: RegistryIndexEntry,
  sourcePath: string,
): Effect.Effect<string, InstallerError> => {
  const sourceArtifact = entry.artifacts.find(
    artifact => artifact.role === 'source' && artifact.path === sourcePath,
  )

  return sourceArtifact === undefined
    ? Effect.fail(
        new InstallerError({
          reason: 'SourceReadFailed',
          message: `Registry artifact for "${sourcePath}" was not found.`,
          path: optionSome(sourcePath),
        }),
      )
    : Effect.succeed(sourceArtifact.sha256)
}

const dropTsExtension = (path: string): string =>
  path.endsWith('.ts') ? path.slice(0, -'.ts'.length) : path

const normalizePath = (path: string): string => path.replaceAll('\\', '/')

const dirname = (path: string): string => {
  const normalized = normalizePath(path)
  const index = normalized.lastIndexOf('/')

  return index === -1 ? '.' : normalized.slice(0, index)
}

const moduleKeysForSourcePath = (sourcePath: string): ReadonlyArray<string> => {
  const withoutExtension = dropTsExtension(sourcePath)

  return withoutExtension.endsWith('/index')
    ? [withoutExtension, dirname(withoutExtension)]
    : [withoutExtension]
}

const operationInputsForEntries = (
  entries: ReadonlyArray<RegistryIndexEntry>,
): ReadonlyArray<OperationInput> =>
  entries.flatMap(entry =>
    runtimeSourcePathForItem(entry).map(sourcePath => ({
      entry,
      sourcePath,
      targetPath: targetPathForItem(entry.item.id),
    })),
  )

const moduleTargetsForOperations = (
  operations: ReadonlyArray<OperationInput>,
): ReadonlyMap<string, string> =>
  new Map(
    operations.flatMap(operation =>
      moduleKeysForSourcePath(operation.sourcePath).map(key => {
        const entry: readonly [string, string] = [
          key,
          dropTsExtension(operation.targetPath),
        ]

        return entry
      }),
    ),
  )

const relativeImportSpecifier = (
  pathService: Path.Path,
  fromPath: string,
  toPath: string,
): string => {
  const relative = pathService.relative(dirname(fromPath), toPath)

  return relative.startsWith('.') ? relative : `./${relative}`
}

const importSpecifierPattern =
  /(?<prefix>\b(?:import|export)\s+(?:type\s+)?(?:[^'"]*?\s+from\s*)?['"])(?<specifier>\.{1,2}\/[^'"]+)(?<suffix>['"])/gu

type ImportSpecifierGroups = Readonly<{
  prefix: string
  specifier: string
  suffix: string
}>

const isImportSpecifierGroups = (
  value: unknown,
): value is ImportSpecifierGroups =>
  typeof value === 'object' &&
  value !== null &&
  'prefix' in value &&
  typeof value.prefix === 'string' &&
  'specifier' in value &&
  typeof value.specifier === 'string' &&
  'suffix' in value &&
  typeof value.suffix === 'string'

const rewriteRegistryImports = (
  pathService: Path.Path,
  source: string,
  sourcePath: string,
  targetPath: string,
  moduleTargets: ReadonlyMap<string, string>,
): string =>
  source.replaceAll(
    importSpecifierPattern,
    (
      match: string,
      _prefix: string,
      _specifier: string,
      _suffix: string,
      ...rest: ReadonlyArray<unknown>
    ) => {
      const groups = rest.at(-1)

      if (!isImportSpecifierGroups(groups)) {
        return match
      }

      const { prefix, specifier, suffix } = groups
      const resolvedSourceModule = dropTsExtension(
        pathService.normalize(pathService.join(dirname(sourcePath), specifier)),
      )
      const targetModule = moduleTargets.get(resolvedSourceModule)

      return targetModule === undefined
        ? match
        : `${prefix}${relativeImportSpecifier(
            pathService,
            targetPath,
            targetModule,
          )}${suffix}`
    },
  )

const resolveTargetPath = (
  pathService: Path.Path,
  cwd: string,
  targetPath: string,
): Effect.Effect<string, InstallerError> => {
  const rootPath = pathService.resolve(cwd)
  const targetAbsolutePath = pathService.resolve(rootPath, targetPath)
  const relative = pathService.relative(rootPath, targetAbsolutePath)
  const isEscaped =
    relative === '..' ||
    relative.startsWith('../') ||
    pathService.isAbsolute(relative)

  return isEscaped
    ? Effect.fail(
        new InstallerError({
          reason: 'UnsafeTargetPath',
          message: `Installer target "${targetPath}" escapes "${rootPath}".`,
          path: optionSome(targetPath),
        }),
      )
    : Effect.succeed(targetAbsolutePath)
}

const operationStatus = (
  policy: InstallerConflictPolicy,
  currentContent: string | undefined,
  nextContent: string,
): InstallerWriteOperationType['status'] => {
  if (currentContent === undefined) {
    return 'create'
  }

  if (currentContent === nextContent) {
    return 'skip-identical'
  }

  return policy === 'overwrite' ? 'overwrite' : 'conflict'
}

const readExistingContent = (
  targetAbsolutePath: string,
): InstallerEffect<string | undefined> =>
  Effect.gen(function* readExistingContentProgram() {
    const fileSystem = yield* FileSystem.FileSystem
    const exists = yield* fileSystem.exists(targetAbsolutePath).pipe(
      Effect.mapError(
        error =>
          new InstallerError({
            reason: 'WriteFailed',
            message: error.message,
            path: optionSome(targetAbsolutePath),
          }),
      ),
    )

    if (!exists) {
      return
    }

    return yield* fileSystem.readFileString(targetAbsolutePath).pipe(
      Effect.mapError(
        error =>
          new InstallerError({
            reason: 'WriteFailed',
            message: error.message,
            path: optionSome(targetAbsolutePath),
          }),
      ),
    )
  })

const buildWriteOperation = (
  config: InstallerConfigType,
  moduleTargets: ReadonlyMap<string, string>,
  input: OperationInput,
): InstallerEffect<InstallerWriteOperationType> =>
  Effect.gen(function* buildWriteOperationProgram() {
    const pathService = yield* Path.Path
    const content = yield* readText(input.sourcePath, 'SourceReadFailed')
    const rewrittenContent = rewriteRegistryImports(
      pathService,
      content,
      input.sourcePath,
      input.targetPath,
      moduleTargets,
    )
    const targetAbsolutePath = yield* resolveTargetPath(
      pathService,
      config.cwd,
      input.targetPath,
    )
    const currentContent = yield* readExistingContent(targetAbsolutePath)
    const sha256 = yield* sourceArtifactHash(input.entry, input.sourcePath)

    return S.decodeUnknownSync(InstallerWriteOperation)({
      itemId: input.entry.item.id,
      sourcePath: input.sourcePath,
      targetPath: input.targetPath,
      targetAbsolutePath,
      sha256,
      content: rewrittenContent,
      status: operationStatus(
        config.conflictPolicy,
        currentContent,
        rewrittenContent,
      ),
    })
  })

export const createInstallerWritePlan = (
  config: InstallerConfigType,
): InstallerEffect<InstallerWritePlanType> =>
  Effect.gen(function* createInstallerWritePlanProgram() {
    const index = yield* readRegistryIndex(config.registryIndexPath)
    const entries = yield* collectInstallableEntries(index, config.itemId)
    const operationInputs = operationInputsForEntries(entries)
    const moduleTargets = moduleTargetsForOperations(operationInputs)
    const operations = yield* Effect.forEach(input =>
      buildWriteOperation(config, moduleTargets, input),
    )(operationInputs)
    const dependencies = entries
      .filter(entry => entry.item.id !== config.itemId)
      .map(entry => entry.item.id)

    return S.decodeUnknownSync(InstallerWritePlan)({
      itemId: config.itemId,
      cwd: config.cwd,
      registryIndexPath: config.registryIndexPath,
      conflictPolicy: config.conflictPolicy,
      dependencies,
      operations,
      hasConflicts: operations.some(
        operation => operation.status === 'conflict',
      ),
    })
  })

const writeOperation = (
  operation: InstallerWriteOperationType,
): InstallerEffect<void> => {
  if (operation.status === 'skip-identical') {
    return Effect.void
  }

  if (operation.status === 'conflict') {
    return Effect.fail(
      new InstallerError({
        reason: 'WriteConflict',
        message: `Refusing to overwrite "${operation.targetPath}". Re-run with --force to replace it.`,
        path: optionSome(operation.targetAbsolutePath),
      }),
    )
  }

  return Effect.gen(function* writeOperationProgram() {
    const fileSystem = yield* FileSystem.FileSystem
    const pathService = yield* Path.Path

    yield* fileSystem
      .makeDirectory(pathService.dirname(operation.targetAbsolutePath), {
        recursive: true,
      })
      .pipe(
        Effect.mapError(
          error =>
            new InstallerError({
              reason: 'WriteFailed',
              message: error.message,
              path: optionSome(operation.targetAbsolutePath),
            }),
        ),
      )
    yield* fileSystem
      .writeFileString(operation.targetAbsolutePath, operation.content)
      .pipe(
        Effect.mapError(
          error =>
            new InstallerError({
              reason: 'WriteFailed',
              message: error.message,
              path: optionSome(operation.targetAbsolutePath),
            }),
        ),
      )
  })
}

export const applyInstallerWritePlan = (
  plan: InstallerWritePlanType,
): InstallerEffect<InstallerWritePlanType> =>
  plan.hasConflicts
    ? Effect.fail(
        new InstallerError({
          reason: 'WriteConflict',
          message: `Refusing to overwrite ${plan.operations
            .filter(operation => operation.status === 'conflict')
            .map(operation => operation.targetPath)
            .join(', ')}. Re-run with --force to replace changed files.`,
          path: optionNone,
        }),
      )
    : Effect.as(
        Effect.forEach(operation => writeOperation(operation))(plan.operations),
        plan,
      )

export const runInstallerAdd = (
  config: InstallerConfigType,
): InstallerEffect<InstallerWritePlanType> =>
  Effect.flatMap(createInstallerWritePlan(config), plan =>
    config.dryRun ? Effect.succeed(plan) : applyInstallerWritePlan(plan),
  )

export const formatInstallerWritePlan = (
  plan: InstallerWritePlanType,
  dryRun: boolean,
): string => {
  const mode = dryRun ? 'Dry run' : 'Install'
  const dependencies =
    plan.dependencies.length === 0
      ? 'Dependencies: none'
      : `Dependencies: ${plan.dependencies.join(', ')}`
  const operationLines = plan.operations.map(
    operation =>
      `- ${operation.status}: ${operation.targetPath} (from ${operation.sourcePath})`,
  )

  return [
    `${mode}: foldkitcn add ${plan.itemId}`,
    `Project: ${plan.cwd}`,
    dependencies,
    'Writes:',
    ...operationLines,
  ].join('\n')
}
