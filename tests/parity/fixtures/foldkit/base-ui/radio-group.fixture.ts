import { html } from 'foldkit/html'

import * as RadioGroup from '../../../../../src/registry/base-ui/radio-group'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { suppressedKeyboard } from '../../../fixture'
import { snapshotHtml } from '../render'

const baseKeyboard = {
  click: 'activates',
  Enter: 'suppressed',
  Space: 'activates',
  ArrowDown: 'activates',
  ArrowUp: 'activates',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const snapshot = (
  build: (
    h: ReturnType<typeof html<never>>,
  ) => ReturnType<typeof RadioGroup.view<never>>,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = baseKeyboard,
): FixtureSnapshot => {
  const h = html<never>()

  return snapshotHtml(build(h), keyboardBehavior)
}

const items: ReadonlyArray<RadioGroup.RadioGroupItemDescriptor> = [
  { id: 'density-default', value: 'default' },
  { id: 'density-comfortable', value: 'comfortable' },
]

const radioGroupRoot = (
  h: ReturnType<typeof html<never>>,
  config: Omit<RadioGroup.ViewConfig<never>, 'items' | 'toView'>,
) =>
  RadioGroup.view<never>({
    items,
    ...config,
    toView: attributes =>
      h.div(
        [...attributes.root],
        attributes.items.flatMap(item => [
          h.span(
            [...item.root],
            item.indicator.length > 0 ? [h.span([...item.indicator], [])] : [],
          ),
          h.input([...item.input]),
        ]),
      ),
  })

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'unchecked-group',
    snapshot: snapshot(h => radioGroupRoot(h, {})),
  },
  {
    id: 'checked-with-indicator',
    snapshot: snapshot(h =>
      radioGroupRoot(h, {
        value: 'comfortable',
      }),
    ),
  },
  {
    id: 'disabled-readonly-required',
    snapshot: snapshot(
      h =>
        radioGroupRoot(h, {
          value: 'comfortable',
          isDisabled: true,
          isReadOnly: true,
          isRequired: true,
        }),
      suppressedKeyboard,
    ),
  },
]
