import type { ComparisonKind } from './fixture'

export interface ParitySlot {
  readonly itemId: string
  readonly status: 'planned' | 'ready'
  readonly originFixtureEntrypoint: string
  readonly foldkitFixtureEntrypoint: string
  readonly comparisons: ReadonlyArray<ComparisonKind>
}

export const paritySlots: ReadonlyArray<ParitySlot> = [
  {
    itemId: 'base-ui/button',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/base-ui/button.fixture.tsx',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/base-ui/button.fixture.ts',
    comparisons: [
      'class-tokens',
      'attributes',
      'dom-structure',
      'computed-style',
      'colors',
      'dimensions',
      'bounding-box',
      'keyboard-behavior',
    ],
  },
  {
    itemId: 'shadcn/button',
    status: 'ready',
    originFixtureEntrypoint: 'tests/parity/fixtures/origin/shadcn/entry.tsx',
    foldkitFixtureEntrypoint: 'tests/parity/fixtures/foldkit/shadcn/entry.ts',
    comparisons: [
      'class-tokens',
      'attributes',
      'dom-structure',
      'computed-style',
      'colors',
      'dimensions',
      'bounding-box',
    ],
  },
]
