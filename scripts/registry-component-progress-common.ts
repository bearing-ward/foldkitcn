import { Schema as S } from 'effect'

import {
  OriginComponentProgressReport,
  OriginComponentProgressRow as OriginComponentProgressRowSchema,
} from '../src/registry/schema'
import type {
  Availability,
  DriftStatus,
  ImplementationStatus,
  OriginComponentProgressNamespace,
  OriginComponentProgressParitySlotStatus,
  OriginComponentProgressReadiness,
  OriginComponentProgressReport as OriginComponentProgressReportType,
  OriginComponentProgressRow,
  OriginResolutionStatus,
  ParityStatus,
} from '../src/registry/schema'
import { paritySlots } from '../tests/parity/slots'
import { ensurePinnedRepo, resolveOriginUrl } from './origin-common'
import { checkRegistry, hashJson, writeJson } from './registry-common'

import { execFileSync } from 'node:child_process'
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import pathModule from 'node:path'

export const componentChecklistJsonPath =
  'docs/component-conversion-checklist.json'
export const componentChecklistMarkdownPath =
  'docs/component-conversion-checklist.md'

interface DeriveOriginComponentProgressOptions {
  readonly generatedAt?: string
}

interface DossierCoverage {
  readonly itemId: string
  readonly dossierPath: string
}

interface HistoricalQueueRow {
  readonly order: number
  readonly itemIds: ReadonlyArray<string>
  readonly urls: ReadonlyArray<string>
  readonly sourcePath: string
}

interface RegistryLifecycleEntry {
  readonly implementationStatus: ImplementationStatus
  readonly parityStatus: ParityStatus
  readonly driftStatus: DriftStatus
  readonly availability: Availability
}

const baseUiDocsRoot = 'repos/base-ui/docs/src/app/(docs)/react/components'
const shadcnDocsRoot = 'repos/ui/apps/v4/content/docs/components/base'
const shadcnSourceRoot = 'repos/ui/apps/v4/styles/base-nova/ui'
const dossierRoot = 'plans/artifacts'
const historicalQueuePaths = [
  'plans/artifacts/004-foundational-component-backlog/component-backlog.md',
  'plans/artifacts/007-remaining-component-queue/component-queue.md',
]

const uniqueSorted = <Value>(
  values: ReadonlyArray<Value>,
): ReadonlyArray<Value> =>
  [...new Set(values)].toSorted((left, right) =>
    String(left).localeCompare(String(right)),
  )

const normalizePath = (path: string): string => path.replaceAll('\\', '/')

const readDirectoryEntries = (root: string) => {
  if (!existsSync(root) || !statSync(root).isDirectory()) {
    throw new Error(`Origin evidence path is missing: ${root}`)
  }

  return readdirSync(root, { withFileTypes: true })
}

const componentDocsUrl = (
  namespace: OriginComponentProgressNamespace,
  slug: string,
): string =>
  namespace === 'base-ui'
    ? `https://base-ui.com/react/components/${slug}`
    : `https://ui.shadcn.com/docs/components/${slug}`

const itemIdFromUrl = (url: string): string | undefined => {
  const parsedUrl = new URL(url)
  const slug = parsedUrl.pathname.split('/').at(-1)

  if (slug === undefined || slug.length === 0) {
    return undefined
  }

  if (url.startsWith('https://base-ui.com/react/components/')) {
    return `base-ui/${slug}`
  }

  if (url.startsWith('https://ui.shadcn.com/docs/components/')) {
    return `shadcn/${slug}`
  }

  return undefined
}

const enumerateBaseUiSlugs = (): ReadonlyArray<string> =>
  readDirectoryEntries(baseUiDocsRoot)
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .toSorted((left, right) => left.localeCompare(right))

const enumerateShadcnDocsSlugs = (): ReadonlyArray<string> =>
  readDirectoryEntries(shadcnDocsRoot)
    .filter(entry => entry.isFile() && entry.name.endsWith('.mdx'))
    .map(entry => entry.name.slice(0, -'.mdx'.length))
    .toSorted((left, right) => left.localeCompare(right))

const enumerateShadcnSourceSlugs = (): ReadonlyArray<string> =>
  readDirectoryEntries(shadcnSourceRoot)
    .filter(entry => entry.isFile() && entry.name.endsWith('.tsx'))
    .map(entry => entry.name.slice(0, -'.tsx'.length))
    .toSorted((left, right) => left.localeCompare(right))

const walkFiles = (
  root: string,
  predicate: (path: string) => boolean,
): ReadonlyArray<string> => {
  if (!existsSync(root)) {
    return []
  }

  return readDirectoryEntries(root).flatMap(entry => {
    const entryPath = normalizePath(pathModule.join(root, entry.name))

    if (entry.isDirectory()) {
      return walkFiles(entryPath, predicate)
    }

    return entry.isFile() && predicate(entryPath) ? [entryPath] : []
  })
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const readJson = (path: string): unknown =>
  JSON.parse(readFileSync(path, 'utf-8'))

const itemIdsFromDossier = (value: unknown): ReadonlyArray<string> => {
  if (!isRecord(value)) {
    return []
  }

  const batchItemIds = Array.isArray(value.batch)
    ? value.batch.filter(itemId => typeof itemId === 'string')
    : []
  const rowItemIds = Array.isArray(value.rows)
    ? value.rows.flatMap(row =>
        isRecord(row) && typeof row.itemId === 'string' ? [row.itemId] : [],
      )
    : []

  return uniqueSorted([...batchItemIds, ...rowItemIds])
}

const loadDossierCoverage = (): ReadonlyMap<string, ReadonlyArray<string>> => {
  const entries = walkFiles(dossierRoot, path => path.endsWith('/dossier.json'))
    .flatMap(dossierPath =>
      itemIdsFromDossier(readJson(dossierPath)).map(
        (itemId): DossierCoverage => ({
          itemId,
          dossierPath,
        }),
      ),
    )
    .reduce(
      (coverageByItemId, entry) =>
        coverageByItemId.set(entry.itemId, [
          ...(coverageByItemId.get(entry.itemId) ?? []),
          entry.dossierPath,
        ]),
      new Map<string, ReadonlyArray<string>>(),
    )

  return new Map(
    [...entries].map(([itemId, dossierPaths]) => [
      itemId,
      uniqueSorted(dossierPaths),
    ]),
  )
}

const parseHistoricalQueueRows = (): ReadonlyArray<HistoricalQueueRow> =>
  historicalQueuePaths.flatMap(sourcePath => {
    if (!existsSync(sourcePath)) {
      return []
    }

    return readFileSync(sourcePath, 'utf-8')
      .split('\n')
      .flatMap((line, index) => {
        const itemIds = uniqueSorted(
          [...line.matchAll(/`(?<itemId>(?:base-ui|shadcn)\/[^`]+)`/gu)]
            .flatMap(match =>
              match.groups?.itemId === undefined ? [] : [match.groups.itemId],
            )
            .filter(itemId => !itemId.includes('https://')),
        )
        const urls = uniqueSorted(
          [
            ...line.matchAll(
              /https:\/\/(?:base-ui\.com\/react\/components|ui\.shadcn\.com\/docs\/components)\/[^`,\s|]+/gu,
            ),
          ]
            .map(match => match[0])
            .filter(url => itemIdFromUrl(url) !== undefined),
        )

        return itemIds.length > 0 && urls.length > 0
          ? [
              {
                order: index + 1,
                itemIds,
                urls,
                sourcePath,
              },
            ]
          : []
      })
  })

const loadHistoricalQueueRows = () => {
  const queueRows = parseHistoricalQueueRows()

  return queueRows.reduce(
    (queueState, row) => {
      row.itemIds.reduce((currentState, itemId) => {
        if (!currentState.rowByItemId.has(itemId)) {
          currentState.rowByItemId.set(itemId, row)
          currentState.priorityHintByItemId.set(
            itemId,
            `${row.sourcePath} row ${row.order}`,
          )
        }

        return currentState
      }, queueState)

      return queueState
    },
    {
      priorityHintByItemId: new Map<string, string>(),
      rowByItemId: new Map<string, HistoricalQueueRow>(),
    },
  )
}

const loadRegistryLifecycle = () => {
  const result = checkRegistry()
  const lifecycleByItemId = new Map<string, RegistryLifecycleEntry>(
    result.manifests.map(manifest => [manifest.id, manifest.lifecycle]),
  )
  const importedItemIds = new Set(
    result.manifests
      .filter(
        manifest =>
          manifest.namespace === 'base-ui' || manifest.namespace === 'shadcn',
      )
      .map(manifest => manifest.id),
  )

  return {
    importedItemIds,
    lifecycleByItemId,
  }
}

const paritySlotStatusByItemId = (): ReadonlyMap<
  string,
  OriginComponentProgressParitySlotStatus
> => new Map(paritySlots.map(slot => [slot.itemId, slot.status]))

const parityStatusFromSlot = (
  paritySlotStatus: OriginComponentProgressParitySlotStatus,
): ParityStatus => {
  if (paritySlotStatus === 'ready') {
    return 'accepted'
  }

  return paritySlotStatus === 'planned' ? 'partial' : 'not-started'
}

const readinessFor = ({
  hasRegistryItem,
  hasDossier,
  originResolutionStatus,
  blockers,
  hasOriginDocs,
  hasOriginSource,
}: {
  readonly hasRegistryItem: boolean
  readonly hasDossier: boolean
  readonly originResolutionStatus: OriginResolutionStatus
  readonly blockers: ReadonlyArray<string>
  readonly hasOriginDocs: boolean
  readonly hasOriginSource: boolean
}): OriginComponentProgressReadiness => {
  if (hasRegistryItem) {
    return 'imported'
  }

  if (
    originResolutionStatus !== 'source-backed' ||
    blockers.length > 0 ||
    !hasOriginDocs ||
    !hasOriginSource
  ) {
    return 'blocked'
  }

  return hasDossier ? 'dossier-ready' : 'ready-for-dossier'
}

const lifecycleForRow = ({
  itemId,
  lifecycleByItemId,
  hasDossier,
  paritySlotStatus,
}: {
  readonly itemId: string
  readonly lifecycleByItemId: ReadonlyMap<string, RegistryLifecycleEntry>
  readonly hasDossier: boolean
  readonly paritySlotStatus: OriginComponentProgressParitySlotStatus
}) => {
  const maybeLifecycle = lifecycleByItemId.get(itemId)

  if (maybeLifecycle !== undefined) {
    return maybeLifecycle
  }

  return {
    implementationStatus: hasDossier ? 'dossier-ready' : 'planned',
    parityStatus: parityStatusFromSlot(paritySlotStatus),
    driftStatus: 'current',
    availability: 'private',
  } satisfies RegistryLifecycleEntry
}

const baseRowForSlug = ({
  namespace,
  slug,
  importedItemIds,
  lifecycleByItemId,
  dossierCoverageByItemId,
  priorityHintByItemId,
  slotStatusByItemId,
}: {
  readonly namespace: OriginComponentProgressNamespace
  readonly slug: string
  readonly importedItemIds: ReadonlySet<string>
  readonly lifecycleByItemId: ReadonlyMap<string, RegistryLifecycleEntry>
  readonly dossierCoverageByItemId: ReadonlyMap<string, ReadonlyArray<string>>
  readonly priorityHintByItemId: ReadonlyMap<string, string>
  readonly slotStatusByItemId: ReadonlyMap<
    string,
    OriginComponentProgressParitySlotStatus
  >
}): OriginComponentProgressRow => {
  const itemId = `${namespace}/${slug}`
  const docsUrl = componentDocsUrl(namespace, slug)
  const resolution = resolveOriginUrl(docsUrl)
  const hasRegistryItem = importedItemIds.has(itemId)
  const dossierPaths = dossierCoverageByItemId.get(itemId) ?? []
  const hasDossier = dossierPaths.length > 0
  const paritySlotStatus = slotStatusByItemId.get(itemId) ?? 'not-started'
  const lifecycle = lifecycleForRow({
    itemId,
    lifecycleByItemId,
    hasDossier,
    paritySlotStatus,
  })
  const readiness = readinessFor({
    hasRegistryItem,
    hasDossier,
    originResolutionStatus: resolution.resolutionStatus,
    blockers: resolution.blockers,
    hasOriginDocs: resolution.docsPaths.length > 0,
    hasOriginSource: resolution.sourcePaths.length > 0,
  })
  const maybePriorityHint = priorityHintByItemId.get(itemId)

  return S.decodeUnknownSync(OriginComponentProgressRowSchema)({
    itemId,
    namespace,
    docsUrl,
    originResolutionStatus: resolution.resolutionStatus,
    hasOriginDocs: resolution.docsPaths.length > 0,
    hasOriginSource: resolution.sourcePaths.length > 0,
    hasRegistryItem,
    hasDossier,
    dossierPaths,
    paritySlotStatus,
    ...lifecycle,
    blockers: resolution.blockers,
    unresolvedQuestions: resolution.unresolvedQuestions,
    recommendedUrls: [docsUrl],
    ...(maybePriorityHint === undefined
      ? {}
      : { priorityHint: maybePriorityHint }),
    readiness,
  })
}

const priorityRankForRow = (
  row: OriginComponentProgressRow,
  priorityHintByItemId: ReadonlyMap<string, string>,
): number => {
  const maybeHint = priorityHintByItemId.get(row.itemId)
  const maybeRank = maybeHint?.match(/row (?<rank>\d+)$/u)?.groups?.rank

  return maybeRank === undefined ? Number.MAX_SAFE_INTEGER : Number(maybeRank)
}

const withHistoricalRecommendations = ({
  rows,
  historicalRowByItemId,
}: {
  readonly rows: ReadonlyArray<OriginComponentProgressRow>
  readonly historicalRowByItemId: ReadonlyMap<string, HistoricalQueueRow>
}): ReadonlyArray<OriginComponentProgressRow> => {
  const rowByItemId = new Map(rows.map(row => [row.itemId, row]))

  return rows.map(row => {
    const maybeQueueRow = historicalRowByItemId.get(row.itemId)

    if (maybeQueueRow === undefined) {
      return row
    }

    const urls = uniqueSorted(
      maybeQueueRow.urls.slice(0, 2).filter(url => {
        const maybeItemId = itemIdFromUrl(url)
        const maybeRow =
          maybeItemId === undefined ? undefined : rowByItemId.get(maybeItemId)

        return maybeRow !== undefined && maybeRow.readiness !== 'imported'
      }),
    )

    return urls.length === 0 ? row : { ...row, recommendedUrls: urls }
  })
}

const sortRows = ({
  rows,
  priorityHintByItemId,
}: {
  readonly rows: ReadonlyArray<OriginComponentProgressRow>
  readonly priorityHintByItemId: ReadonlyMap<string, string>
}): ReadonlyArray<OriginComponentProgressRow> =>
  rows.toSorted((left, right) => {
    const rankDiff =
      priorityRankForRow(left, priorityHintByItemId) -
      priorityRankForRow(right, priorityHintByItemId)

    if (rankDiff !== 0) {
      return rankDiff
    }

    const namespaceDiff = left.namespace.localeCompare(right.namespace)

    return namespaceDiff === 0
      ? left.itemId.localeCompare(right.itemId)
      : namespaceDiff
  })

const reportWithoutGeneratedAt = (
  report: OriginComponentProgressReportType,
) => ({
  schemaVersion: report.schemaVersion,
  summary: report.summary,
  rows: report.rows,
})

const addSelectedUrl = (currentUrls: Set<string>, url: string): Set<string> =>
  currentUrls.add(url)

const readProgressReport = (
  outputPath: string,
): OriginComponentProgressReportType | undefined => {
  if (!existsSync(outputPath)) {
    return undefined
  }

  try {
    return S.decodeUnknownSync(OriginComponentProgressReport)(
      readJson(outputPath),
    )
  } catch {
    return undefined
  }
}

const selectGeneratedAt = (
  nextReport: OriginComponentProgressReportType,
  maybePreviousReport: OriginComponentProgressReportType | undefined,
): string =>
  maybePreviousReport !== undefined &&
  hashJson(reportWithoutGeneratedAt(maybePreviousReport)) ===
    hashJson(reportWithoutGeneratedAt(nextReport))
    ? maybePreviousReport.generatedAt
    : nextReport.generatedAt

export const deriveOriginComponentProgress = (
  options: DeriveOriginComponentProgressOptions = {},
): OriginComponentProgressReportType => {
  const baseUiSlugs = enumerateBaseUiSlugs()
  const shadcnDocsSlugs = enumerateShadcnDocsSlugs()
  const shadcnSourceSlugs = enumerateShadcnSourceSlugs()
  const { importedItemIds, lifecycleByItemId } = loadRegistryLifecycle()
  const dossierCoverageByItemId = loadDossierCoverage()
  const { priorityHintByItemId, rowByItemId } = loadHistoricalQueueRows()
  const slotStatusByItemId = paritySlotStatusByItemId()
  const rowContext = {
    importedItemIds,
    lifecycleByItemId,
    dossierCoverageByItemId,
    priorityHintByItemId,
    slotStatusByItemId,
  }
  const rows = sortRows({
    rows: withHistoricalRecommendations({
      rows: [
        ...baseUiSlugs.map(slug =>
          baseRowForSlug({ namespace: 'base-ui', slug, ...rowContext }),
        ),
        ...shadcnDocsSlugs.map(slug =>
          baseRowForSlug({ namespace: 'shadcn', slug, ...rowContext }),
        ),
      ],
      historicalRowByItemId: rowByItemId,
    }),
    priorityHintByItemId,
  })
  const importedBaseUiCount = rows.filter(
    row => row.namespace === 'base-ui' && row.hasRegistryItem,
  ).length
  const importedShadcnCount = rows.filter(
    row => row.namespace === 'shadcn' && row.hasRegistryItem,
  ).length
  const generatedAt = options.generatedAt ?? new Date().toISOString()
  const report = {
    schemaVersion: 1,
    generatedAt,
    summary: {
      baseUi: {
        total: baseUiSlugs.length,
        imported: importedBaseUiCount,
        remaining: baseUiSlugs.length - importedBaseUiCount,
      },
      shadcn: {
        total: shadcnDocsSlugs.length,
        imported: importedShadcnCount,
        remaining: shadcnDocsSlugs.length - importedShadcnCount,
      },
      shadcnSourceFileCount: shadcnSourceSlugs.length,
      shadcnDocsExampleOnlyCount: rows.filter(
        row =>
          row.namespace === 'shadcn' &&
          row.originResolutionStatus === 'docs-example-only',
      ).length,
      blockedCount: rows.filter(row => row.readiness === 'blocked').length,
      readyForDossierCount: rows.filter(
        row => row.readiness === 'ready-for-dossier',
      ).length,
      dossierReadyCount: rows.filter(row => row.readiness === 'dossier-ready')
        .length,
      sourceRefs: {
        baseUiPinnedRef: ensurePinnedRepo('repos/base-ui'),
        shadcnPinnedRef: ensurePinnedRepo('repos/ui'),
      },
    },
    rows,
  }

  return S.decodeUnknownSync(OriginComponentProgressReport)(report)
}

export const selectNextOriginComponentRows = (
  report: OriginComponentProgressReportType,
  count: number,
): ReadonlyArray<OriginComponentProgressRow> => {
  const selectedUrls = new Set<string>()
  const initialSelectedRows: Array<OriginComponentProgressRow> = []

  return report.rows
    .filter(
      row =>
        row.readiness === 'ready-for-dossier' ||
        row.readiness === 'dossier-ready',
    )
    .reduce((selectedRows, row) => {
      if (selectedRows.length >= count) {
        return selectedRows
      }

      if (row.recommendedUrls.some(url => selectedUrls.has(url))) {
        return selectedRows
      }

      row.recommendedUrls.reduce(addSelectedUrl, selectedUrls)
      selectedRows.push(row)

      return selectedRows
    }, initialSelectedRows)
}

const markdownList = (values: ReadonlyArray<string>): string =>
  values.length === 0
    ? '- None\n'
    : `${values.map(value => `- \`${value}\``).join('\n')}\n`

const rowsTable = (rows: ReadonlyArray<OriginComponentProgressRow>): string => {
  if (rows.length === 0) {
    return 'None.\n'
  }

  return `${[
    '| Item | Readiness | Parity | URLs | Blockers |',
    '| --- | --- | --- | --- | --- |',
    ...rows.map(row => {
      const blockers =
        row.blockers.length === 0
          ? ''
          : row.blockers
              .map(blocker => blocker.replaceAll('|', '\\|'))
              .join('<br>')

      return `| \`${row.itemId}\` | ${row.readiness} | ${row.paritySlotStatus} | ${row.recommendedUrls.map(url => `[origin](${url})`).join('<br>')} | ${blockers} |`
    }),
  ].join('\n')}\n`
}

const rowsForReadiness = (
  report: OriginComponentProgressReportType,
  readiness: OriginComponentProgressReadiness,
): ReadonlyArray<OriginComponentProgressRow> =>
  report.rows.filter(row => row.readiness === readiness)

export const renderOriginComponentProgressMarkdown = (
  report: OriginComponentProgressReportType,
): string => {
  const nextRows = selectNextOriginComponentRows(report, 4)

  const markdown = `# Component Conversion Checklist

Generated at: ${report.generatedAt}

## Summary

| Surface | Imported | Total | Remaining |
| --- | ---: | ---: | ---: |
| Base UI docs | ${report.summary.baseUi.imported} | ${report.summary.baseUi.total} | ${report.summary.baseUi.remaining} |
| shadcn docs | ${report.summary.shadcn.imported} | ${report.summary.shadcn.total} | ${report.summary.shadcn.remaining} |

- shadcn source-backed files: ${report.summary.shadcnSourceFileCount}
- shadcn docs/example-only rows: ${report.summary.shadcnDocsExampleOnlyCount}
- Blocked rows: ${report.summary.blockedCount}
- Ready-for-dossier rows: ${report.summary.readyForDossierCount}
- Dossier-ready rows: ${report.summary.dossierReadyCount}
- Base UI pinned ref: \`${report.summary.sourceRefs.baseUiPinnedRef}\`
- shadcn pinned ref: \`${report.summary.sourceRefs.shadcnPinnedRef}\`

## Next Candidates

${rowsTable(nextRows)}

## Imported Items

${markdownList(rowsForReadiness(report, 'imported').map(row => row.itemId))}

## Ready For Dossier

${rowsTable(rowsForReadiness(report, 'ready-for-dossier'))}

## Dossier Ready

${rowsTable(rowsForReadiness(report, 'dossier-ready'))}

## Blocked

${rowsTable(rowsForReadiness(report, 'blocked'))}
`

  return execFileSync(
    'bun',
    ['x', 'oxfmt', '--stdin-filepath', componentChecklistMarkdownPath],
    {
      encoding: 'utf-8',
      input: markdown,
    },
  )
}

export const formatOriginComponentStatus = (
  report: OriginComponentProgressReportType,
): string =>
  [
    `Base UI: ${report.summary.baseUi.imported}/${report.summary.baseUi.total} imported (${report.summary.baseUi.remaining} remaining)`,
    `shadcn: ${report.summary.shadcn.imported}/${report.summary.shadcn.total} imported (${report.summary.shadcn.remaining} remaining)`,
    `shadcn source-backed files: ${report.summary.shadcnSourceFileCount}`,
    `Blocked: ${report.summary.blockedCount}`,
    `Ready for dossier: ${report.summary.readyForDossierCount}`,
    `Dossier ready: ${report.summary.dossierReadyCount}`,
    existsSync(componentChecklistMarkdownPath)
      ? `Checklist: ${componentChecklistMarkdownPath}`
      : `Checklist: ${componentChecklistMarkdownPath} (missing; run bun run origin:components:write)`,
  ].join('\n')

export const formatNextOriginComponentRows = (
  rows: ReadonlyArray<OriginComponentProgressRow>,
): string => {
  if (rows.length === 0) {
    return 'No ready rows. Review blocked rows in docs/component-conversion-checklist.md.'
  }

  return rows
    .map(row => {
      const blockers =
        row.blockers.length === 0
          ? 'none'
          : row.blockers.map(blocker => `- ${blocker}`).join('\n')
      const invocation = `bun run scripts/draft-registry-component-plan.ts --output plans/artifacts/<next-dossier-dir> ${row.recommendedUrls.join(' ')}`

      return [
        `${row.itemId} (${row.readiness})`,
        `URLs: ${row.recommendedUrls.join(', ')}`,
        `Blockers: ${blockers}`,
        `Generate dossier: ${invocation}`,
      ].join('\n')
    })
    .join('\n\n')
}

export const writeOriginComponentProgressChecklist =
  (): OriginComponentProgressReportType => {
    const previousReport = readProgressReport(componentChecklistJsonPath)
    const report = deriveOriginComponentProgress()
    const reportWithSelectedGeneratedAt = {
      ...report,
      generatedAt: selectGeneratedAt(report, previousReport),
    }
    const decodedReport = S.decodeUnknownSync(OriginComponentProgressReport)(
      reportWithSelectedGeneratedAt,
    )

    writeJson(componentChecklistJsonPath, decodedReport)
    writeFileSync(
      componentChecklistMarkdownPath,
      renderOriginComponentProgressMarkdown(decodedReport),
    )

    return decodedReport
  }

export const checkOriginComponentProgressChecklistCurrent = (): void => {
  const previousReport = readProgressReport(componentChecklistJsonPath)

  if (previousReport === undefined) {
    throw new Error(
      `${componentChecklistJsonPath} is missing or invalid; run bun run origin:components:write`,
    )
  }

  if (!existsSync(componentChecklistMarkdownPath)) {
    throw new Error(
      `${componentChecklistMarkdownPath} is missing; run bun run origin:components:write`,
    )
  }

  const nextReport = deriveOriginComponentProgress({
    generatedAt: previousReport.generatedAt,
  })
  const nextMarkdown = renderOriginComponentProgressMarkdown(nextReport)
  const previousMarkdown = readFileSync(componentChecklistMarkdownPath, 'utf-8')

  if (hashJson(previousReport) !== hashJson(nextReport)) {
    throw new Error(
      `${componentChecklistJsonPath} is stale; run bun run origin:components:write`,
    )
  }

  if (previousMarkdown !== nextMarkdown) {
    throw new Error(
      `${componentChecklistMarkdownPath} is stale; run bun run origin:components:write`,
    )
  }
}
