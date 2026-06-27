import { Console, Effect } from 'effect'
import type { FileSystem, Path } from 'effect'
import { Argument, Command, Flag } from 'effect/unstable/cli'

import type {
  InstallerConfig,
  InstallerError,
  InstallerWritePlan,
} from '../registry/schema'
import {
  decodeInstallerConfig,
  formatInstallerWritePlan,
  runInstallerAdd,
} from './core'

const VERSION = '0.1.0'
const DEFAULT_REGISTRY_INDEX_PATH = 'registry/index.json'

type AddHandler = (
  config: InstallerConfig,
) => Effect.Effect<void, InstallerError, FileSystem.FileSystem | Path.Path>

export type InstallerCliRun = Effect.Effect<
  void,
  InstallerError,
  FileSystem.FileSystem | Path.Path
>

const defaultAddHandler: AddHandler = config =>
  Effect.flatMap(runInstallerAdd(config), plan =>
    Console.log(formatInstallerWritePlan(plan, config.dryRun)),
  )

export const configFromAddInput = (input: {
  readonly itemId: string
  readonly cwd: string
  readonly dryRun: boolean
  readonly force: boolean
}) =>
  decodeInstallerConfig({
    itemId: input.itemId,
    cwd: input.cwd,
    registryIndexPath: DEFAULT_REGISTRY_INDEX_PATH,
    dryRun: input.dryRun,
    conflictPolicy: input.force ? 'overwrite' : 'preserve',
  })

export const makeAddCommand = (handleAdd: AddHandler = defaultAddHandler) =>
  Command.make(
    'add',
    {
      itemId: Argument.string('item-id').pipe(
        Argument.withDescription(
          'Registry item id, for example shadcn/button.',
        ),
      ),
      cwd: Flag.string('cwd').pipe(
        Flag.withDefault('.'),
        Flag.withDescription('Project directory to install into.'),
      ),
      dryRun: Flag.boolean('dry-run').pipe(
        Flag.withDescription('Print the write plan without changing files.'),
      ),
      force: Flag.boolean('force').pipe(
        Flag.withDescription('Overwrite changed files in the target project.'),
      ),
    },
    input => Effect.flatMap(configFromAddInput(input), handleAdd),
  ).pipe(
    Command.withDescription(
      'Install a Foldkit CN registry item into a project.',
    ),
  )

export const makeFoldkitcnCommand = (
  handleAdd: AddHandler = defaultAddHandler,
) =>
  Command.make('foldkitcn').pipe(
    Command.withDescription('Foldkit CN registry installer.'),
    Command.withSubcommands([makeAddCommand(handleAdd)]),
  )

export const runFoldkitcnCli = (
  args: ReadonlyArray<string>,
  handleAdd?: AddHandler,
) =>
  Command.runWith(makeFoldkitcnCommand(handleAdd), { version: VERSION })(args)

export const installWithConfig = (
  config: InstallerConfig,
): Effect.Effect<
  InstallerWritePlan,
  InstallerError,
  FileSystem.FileSystem | Path.Path
> => runInstallerAdd(config)
