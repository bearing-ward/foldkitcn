import { html } from 'foldkit/html'
import type { Html } from 'foldkit/html'

import * as Menubar from '../../../../../src/registry/base-ui/menubar'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotHtml } from '../render'

const horizontalKeyboard = {
  click: 'activates',
  Enter: 'activates',
  Space: 'activates',
  ArrowRight: 'focuses',
  ArrowLeft: 'focuses',
  ArrowDown: 'opens',
  ArrowUp: 'opens',
  Home: 'focuses',
  End: 'focuses',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const verticalKeyboard = {
  click: 'activates',
  Enter: 'activates',
  Space: 'activates',
  ArrowRight: 'opens',
  ArrowLeft: 'opens',
  ArrowDown: 'focuses',
  ArrowUp: 'focuses',
  Home: 'focuses',
  End: 'focuses',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const suppressedKeyboard = {
  click: 'suppressed',
  Enter: 'suppressed',
  Space: 'suppressed',
  ArrowRight: 'suppressed',
  ArrowLeft: 'suppressed',
  ArrowDown: 'suppressed',
  ArrowUp: 'suppressed',
  Home: 'suppressed',
  End: 'suppressed',
  mousedown: 'suppressed',
  pointerdown: 'suppressed',
}

const fileItems: ReadonlyArray<Menubar.MenuItemDescriptor> = [
  { value: 'new', label: 'New' },
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
  { value: 'export', label: 'Export', kind: 'submenu-trigger' },
  { value: 'pdf', label: 'PDF', parentValue: 'export' },
  { value: 'png', label: 'PNG', parentValue: 'export' },
]

const editItems: ReadonlyArray<Menubar.MenuItemDescriptor> = [
  { value: 'undo', label: 'Undo' },
  { value: 'redo', label: 'Redo' },
]

const snapshot = (
  view: ReturnType<typeof Menubar.view<never>>,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = horizontalKeyboard,
): FixtureSnapshot => snapshotHtml(view, keyboardBehavior)

const popupView = (
  popup: Menubar.MenuPopupAttributes<never>,
): ReadonlyArray<Html> => {
  const h = html<never>()

  if (!popup.isMounted) {
    return []
  }

  return [
    h.div([...popup.backdrop.root], []),
    h.div(
      [...popup.positioner.root],
      [
        h.div(
          [...popup.popup.root],
          [
            h.div(
              [...popup.group],
              popup.items.map(itemAttributes =>
                h.div(
                  [...itemAttributes.root],
                  [
                    h.span(
                      [...itemAttributes.label],
                      [itemAttributes.item.label],
                    ),
                    h.span([...itemAttributes.indicator], []),
                    h.span([...itemAttributes.submenuIndicator], ['>']),
                  ],
                ),
              ),
            ),
            h.div([...popup.separator], []),
          ],
        ),
      ],
    ),
  ]
}

const menubarRoot = (
  config: Omit<Menubar.ViewConfig<never>, 'id' | 'menus'> &
    Readonly<{ menus?: ReadonlyArray<Menubar.MenubarMenuDescriptor> }>,
) => {
  const { menus, ...viewConfig } = config

  return Menubar.view<never>({
    id: 'app-menubar',
    focusedMenuValue: 'file',
    menus: menus ?? [
      {
        value: 'file',
        label: 'File',
        items: fileItems,
        open: true,
        highlightedValue: 'new',
        openSubmenuValues: [],
      },
      {
        value: 'edit',
        label: 'Edit',
        items: editItems,
        open: false,
      },
    ],
    ...viewConfig,
    toMenuView: attributes => {
      const h = html<never>()

      return h.div(
        [...attributes.root],
        [
          h.button([...attributes.trigger], [attributes.menu.label]),
          h.div(
            [...attributes.portal],
            [
              ...popupView(attributes.popup),
              ...attributes.submenus.flatMap(popupView),
            ],
          ),
        ],
      )
    },
  })
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'menubar-open',
    snapshot: snapshot(menubarRoot({})),
  },
  {
    id: 'menubar-submenu-open',
    snapshot: snapshot(
      menubarRoot({
        menus: [
          {
            value: 'file',
            label: 'File',
            items: fileItems,
            open: true,
            highlightedValue: 'export',
            openSubmenuValues: ['export'],
          },
          {
            value: 'edit',
            label: 'Edit',
            items: editItems,
            open: false,
          },
        ],
      }),
    ),
  },
  {
    id: 'menubar-vertical',
    snapshot: snapshot(
      menubarRoot({ orientation: 'vertical' }),
      verticalKeyboard,
    ),
  },
  {
    id: 'menubar-disabled',
    snapshot: snapshot(menubarRoot({ isDisabled: true }), suppressedKeyboard),
  },
]
