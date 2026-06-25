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
    itemId: 'base-ui/progress',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/base-ui/progress.fixture.tsx',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/base-ui/progress.fixture.ts',
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
  {
    itemId: 'shadcn/badge',
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
  {
    itemId: 'shadcn/kbd',
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
  {
    itemId: 'base-ui/separator',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/base-ui/separator.fixture.tsx',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/base-ui/separator.fixture.ts',
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
  {
    itemId: 'shadcn/separator',
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
  {
    itemId: 'shadcn/progress',
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
  {
    itemId: 'shadcn/skeleton',
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
