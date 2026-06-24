import { captureShadcnOriginSnapshots } from '../tests/parity/fixtures/origin/shadcn/runner'

const args = process.argv.slice(2)
const grepIndex = args.indexOf('--grep')
const maybeGrep = grepIndex === -1 ? undefined : args.at(grepIndex + 1)

const main = async () => {
  try {
    const snapshots = await captureShadcnOriginSnapshots({ grep: maybeGrep })

    console.log(`Captured ${snapshots.length} shadcn origin snapshot(s).`)
    console.log(
      snapshots.map(snapshot => JSON.stringify(snapshot, null, 2)).join('\n'),
    )
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  }
}

await main()
