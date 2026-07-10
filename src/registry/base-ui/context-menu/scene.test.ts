import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as ContextMenu from './index'
import type { MenuItemDescriptor, ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  open: S.Boolean,
  contextPoint: S.optional(ContextMenu.ContextMenuPoint),
  highlightedValue: S.optional(S.String),
  openSubmenuValues: S.Array(S.String),
  statusBarChecked: S.Boolean,
  panelPosition: S.String,
  platform: ContextMenu.ContextMenuPlatform,
  lastOpenReason: ContextMenu.MenuOpenChangeReason,
  lastHighlightReason: ContextMenu.MenuHighlightChangeReason,
  lastPointText: S.String,
  lastPressedValue: S.optional(S.String),
})
type Model = typeof Model.Type

const initialModel: Model = {
  open: false,
  contextPoint: undefined,
  highlightedValue: undefined,
  openSubmenuValues: [],
  statusBarChecked: true,
  panelPosition: 'bottom',
  platform: 'mac',
  lastOpenReason: 'none',
  lastHighlightReason: 'none',
  lastPointText: 'none',
  lastPressedValue: undefined,
}

const menuItems = (model: Model): ReadonlyArray<MenuItemDescriptor> => [
  { value: 'back', label: 'Back' },
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
  { value: 'email', label: 'Email', parentValue: 'more' },
  { value: 'disabled', label: 'Disabled', isDisabled: true },
]

// MESSAGE

const UpdatedContextMenuPointer = m('UpdatedContextMenuPointer', {
  point: ContextMenu.ContextMenuPoint,
})
const ChangedContextMenuOpen = m('ChangedContextMenuOpen', {
  open: S.Boolean,
  reason: ContextMenu.MenuOpenChangeReason,
  parentValue: S.optional(S.String),
  point: S.optional(ContextMenu.ContextMenuPoint),
})
const ChangedContextMenuHighlight = m('ChangedContextMenuHighlight', {
  value: S.String,
  reason: ContextMenu.MenuHighlightChangeReason,
  focusSelector: S.optional(S.String),
})
const PressedContextMenuItem = m('PressedContextMenuItem', {
  value: S.String,
  kind: ContextMenu.MenuItemKind,
})
const ChangedContextMenuChecked = m('ChangedContextMenuChecked', {
  value: S.String,
  checked: S.Boolean,
})
const ChangedContextMenuRadioValue = m('ChangedContextMenuRadioValue', {
  groupValue: S.String,
  value: S.String,
})

const Message = S.Union([
  UpdatedContextMenuPointer,
  ChangedContextMenuOpen,
  ChangedContextMenuHighlight,
  PressedContextMenuItem,
  ChangedContextMenuChecked,
  ChangedContextMenuRadioValue,
])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const pointText = (point: ContextMenu.ContextMenuPoint | undefined): string =>
  point === undefined ? 'none' : `${point.clientX},${point.clientY}`

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      UpdatedContextMenuPointer: ({ point }) => [
        evo(model, {
          contextPoint: () => point,
          lastPointText: () => pointText(point),
        }),
        [],
      ],
      ChangedContextMenuOpen: ({ open, parentValue, point, reason }) => [
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
          highlightedValue: () => (open ? 'back' : undefined),
          lastOpenReason: () => reason,
          lastPointText: () => pointText(point),
        }),
        [],
      ],
      ChangedContextMenuHighlight: ({ value, reason }) => [
        evo(model, {
          highlightedValue: () => value,
          lastHighlightReason: () => reason,
        }),
        [],
      ],
      PressedContextMenuItem: ({ value }) => [
        evo(model, {
          open: () => false,
          lastPressedValue: () => value,
        }),
        [],
      ],
      ChangedContextMenuChecked: ({ checked }) => [
        evo(model, { statusBarChecked: () => checked }),
        [],
      ],
      ChangedContextMenuRadioValue: ({ value }) => [
        evo(model, { panelPosition: () => value }),
        [],
      ],
    }),
  )

// VIEW

const viewMenu =
  (config: Omit<ViewConfig<Message>, 'id' | 'items' | 'open' | 'toView'>) =>
  (model: Model): Html => {
    const h = html<Message>()

    return ContextMenu.view<Message>({
      positioning: 'static',
      id: 'browser-menu',
      items: menuItems(model),
      open: model.open,
      contextPoint: model.contextPoint,
      highlightedValue: model.highlightedValue,
      openSubmenuValues: model.openSubmenuValues,
      platform: model.platform,
      onPointerChange: point => UpdatedContextMenuPointer({ point }),
      onOpenChange: change => ChangedContextMenuOpen(change),
      onHighlightChange: change => ChangedContextMenuHighlight(change),
      onItemPress: press => PressedContextMenuItem(press),
      onCheckedChange: change => ChangedContextMenuChecked(change),
      onRadioValueChange: change => ChangedContextMenuRadioValue(change),
      ...config,
      toView: attributes =>
        h.div(
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
                          attributes.popup.items.map(itemAttributes =>
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
            h.p([], [`Open ${model.lastOpenReason}`]),
            h.p([], [`Highlight ${model.lastHighlightReason}`]),
            h.p([], [`Point ${model.lastPointText}`]),
            h.p([], [`Pressed ${model.lastPressedValue ?? 'none'}`]),
          ],
        ),
    })
  }

const triggerAttributeTags = (
  config: Omit<ViewConfig<Message>, 'toView'>,
): ReadonlyArray<Attribute<Message>['_tag']> => {
  const h = html<Message>()
  let tags: ReadonlyArray<Attribute<Message>['_tag']> = []

  ContextMenu.view<Message>({
    positioning: 'static',
    ...config,
    toView: attributes => {
      tags = attributes.trigger.map(attribute => attribute._tag)

      return h.div([], [])
    },
  })

  return tags
}

describe('base-ui/context-menu helpers', () => {
  test('creates open changes with context points and delegates item helpers to menu', () => {
    const point = ContextMenu.contextPoint(10, 12, 20, 24, 'mouse')

    expect(ContextMenu.openChange(true, 'trigger-press', point)).toStrictEqual({
      open: true,
      reason: 'trigger-press',
      point,
      parentValue: undefined,
    })
    expect(
      ContextMenu.itemPress({ value: 'back', label: 'Back' }),
    ).toStrictEqual({ value: 'back', kind: 'item' })
  })

  test('disabled triggers omit context menu and pointer handlers', () => {
    expect(
      triggerAttributeTags({
        id: 'disabled-context',
        items: menuItems(initialModel),
        open: false,
        isDisabled: true,
        onPointerChange: point => UpdatedContextMenuPointer({ point }),
        onOpenChange: change => ChangedContextMenuOpen(change),
      }),
    ).toStrictEqual(
      expect.not.arrayContaining(['OnContextMenu', 'OnPointerDown']),
    )
  })
})

describe('base-ui/context-menu view', () => {
  test('tracks right-click coordinates and opens from the context key at that point', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewMenu({}) },
        Scene.with(initialModel),
        Scene.pointerDown(Scene.selector('#browser-menu-trigger'), {
          button: 2,
          clientX: 20,
          clientY: 40,
          screenX: 120,
          screenY: 140,
        }),
        Scene.expect(Scene.text('Point 20,40')).toBeVisible(),
        Scene.keydown(Scene.selector('#browser-menu-trigger'), 'ContextMenu'),
        Scene.expect(Scene.text('Open keyboard-open')).toBeVisible(),
        Scene.expect(Scene.selector('#browser-menu-positioner')).toHaveAttr(
          'data-anchor-x',
          '20',
        ),
        Scene.expect(Scene.selector('#browser-menu-positioner')).toHaveAttr(
          'data-anchor-y',
          '40',
        ),
      )
    }).not.toThrow()
  })

  test('supports Shift+F10 keyboard opening with the deterministic fallback point', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewMenu({}) },
        Scene.with(initialModel),
        Scene.keydown(Scene.selector('#browser-menu-trigger'), 'F10', {
          shiftKey: true,
        }),
        Scene.expect(Scene.text('Open keyboard-open')).toBeVisible(),
        Scene.expect(Scene.selector('#browser-menu-positioner')).toHaveAttr(
          'data-anchor-x',
          '0',
        ),
      )
    }).not.toThrow()
  })

  test('renders menu structure, context trigger attributes, checked items, radio items, and submenu attributes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewMenu({ forceMount: true }) },
        Scene.with({
          ...initialModel,
          open: true,
          contextPoint: ContextMenu.contextPoint(18, 22, 118, 122, 'mouse'),
          highlightedValue: 'more',
          openSubmenuValues: ['more'],
        }),
        Scene.expect(Scene.selector('#browser-menu-trigger')).toHaveAttr(
          'aria-haspopup',
          'menu',
        ),
        Scene.expect(Scene.selector('#browser-menu-trigger')).toHaveAttr(
          'data-popup-open',
          '',
        ),
        Scene.expect(Scene.selector('#browser-menu-popup')).toHaveAttr(
          'role',
          'menu',
        ),
        Scene.expect(Scene.selector('#browser-menu-positioner')).toHaveAttr(
          'data-anchor',
          'context-point',
        ),
        Scene.expect(
          Scene.selector('#browser-menu-item-status-bar'),
        ).toHaveAttr('aria-checked', 'true'),
        Scene.expect(Scene.selector('#browser-menu-item-bottom')).toHaveAttr(
          'data-checked',
          '',
        ),
        Scene.expect(
          Scene.selector('#browser-menu-submenu-more-popup'),
        ).toHaveAttr('data-open', ''),
      )
    }).not.toThrow()
  })

  test('uses mac pointer-release behavior only after the cursor leaves the initial spawn point', () => {
    const openModel: Model = {
      ...initialModel,
      open: true,
      contextPoint: ContextMenu.contextPoint(12, 12, 112, 112, 'mouse'),
      highlightedValue: 'back',
    }

    expect(() => {
      Scene.scene(
        { update, view: viewMenu({}) },
        Scene.with(openModel),
        Scene.pointerUp(Scene.selector('#browser-menu-item-back'), {
          pointerType: 'mouse',
          screenX: 112,
          screenY: 112,
        }),
        Scene.expect(Scene.text('Pressed none')).toBeVisible(),
        Scene.pointerUp(Scene.selector('#browser-menu-item-back'), {
          pointerType: 'mouse',
          screenX: 120,
          screenY: 120,
        }),
        Scene.expect(Scene.text('Pressed back')).toBeVisible(),
      )
    }).not.toThrow()
  })

  test('ignores context-menu pointer release on non-Mac platforms', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewMenu({}) },
        Scene.with({
          ...initialModel,
          open: true,
          contextPoint: ContextMenu.contextPoint(12, 12, 112, 112, 'mouse'),
          highlightedValue: 'back',
          platform: 'non-mac',
        }),
        Scene.pointerUp(Scene.selector('#browser-menu-item-back'), {
          pointerType: 'mouse',
          screenX: 120,
          screenY: 120,
        }),
        Scene.expect(Scene.text('Pressed none')).toBeVisible(),
      )
    }).not.toThrow()
  })
})
