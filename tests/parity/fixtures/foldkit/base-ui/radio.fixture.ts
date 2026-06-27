import { html } from 'foldkit/html'

import * as Radio from '../../../../../src/registry/base-ui/radio'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { suppressedKeyboard } from '../../../fixture'
import { snapshotHtml } from '../render'

const baseKeyboard = {
  click: 'activates',
  Enter: 'suppressed',
  Space: 'activates',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const snapshot = (
  build: (
    h: ReturnType<typeof html<never>>,
  ) => ReturnType<typeof Radio.view<never>>,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = baseKeyboard,
): FixtureSnapshot => {
  const h = html<never>()

  return snapshotHtml(build(h), keyboardBehavior)
}

const radioRoot = (
  h: ReturnType<typeof html<never>>,
  config: Omit<Radio.ViewConfig<never>, 'toView'>,
) =>
  Radio.view<never>({
    ...config,
    toView: attributes =>
      h.span(
        [...attributes.root],
        [
          ...(attributes.indicator.length > 0
            ? [h.span([...attributes.indicator], [])]
            : []),
          h.input([...attributes.input]),
        ],
      ),
  })

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'unchecked',
    snapshot: snapshot(h =>
      radioRoot(h, {
        checkedState: 'unchecked',
      }),
    ),
  },
  {
    id: 'checked-with-indicator',
    snapshot: snapshot(
      h =>
        radioRoot(h, {
          checkedState: 'checked',
        }),
      suppressedKeyboard,
    ),
  },
  {
    id: 'disabled-readonly-required',
    snapshot: snapshot(
      h =>
        radioRoot(h, {
          checkedState: 'checked',
          isDisabled: true,
          isReadOnly: true,
          isRequired: true,
        }),
      suppressedKeyboard,
    ),
  },
]
