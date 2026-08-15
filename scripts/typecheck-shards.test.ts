import { describe, expect, test } from 'vitest'

import { readdirSync, readFileSync } from 'node:fs'
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

const filesMatching = (pattern: string): ReadonlyArray<string> => {
  const suffix = pattern.replace('**/', '').replace('*', '')
  const root = pattern.startsWith('src/')
    ? 'src'
    : pattern.startsWith('scripts/')
      ? 'scripts'
      : '.'
  return readdirSync(path.join(repoRoot, root), {
    recursive: true,
    withFileTypes: true,
  })
    .filter(entry => entry.isFile() && entry.name.endsWith(suffix))
    .map(entry => path.join(entry.parentPath, entry.name))
}

const parsedConfigFor = (configName: string) => {
  const configPath = path.join(repoRoot, configName)
  const config = JSON.parse(readFileSync(configPath, 'utf-8')) as {
    include?: ReadonlyArray<string>
  }
  return { fileNames: (config.include ?? []).flatMap(filesMatching) }
}

const testFilesInConfig = (configName: string): ReadonlyArray<string> =>
  parsedConfigFor(configName)
    .fileNames.filter(filePath => /\.test\.tsx?$/u.test(filePath))
    .map(relativePath)

const sourceFilesInConfig = (configName: string): ReadonlyArray<string> => {
  const parsedConfig = parsedConfigFor(configName)

  return parsedConfig.fileNames
    .map(relativePath)
    .filter(
      filePath =>
        filePath.startsWith('scripts/') || filePath.startsWith('src/'),
    )
}

const allTestFiles = (): ReadonlyArray<string> =>
  ['scripts', 'src', 'tests']
    .flatMap(sourceRoot => filesMatching(`${sourceRoot}/**/*.test.ts`))
    .map(relativePath)
    .toSorted()

const allSourceAndScriptFiles = (): ReadonlyArray<string> =>
  ['scripts', 'src']
    .flatMap(sourceRoot => filesMatching(`${sourceRoot}/**/*.ts`))
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
