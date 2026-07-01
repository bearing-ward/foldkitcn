import type { Html } from 'foldkit/html'

import {
  ToastAnchored,
  ToastCustom,
  ToastCustomPosition,
  ToastDeduplicated,
  ToastPromise,
  ToastUndoAction,
  ToastVaryingHeights,
} from '../../../../../src/registry/base-ui/toast/examples'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { suppressedKeyboard } from '../../../fixture'
import { snapshotHtml } from '../render'

const snapshot = (render: () => Html): FixtureSnapshot =>
  snapshotHtml(render(), suppressedKeyboard)

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'toast-anchored-toasts',
    snapshot: snapshot(() => ToastAnchored()),
  },
  {
    id: 'toast-custom-position',
    snapshot: snapshot(() => ToastCustomPosition()),
  },
  {
    id: 'toast-undo-action',
    snapshot: snapshot(() => ToastUndoAction()),
  },
  {
    id: 'toast-promise',
    snapshot: snapshot(() => ToastPromise()),
  },
  {
    id: 'toast-custom',
    snapshot: snapshot(() => ToastCustom()),
  },
  {
    id: 'toast-deduplicated-toast',
    snapshot: snapshot(() => ToastDeduplicated()),
  },
  {
    id: 'toast-varying-heights',
    snapshot: snapshot(() => ToastVaryingHeights()),
  },
]
