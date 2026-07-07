/// <reference types="vite/client" />
/// <reference types="node" />

import { Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import { ContextMenuBasic, contextMenuExampleViews } from './examples'
import * as ContextMenu from './index'
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
    radioGroupValue: 'position',
    isChecked: true,
  },
  { value: 'more-tools', label: 'More Tools', kind: 'submenu-trigger' },
  { value: 'save-page', label: 'Save Page...', parentValue: 'more-tools' },
]

// MESSAGE

type Message = never

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]

const update = (model: Model, _message: Message): UpdateReturn => [model, []]

const manifest: Manifest = JSON.parse(
  readFileSync(
    path.join(process.cwd(), 'registry-src/shadcn/context-menu/item.json'),
    'utf-8',
  ),
)

const requireExampleView = (
  views: ReadonlyMap<string, ExampleView>,
  id: string,
): ExampleView => {
  const view = views.get(id)

  if (view === undefined) {
    throw new Error(`Missing context menu example view: ${id}`)
  }

  return view
}

const staticExampleView =
  (view: ExampleView) =>
  (_model: Model): Html =>
    view()

// VIEW

const viewMenu =
  (
    config: Omit<ViewConfig<Message>, 'id' | 'items' | 'open' | 'toView'> &
      Readonly<{ open?: boolean }>,
  ) =>
  (_model: Model): Html => {
    const h = html<Message>()

    return ContextMenu.view<Message>({
      id: 'context-menu-test',
      items: menuItems,
      open: config.open ?? true,
      contextPoint: ContextMenu.contextPoint(12, 16, 112, 116, 'mouse'),
      highlightedValue: 'back',
      openSubmenuValues: ['more-tools'],
      ...config,
      toView: attributes =>
        h.div(
          [...attributes.root],
          [
            h.div([...attributes.trigger], ['Surface']),
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
                                    [ContextMenu.checkIcon([])],
                                  ),
                                  ContextMenu.chevronRightIcon(
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

describe('shadcn/context-menu class helpers', () => {
  test('exports Effect Schema literals for item variants', () => {
    expect(S.decodeUnknownSync(ContextMenu.ContextMenuVariant)('default')).toBe(
      'default',
    )
  })

  test('uses origin slot class strings for trigger, content, and labels', () => {
    expect(ContextMenu.contextMenuTriggerClassName()).toBe('select-none')
    expect(ContextMenu.contextMenuPositionerClassName()).toBe(
      'isolate z-50 outline-none',
    )
    expect(ContextMenu.contextMenuContentClassName()).toContain('min-w-36')
    expect(ContextMenu.contextMenuLabelClassName()).toContain(
      'text-muted-foreground',
    )
  })

  test('uses origin slot class strings for default and checked items', () => {
    expect(ContextMenu.contextMenuItemClassName()).toContain(
      'group/context-menu-item',
    )
    expect(ContextMenu.contextMenuCheckedItemClassName()).toContain('pr-8')
  })

  test('uses origin slot class strings for submenus, separators, and shortcuts', () => {
    const subContentClassName = ContextMenu.contextMenuSubContentClassName()

    expect(ContextMenu.contextMenuSubTriggerClassName()).toContain(
      'data-open:bg-accent',
    )
    expect(
      [
        'cn-menu-target cn-menu-translucent',
        'min-w-36',
        'ring-1 ring-foreground/10',
        'shadow-lg',
      ].every(token => subContentClassName.includes(token)),
    ).toBeTruthy()
    expect(ContextMenu.contextMenuSeparatorClassName()).toBe(
      '-mx-1 my-1 h-px bg-border',
    )
    expect(ContextMenu.contextMenuShortcutClassName()).toContain(
      'group-focus/context-menu-item',
    )
  })

  test('preserves custom classes through local cn canonicalization', () => {
    expect(
      ContextMenu.contextMenuContentClassName({
        className: 'min-w-20 min-w-48 custom-content',
      }),
    ).toContain('min-w-48')
    expect(
      ContextMenu.contextMenuShortcutClassName({
        className: 'custom-shortcut',
      }),
    ).toContain('custom-shortcut')
  })
})

describe('shadcn/context-menu view', () => {
  test('adds shadcn slots to root, trigger, portal, content, group, label, item, checked items, submenu, separator, and indicators', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewMenu({ inset: true, variant: 'destructive' }) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="context-menu"]')).toHaveAttr(
          'data-side',
          'right',
        ),
        Scene.expect(
          Scene.selector('[data-slot="context-menu-trigger"]'),
        ).toHaveAttr('aria-haspopup', 'menu'),
        Scene.expect(
          Scene.selector('[data-slot="context-menu-trigger"]'),
        ).toHaveAttr('class', ContextMenu.contextMenuTriggerClassName()),
        Scene.expect(
          Scene.selector('[data-slot="context-menu-portal"]'),
        ).toHaveAttr('data-portal', ''),
        Scene.expect(
          Scene.selector('[data-slot="context-menu-content"]'),
        ).toHaveAttr('class', ContextMenu.contextMenuContentClassName()),
        Scene.expect(
          Scene.selector('[data-slot="context-menu-group"]'),
        ).toHaveAttr('role', 'group'),
        Scene.expect(
          Scene.selector('[data-slot="context-menu-label"]'),
        ).toHaveAttr('data-inset', 'true'),
        Scene.expect(
          Scene.selector('[data-slot="context-menu-item"]'),
        ).toHaveAttr('data-variant', 'destructive'),
        Scene.expect(
          Scene.selector('[data-slot="context-menu-checkbox-item"]'),
        ).toHaveAttr('data-checked', ''),
        Scene.expect(
          Scene.selector('[data-slot="context-menu-radio-item"]'),
        ).toHaveAttr('aria-checked', 'true'),
        Scene.expect(
          Scene.selector('[data-slot="context-menu-sub-trigger"]'),
        ).toHaveAttr('data-open', ''),
        Scene.expect(
          Scene.selector('[data-slot="context-menu-sub-content"]'),
        ).toHaveAttr(
          'class',
          ContextMenu.contextMenuSubContentClassName({ className: undefined }),
        ),
        Scene.expect(
          Scene.selector('[data-slot="context-menu-separator"]'),
        ).toHaveAttr('class', ContextMenu.contextMenuSeparatorClassName()),
      )
    }).not.toThrow()
  })

  test('passes Base UI context point, placement, disabled, closed force-mounted, and RTL attributes through', () => {
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
        Scene.expect(Scene.selector('[data-slot="context-menu"]')).toHaveAttr(
          'dir',
          'rtl',
        ),
        Scene.expect(
          Scene.selector('[data-slot="context-menu-trigger"]'),
        ).toHaveAttr('data-disabled', ''),
        Scene.expect(
          Scene.selector('[data-slot="context-menu-content"]'),
        ).toHaveAttr('hidden', 'true'),
        Scene.expect(
          Scene.selector('[data-slot="context-menu-content"]'),
        ).toHaveAttr('data-side', 'top'),
        Scene.expect(
          Scene.selector('[data-slot="context-menu-content"]'),
        ).toHaveAttr('data-side-offset', '8'),
        Scene.expect(
          Scene.selector('[data-slot="context-menu-content"]'),
        ).toHaveAttr('dir', 'rtl'),
        Scene.expect(
          Scene.selector('#context-menu-test-positioner'),
        ).toHaveAttr('data-anchor-x', '12'),
      )
    }).not.toThrow()
  })

  test('uses origin context-menu placement defaults for root content and subcontent', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewMenu({}) },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="context-menu-content"]'),
        ).toHaveAttr('data-align', 'start'),
        Scene.expect(
          Scene.selector('[data-slot="context-menu-content"]'),
        ).toHaveAttr('data-align-offset', '4'),
        Scene.expect(
          Scene.selector('[data-slot="context-menu-content"]'),
        ).toHaveAttr('data-side', 'right'),
        Scene.expect(
          Scene.selector('[data-slot="context-menu-content"]'),
        ).toHaveAttr('data-side-offset', '0'),
        Scene.expect(
          Scene.selector('[data-slot="context-menu-sub-content"]'),
        ).toHaveAttr('class', ContextMenu.contextMenuSubContentClassName()),
      )
    }).not.toThrow()
  })

  test('keeps manifest examples aligned with exported examples', () => {
    expect(manifest.examples.map(example => example.id)).toStrictEqual(
      contextMenuExampleViews.map(example => example.id),
    )
    expect(manifest.examples.map(example => example.title)).toStrictEqual(
      contextMenuExampleViews.map(example => example.title),
    )
  })

  test('renders every exported registry example without throwing', () => {
    expect(() => {
      for (const example of contextMenuExampleViews) {
        Scene.scene(
          { update, view: staticExampleView(example.view) },
          Scene.with(initialModel),
          Scene.expect(
            Scene.selector('[data-slot="context-menu"]'),
          ).toBeVisible(),
        )
      }
    }).not.toThrow()
  })

  test('renders the basic and dossier examples with expected slots', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => ContextMenuBasic() },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="context-menu-item"]'),
        ).toBeVisible(),
        Scene.expect(
          Scene.selector('[data-slot="context-menu-trigger"]'),
        ).toBeVisible(),
      )

      const viewById = new Map(
        contextMenuExampleViews.map(example => [example.id, example.view]),
      )

      for (const id of [
        'shadcn/context-menu-checkboxes',
        'shadcn/context-menu-radio',
        'shadcn/context-menu-groups',
        'shadcn/context-menu-icons',
        'shadcn/context-menu-sides',
      ]) {
        Scene.scene(
          {
            update,
            view: staticExampleView(requireExampleView(viewById, id)),
          },
          Scene.with(initialModel),
          Scene.expect(
            Scene.selector('[data-slot="context-menu"]'),
          ).toBeVisible(),
        )
      }
    }).not.toThrow()
  })

  test('preserves specific example surfaces for submenu, destructive, RTL, and shortcut variants', () => {
    const viewById = new Map(
      contextMenuExampleViews.map(example => [example.id, example.view]),
    )

    expect(() => {
      for (const id of [
        'shadcn/context-menu-demo',
        'shadcn/context-menu-submenu',
      ]) {
        Scene.scene(
          {
            update,
            view: staticExampleView(requireExampleView(viewById, id)),
          },
          Scene.with(initialModel),
          Scene.expect(
            Scene.selector('[data-slot="context-menu-sub-content"]'),
          ).toBeVisible(),
        )
      }

      Scene.scene(
        {
          update,
          view: staticExampleView(
            requireExampleView(viewById, 'shadcn/context-menu-destructive'),
          ),
        },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="context-menu-item"]'),
        ).toHaveAttr('data-variant', 'destructive'),
      )
      Scene.scene(
        {
          update,
          view: staticExampleView(
            requireExampleView(viewById, 'shadcn/context-menu-rtl'),
          ),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="context-menu"]')).toHaveAttr(
          'dir',
          'rtl',
        ),
      )
      Scene.scene(
        {
          update,
          view: staticExampleView(
            requireExampleView(viewById, 'shadcn/context-menu-shortcuts'),
          ),
        },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="context-menu-shortcut"]'),
        ).toBeVisible(),
      )
    }).not.toThrow()
  })
})
