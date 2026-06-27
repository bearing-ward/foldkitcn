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
    itemId: 'base-ui/toggle',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/base-ui/toggle.fixture.ts',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/base-ui/toggle.fixture.ts',
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
    itemId: 'base-ui/toggle-group',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/base-ui/toggle-group.fixture.ts',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/base-ui/toggle-group.fixture.ts',
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
    itemId: 'base-ui/fieldset',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/base-ui/fieldset.fixture.ts',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/base-ui/fieldset.fixture.ts',
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
    itemId: 'base-ui/slider',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/base-ui/slider.fixture.ts',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/base-ui/slider.fixture.ts',
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
    itemId: 'base-ui/number-field',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/base-ui/number-field.fixture.ts',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/base-ui/number-field.fixture.ts',
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
    itemId: 'base-ui/field',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/base-ui/field.fixture.ts',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/base-ui/field.fixture.ts',
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
    itemId: 'base-ui/form',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/base-ui/form.fixture.ts',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/base-ui/form.fixture.ts',
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
    itemId: 'shadcn/toggle',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/shadcn/toggle.fixture.ts',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/shadcn/toggle.fixture.ts',
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
    itemId: 'shadcn/toggle-group',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/shadcn/toggle-group.fixture.ts',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/shadcn/toggle-group.fixture.ts',
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
    itemId: 'base-ui/checkbox',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/base-ui/checkbox.fixture.ts',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/base-ui/checkbox.fixture.ts',
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
    itemId: 'base-ui/checkbox-group',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/base-ui/checkbox-group.fixture.ts',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/base-ui/checkbox-group.fixture.ts',
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
    itemId: 'shadcn/checkbox',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/shadcn/checkbox.fixture.ts',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/shadcn/checkbox.fixture.ts',
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
    itemId: 'shadcn/label',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/shadcn/label.fixture.ts',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/shadcn/label.fixture.ts',
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
    itemId: 'shadcn/field',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/shadcn/field.fixture.ts',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/shadcn/field.fixture.ts',
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
    itemId: 'base-ui/select',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/base-ui/select.fixture.ts',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/base-ui/select.fixture.ts',
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
    itemId: 'shadcn/select',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/shadcn/select.fixture.ts',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/shadcn/select.fixture.ts',
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
    itemId: 'shadcn/slider',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/shadcn/slider.fixture.ts',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/shadcn/slider.fixture.ts',
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
    itemId: 'base-ui/switch',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/base-ui/switch.fixture.tsx',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/base-ui/switch.fixture.ts',
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
    itemId: 'shadcn/switch',
    status: 'ready',
    originFixtureEntrypoint: 'tests/parity/fixtures/origin/shadcn/entry.tsx',
    foldkitFixtureEntrypoint: 'tests/parity/fixtures/foldkit/shadcn/entry.ts',
    comparisons: ['class-tokens', 'attributes', 'dom-structure', 'colors'],
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
  {
    itemId: 'shadcn/textarea',
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
    itemId: 'base-ui/dialog',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/base-ui/dialog.fixture.ts',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/base-ui/dialog.fixture.ts',
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
    itemId: 'shadcn/dialog',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/shadcn/dialog.fixture.ts',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/shadcn/dialog.fixture.ts',
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
    itemId: 'base-ui/popover',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/base-ui/popover.fixture.ts',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/base-ui/popover.fixture.ts',
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
    itemId: 'base-ui/tooltip',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/base-ui/tooltip.fixture.ts',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/base-ui/tooltip.fixture.ts',
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
    itemId: 'shadcn/popover',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/shadcn/popover.fixture.ts',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/shadcn/popover.fixture.ts',
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
    itemId: 'shadcn/tooltip',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/shadcn/tooltip.fixture.ts',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/shadcn/tooltip.fixture.ts',
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
    itemId: 'base-ui/radio-group',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/base-ui/radio-group.fixture.ts',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/base-ui/radio-group.fixture.ts',
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
    itemId: 'shadcn/radio-group',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/shadcn/radio-group.fixture.ts',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/shadcn/radio-group.fixture.ts',
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
    itemId: 'base-ui/tabs',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/base-ui/tabs.fixture.ts',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/base-ui/tabs.fixture.ts',
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
    itemId: 'shadcn/tabs',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/shadcn/tabs.fixture.ts',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/shadcn/tabs.fixture.ts',
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
    itemId: 'base-ui/accordion',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/base-ui/accordion.fixture.ts',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/base-ui/accordion.fixture.ts',
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
    itemId: 'shadcn/accordion',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/shadcn/accordion.fixture.ts',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/shadcn/accordion.fixture.ts',
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
    itemId: 'base-ui/collapsible',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/base-ui/collapsible.fixture.ts',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/base-ui/collapsible.fixture.ts',
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
    itemId: 'shadcn/collapsible',
    status: 'ready',
    originFixtureEntrypoint:
      'tests/parity/fixtures/origin/shadcn/collapsible.fixture.ts',
    foldkitFixtureEntrypoint:
      'tests/parity/fixtures/foldkit/shadcn/collapsible.fixture.ts',
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
]
