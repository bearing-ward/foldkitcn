import {
  flattenDiagnosticMessageText,
  parseConfigFileTextToJson,
  parseJsonConfigFileContent,
  sys,
} from 'typescript'
import { describe, expect, test } from 'vitest'

import { readFileSync } from 'node:fs'
import path from 'node:path'

const repoRoot = path.resolve(import.meta.dirname, '..')

const testShardConfigNames = [
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
] as const

const relativePath = (filePath: string): string =>
  path.relative(repoRoot, filePath).split(path.sep).join('/')

const testFilesInConfig = (configName: string): ReadonlyArray<string> => {
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

  return parsedConfig.fileNames
    .filter(filePath => /\.test\.tsx?$/u.test(filePath))
    .map(relativePath)
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

describe('TypeScript test shards', () => {
  test('cover every test file exactly once', () => {
    const coverageCounts = new Map<string, number>()

    for (const configName of testShardConfigNames) {
      for (const filePath of testFilesInConfig(configName)) {
        coverageCounts.set(filePath, (coverageCounts.get(filePath) ?? 0) + 1)
      }
    }

    expect([...coverageCounts.keys()].toSorted()).toStrictEqual(allTestFiles())
    expect(
      [...coverageCounts.entries()].filter(([, count]) => count !== 1),
    ).toStrictEqual([])
  })
})
