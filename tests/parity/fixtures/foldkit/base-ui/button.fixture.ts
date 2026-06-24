import { html } from 'foldkit/html'

import * as Button from '../../../../../src/registry/base-ui/button'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import {
  nativeEnabledKeyboard,
  nonNativeEnabledKeyboard,
  suppressedKeyboard,
} from '../../../fixture'
import { snapshotHtml } from '../render'

const snapshot = (
  build: (
    h: ReturnType<typeof html<never>>,
  ) => ReturnType<typeof Button.view<never>>,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'],
): FixtureSnapshot => {
  const h = html<never>()

  return {
    ...snapshotHtml(build(h), keyboardBehavior),
    keyboardBehavior,
  }
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'native-enabled',
    snapshot: snapshot(
      h =>
        Button.view<never>({
          toView: attributes => h.button([...attributes.button], ['Native']),
        }),
      nativeEnabledKeyboard,
    ),
  },
  {
    id: 'native-disabled',
    snapshot: snapshot(
      h =>
        Button.view<never>({
          isDisabled: true,
          toView: attributes => h.button([...attributes.button], ['Disabled']),
        }),
      suppressedKeyboard,
    ),
  },
  {
    id: 'native-focusable-disabled',
    snapshot: snapshot(
      h =>
        Button.view<never>({
          isDisabled: true,
          isFocusableWhenDisabled: true,
          toView: attributes =>
            h.button([...attributes.button], ['Focusable disabled']),
        }),
      suppressedKeyboard,
    ),
  },
  {
    id: 'non-native-enabled',
    snapshot: snapshot(
      h =>
        Button.view<never>({
          isNativeButton: false,
          toView: attributes => h.div([...attributes.button], ['Div button']),
        }),
      nonNativeEnabledKeyboard,
    ),
  },
  {
    id: 'non-native-disabled',
    snapshot: snapshot(
      h =>
        Button.view<never>({
          isNativeButton: false,
          isDisabled: true,
          toView: attributes =>
            h.div([...attributes.button], ['Non-native disabled']),
        }),
      suppressedKeyboard,
    ),
  },
  {
    id: 'native-submit',
    snapshot: snapshot(
      h =>
        Button.view<never>({
          type: 'submit',
          toView: attributes => h.button([...attributes.button], ['Submit']),
        }),
      nativeEnabledKeyboard,
    ),
  },
  {
    id: 'native-reset',
    snapshot: snapshot(
      h =>
        Button.view<never>({
          type: 'reset',
          toView: attributes => h.button([...attributes.button], ['Reset']),
        }),
      nativeEnabledKeyboard,
    ),
  },
]
