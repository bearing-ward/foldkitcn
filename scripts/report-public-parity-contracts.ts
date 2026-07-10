import { Clock, Console, Effect, Schema as S } from 'effect'
import { Command, Flag } from 'effect/unstable/cli'

import { paritySlots } from '../tests/parity/slots'
import {
  createPublicParityContracts,
  PublicParityContracts,
  publicParitySummary,
  validatePublicParityContracts,
} from './public-parity-contracts'
import {
  loadGeneratedDocsArtifacts,
  loadHasLiveExampleViewFor,
} from './report-docs-live-preview-gaps'

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const artifactDirectory = path.resolve(
  import.meta.dirname,
  '../plans/artifacts/128-public-component-parity',
)
const matrixPath = path.join(artifactDirectory, 'public-component-matrix.json')
const summaryPath = path.join(artifactDirectory, 'README.md')

const generatedMatrix = async (nowMillis: number) =>
  validatePublicParityContracts(
    createPublicParityContracts(
      await loadGeneratedDocsArtifacts(),
      paritySlots,
      await loadHasLiveExampleViewFor(),
    ),
    nowMillis,
  )

const markdownFor = (summary: ReturnType<typeof publicParitySummary>): string =>
  [
    '# Public component parity contracts',
    '',
    'Generated from the checked-in docs index, docs artifacts, parity slots, and',
    'live-example renderer registry. Do not edit the matrix by hand.',
    '',
    `- Public routes: ${summary.routeCount}`,
    `- Route and example contracts: ${summary.contractCount}`,
    `- Public examples: ${summary.exampleCount}`,
    `- Source-backed examples: ${summary.sourceBackedCount}`,
    `- Docs/example-only examples: ${summary.docsExampleOnlyCount}`,
    `- Examples on routes without a parity slot: ${summary.missingSlotCount}`,
    `- Active exceptions: ${summary.exceptionCount}`,
    '',
    'Every example declares a profile, desktop and 390px viewports, required',
    'interaction recipes, origin evidence mode, live-renderer status, and parity',
    'slot status. `bun run parity:contracts` fails when this artifact is stale.',
    '',
  ].join('\n')

const serialized = (value: unknown): string =>
  `${JSON.stringify(value, null, 2)}\n`

const runContractReport = (shouldWrite: boolean) =>
  Effect.gen(function* runPublicParityContractReport() {
    const nowMillis = yield* Clock.currentTimeMillis
    const matrix = yield* Effect.promise(() => generatedMatrix(nowMillis))
    const summary = publicParitySummary(matrix)
    const matrixJson = serialized(S.encodeSync(PublicParityContracts)(matrix))
    const summaryMarkdown = markdownFor(summary)

    if (shouldWrite) {
      yield* Effect.promise(() =>
        mkdir(artifactDirectory, { recursive: true }).then(() =>
          Promise.all([
            writeFile(matrixPath, matrixJson),
            writeFile(summaryPath, summaryMarkdown),
          ]),
        ),
      )
    } else {
      const [checkedInMatrix, checkedInSummary] = yield* Effect.promise(() =>
        Promise.all([
          readFile(matrixPath, 'utf-8'),
          readFile(summaryPath, 'utf-8'),
        ]),
      )

      if (
        checkedInMatrix !== matrixJson ||
        checkedInSummary !== summaryMarkdown
      ) {
        throw new Error(
          'Public parity contract artifacts are stale. Run bun run parity:contracts:write.',
        )
      }
    }

    yield* Console.log(
      `Validated ${summary.routeCount} public route(s) and ${summary.exampleCount} example contract(s).`,
    )
  })

const command = Command.make(
  'public-parity-contracts',
  {
    write: Flag.boolean('write').pipe(
      Flag.withDescription('Write the generated contract artifacts.'),
    ),
  },
  input => runContractReport(input.write),
)

export const runPublicParityContractsCli = (args: ReadonlyArray<string>) =>
  Command.runWith(command, { version: '0.1.0' })(args)

if (import.meta.main) {
  await Effect.runPromise(runPublicParityContractsCli(process.argv.slice(2)))
}
