import {
  ToggleGroupDemo,
  ToggleGroupDisabled,
  ToggleGroupFontWeightSelector,
  ToggleGroupOutline,
  ToggleGroupRtl,
  ToggleGroupSizes,
  ToggleGroupSpacing,
  ToggleGroupVertical,
} from '../../../../../src/registry/shadcn/toggle-group/examples'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotHtml } from '../render'

const baseKeyboard = {
  click: 'activates',
  Enter: 'activates',
  Space: 'activates',
  ArrowRight: 'focuses',
  ArrowLeft: 'focuses',
  Home: 'focuses',
  End: 'focuses',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const verticalKeyboard = {
  click: 'activates',
  Enter: 'activates',
  Space: 'activates',
  ArrowDown: 'focuses',
  ArrowUp: 'focuses',
  Home: 'focuses',
  End: 'focuses',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const snapshot = (
  html: ReturnType<typeof ToggleGroupDemo>,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = baseKeyboard,
): FixtureSnapshot => ({
  ...snapshotHtml(html, keyboardBehavior),
  keyboardBehavior,
})

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'toggle-group-demo',
    snapshot: snapshot(ToggleGroupDemo()),
  },
  {
    id: 'toggle-group-disabled',
    snapshot: snapshot(ToggleGroupDisabled()),
  },
  {
    id: 'toggle-group-font-weight-selector',
    snapshot: snapshot(ToggleGroupFontWeightSelector()),
  },
  {
    id: 'toggle-group-outline',
    snapshot: snapshot(ToggleGroupOutline()),
  },
  {
    id: 'toggle-group-rtl',
    snapshot: snapshot(ToggleGroupRtl()),
  },
  {
    id: 'toggle-group-sizes',
    snapshot: snapshot(ToggleGroupSizes()),
  },
  {
    id: 'toggle-group-spacing',
    snapshot: snapshot(ToggleGroupSpacing()),
  },
  {
    id: 'toggle-group-vertical',
    snapshot: snapshot(ToggleGroupVertical(), verticalKeyboard),
  },
]
