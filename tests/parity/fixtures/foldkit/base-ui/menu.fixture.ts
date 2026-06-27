import { html } from 'foldkit/html'

import * as Menu from '../../../../../src/registry/base-ui/menu'
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

const menuItems: ReadonlyArray<Menu.MenuItemDescriptor> = [
  { value: 'profile', label: 'Profile' },
  {
    value: 'status-bar',
    label: 'Status Bar',
    kind: 'checkbox',
    isChecked: true,
  },
  {
    value: 'bottom',
    label: 'Bottom',
    kind: 'radio',
    radioGroupValue: 'panel-position',
    isChecked: true,
  },
  { value: 'invite', label: 'Invite users', kind: 'submenu-trigger' },
  { value: 'email', label: 'Email', parentValue: 'invite' },
  { value: 'message', label: 'Message', parentValue: 'invite' },
  { value: 'api', label: 'API', isDisabled: true },
]

const snapshot = (
  view: ReturnType<typeof Menu.view<never>>,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = enabledKeyboard,
): FixtureSnapshot => snapshotHtml(view, keyboardBehavior)

const menuRoot = (
  config: Omit<Menu.ViewConfig<never>, 'id' | 'items' | 'toView'>,
) =>
  Menu.view<never>({
    id: 'actions-menu',
    items: menuItems,
    ...config,
    toView: attributes => {
      const h = html<never>()

      return h.div(
        [...attributes.root],
        [
          h.button([...attributes.trigger], ['Actions']),
          h.div(
            [...attributes.portal],
            [
              h.div([...attributes.popup.backdrop.root], []),
              h.div(
                [...attributes.popup.positioner.root],
                [
                  h.div(
                    [...attributes.popup.popup.root],
                    [
                      h.div([...attributes.popup.arrow.root], []),
                      h.div(
                        [...attributes.popup.group],
                        [
                          h.div([...attributes.popup.groupLabel], ['Actions']),
                          ...attributes.popup.items.map(itemAttributes =>
                            h.div(
                              [...itemAttributes.root],
                              [
                                h.span(
                                  [...itemAttributes.label],
                                  [itemAttributes.item.label],
                                ),
                                h.span([...itemAttributes.indicator], []),
                                h.span(
                                  [...itemAttributes.submenuIndicator],
                                  ['>'],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      h.div([...attributes.popup.separator], []),
                    ],
                  ),
                ],
              ),
              ...attributes.submenus.flatMap(submenu =>
                submenu.isMounted
                  ? [
                      h.div([...submenu.backdrop.root], []),
                      h.div(
                        [...submenu.positioner.root],
                        [
                          h.div(
                            [...submenu.popup.root],
                            [
                              h.div(
                                [...submenu.group],
                                submenu.items.map(itemAttributes =>
                                  h.div(
                                    [...itemAttributes.root],
                                    [
                                      h.span(
                                        [...itemAttributes.label],
                                        [itemAttributes.item.label],
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ]
                  : [],
              ),
            ],
          ),
        ],
      )
    },
  })

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'menu-open',
    snapshot: snapshot(
      menuRoot({
        open: true,
        highlightedValue: 'profile',
        side: 'top',
        align: 'end',
        sideOffset: 4,
      }),
    ),
  },
  {
    id: 'menu-submenu-open',
    snapshot: snapshot(
      menuRoot({
        open: true,
        highlightedValue: 'invite',
        openSubmenuValues: ['invite'],
      }),
    ),
  },
  {
    id: 'menu-checked-radio',
    snapshot: snapshot(
      menuRoot({
        open: true,
        highlightedValue: 'status-bar',
      }),
    ),
  },
  {
    id: 'menu-force-mounted',
    snapshot: snapshot(menuRoot({ open: false, forceMount: true })),
  },
  {
    id: 'menu-disabled',
    snapshot: snapshot(
      menuRoot({ open: false, isDisabled: true, forceMount: true }),
      suppressedKeyboard,
    ),
  },
]
