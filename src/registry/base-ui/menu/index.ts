import { Option, Predicate, Schema as S } from 'effect'
import type { Command } from 'foldkit'
import type { Attribute, Html, KeyboardModifiers } from 'foldkit/html'
import { html } from 'foldkit/html'

import * as Popover from '../popover'

// MODEL

export const MenuSide = Popover.PopoverSide
export type MenuSide = Popover.PopoverSide

export const MenuAlign = Popover.PopoverAlign
export type MenuAlign = Popover.PopoverAlign

export const MenuTransitionStatus = Popover.PopoverTransitionStatus
export type MenuTransitionStatus = Popover.PopoverTransitionStatus

export const MenuItemKind = S.Union([
  S.Literal('item'),
  S.Literal('checkbox'),
  S.Literal('radio'),
  S.Literal('submenu-trigger'),
])
export type MenuItemKind = typeof MenuItemKind.Type

export const MenuOpenChangeReason = S.Union([
  S.Literal('trigger-press'),
  S.Literal('item-press'),
  S.Literal('outside-press'),
  S.Literal('escape-key'),
  S.Literal('keyboard-open'),
  S.Literal('submenu-open'),
  S.Literal('submenu-close'),
  S.Literal('none'),
])
export type MenuOpenChangeReason = typeof MenuOpenChangeReason.Type

export const MenuHighlightChangeReason = S.Union([
  S.Literal('keyboard-navigation'),
  S.Literal('typeahead'),
  S.Literal('item-hover'),
  S.Literal('none'),
])
export type MenuHighlightChangeReason = typeof MenuHighlightChangeReason.Type

export const MenuOpenChange = S.Struct({
  open: S.Boolean,
  reason: MenuOpenChangeReason,
  parentValue: S.optional(S.String),
})
export type MenuOpenChange = typeof MenuOpenChange.Type

export const MenuHighlightChange = S.Struct({
  value: S.String,
  reason: MenuHighlightChangeReason,
  focusSelector: S.optional(S.String),
})
export type MenuHighlightChange = typeof MenuHighlightChange.Type

export const MenuItemPress = S.Struct({
  value: S.String,
  kind: MenuItemKind,
})
export type MenuItemPress = typeof MenuItemPress.Type

export const MenuCheckedChange = S.Struct({
  value: S.String,
  checked: S.Boolean,
})
export type MenuCheckedChange = typeof MenuCheckedChange.Type

export const MenuRadioValueChange = S.Struct({
  groupValue: S.String,
  value: S.String,
})
export type MenuRadioValueChange = typeof MenuRadioValueChange.Type

export const MenuItemDescriptor = S.Struct({
  id: S.optional(S.String),
  value: S.String,
  label: S.String,
  textValue: S.optional(S.String),
  kind: S.optional(MenuItemKind),
  isDisabled: S.optional(S.Boolean),
  isChecked: S.optional(S.Boolean),
  radioGroupValue: S.optional(S.String),
  parentValue: S.optional(S.String),
})
export type MenuItemDescriptor = typeof MenuItemDescriptor.Type

export const MenuOptions = S.Struct({
  id: S.String,
  open: S.Boolean,
  items: S.Array(MenuItemDescriptor),
  highlightedValue: S.optional(S.String),
  openSubmenuValues: S.optional(S.Array(S.String)),
  forceMount: S.optional(S.Boolean),
  transitionStatus: S.optional(MenuTransitionStatus),
  isDisabled: S.optional(S.Boolean),
  side: S.optional(MenuSide),
  align: S.optional(MenuAlign),
  sideOffset: S.optional(S.Number),
  alignOffset: S.optional(S.Number),
  collisionAvoidance: S.optional(S.Boolean),
  collisionPadding: S.optional(S.Number),
  triggerId: S.optional(S.String),
  triggerSelector: S.optional(S.String),
})
export type MenuOptions = typeof MenuOptions.Type

// UPDATE

const defaultSide: MenuSide = 'bottom'
const defaultAlign: MenuAlign = 'start'
const defaultSubmenuSide: MenuSide = 'right'
const defaultSubmenuAlign: MenuAlign = 'start'
const defaultSideOffset = 0
const defaultAlignOffset = 0
const defaultCollisionAvoidance = true
const defaultCollisionPadding = 0

const activationKeys = new Set(['Enter', ' '])
const searchKeyPattern = /^[\p{Letter}\p{Number}]$/u

export const {
  FocusPopover: FocusMenu,
  RestorePopoverFocus: RestoreMenuFocus,
} = Popover

export const triggerId = (config: Pick<MenuOptions, 'id' | 'triggerId'>) =>
  config.triggerId ?? `${config.id}-trigger`

export const triggerSelector = (
  config: Pick<MenuOptions, 'id' | 'triggerId' | 'triggerSelector'>,
) => config.triggerSelector ?? `#${triggerId(config)}`

export const popupId = (
  config: Pick<MenuOptions, 'id'>,
  parentValue?: string | undefined,
): string =>
  parentValue === undefined
    ? `${config.id}-popup`
    : `${config.id}-submenu-${parentValue}-popup`

export const positionerId = (
  config: Pick<MenuOptions, 'id'>,
  parentValue?: string | undefined,
): string =>
  parentValue === undefined
    ? `${config.id}-positioner`
    : `${config.id}-submenu-${parentValue}-positioner`

export const arrowId = (
  config: Pick<MenuOptions, 'id'>,
  parentValue?: string | undefined,
): string =>
  parentValue === undefined
    ? `${config.id}-arrow`
    : `${config.id}-submenu-${parentValue}-arrow`

export const groupLabelId = (
  config: Pick<MenuOptions, 'id'>,
  parentValue?: string | undefined,
): string =>
  parentValue === undefined
    ? `${config.id}-group-label`
    : `${config.id}-submenu-${parentValue}-group-label`

export const itemKind = (item: MenuItemDescriptor): MenuItemKind =>
  item.kind ?? 'item'

export const itemId = (
  config: Pick<MenuOptions, 'id'>,
  item: MenuItemDescriptor,
): string => item.id ?? `${config.id}-item-${item.value}`

export const itemFocusSelector = (
  config: Pick<MenuOptions, 'id'>,
  item: MenuItemDescriptor,
): string => `#${itemId(config, item)}`

export const itemsForParent = (
  config: Pick<MenuOptions, 'items'>,
  parentValue?: string | undefined,
): ReadonlyArray<MenuItemDescriptor> =>
  config.items.filter(item => item.parentValue === parentValue)

export const enabledItems = (
  config: Pick<MenuOptions, 'isDisabled' | 'items'>,
  parentValue?: string | undefined,
): ReadonlyArray<MenuItemDescriptor> =>
  config.isDisabled === true
    ? []
    : itemsForParent(config, parentValue).filter(
        item => item.isDisabled !== true,
      )

export const highlightedItem = (
  config: Pick<MenuOptions, 'highlightedValue' | 'items'>,
): MenuItemDescriptor | undefined =>
  config.items.find(item => item.value === config.highlightedValue)

export const openChange = (
  open: boolean,
  reason: MenuOpenChangeReason = 'none',
  parentValue?: string | undefined,
): MenuOpenChange => ({ open, reason, parentValue })

export const highlightChange = (
  config: Pick<MenuOptions, 'id'>,
  item: MenuItemDescriptor,
  reason: MenuHighlightChangeReason = 'none',
): MenuHighlightChange => ({
  value: item.value,
  reason,
  focusSelector: itemFocusSelector(config, item),
})

export const itemPress = (item: MenuItemDescriptor): MenuItemPress => ({
  value: item.value,
  kind: itemKind(item),
})

export const checkedChange = (item: MenuItemDescriptor): MenuCheckedChange => ({
  value: item.value,
  checked: item.isChecked !== true,
})

export const radioValueChange = (
  item: MenuItemDescriptor,
): MenuRadioValueChange => ({
  groupValue: item.radioGroupValue ?? 'default',
  value: item.value,
})

const keyboardDirection = (
  key: string,
): 'first' | 'last' | 'next' | 'previous' | undefined => {
  if (key === 'ArrowDown') {
    return 'next'
  }

  if (key === 'ArrowUp') {
    return 'previous'
  }

  if (key === 'Home') {
    return 'first'
  }

  if (key === 'End') {
    return 'last'
  }

  return undefined
}

const indexOffset = (
  currentIndex: number,
  direction: 'next' | 'previous',
): number => currentIndex + (direction === 'next' ? 1 : -1)

export const nextHighlightedItem = (
  config: Pick<MenuOptions, 'highlightedValue' | 'isDisabled' | 'items'>,
  direction: 'first' | 'last' | 'next' | 'previous',
  parentValue?: string | undefined,
): MenuItemDescriptor | undefined => {
  const enabled = enabledItems(config, parentValue)

  if (direction === 'first') {
    return enabled[0]
  }

  if (direction === 'last') {
    return enabled.at(-1)
  }

  const currentIndex = enabled.findIndex(
    item => item.value === config.highlightedValue,
  )
  const resolvedCurrentIndex = currentIndex === -1 ? 0 : currentIndex
  const candidateIndex = indexOffset(resolvedCurrentIndex, direction)

  if (candidateIndex >= 0 && candidateIndex < enabled.length) {
    return enabled[candidateIndex]
  }

  return enabled[resolvedCurrentIndex]
}

export const typeaheadItem = (
  config: Pick<MenuOptions, 'highlightedValue' | 'isDisabled' | 'items'>,
  search: string,
  parentValue?: string | undefined,
): MenuItemDescriptor | undefined => {
  const enabled = enabledItems(config, parentValue)
  const normalizedSearch = search.toLocaleLowerCase()
  const currentIndex = enabled.findIndex(
    item => item.value === config.highlightedValue,
  )
  const orderedItems =
    currentIndex === -1
      ? enabled
      : [
          ...enabled.slice(currentIndex + 1),
          ...enabled.slice(0, currentIndex + 1),
        ]

  return orderedItems.find(item =>
    (item.textValue ?? item.label)
      .toLocaleLowerCase()
      .startsWith(normalizedSearch),
  )
}

const popoverChangeReason = (
  change: MenuOpenChange,
): Popover.PopoverChangeReason => {
  if (change.reason === 'outside-press') {
    return 'outside-press'
  }

  if (change.reason === 'escape-key') {
    return 'escape-key'
  }

  return change.open ? 'trigger-press' : 'close-press'
}

export const commandForOpenChange = (
  config: Pick<MenuOptions, 'id' | 'triggerId' | 'triggerSelector'>,
  change: MenuOpenChange,
): Command.Command<Popover.CommandMessage> =>
  Popover.commandForOpenChange(
    {
      id: config.id,
      triggerId: triggerId(config),
      triggerSelector: triggerSelector(config),
      focusSelector: `#${popupId(config, change.parentValue)}`,
    },
    Popover.openChange(change.open, popoverChangeReason(change)),
  )

// VIEW

export type MenuPartAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  isMounted: boolean
  isOpen: boolean
}>

export type MenuItemAttributes<Message> = Readonly<{
  item: MenuItemDescriptor
  root: ReadonlyArray<Attribute<Message>>
  label: ReadonlyArray<Attribute<Message>>
  indicator: ReadonlyArray<Attribute<Message>>
  submenuIndicator: ReadonlyArray<Attribute<Message>>
}>

export type MenuPopupAttributes<Message> = Readonly<{
  parentValue?: string | undefined
  positioner: MenuPartAttributes<Message>
  backdrop: MenuPartAttributes<Message>
  popup: MenuPartAttributes<Message>
  arrow: MenuPartAttributes<Message>
  group: ReadonlyArray<Attribute<Message>>
  groupLabel: ReadonlyArray<Attribute<Message>>
  separator: ReadonlyArray<Attribute<Message>>
  items: ReadonlyArray<MenuItemAttributes<Message>>
  isMounted: boolean
  isOpen: boolean
}>

export type MenuAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  trigger: ReadonlyArray<Attribute<Message>>
  portal: ReadonlyArray<Attribute<Message>>
  popup: MenuPopupAttributes<Message>
  submenus: ReadonlyArray<MenuPopupAttributes<Message>>
  isMounted: boolean
  isOpen: boolean
}>

export type ViewConfig<Message> = MenuOptions &
  Readonly<{
    toView: (attributes: MenuAttributes<Message>) => Html
    onOpenChange?: (change: MenuOpenChange) => Message
    onHighlightChange?: (change: MenuHighlightChange) => Message
    onItemPress?: (press: MenuItemPress) => Message
    onCheckedChange?: (change: MenuCheckedChange) => Message
    onRadioValueChange?: (change: MenuRadioValueChange) => Message
    onFocus?: Message
    onBlur?: Message
  }>

const resolvedSide = (
  config: Pick<MenuOptions, 'side'>,
  parentValue?: string | undefined,
): MenuSide =>
  parentValue === undefined ? (config.side ?? defaultSide) : defaultSubmenuSide

const resolvedAlign = (
  config: Pick<MenuOptions, 'align'>,
  parentValue?: string | undefined,
): MenuAlign =>
  parentValue === undefined
    ? (config.align ?? defaultAlign)
    : defaultSubmenuAlign

const mounted = (
  config: Pick<MenuOptions, 'forceMount' | 'open' | 'transitionStatus'>,
  isOpen: boolean,
): boolean =>
  isOpen ||
  config.open ||
  config.forceMount === true ||
  config.transitionStatus === 'ending'

const submenuValues = (
  config: Pick<MenuOptions, 'openSubmenuValues'>,
): ReadonlyArray<string> => config.openSubmenuValues ?? []

const isSubmenuOpen = (
  config: Pick<MenuOptions, 'open' | 'openSubmenuValues'>,
  parentValue: string,
): boolean => config.open && submenuValues(config).includes(parentValue)

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

const openMessage = <Message>(
  config: Pick<ViewConfig<Message>, 'onOpenChange'>,
  change: MenuOpenChange,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onOpenChange)
    ? Option.some(config.onOpenChange(change))
    : Option.none()

const highlightMessage = <Message>(
  config: Pick<ViewConfig<Message>, 'id' | 'isDisabled' | 'onHighlightChange'>,
  item: MenuItemDescriptor,
  reason: MenuHighlightChangeReason,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onHighlightChange) &&
  config.isDisabled !== true &&
  item.isDisabled !== true
    ? Option.some(
        config.onHighlightChange(highlightChange(config, item, reason)),
      )
    : Option.none()

const itemPressMessage = <Message>(
  config: Pick<ViewConfig<Message>, 'isDisabled' | 'onItemPress'>,
  item: MenuItemDescriptor,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onItemPress) &&
  config.isDisabled !== true &&
  item.isDisabled !== true &&
  itemKind(item) === 'item'
    ? Option.some(config.onItemPress(itemPress(item)))
    : Option.none()

const checkedMessage = <Message>(
  config: Pick<ViewConfig<Message>, 'isDisabled' | 'onCheckedChange'>,
  item: MenuItemDescriptor,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onCheckedChange) &&
  config.isDisabled !== true &&
  item.isDisabled !== true &&
  itemKind(item) === 'checkbox'
    ? Option.some(config.onCheckedChange(checkedChange(item)))
    : Option.none()

const radioMessage = <Message>(
  config: Pick<ViewConfig<Message>, 'isDisabled' | 'onRadioValueChange'>,
  item: MenuItemDescriptor,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onRadioValueChange) &&
  config.isDisabled !== true &&
  item.isDisabled !== true &&
  itemKind(item) === 'radio'
    ? Option.some(config.onRadioValueChange(radioValueChange(item)))
    : Option.none()

const openStateDataAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  open: boolean,
): ReadonlyArray<Attribute<Message>> =>
  open ? [h.DataAttribute('open', '')] : [h.DataAttribute('closed', '')]

const transitionDataAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  transitionStatus: MenuTransitionStatus | undefined,
): ReadonlyArray<Attribute<Message>> => {
  if (transitionStatus === 'starting') {
    return [h.DataAttribute('starting-style', '')]
  }

  if (transitionStatus === 'ending') {
    return [h.DataAttribute('ending-style', '')]
  }

  return []
}

const placementAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  parentValue?: string | undefined,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('side', resolvedSide(config, parentValue)),
  h.DataAttribute('align', resolvedAlign(config, parentValue)),
  h.DataAttribute(
    'side-offset',
    String(
      parentValue === undefined ? (config.sideOffset ?? defaultSideOffset) : 0,
    ),
  ),
  h.DataAttribute(
    'align-offset',
    String(
      parentValue === undefined
        ? (config.alignOffset ?? defaultAlignOffset)
        : -3,
    ),
  ),
  h.DataAttribute(
    'collision-avoidance',
    String(config.collisionAvoidance ?? defaultCollisionAvoidance),
  ),
  h.DataAttribute(
    'collision-padding',
    String(config.collisionPadding ?? defaultCollisionPadding),
  ),
]

const rootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('side', resolvedSide(config)),
  h.DataAttribute('align', resolvedAlign(config)),
  ...booleanDataAttribute(h, 'disabled', config.isDisabled),
]

const triggerKeyboardMessage = <Message>(
  config: ViewConfig<Message>,
  key: string,
  modifiers: KeyboardModifiers,
): Option.Option<Message> => {
  if (modifiers.shiftKey || config.isDisabled === true) {
    return Option.none()
  }

  if (activationKeys.has(key) || key === 'ArrowDown' || key === 'ArrowUp') {
    return openMessage(config, openChange(true, 'keyboard-open'))
  }

  return Option.none()
}

const triggerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.Id(triggerId(config)),
  h.Type('button'),
  h.AriaHasPopup('menu'),
  h.AriaExpanded(config.open),
  h.AriaControls(popupId(config)),
  ...booleanDataAttribute(h, 'disabled', config.isDisabled),
  ...(config.open ? [h.DataAttribute('popup-open', '')] : []),
  ...optionalBooleanAttribute<Message>(config.isDisabled, value =>
    h.AriaDisabled(value),
  ),
  ...optionalMessageAttribute(
    config.isDisabled === true
      ? Option.none()
      : openMessage(config, openChange(!config.open, 'trigger-press')),
    message => h.OnClick(message),
  ),
  h.OnKeyDownPreventDefault((key, modifiers) =>
    triggerKeyboardMessage(config, key, modifiers),
  ),
  ...(Predicate.isNotUndefined(config.onFocus)
    ? [h.OnFocus(config.onFocus)]
    : []),
  ...(Predicate.isNotUndefined(config.onBlur) ? [h.OnBlur(config.onBlur)] : []),
]

const portalAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
): ReadonlyArray<Attribute<Message>> => [h.DataAttribute('portal', '')]

const positionerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  isOpen: boolean,
  isMounted: boolean,
  parentValue?: string | undefined,
): MenuPartAttributes<Message> => ({
  root: isMounted
    ? [
        h.Id(positionerId(config, parentValue)),
        ...(isOpen ? [] : [h.Hidden(true)]),
        ...openStateDataAttributes(h, isOpen),
        ...placementAttributes(h, config, parentValue),
        h.Style({ position: 'absolute', inset: 'auto', margin: '0' }),
      ]
    : [],
  isMounted,
  isOpen,
})

const backdropAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  isOpen: boolean,
  isMounted: boolean,
  parentValue?: string | undefined,
): MenuPartAttributes<Message> => ({
  root: isMounted
    ? [
        h.Role('presentation'),
        ...(isOpen ? [] : [h.Hidden(true)]),
        ...openStateDataAttributes(h, isOpen),
        ...transitionDataAttributes(h, config.transitionStatus),
        ...optionalMessageAttribute(
          openMessage(config, openChange(false, 'outside-press', parentValue)),
          message => h.OnClick(message),
        ),
      ]
    : [],
  isMounted,
  isOpen,
})

const popupKeyboardMessage = <Message>(
  config: ViewConfig<Message>,
  key: string,
  modifiers: KeyboardModifiers,
  parentValue?: string | undefined,
): Option.Option<Message> => {
  if (modifiers.shiftKey) {
    return Option.none()
  }

  if (key === 'Escape') {
    return openMessage(config, openChange(false, 'escape-key', parentValue))
  }

  if (key === 'ArrowLeft' && parentValue !== undefined) {
    return openMessage(config, openChange(false, 'submenu-close', parentValue))
  }

  if (key === 'ArrowRight') {
    const item = highlightedItem(config)

    if (item !== undefined && itemKind(item) === 'submenu-trigger') {
      return openMessage(config, openChange(true, 'submenu-open', item.value))
    }
  }

  const direction = keyboardDirection(key)

  if (direction !== undefined) {
    const item = nextHighlightedItem(config, direction, parentValue)

    return item === undefined
      ? Option.none()
      : highlightMessage(config, item, 'keyboard-navigation')
  }

  if (searchKeyPattern.test(key)) {
    const item = typeaheadItem(config, key, parentValue)

    return item === undefined
      ? Option.none()
      : highlightMessage(config, item, 'typeahead')
  }

  return Option.none()
}

const popupAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  isOpen: boolean,
  isMounted: boolean,
  parentValue?: string | undefined,
): MenuPartAttributes<Message> => ({
  root: isMounted
    ? [
        h.Id(popupId(config, parentValue)),
        h.Popover('manual'),
        h.Role('menu'),
        h.Tabindex(-1),
        ...(isOpen ? [] : [h.Hidden(true)]),
        ...openStateDataAttributes(h, isOpen),
        ...transitionDataAttributes(h, config.transitionStatus),
        ...placementAttributes(h, config, parentValue),
        h.OnKeyDownPreventDefault((key, modifiers) =>
          popupKeyboardMessage(config, key, modifiers, parentValue),
        ),
      ]
    : [],
  isMounted,
  isOpen,
})

const positionedPartAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  isOpen: boolean,
  isMounted: boolean,
  id: string,
  parentValue?: string | undefined,
): MenuPartAttributes<Message> => ({
  root: isMounted
    ? [
        h.Id(id),
        ...(isOpen ? [] : [h.Hidden(true)]),
        ...openStateDataAttributes(h, isOpen),
        ...placementAttributes(h, config, parentValue),
      ]
    : [],
  isMounted,
  isOpen,
})

const itemRole = (item: MenuItemDescriptor): string => {
  const kind = itemKind(item)

  if (kind === 'checkbox') {
    return 'menuitemcheckbox'
  }

  if (kind === 'radio') {
    return 'menuitemradio'
  }

  return 'menuitem'
}

const itemStateDataAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: MenuItemDescriptor,
): ReadonlyArray<Attribute<Message>> => [
  ...(config.highlightedValue === item.value
    ? [h.DataAttribute('highlighted', '')]
    : []),
  ...booleanDataAttribute(h, 'disabled', item.isDisabled),
  ...(itemKind(item) === 'checkbox' || itemKind(item) === 'radio'
    ? [
        item.isChecked === true
          ? h.DataAttribute('checked', '')
          : h.DataAttribute('unchecked', ''),
      ]
    : []),
  ...(itemKind(item) === 'submenu-trigger' && isSubmenuOpen(config, item.value)
    ? [h.DataAttribute('popup-open', ''), h.DataAttribute('open', '')]
    : []),
]

const itemClickMessage = <Message>(
  config: ViewConfig<Message>,
  item: MenuItemDescriptor,
): Option.Option<Message> => {
  if (itemKind(item) === 'checkbox') {
    return checkedMessage(config, item)
  }

  if (itemKind(item) === 'radio') {
    return radioMessage(config, item)
  }

  if (itemKind(item) === 'submenu-trigger') {
    return openMessage(config, openChange(true, 'submenu-open', item.value))
  }

  return itemPressMessage(config, item)
}

const itemAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: MenuItemDescriptor,
): ReadonlyArray<Attribute<Message>> => [
  h.Id(itemId(config, item)),
  h.Role(itemRole(item)),
  h.Tabindex(config.open && config.highlightedValue === item.value ? 0 : -1),
  ...(itemKind(item) === 'checkbox' || itemKind(item) === 'radio'
    ? [h.AriaChecked(item.isChecked === true)]
    : []),
  ...(itemKind(item) === 'submenu-trigger'
    ? [
        h.AriaHasPopup('menu'),
        h.AriaExpanded(isSubmenuOpen(config, item.value)),
        h.AriaControls(popupId(config, item.value)),
      ]
    : []),
  ...optionalBooleanAttribute<Message>(item.isDisabled, value =>
    h.AriaDisabled(value),
  ),
  ...itemStateDataAttributes(h, config, item),
  ...optionalMessageAttribute(itemClickMessage(config, item), message =>
    h.OnClick(message),
  ),
  ...optionalMessageAttribute(
    highlightMessage(config, item, 'item-hover'),
    message => h.OnMouseEnter(message),
  ),
  ...optionalMessageAttribute(itemClickMessage(config, item), message =>
    h.OnKeyDownPreventDefault(key =>
      activationKeys.has(key) ? Option.some(message) : Option.none(),
    ),
  ),
]

const itemLabelAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: MenuItemDescriptor,
): ReadonlyArray<Attribute<Message>> => itemStateDataAttributes(h, config, item)

const itemIndicatorAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: MenuItemDescriptor,
): ReadonlyArray<Attribute<Message>> =>
  itemKind(item) === 'checkbox' || itemKind(item) === 'radio'
    ? itemStateDataAttributes(h, config, item)
    : []

const submenuIndicatorAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: MenuItemDescriptor,
): ReadonlyArray<Attribute<Message>> =>
  itemKind(item) === 'submenu-trigger'
    ? itemStateDataAttributes(h, config, item)
    : []

const menuItems = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  parentValue?: string | undefined,
): ReadonlyArray<MenuItemAttributes<Message>> =>
  itemsForParent(config, parentValue).map(item => ({
    item,
    root: itemAttributes(h, config, item),
    label: itemLabelAttributes(h, config, item),
    indicator: itemIndicatorAttributes(h, config, item),
    submenuIndicator: submenuIndicatorAttributes(h, config, item),
  }))

const popupParts = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  parentValue?: string | undefined,
): MenuPopupAttributes<Message> => {
  const isOpen =
    parentValue === undefined ? config.open : isSubmenuOpen(config, parentValue)
  const isMounted = mounted(config, isOpen)

  return {
    parentValue,
    positioner: positionerAttributes(h, config, isOpen, isMounted, parentValue),
    backdrop: backdropAttributes(h, config, isOpen, isMounted, parentValue),
    popup: popupAttributes(h, config, isOpen, isMounted, parentValue),
    arrow: positionedPartAttributes(
      h,
      config,
      isOpen,
      isMounted,
      arrowId(config, parentValue),
      parentValue,
    ),
    group: isMounted ? [h.Role('group')] : [],
    groupLabel: isMounted ? [h.Id(groupLabelId(config, parentValue))] : [],
    separator: isMounted
      ? [h.Role('separator'), h.AriaOrientation('horizontal')]
      : [],
    items: menuItems(h, config, parentValue),
    isMounted,
    isOpen,
  }
}

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const submenus = config.items
    .filter(item => itemKind(item) === 'submenu-trigger')
    .map(item => popupParts(h, config, item.value))

  return config.toView({
    root: rootAttributes(h, config),
    trigger: triggerAttributes(h, config),
    portal: portalAttributes(h),
    popup: popupParts(h, config),
    submenus,
    isMounted: mounted(config, config.open),
    isOpen: config.open,
  })
}
