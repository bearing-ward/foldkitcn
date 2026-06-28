import { Effect } from 'effect'

import { runFoldkitcnCli } from './cli'
import {
  makeCliEnvironmentLayer,
  makeNodeFileSystem,
  makeTerminal,
} from './cli-environment'

const terminal = makeTerminal(text => process.stdout.write(text))
const layer = makeCliEnvironmentLayer(makeNodeFileSystem(), terminal)

try {
  await Effect.runPromise(
    runFoldkitcnCli(process.argv.slice(2)).pipe(Effect.provide(layer)),
  )
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error)

  process.stderr.write(`${message}\n`)
  process.exitCode = 1
}
