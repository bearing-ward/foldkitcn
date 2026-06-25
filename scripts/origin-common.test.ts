import { describe, expect, test } from 'vitest'

import { resolveOriginUrl } from './origin-common'

describe(resolveOriginUrl, () => {
  test('resolves Base UI Button metadata from the pinned local repo', () => {
    const resolution = resolveOriginUrl(
      'https://base-ui.com/react/components/button',
    )

    expect(resolution.originKind).toBe('base-ui')
    expect(resolution.originName).toBe('Base UI Button')
    expect(resolution.localRepoPath).toBe('repos/base-ui')
    expect(resolution.pinnedRef).toMatch(/^[0-9a-f]{40}$/u)
  })

  test('resolves Base UI Button evidence paths from the pinned local repo', () => {
    const resolution = resolveOriginUrl(
      'https://base-ui.com/react/components/button',
    )

    expect(resolution.sourcePaths).toContain(
      'repos/base-ui/packages/react/src/button/Button.tsx',
    )
    expect(resolution.docsPaths).toContain(
      'repos/base-ui/docs/src/app/(docs)/react/components/button/page.mdx',
    )
    expect(resolution.testPaths).toContain(
      'repos/base-ui/packages/react/src/button/Button.test.tsx',
    )
  })

  test('resolves generic Base UI component evidence paths', () => {
    const resolution = resolveOriginUrl(
      'https://base-ui.com/react/components/progress',
    )

    expect(resolution.originKind).toBe('base-ui')
    expect(resolution.sourcePaths).toContain(
      'repos/base-ui/packages/react/src/progress/root/ProgressRoot.tsx',
    )
    expect(resolution.docsPaths).toContain(
      'repos/base-ui/docs/src/app/(docs)/react/components/progress/page.mdx',
    )
    expect(resolution.demoPaths).toContain(
      'repos/base-ui/docs/src/app/(docs)/react/components/progress/demos/hero/tailwind/index.tsx',
    )
    expect(resolution.testPaths).toContain(
      'repos/base-ui/packages/react/src/progress/root/ProgressRoot.test.tsx',
    )
  })

  test('resolves generic shadcn component metadata', () => {
    const resolution = resolveOriginUrl(
      'https://ui.shadcn.com/docs/components/separator',
    )

    expect(resolution.originKind).toBe('shadcn')
    expect(resolution.originName).toBe('shadcn Separator')
    expect(resolution.resolutionStatus).toBe('source-backed')
  })

  test('resolves generic shadcn component evidence paths', () => {
    const resolution = resolveOriginUrl(
      'https://ui.shadcn.com/docs/components/separator',
    )

    expect(resolution.sourcePaths).toContain(
      'repos/ui/apps/v4/styles/base-nova/ui/separator.tsx',
    )
    expect(resolution.docsPaths).toContain(
      'repos/ui/apps/v4/content/docs/components/base/separator.mdx',
    )
    expect(resolution.demoPaths).toContain(
      'repos/ui/apps/v4/examples/base/separator-demo.tsx',
    )
  })

  test('resolves generic shadcn component variants and hints', () => {
    const resolution = resolveOriginUrl(
      'https://ui.shadcn.com/docs/components/separator',
    )

    expect(resolution.styleVariantPaths).toContain(
      'repos/ui/apps/v4/styles/base-nova/ui-rtl/separator.tsx',
    )
    expect(resolution.registryDependencyHints).toContain('base-ui/separator')
    expect(resolution.registryDependencyHints).toContain('utils/cn')
    expect(resolution.runtimeDependencyHints).toContain(
      '@base-ui/react/separator',
    )
  })

  test('resolves shadcn typography as docs/example-only evidence', () => {
    const resolution = resolveOriginUrl(
      'https://ui.shadcn.com/docs/components/typography',
    )

    expect(resolution.resolutionStatus).toBe('docs-example-only')
    expect(resolution.sourcePaths).toStrictEqual([])
    expect(resolution.missingPrimarySourcePath).toBe(
      'repos/ui/apps/v4/styles/base-nova/ui/typography.tsx',
    )
    expect(resolution.docsPaths).toContain(
      'repos/ui/apps/v4/content/docs/components/base/typography.mdx',
    )
    expect(resolution.demoPaths).toContain(
      'repos/ui/apps/v4/examples/base/typography-demo.tsx',
    )
  })

  test('resolves shadcn typography as non-installable planning evidence', () => {
    const resolution = resolveOriginUrl(
      'https://ui.shadcn.com/docs/components/typography',
    )

    expect(resolution.publicRegistryPaths).toContain(
      'repos/ui/apps/v4/public/r/styles/default/typography-demo.json',
    )
    expect(resolution.runtimeDependencyHints).toContain('react')
    expect(resolution.confidence).toBe('low')
    expect([
      ...resolution.blockers,
      ...resolution.unresolvedQuestions,
    ]).toContain(
      'Typography is docs/examples plus local style primitive evidence, not a single installable behavior component yet.',
    )
  })

  test('resolves shadcn data-table as docs/example-only with heavy runtime hints', () => {
    const resolution = resolveOriginUrl(
      'https://ui.shadcn.com/docs/components/data-table',
    )

    expect(resolution.resolutionStatus).toBe('docs-example-only')
    expect(resolution.sourcePaths).toStrictEqual([])
    expect(resolution.runtimeDependencyHints).toStrictEqual(
      expect.arrayContaining([
        '@dnd-kit/core',
        '@dnd-kit/sortable',
        '@tanstack/react-table',
        'recharts',
        'sonner',
      ]),
    )
    expect(resolution.blockers).toContain(
      'A local table/query/sorting/filtering/pagination foundation must replace TanStack React Table semantics.',
    )
  })

  test('keeps shadcn chart source-backed but foundation gated', () => {
    const resolution = resolveOriginUrl(
      'https://ui.shadcn.com/docs/components/chart',
    )

    expect(resolution.resolutionStatus).toBe('foundation-gated')
    expect(resolution.sourcePaths).toContain(
      'repos/ui/apps/v4/styles/base-nova/ui/chart.tsx',
    )
    expect(resolution.blockers).toContain(
      'ADR 0001 gates charts on an explicit native chart foundation.',
    )
    expect(resolution.runtimeDependencyHints).toContain('recharts')
  })

  test('fails when a non-held shadcn slug has no primary source file', () => {
    expect(() =>
      resolveOriginUrl('https://ui.shadcn.com/docs/components/not-a-held-row'),
    ).toThrow(
      'Origin evidence path is missing: repos/ui/apps/v4/styles/base-nova/ui/not-a-held-row.tsx',
    )
  })
})
