import { html } from 'foldkit/html'

import * as Popover from '../../../../../src/registry/base-ui/popover'
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
  ) => ReturnType<typeof Popover.view<never>>,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = enabledKeyboard,
): FixtureSnapshot => {
  const h = html<never>()

  return snapshotHtml(build(h), keyboardBehavior)
}

const popoverRoot = (
  config: Omit<Popover.ViewConfig<never>, 'id' | 'toView'>,
) =>
  Popover.view<never>({
    id: 'settings-popover',
    titleId: 'settings-title',
    descriptionId: 'settings-description',
    ...config,
    toView: attributes => {
      const h = html<never>()

      return h.div(
        [...attributes.root],
        [
          h.button([...attributes.trigger], ['Open settings']),
          h.div(
            [...attributes.portal],
            attributes.isMounted
              ? [
                  h.div([...attributes.backdrop.root], []),
                  h.div(
                    [...attributes.positioner.root],
                    [
                      h.div(
                        [...attributes.popup.root],
                        [
                          h.div([...attributes.arrow.root], []),
                          h.h2([...attributes.title], ['Settings']),
                          h.p(
                            [...attributes.description],
                            ['Manage settings.'],
                          ),
                          h.button([...attributes.close], ['Close']),
                        ],
                      ),
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
    id: 'popover-open',
    snapshot: snapshot(() =>
      popoverRoot({ open: true, side: 'top', align: 'end', sideOffset: 4 }),
    ),
  },
  {
    id: 'popover-closed',
    snapshot: snapshot(() => popoverRoot({ open: false })),
  },
  {
    id: 'popover-force-mounted',
    snapshot: snapshot(() =>
      popoverRoot({ open: false, forceMount: true, alignOffset: 2 }),
    ),
  },
  {
    id: 'popover-disabled',
    snapshot: snapshot(
      () => popoverRoot({ open: false, isDisabled: true, forceMount: true }),
      suppressedKeyboard,
    ),
  },
]
