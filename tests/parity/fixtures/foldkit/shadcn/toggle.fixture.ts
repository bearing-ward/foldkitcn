import {
  ToggleDemo,
  ToggleDisabled,
  ToggleOutline,
  ToggleRtl,
  ToggleSizes,
  ToggleText,
} from '../../../../../src/registry/shadcn/toggle/examples'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { nativeEnabledKeyboard, suppressedKeyboard } from '../../../fixture'
import { snapshotHtml } from '../render'

const snapshot = (
  html: ReturnType<typeof ToggleDemo>,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'],
): FixtureSnapshot => ({
  ...snapshotHtml(html, keyboardBehavior),
  keyboardBehavior,
})

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'toggle-demo',
    snapshot: snapshot(ToggleDemo(), nativeEnabledKeyboard),
  },
  {
    id: 'toggle-disabled',
    snapshot: snapshot(ToggleDisabled(), {}),
  },
  {
    id: 'toggle-outline',
    snapshot: snapshot(ToggleOutline(), {}),
  },
  {
    id: 'toggle-rtl',
    snapshot: snapshot(ToggleRtl(), nativeEnabledKeyboard),
  },
  {
    id: 'toggle-sizes',
    snapshot: snapshot(ToggleSizes(), {}),
  },
  {
    id: 'toggle-text',
    snapshot: snapshot(ToggleText(), nativeEnabledKeyboard),
  },
  {
    id: 'toggle-disabled-button',
    snapshot: snapshot(ToggleDisabled(), suppressedKeyboard),
  },
]
