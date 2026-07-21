import {
  createProgram,
  flattenDiagnosticMessageText,
  parseConfigFileTextToJson,
  parseJsonConfigFileContent,
  sys,
} from 'typescript'
import { describe, expect, test } from 'vitest'

import { readFileSync } from 'node:fs'
import path from 'node:path'

const repoRoot = path.resolve(import.meta.dirname, '..')
const sourceCoverageTimeout = 60_000

const sourceConfigNames: ReadonlyArray<string> = [
  'tsconfig.live-examples.json',
  'tsconfig.parity-origin.json',
  'tsconfig.parity-foldkit.json',
  'tsconfig.app-shell.json',
  'tsconfig.source-support.json',
  'tsconfig.scripts-registry.json',
  'tsconfig.scripts-docs.json',
  'tsconfig.scripts-parity-capture.json',
  'tsconfig.scripts-parity-workbench.json',
  'tsconfig.scripts-parity-contracts.json',
]

const testShardConfigNames: ReadonlyArray<string> = [
  'tsconfig.story-test.json',
  'tsconfig.test-root.json',
  'tsconfig.test-data.json',
  'tsconfig.test-scene.json',
  'tsconfig.test-base-ui-a-m.json',
  'tsconfig.test-base-ui-n-z.json',
  'tsconfig.test-shadcn-a-b.json',
  'tsconfig.test-shadcn-c.json',
  'tsconfig.test-shadcn-d-i.json',
  'tsconfig.test-shadcn-j-r.json',
  'tsconfig.test-shadcn-s-z.json',
  'tsconfig.test-scripts.json',
  'tsconfig.test-parity.json',
  'tsconfig.test-e2e.json',
]

const relativePath = (filePath: string): string =>
  path.relative(repoRoot, filePath).split(path.sep).join('/')

const parsedConfigFor = (configName: string) => {
  const configPath = path.join(repoRoot, configName)
  const { config, error } = parseConfigFileTextToJson(
    configPath,
    readFileSync(configPath, 'utf-8'),
  )

  if (error !== undefined) {
    throw new Error(flattenDiagnosticMessageText(error.messageText, '\n'))
  }

  const parsedConfig = parseJsonConfigFileContent(config, sys, repoRoot)

  if (parsedConfig.errors.length > 0) {
    throw new Error(
      parsedConfig.errors
        .map(diagnostic =>
          flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
        )
        .join('\n'),
    )
  }

  return parsedConfig
}

const testFilesInConfig = (configName: string): ReadonlyArray<string> =>
  parsedConfigFor(configName)
    .fileNames.filter(filePath => /\.test\.tsx?$/u.test(filePath))
    .map(relativePath)

const sourceFilesInConfig = (configName: string): ReadonlyArray<string> => {
  const parsedConfig = parsedConfigFor(configName)

  return createProgram({
    rootNames: parsedConfig.fileNames,
    options: parsedConfig.options,
  })
    .getSourceFiles()
    .map(sourceFile => relativePath(sourceFile.fileName))
    .filter(
      filePath =>
        filePath.startsWith('scripts/') || filePath.startsWith('src/'),
    )
}

const allTestFiles = (): ReadonlyArray<string> =>
  ['scripts', 'src', 'tests']
    .flatMap(sourceRoot =>
      sys.readDirectory(
        path.join(repoRoot, sourceRoot),
        ['.ts', '.tsx'],
        undefined,
        ['**/*.test.ts', '**/*.test.tsx'],
      ),
    )
    .map(relativePath)
    .toSorted()

const allSourceAndScriptFiles = (): ReadonlyArray<string> =>
  ['scripts', 'src']
    .flatMap(sourceRoot =>
      sys.readDirectory(
        path.join(repoRoot, sourceRoot),
        ['.ts', '.tsx'],
        undefined,
        ['**/*.ts', '**/*.tsx'],
      ),
    )
    .map(relativePath)
    .toSorted()

const coverageCountsFor = (
  filePaths: ReadonlyArray<string>,
): ReadonlyMap<string, number> =>
  filePaths.reduce((coverageCounts, filePath) => {
    coverageCounts.set(filePath, (coverageCounts.get(filePath) ?? 0) + 1)
    return coverageCounts
  }, new Map<string, number>())

describe('TypeScript test shards', () => {
  test('cover every test file exactly once', () => {
    const coverageCounts = coverageCountsFor(
      testShardConfigNames.flatMap(testFilesInConfig),
    )

    expect([...coverageCounts.keys()].toSorted()).toStrictEqual(allTestFiles())
    expect(
      [...coverageCounts.entries()].filter(([, count]) => count !== 1),
    ).toStrictEqual([])
  })

  test(
    'cover every source and script TypeScript file',
    () => {
      const coveredFiles = new Set(
        [...sourceConfigNames, ...testShardConfigNames].flatMap(
          sourceFilesInConfig,
        ),
      )

      expect([...coveredFiles].toSorted()).toStrictEqual(
        allSourceAndScriptFiles(),
      )
    },
    sourceCoverageTimeout,
  )
})
