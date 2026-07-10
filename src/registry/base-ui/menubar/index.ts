import { Option, Predicate, Schema as S } from 'effect'
import type { Attribute, Html, KeyboardModifiers } from 'foldkit/html'
import { html } from 'foldkit/html'

import * as Menu from '../menu'

// MODEL

export const MenubarOrientation = S.Union([
  S.Literal('horizontal'),
  S.Literal('vertical'),
])
export type MenubarOrientation = typeof MenubarOrientation.Type

export const MenubarTriggerChangeReason = S.Union([
  S.Literal('keyboard-navigation'),
  S.Literal('trigger-hover'),
  S.Literal('none'),
])
export type MenubarTriggerChangeReason = typeof MenubarTriggerChangeReason.Type

export const {
  MenuAlign,
  MenuHighlightChangeReason,
  MenuItemKind,
  MenuOpenChangeReason,
  MenuSide,
  MenuTransitionStatus,
} = Menu

export type MenuAlign = Menu.MenuAlign
export type MenuCheckedChange = Menu.MenuCheckedChange
export type MenuHighlightChangeReason = Menu.MenuHighlightChangeReason
export type MenuItemDescriptor = Menu.MenuItemDescriptor
export type MenuItemKind = Menu.MenuItemKind
export type MenuItemPress = Menu.MenuItemPress
export type MenuOpenChangeReason = Menu.MenuOpenChangeReason
export type MenuRadioValueChange = Menu.MenuRadioValueChange
export type MenuSide = Menu.MenuSide
export type MenuTransitionStatus = Menu.MenuTransitionStatus

export const MenubarMenuDescriptor = S.Struct({
  id: S.optional(S.String),
  value: S.String,
  label: S.String,
  items: S.Array(Menu.MenuItemDescriptor),
  open: S.Boolean,
  highlightedValue: S.optional(S.String),
  openSubmenuValues: S.optional(S.Array(S.String)),
  forceMount: S.optional(S.Boolean),
  transitionStatus: S.optional(Menu.MenuTransitionStatus),
  isDisabled: S.optional(S.Boolean),
  side: S.optional(Menu.MenuSide),
  align: S.optional(Menu.MenuAlign),
  sideOffset: S.optional(S.Number),
  alignOffset: S.optional(S.Number),
  collisionAvoidance: S.optional(S.Boolean),
  collisionPadding: S.optional(S.Number),
  triggerId: S.optional(S.String),
  triggerSelector: S.optional(S.String),
})
export type MenubarMenuDescriptor = typeof MenubarMenuDescriptor.Type

export const MenubarOptions = S.Struct({
  id: S.String,
  menus: S.Array(MenubarMenuDescriptor),
  focusedMenuValue: S.optional(S.String),
  orientation: S.optional(MenubarOrientation),
  loopFocus: S.optional(S.Boolean),
  modal: S.optional(S.Boolean),
  isDisabled: S.optional(S.Boolean),
})
export type MenubarOptions = typeof MenubarOptions.Type

export const MenubarMenuOpenChange = S.Struct({
  menuValue: S.String,
  open: S.Boolean,
  reason: Menu.MenuOpenChangeReason,
  parentValue: S.optional(S.String),
})
export type MenubarMenuOpenChange = typeof MenubarMenuOpenChange.Type

export const MenubarMenuHighlightChange = S.Struct({
  menuValue: S.String,
  value: S.String,
  reason: Menu.MenuHighlightChangeReason,
  focusSelector: S.optional(S.String),
})
export type MenubarMenuHighlightChange = typeof MenubarMenuHighlightChange.Type

export const MenubarMenuItemPress = S.Struct({
  menuValue: S.String,
  value: S.String,
  kind: Menu.MenuItemKind,
})
export type MenubarMenuItemPress = typeof MenubarMenuItemPress.Type

export const MenubarMenuCheckedChange = S.Struct({
  menuValue: S.String,
  value: S.String,
  checked: S.Boolean,
})
export type MenubarMenuCheckedChange = typeof MenubarMenuCheckedChange.Type

export const MenubarMenuRadioValueChange = S.Struct({
  menuValue: S.String,
  groupValue: S.String,
  value: S.String,
})
export type MenubarMenuRadioValueChange =
  typeof MenubarMenuRadioValueChange.Type

export const MenubarTriggerChange = S.Struct({
  value: S.String,
  previousValue: S.optional(S.String),
  reason: MenubarTriggerChangeReason,
  focusSelector: S.optional(S.String),
  open: S.Boolean,
})
export type MenubarTriggerChange = typeof MenubarTriggerChange.Type

// UPDATE

const activationKeys = new Set(['Enter', ' '])
const defaultOrientation: MenubarOrientation = 'horizontal'
const defaultLoopFocus = true
const defaultModal = true
const defaultMenuSide: MenuSide = 'bottom'
const defaultMenuAlign: MenuAlign = 'start'
const defaultMenuSideOffset = 4
const defaultMenuAlignOffset = 0

export const {
  FocusMenu: FocusMenubarMenu,
  RestoreMenuFocus: RestoreMenubarMenuFocus,
  arrowId,
  checkedChange,
  enabledItems,
  groupLabelId,
  highlightChange,
  highlightedItem,
  itemFocusSelector,
  itemId,
  itemKind,
  itemPress,
  itemsForParent,
  nextHighlightedItem,
  openChange,
  popupId,
  positionerId,
  radioValueChange,
  triggerId: menuTriggerId,
  triggerSelector: menuTriggerSelector,
  typeaheadItem,
} = Menu

export const menuId = (
  config: Pick<MenubarOptions, 'id'>,
  menu: Pick<MenubarMenuDescriptor, 'id' | 'value'>,
): string => menu.id ?? `${config.id}-${menu.value}`

export const triggerId = (
  config: Pick<MenubarOptions, 'id'>,
  menu: Pick<MenubarMenuDescriptor, 'id' | 'triggerId' | 'value'>,
): string => menu.triggerId ?? `${menuId(config, menu)}-trigger`

export const triggerSelector = (
  config: Pick<MenubarOptions, 'id'>,
  menu: Pick<
    MenubarMenuDescriptor,
    'id' | 'triggerId' | 'triggerSelector' | 'value'
  >,
): string => menu.triggerSelector ?? `#${triggerId(config, menu)}`

export const menuOptions = (
  config: Pick<MenubarOptions, 'id' | 'isDisabled'>,
  menu: MenubarMenuDescriptor,
): Menu.MenuOptions => ({
  id: menuId(config, menu),
  open: menu.open,
  items: menu.items,
  highlightedValue: menu.highlightedValue,
  openSubmenuValues: menu.openSubmenuValues,
  forceMount: menu.forceMount,
  transitionStatus: menu.transitionStatus,
  isDisabled: config.isDisabled === true || menu.isDisabled === true,
  side: menu.side ?? defaultMenuSide,
  align: menu.align ?? defaultMenuAlign,
  sideOffset: menu.sideOffset ?? defaultMenuSideOffset,
  alignOffset: menu.alignOffset ?? defaultMenuAlignOffset,
  collisionAvoidance: menu.collisionAvoidance,
  collisionPadding: menu.collisionPadding,
  triggerId: triggerId(config, menu),
  triggerSelector: triggerSelector(config, menu),
})

export const enabledMenus = (
  config: Pick<MenubarOptions, 'isDisabled' | 'menus'>,
): ReadonlyArray<MenubarMenuDescriptor> =>
  config.isDisabled === true
    ? []
    : config.menus.filter(menu => menu.isDisabled !== true)

export const hasOpenMenu = (config: Pick<MenubarOptions, 'menus'>): boolean =>
  config.menus.some(menu => menu.open)

export const activeMenuValue = (
  config: Pick<MenubarOptions, 'focusedMenuValue' | 'isDisabled' | 'menus'>,
): string | undefined =>
  config.focusedMenuValue ??
  config.menus.find(menu => menu.open)?.value ??
  enabledMenus(config).at(0)?.value

const indexOffset = (
  currentIndex: number,
  direction: 'next' | 'previous',
): number => currentIndex + (direction === 'next' ? 1 : -1)

export const nextEnabledMenu = (
  config: Pick<
    MenubarOptions,
    'focusedMenuValue' | 'isDisabled' | 'loopFocus' | 'menus'
  >,
  direction: 'first' | 'last' | 'next' | 'previous',
  currentValue?: string | undefined,
): MenubarMenuDescriptor | undefined => {
  const menus = enabledMenus(config)

  if (direction === 'first') {
    return menus[0]
  }

  if (direction === 'last') {
    return menus.at(-1)
  }

  const resolvedValue = currentValue ?? activeMenuValue(config)
  const currentIndex = menus.findIndex(menu => menu.value === resolvedValue)
  const resolvedCurrentIndex = currentIndex === -1 ? 0 : currentIndex
  const candidateIndex = indexOffset(resolvedCurrentIndex, direction)

  if (candidateIndex >= 0 && candidateIndex < menus.length) {
    return menus[candidateIndex]
  }

  if (config.loopFocus ?? defaultLoopFocus) {
    return direction === 'next' ? menus[0] : menus.at(-1)
  }

  return menus[resolvedCurrentIndex]
}

export const menuOpenChange = (
  menuValue: string,
  open: boolean,
  reason: MenuOpenChangeReason = 'none',
  parentValue?: string | undefined,
): MenubarMenuOpenChange => ({ menuValue, open, reason, parentValue })

export const menuHighlightChange = (
  menuValue: string,
  change: Menu.MenuHighlightChange,
): MenubarMenuHighlightChange => ({
  menuValue,
  value: change.value,
  reason: change.reason,
  focusSelector: change.focusSelector,
})

export const menuItemPress = (
  menuValue: string,
  press: Menu.MenuItemPress,
): MenubarMenuItemPress => ({
  menuValue,
  value: press.value,
  kind: press.kind,
})

export const menuCheckedChange = (
  menuValue: string,
  change: Menu.MenuCheckedChange,
): MenubarMenuCheckedChange => ({
  menuValue,
  value: change.value,
  checked: change.checked,
})

export const menuRadioValueChange = (
  menuValue: string,
  change: Menu.MenuRadioValueChange,
): MenubarMenuRadioValueChange => ({
  menuValue,
  groupValue: change.groupValue,
  value: change.value,
})

export const triggerChange = (
  value: string,
  reason: MenubarTriggerChangeReason = 'none',
  open = false,
  previousValue?: string | undefined,
  focusSelector?: string | undefined,
): MenubarTriggerChange => ({
  value,
  previousValue,
  reason,
  focusSelector,
  open,
})

export const commandForMenuOpenChange = (
  config: Pick<MenubarOptions, 'id' | 'menus'>,
  change: MenubarMenuOpenChange,
): ReturnType<typeof Menu.commandForOpenChange> => {
  const menu = config.menus.find(
    candidate => candidate.value === change.menuValue,
  )

  if (menu === undefined) {
    throw new Error(`Unknown menubar menu: ${change.menuValue}`)
  }

  return Menu.commandForOpenChange(
    menuOptions(config, menu),
    Menu.openChange(change.open, change.reason, change.parentValue),
  )
}

// VIEW

export type MenuPartAttributes<Message> = Menu.MenuPartAttributes<Message>
export type MenuItemAttributes<Message> = Menu.MenuItemAttributes<Message>
export type MenuPopupAttributes<Message> = Menu.MenuPopupAttributes<Message>

export type MenubarMenuAttributes<Message> = Omit<
  Menu.MenuAttributes<Message>,
  'root' | 'trigger'
> &
  Readonly<{
    menu: MenubarMenuDescriptor
    root: ReadonlyArray<Attribute<Message>>
    trigger: ReadonlyArray<Attribute<Message>>
  }>

export type MenubarAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  menus: ReadonlyArray<Html>
  isOpen: boolean
  orientation: MenubarOrientation
}>

export type ViewConfig<Message> = MenubarOptions &
  Readonly<{
    onMenuOpenChange?: (change: MenubarMenuOpenChange) => Message
    onMenuHighlightChange?: (change: MenubarMenuHighlightChange) => Message
    onMenuItemPress?: (press: MenubarMenuItemPress) => Message
    onMenuCheckedChange?: (change: MenubarMenuCheckedChange) => Message
    onMenuRadioValueChange?: (change: MenubarMenuRadioValueChange) => Message
    onTriggerChange?: (change: MenubarTriggerChange) => Message
    onFocus?: Message
    onBlur?: Message
    toMenuView?: (attributes: MenubarMenuAttributes<Message>) => Html
    toView?: (attributes: MenubarAttributes<Message>) => Html
  }>

const booleanDataAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  name: string,
  value: boolean | undefined,
): ReadonlyArray<Attribute<Message>> =>
  value === true ? [h.DataAttribute(name, '')] : []

const optionalBooleanAttribute = <Message>(
  value: boolean | undefined,
  toAttribute: (value: boolean) => Attribute<Message>,
): ReadonlyArray<Attribute<Message>> =>
  value === true ? [toAttribute(true)] : []

const optionalMessageAttribute = <Message>(
  message: Option.Option<Message>,
  toAttribute: (message: Message) => Attribute<Message>,
): ReadonlyArray<Attribute<Message>> =>
  Option.match(message, {
    onNone: () => [],
    onSome: value => [toAttribute(value)],
  })

const orientation = (
  config: Pick<MenubarOptions, 'orientation'>,
): MenubarOrientation => config.orientation ?? defaultOrientation

const triggerFocusSelector = (
  config: Pick<MenubarOptions, 'id'>,
  menu: MenubarMenuDescriptor,
): string => `#${triggerId(config, menu)}`

const openMessage = <Message>(
  config: Pick<ViewConfig<Message>, 'onMenuOpenChange'>,
  menuValue: string,
  change: Menu.MenuOpenChange,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onMenuOpenChange)
    ? Option.some(
        config.onMenuOpenChange(
          menuOpenChange(
            menuValue,
            change.open,
            change.reason,
            change.parentValue,
          ),
        ),
      )
    : Option.none()

const triggerMessage = <Message>(
  config: Pick<ViewConfig<Message>, 'onTriggerChange'>,
  change: MenubarTriggerChange,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onTriggerChange)
    ? Option.some(config.onTriggerChange(change))
    : Option.none()

const navigationDirection = (
  config: Pick<MenubarOptions, 'orientation'>,
  key: string,
): 'first' | 'last' | 'next' | 'previous' | undefined => {
  if (key === 'Home') {
    return 'first'
  }

  if (key === 'End') {
    return 'last'
  }

  if (orientation(config) === 'horizontal') {
    if (key === 'ArrowRight') {
      return 'next'
    }

    if (key === 'ArrowLeft') {
      return 'previous'
    }
  }

  if (orientation(config) === 'vertical') {
    if (key === 'ArrowDown') {
      return 'next'
    }

    if (key === 'ArrowUp') {
      return 'previous'
    }
  }

  return undefined
}

const opensMenuFromTrigger = (
  config: Pick<MenubarOptions, 'orientation'>,
  key: string,
): boolean =>
  activationKeys.has(key) ||
  (orientation(config) === 'horizontal' &&
    (key === 'ArrowDown' || key === 'ArrowUp')) ||
  (orientation(config) === 'vertical' &&
    (key === 'ArrowRight' || key === 'ArrowLeft'))

const triggerKeyboardMessage = <Message>(
  config: ViewConfig<Message>,
  menu: MenubarMenuDescriptor,
  key: string,
  modifiers: KeyboardModifiers,
): Option.Option<Message> => {
  if (modifiers.shiftKey || config.isDisabled === true) {
    return Option.none()
  }

  const direction = navigationDirection(config, key)

  if (direction !== undefined) {
    const nextMenu = nextEnabledMenu(config, direction, menu.value)

    if (nextMenu === undefined || nextMenu.value === menu.value) {
      return Option.none()
    }

    return triggerMessage(
      config,
      triggerChange(
        nextMenu.value,
        'keyboard-navigation',
        hasOpenMenu(config),
        menu.value,
        triggerFocusSelector(config, nextMenu),
      ),
    )
  }

  if (opensMenuFromTrigger(config, key)) {
    return openMessage(
      config,
      menu.value,
      Menu.openChange(true, 'keyboard-open'),
    )
  }

  return Option.none()
}

const triggerHoverMessage = <Message>(
  config: ViewConfig<Message>,
  menu: MenubarMenuDescriptor,
): Option.Option<Message> =>
  hasOpenMenu(config) && !menu.open && menu.isDisabled !== true
    ? triggerMessage(
        config,
        triggerChange(
          menu.value,
          'trigger-hover',
          true,
          activeMenuValue(config),
          triggerFocusSelector(config, menu),
        ),
      )
    : Option.none()

const triggerTabindex = (
  config: Pick<MenubarOptions, 'focusedMenuValue' | 'isDisabled' | 'menus'>,
  menu: MenubarMenuDescriptor,
): number => {
  if (config.isDisabled === true || menu.isDisabled === true) {
    return -1
  }

  return activeMenuValue(config) === menu.value ? 0 : -1
}

const menubarRootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.Id(config.id),
  h.Role('menubar'),
  h.AriaOrientation(orientation(config)),
  h.DataAttribute('orientation', orientation(config)),
  ...booleanDataAttribute(h, 'modal', config.modal ?? defaultModal),
  ...booleanDataAttribute(h, 'disabled', config.isDisabled),
  ...booleanDataAttribute(h, 'has-submenu-open', hasOpenMenu(config)),
  ...optionalBooleanAttribute<Message>(config.isDisabled, value =>
    h.AriaDisabled(value),
  ),
  ...(Predicate.isNotUndefined(config.onFocus)
    ? [h.OnFocus(config.onFocus)]
    : []),
  ...(Predicate.isNotUndefined(config.onBlur) ? [h.OnBlur(config.onBlur)] : []),
]

const menubarTriggerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  menu: MenubarMenuDescriptor,
  attributes: Menu.MenuAttributes<Message>,
): ReadonlyArray<Attribute<Message>> => [
  ...attributes.trigger.filter(
    attribute => attribute._tag !== 'OnKeyDownPreventDefault',
  ),
  h.Role('menuitem'),
  h.Tabindex(triggerTabindex(config, menu)),
  h.DataAttribute('menubar-trigger', ''),
  h.DataAttribute('orientation', orientation(config)),
  h.DataAttribute('value', menu.value),
  ...optionalMessageAttribute(triggerHoverMessage(config, menu), message =>
    h.OnMouseEnter(message),
  ),
  h.OnKeyDownPreventDefault((key, modifiers) =>
    triggerKeyboardMessage(config, menu, key, modifiers),
  ),
]

const menubarMenuAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  menu: MenubarMenuDescriptor,
  attributes: Menu.MenuAttributes<Message>,
): MenubarMenuAttributes<Message> => ({
  ...attributes,
  menu,
  root: [
    ...attributes.root,
    h.DataAttribute('menubar-menu', ''),
    h.DataAttribute('value', menu.value),
  ],
  trigger: menubarTriggerAttributes(h, config, menu, attributes),
})

const defaultPopupView = <Message>(
  popup: Menu.MenuPopupAttributes<Message>,
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
            h.div([...popup.arrow.root], []),
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

const defaultMenuView = <Message>(
  attributes: MenubarMenuAttributes<Message>,
): Html => {
  const h = html<Message>()

  return h.div(
    [...attributes.root],
    [
      h.button([...attributes.trigger], [attributes.menu.label]),
      h.div(
        [...attributes.portal],
        [
          ...defaultPopupView(attributes.popup),
          ...attributes.submenus.flatMap(defaultPopupView),
        ],
      ),
    ],
  )
}

const renderMenu = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  menu: MenubarMenuDescriptor,
): Html => {
  const {
    onMenuCheckedChange,
    onMenuHighlightChange,
    onMenuItemPress,
    onMenuOpenChange,
    onMenuRadioValueChange,
  } = config

  return Menu.view<Message>({
    positioning: 'static',
    ...menuOptions(config, menu),
    ...(onMenuOpenChange === undefined
      ? {}
      : {
          onOpenChange: (change: Menu.MenuOpenChange): Message =>
            onMenuOpenChange(
              menuOpenChange(
                menu.value,
                change.open,
                change.reason,
                change.parentValue,
              ),
            ),
        }),
    ...(onMenuHighlightChange === undefined
      ? {}
      : {
          onHighlightChange: (change: Menu.MenuHighlightChange): Message =>
            onMenuHighlightChange(menuHighlightChange(menu.value, change)),
        }),
    ...(onMenuItemPress === undefined
      ? {}
      : {
          onItemPress: (press: Menu.MenuItemPress): Message =>
            onMenuItemPress(menuItemPress(menu.value, press)),
        }),
    ...(onMenuCheckedChange === undefined
      ? {}
      : {
          onCheckedChange: (change: Menu.MenuCheckedChange): Message =>
            onMenuCheckedChange(menuCheckedChange(menu.value, change)),
        }),
    ...(onMenuRadioValueChange === undefined
      ? {}
      : {
          onRadioValueChange: (change: Menu.MenuRadioValueChange): Message =>
            onMenuRadioValueChange(menuRadioValueChange(menu.value, change)),
        }),
    toView: attributes => {
      const menubarAttributes = menubarMenuAttributes(
        h,
        config,
        menu,
        attributes,
      )

      return config.toMenuView === undefined
        ? defaultMenuView(menubarAttributes)
        : config.toMenuView(menubarAttributes)
    },
  })
}

const defaultView = <Message>(attributes: MenubarAttributes<Message>): Html => {
  const h = html<Message>()

  return h.div([...attributes.root], attributes.menus)
}

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const menus = config.menus.map(menu => renderMenu(h, config, menu))
  const attributes: MenubarAttributes<Message> = {
    root: menubarRootAttributes(h, config),
    menus,
    isOpen: hasOpenMenu(config),
    orientation: orientation(config),
  }

  return config.toView === undefined
    ? defaultView(attributes)
    : config.toView(attributes)
}
