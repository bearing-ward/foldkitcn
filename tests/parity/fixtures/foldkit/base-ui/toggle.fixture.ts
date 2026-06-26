import { html } from 'foldkit/html'

import * as Toggle from '../../../../../src/registry/base-ui/toggle'
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
  ) => ReturnType<typeof Toggle.view<never>>,
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
    id: 'native-unpressed',
    snapshot: snapshot(
      h =>
        Toggle.view<never>({
          isPressed: false,
          toView: attributes => h.button([...attributes.button], ['Bookmark']),
        }),
      nativeEnabledKeyboard,
    ),
  },
  {
    id: 'native-pressed',
    snapshot: snapshot(
      h =>
        Toggle.view<never>({
          isPressed: true,
          toView: attributes => h.button([...attributes.button], ['Bookmark']),
        }),
      nativeEnabledKeyboard,
    ),
  },
  {
    id: 'native-disabled',
    snapshot: snapshot(
      h =>
        Toggle.view<never>({
          isPressed: false,
          isDisabled: true,
          toView: attributes => h.button([...attributes.button], ['Disabled']),
        }),
      suppressedKeyboard,
    ),
  },
  {
    id: 'native-disabled-pressed',
    snapshot: snapshot(
      h =>
        Toggle.view<never>({
          isPressed: true,
          isDisabled: true,
          toView: attributes => h.button([...attributes.button], ['Disabled']),
        }),
      suppressedKeyboard,
    ),
  },
  {
    id: 'non-native-unpressed',
    snapshot: snapshot(
      h =>
        Toggle.view<never>({
          isPressed: false,
          isNativeButton: false,
          toView: attributes => h.div([...attributes.button], ['Div toggle']),
        }),
      nonNativeEnabledKeyboard,
    ),
  },
  {
    id: 'non-native-disabled',
    snapshot: snapshot(
      h =>
        Toggle.view<never>({
          isPressed: false,
          isNativeButton: false,
          isDisabled: true,
          toView: attributes => h.div([...attributes.button], ['Div disabled']),
        }),
      suppressedKeyboard,
    ),
  },
]
