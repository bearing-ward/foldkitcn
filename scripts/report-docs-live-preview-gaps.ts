import { Array, Option, Order, Schema as S, pipe } from 'effect'

import type {
  LiveExampleContext,
  hasLiveExampleViewFor as hasLiveExampleViewForType,
  liveExampleViewFor as liveExampleViewForType,
} from '../src/live-examples'
import type { createToastState as createToastStateType } from '../src/registry/base-ui/toast'
import {
  ComponentDocsArtifact,
  ComponentDocsIndex,
} from '../src/registry/schema'
import type {
  ComponentDocsArtifact as ComponentDocsArtifactType,
  ExampleDocsArtifact,
} from '../src/registry/schema'

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

export type MissingLivePreviewReason = 'static-status' | 'missing-live-renderer'

export type MissingLivePreviewCard = Readonly<{
  routePath: string
  itemId: string
  exampleId: string
  title: string
  previewExportName: string | null
  previewStatus: ExampleDocsArtifact['previewStatus']
  reason: MissingLivePreviewReason
}>

export type LivePreviewGapSummary = Readonly<{
  totalExampleCards: number
  cardsWithLivePreview: number
  cardsMissingLivePreview: number
  missingByComponent: ReadonlyArray<Readonly<{ itemId: string; count: number }>>
  missingByReason: ReadonlyArray<
    Readonly<{ reason: MissingLivePreviewReason; count: number }>
  >
}>

export type LivePreviewGapReport = Readonly<{
  rows: ReadonlyArray<MissingLivePreviewCard>
  summary: LivePreviewGapSummary
}>

type LiveExampleViewFor = typeof liveExampleViewForType
type HasLiveExampleViewFor = typeof hasLiveExampleViewForType
type CreateToastState = typeof createToastStateType

const repoRoot = path.resolve(import.meta.dirname, '..')
const artifactDir = path.join(
  repoRoot,
  'plans/artifacts/089-docs-live-preview-gaps',
)
const artifactJsonPath = path.join(
  artifactDir,
  'missing-live-preview-cards.json',
)
const artifactReadmePath = path.join(artifactDir, 'README.md')

const optionToNullable = <Value>(value: Option.Option<Value>): Value | null =>
  Option.match(value, {
    onNone: () => null,
    onSome: inner => inner,
  })

const readJsonFile = async (filePath: string): Promise<unknown> =>
  JSON.parse(await readFile(filePath, 'utf-8'))

const ensureBrowserGlobals = (): void => {
  if (!('window' in globalThis)) {
    const browserWindow: Pick<
      Window,
      'cancelAnimationFrame' | 'requestAnimationFrame'
    > = {
      cancelAnimationFrame: clearTimeout,
      requestAnimationFrame: () => 0,
    }

    Object.assign(globalThis, {
      window: browserWindow,
    })
  }
}

export const loadLiveExampleViewFor = async (): Promise<LiveExampleViewFor> => {
  ensureBrowserGlobals()
  const liveExamplesModule = await import('../src/live-examples')

  return liveExamplesModule.liveExampleViewFor
}

export const loadHasLiveExampleViewFor =
  async (): Promise<HasLiveExampleViewFor> => {
    ensureBrowserGlobals()
    const liveExamplesModule = await import('../src/live-examples')

    return liveExamplesModule.hasLiveExampleViewFor
  }

export const loadCreateToastState = async (): Promise<CreateToastState> => {
  ensureBrowserGlobals()
  const toastModule = await import('../src/registry/base-ui/toast')

  return toastModule.createToastState
}

export const createLiveExampleContext = (
  createToastState: CreateToastState,
): LiveExampleContext<unknown> => ({
  inputValueFor: (_example, defaultValue) => defaultValue,
  inputIdPrefixFor: example => example.id.replaceAll('/', '-'),
  onInputValueChange: () => ({}),
  otpValueFor: (_example, defaultValue) => defaultValue,
  onOtpValueChange: () => ({}),
  sliderValuesFor: (_example, _sliderId, defaultValues) => defaultValues,
  onSliderValueChange: () => ({}),
  selectIsOpenFor: () => false,
  selectValueFor: (_example, defaultValue) => defaultValue,
  onSelectOpenChange: () => ({}),
  onSelectValueChange: () => ({}),
  comboboxIsOpenFor: () => false,
  comboboxInputValueFor: (_example, defaultValue) => defaultValue,
  comboboxValueFor: (_example, defaultValue) => defaultValue,
  comboboxValuesFor: (_example, defaultValues) => defaultValues,
  onComboboxOpenChange: () => ({}),
  onComboboxInputValueChange: () => ({}),
  onComboboxValueChange: () => ({}),
  radioGroupValueFor: (_example, defaultValue) => defaultValue,
  radioGroupIdPrefixFor: example => example.id.replaceAll('/', '-'),
  onRadioGroupValueChange: () => ({}),
  checkboxCheckedStateFor: (_example, _controlId, defaultCheckedState) =>
    defaultCheckedState,
  onCheckboxCheckedChange: () => ({}),
  switchIsCheckedFor: (_example, _controlId, defaultIsChecked) =>
    defaultIsChecked,
  onSwitchCheckedChange: () => ({}),
  accordionValuesFor: (_example, _accordionId, defaultValues) => defaultValues,
  onAccordionValueChange: () => ({}),
  collapsibleIsOpenFor: (_example, _collapsibleId, defaultOpen) => defaultOpen,
  onCollapsibleOpenChange: () => ({}),
  tabsValueFor: (_example, _tabsId, defaultValue) => defaultValue,
  onTabsValueChange: () => ({}),
  toggleIsPressedFor: (_example, _controlId, defaultIsPressed) =>
    defaultIsPressed,
  onTogglePressedChange: () => ({}),
  toggleGroupValuesFor: (_example, _groupId, defaultValues) => defaultValues,
  onToggleGroupValueChange: () => ({}),
  calendarSelectedDateFor: (_example, defaultValue) => defaultValue,
  calendarVisibleMonthFor: (_example, defaultValue) => defaultValue,
  onCalendarSelectDate: () => ({}),
  onCalendarPreviousMonth: () => ({}),
  onCalendarNextMonth: () => ({}),
  carouselSelectedIndexFor: (_example, defaultValue) => defaultValue,
  onCarouselMessage: () => ({}),
  resizableStateFor: () => Option.none(),
  onResizableMessage: () => ({}),
  commandDialogIsOpenFor: () => false,
  commandDialogIdFor: example => `${example.id.replaceAll('/', '-')}-dialog`,
  onCommandDialogOpen: () => ({}),
  onCommandDialogOpenChange: () => ({}),
  overlayIsOpenFor: () => false,
  onOverlayOpenChange: () => ({}),
  menuIsOpenFor: (_example, _menuId, defaultOpen) => defaultOpen,
  menuOpenSubmenuValuesFor: (_example, _menuId, defaultValues) => defaultValues,
  menuContextPointFor: () => Option.none(),
  menuValueFor: (_example, _menuId, defaultValue) => defaultValue,
  menuCheckedStateFor: (_example, _menuId, _itemValue, defaultChecked) =>
    defaultChecked,
  menuRadioValueFor: (_example, _menuId, _groupValue, defaultValue) =>
    defaultValue,
  onMenuOpenChange: () => ({}),
  onMenuContextPointChange: () => ({}),
  onMenuCheckedChange: () => ({}),
  onMenuRadioValueChange: () => ({}),
  onMenuValueChange: () => ({}),
  toastStateFor: () => createToastState(),
  onToastMessage: () => ({}),
  onBubbleMessage: () => ({}),
  sidebarIsOpenFor: (_example, defaultOpen) => defaultOpen,
  onSidebarOpenChange: () => ({}),
  sidebarPanelIsOpenFor: (_example, _panelId, defaultOpen) => defaultOpen,
  onSidebarPanelOpenChange: () => ({}),
  sidebarSelectedValueFor: (_example, _panelId, defaultValue) => defaultValue,
  onSidebarSelectedValueChange: () => ({}),
})

export const loadGeneratedDocsArtifacts = async (): Promise<
  ReadonlyArray<ComponentDocsArtifactType>
> => {
  const docsIndex = S.decodeUnknownSync(ComponentDocsIndex)(
    await readJsonFile(path.join(repoRoot, 'registry/docs/index.json')),
  )

  return Promise.all(
    docsIndex.routes.map(async route =>
      S.decodeUnknownSync(ComponentDocsArtifact)(
        await readJsonFile(path.join(repoRoot, route.docsArtifactPath)),
      ),
    ),
  )
}

const incrementCount = <Key extends string>(
  rows: ReadonlyArray<Readonly<{ key: Key }>>,
): ReadonlyArray<Readonly<{ key: Key; count: number }>> => {
  const counts = new Map<Key, number>()

  for (const row of rows) {
    counts.set(row.key, (counts.get(row.key) ?? 0) + 1)
  }

  return Array.sortWith(
    globalThis.Array.from(counts, ([key, count]) => ({
      count,
      key,
    })),
    row => row.count,
    Order.flip(Order.Number),
  )
}

export const createLivePreviewGapReport = (
  artifacts: ReadonlyArray<ComponentDocsArtifactType>,
  hasLiveExampleViewFor: HasLiveExampleViewFor,
  liveExampleContext: LiveExampleContext<unknown>,
): LivePreviewGapReport => {
  void liveExampleContext

  const rows = pipe(
    artifacts,
    Array.flatMap(artifact =>
      pipe(
        artifact.examples,
        Array.flatMap(example =>
          hasLiveExampleViewFor(example)
            ? []
            : (() => {
                if (example.previewStatus === 'live-ready') {
                  const row: MissingLivePreviewCard = {
                    routePath: artifact.routePath,
                    itemId: artifact.itemId,
                    exampleId: example.id,
                    title: example.title,
                    previewExportName: optionToNullable(
                      example.previewExportName,
                    ),
                    previewStatus: example.previewStatus,
                    reason: 'missing-live-renderer',
                  }

                  return [row]
                }

                const row: MissingLivePreviewCard = {
                  routePath: artifact.routePath,
                  itemId: artifact.itemId,
                  exampleId: example.id,
                  title: example.title,
                  previewExportName: optionToNullable(
                    example.previewExportName,
                  ),
                  previewStatus: example.previewStatus,
                  reason: 'static-status',
                }

                return [row]
              })(),
        ),
      ),
    ),
    unsortedRows =>
      Array.sortWith(
        unsortedRows,
        row => `${row.itemId}\u0000${row.exampleId}`,
        Order.String,
      ),
  )
  const totalExampleCards = pipe(
    artifacts,
    Array.reduce(0, (total, artifact) => total + artifact.examples.length),
  )
  const missingByComponent = incrementCount(
    rows.map(row => ({ key: row.itemId })),
  ).map(row => ({ itemId: row.key, count: row.count }))
  const missingByReason = incrementCount(
    rows.map(row => ({ key: row.reason })),
  ).map(row => ({ reason: row.key, count: row.count }))

  return {
    rows,
    summary: {
      totalExampleCards,
      cardsWithLivePreview: totalExampleCards - rows.length,
      cardsMissingLivePreview: rows.length,
      missingByComponent,
      missingByReason,
    },
  }
}

const formatSummary = (report: LivePreviewGapReport): string => {
  const byComponentLines = report.summary.missingByComponent.map(
    row => `- ${row.itemId}: ${row.count}`,
  )
  const byReasonLines = report.summary.missingByReason.map(
    row => `- ${row.reason}: ${row.count}`,
  )

  return [
    'Docs live preview gap inventory',
    '',
    `Total example cards: ${report.summary.totalExampleCards}`,
    `Cards with .live-example-preview: ${report.summary.cardsWithLivePreview}`,
    `Cards missing .live-example-preview: ${report.summary.cardsMissingLivePreview}`,
    '',
    'Missing count by reason:',
    ...byReasonLines,
    '',
    'Missing count by component:',
    ...byComponentLines,
  ].join('\n')
}

const readmeFor = (report: LivePreviewGapReport): string =>
  [
    '# Docs live preview gap inventory',
    '',
    'Generated by:',
    '',
    '```bash',
    'bun run scripts/report-docs-live-preview-gaps.ts --write',
    '```',
    '',
    'This artifact lists every generated docs example card that currently does not',
    'render `.live-example-preview`. Static rows are known backlog;',
    '`missing-live-renderer` rows are a stop condition.',
    '',
    `- Total example cards: ${report.summary.totalExampleCards}`,
    `- Cards with \`.live-example-preview\`: ${report.summary.cardsWithLivePreview}`,
    `- Cards missing \`.live-example-preview\`: ${report.summary.cardsMissingLivePreview}`,
    '',
    '## Missing Count By Reason',
    '',
    '| Reason | Missing preview cards |',
    '|--------|-----------------------|',
    ...report.summary.missingByReason.map(
      row => `| \`${row.reason}\` | ${row.count} |`,
    ),
    '',
    '## Missing Count By Component',
    '',
    '| Component | Missing preview cards |',
    '|-----------|-----------------------|',
    ...report.summary.missingByComponent.map(
      row => `| \`${row.itemId}\` | ${row.count} |`,
    ),
    '',
  ].join('\n')

export const writeLivePreviewGapArtifacts = async (
  report: LivePreviewGapReport,
): Promise<void> => {
  await mkdir(artifactDir, { recursive: true })
  await writeFile(artifactJsonPath, `${JSON.stringify(report.rows, null, 2)}\n`)
  await writeFile(artifactReadmePath, readmeFor(report))
}

export const readLivePreviewGapArtifact = async (): Promise<
  ReadonlyArray<MissingLivePreviewCard>
> => {
  const rows: ReadonlyArray<MissingLivePreviewCard> = JSON.parse(
    await readFile(artifactJsonPath, 'utf-8'),
  )

  return rows
}

const main = async (): Promise<void> => {
  const shouldWriteArtifacts = process.argv.includes('--write')
  const report = createLivePreviewGapReport(
    await loadGeneratedDocsArtifacts(),
    await loadHasLiveExampleViewFor(),
    createLiveExampleContext(await loadCreateToastState()),
  )
  const missingRenderers = report.rows.filter(
    row => row.reason === 'missing-live-renderer',
  )

  console.log(formatSummary(report))

  if (shouldWriteArtifacts) {
    await writeLivePreviewGapArtifacts(report)
  }

  if (missingRenderers.length > 0) {
    process.exitCode = 1
  }
}

if (import.meta.main) {
  await main()
}
