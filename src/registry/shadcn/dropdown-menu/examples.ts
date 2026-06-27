import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import * as DropdownMenu from './index'
import type { MenuItemDescriptor } from './index'

const accountItems: ReadonlyArray<MenuItemDescriptor> = [
  { value: 'profile', label: 'Profile' },
  { value: 'billing', label: 'Billing' },
  { value: 'team', label: 'Team' },
  { value: 'subscription', label: 'Subscription', isDisabled: true },
]

const checkboxItems: ReadonlyArray<MenuItemDescriptor> = [
  {
    value: 'status-bar',
    label: 'Status Bar',
    kind: 'checkbox',
    isChecked: true,
  },
  { value: 'activity-bar', label: 'Activity Bar', kind: 'checkbox' },
  { value: 'panel', label: 'Panel', kind: 'checkbox' },
]

const radioItems: ReadonlyArray<MenuItemDescriptor> = [
  {
    value: 'top',
    label: 'Top',
    kind: 'radio',
    radioGroupValue: 'panel-position',
  },
  {
    value: 'bottom',
    label: 'Bottom',
    kind: 'radio',
    radioGroupValue: 'panel-position',
    isChecked: true,
  },
  {
    value: 'right',
    label: 'Right',
    kind: 'radio',
    radioGroupValue: 'panel-position',
  },
]

const submenuItems: ReadonlyArray<MenuItemDescriptor> = [
  { value: 'invite', label: 'Invite users', kind: 'submenu-trigger' },
  { value: 'email', label: 'Email', parentValue: 'invite' },
  { value: 'message', label: 'Message', parentValue: 'invite' },
  { value: 'more', label: 'More...', parentValue: 'invite' },
  { value: 'settings', label: 'Settings' },
]

const menuExample = (
  id: string,
  items: ReadonlyArray<MenuItemDescriptor>,
  options: Partial<DropdownMenu.ViewConfig<never>> = {},
): Html => {
  const h = html<never>()

  return DropdownMenu.view<never>({
    id,
    items,
    open: true,
    highlightedValue: items.find(item => item.parentValue === undefined)?.value,
    ...options,
    toView: attributes =>
      h.div(
        [...attributes.root],
        [
          h.button([...attributes.trigger], ['Open']),
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
                      h.div(
                        [...attributes.popup.group],
                        attributes.popup.items.map(itemAttributes =>
                          h.div(
                            [...itemAttributes.root],
                            [
                              h.span(
                                [...itemAttributes.label],
                                [itemAttributes.item.label],
                              ),
                              h.span(
                                [...itemAttributes.indicator],
                                [DropdownMenu.checkIcon([])],
                              ),
                              DropdownMenu.chevronRightIcon(
                                itemAttributes.submenuIndicator,
                              ),
                            ],
                          ),
                        ),
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
      ),
  })
}

export const DropdownMenuDemo = (): Html =>
  menuExample('dropdown-menu-demo', accountItems)

export const DropdownMenuCheckboxes = (): Html =>
  menuExample('dropdown-menu-checkboxes', checkboxItems)

export const DropdownMenuRadioGroup = (): Html =>
  menuExample('dropdown-menu-radio-group', radioItems)

export const DropdownMenuSubmenu = (): Html =>
  menuExample('dropdown-menu-submenu', submenuItems, {
    openSubmenuValues: ['invite'],
    highlightedValue: 'invite',
  })

export const DropdownMenuDestructive = (): Html =>
  menuExample('dropdown-menu-destructive', accountItems, {
    variant: 'destructive',
  })

export const DropdownMenuRtl = (): Html =>
  menuExample('dropdown-menu-rtl', accountItems, {
    dir: 'rtl',
  })

export const DropdownMenuShortcuts = (): Html => {
  const h = html<never>()

  return DropdownMenu.view<never>({
    id: 'dropdown-menu-shortcuts',
    items: accountItems,
    open: true,
    toView: attributes =>
      h.div(
        [...attributes.root],
        [
          h.button([...attributes.trigger], ['Open']),
          h.div(
            [...attributes.portal],
            [
              h.div(
                [...attributes.popup.positioner.root],
                [
                  h.div(
                    [...attributes.popup.popup.root],
                    [
                      h.div(
                        [...attributes.popup.group],
                        attributes.popup.items.map(itemAttributes =>
                          h.div(
                            [...itemAttributes.root],
                            [
                              h.span(
                                [...itemAttributes.label],
                                [itemAttributes.item.label],
                              ),
                              h.span([...itemAttributes.shortcut], ['⇧⌘P']),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
  })
}
