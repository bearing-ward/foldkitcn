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
    itemId: 'shadcn/aspect-ratio',
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
    itemId: 'base-ui/avatar',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/base-ui/avatar.fixture.tsx',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/base-ui/avatar.fixture.ts',
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
    itemId: 'base-ui/meter',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/base-ui/meter.fixture.tsx',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/base-ui/meter.fixture.ts',
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
    itemId: 'shadcn/alert',
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
    itemId: 'shadcn/avatar',
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
    itemId: 'base-ui/input',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/base-ui/input.fixture.tsx',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/base-ui/input.fixture.ts',
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
    itemId: 'shadcn/input',
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
    itemId: 'shadcn/native-select',
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
