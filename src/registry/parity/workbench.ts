import { Schema as S } from 'effect'

export const ParityWorkbenchOriginKind = S.Literal('pinned-shadcn')
export type ParityWorkbenchOriginKind = typeof ParityWorkbenchOriginKind.Type

export const ParityWorkbenchViewport = S.Struct({
  width: S.Number,
  height: S.Number,
})
export type ParityWorkbenchViewport = typeof ParityWorkbenchViewport.Type

export const ParityWorkbenchEnvironment = S.Struct({
  viewport: ParityWorkbenchViewport,
  colorScheme: S.Union([S.Literal('light'), S.Literal('dark')]),
  reducedMotion: S.Union([S.Literal('reduce'), S.Literal('no-preference')]),
  locale: S.String,
  direction: S.Union([S.Literal('ltr'), S.Literal('rtl')]),
})
export type ParityWorkbenchEnvironment = typeof ParityWorkbenchEnvironment.Type

export const ParityWorkbenchCaptureZone = S.Struct({
  rootSelector: S.String,
  portalSelectors: S.Array(S.String),
  layerSelectors: S.Array(S.String),
})
export type ParityWorkbenchCaptureZone = typeof ParityWorkbenchCaptureZone.Type

export const ParityWorkbenchComparisonKind = S.Union([
  S.Literal('dom-structure'),
  S.Literal('attributes'),
  S.Literal('roles'),
  S.Literal('aria-state'),
  S.Literal('accessible-name'),
  S.Literal('class-tokens'),
  S.Literal('computed-style'),
  S.Literal('colors'),
  S.Literal('dimensions'),
  S.Literal('geometry'),
  S.Literal('fixture-data'),
  S.Literal('interaction-state'),
  S.Literal('screenshots'),
  S.Literal('all-computed-style'),
  S.Literal('accessibility-tree'),
  S.Literal('animation-timing'),
])
export type ParityWorkbenchComparisonKind =
  typeof ParityWorkbenchComparisonKind.Type

export const ParityWorkbenchComparisonPolicy = S.Struct({
  hard: S.Array(ParityWorkbenchComparisonKind),
  advisory: S.Array(ParityWorkbenchComparisonKind),
})
export type ParityWorkbenchComparisonPolicy =
  typeof ParityWorkbenchComparisonPolicy.Type

export const ParityWorkbenchClickStep = S.Struct({
  kind: S.Literal('click'),
  selector: S.String,
})
export type ParityWorkbenchClickStep = typeof ParityWorkbenchClickStep.Type

export const ParityWorkbenchHoverStep = S.Struct({
  kind: S.Literal('hover'),
  selector: S.String,
})
export type ParityWorkbenchHoverStep = typeof ParityWorkbenchHoverStep.Type

export const ParityWorkbenchFocusStep = S.Struct({
  kind: S.Literal('focus'),
  selector: S.String,
})
export type ParityWorkbenchFocusStep = typeof ParityWorkbenchFocusStep.Type

export const ParityWorkbenchTabStep = S.Struct({
  kind: S.Literal('tab'),
})
export type ParityWorkbenchTabStep = typeof ParityWorkbenchTabStep.Type

export const ParityWorkbenchPressKeyStep = S.Struct({
  kind: S.Literal('press-key'),
  key: S.String,
})
export type ParityWorkbenchPressKeyStep =
  typeof ParityWorkbenchPressKeyStep.Type

export const ParityWorkbenchEscapeStep = S.Struct({
  kind: S.Literal('escape'),
})
export type ParityWorkbenchEscapeStep = typeof ParityWorkbenchEscapeStep.Type

export const ParityWorkbenchOutsideClickStep = S.Struct({
  kind: S.Literal('outside-click'),
  selector: S.String,
})
export type ParityWorkbenchOutsideClickStep =
  typeof ParityWorkbenchOutsideClickStep.Type

export const ParityWorkbenchWaitForStableLayoutStep = S.Struct({
  kind: S.Literal('wait-for-stable-layout'),
})
export type ParityWorkbenchWaitForStableLayoutStep =
  typeof ParityWorkbenchWaitForStableLayoutStep.Type

export const ParityWorkbenchInteractionStep = S.Union([
  ParityWorkbenchClickStep,
  ParityWorkbenchHoverStep,
  ParityWorkbenchFocusStep,
  ParityWorkbenchTabStep,
  ParityWorkbenchPressKeyStep,
  ParityWorkbenchEscapeStep,
  ParityWorkbenchOutsideClickStep,
  ParityWorkbenchWaitForStableLayoutStep,
])
export type ParityWorkbenchInteractionStep =
  typeof ParityWorkbenchInteractionStep.Type

export const ParityWorkbenchInteractionRecipe = S.Struct({
  id: S.String,
  title: S.String,
  steps: S.Array(ParityWorkbenchInteractionStep),
})
export type ParityWorkbenchInteractionRecipe =
  typeof ParityWorkbenchInteractionRecipe.Type

export const ParityWorkbenchAllowedDeviation = S.Struct({
  id: S.String,
  scope: S.String,
  comparison: ParityWorkbenchComparisonKind,
  reason: S.String,
  owner: S.String,
})
export type ParityWorkbenchAllowedDeviation =
  typeof ParityWorkbenchAllowedDeviation.Type

export const ParityWorkbenchReportPaths = S.Struct({
  outputDir: S.String,
  jsonPath: S.String,
  markdownPath: S.String,
  htmlPath: S.OptionFromNullOr(S.String),
  screenshotDir: S.String,
})
export type ParityWorkbenchReportPaths = typeof ParityWorkbenchReportPaths.Type

export const ParityWorkbenchCapturePhase = S.Union([
  S.Literal('initial'),
  S.Literal('before'),
  S.Literal('after'),
])
export type ParityWorkbenchCapturePhase =
  typeof ParityWorkbenchCapturePhase.Type

export const ParityWorkbenchCaptureRecord = S.Struct({
  kind: S.Union([S.Literal('origin'), S.Literal('foldkit')]),
  label: S.String,
  recipeId: S.OptionFromNullOr(S.String),
  stepIndex: S.OptionFromNullOr(S.Number),
  phase: ParityWorkbenchCapturePhase,
  state: S.Unknown,
})
export type ParityWorkbenchCaptureRecord =
  typeof ParityWorkbenchCaptureRecord.Type

export const ParityWorkbenchCase = S.Struct({
  itemId: S.String,
  caseId: S.String,
  originKind: ParityWorkbenchOriginKind,
  originSourcePath: S.String,
  originHarnessPath: S.String,
  foldkitSourceHintPaths: S.Array(S.String),
  neutralFixturePath: S.String,
  environment: ParityWorkbenchEnvironment,
  captureZones: ParityWorkbenchCaptureZone,
  comparisonPolicy: ParityWorkbenchComparisonPolicy,
  interactionRecipes: S.Array(ParityWorkbenchInteractionRecipe),
  allowedDeviations: S.Array(ParityWorkbenchAllowedDeviation),
  reportPaths: ParityWorkbenchReportPaths,
})
export type ParityWorkbenchCase = typeof ParityWorkbenchCase.Type

export const ParityWorkbenchSelection = S.Struct({
  itemId: S.String,
  caseId: S.String,
})
export type ParityWorkbenchSelection = typeof ParityWorkbenchSelection.Type

export const ParityWorkbenchNeutralFixtureTab = S.Struct({
  id: S.String,
  value: S.String,
  label: S.String,
})
export type ParityWorkbenchNeutralFixtureTab =
  typeof ParityWorkbenchNeutralFixtureTab.Type

export const ParityWorkbenchNeutralFixture = S.Struct({
  schemaVersion: S.Literal(1),
  itemId: S.String,
  caseId: S.String,
  originSourcePath: S.String,
  tabs: S.Array(ParityWorkbenchNeutralFixtureTab),
  selectedValue: S.String,
  orientation: S.Union([S.Literal('horizontal'), S.Literal('vertical')]),
  listVariant: S.String,
  disabledValues: S.Array(S.String),
})
export type ParityWorkbenchNeutralFixture =
  typeof ParityWorkbenchNeutralFixture.Type

export const defaultWorkbenchEnvironment = S.decodeUnknownSync(
  ParityWorkbenchEnvironment,
)({
  viewport: { width: 800, height: 400 },
  colorScheme: 'light',
  reducedMotion: 'reduce',
  locale: 'en-US',
  direction: 'ltr',
})

export const defaultWorkbenchComparisonPolicy = S.decodeUnknownSync(
  ParityWorkbenchComparisonPolicy,
)({
  hard: [
    'dom-structure',
    'attributes',
    'roles',
    'aria-state',
    'accessible-name',
    'class-tokens',
    'computed-style',
    'colors',
    'dimensions',
    'geometry',
    'fixture-data',
    'interaction-state',
  ],
  advisory: [
    'screenshots',
    'all-computed-style',
    'accessibility-tree',
    'animation-timing',
  ],
})

export const renderWorkbenchMarkdownReport = (report: {
  readonly itemId: string
  readonly caseId: string
  readonly command: string
  readonly originSourcePath: string
  readonly foldkitSourceHintPaths: ReadonlyArray<string>
  readonly captureZones: ParityWorkbenchCaptureZone
  readonly environment: ParityWorkbenchEnvironment
  readonly reportPaths: ParityWorkbenchReportPaths
  readonly captures: ReadonlyArray<ParityWorkbenchCaptureRecord>
  readonly hardFailures: ReadonlyArray<
    Readonly<{ kind: string; summary: string }>
  >
  readonly advisoryDifferences: ReadonlyArray<
    Readonly<{ kind: string; summary: string }>
  >
  readonly fixtureDifferences: ReadonlyArray<
    Readonly<{ kind: string; summary: string }>
  >
  readonly appliedDeviations: ReadonlyArray<ParityWorkbenchAllowedDeviation>
  readonly likelyOwnerFiles: ReadonlyArray<string>
}): string =>
  [
    '# Parity Workbench Report',
    '',
    `- item: \`${report.itemId}\``,
    `- case: \`${report.caseId}\``,
    `- rerun: \`${report.command}\``,
    `- origin source: \`${report.originSourcePath}\``,
    `- foldkit hints: ${report.foldkitSourceHintPaths.join(', ')}`,
    `- viewport: ${report.environment.viewport.width}x${report.environment.viewport.height}`,
    `- color scheme: ${report.environment.colorScheme}`,
    `- reduced motion: ${report.environment.reducedMotion}`,
    `- locale: ${report.environment.locale}`,
    `- direction: ${report.environment.direction}`,
    `- capture root: \`${report.captureZones.rootSelector}\``,
    `- portal selectors: ${
      report.captureZones.portalSelectors.length > 0
        ? report.captureZones.portalSelectors.join(', ')
        : 'none'
    }`,
    `- layer selectors: ${
      report.captureZones.layerSelectors.length > 0
        ? report.captureZones.layerSelectors.join(', ')
        : 'none'
    }`,
    `- json report: \`${report.reportPaths.jsonPath}\``,
    `- markdown report: \`${report.reportPaths.markdownPath}\``,
    `- screenshot dir: \`${report.reportPaths.screenshotDir}\``,
    '',
    '## Captures',
    report.captures.length === 0
      ? '- none'
      : report.captures
          .map(
            capture => `- [${capture.kind}] ${capture.label}: ${capture.phase}`,
          )
          .join('\n'),
    '',
    '## Hard failures',
    report.hardFailures.length === 0
      ? '- none'
      : report.hardFailures
          .map(failure => `- ${failure.kind}: ${failure.summary}`)
          .join('\n'),
    '',
    '## Advisory differences',
    report.advisoryDifferences.length === 0
      ? '- none'
      : report.advisoryDifferences
          .map(diff => `- ${diff.kind}: ${diff.summary}`)
          .join('\n'),
    '',
    '## Fixture differences',
    report.fixtureDifferences.length === 0
      ? '- none'
      : report.fixtureDifferences
          .map(diff => `- ${diff.kind}: ${diff.summary}`)
          .join('\n'),
    '',
    '## Allowed deviations',
    report.appliedDeviations.length === 0
      ? '- none'
      : report.appliedDeviations
          .map(deviation => `- ${deviation.id}: ${deviation.reason}`)
          .join('\n'),
    '',
    '## Likely owner files',
    report.likelyOwnerFiles.length === 0
      ? '- none'
      : report.likelyOwnerFiles.map(filePath => `- ${filePath}`).join('\n'),
    '',
  ].join('\n')
