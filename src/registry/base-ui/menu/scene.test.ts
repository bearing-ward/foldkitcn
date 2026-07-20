import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as Menu from './index'
import type { MenuItemDescriptor, ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  open: S.Boolean,
  highlightedValue: S.optional(S.String),
  openSubmenuValues: S.Array(S.String),
  statusBarChecked: S.Boolean,
  panelPosition: S.String,
  lastOpenReason: Menu.MenuOpenChangeReason,
  lastHighlightReason: Menu.MenuHighlightChangeReason,
  lastFocusSelector: S.optional(S.String),
  lastPressedValue: S.optional(S.String),
})
type Model = typeof Model.Type

const initialModel: Model = {
  open: false,
  highlightedValue: undefined,
  openSubmenuValues: [],
  statusBarChecked: true,
  panelPosition: 'bottom',
  lastOpenReason: 'none',
  lastHighlightReason: 'none',
  lastFocusSelector: undefined,
  lastPressedValue: undefined,
}

const menuItems = (model: Model): ReadonlyArray<MenuItemDescriptor> => [
  { value: 'profile', label: 'Profile' },
  {
    value: 'status-bar',
    label: 'Status Bar',
    kind: 'checkbox',
    isChecked: model.statusBarChecked,
  },
  {
    value: 'top',
    label: 'Top',
    kind: 'radio',
    radioGroupValue: 'position',
    isChecked: model.panelPosition === 'top',
  },
  {
    value: 'bottom',
    label: 'Bottom',
    kind: 'radio',
    radioGroupValue: 'position',
    isChecked: model.panelPosition === 'bottom',
  },
  { value: 'more', label: 'More', kind: 'submenu-trigger' },
  {
    value: 'left',
    label: 'Left',
    kind: 'radio',
    radioGroupValue: 'position',
    isDisabled: true,
  },
  { value: 'email', label: 'Email', parentValue: 'more' },
  { value: 'message', label: 'Message', parentValue: 'more' },
  { value: 'disabled', label: 'Disabled', isDisabled: true },
]

// MESSAGE

const ChangedMenuOpen = m('ChangedMenuOpen', {
  open: S.Boolean,
  reason: Menu.MenuOpenChangeReason,
  parentValue: S.optional(S.String),
})
const ChangedMenuHighlight = m('ChangedMenuHighlight', {
  value: S.String,
  reason: Menu.MenuHighlightChangeReason,
  focusSelector: S.optional(S.String),
})
const PressedMenuItem = m('PressedMenuItem', {
  value: S.String,
  kind: Menu.MenuItemKind,
})
const ChangedMenuChecked = m('ChangedMenuChecked', {
  value: S.String,
  checked: S.Boolean,
})
const ChangedMenuRadioValue = m('ChangedMenuRadioValue', {
  groupValue: S.String,
  value: S.String,
})

const Message = S.Union([
  ChangedMenuOpen,
  ChangedMenuHighlight,
  PressedMenuItem,
  ChangedMenuChecked,
  ChangedMenuRadioValue,
])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ChangedMenuOpen: ({ open, parentValue, reason }) => [
        evo(model, {
          open: () => (parentValue === undefined ? open : model.open),
          openSubmenuValues: values => {
            if (parentValue === undefined) {
              return values
            }

            if (open) {
              return [...values, parentValue]
            }

            return values.filter(value => value !== parentValue)
          },
          highlightedValue: () =>
            open ? (model.highlightedValue ?? 'profile') : undefined,
          lastOpenReason: () => reason,
        }),
        [],
      ],
      ChangedMenuHighlight: ({ focusSelector, value, reason }) => [
        evo(model, {
          highlightedValue: () => value,
          lastHighlightReason: () => reason,
          lastFocusSelector: () => focusSelector,
        }),
        [],
      ],
      PressedMenuItem: ({ value }) => [
        evo(model, {
          open: () => false,
          lastPressedValue: () => value,
        }),
        [],
      ],
      ChangedMenuChecked: ({ checked }) => [
        evo(model, { statusBarChecked: () => checked }),
        [],
      ],
      ChangedMenuRadioValue: ({ value }) => [
        evo(model, { panelPosition: () => value }),
        [],
      ],
    }),
  )

// VIEW

const viewMenu =
  (
    config: Omit<
      ViewConfig<Message>,
      'id' | 'items' | 'onPositioned' | 'open' | 'positioning' | 'toView'
    >,
  ) =>
  (model: Model): Html => {
    const h = html<Message>()

    return Menu.view<Message>({
      positioning: 'static',
      id: 'actions-menu',
      items: menuItems(model),
      open: model.open,
      highlightedValue: model.highlightedValue,
      openSubmenuValues: model.openSubmenuValues,
      onOpenChange: change => ChangedMenuOpen(change),
      onHighlightChange: change => ChangedMenuHighlight(change),
      onItemPress: press => PressedMenuItem(press),
      onCheckedChange: change => ChangedMenuChecked(change),
      onRadioValueChange: change => ChangedMenuRadioValue(change),
      ...config,
      toView: attributes =>
        h.div(
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
                            h.div(
                              [...attributes.popup.groupLabel],
                              ['Actions'],
                            ),
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
            h.p([], [`Open ${model.lastOpenReason}`]),
            h.p([], [`Highlight ${model.lastHighlightReason}`]),
            h.p([], [`Focus ${model.lastFocusSelector ?? 'none'}`]),
            h.p([], [`Pressed ${model.lastPressedValue ?? 'none'}`]),
          ],
        ),
    })
  }

describe('base-ui/menu helpers', () => {
  test('filters parent-owned items and includes disabled items in roving navigation', () => {
    expect(
      Menu.itemsForParent({ items: menuItems(initialModel) }),
    ).toHaveLength(7)
    expect(
      Menu.itemsForParent({ items: menuItems(initialModel) }, 'more'),
    ).toHaveLength(2)
    expect(
      Menu.nextHighlightedItem(
        {
          highlightedValue: 'status-bar',
          items: menuItems(initialModel),
        },
        'next',
      )?.value,
    ).toBe('top')
    expect(
      Menu.nextHighlightedItem(
        {
          highlightedValue: 'more',
          items: menuItems(initialModel),
        },
        'next',
      )?.value,
    ).toBe('left')
  })

  test('supports typeahead over disabled items and checked/radio change payloads', () => {
    expect(
      Menu.typeaheadItem({ items: menuItems(initialModel) }, 's')?.value,
    ).toBe('status-bar')
    expect(
      Menu.typeaheadItem({ items: menuItems(initialModel) }, 'd')?.value,
    ).toBe('disabled')
    expect(
      Menu.checkedChange({
        value: 'status-bar',
        label: 'Status Bar',
        kind: 'checkbox',
        isChecked: true,
      }),
    ).toStrictEqual({ value: 'status-bar', checked: false })
    expect(
      Menu.radioValueChange({
        value: 'top',
        label: 'Top',
        kind: 'radio',
        radioGroupValue: 'position',
      }),
    ).toStrictEqual({ groupValue: 'position', value: 'top' })
  })

  test('keyboard navigation reaches disabled items without enabling activation handlers', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewMenu({}) },
        Scene.with({
          ...initialModel,
          open: true,
          highlightedValue: 'more',
        }),
        Scene.keydown(Scene.role('menu'), 'ArrowDown'),
        Scene.expect(Scene.selector('#actions-menu-item-left')).toHaveAttr(
          'data-highlighted',
          '',
        ),
        Scene.expect(Scene.text('Focus #actions-menu-item-left')).toBeVisible(),
        Scene.expect(Scene.text('Pressed none')).toBeVisible(),
        Scene.expect(Scene.selector('#actions-menu-item-left')).toHaveAttr(
          'aria-checked',
          'false',
        ),
        Scene.with({
          ...initialModel,
          open: true,
          highlightedValue: 'left',
        }),
        Scene.keydown(Scene.role('menu'), 'ArrowDown'),
        Scene.expect(Scene.selector('#actions-menu-item-disabled')).toHaveAttr(
          'data-highlighted',
          '',
        ),
        Scene.expect(
          Scene.text('Focus #actions-menu-item-disabled'),
        ).toBeVisible(),
        Scene.expect(Scene.text('Pressed none')).toBeVisible(),
      )
    }).not.toThrow()
  })

  test('disabled items omit click and activation key handlers for every item kind', () => {
    const h = html<Message>()
    const disabledItems: ReadonlyArray<MenuItemDescriptor> = [
      { value: 'regular', label: 'Regular', isDisabled: true },
      {
        value: 'checkbox',
        label: 'Checkbox',
        kind: 'checkbox',
        isDisabled: true,
      },
      {
        value: 'radio',
        label: 'Radio',
        kind: 'radio',
        radioGroupValue: 'position',
        isDisabled: true,
      },
      {
        value: 'submenu',
        label: 'Submenu',
        kind: 'submenu-trigger',
        isDisabled: true,
      },
    ]
    const itemAttributeTags = new Map<string, ReadonlyArray<string>>()

    Menu.view<Message>({
      positioning: 'static',
      id: 'disabled-menu',
      items: disabledItems,
      open: true,
      onItemPress: press => PressedMenuItem(press),
      onCheckedChange: change => ChangedMenuChecked(change),
      onRadioValueChange: change => ChangedMenuRadioValue(change),
      onOpenChange: change => ChangedMenuOpen(change),
      toView: attributes => {
        for (const itemAttributes of attributes.popup.items) {
          itemAttributeTags.set(
            itemAttributes.item.value,
            itemAttributes.root.map(attribute => attribute._tag),
          )
        }

        return h.div([], [])
      },
    })

    expect([...itemAttributeTags.values()]).toStrictEqual(
      disabledItems.map(() =>
        expect.not.arrayContaining(['OnClick', 'OnKeyDownPreventDefault']),
      ),
    )
  })
})

describe('base-ui/menu view', () => {
  test('renders trigger, popup, group, items, checked state, radio state, separator, arrow, backdrop, and disabled item attributes', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewMenu({
            align: 'end',
            side: 'top',
            sideOffset: 4,
          }),
        },
        Scene.with({
          ...initialModel,
          open: true,
          highlightedValue: 'status-bar',
        }),
        Scene.expect(Scene.role('button', { name: 'Actions' })).toHaveAttr(
          'aria-haspopup',
          'menu',
        ),
        Scene.expect(Scene.role('menu')).toHaveAttr('data-side', 'top'),
        Scene.expect(
          Scene.selector('#actions-menu-item-status-bar'),
        ).toHaveAttr('aria-checked', 'true'),
        Scene.expect(Scene.selector('#actions-menu-item-bottom')).toHaveAttr(
          'data-checked',
          '',
        ),
        Scene.expect(Scene.selector('#actions-menu-item-disabled')).toHaveAttr(
          'data-disabled',
          '',
        ),
        Scene.expect(Scene.selector('#actions-menu-arrow')).toHaveAttr(
          'data-open',
          '',
        ),
        Scene.expect(Scene.role('separator')).toHaveAttr(
          'aria-orientation',
          'horizontal',
        ),
      )
    }).not.toThrow()
  })

  test('keeps submenu placement data attributes aligned with visual offset styles', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewMenu({}) },
        Scene.with({
          ...initialModel,
          open: true,
          highlightedValue: 'more',
          openSubmenuValues: ['more'],
        }),
        Scene.expect(
          Scene.selector('#actions-menu-submenu-more-positioner'),
        ).toHaveAttr('data-side', 'right'),
        Scene.expect(
          Scene.selector('#actions-menu-submenu-more-positioner'),
        ).toHaveAttr('data-align-offset', '-3'),
        Scene.expect(
          Scene.selector('#actions-menu-submenu-more-positioner'),
        ).toHaveAttr('data-side-offset', '0'),
        Scene.expect(
          Scene.selector('#actions-menu-submenu-more-positioner'),
        ).toHaveStyle('left', 'calc(anchor(right) + 0px)'),
      )
    }).not.toThrow()
  })

  test('emits open, item press, checkbox, radio, hover, keyboard, typeahead, and submenu messages', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewMenu({}) },
        Scene.with({
          ...initialModel,
          open: true,
          highlightedValue: 'profile',
        }),
        Scene.click(Scene.selector('#actions-menu-item-profile')),
        Scene.expect(Scene.text('Pressed profile')).toBeVisible(),
        Scene.with({
          ...initialModel,
          open: true,
          highlightedValue: 'profile',
        }),
        Scene.click(Scene.selector('#actions-menu-item-status-bar')),
        Scene.expect(
          Scene.selector('#actions-menu-item-status-bar'),
        ).toHaveAttr('aria-checked', 'false'),
        Scene.click(Scene.selector('#actions-menu-item-top')),
        Scene.expect(Scene.selector('#actions-menu-item-top')).toHaveAttr(
          'aria-checked',
          'true',
        ),
        Scene.hover(Scene.selector('#actions-menu-item-bottom')),
        Scene.expect(Scene.text('Highlight item-hover')).toBeVisible(),
        Scene.keydown(Scene.role('menu'), 'ArrowDown'),
        Scene.expect(Scene.text('Highlight keyboard-navigation')).toBeVisible(),
        Scene.keydown(Scene.role('menu'), 's'),
        Scene.expect(Scene.text('Highlight typeahead')).toBeVisible(),
        Scene.click(Scene.selector('#actions-menu-item-more')),
        Scene.expect(
          Scene.selector('#actions-menu-submenu-more-popup'),
        ).toHaveAttr('data-open', ''),
      )
    }).not.toThrow()
  })

  test('renders closed force-mounted popups and dismisses from backdrop and escape', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewMenu({ forceMount: true }) },
        Scene.with({ ...initialModel, open: false }),
        Scene.expect(Scene.selector('#actions-menu-popup')).toHaveAttr(
          'hidden',
          'true',
        ),
        Scene.click(Scene.role('button', { name: 'Actions' })),
        Scene.expect(Scene.text('Open trigger-press')).toBeVisible(),
        Scene.with({ ...initialModel, open: true }),
        Scene.expect(Scene.selector('#actions-menu-popup')).toHaveHandler(
          'contextmenu',
        ),
        Scene.expect(Scene.role('presentation')).toHaveHandler('contextmenu'),
        Scene.keydown(Scene.role('menu'), 'Escape'),
        Scene.expect(Scene.text('Open escape-key')).toBeVisible(),
      )
    }).not.toThrow()
  })
})
