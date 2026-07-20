import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as Menubar from './index'
import type {
  MenubarMenuDescriptor,
  MenuItemDescriptor,
  ViewConfig,
} from './index'

// MODEL

const Model = S.Struct({
  openMenuValue: S.optional(S.String),
  focusedMenuValue: S.String,
  highlightedValue: S.optional(S.String),
  openSubmenuValues: S.Array(S.String),
  statusBarChecked: S.Boolean,
  panelPosition: S.String,
  lastOpenReason: Menubar.MenuOpenChangeReason,
  lastTriggerReason: Menubar.MenubarTriggerChangeReason,
  lastTriggerValue: S.optional(S.String),
  lastFocusSelector: S.optional(S.String),
  lastPressedValue: S.optional(S.String),
})
type Model = typeof Model.Type

const initialModel: Model = {
  openMenuValue: undefined,
  focusedMenuValue: 'file',
  highlightedValue: undefined,
  openSubmenuValues: [],
  statusBarChecked: true,
  panelPosition: 'bottom',
  lastOpenReason: 'none',
  lastTriggerReason: 'none',
  lastTriggerValue: undefined,
  lastFocusSelector: undefined,
  lastPressedValue: undefined,
}

const fileItems = (model: Model): ReadonlyArray<MenuItemDescriptor> => [
  { value: 'new', label: 'New' },
  {
    value: 'status-bar',
    label: 'Status Bar',
    kind: 'checkbox',
    isChecked: model.statusBarChecked,
  },
  {
    value: 'bottom',
    label: 'Bottom',
    kind: 'radio',
    radioGroupValue: 'panel-position',
    isChecked: model.panelPosition === 'bottom',
  },
  { value: 'export', label: 'Export', kind: 'submenu-trigger' },
  { value: 'pdf', label: 'PDF', parentValue: 'export' },
  { value: 'png', label: 'PNG', parentValue: 'export' },
]

const editItems: ReadonlyArray<MenuItemDescriptor> = [
  { value: 'undo', label: 'Undo' },
  { value: 'redo', label: 'Redo' },
]

const viewItems: ReadonlyArray<MenuItemDescriptor> = [
  { value: 'zoom-in', label: 'Zoom In' },
  { value: 'zoom-out', label: 'Zoom Out' },
]

const menus = (model: Model): ReadonlyArray<MenubarMenuDescriptor> => [
  {
    value: 'file',
    label: 'File',
    items: fileItems(model),
    open: model.openMenuValue === 'file',
    highlightedValue: model.highlightedValue,
    openSubmenuValues: model.openSubmenuValues,
  },
  {
    value: 'edit',
    label: 'Edit',
    items: editItems,
    open: model.openMenuValue === 'edit',
    highlightedValue: model.highlightedValue,
  },
  {
    value: 'view',
    label: 'View',
    items: viewItems,
    open: model.openMenuValue === 'view',
    highlightedValue: model.highlightedValue,
  },
]

// MESSAGE

const ChangedMenuOpen = m('ChangedMenuOpen', {
  menuValue: S.String,
  open: S.Boolean,
  reason: Menubar.MenuOpenChangeReason,
  parentValue: S.optional(S.String),
})
const ChangedMenuHighlight = m('ChangedMenuHighlight', {
  menuValue: S.String,
  value: S.String,
  reason: Menubar.MenuHighlightChangeReason,
  focusSelector: S.optional(S.String),
})
const PressedMenuItem = m('PressedMenuItem', {
  menuValue: S.String,
  value: S.String,
  kind: Menubar.MenuItemKind,
})
const ChangedMenuChecked = m('ChangedMenuChecked', {
  menuValue: S.String,
  value: S.String,
  checked: S.Boolean,
})
const ChangedMenuRadioValue = m('ChangedMenuRadioValue', {
  menuValue: S.String,
  groupValue: S.String,
  value: S.String,
})
const ChangedTrigger = m('ChangedTrigger', {
  value: S.String,
  previousValue: S.optional(S.String),
  reason: Menubar.MenubarTriggerChangeReason,
  focusSelector: S.optional(S.String),
  open: S.Boolean,
})

const Message = S.Union([
  ChangedMenuOpen,
  ChangedMenuHighlight,
  PressedMenuItem,
  ChangedMenuChecked,
  ChangedMenuRadioValue,
  ChangedTrigger,
])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const firstItemValue = (menuValue: string, model: Model): string | undefined =>
  menus(model)
    .find(menu => menu.value === menuValue)
    ?.items.find(item => item.parentValue === undefined)?.value

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ChangedMenuOpen: ({ menuValue, open, parentValue, reason }) => [
        evo(model, {
          openMenuValue: () => {
            if (parentValue !== undefined) {
              return model.openMenuValue
            }

            return open ? menuValue : initialModel.openMenuValue
          },
          focusedMenuValue: () => menuValue,
          highlightedValue: () =>
            open
              ? (model.highlightedValue ?? firstItemValue(menuValue, model))
              : undefined,
          openSubmenuValues: values => {
            if (parentValue === undefined) {
              return open ? values : []
            }

            if (open) {
              return [...values, parentValue]
            }

            return values.filter(value => value !== parentValue)
          },
          lastOpenReason: () => reason,
        }),
        [],
      ],
      ChangedMenuHighlight: ({ focusSelector, value }) => [
        evo(model, {
          highlightedValue: () => value,
          lastFocusSelector: () => focusSelector,
        }),
        [],
      ],
      PressedMenuItem: ({ value }) => [
        evo(model, {
          openMenuValue: () => {},
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
      ChangedTrigger: ({ focusSelector, open, reason, value }) => [
        evo(model, {
          focusedMenuValue: () => value,
          openMenuValue: () => (open ? value : model.openMenuValue),
          highlightedValue: () =>
            open ? firstItemValue(value, model) : model.highlightedValue,
          openSubmenuValues: () => [],
          lastTriggerReason: () => reason,
          lastTriggerValue: () => value,
          lastFocusSelector: () => focusSelector,
        }),
        [],
      ],
    }),
  )

// VIEW

const popupView = (
  popup: Menubar.MenuPopupAttributes<Message>,
): ReadonlyArray<Html> => {
  const h = html<Message>()

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

const viewMenubar =
  (
    config: Omit<ViewConfig<Message>, 'id' | 'menus'> &
      Partial<Pick<ViewConfig<Message>, 'id'>>,
  ) =>
  (model: Model): Html => {
    const h = html<Message>()

    return Menubar.view<Message>({
      id: config.id ?? 'browser-menubar',
      menus: menus(model),
      focusedMenuValue: model.focusedMenuValue,
      onMenuOpenChange: change => ChangedMenuOpen(change),
      onMenuHighlightChange: change => ChangedMenuHighlight(change),
      onMenuItemPress: press => PressedMenuItem(press),
      onMenuCheckedChange: change => ChangedMenuChecked(change),
      onMenuRadioValueChange: change => ChangedMenuRadioValue(change),
      onTriggerChange: change => ChangedTrigger(change),
      ...config,
      toMenuView: attributes =>
        h.div(
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
        ),
      toView: attributes =>
        h.div(
          [...attributes.root],
          [
            ...attributes.menus,
            h.p([], [`Open ${model.openMenuValue ?? 'none'}`]),
            h.p([], [`Reason ${model.lastOpenReason}`]),
            h.p([], [`Trigger ${model.lastTriggerValue ?? 'none'}`]),
            h.p([], [`Trigger reason ${model.lastTriggerReason}`]),
            h.p([], [`Focus ${model.lastFocusSelector ?? 'none'}`]),
            h.p([], [`Pressed ${model.lastPressedValue ?? 'none'}`]),
          ],
        ),
    })
  }

describe('base-ui/menubar helpers', () => {
  test('derives active, open, enabled, and next menu state', () => {
    const state = { ...initialModel, openMenuValue: 'edit' }

    expect(Menubar.hasOpenMenu({ menus: menus(state) })).toBeTruthy()
    expect(Menubar.activeMenuValue({ menus: menus(state) })).toBe('edit')
    expect(
      Menubar.nextEnabledMenu(
        { menus: menus(state), focusedMenuValue: 'file' },
        'next',
      )?.value,
    ).toBe('edit')
    expect(
      Menubar.nextEnabledMenu(
        { menus: menus(state), focusedMenuValue: 'view', loopFocus: true },
        'next',
      )?.value,
    ).toBe('file')
    expect(
      Menubar.nextEnabledMenu(
        { menus: menus(state), focusedMenuValue: 'view', loopFocus: false },
        'next',
      )?.value,
    ).toBe('view')
  })

  test('wraps Menu change payloads with top-level menu identity', () => {
    expect(Menubar.menuOpenChange('file', true, 'trigger-press')).toStrictEqual(
      {
        menuValue: 'file',
        open: true,
        reason: 'trigger-press',
        parentValue: undefined,
      },
    )
    expect(
      Menubar.menuItemPress('file', { value: 'new', kind: 'item' }),
    ).toStrictEqual({ menuValue: 'file', value: 'new', kind: 'item' })
  })
})

describe('base-ui/menubar view', () => {
  test('renders a menubar root with menuitem triggers and an open composed menu', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewMenubar({}) },
        Scene.with({ ...initialModel, openMenuValue: 'file' }),
        Scene.expect(Scene.role('menubar')).toHaveAttr(
          'aria-orientation',
          'horizontal',
        ),
        Scene.expect(Scene.role('menubar')).toHaveAttr(
          'data-has-submenu-open',
          '',
        ),
        Scene.expect(Scene.role('menuitem', { name: 'File' })).toHaveAttr(
          'aria-haspopup',
          'menu',
        ),
        Scene.expect(
          Scene.selector('#browser-menubar-file-trigger'),
        ).toHaveAttr('tabIndex', '0'),
        Scene.expect(Scene.role('menu')).toHaveAttr('data-side', 'bottom'),
        Scene.expect(
          Scene.selector('#browser-menubar-file-item-status-bar'),
        ).toHaveAttr('aria-checked', 'true'),
      )
    }).not.toThrow()
  })

  test('emits trigger open, keyboard navigation, hover handoff, and item messages', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewMenubar({}) },
        Scene.with(initialModel),
        Scene.click(Scene.role('menuitem', { name: 'File' })),
        Scene.expect(Scene.text('Open file')).toBeVisible(),
        Scene.expect(Scene.text('Reason trigger-press')).toBeVisible(),
        Scene.keydown(Scene.role('menuitem', { name: 'File' }), 'ArrowRight'),
        Scene.expect(Scene.text('Trigger edit')).toBeVisible(),
        Scene.expect(
          Scene.text('Trigger reason keyboard-navigation'),
        ).toBeVisible(),
        Scene.with({ ...initialModel, openMenuValue: 'file' }),
        Scene.hover(Scene.role('menuitem', { name: 'Edit' })),
        Scene.expect(Scene.text('Open edit')).toBeVisible(),
        Scene.expect(Scene.text('Trigger reason trigger-hover')).toBeVisible(),
        Scene.with({
          ...initialModel,
          openMenuValue: 'file',
          highlightedValue: 'new',
        }),
        Scene.click(Scene.selector('#browser-menubar-file-item-new')),
        Scene.expect(Scene.text('Pressed new')).toBeVisible(),
      )
    }).not.toThrow()
  })

  test('preserves Menu checkbox, radio, keyboard highlight, and submenu composition', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewMenubar({}),
        },
        Scene.with({
          ...initialModel,
          openMenuValue: 'file',
          highlightedValue: 'new',
        }),
        Scene.click(Scene.selector('#browser-menubar-file-item-status-bar')),
        Scene.expect(
          Scene.selector('#browser-menubar-file-item-status-bar'),
        ).toHaveAttr('aria-checked', 'false'),
        Scene.click(Scene.selector('#browser-menubar-file-item-bottom')),
        Scene.expect(
          Scene.selector('#browser-menubar-file-item-bottom'),
        ).toHaveAttr('aria-checked', 'true'),
        Scene.keydown(Scene.role('menu'), 'ArrowDown'),
        Scene.expect(
          Scene.text('Focus #browser-menubar-file-item-status-bar'),
        ).toBeVisible(),
        Scene.click(Scene.selector('#browser-menubar-file-item-export')),
        Scene.expect(
          Scene.selector('#browser-menubar-file-submenu-export-popup'),
        ).toHaveAttr('data-open', ''),
      )
    }).not.toThrow()
  })

  test('supports vertical non-looping navigation and disabled menubars', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewMenubar({ orientation: 'vertical', loopFocus: false }),
        },
        Scene.with({ ...initialModel, focusedMenuValue: 'view' }),
        Scene.keydown(Scene.role('menuitem', { name: 'View' }), 'ArrowDown'),
        Scene.expect(Scene.text('Trigger none')).toBeVisible(),
        Scene.expect(Scene.role('menubar')).toHaveAttr(
          'aria-orientation',
          'vertical',
        ),
      )

      Scene.scene(
        { update, view: viewMenubar({ isDisabled: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('menubar')).toHaveAttr('data-disabled', ''),
        Scene.expect(
          Scene.selector('#browser-menubar-file-trigger'),
        ).toHaveAttr('data-disabled', ''),
        Scene.expect(
          Scene.selector('#browser-menubar-file-trigger'),
        ).toHaveAttr('tabIndex', '-1'),
      )
    }).not.toThrow()
  })
})
