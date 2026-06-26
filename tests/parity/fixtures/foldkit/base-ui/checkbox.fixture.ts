import { html } from 'foldkit/html'

import * as Checkbox from '../../../../../src/registry/base-ui/checkbox'
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
  ) => ReturnType<typeof Checkbox.view<never>>,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = baseKeyboard,
): FixtureSnapshot => {
  const h = html<never>()

  return snapshotHtml(build(h), keyboardBehavior)
}

const checkboxRoot = (
  h: ReturnType<typeof html<never>>,
  config: Omit<Checkbox.ViewConfig<never>, 'toView'>,
) =>
  Checkbox.view<never>({
    ...config,
    toView: attributes =>
      h.span(
        [...attributes.root],
        attributes.indicator.length > 0
          ? [h.span([...attributes.indicator], [])]
          : [],
      ),
  })

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'unchecked',
    snapshot: snapshot(h =>
      checkboxRoot(h, {
        checkedState: 'unchecked',
      }),
    ),
  },
  {
    id: 'checked-with-indicator',
    snapshot: snapshot(h =>
      checkboxRoot(h, {
        checkedState: 'checked',
      }),
    ),
  },
  {
    id: 'indeterminate-with-indicator',
    snapshot: snapshot(
      h =>
        checkboxRoot(h, {
          checkedState: 'indeterminate',
        }),
      suppressedKeyboard,
    ),
  },
  {
    id: 'disabled-readonly-required',
    snapshot: snapshot(
      h =>
        checkboxRoot(h, {
          checkedState: 'checked',
          isDisabled: true,
          isReadOnly: true,
          isRequired: true,
        }),
      suppressedKeyboard,
    ),
  },
]
