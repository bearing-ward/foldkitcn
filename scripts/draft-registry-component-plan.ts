import { classifyDependency } from '../src/registry/validation'
import { resolveOriginUrl } from './origin-common'

import { mkdirSync, writeFileSync } from 'node:fs'
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

  mkdirSync(outputDir, { recursive: true })
  writeFileSync(
    pathModule.join(outputDir, 'dossier.json'),
    `${JSON.stringify(dossier, null, 2)}\n`,
  )
  writeFileSync(
    pathModule.join(outputDir, 'plan-preview.md'),
    renderPlanPreview(resolutions, registryItems, dependencies, tests),
  )

  console.log(`Wrote registry component dossier preview to ${outputDir}`)
}

main()
