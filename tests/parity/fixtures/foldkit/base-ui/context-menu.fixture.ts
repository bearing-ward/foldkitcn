import { html } from 'foldkit/html'

import * as ContextMenu from '../../../../../src/registry/base-ui/context-menu'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotHtml } from '../render'

const enabledKeyboard = {
  click: 'suppressed',
  ContextMenu: 'opens',
  ShiftF10: 'opens',
  contextmenu: 'opens-at-context-point',
  pointerdown: 'tracks-context-point',
  pointerup: 'mac-activates-after-move',
}

const suppressedKeyboard = {
  click: 'suppressed',
  ContextMenu: 'suppressed',
  ShiftF10: 'suppressed',
  contextmenu: 'passes-through',
  pointerdown: 'suppressed',
  pointerup: 'suppressed',
}

const menuItems: ReadonlyArray<ContextMenu.MenuItemDescriptor> = [
  { value: 'back', label: 'Back' },
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
  { value: 'more-tools', label: 'More Tools', kind: 'submenu-trigger' },
  { value: 'save-page', label: 'Save Page...', parentValue: 'more-tools' },
  {
    value: 'developer-tools',
    label: 'Developer Tools',
    parentValue: 'more-tools',
  },
  { value: 'forward', label: 'Forward', isDisabled: true },
]

const snapshot = (
  view: ReturnType<typeof ContextMenu.view<never>>,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = enabledKeyboard,
): FixtureSnapshot => snapshotHtml(view, keyboardBehavior)

const contextMenuRoot = (
  config: Omit<ContextMenu.ViewConfig<never>, 'id' | 'items' | 'toView'>,
) =>
  ContextMenu.view<never>({
    id: 'browser-context-menu',
    items: menuItems,
    contextPoint: ContextMenu.contextPoint(24, 32, 124, 132, 'mouse'),
    ...config,
    toView: attributes => {
      const h = html<never>()

      return h.div(
        [...attributes.root],
        [
          h.div([...attributes.trigger], ['Surface']),
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
                      h.div(
                        [...submenu.positioner.root],
                        [
                          h.div(
                            [...submenu.popup.root],
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
    id: 'context-menu-open',
    snapshot: snapshot(
      contextMenuRoot({
        open: true,
        highlightedValue: 'back',
        side: 'right',
        align: 'start',
        alignOffset: 4,
      }),
    ),
  },
  {
    id: 'context-menu-submenu-open',
    snapshot: snapshot(
      contextMenuRoot({
        open: true,
        highlightedValue: 'more-tools',
        openSubmenuValues: ['more-tools'],
      }),
    ),
  },
  {
    id: 'context-menu-checked-radio',
    snapshot: snapshot(
      contextMenuRoot({
        open: true,
        highlightedValue: 'status-bar',
      }),
    ),
  },
  {
    id: 'context-menu-force-mounted',
    snapshot: snapshot(contextMenuRoot({ open: false, forceMount: true })),
  },
  {
    id: 'context-menu-disabled',
    snapshot: snapshot(
      contextMenuRoot({ open: false, isDisabled: true, forceMount: true }),
      suppressedKeyboard,
    ),
  },
  {
    id: 'context-menu-non-mac',
    snapshot: snapshot(
      contextMenuRoot({
        open: true,
        platform: 'non-mac',
        highlightedValue: 'back',
      }),
      {
        ...enabledKeyboard,
        pointerup: 'ignored-on-non-mac',
      },
    ),
  },
]
