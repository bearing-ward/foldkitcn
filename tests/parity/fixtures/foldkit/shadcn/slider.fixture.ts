import {
  SliderControlled,
  SliderDemo,
  SliderDisabled,
  SliderMultiple,
  SliderRange,
  SliderRtl,
  SliderVertical,
} from '../../../../../src/registry/shadcn/slider/examples'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotStyledHtml } from '../render-style'

const keyboardBehavior = {
  click: 'activates',
  Enter: 'suppressed',
  Space: 'suppressed',
  ArrowDown: 'activates',
  ArrowLeft: 'activates',
  ArrowRight: 'activates',
  ArrowUp: 'activates',
  Home: 'activates',
  End: 'activates',
  PageDown: 'activates',
  PageUp: 'activates',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const suppressedKeyboard = {
  click: 'suppressed',
  Enter: 'suppressed',
  Space: 'suppressed',
  ArrowDown: 'suppressed',
  ArrowLeft: 'suppressed',
  ArrowRight: 'suppressed',
  ArrowUp: 'suppressed',
  Home: 'suppressed',
  End: 'suppressed',
  PageDown: 'suppressed',
  PageUp: 'suppressed',
  mousedown: 'suppressed',
  pointerdown: 'suppressed',
}

const caseConfigs: ReadonlyArray<{
  readonly id: string
  readonly view: () => ReturnType<typeof SliderDemo>
  readonly keyboard: FixtureSnapshot['keyboardBehavior']
}> = [
  {
    id: 'slider-controlled',
    view: SliderControlled,
    keyboard: keyboardBehavior,
  },
  {
    id: 'slider-demo',
    view: SliderDemo,
    keyboard: keyboardBehavior,
  },
  {
    id: 'slider-disabled',
    view: SliderDisabled,
    keyboard: suppressedKeyboard,
  },
  {
    id: 'slider-multiple',
    view: SliderMultiple,
    keyboard: keyboardBehavior,
  },
  {
    id: 'slider-range',
    view: SliderRange,
    keyboard: keyboardBehavior,
  },
  {
    id: 'slider-rtl',
    view: SliderRtl,
    keyboard: keyboardBehavior,
  },
  {
    id: 'slider-vertical',
    view: SliderVertical,
    keyboard: keyboardBehavior,
  },
]

export const cases: ReadonlyArray<FixtureCase> = caseConfigs.map(config => ({
  id: config.id,
  snapshot: snapshotStyledHtml(config.view(), config.keyboard),
}))
