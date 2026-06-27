/// <reference types="vite/client" />
/// <reference types="node" />

import { Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import { DropdownMenuBasic, dropdownMenuExampleViews } from './examples'
import * as DropdownMenu from './index'
import type { MenuItemDescriptor, ViewConfig } from './index'

import { readFileSync } from 'node:fs'
import path from 'node:path'

type Manifest = Readonly<{
  examples: ReadonlyArray<
    Readonly<{
      id: string
      title: string
    }>
  >
}>

type ExampleView = () => Html

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

const manifest: Manifest = JSON.parse(
  readFileSync(
    path.join(process.cwd(), 'registry-src/shadcn/dropdown-menu/item.json'),
    'utf-8',
  ),
)

const requireExampleView = (
  views: ReadonlyMap<string, ExampleView>,
  id: string,
): ExampleView => {
  const view = views.get(id)

  if (view === undefined) {
    throw new Error(`Missing dropdown menu example view: ${id}`)
  }

  return view
}

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

  test('keeps manifest examples aligned with exported examples', () => {
    expect(manifest.examples.map(example => example.id)).toStrictEqual(
      dropdownMenuExampleViews.map(example => example.id),
    )
    expect(manifest.examples.map(example => example.title)).toStrictEqual(
      dropdownMenuExampleViews.map(example => example.title),
    )
  })

  test('renders every exported registry example without throwing', () => {
    expect(() => {
      for (const example of dropdownMenuExampleViews) {
        Scene.scene(
          { update, view: example.view },
          Scene.with(initialModel),
          Scene.expect(
            Scene.selector('[data-slot="dropdown-menu"]'),
          ).toBeVisible(),
        )
      }
    }).not.toThrow()
  })

  test('renders the basic and newly covered dossier examples with expected slots', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => DropdownMenuBasic() },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="dropdown-menu-item"]'),
        ).toBeVisible(),
        Scene.expect(
          Scene.selector('[data-slot="dropdown-menu-separator"]'),
        ).toBeVisible(),
      )

      const newlyCoveredExampleIds = new Set([
        'shadcn/dropdown-menu-avatar',
        'shadcn/dropdown-menu-checkboxes-icons',
        'shadcn/dropdown-menu-complex',
        'shadcn/dropdown-menu-icons',
        'shadcn/dropdown-menu-radio-icons',
      ])

      for (const example of dropdownMenuExampleViews.filter(candidate =>
        newlyCoveredExampleIds.has(candidate.id),
      )) {
        Scene.scene(
          { update, view: example.view },
          Scene.with(initialModel),
          Scene.expect(
            Scene.selector('[data-slot="dropdown-menu"]'),
          ).toBeVisible(),
        )
      }
    }).not.toThrow()
  })

  test('preserves specific example surfaces for submenu, destructive, RTL, and shortcut variants', () => {
    const viewById = new Map(
      dropdownMenuExampleViews.map(example => [example.id, example.view]),
    )

    expect(() => {
      for (const id of [
        'shadcn/dropdown-menu-submenu',
        'shadcn/dropdown-menu-complex',
      ]) {
        Scene.scene(
          { update, view: requireExampleView(viewById, id) },
          Scene.with(initialModel),
          Scene.expect(
            Scene.selector('[data-slot="dropdown-menu-sub-content"]'),
          ).toBeVisible(),
        )
      }

      Scene.scene(
        {
          update,
          view: requireExampleView(
            viewById,
            'shadcn/dropdown-menu-destructive',
          ),
        },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="dropdown-menu-item"]'),
        ).toHaveAttr('data-variant', 'destructive'),
      )
      Scene.scene(
        {
          update,
          view: requireExampleView(viewById, 'shadcn/dropdown-menu-rtl'),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="dropdown-menu"]')).toHaveAttr(
          'dir',
          'rtl',
        ),
      )
      Scene.scene(
        {
          update,
          view: requireExampleView(viewById, 'shadcn/dropdown-menu-shortcuts'),
        },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="dropdown-menu-shortcut"]'),
        ).toBeVisible(),
      )
    }).not.toThrow()
  })
})
