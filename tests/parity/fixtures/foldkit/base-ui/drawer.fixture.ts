import { html } from 'foldkit/html'

import * as Drawer from '../../../../../src/registry/base-ui/drawer'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { nativeEnabledKeyboard, suppressedKeyboard } from '../../../fixture'
import { snapshotHtml } from '../render'

const snapshot = (
  build: (
    h: ReturnType<typeof html<never>>,
  ) => ReturnType<typeof Drawer.view<never>>,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = nativeEnabledKeyboard,
): FixtureSnapshot => {
  const h = html<never>()

  return snapshotHtml(build(h), keyboardBehavior)
}

const drawerRoot = (config: Omit<Drawer.ViewConfig<never>, 'id' | 'toView'>) =>
  Drawer.view<never>({
    id: 'activity-drawer',
    titleId: 'activity-title',
    descriptionId: 'activity-description',
    ...config,
    toView: attributes => {
      const h = html<never>()

      return h.div(
        [...attributes.root],
        [
          h.div([...attributes.indentBackground.root], []),
          h.div([...attributes.indent.root], []),
          h.button([...attributes.trigger], ['Open drawer']),
          h.dialog(
            [...attributes.dialog],
            attributes.isMounted
              ? [
                  h.div([...attributes.backdrop.root], []),
                  h.div(
                    [...attributes.popup.root],
                    [
                      h.div(
                        [...attributes.content],
                        [
                          h.h2([...attributes.title], ['Activity']),
                          h.p(
                            [...attributes.description],
                            ['Set your daily goal.'],
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
    id: 'drawer-open-bottom',
    snapshot: snapshot(() => drawerRoot({ open: true })),
  },
  {
    id: 'drawer-closed',
    snapshot: snapshot(() => drawerRoot({ open: false })),
  },
  {
    id: 'drawer-left-expanded',
    snapshot: snapshot(() =>
      drawerRoot({
        hasNestedDrawerOpen: true,
        isExpanded: true,
        open: true,
        swipeDirection: 'left',
      }),
    ),
  },
  {
    id: 'drawer-disabled',
    snapshot: snapshot(
      () =>
        drawerRoot({
          forceMount: true,
          hasActiveDrawer: true,
          isDisabled: true,
          open: false,
        }),
      suppressedKeyboard,
    ),
  },
]
