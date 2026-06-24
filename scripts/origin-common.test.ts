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
})
