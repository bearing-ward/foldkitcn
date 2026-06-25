import {
  checkOriginComponentProgressChecklistCurrent,
  deriveOriginComponentProgress,
  formatNextOriginComponentRows,
  formatOriginComponentStatus,
  selectNextOriginComponentRows,
  writeOriginComponentProgressChecklist,
} from './registry-component-progress-common'

const usage = [
  'Usage:',
  '  bun run scripts/registry-component-progress.ts status',
  '  bun run scripts/registry-component-progress.ts next [count]',
  '  bun run scripts/registry-component-progress.ts write',
  '  bun run scripts/registry-component-progress.ts check',
].join('\n')

const parseCount = (value: string | undefined): number => {
  if (value === undefined) {
    return 1
  }

  const count = Number(value)

  if (!Number.isInteger(count) || count < 1) {
    throw new Error(
      `Expected count to be a positive integer, received: ${value}`,
    )
  }

  return count
}

const formatBlockedPreview = (
  report: ReturnType<typeof deriveOriginComponentProgress>,
): string => {
  const blockedRows = report.rows
    .filter(row => row.readiness === 'blocked')
    .slice(0, 5)

  if (blockedRows.length === 0) {
    return ''
  }

  return [
    '',
    'First blocked rows:',
    ...blockedRows.map(row => {
      const blockers =
        row.blockers.length === 0
          ? 'No blocker summary recorded.'
          : row.blockers.join(' ')

      return `- ${row.itemId}: ${blockers}`
    }),
  ].join('\n')
}

const run = (args: ReadonlyArray<string>): void => {
  const [command, countArgument] = args

  if (command === 'status') {
    const report = deriveOriginComponentProgress()
    console.log(formatOriginComponentStatus(report))
    return
  }

  if (command === 'next') {
    const report = deriveOriginComponentProgress()
    const rows = selectNextOriginComponentRows(
      report,
      parseCount(countArgument),
    )

    console.log(
      rows.length === 0
        ? `${formatNextOriginComponentRows(rows)}${formatBlockedPreview(report)}`
        : formatNextOriginComponentRows(rows),
    )
    return
  }

  if (command === 'write') {
    writeOriginComponentProgressChecklist()
    console.log('Wrote docs/component-conversion-checklist.json')
    console.log('Wrote docs/component-conversion-checklist.md')
    return
  }

  if (command === 'check') {
    checkOriginComponentProgressChecklistCurrent()
    console.log('Verified docs/component-conversion-checklist.md is current.')
    return
  }

  throw new Error(usage)
}

try {
  run(process.argv.slice(2))
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}
