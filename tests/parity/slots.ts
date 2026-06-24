export interface ParitySlot {
  readonly itemId: string
  readonly status: 'planned' | 'ready'
  readonly originFixtureEntrypoint: string
  readonly foldkitFixtureEntrypoint: string
  readonly comparisons: ReadonlyArray<string>
}

export const paritySlots: ReadonlyArray<ParitySlot> = [
  {
    itemId: 'base-ui/button',
    status: 'planned',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/base-ui/button.entry.tsx',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/base-ui/button.entry.ts',
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
    status: 'planned',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/shadcn/button.entry.tsx',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/shadcn/button.entry.ts',
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
