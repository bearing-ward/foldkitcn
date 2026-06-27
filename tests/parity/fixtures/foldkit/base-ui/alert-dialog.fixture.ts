import { html } from 'foldkit/html'

import * as AlertDialog from '../../../../../src/registry/base-ui/alert-dialog'
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
  ) => ReturnType<typeof AlertDialog.view<never>>,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = enabledKeyboard,
): FixtureSnapshot => {
  const h = html<never>()

  return snapshotHtml(build(h), keyboardBehavior)
}

const alertDialogRoot = (
  config: Omit<AlertDialog.ViewConfig<never>, 'id' | 'toView'>,
) =>
  AlertDialog.view<never>({
    id: 'confirm-dialog',
    titleId: 'confirm-title',
    descriptionId: 'confirm-description',
    ...config,
    toView: attributes => {
      const h = html<never>()

      return h.div(
        [...attributes.root],
        [
          h.button([...attributes.trigger], ['Delete account']),
          h.dialog(
            [...attributes.dialog],
            attributes.isMounted
              ? [
                  h.div([...attributes.backdrop.root], []),
                  h.div(
                    [...attributes.popup.root],
                    [
                      h.h2([...attributes.title], ['Are you sure?']),
                      h.p(
                        [...attributes.description],
                        ['This action cannot be undone.'],
                      ),
                      h.button([...attributes.cancel], ['Cancel']),
                      h.button([...attributes.action], ['Continue']),
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
    id: 'alert-dialog-open',
    snapshot: snapshot(() => alertDialogRoot({ open: true })),
  },
  {
    id: 'alert-dialog-closed',
    snapshot: snapshot(() => alertDialogRoot({ open: false })),
  },
  {
    id: 'alert-dialog-disabled',
    snapshot: snapshot(
      () =>
        alertDialogRoot({
          open: false,
          isDisabled: true,
          forceMount: true,
        }),
      suppressedKeyboard,
    ),
  },
]
