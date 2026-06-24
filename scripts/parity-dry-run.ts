import { paritySlots } from '../tests/parity/slots'

const args = process.argv.slice(2)
const grepIndex = args.indexOf('--grep')
const maybeGrep = grepIndex === -1 ? undefined : args.at(grepIndex + 1)
const dryRun = args.includes('--dry-run')
const normalizedGrep = maybeGrep?.toLowerCase()
const matchingSlots =
  normalizedGrep === undefined
    ? paritySlots
    : paritySlots.filter(slot =>
        slot.itemId.toLowerCase().includes(normalizedGrep),
      )

if (!dryRun) {
  throw new Error('parity:check currently supports dry-run discovery only.')
}

if (matchingSlots.length === 0) {
  throw new Error(`No parity slots matched: ${maybeGrep ?? '<none>'}`)
}

console.log(`Discovered ${matchingSlots.length} parity slot(s):`)
console.log(
  matchingSlots
    .map(slot =>
      [
        `- ${slot.itemId}`,
        `status=${slot.status}`,
        `origin=${slot.originFixtureEntrypoint}`,
        `foldkit=${slot.foldkitFixtureEntrypoint}`,
        `comparisons=${slot.comparisons.join(',')}`,
      ].join(' '),
    )
    .join('\n'),
)
