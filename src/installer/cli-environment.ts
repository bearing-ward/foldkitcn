import {
  Effect,
  FileSystem,
  Layer,
  Path,
  PlatformError,
  Stdio,
  Terminal,
} from 'effect'
import { ChildProcessSpawner } from 'effect/unstable/process'

import { access, mkdir, readFile, writeFile } from 'node:fs/promises'

const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error)

const errorCode = (error: unknown): string =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  typeof error.code === 'string'
    ? error.code
    : ''

const toSystemErrorTag = (error: unknown): PlatformError.SystemErrorTag => {
  const code = errorCode(error)

  if (code === 'ENOENT') {
    return 'NotFound'
  }

  if (code === 'EACCES' || code === 'EPERM') {
    return 'PermissionDenied'
  }

  if (code === 'EEXIST') {
    return 'AlreadyExists'
  }

  return 'Unknown'
}

const toPlatformError = (
  method: string,
  path: string,
  error: unknown,
): PlatformError.PlatformError =>
  PlatformError.systemError({
    _tag: toSystemErrorTag(error),
    module: 'FileSystem',
    method,
    description: errorMessage(error),
    pathOrDescriptor: path,
    cause: error,
  })

export const makeNodeFileSystem = (): FileSystem.FileSystem =>
  FileSystem.makeNoop({
    exists: path =>
      Effect.promise(async () => {
        try {
          await access(path)

          return true
        } catch {
          return false
        }
      }),
    readFileString: path =>
      Effect.tryPromise({
        try: () => readFile(path, 'utf-8'),
        catch: error => toPlatformError('readFileString', path, error),
      }),
    makeDirectory: (path, options) =>
      Effect.tryPromise({
        try: async () => {
          await mkdir(path, {
            recursive: options?.recursive ?? false,
            mode: options?.mode,
          })
        },
        catch: error => toPlatformError('makeDirectory', path, error),
      }),
    writeFileString: (path, data, options) =>
      Effect.tryPromise({
        try: () =>
          writeFile(path, data, {
            flag: options?.flag,
            mode: options?.mode,
          }),
        catch: error => toPlatformError('writeFileString', path, error),
      }),
  })

export const makeTerminal = (
  display: (text: string) => void,
): Terminal.Terminal =>
  Terminal.make({
    columns: Effect.succeed(80),
    rows: Effect.succeed(24),
    readInput: Effect.die('Terminal input is not supported by foldkitcn.'),
    readLine: Effect.fail(new Terminal.QuitError()),
    display: text => Effect.sync(() => display(text)),
  })

const childProcessSpawner = ChildProcessSpawner.make(() =>
  Effect.die('Child processes are not used by foldkitcn.'),
)

export const makeCliEnvironmentLayer = (
  fileSystem: FileSystem.FileSystem,
  terminal: Terminal.Terminal,
) =>
  Layer.mergeAll(
    FileSystem.layerNoop(fileSystem),
    Path.layer,
    Stdio.layerTest({}),
    Layer.succeed(Terminal.Terminal)(terminal),
    Layer.succeed(ChildProcessSpawner.ChildProcessSpawner)(childProcessSpawner),
  )
