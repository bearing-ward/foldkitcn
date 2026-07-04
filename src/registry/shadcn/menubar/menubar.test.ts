/// <reference types="vite/client" />
/// <reference types="node" />

import { Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import { MenubarDemo, menubarExampleViews } from './examples'
import * as Menubar from './index'
import type { MenubarMenuDescriptor, ViewConfig } from './index'

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

const menus: ReadonlyArray<MenubarMenuDescriptor> = [
  {
    value: 'file',
    label: 'File',
    open: true,
    highlightedValue: 'new',
    openSubmenuValues: ['share'],
    items: [
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
      { value: 'share', label: 'Share', kind: 'submenu-trigger' },
      { value: 'email', label: 'Email', parentValue: 'share' },
    ],
  },
  {
    value: 'edit',
    label: 'Edit',
    open: false,
    items: [{ value: 'copy', label: 'Copy' }],
  },
]

// MESSAGE

type Message = never

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]

const update = (model: Model, _message: Message): UpdateReturn => [model, []]

const manifest: Manifest = JSON.parse(
  readFileSync(
    path.join(process.cwd(), 'registry-src/shadcn/menubar/item.json'),
    'utf-8',
  ),
)

const requireExampleView = (
  views: ReadonlyMap<string, ExampleView>,
  id: string,
): ExampleView => {
  const view = views.get(id)

  if (view === undefined) {
    throw new Error(`Missing menubar example view: ${id}`)
  }

  return view
}

const staticExampleView =
  (view: ExampleView) =>
  (_model: Model): Html =>
    view()

// VIEW

const viewMenubar =
  (config: Omit<ViewConfig<Message>, 'id' | 'menus'>) =>
  (_model: Model): Html => {
    const h = html<Message>()

    return Menubar.view<Message>({
      id: 'menubar-test',
      menus,
      focusedMenuValue: 'file',
      ...config,
      toMenuView: attributes =>
        h.div(
          [...attributes.root],
          [
            h.button([...attributes.trigger], [attributes.menu.label]),
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
                                    [Menubar.checkIcon([])],
                                  ),
                                  Menubar.chevronRightIcon(
                                    itemAttributes.submenuIndicator,
                                  ),
                                  h.span([...itemAttributes.shortcut], ['⌘N']),
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
                                  [itemAttributes.item.label],
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
        ),
    })
  }

describe('shadcn/menubar class helpers', () => {
  test('exports Effect Schema literals for item variants', () => {
    expect(S.decodeUnknownSync(Menubar.MenubarVariant)('default')).toBe(
      'default',
    )
  })

  test('uses origin slot class strings for root, trigger, content, and items', () => {
    expect(Menubar.menubarClassName()).toContain('h-8')
    expect(Menubar.menubarTriggerClassName()).toContain(
      'aria-expanded:bg-muted',
    )
    expect(Menubar.menubarContentClassName()).toContain('min-w-36')
    expect(Menubar.menubarItemClassName()).toContain('group/menubar-item')
    expect(Menubar.menubarCheckedItemClassName()).toContain('pl-7')
  })

  test('uses origin slot class strings for submenus, labels, shortcuts, and separators', () => {
    expect(Menubar.menubarSubTriggerClassName()).toContain(
      'data-open:bg-accent',
    )
    expect(Menubar.menubarSubContentClassName()).toContain('min-w-32')
    expect(Menubar.menubarLabelClassName()).toContain('text-sm')
    expect(Menubar.menubarShortcutClassName()).toContain(
      'group-focus/menubar-item',
    )
    expect(Menubar.menubarSeparatorClassName()).toBe(
      '-mx-1 my-1 h-px bg-border',
    )
  })

  test('preserves custom classes through local cn canonicalization', () => {
    expect(
      Menubar.menubarClassName({ className: 'h-10 custom-menubar' }),
    ).toContain('h-10')
    expect(
      Menubar.menubarContentClassName({
        className: 'min-w-20 min-w-48 custom-content',
      }),
    ).toContain('min-w-48')
  })
})

describe('shadcn/menubar view', () => {
  test('adds shadcn slots to root, menu, trigger, portal, content, group, item, submenu, separator, and shortcut parts', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewMenubar({ inset: true, variant: 'destructive' }) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="menubar"]')).toHaveAttr(
          'role',
          'menubar',
        ),
        Scene.expect(Scene.selector('[data-slot="menubar-menu"]')).toHaveAttr(
          'data-value',
          'file',
        ),
        Scene.expect(
          Scene.selector('[data-slot="menubar-trigger"]'),
        ).toHaveAttr('role', 'menuitem'),
        Scene.expect(Scene.selector('[data-slot="menubar-portal"]')).toHaveAttr(
          'data-portal',
          '',
        ),
        Scene.expect(
          Scene.selector('[data-slot="menubar-content"]'),
        ).toHaveAttr('class', Menubar.menubarContentClassName()),
        Scene.expect(Scene.selector('[data-slot="menubar-group"]')).toHaveAttr(
          'role',
          'group',
        ),
        Scene.expect(Scene.selector('[data-slot="menubar-label"]')).toHaveAttr(
          'data-inset',
          'true',
        ),
        Scene.expect(Scene.selector('[data-slot="menubar-item"]')).toHaveAttr(
          'data-variant',
          'destructive',
        ),
        Scene.expect(
          Scene.selector('[data-slot="menubar-checkbox-item"]'),
        ).toHaveAttr('data-checked', ''),
        Scene.expect(
          Scene.selector('[data-slot="menubar-radio-item"]'),
        ).toHaveAttr('aria-checked', 'true'),
        Scene.expect(
          Scene.selector('[data-slot="menubar-sub-trigger"]'),
        ).toHaveAttr('data-popup-open', ''),
        Scene.expect(
          Scene.selector('[data-slot="menubar-sub-content"]'),
        ).toHaveAttr('class', Menubar.menubarSubContentClassName()),
        Scene.expect(
          Scene.selector('[data-slot="menubar-separator"]'),
        ).toHaveAttr('class', Menubar.menubarSeparatorClassName()),
        Scene.expect(
          Scene.selector('[data-slot="menubar-shortcut"]'),
        ).toBeVisible(),
      )
    }).not.toThrow()
  })

  test('passes Base Menubar orientation, disabled, and RTL attributes through', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewMenubar({
            dir: 'rtl',
            orientation: 'vertical',
            isDisabled: true,
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="menubar"]')).toHaveAttr(
          'dir',
          'rtl',
        ),
        Scene.expect(Scene.selector('[data-slot="menubar"]')).toHaveAttr(
          'aria-orientation',
          'vertical',
        ),
        Scene.expect(
          Scene.selector('[data-slot="menubar-trigger"]'),
        ).toHaveAttr('data-disabled', ''),
      )
    }).not.toThrow()
  })

  test('keeps manifest examples aligned with exported examples', () => {
    expect(manifest.examples.map(example => example.id)).toStrictEqual(
      menubarExampleViews.map(example => example.id),
    )
    expect(manifest.examples.map(example => example.title)).toStrictEqual(
      menubarExampleViews.map(example => example.title),
    )
  })

  test('renders every exported registry example without throwing', () => {
    expect(() => {
      for (const example of menubarExampleViews) {
        Scene.scene(
          { update, view: staticExampleView(example.view) },
          Scene.with(initialModel),
          Scene.expect(Scene.selector('[data-slot="menubar"]')).toBeVisible(),
        )
      }
    }).not.toThrow()
  })

  test('preserves specific example surfaces for checkbox, radio, submenu, icon, RTL, and demo cases', () => {
    const viewById = new Map(
      menubarExampleViews.map(example => [example.id, example.view]),
    )

    expect(() => {
      Scene.scene(
        {
          update,
          view: staticExampleView(
            requireExampleView(viewById, 'shadcn/menubar-checkbox'),
          ),
        },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="menubar-checkbox-item"]'),
        ).toBeVisible(),
      )

      Scene.scene(
        {
          update,
          view: staticExampleView(
            requireExampleView(viewById, 'shadcn/menubar-radio'),
          ),
        },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="menubar-radio-item"]'),
        ).toBeVisible(),
      )

      Scene.scene(
        { update, view: () => MenubarDemo() },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="menubar-sub-trigger"]'),
        ).toBeVisible(),
      )

      Scene.scene(
        {
          update,
          view: staticExampleView(
            requireExampleView(viewById, 'shadcn/menubar-submenu'),
          ),
        },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="menubar-sub-content"]'),
        ).toBeVisible(),
      )

      Scene.scene(
        {
          update,
          view: staticExampleView(
            requireExampleView(viewById, 'shadcn/menubar-icons'),
          ),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-icon="file"]')).toHaveAttr(
          'data-icon',
          'file',
        ),
      )

      Scene.scene(
        {
          update,
          view: staticExampleView(
            requireExampleView(viewById, 'shadcn/menubar-rtl'),
          ),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="menubar"]')).toHaveAttr(
          'dir',
          'rtl',
        ),
      )
    }).not.toThrow()
  })
})
