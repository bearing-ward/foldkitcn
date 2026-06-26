import { html } from 'foldkit/html'

import * as Dialog from '../../../../../src/registry/base-ui/dialog'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotHtml } from '../render'

const enabledKeyboard = {
  click: 'activates',
  Enter: 'native-activates',
  Space: 'native-activates',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const suppressedKeyboard = {
  click: 'suppressed',
  Enter: 'suppressed',
  Space: 'suppressed',
  mousedown: 'suppressed',
  pointerdown: 'suppressed',
}

const snapshot = (
  build: (
    h: ReturnType<typeof html<never>>,
  ) => ReturnType<typeof Dialog.view<never>>,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = enabledKeyboard,
): FixtureSnapshot => {
  const h = html<never>()

  return snapshotHtml(build(h), keyboardBehavior)
}

const dialogRoot = (config: Omit<Dialog.ViewConfig<never>, 'id' | 'toView'>) =>
  Dialog.view<never>({
    id: 'settings-dialog',
    titleId: 'settings-title',
    descriptionId: 'settings-description',
    ...config,
    toView: attributes => {
      const h = html<never>()

      return h.div(
        [...attributes.root],
        [
          h.button([...attributes.trigger], ['Open settings']),
          h.dialog(
            [...attributes.dialog],
            attributes.isMounted
              ? [
                  h.div([...attributes.backdrop.root], []),
                  h.div(
                    [...attributes.popup.root],
                    [
                      h.h2([...attributes.title], ['Settings']),
                      h.p([...attributes.description], ['Manage settings.']),
                      h.button([...attributes.close], ['Close']),
                    ],
                  ),
                ]
              : [],
          ),
        ],
      )
    },
  })

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'dialog-open',
    snapshot: snapshot(() => dialogRoot({ open: true })),
  },
  {
    id: 'dialog-closed',
    snapshot: snapshot(() => dialogRoot({ open: false })),
  },
  {
    id: 'dialog-non-modal',
    snapshot: snapshot(() => dialogRoot({ open: true, modal: false })),
  },
  {
    id: 'dialog-disabled',
    snapshot: snapshot(
      () => dialogRoot({ open: false, isDisabled: true, forceMount: true }),
      suppressedKeyboard,
    ),
  },
]
