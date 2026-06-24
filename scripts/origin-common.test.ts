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

  test('resolves generic shadcn component metadata and evidence paths', () => {
    const resolution = resolveOriginUrl(
      'https://ui.shadcn.com/docs/components/separator',
    )

    expect(resolution.originKind).toBe('shadcn')
    expect(resolution.originName).toBe('shadcn Separator')
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
})
