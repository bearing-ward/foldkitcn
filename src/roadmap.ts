import { Array, Match as M, Option, Order, pipe } from 'effect'

import type {
  OriginComponentProgressReport,
  OriginComponentProgressRow,
  OriginResolutionStatus,
} from './registry/schema'

export type RoadmapBlockedGroup = Readonly<{
  label: string
  summary: string
  rows: ReadonlyArray<OriginComponentProgressRow>
}>

export type RoadmapSnapshot = Readonly<{
  report: OriginComponentProgressReport
  nextCandidates: ReadonlyArray<OriginComponentProgressRow>
  blockedGroups: ReadonlyArray<RoadmapBlockedGroup>
  nextSteps: ReadonlyArray<string>
}>

const MAX_ROADMAP_ROWS = 5

const blockedStatusOrder: ReadonlyArray<OriginResolutionStatus> = [
  'foundation-gated',
  'docs-example-only',
  'source-backed',
]

const blockedStatusLabel = (status: OriginResolutionStatus): string =>
  M.value(status).pipe(
    M.withReturnType<string>(),
    M.when('foundation-gated', () => 'Foundation-gated rows'),
    M.when('docs-example-only', () => 'Docs/example-only rows'),
    M.when('source-backed', () => 'Source-backed rows'),
    M.exhaustive,
  )

const blockedStatusSummary = (status: OriginResolutionStatus): string =>
  M.value(status).pipe(
    M.withReturnType<string>(),
    M.when(
      'foundation-gated',
      () =>
        'These rows need a local Foldkit foundation decision before component implementation should start.',
    ),
    M.when(
      'docs-example-only',
      () =>
        'These rows have product docs, but no primary source component to port directly.',
    ),
    M.when(
      'source-backed',
      () =>
        'These rows have source evidence but still need a blocking dependency or modeling question resolved.',
    ),
    M.exhaustive,
  )

const limitedRows = (
  rows: ReadonlyArray<OriginComponentProgressRow>,
): ReadonlyArray<OriginComponentProgressRow> =>
  pipe(
    rows,
    Array.sortWith(row => row.itemId, Order.String),
    Array.take(MAX_ROADMAP_ROWS),
  )

const blockedGroupFor = (
  status: OriginResolutionStatus,
  rows: ReadonlyArray<OriginComponentProgressRow>,
): Option.Option<RoadmapBlockedGroup> => {
  const matchingRows = pipe(
    rows,
    Array.filter(row => row.originResolutionStatus === status),
    limitedRows,
  )

  return Array.match(matchingRows, {
    onEmpty: () => Option.none(),
    onNonEmpty: groupRows =>
      Option.some({
        label: blockedStatusLabel(status),
        summary: blockedStatusSummary(status),
        rows: groupRows,
      }),
  })
}

export const roadmapSnapshot = (
  report: OriginComponentProgressReport,
): RoadmapSnapshot => {
  const nextCandidates = pipe(
    report.rows,
    Array.filter(row => row.readiness === 'ready-for-dossier'),
    limitedRows,
  )
  const blockedRows = pipe(
    report.rows,
    Array.filter(row => row.readiness === 'blocked'),
  )
  const initialBlockedGroups: Array<RoadmapBlockedGroup> = []
  const blockedGroups = Array.reduce(
    blockedStatusOrder,
    initialBlockedGroups,
    (groups, status) =>
      Option.match(blockedGroupFor(status, blockedRows), {
        onNone: () => groups,
        onSome: group => Array.append(groups, group),
      }),
  )

  return {
    report,
    nextCandidates,
    blockedGroups,
    nextSteps: [
      'Promote ready rows into dossiers with origin evidence and dependency classification.',
      'Resolve foundation-gated primitives before exposing dependent shadcn rows as installable.',
      'Keep public navigation limited to installable and preview components while roadmap rows mature.',
    ],
  }
}
