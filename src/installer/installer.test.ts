import type { FileSystem, Path } from 'effect'
import { Array as EffectArray, Effect, Order, Schema as S } from 'effect'
import { describe, expect, test } from 'vitest'

import type { InstallerConfig } from '../registry/schema'
import { InstallerConfig as InstallerConfigSchema } from '../registry/schema'
import { installWithConfig, runFoldkitcnCli } from './cli'
import {
  makeCliEnvironmentLayer,
  makeNodeFileSystem,
  makeTerminal,
} from './cli-environment'
import { createInstallerWritePlan } from './core'

import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

type CliHandler = NonNullable<Parameters<typeof runFoldkitcnCli>[1]>

const targetPaths = [
  'src/components/foldkitcn/base-ui/button.ts',
  'src/components/foldkitcn/shadcn/button.ts',
  'src/components/foldkitcn/utils/cn.ts',
]

const makeFixture = (): string =>
  mkdtempSync(path.join(tmpdir(), 'foldkitcn-installer-'))

const cleanupFixture = (fixturePath: string): void => {
  rmSync(fixturePath, { recursive: true, force: true })
}

const installerLayer = (display: (text: string) => void = () => {}) =>
  makeCliEnvironmentLayer(makeNodeFileSystem(), makeTerminal(display))

const runInstallerEffect = <A, E>(
  effect: Effect.Effect<A, E, FileSystem.FileSystem | Path.Path>,
) => Effect.runPromise(effect.pipe(Effect.provide(installerLayer())))

const installerConfig = (
  cwd: string,
  options: Readonly<{
    dryRun?: boolean
    force?: boolean
  }> = {},
): InstallerConfig =>
  S.decodeUnknownSync(InstallerConfigSchema)({
    itemId: 'shadcn/button',
    cwd,
    registryIndexPath: 'registry/index.json',
    dryRun: options.dryRun ?? false,
    conflictPolicy: options.force === true ? 'overwrite' : 'preserve',
  })

const absoluteTarget = (fixturePath: string, targetPath: string): string =>
  path.join(fixturePath, targetPath)

const sorted = (values: ReadonlyArray<string>): ReadonlyArray<string> =>
  EffectArray.sort(values, Order.String)

describe('foldkitcn installer', () => {
  test('parses add command flags through effect unstable cli', async () => {
    const fixturePath = makeFixture()
    let capturedConfig: InstallerConfig | undefined
    const handler: CliHandler = config =>
      Effect.sync(() => {
        capturedConfig = config
      })

    try {
      await Effect.runPromise(
        runFoldkitcnCli(
          ['add', 'shadcn/button', '--cwd', fixturePath, '--dry-run'],
          handler,
        ).pipe(Effect.provide(installerLayer())),
      )

      expect(capturedConfig).toStrictEqual(
        installerConfig(fixturePath, { dryRun: true }),
      )
    } finally {
      cleanupFixture(fixturePath)
    }
  })

  test('rejects unknown CLI flags and accepts help', async () => {
    await expect(
      Effect.runPromise(
        runFoldkitcnCli(['add', 'shadcn/button', '--mystery']).pipe(
          Effect.provide(installerLayer()),
        ),
      ),
    ).rejects.toBeTruthy()

    await Effect.runPromise(
      runFoldkitcnCli(['add', '--help']).pipe(Effect.provide(installerLayer())),
    )
  })

  test('creates a dry-run write plan without touching the fixture', async () => {
    const fixturePath = makeFixture()

    try {
      const plan = await runInstallerEffect(
        createInstallerWritePlan(
          installerConfig(fixturePath, { dryRun: true }),
        ),
      )

      expect(sorted(plan.dependencies)).toStrictEqual([
        'base-ui/button',
        'utils/cn',
      ])
      expect(
        sorted(plan.operations.map(operation => operation.targetPath)),
      ).toStrictEqual(sorted(targetPaths))
      expect(plan.hasConflicts).toBeFalsy()
      expect(
        targetPaths.some(targetPath =>
          existsSync(absoluteTarget(fixturePath, targetPath)),
        ),
      ).toBeFalsy()
    } finally {
      cleanupFixture(fixturePath)
    }
  })

  test('writes fixture files with namespaced imports', async () => {
    const fixturePath = makeFixture()

    try {
      const plan = await runInstallerEffect(
        installWithConfig(installerConfig(fixturePath)),
      )

      expect(
        sorted(plan.operations.map(operation => operation.targetPath)),
      ).toStrictEqual(sorted(targetPaths))
      expect(
        targetPaths.every(targetPath =>
          existsSync(absoluteTarget(fixturePath, targetPath)),
        ),
      ).toBeTruthy()
      expect(
        readFileSync(
          absoluteTarget(
            fixturePath,
            'src/components/foldkitcn/shadcn/button.ts',
          ),
          'utf-8',
        ),
      ).toContain("import { cn } from '../utils/cn'")
      expect(
        readFileSync(
          absoluteTarget(
            fixturePath,
            'src/components/foldkitcn/shadcn/button.ts',
          ),
          'utf-8',
        ),
      ).toContain("import * as BaseButton from '../base-ui/button'")
    } finally {
      cleanupFixture(fixturePath)
    }
  })

  test('refuses changed target files unless force is enabled', async () => {
    const fixturePath = makeFixture()
    const buttonPath = absoluteTarget(
      fixturePath,
      'src/components/foldkitcn/shadcn/button.ts',
    )

    try {
      await runInstallerEffect(installWithConfig(installerConfig(fixturePath)))
      writeFileSync(buttonPath, 'changed locally\n')

      await expect(
        runInstallerEffect(installWithConfig(installerConfig(fixturePath))),
      ).rejects.toMatchObject({ reason: 'WriteConflict' })

      await runInstallerEffect(
        installWithConfig(installerConfig(fixturePath, { force: true })),
      )

      expect(readFileSync(buttonPath, 'utf-8')).not.toBe('changed locally\n')
    } finally {
      cleanupFixture(fixturePath)
    }
  })
})
