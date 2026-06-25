import { classifyDependency } from '../src/registry/validation'
import { ensurePinnedRepo, resolveOriginUrl } from './origin-common'

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import pathModule from 'node:path'

const neutralOutputDir = 'plans/artifacts/registry-component-dossier-preview'

const parseArgs = (args: ReadonlyArray<string>) => {
  const outputIndex = args.indexOf('--output')
  const outputDir = outputIndex === -1 ? undefined : args.at(outputIndex + 1)
  const urls = args.filter((arg, index) => {
    if (arg === '--output') {
      return false
    }

    if (outputIndex !== -1 && index === outputIndex + 1) {
      return false
    }

    return arg.startsWith('https://')
  })

  if (urls.length === 0) {
    throw new Error(
      'Usage: bun run scripts/draft-registry-component-plan.ts [--output <dir>] <origin-url> [...origin-url]',
    )
  }

  return {
    outputDir: outputDir ?? neutralOutputDir,
    urls,
  }
}

const parseComponentSlug = (docsUrl: string): string => {
  const url = new URL(docsUrl)
  const docsMatch = url.pathname.match(/\/components\/(?<slug>[^/]+)$/u)
  const registryMatch = url.pathname.match(/\/(?<slug>[^/]+)\.json$/u)
  const maybeSlug = docsMatch?.groups?.slug ?? registryMatch?.groups?.slug

  if (maybeSlug === undefined) {
    throw new Error(`Could not infer component slug from ${docsUrl}`)
  }

  return maybeSlug
}

interface HeldShadcnRow {
  readonly itemId: string
  readonly status: 'blocked'
  readonly docsUrl: string
  readonly localRepoPath: 'repos/ui'
  readonly pinnedRef: string
  readonly resolverStatus:
    | 'fails-missing-primary-source'
    | 'resolves-but-chart-foundation-gated'
  readonly missingPrimarySourcePath?: string
  readonly sourcePaths?: ReadonlyArray<string>
  readonly docsPaths: ReadonlyArray<string>
  readonly examplePaths: ReadonlyArray<string>
  readonly styleVariantPaths?: ReadonlyArray<string>
  readonly publicRegistryPaths: ReadonlyArray<string>
  readonly registryDependencyHints: ReadonlyArray<string>
  readonly runtimeDependencyHints: ReadonlyArray<string>
  readonly blockers: ReadonlyArray<string>
}

type HeldShadcnRowDraft = Omit<HeldShadcnRow, 'pinnedRef'>

const docsOnlyShadcnRow = (
  slug: string,
  details: Omit<
    HeldShadcnRowDraft,
    | 'itemId'
    | 'status'
    | 'docsUrl'
    | 'localRepoPath'
    | 'resolverStatus'
    | 'missingPrimarySourcePath'
    | 'blockers'
  > & {
    readonly blockers: ReadonlyArray<string>
  },
): HeldShadcnRow => ({
  itemId: `shadcn/${slug}`,
  status: 'blocked',
  docsUrl: `https://ui.shadcn.com/docs/components/${slug}`,
  localRepoPath: 'repos/ui',
  resolverStatus: 'fails-missing-primary-source',
  missingPrimarySourcePath: `repos/ui/apps/v4/styles/base-nova/ui/${slug}.tsx`,
  ...details,
})

const heldShadcnRows: Readonly<Record<string, HeldShadcnRowDraft>> = {
  'data-table': docsOnlyShadcnRow('data-table', {
    docsPaths: [
      'repos/ui/apps/v4/content/docs/components/base/data-table.mdx',
      'repos/ui/apps/v4/content/docs/components/radix/data-table.mdx',
    ],
    examplePaths: [
      'repos/ui/apps/v4/examples/base/data-table-demo.tsx',
      'repos/ui/apps/v4/examples/base/data-table-rtl.tsx',
      'repos/ui/apps/v4/examples/radix/data-table-demo.tsx',
      'repos/ui/apps/v4/examples/radix/data-table-rtl.tsx',
      'repos/ui/apps/v4/app/(app)/examples/tasks/components/data-table.tsx',
      'repos/ui/apps/v4/app/(app)/examples/tasks/components/data-table-column-header.tsx',
      'repos/ui/apps/v4/app/(app)/examples/tasks/components/data-table-faceted-filter.tsx',
      'repos/ui/apps/v4/app/(app)/examples/tasks/components/data-table-pagination.tsx',
      'repos/ui/apps/v4/app/(app)/examples/tasks/components/data-table-row-actions.tsx',
      'repos/ui/apps/v4/app/(app)/examples/tasks/components/data-table-toolbar.tsx',
      'repos/ui/apps/v4/app/(app)/examples/tasks/components/data-table-view-options.tsx',
      'repos/ui/apps/v4/app/(app)/examples/dashboard/components/data-table.tsx',
    ],
    publicRegistryPaths: [
      'repos/ui/apps/v4/public/r/styles/default/data-table-demo.json',
    ],
    registryDependencyHints: [
      'shadcn/badge',
      'shadcn/button',
      'shadcn/checkbox',
      'shadcn/command',
      'shadcn/drawer',
      'shadcn/dropdown-menu',
      'shadcn/input',
      'shadcn/label',
      'shadcn/popover',
      'shadcn/select',
      'shadcn/separator',
      'shadcn/table',
      'shadcn/tabs',
      'utils/cn',
    ],
    runtimeDependencyHints: [
      '@dnd-kit/core',
      '@dnd-kit/modifiers',
      '@dnd-kit/sortable',
      '@dnd-kit/utilities',
      '@tanstack/react-table',
      'lucide-react',
      'react',
      'recharts',
      'sonner',
      'zod',
    ],
    blockers: [
      'Docs/example-only resolver support is required because no base-nova component source exists.',
      'A local table sorting/filtering/pagination foundation must replace TanStack React Table semantics.',
      'Dashboard examples require local chart, drawer, tabs, toast, and drag-and-drop decisions before parity can be accepted.',
    ],
  }),
  'date-picker': docsOnlyShadcnRow('date-picker', {
    docsPaths: [
      'repos/ui/apps/v4/content/docs/components/base/date-picker.mdx',
      'repos/ui/apps/v4/content/docs/components/radix/date-picker.mdx',
    ],
    examplePaths: [
      'repos/ui/apps/v4/examples/base/date-picker-basic.tsx',
      'repos/ui/apps/v4/examples/base/date-picker-demo.tsx',
      'repos/ui/apps/v4/examples/base/date-picker-dob.tsx',
      'repos/ui/apps/v4/examples/base/date-picker-input.tsx',
      'repos/ui/apps/v4/examples/base/date-picker-natural-language.tsx',
      'repos/ui/apps/v4/examples/base/date-picker-range.tsx',
      'repos/ui/apps/v4/examples/base/date-picker-rtl.tsx',
      'repos/ui/apps/v4/examples/base/date-picker-time.tsx',
      'repos/ui/apps/v4/examples/radix/date-picker-basic.tsx',
      'repos/ui/apps/v4/examples/radix/date-picker-demo.tsx',
      'repos/ui/apps/v4/examples/radix/date-picker-dob.tsx',
      'repos/ui/apps/v4/examples/radix/date-picker-input.tsx',
      'repos/ui/apps/v4/examples/radix/date-picker-natural-language.tsx',
      'repos/ui/apps/v4/examples/radix/date-picker-range.tsx',
      'repos/ui/apps/v4/examples/radix/date-picker-rtl.tsx',
      'repos/ui/apps/v4/examples/radix/date-picker-time.tsx',
    ],
    publicRegistryPaths: [
      'repos/ui/apps/v4/public/r/styles/default/date-picker-demo.json',
      'repos/ui/apps/v4/public/r/styles/default/date-picker-form.json',
      'repos/ui/apps/v4/public/r/styles/default/date-picker-with-presets.json',
      'repos/ui/apps/v4/public/r/styles/default/date-picker-with-range.json',
    ],
    registryDependencyHints: [
      'shadcn/button',
      'shadcn/calendar',
      'shadcn/field',
      'shadcn/input',
      'shadcn/input-group',
      'shadcn/popover',
    ],
    runtimeDependencyHints: [
      '@/components/language-selector',
      'chrono-node',
      'date-fns',
      'date-fns/locale',
      'lucide-react',
      'react',
      'react-day-picker',
      'react-day-picker/locale',
    ],
    blockers: [
      'Docs/example-only resolver support is required because no base-nova component source exists.',
      'Calendar, popover, field, input, and date behavior foundations must exist locally.',
      'Natural-language parsing, locale formatting, and range/time selection must be modeled without React DayPicker runtime source.',
    ],
  }),
  toast: docsOnlyShadcnRow('toast', {
    docsPaths: [
      'repos/ui/apps/v4/content/docs/components/base/toast.mdx',
      'repos/ui/apps/v4/content/docs/components/radix/toast.mdx',
    ],
    examplePaths: [],
    publicRegistryPaths: [
      'repos/ui/apps/v4/public/r/styles/default/toast-demo.json',
      'repos/ui/apps/v4/public/r/styles/default/toast-destructive.json',
      'repos/ui/apps/v4/public/r/styles/default/toast-simple.json',
      'repos/ui/apps/v4/public/r/styles/default/toast-with-action.json',
      'repos/ui/apps/v4/public/r/styles/default/toast-with-title.json',
      'repos/ui/apps/v4/public/r/styles/default/toast.json',
      'repos/ui/apps/v4/public/r/styles/default/use-toast.json',
    ],
    registryDependencyHints: ['base-ui/toast', 'shadcn/button'],
    runtimeDependencyHints: ['react'],
    blockers: [
      'Docs/example-only or public-registry JSON resolver support is required because no base-nova component source exists.',
      'The local notification direction must be settled across base-ui/toast, shadcn/sonner, and shadcn/toast.',
      'The React hook-style origin API must be mapped to Foldkit messages, commands, and managed subscriptions.',
    ],
  }),
  typography: docsOnlyShadcnRow('typography', {
    docsPaths: [
      'repos/ui/apps/v4/content/docs/components/base/typography.mdx',
      'repos/ui/apps/v4/content/docs/components/radix/typography.mdx',
    ],
    examplePaths: [
      'repos/ui/apps/v4/examples/base/typography-blockquote.tsx',
      'repos/ui/apps/v4/examples/base/typography-demo.tsx',
      'repos/ui/apps/v4/examples/base/typography-h1.tsx',
      'repos/ui/apps/v4/examples/base/typography-h2.tsx',
      'repos/ui/apps/v4/examples/base/typography-h3.tsx',
      'repos/ui/apps/v4/examples/base/typography-h4.tsx',
      'repos/ui/apps/v4/examples/base/typography-inline-code.tsx',
      'repos/ui/apps/v4/examples/base/typography-large.tsx',
      'repos/ui/apps/v4/examples/base/typography-lead.tsx',
      'repos/ui/apps/v4/examples/base/typography-list.tsx',
      'repos/ui/apps/v4/examples/base/typography-muted.tsx',
      'repos/ui/apps/v4/examples/base/typography-p.tsx',
      'repos/ui/apps/v4/examples/base/typography-rtl.tsx',
      'repos/ui/apps/v4/examples/base/typography-small.tsx',
      'repos/ui/apps/v4/examples/base/typography-table.tsx',
    ],
    publicRegistryPaths: [
      'repos/ui/apps/v4/public/r/styles/default/typography-blockquote.json',
      'repos/ui/apps/v4/public/r/styles/default/typography-demo.json',
      'repos/ui/apps/v4/public/r/styles/default/typography-h1.json',
      'repos/ui/apps/v4/public/r/styles/default/typography-h2.json',
      'repos/ui/apps/v4/public/r/styles/default/typography-h3.json',
      'repos/ui/apps/v4/public/r/styles/default/typography-h4.json',
      'repos/ui/apps/v4/public/r/styles/default/typography-inline-code.json',
      'repos/ui/apps/v4/public/r/styles/default/typography-large.json',
      'repos/ui/apps/v4/public/r/styles/default/typography-lead.json',
      'repos/ui/apps/v4/public/r/styles/default/typography-list.json',
      'repos/ui/apps/v4/public/r/styles/default/typography-muted.json',
      'repos/ui/apps/v4/public/r/styles/default/typography-p.json',
      'repos/ui/apps/v4/public/r/styles/default/typography-small.json',
      'repos/ui/apps/v4/public/r/styles/default/typography-table.json',
    ],
    registryDependencyHints: [],
    runtimeDependencyHints: ['@/components/language-selector', 'react'],
    blockers: [
      'Docs/example-only resolver support is required because no base-nova component source exists.',
      'Typography must be classified as docs examples, style primitives, or registry-local text helpers before installable planning.',
      'RTL examples need local constants or fixture-only language selector handling.',
    ],
  }),
  chart: {
    itemId: 'shadcn/chart',
    status: 'blocked',
    docsUrl: 'https://ui.shadcn.com/docs/components/chart',
    localRepoPath: 'repos/ui',
    resolverStatus: 'resolves-but-chart-foundation-gated',
    sourcePaths: ['repos/ui/apps/v4/styles/base-nova/ui/chart.tsx'],
    docsPaths: [
      'repos/ui/apps/v4/content/docs/components/base/chart.mdx',
      'repos/ui/apps/v4/content/docs/components/radix/chart.mdx',
    ],
    examplePaths: [
      'repos/ui/apps/v4/examples/base/chart-demo.tsx',
      'repos/ui/apps/v4/examples/base/chart-example-axis.tsx',
      'repos/ui/apps/v4/examples/base/chart-example-grid.tsx',
      'repos/ui/apps/v4/examples/base/chart-example-legend.tsx',
      'repos/ui/apps/v4/examples/base/chart-example-tooltip.tsx',
      'repos/ui/apps/v4/examples/base/chart-example.tsx',
      'repos/ui/apps/v4/examples/base/chart-rtl.tsx',
      'repos/ui/apps/v4/examples/base/chart-tooltip.tsx',
    ],
    styleVariantPaths: [
      'repos/ui/apps/v4/styles/base-luma/ui/chart.tsx',
      'repos/ui/apps/v4/styles/base-lyra/ui/chart.tsx',
      'repos/ui/apps/v4/styles/base-maia/ui/chart.tsx',
      'repos/ui/apps/v4/styles/base-mira/ui/chart.tsx',
      'repos/ui/apps/v4/styles/base-nova/ui-rtl/chart.tsx',
      'repos/ui/apps/v4/styles/base-nova/ui/chart.tsx',
      'repos/ui/apps/v4/styles/base-rhea/ui/chart.tsx',
      'repos/ui/apps/v4/styles/base-sera/ui/chart.tsx',
      'repos/ui/apps/v4/styles/base-vega/ui/chart.tsx',
    ],
    publicRegistryPaths: [
      'repos/ui/apps/v4/public/r/styles/default/chart.json',
      'repos/ui/apps/v4/public/r/styles/default/chart-area-default.json',
      'repos/ui/apps/v4/public/r/styles/default/chart-bar-default.json',
      'repos/ui/apps/v4/public/r/styles/default/chart-line-default.json',
      'repos/ui/apps/v4/public/r/styles/default/chart-pie-simple.json',
    ],
    registryDependencyHints: ['shadcn/card', 'utils/cn'],
    runtimeDependencyHints: [
      '@/components/language-selector',
      '@/registry/new-york-v4/ui/card',
      '@/registry/new-york-v4/ui/chart',
      'react',
      'recharts',
    ],
    blockers: [
      'ADR 0001 gates charts on an explicit native chart foundation.',
      'Recharts and React are origin evidence only unless a later architecture decision accepts a runtime chart dependency.',
      'The chart namespace and chart example parity harness must exist before chart items become implementation-ready.',
    ],
  },
}

const maybeHeldShadcnRow = (
  docsUrl: string,
): HeldShadcnRowDraft | undefined => {
  const slug = parseComponentSlug(docsUrl)

  return heldShadcnRows[slug]
}

const requireHeldEvidencePaths = (row: HeldShadcnRow): void => {
  const paths = [
    ...row.docsPaths,
    ...row.examplePaths,
    ...(row.sourcePaths ?? []),
    ...(row.styleVariantPaths ?? []),
    ...row.publicRegistryPaths,
  ]

  const maybeMissingPath = paths.find(filePath => !existsSync(filePath))

  if (maybeMissingPath !== undefined) {
    throw new Error(`Origin evidence path is missing: ${maybeMissingPath}`)
  }
}

const completeHeldShadcnRow = (
  row: HeldShadcnRowDraft,
  pinnedRef: string,
): HeldShadcnRow => {
  const completedRow = { ...row, pinnedRef }

  requireHeldEvidencePaths(completedRow)

  return completedRow
}

const registryItemId = (
  resolution: ReturnType<typeof resolveOriginUrl>,
): string =>
  `${resolution.originKind}/${parseComponentSlug(resolution.docsUrl)}`

const uniqueSorted = (values: ReadonlyArray<string>): ReadonlyArray<string> =>
  [...new Set(values)].toSorted((left, right) => left.localeCompare(right))

const dependencyTarget = (specifier: string): string => {
  const baseUiMatch = specifier.match(/^@base-ui\/react\/(?<slug>[^/]+)$/u)

  if (baseUiMatch?.groups?.slug !== undefined) {
    return `base-ui/${baseUiMatch.groups.slug}`
  }

  return classifyDependency(specifier) === 'registry-local' ? specifier : ''
}

const dependencyReason = (specifier: string): string => {
  if (specifier === 'utils/cn') {
    return 'Local shadcn class canonicalization and Tailwind conflict handling.'
  }

  if (specifier.startsWith('base-ui/')) {
    return 'The styled shadcn item composes this local Base UI primitive.'
  }

  if (specifier.startsWith('shadcn/')) {
    return 'Origin examples compose this local shadcn registry item.'
  }

  if (specifier === 'class-variance-authority') {
    return 'Replace CVA with Effect Schema literals and pure variant class maps.'
  }

  if (specifier === 'react' || specifier === 'react-dom') {
    return 'React is origin fixture evidence only, not installable Foldkit source.'
  }

  if (
    specifier.startsWith('@base-ui/react/') ||
    specifier.startsWith('@base-ui-components/react/')
  ) {
    return 'Replace the upstream React primitive with the local Foldkit registry implementation.'
  }

  if (specifier.startsWith('@radix-ui/react-')) {
    return 'Replace the upstream Radix React primitive with local Foldkit behavior before installable source.'
  }

  return 'Review before implementation; keep as fixture-only, replace locally, or defer the row.'
}

const dependencyClassification = (
  resolutions: ReadonlyArray<ReturnType<typeof resolveOriginUrl>>,
) =>
  uniqueSorted(
    resolutions.flatMap(resolution => [
      ...resolution.registryDependencyHints,
      ...resolution.runtimeDependencyHints,
    ]),
  ).map(specifier => ({
    specifier,
    classification: classifyDependency(specifier),
    target: dependencyTarget(specifier),
    reason: dependencyReason(specifier),
  }))

const originTestClassification = (
  resolutions: ReadonlyArray<ReturnType<typeof resolveOriginUrl>>,
) =>
  resolutions.flatMap(resolution => [
    ...resolution.testPaths.map(testPath => ({
      path: testPath,
      classification:
        resolution.originKind === 'shadcn'
          ? 'not-applicable'
          : 'port-semantically',
      reason:
        resolution.originKind === 'shadcn'
          ? 'shadcn CLI or React workflow tests are replaced by this registry workflow.'
          : 'Foldkit Story and Scene tests should preserve behavior without React internals.',
    })),
    ...resolution.specPaths.map(specPath => ({
      path: specPath,
      classification: 'covered-by-parity',
      reason:
        'DOM attributes and browser behavior belong in origin parity fixtures.',
    })),
  ])

const formatInlineList = (values: ReadonlyArray<string>): string =>
  values.length === 0
    ? '`none`'
    : values.map(value => `\`${value}\``).join(', ')

const writeDossierArtifacts = (
  outputDir: string,
  dossier: unknown,
  planPreview: string,
): void => {
  const dossierPath = pathModule.join(outputDir, 'dossier.json')
  const planPreviewPath = pathModule.join(outputDir, 'plan-preview.md')

  mkdirSync(outputDir, { recursive: true })
  writeFileSync(dossierPath, `${JSON.stringify(dossier, null, 2)}\n`)
  writeFileSync(planPreviewPath, planPreview)
  execFileSync('bun', ['x', 'oxfmt', '--write', dossierPath, planPreviewPath], {
    stdio: 'ignore',
  })
}

const heldDependencyPolicy = {
  react: 'dev-or-fixture-only',
  recharts: 'reject-or-defer',
  '@tanstack/react-table': 'reject-or-defer',
  '@dnd-kit/*': 'reject-or-defer',
  sonner: 'reject-or-defer',
  'react-day-picker': 'reject-or-defer',
  'date-fns': 'reject-or-defer',
  'chrono-node': 'reject-or-defer',
}

const heldDependencyClassification = (rows: ReadonlyArray<HeldShadcnRow>) =>
  uniqueSorted(
    rows.flatMap(row => [
      ...row.registryDependencyHints,
      ...row.runtimeDependencyHints,
    ]),
  ).map(specifier => ({
    specifier,
    classification: classifyDependency(specifier),
    target: dependencyTarget(specifier),
    reason: dependencyReason(specifier),
  }))

const renderHeldEvidencePaths = (row: HeldShadcnRow): string => {
  const evidencePaths = [
    ...row.docsPaths,
    ...row.examplePaths,
    ...(row.sourcePaths ?? []),
    ...row.publicRegistryPaths,
  ]

  return evidencePaths.map(filePath => `  - \`${filePath}\``).join('\n')
}

const renderHeldPlanPreview = (
  rows: ReadonlyArray<HeldShadcnRow>,
): string => `# Outstanding Held Component Dossier Preview

## Batch

${rows.map(row => `- \`${row.itemId}\``).join('\n')}

This dossier does not implement registry source. It records the final
outstanding rows from the pinned shadcn origin surface and keeps them blocked
until the missing local foundations or resolver capabilities exist.

## Why These Rows Are Held

${rows
  .map(
    row => `### \`${row.itemId}\`

- Docs URL: ${row.docsUrl}
- Local repo: \`${row.localRepoPath}\`
- Pinned ref: \`${row.pinnedRef}\`
- Resolver status: \`${row.resolverStatus}\`
- Missing primary source: ${row.missingPrimarySourcePath === undefined ? '`none`' : `\`${row.missingPrimarySourcePath}\``}
- Evidence paths:
${renderHeldEvidencePaths(row)}
- Runtime hints: ${formatInlineList(row.runtimeDependencyHints)}
- Registry hints: ${formatInlineList(row.registryDependencyHints)}
- Blockers:
${row.blockers.map(blocker => `  - ${blocker}`).join('\n')}
`,
  )
  .join('\n')}

## Dependency Policy

${Object.entries(heldDependencyPolicy)
  .map(
    ([specifier, classification]) =>
      `- \`${specifier}\`: \`${classification}\``,
  )
  .join('\n')}

## Foldkit Mapping

- Keep these rows non-installable until local dependencies are available.
- Use docs/example-only planning evidence for rows without primary shadcn source.
- Keep React and origin registry paths fixture-only.
- Replace React composition with Foldkit messages, state, commands,
  subscriptions, Submodels, \`toView\`, or named part renderers as appropriate.
- Use Effect Schema to define any future boundary data, variants, row models,
  date models, chart config, and notification events.
- Treat typography as local style or document primitives unless a later
  implementation plan proves a component boundary.
- For chart, create the native chart foundation first; do not plan a direct
  Recharts wrapper as installable registry source.

## Future Improve Plan Shape

1. Keep these rows visible as blocked intake: ${rows.map(row => `\`${row.itemId}\``).join(', ')}.
2. Decide whether \`shadcn/typography\` is installable component source,
   style-token primitives, or docs/examples registry content.
3. Add a local table/query model before promoting \`shadcn/data-table\`.
4. Add local date/calendar behavior before promoting \`shadcn/date-picker\`.
5. Settle the notification model across \`base-ui/toast\`, \`shadcn/sonner\`, and
   \`shadcn/toast\`.
6. Add a native chart foundation before promoting \`shadcn/chart\` or chart
   blocks.
7. Run \`bun run check\`, \`bun run typecheck\`, \`bun run registry:check\`, and
   \`git diff --check -- plans scripts docs\`.
`

const renderPlanPreview = (
  resolutions: ReadonlyArray<ReturnType<typeof resolveOriginUrl>>,
  registryItems: ReadonlyArray<string>,
  dependencies: ReturnType<typeof dependencyClassification>,
  tests: ReturnType<typeof originTestClassification>,
): string => {
  const title =
    registryItems.length === 1
      ? `${registryItems[0]} Dossier Preview`
      : `${registryItems.join(' + ')} Dossier Preview`

  return `# ${title}

## Batch

${registryItems.map(item => `- \`${item}\``).join('\n')}

This dossier does not implement registry source. It prepares a future improve plan for the local Foldkit registry.

## Origin Evidence

${resolutions
  .map(
    resolution => `### ${resolution.originName}

- Registry item: \`${registryItemId(resolution)}\`
- Origin kind: \`${resolution.originKind}\`
- Docs URL: ${resolution.docsUrl}
- Local repo: \`${resolution.localRepoPath}\`
- Pinned ref: \`${resolution.pinnedRef}\`
- Source paths: ${formatInlineList(resolution.sourcePaths)}
- Docs paths: ${formatInlineList(resolution.docsPaths)}
- Demo paths: ${formatInlineList(resolution.demoPaths)}
- Test/spec paths: ${formatInlineList([
      ...resolution.testPaths,
      ...resolution.specPaths,
    ])}
- Style variants: ${formatInlineList(resolution.styleVariantPaths)}
- Runtime hints: ${formatInlineList(resolution.runtimeDependencyHints)}
- Registry hints: ${formatInlineList(resolution.registryDependencyHints)}
- Confidence: \`${resolution.confidence}\`
`,
  )
  .join('\n')}

## Foldkit Mapping

- Keep Base UI origins as unstyled Foldkit behavior primitives or stateless render helpers according to the local component shape.
- Keep shadcn origins as styled Foldkit wrappers or compositions over local primitives.
- Map origin \`render\` and shadcn \`asChild\` support to Foldkit \`toView\` or named part-renderer composition.
- Use \`cn\` from \`utils/cn\` when a shadcn source imports \`@/lib/utils\`.
- Represent style variants with Effect Schema literals and pure class maps.
- Record consumed theme tokens before marking any shadcn item installable.

## Dependencies

${dependencies
  .map(
    dependency =>
      `- \`${dependency.specifier}\`: \`${dependency.classification}\` -> \`${dependency.target || 'defer'}\` (${dependency.reason})`,
  )
  .join('\n')}

## Origin Test Classification

${
  tests.length === 0
    ? '- `none`: `not-applicable` (No origin tests or specs were discovered.)'
    : tests
        .map(
          test =>
            `- \`${test.path}\`: \`${test.classification}\` (${test.reason})`,
        )
        .join('\n')
}

## Future Improve Plan Shape

1. Create these registry items as dossier-backed implementation slices: ${registryItems
    .map(item => `\`${item}\``)
    .join(', ')}.
2. Add semantic Story and Scene tests for the Foldkit messages, state, accessibility, and view behavior each item owns.
3. Add local origin and Foldkit parity fixtures for each registry item.
4. Replace upstream React, Radix, Base UI React, and CVA dependencies with local Foldkit and Effect-native implementations.
5. Add theme token coverage and class canonicalization parity for shadcn items.
6. Run \`bun run registry:check\`, \`bun run parity:check -- --grep <component> --dry-run\`, \`bun run test\`, \`bun run typecheck\`, \`bun run check\`, and \`bun run build\`.
`
}

const main = () => {
  const { outputDir, urls } = parseArgs(process.argv.slice(2))
  const heldRowDrafts = urls.flatMap(url => {
    const maybeHeldRow = maybeHeldShadcnRow(url)

    return maybeHeldRow === undefined ? [] : [maybeHeldRow]
  })

  if (heldRowDrafts.length === urls.length) {
    const pinnedRef = ensurePinnedRepo('repos/ui')
    const heldRows = heldRowDrafts.map(row =>
      completeHeldShadcnRow(row, pinnedRef),
    )
    const dossier = {
      batch: heldRows.map(row => row.itemId),
      generatedKind: 'blocked-outstanding-preview',
      createsRegistryItemFolders: false,
      plannedAtCommit: '16c50d4a',
      sourceQueue:
        'plans/artifacts/007-remaining-component-dossiers/hold-rows.md',
      rows: heldRows,
      dependencyClassification: heldDependencyClassification(heldRows),
      dependencyPolicy: heldDependencyPolicy,
      unresolvedQuestions: [
        'Should docs/example-only shadcn rows become non-installable documentation/examples registry items or dependency-complete component batches?',
        'What native table/query model should replace TanStack React Table semantics?',
        'What native chart foundation should exist before shadcn/chart and chart blocks are planned?',
        'Should typography be a component, a style primitive family, or documentation-only examples?',
      ],
    }

    writeDossierArtifacts(outputDir, dossier, renderHeldPlanPreview(heldRows))

    console.log(`Wrote blocked shadcn dossier preview to ${outputDir}`)

    return
  }

  const resolutions = urls.map(resolveOriginUrl)
  const registryItems = resolutions.map(registryItemId)
  const dependencies = dependencyClassification(resolutions)
  const tests = originTestClassification(resolutions)
  const dossier = {
    batch: registryItems,
    generatedKind: 'preview',
    createsRegistryItemFolders: false,
    resolutions,
    dependencyClassification: dependencies,
    originTestClassification: tests,
  }

  writeDossierArtifacts(
    outputDir,
    dossier,
    renderPlanPreview(resolutions, registryItems, dependencies, tests),
  )

  console.log(`Wrote registry component dossier preview to ${outputDir}`)
}

main()
