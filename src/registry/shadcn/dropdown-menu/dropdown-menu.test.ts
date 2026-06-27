/// <reference types="vite/client" />

import { Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import {
  DropdownMenuCheckboxes,
  DropdownMenuDemo,
  DropdownMenuDestructive,
  DropdownMenuRadioGroup,
  DropdownMenuRtl,
  DropdownMenuShortcuts,
  DropdownMenuSubmenu,
} from './examples'
import * as DropdownMenu from './index'
import type { MenuItemDescriptor, ViewConfig } from './index'

// MODEL

type Model = Record<string, never>

const initialModel: Model = {}

const menuItems: ReadonlyArray<MenuItemDescriptor> = [
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
    radioGroupValue: 'position',
    isChecked: true,
  },
  { value: 'more', label: 'More', kind: 'submenu-trigger' },
  { value: 'email', label: 'Email', parentValue: 'more' },
]

// MESSAGE

type Message = never

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]

const update = (model: Model, _message: Message): UpdateReturn => [model, []]

// VIEW

const viewMenu =
  (
    config: Omit<ViewConfig<Message>, 'id' | 'items' | 'open' | 'toView'> &
      Readonly<{ open?: boolean }>,
  ) =>
  (_model: Model): Html => {
    const h = html<Message>()

    return DropdownMenu.view<Message>({
      id: 'dropdown-menu-test',
      items: menuItems,
      open: config.open ?? true,
      highlightedValue: 'profile',
      openSubmenuValues: ['more'],
      ...config,
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
                          [
                            h.div([...attributes.popup.groupLabel], ['Menu']),
                            ...attributes.popup.items.map(itemAttributes =>
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
                              [
                                h.div(
                                  [...submenu.group],
                                  submenu.items.map(itemAttributes =>
                                    h.div(
                                      [...itemAttributes.root],
                                      [itemAttributes.item.label],
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

describe('shadcn/dropdown-menu class helpers', () => {
  test('exports Effect Schema literals for item variants', () => {
    expect(
      S.decodeUnknownSync(DropdownMenu.DropdownMenuVariant)('default'),
    ).toBe('default')
  })

  test('uses origin slot class strings for content, labels, items, and checked items', () => {
    expect(DropdownMenu.dropdownMenuPositionerClassName()).toBe(
      'isolate z-50 outline-none',
    )
    expect(DropdownMenu.dropdownMenuContentClassName()).toContain('min-w-32')
    expect(DropdownMenu.dropdownMenuLabelClassName()).toContain(
      'text-muted-foreground',
    )
    expect(DropdownMenu.dropdownMenuItemClassName()).toContain(
      'data-[variant=destructive]:text-destructive',
    )
    expect(DropdownMenu.dropdownMenuCheckedItemClassName()).toContain('pr-8')
  })

  test('uses origin slot class strings for submenus and separators', () => {
    expect(DropdownMenu.dropdownMenuSubTriggerClassName()).toContain(
      'data-popup-open:bg-accent',
    )
    expect(DropdownMenu.dropdownMenuSubContentClassName()).toContain(
      'min-w-[96px]',
    )
    expect(DropdownMenu.dropdownMenuSeparatorClassName()).toBe(
      '-mx-1 my-1 h-px bg-border',
    )
  })

  test('preserves custom classes through local cn canonicalization', () => {
    expect(
      DropdownMenu.dropdownMenuContentClassName({
        className: 'min-w-20 min-w-48 custom-content',
      }),
    ).toContain('min-w-48')
    expect(
      DropdownMenu.dropdownMenuShortcutClassName({
        className: 'custom-shortcut',
      }),
    ).toContain('custom-shortcut')
  })
})

describe('shadcn/dropdown-menu view', () => {
  test('adds shadcn slots to root, trigger, portal, content, group, label, item, checked items, submenu, separator, and indicators', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewMenu({ inset: true, variant: 'destructive' }) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="dropdown-menu"]')).toHaveAttr(
          'data-side',
          'bottom',
        ),
        Scene.expect(
          Scene.selector('[data-slot="dropdown-menu-trigger"]'),
        ).toHaveAttr('aria-haspopup', 'menu'),
        Scene.expect(
          Scene.selector('[data-slot="dropdown-menu-portal"]'),
        ).toHaveAttr('data-portal', ''),
        Scene.expect(
          Scene.selector('[data-slot="dropdown-menu-content"]'),
        ).toHaveAttr('class', DropdownMenu.dropdownMenuContentClassName()),
        Scene.expect(
          Scene.selector('[data-slot="dropdown-menu-group"]'),
        ).toHaveAttr('role', 'group'),
        Scene.expect(
          Scene.selector('[data-slot="dropdown-menu-label"]'),
        ).toHaveAttr('data-inset', 'true'),
        Scene.expect(
          Scene.selector('[data-slot="dropdown-menu-item"]'),
        ).toHaveAttr('data-variant', 'destructive'),
        Scene.expect(
          Scene.selector('[data-slot="dropdown-menu-checkbox-item"]'),
        ).toHaveAttr('data-checked', ''),
        Scene.expect(
          Scene.selector('[data-slot="dropdown-menu-radio-item"]'),
        ).toHaveAttr('aria-checked', 'true'),
        Scene.expect(
          Scene.selector('[data-slot="dropdown-menu-sub-trigger"]'),
        ).toHaveAttr('data-popup-open', ''),
        Scene.expect(
          Scene.selector('[data-slot="dropdown-menu-sub-content"]'),
        ).toHaveAttr('class', DropdownMenu.dropdownMenuSubContentClassName()),
        Scene.expect(
          Scene.selector('[data-slot="dropdown-menu-separator"]'),
        ).toHaveAttr('class', DropdownMenu.dropdownMenuSeparatorClassName()),
      )
    }).not.toThrow()
  })

  test('passes Base UI placement, disabled, closed force-mounted, and RTL attributes through', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewMenu({
            align: 'end',
            dir: 'rtl',
            forceMount: true,
            isDisabled: true,
            open: false,
            side: 'top',
            sideOffset: 8,
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="dropdown-menu"]')).toHaveAttr(
          'dir',
          'rtl',
        ),
        Scene.expect(
          Scene.selector('[data-slot="dropdown-menu-trigger"]'),
        ).toHaveAttr('data-disabled', ''),
        Scene.expect(
          Scene.selector('[data-slot="dropdown-menu-content"]'),
        ).toHaveAttr('hidden', 'true'),
        Scene.expect(
          Scene.selector('[data-slot="dropdown-menu-content"]'),
        ).toHaveAttr('data-side', 'top'),
        Scene.expect(
          Scene.selector('[data-slot="dropdown-menu-content"]'),
        ).toHaveAttr('data-side-offset', '8'),
      )
    }).not.toThrow()
  })

  test('renders all static examples without throwing', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => DropdownMenuDemo() },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="dropdown-menu"]'),
        ).toBeVisible(),
      )
      Scene.scene(
        { update, view: () => DropdownMenuCheckboxes() },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="dropdown-menu-checkbox-item"]'),
        ).toBeVisible(),
      )
      Scene.scene(
        { update, view: () => DropdownMenuRadioGroup() },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="dropdown-menu-radio-item"]'),
        ).toBeVisible(),
      )
      Scene.scene(
        { update, view: () => DropdownMenuSubmenu() },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="dropdown-menu-sub-content"]'),
        ).toBeVisible(),
      )
      Scene.scene(
        { update, view: () => DropdownMenuDestructive() },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="dropdown-menu-item"]'),
        ).toHaveAttr('data-variant', 'destructive'),
      )
      Scene.scene(
        { update, view: () => DropdownMenuRtl() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="dropdown-menu"]')).toHaveAttr(
          'dir',
          'rtl',
        ),
      )
      Scene.scene(
        { update, view: () => DropdownMenuShortcuts() },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="dropdown-menu-shortcut"]'),
        ).toBeVisible(),
      )
    }).not.toThrow()
  })
})
