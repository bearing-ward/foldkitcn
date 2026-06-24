import { classifyDependency } from '../src/registry/validation'
import { resolveOriginUrl } from './origin-common'

import { mkdirSync, writeFileSync } from 'node:fs'
import pathModule from 'node:path'

const defaultUrls = [
  'https://base-ui.com/react/components/button',
  'https://ui.shadcn.com/docs/components/button',
]

const parseArgs = (args: ReadonlyArray<string>) => {
  const outputIndex = args.indexOf('--output')
  const outputDir = outputIndex === -1 ? undefined : args.at(outputIndex + 1)
  const urls = args.filter((arg, index) => {
    if (arg === '--output') {
      return false
    }

    if (outputIndex === -1 || index !== outputIndex + 1) {
      return arg.startsWith('https://')
    }

    if (index === outputIndex + 1) {
      return false
    }

    return false
  })

  return {
    outputDir: outputDir ?? 'plans/artifacts/001-button-dossier-preview',
    urls: urls.length > 0 ? urls : defaultUrls,
  }
}

const dependencyClassification = [
  {
    specifier: 'base-ui/button',
    classification: classifyDependency('base-ui/button'),
    target: 'base-ui/button',
    reason: 'shadcn/button composes the local Base UI Button primitive.',
  },
  {
    specifier: 'utils/cn',
    classification: classifyDependency('utils/cn'),
    target: 'utils/cn',
    reason:
      'shadcn/button uses local class canonicalization and Tailwind conflict handling.',
  },
  {
    specifier: 'class-variance-authority',
    classification: classifyDependency('class-variance-authority'),
    target: '',
    reason:
      'Replace CVA with Effect Schema literals and pure variant class maps.',
  },
]

const originTestClassification = [
  {
    path: 'repos/base-ui/packages/react/src/button/Button.test.tsx',
    classification: 'port-semantically',
    reason:
      'Foldkit update/view tests should preserve disabled, focus, and click facts without React event internals.',
  },
  {
    path: 'repos/base-ui/packages/react/src/button/Button.spec.tsx',
    classification: 'covered-by-parity',
    reason: 'DOM attributes and browser behavior belong in parity fixtures.',
  },
  {
    path: 'repos/ui/packages/tests/src/tests/add.test.ts',
    classification: 'not-applicable',
    reason:
      'shadcn CLI installation behavior is replaced by this registry workflow.',
  },
]

const renderPlanPreview = (
  resolutions: ReadonlyArray<ReturnType<typeof resolveOriginUrl>>,
): string => `# Button Dossier Preview

## Batch

- \`base-ui/button\`
- \`shadcn/button\`

This is a dependency-complete proving batch. It does not implement Button. It prepares the future improve plan for the local Foldkit registry.

## Origin Evidence

${resolutions
  .map(
    resolution => `### ${resolution.originName}

- Origin kind: \`${resolution.originKind}\`
- Docs URL: ${resolution.docsUrl}
- Local repo: \`${resolution.localRepoPath}\`
- Pinned ref: \`${resolution.pinnedRef}\`
- Source paths: ${resolution.sourcePaths.map(sourcePath => `\`${sourcePath}\``).join(', ')}
- Docs paths: ${resolution.docsPaths.map(docsPath => `\`${docsPath}\``).join(', ')}
- Demo paths: ${resolution.demoPaths.map(demoPath => `\`${demoPath}\``).join(', ')}
- Test/spec paths: ${[...resolution.testPaths, ...resolution.specPaths]
      .map(testPath => `\`${testPath}\``)
      .join(', ')}
- Runtime hints: ${resolution.runtimeDependencyHints
      .map(hint => `\`${hint}\``)
      .join(', ')}
- Registry hints: ${resolution.registryDependencyHints
      .map(hint => `\`${hint}\``)
      .join(', ')}
- Confidence: \`${resolution.confidence}\`
`,
  )
  .join('\n')}

## Foldkit Mapping

- Preserve Base UI Button behavior as a Foldkit-native primitive with \`Model\`, \`Message\`, \`init\`, \`update\`, and \`view\` only if state is required; otherwise keep the Button surface as a stateless render helper.
- Map origin \`render\` and shadcn \`asChild\` support to Foldkit \`toView\` or named part-renderer composition.
- Preserve \`focusableWhenDisabled\`, \`data-disabled\`, keyboard behavior, and disabled click suppression.
- Use \`cn\` from \`utils/cn\` for class composition.
- Represent shadcn variants with Effect Schema literals and pure class maps.
- Record consumed theme tokens before marking \`shadcn/button\` installable.

## Dependencies

${dependencyClassification
  .map(
    dependency =>
      `- \`${dependency.specifier}\`: \`${dependency.classification}\` -> \`${dependency.target || 'defer'}\` (${dependency.reason})`,
  )
  .join('\n')}

## Origin Test Classification

${originTestClassification
  .map(
    test => `- \`${test.path}\`: \`${test.classification}\` (${test.reason})`,
  )
  .join('\n')}

## Future Improve Plan Shape

1. Create \`base-ui/button\` as the unstyled primitive dossier and implementation slice.
2. Add semantic Story/Scene tests for Button messages, disabled state, and focus behavior.
3. Add local origin and Foldkit parity fixtures for \`base-ui/button\`.
4. Create \`shadcn/button\` as a styled wrapper depending on \`base-ui/button\` and \`utils/cn\`.
5. Add theme token coverage and class canonicalization parity for \`shadcn/button\`.
6. Run \`bun run registry:check\`, \`bun run parity:check -- --grep button --dry-run\`, \`bun run test\`, \`bun run typecheck\`, \`bun run check\`, and \`bun run build\`.
`

const main = () => {
  const { outputDir, urls } = parseArgs(process.argv.slice(2))
  const resolutions = urls.map(resolveOriginUrl)
  const dossier = {
    batch: ['base-ui/button', 'shadcn/button'],
    generatedKind: 'preview',
    createsRegistryItemFolders: false,
    resolutions,
    dependencyClassification,
    originTestClassification,
  }

  mkdirSync(outputDir, { recursive: true })
  writeFileSync(
    pathModule.join(outputDir, 'dossier.json'),
    `${JSON.stringify(dossier, null, 2)}\n`,
  )
  writeFileSync(
    pathModule.join(outputDir, 'plan-preview.md'),
    renderPlanPreview(resolutions),
  )

  console.log(`Wrote Button dossier preview to ${outputDir}`)
}

main()
