import { Schema as S } from 'effect'

import { OriginResolution } from '../src/registry/schema'
import type { OriginResolution as OriginResolutionType } from '../src/registry/schema'
import { extractImportSpecifiers } from '../src/registry/validation'

import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import pathModule from 'node:path'

const normalizePath = (filePath: string): string =>
  filePath.replaceAll('\\', '/')

export const ensurePinnedRepo = (localRepoPath: string): string => {
  if (!existsSync(localRepoPath) || !statSync(localRepoPath).isDirectory()) {
    throw new Error(`Local origin repo is missing: ${localRepoPath}`)
  }

  const pinnedRef = execFileSync(
    'git',
    ['-C', localRepoPath, 'rev-parse', 'HEAD'],
    { encoding: 'utf-8' },
  ).trim()

  if (pinnedRef.length === 0) {
    throw new Error(
      `Pinned ref is missing for local origin repo: ${localRepoPath}`,
    )
  }

  return pinnedRef
}

const requirePaths = (paths: ReadonlyArray<string>): ReadonlyArray<string> =>
  paths.map(filePath => {
    if (!existsSync(filePath)) {
      throw new Error(`Origin evidence path is missing: ${filePath}`)
    }

    return normalizePath(filePath)
  })

const existingPaths = (paths: ReadonlyArray<string>): ReadonlyArray<string> =>
  paths.filter(existsSync).map(normalizePath)

const uniqueSortedPaths = (
  paths: ReadonlyArray<string>,
): ReadonlyArray<string> =>
  [...new Set(paths.map(normalizePath))].toSorted((left, right) =>
    left.localeCompare(right),
  )

const expandExistingPath = (inventoryPath: string): ReadonlyArray<string> => {
  if (!existsSync(inventoryPath)) {
    return []
  }

  const stat = statSync(inventoryPath)

  if (stat.isFile()) {
    return [normalizePath(inventoryPath)]
  }

  return readdirSync(inventoryPath, { withFileTypes: true }).flatMap(entry =>
    expandExistingPath(pathModule.join(inventoryPath, entry.name)),
  )
}

const requireInventoryFiles = (
  inventoryPath: string,
): ReadonlyArray<string> => {
  if (!existsSync(inventoryPath)) {
    throw new Error(`Origin evidence path is missing: ${inventoryPath}`)
  }

  return uniqueSortedPaths(expandExistingPath(inventoryPath))
}

const titleCaseSlug = (slug: string): string =>
  slug
    .split('-')
    .map(part => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(' ')

const parseBaseUiComponentSlug = (docsUrl: string): string | undefined => {
  const url = new URL(docsUrl)
  const match = url.pathname.match(/^\/react\/components\/(?<slug>[^/]+)$/u)

  return match?.groups?.slug
}

const parseShadcnComponentSlug = (docsUrl: string): string | undefined => {
  const url = new URL(docsUrl)
  const docsMatch = url.pathname.match(/^\/docs\/components\/(?<slug>[^/]+)$/u)
  const registryMatch = url.pathname.match(/\/(?<slug>[^/]+)\.json$/u)

  return docsMatch?.groups?.slug ?? registryMatch?.groups?.slug
}

const isTestPath = (filePath: string): boolean =>
  /(?:^|\/)[^/]+\.test\.[cm]?[tj]sx?$/u.test(filePath)

const isSpecPath = (filePath: string): boolean =>
  /(?:^|\/)[^/]+\.spec\.[cm]?[tj]sx?$/u.test(filePath)

const isSourceLikePath = (filePath: string): boolean =>
  /\.[cm]?[tj]sx?$/u.test(filePath)

const baseUiComponentRoot = (slug: string): string =>
  `repos/base-ui/packages/react/src/${slug}`

const baseUiDocsRoot = (slug: string): string =>
  `repos/base-ui/docs/src/app/(docs)/react/components/${slug}`

const hasBaseUiComponentEvidence = (slug: string): boolean =>
  existsSync(baseUiComponentRoot(slug)) && existsSync(baseUiDocsRoot(slug))

const baseUiButtonSourceOverrides = existingPaths([
  'repos/base-ui/packages/react/src/internals/use-button/useButton.ts',
])

const baseUiButtonTestOverrides = existingPaths([
  'repos/base-ui/packages/react/src/internals/use-button/useButton.test.tsx',
])

const baseUiResolution = (docsUrl: string, slug: string) => {
  const localRepoPath = 'repos/base-ui'
  const pinnedRef = ensurePinnedRepo(localRepoPath)
  const componentRoot = baseUiComponentRoot(slug)
  const docsRoot = baseUiDocsRoot(slug)
  const componentFiles = requireInventoryFiles(componentRoot)
  const docsFiles = requireInventoryFiles(docsRoot)
  const sourcePaths = uniqueSortedPaths([
    ...componentFiles.filter(
      filePath => !isTestPath(filePath) && !isSpecPath(filePath),
    ),
    ...(slug === 'button' ? baseUiButtonSourceOverrides : []),
  ])
  const docsPaths = docsFiles.filter(filePath => !filePath.includes('/demos/'))
  const demoPaths = docsFiles.filter(filePath => filePath.includes('/demos/'))
  const testPaths = uniqueSortedPaths([
    ...componentFiles.filter(isTestPath),
    ...(slug === 'button' ? baseUiButtonTestOverrides : []),
  ])
  const resolution = {
    originKind: 'base-ui',
    originName: `Base UI ${titleCaseSlug(slug)}`,
    docsUrl,
    localRepoPath,
    pinnedRef,
    resolutionStatus: 'source-backed',
    sourcePaths,
    docsPaths,
    demoPaths,
    testPaths,
    specPaths: componentFiles.filter(isSpecPath),
    apiReferencePaths: docsPaths.filter(filePath =>
      /\/types\.(?:md|ts)$/u.test(filePath),
    ),
    styleVariantPaths: [],
    publicRegistryPaths: [],
    registryDependencyHints: [],
    runtimeDependencyHints: [`@base-ui-components/react/${slug}`],
    blockers: [],
    confidence: 'high',
    unresolvedQuestions: [],
  }

  return S.decodeUnknownSync(OriginResolution)(resolution)
}

const shadcnStyleVariantPaths = (slug: string): ReadonlyArray<string> => {
  const styleRoot = 'repos/ui/apps/v4/styles'

  if (!existsSync(styleRoot)) {
    throw new Error(`Origin evidence path is missing: ${styleRoot}`)
  }

  const baseStylePaths = readdirSync(styleRoot, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && entry.name.startsWith('base-'))
    .flatMap(entry =>
      existingPaths([
        pathModule.join(styleRoot, entry.name, 'ui', `${slug}.tsx`),
        pathModule.join(styleRoot, entry.name, 'ui-rtl', `${slug}.tsx`),
      ]),
    )
  const buttonRadixPrecedentPaths =
    slug === 'button'
      ? existingPaths([
          'repos/ui/apps/v4/styles/radix-nova/ui/button.tsx',
          'repos/ui/apps/v4/styles/radix-nova/ui-rtl/button.tsx',
        ])
      : []

  return uniqueSortedPaths([...baseStylePaths, ...buttonRadixPrecedentPaths])
}

const shadcnDocsPaths = (slug: string): ReadonlyArray<string> =>
  existingPaths([
    `repos/ui/apps/v4/content/docs/components/base/${slug}.mdx`,
    `repos/ui/apps/v4/content/docs/components/radix/${slug}.mdx`,
  ])

const shadcnComponentSlugs = (): ReadonlyArray<string> => {
  const componentRoot = 'repos/ui/apps/v4/styles/base-nova/ui'

  if (!existsSync(componentRoot)) {
    throw new Error(`Origin evidence path is missing: ${componentRoot}`)
  }

  return readdirSync(componentRoot, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.endsWith('.tsx'))
    .map(entry => entry.name.slice(0, -'.tsx'.length))
}

const isNestedComponentExample = (slug: string, fileName: string): boolean =>
  shadcnComponentSlugs().some(
    componentSlug =>
      componentSlug !== slug &&
      componentSlug.startsWith(`${slug}-`) &&
      fileName.startsWith(`${componentSlug}-`),
  )

const shadcnExamplePaths = (slug: string): ReadonlyArray<string> => {
  const examplesRoot = 'repos/ui/apps/v4/examples/base'

  if (!existsSync(examplesRoot)) {
    throw new Error(`Origin evidence path is missing: ${examplesRoot}`)
  }

  return uniqueSortedPaths(
    readdirSync(examplesRoot, { withFileTypes: true })
      .filter(
        entry =>
          entry.isFile() &&
          entry.name.startsWith(`${slug}-`) &&
          entry.name.endsWith('.tsx') &&
          !isNestedComponentExample(slug, entry.name),
      )
      .map(entry => pathModule.join(examplesRoot, entry.name)),
  )
}

export interface HeldShadcnRow {
  readonly itemId: string
  readonly status: 'blocked'
  readonly docsUrl: string
  readonly localRepoPath: 'repos/ui'
  readonly resolutionStatus: OriginResolutionType['resolutionStatus']
  readonly missingPrimarySourcePath?: string
  readonly sourcePaths: ReadonlyArray<string>
  readonly docsPaths: ReadonlyArray<string>
  readonly demoPaths: ReadonlyArray<string>
  readonly styleVariantPaths: ReadonlyArray<string>
  readonly publicRegistryPaths: ReadonlyArray<string>
  readonly registryDependencyHints: ReadonlyArray<string>
  readonly runtimeDependencyHints: ReadonlyArray<string>
  readonly confidence: OriginResolutionType['confidence']
  readonly blockers: ReadonlyArray<string>
  readonly unresolvedQuestions: ReadonlyArray<string>
  readonly pinnedRef: string
}

type HeldShadcnRowDraft = Omit<HeldShadcnRow, 'pinnedRef'>

const docsExampleOnlyShadcnRow = (
  slug: string,
  details: Omit<
    HeldShadcnRowDraft,
    | 'itemId'
    | 'status'
    | 'docsUrl'
    | 'localRepoPath'
    | 'resolutionStatus'
    | 'missingPrimarySourcePath'
    | 'sourcePaths'
    | 'confidence'
  >,
): HeldShadcnRowDraft => ({
  itemId: `shadcn/${slug}`,
  status: 'blocked',
  docsUrl: `https://ui.shadcn.com/docs/components/${slug}`,
  localRepoPath: 'repos/ui',
  resolutionStatus: 'docs-example-only',
  missingPrimarySourcePath: `repos/ui/apps/v4/styles/base-nova/ui/${slug}.tsx`,
  sourcePaths: [],
  confidence: 'low',
  ...details,
})

const heldShadcnRowDrafts: Readonly<Record<string, HeldShadcnRowDraft>> = {
  'data-table': docsExampleOnlyShadcnRow('data-table', {
    docsPaths: [
      'repos/ui/apps/v4/content/docs/components/base/data-table.mdx',
      'repos/ui/apps/v4/content/docs/components/radix/data-table.mdx',
    ],
    demoPaths: [
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
    styleVariantPaths: [],
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
      'No primary base-nova shadcn component source exists; use docs/example-only evidence for planning.',
      'A local table/query/sorting/filtering/pagination foundation must replace TanStack React Table semantics.',
      'Dashboard examples require local chart, drawer, tabs, toast, and drag-and-drop dependency decisions before parity can be accepted.',
    ],
    unresolvedQuestions: [
      'What Foldkit table/query model should own sorting, filtering, pagination, row selection, and drag-and-drop?',
      'Which dashboard dependencies should become local primitives before data-table can be planned as installable source?',
    ],
  }),
  'date-picker': docsExampleOnlyShadcnRow('date-picker', {
    docsPaths: [
      'repos/ui/apps/v4/content/docs/components/base/date-picker.mdx',
      'repos/ui/apps/v4/content/docs/components/radix/date-picker.mdx',
    ],
    demoPaths: [
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
    styleVariantPaths: [],
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
      'No primary base-nova shadcn component source exists; use docs/example-only evidence for planning.',
      'Local calendar/date behavior, popover, field, and input foundations must exist before installable source.',
      'Range, time, locale, and natural-language parsing decisions must be modeled without React DayPicker runtime source.',
    ],
    unresolvedQuestions: [
      'Which local calendar/date model should own single date, range, time, locale, and natural-language parsing flows?',
      'Which parsing and formatting dependencies are acceptable as fixture evidence versus deferred runtime behavior?',
    ],
  }),
  typography: docsExampleOnlyShadcnRow('typography', {
    docsPaths: [
      'repos/ui/apps/v4/content/docs/components/base/typography.mdx',
      'repos/ui/apps/v4/content/docs/components/radix/typography.mdx',
    ],
    demoPaths: [
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
    styleVariantPaths: [],
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
      'No primary base-nova shadcn component source exists; use docs/example-only evidence for planning.',
      'Typography is docs/examples plus local style primitive evidence, not a single installable behavior component yet.',
      '@/components/language-selector and react are origin fixture evidence only, not installable runtime dependencies.',
    ],
    unresolvedQuestions: [
      'Should typography become local style primitives, documentation/examples registry content, or a later proven component API?',
      'How should RTL language-selection examples be represented without importing origin fixture helpers into installable source?',
    ],
  }),
  chart: {
    itemId: 'shadcn/chart',
    status: 'blocked',
    docsUrl: 'https://ui.shadcn.com/docs/components/chart',
    localRepoPath: 'repos/ui',
    resolutionStatus: 'foundation-gated',
    sourcePaths: ['repos/ui/apps/v4/styles/base-nova/ui/chart.tsx'],
    docsPaths: [
      'repos/ui/apps/v4/content/docs/components/base/chart.mdx',
      'repos/ui/apps/v4/content/docs/components/radix/chart.mdx',
    ],
    demoPaths: [
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
    confidence: 'medium',
    blockers: [
      'ADR 0001 gates charts on an explicit native chart foundation.',
      'Recharts and React are origin evidence only unless a later architecture decision accepts a runtime chart dependency.',
      'The chart namespace and chart example parity harness must exist before chart items become implementation-ready.',
    ],
    unresolvedQuestions: [
      'What native Foldkit chart foundation should own scales, axes, legends, tooltips, and responsive layout?',
      'How should chart examples prove parity without wrapping Recharts as installable source?',
    ],
  },
}

const completeHeldShadcnRow = (
  row: HeldShadcnRowDraft,
  pinnedRef: string,
): HeldShadcnRow => ({ ...row, pinnedRef })

export const heldShadcnRowForSlug = (
  slug: string,
  pinnedRef: string,
): HeldShadcnRow | undefined => {
  const maybeRow = heldShadcnRowDrafts[slug]

  return maybeRow === undefined
    ? undefined
    : completeHeldShadcnRow(maybeRow, pinnedRef)
}

export const heldShadcnRowForOriginUrl = (
  docsUrl: string,
  pinnedRef: string,
): HeldShadcnRow | undefined => {
  const maybeSlug = parseShadcnComponentSlug(docsUrl)

  return maybeSlug === undefined
    ? undefined
    : heldShadcnRowForSlug(maybeSlug, pinnedRef)
}

const importedSpecifiers = (
  paths: ReadonlyArray<string>,
): ReadonlyArray<string> =>
  uniqueSortedPaths(
    paths
      .filter(isSourceLikePath)
      .flatMap(filePath =>
        extractImportSpecifiers(readFileSync(filePath, 'utf-8')),
      ),
  )

const shadcnRegistryHintFromImport = (
  currentSlug: string,
  specifier: string,
): string | undefined => {
  if (specifier === '@/lib/utils') {
    return 'utils/cn'
  }

  const styleMatch = specifier.match(
    /^@\/styles\/base-[^/]+\/ui(?:-rtl)?\/(?<slug>[^/]+)$/u,
  )

  if (styleMatch?.groups?.slug !== undefined) {
    const { slug } = styleMatch.groups

    return slug === currentSlug ? undefined : `shadcn/${slug}`
  }

  const baseUiMatch = specifier.match(/^@base-ui\/react\/(?<slug>[^/]+)$/u)

  if (
    baseUiMatch?.groups?.slug !== undefined &&
    hasBaseUiComponentEvidence(baseUiMatch.groups.slug)
  ) {
    return `base-ui/${baseUiMatch.groups.slug}`
  }

  return undefined
}

const isLocalShadcnImport = (specifier: string): boolean =>
  specifier === '@/lib/utils' ||
  /^@\/styles\/base-[^/]+\/ui(?:-rtl)?\/[^/]+$/u.test(specifier)

const isRelativeImport = (specifier: string): boolean =>
  specifier.startsWith('./') || specifier.startsWith('../')

const shadcnRuntimeHintFromImport = (specifier: string): string | undefined => {
  if (isRelativeImport(specifier) || isLocalShadcnImport(specifier)) {
    return undefined
  }

  return specifier
}

const shadcnResolution = (docsUrl: string, slug: string) => {
  const localRepoPath = 'repos/ui'
  const pinnedRef = ensurePinnedRepo(localRepoPath)
  const primarySourcePath = `repos/ui/apps/v4/styles/base-nova/ui/${slug}.tsx`
  const maybeHeldRow = heldShadcnRowForSlug(slug, pinnedRef)

  if (!existsSync(primarySourcePath)) {
    if (maybeHeldRow?.resolutionStatus === 'docs-example-only') {
      const resolution = {
        originKind: 'shadcn',
        originName: `shadcn ${titleCaseSlug(slug)}`,
        docsUrl,
        localRepoPath,
        pinnedRef,
        resolutionStatus: maybeHeldRow.resolutionStatus,
        sourcePaths: [],
        missingPrimarySourcePath: normalizePath(primarySourcePath),
        docsPaths: requirePaths(maybeHeldRow.docsPaths),
        demoPaths: requirePaths(maybeHeldRow.demoPaths),
        testPaths: [],
        specPaths: [],
        apiReferencePaths: requirePaths(maybeHeldRow.docsPaths),
        styleVariantPaths: requirePaths(maybeHeldRow.styleVariantPaths),
        publicRegistryPaths: requirePaths(maybeHeldRow.publicRegistryPaths),
        registryDependencyHints: maybeHeldRow.registryDependencyHints,
        runtimeDependencyHints: maybeHeldRow.runtimeDependencyHints,
        blockers: maybeHeldRow.blockers,
        confidence: maybeHeldRow.confidence,
        unresolvedQuestions: maybeHeldRow.unresolvedQuestions,
      }

      return S.decodeUnknownSync(OriginResolution)(resolution)
    }

    requirePaths([primarySourcePath])
  }

  const sourcePaths = requirePaths([primarySourcePath])
  const docsPaths = shadcnDocsPaths(slug)
  const demoPaths = shadcnExamplePaths(slug)
  const specifiers = importedSpecifiers([...sourcePaths, ...demoPaths])
  const registryDependencyHints = uniqueSortedPaths(
    specifiers.flatMap(specifier => {
      const maybeRegistryHint = shadcnRegistryHintFromImport(slug, specifier)

      return maybeRegistryHint === undefined ? [] : [maybeRegistryHint]
    }),
  )
  const runtimeDependencyHints = uniqueSortedPaths([
    ...specifiers.flatMap(specifier => {
      const maybeRuntimeHint = shadcnRuntimeHintFromImport(specifier)

      return maybeRuntimeHint === undefined ? [] : [maybeRuntimeHint]
    }),
    ...(maybeHeldRow?.runtimeDependencyHints ?? []),
  ])
  const resolutionStatus = maybeHeldRow?.resolutionStatus ?? 'source-backed'
  const blockers = maybeHeldRow?.blockers ?? []
  const heldUnresolvedQuestions: ReadonlyArray<string> =
    maybeHeldRow?.unresolvedQuestions ?? []
  const unresolvedQuestions = uniqueSortedPaths([
    ...heldUnresolvedQuestions,
    ...(runtimeDependencyHints.includes('class-variance-authority')
      ? [
          'Select the first shadcn style pack for Foldkit parity fixtures.',
          'Replace CVA variant handling with Effect Schema literals and pure class maps.',
        ]
      : ['Select the first shadcn style pack for Foldkit parity fixtures.']),
  ])
  const resolution = {
    originKind: 'shadcn',
    originName: `shadcn ${titleCaseSlug(slug)}`,
    docsUrl,
    localRepoPath,
    pinnedRef,
    resolutionStatus,
    sourcePaths,
    docsPaths,
    demoPaths,
    testPaths:
      slug === 'button'
        ? existingPaths([
            'repos/ui/packages/tests/src/tests/add.test.ts',
            'repos/ui/packages/tests/src/tests/view.test.ts',
          ])
        : [],
    specPaths: [],
    apiReferencePaths: docsPaths,
    styleVariantPaths: shadcnStyleVariantPaths(slug),
    publicRegistryPaths: maybeHeldRow?.publicRegistryPaths ?? [],
    registryDependencyHints: uniqueSortedPaths([
      ...registryDependencyHints,
      ...(maybeHeldRow?.registryDependencyHints ?? []),
    ]),
    runtimeDependencyHints,
    blockers,
    confidence: 'medium',
    unresolvedQuestions,
  }

  return S.decodeUnknownSync(OriginResolution)(resolution)
}

export const resolveOriginUrl = (docsUrl: string) => {
  if (docsUrl.startsWith('https://base-ui.com/react/components/')) {
    const maybeSlug = parseBaseUiComponentSlug(docsUrl)

    if (maybeSlug !== undefined) {
      return baseUiResolution(docsUrl, maybeSlug)
    }
  }

  if (
    docsUrl.startsWith('https://ui.shadcn.com/docs/components/') ||
    docsUrl.includes('.json')
  ) {
    const maybeSlug = parseShadcnComponentSlug(docsUrl)

    if (maybeSlug !== undefined) {
      return shadcnResolution(docsUrl, maybeSlug)
    }
  }

  throw new Error(`Unsupported origin URL: ${docsUrl}`)
}

const expandInventoryPath = (inventoryPath: string): ReadonlyArray<string> => {
  if (!existsSync(inventoryPath)) {
    throw new Error(`Inventory path is missing: ${inventoryPath}`)
  }

  const stat = statSync(inventoryPath)

  if (stat.isFile()) {
    return [normalizePath(inventoryPath)]
  }

  return readdirSync(inventoryPath, { withFileTypes: true }).flatMap(entry =>
    expandInventoryPath(pathModule.join(inventoryPath, entry.name)),
  )
}

export const inventoryOrigin = (
  localRepoPath: string,
  paths: ReadonlyArray<string>,
) => {
  const pinnedRef = ensurePinnedRepo(localRepoPath)
  const inventoryPaths = (paths.length > 0 ? paths : [localRepoPath])
    .flatMap(expandInventoryPath)
    .toSorted((left, right) => left.localeCompare(right))
  const hash = inventoryPaths.reduce((currentHash, inventoryPath) => {
    currentHash.update(inventoryPath)
    currentHash.update('\0')
    currentHash.update(readFileSync(inventoryPath))
    currentHash.update('\0')

    return currentHash
  }, createHash('sha256'))

  return {
    localRepoPath,
    pinnedRef,
    inventoryHash: hash.digest('hex'),
    files: inventoryPaths,
  }
}
