import { Option, Predicate, Schema as S } from 'effect'
import type { Command } from 'foldkit'
import type { Attribute, Html, KeyboardModifiers } from 'foldkit/html'
import { html } from 'foldkit/html'

import * as Popover from '../popover'

// MODEL

export const SelectSide = Popover.PopoverSide
export type SelectSide = Popover.PopoverSide

export const SelectAlign = Popover.PopoverAlign
export type SelectAlign = Popover.PopoverAlign

export const SelectTransitionStatus = Popover.PopoverTransitionStatus
export type SelectTransitionStatus = Popover.PopoverTransitionStatus

export const SelectOpenChangeReason = S.Union([
  S.Literal('trigger-press'),
  S.Literal('item-press'),
  S.Literal('outside-press'),
  S.Literal('escape-key'),
  S.Literal('keyboard-open'),
  S.Literal('none'),
])
export type SelectOpenChangeReason = typeof SelectOpenChangeReason.Type

export const SelectValueChangeReason = S.Union([
  S.Literal('item-press'),
  S.Literal('keyboard-select'),
  S.Literal('none'),
])
export type SelectValueChangeReason = typeof SelectValueChangeReason.Type

export const SelectHighlightChangeReason = S.Union([
  S.Literal('keyboard-navigation'),
  S.Literal('typeahead'),
  S.Literal('item-hover'),
  S.Literal('none'),
])
export type SelectHighlightChangeReason =
  typeof SelectHighlightChangeReason.Type

export const SelectOpenChange = S.Struct({
  open: S.Boolean,
  reason: SelectOpenChangeReason,
})
export type SelectOpenChange = typeof SelectOpenChange.Type

export const SelectValueChange = S.Struct({
  value: S.String,
  label: S.String,
  reason: SelectValueChangeReason,
})
export type SelectValueChange = typeof SelectValueChange.Type

export const SelectHighlightChange = S.Struct({
  value: S.String,
  reason: SelectHighlightChangeReason,
  focusSelector: S.optional(S.String),
})
export type SelectHighlightChange = typeof SelectHighlightChange.Type

export const SelectItemDescriptor = S.Struct({
  id: S.optional(S.String),
  value: S.String,
  label: S.String,
  textValue: S.optional(S.String),
  isDisabled: S.optional(S.Boolean),
})
export type SelectItemDescriptor = typeof SelectItemDescriptor.Type

export const SelectOptions = S.Struct({
  id: S.String,
  open: S.Boolean,
  value: S.optional(S.String),
  highlightedValue: S.optional(S.String),
  items: S.Array(SelectItemDescriptor),
  placeholder: S.optional(S.String),
  name: S.optional(S.String),
  form: S.optional(S.String),
  forceMount: S.optional(S.Boolean),
  transitionStatus: S.optional(SelectTransitionStatus),
  isDisabled: S.optional(S.Boolean),
  isInvalid: S.optional(S.Boolean),
  isRequired: S.optional(S.Boolean),
  isReadOnly: S.optional(S.Boolean),
  side: S.optional(SelectSide),
  align: S.optional(SelectAlign),
  sideOffset: S.optional(S.Number),
  alignOffset: S.optional(S.Number),
  collisionAvoidance: S.optional(S.Boolean),
  collisionPadding: S.optional(S.Number),
  alignItemWithTrigger: S.optional(S.Boolean),
})
export type SelectOptions = typeof SelectOptions.Type

// UPDATE

const defaultSide: SelectSide = 'bottom'
const defaultAlign: SelectAlign = 'center'
const defaultSideOffset = 0
const defaultAlignOffset = 0
const defaultCollisionAvoidance = true
const defaultCollisionPadding = 0
const defaultAlignItemWithTrigger = true

const activationKeys = new Set(['Enter', ' '])
const searchKeyPattern = /^[\p{Letter}\p{Number}]$/u

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

export const {
  FocusPopover: FocusSelect,
  RestorePopoverFocus: RestoreSelectFocus,
} = Popover

export const triggerId = (config: Pick<SelectOptions, 'id'>): string =>
  `${config.id}-trigger`

export const popupId = (config: Pick<SelectOptions, 'id'>): string =>
  `${config.id}-popup`

export const listId = (config: Pick<SelectOptions, 'id'>): string =>
  `${config.id}-list`

export const positionerId = (config: Pick<SelectOptions, 'id'>): string =>
  `${config.id}-positioner`

export const arrowId = (config: Pick<SelectOptions, 'id'>): string =>
  `${config.id}-arrow`

export const valueId = (config: Pick<SelectOptions, 'id'>): string =>
  `${config.id}-value`

export const iconId = (config: Pick<SelectOptions, 'id'>): string =>
  `${config.id}-icon`

export const scrollUpId = (config: Pick<SelectOptions, 'id'>): string =>
  `${config.id}-scroll-up`

export const scrollDownId = (config: Pick<SelectOptions, 'id'>): string =>
  `${config.id}-scroll-down`

export const itemId = (
  config: Pick<SelectOptions, 'id'>,
  item: SelectItemDescriptor,
): string => item.id ?? `${config.id}-item-${item.value}`

export const itemFocusSelector = (
  config: Pick<SelectOptions, 'id'>,
  item: SelectItemDescriptor,
): string => `#${itemId(config, item)}`

export const selectedItem = (
  config: Pick<SelectOptions, 'items' | 'value'>,
): SelectItemDescriptor | undefined =>
  config.items.find(item => item.value === config.value)

export const displayValue = (
  config: Pick<SelectOptions, 'items' | 'placeholder' | 'value'>,
): string => selectedItem(config)?.label ?? config.placeholder ?? ''

export const hasSelectedValue = (
  config: Pick<SelectOptions, 'items' | 'value'>,
): boolean => selectedItem(config) !== undefined

export const enabledItems = (
  config: Pick<SelectOptions, 'isDisabled' | 'items'>,
): ReadonlyArray<SelectItemDescriptor> =>
  config.isDisabled === true
    ? []
    : config.items.filter(item => item.isDisabled !== true)

export const highlightedItem = (
  config: Pick<SelectOptions, 'highlightedValue' | 'items'>,
): SelectItemDescriptor | undefined =>
  config.items.find(item => item.value === config.highlightedValue)

export const firstEnabledItem = (
  config: Pick<SelectOptions, 'isDisabled' | 'items'>,
): SelectItemDescriptor | undefined => enabledItems(config)[0]

export const lastEnabledItem = (
  config: Pick<SelectOptions, 'isDisabled' | 'items'>,
): SelectItemDescriptor | undefined => enabledItems(config).at(-1)

export const openChange = (
  open: boolean,
  reason: SelectOpenChangeReason = 'none',
): SelectOpenChange => ({
  open,
  reason,
})

export const valueChange = (
  item: SelectItemDescriptor,
  reason: SelectValueChangeReason = 'none',
): SelectValueChange => ({
  value: item.value,
  label: item.label,
  reason,
})

export const highlightChange = (
  config: Pick<SelectOptions, 'id'>,
  item: SelectItemDescriptor,
  reason: SelectHighlightChangeReason = 'none',
): SelectHighlightChange => ({
  value: item.value,
  reason,
  focusSelector: itemFocusSelector(config, item),
})

const popoverChangeReason = (
  change: SelectOpenChange,
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
  config: Pick<SelectOptions, 'id'>,
  change: SelectOpenChange,
): Command.Command<Popover.CommandMessage> =>
  Popover.commandForOpenChange(
    {
      id: config.id,
      triggerId: triggerId(config),
      triggerSelector: `#${triggerId(config)}`,
      focusSelector: `#${popupId(config)}`,
    },
    Popover.openChange(change.open, popoverChangeReason(change)),
  )

const indexOffset = (
  currentIndex: number,
  direction: 'next' | 'previous',
): number => currentIndex + (direction === 'next' ? 1 : -1)

export const nextHighlightedItem = (
  config: Pick<SelectOptions, 'highlightedValue' | 'isDisabled' | 'items'>,
  direction: 'first' | 'last' | 'next' | 'previous',
): SelectItemDescriptor | undefined => {
  const enabled = enabledItems(config)

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
  config: Pick<SelectOptions, 'highlightedValue' | 'isDisabled' | 'items'>,
  search: string,
): SelectItemDescriptor | undefined => {
  const enabled = enabledItems(config)
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

// VIEW

export type SelectPartAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  isMounted: boolean
  isOpen: boolean
}>

export type SelectItemAttributes<Message> = Readonly<{
  item: SelectItemDescriptor
  root: ReadonlyArray<Attribute<Message>>
  text: ReadonlyArray<Attribute<Message>>
  indicator: ReadonlyArray<Attribute<Message>>
}>

export type SelectAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  trigger: ReadonlyArray<Attribute<Message>>
  value: ReadonlyArray<Attribute<Message>>
  icon: ReadonlyArray<Attribute<Message>>
  portal: ReadonlyArray<Attribute<Message>>
  positioner: SelectPartAttributes<Message>
  backdrop: SelectPartAttributes<Message>
  popup: SelectPartAttributes<Message>
  list: SelectPartAttributes<Message>
  arrow: SelectPartAttributes<Message>
  scrollUp: SelectPartAttributes<Message>
  scrollDown: SelectPartAttributes<Message>
  group: ReadonlyArray<Attribute<Message>>
  groupLabel: ReadonlyArray<Attribute<Message>>
  separator: ReadonlyArray<Attribute<Message>>
  items: ReadonlyArray<SelectItemAttributes<Message>>
  hiddenInput: ReadonlyArray<Attribute<Message>>
  isMounted: boolean
  isOpen: boolean
}>

export type ViewConfig<Message> = SelectOptions &
  Readonly<{
    toView: (attributes: SelectAttributes<Message>) => Html
    onOpenChange?: (change: SelectOpenChange) => Message
    onValueChange?: (change: SelectValueChange) => Message
    onHighlightChange?: (change: SelectHighlightChange) => Message
    onFocus?: Message
    onBlur?: Message
  }>

const resolvedSide = (config: Pick<SelectOptions, 'side'>): SelectSide =>
  config.side ?? defaultSide

const resolvedAlign = (config: Pick<SelectOptions, 'align'>): SelectAlign =>
  config.align ?? defaultAlign

const isMounted = (
  config: Pick<SelectOptions, 'forceMount' | 'open' | 'transitionStatus'>,
): boolean =>
  config.open ||
  config.forceMount === true ||
  config.transitionStatus === 'ending'

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
  change: SelectOpenChange,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onOpenChange)
    ? Option.some(config.onOpenChange(change))
    : Option.none()

const valueMessage = <Message>(
  config: Pick<
    ViewConfig<Message>,
    'isDisabled' | 'isReadOnly' | 'onValueChange'
  >,
  item: SelectItemDescriptor,
  reason: SelectValueChangeReason,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onValueChange) &&
  config.isDisabled !== true &&
  config.isReadOnly !== true &&
  item.isDisabled !== true
    ? Option.some(config.onValueChange(valueChange(item, reason)))
    : Option.none()

const highlightMessage = <Message>(
  config: Pick<ViewConfig<Message>, 'id' | 'isDisabled' | 'onHighlightChange'>,
  item: SelectItemDescriptor,
  reason: SelectHighlightChangeReason,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onHighlightChange) &&
  config.isDisabled !== true
    ? Option.some(
        config.onHighlightChange(highlightChange(config, item, reason)),
      )
    : Option.none()

const openStateDataAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  open: boolean,
): ReadonlyArray<Attribute<Message>> =>
  open ? [h.DataAttribute('open', '')] : [h.DataAttribute('closed', '')]

const transitionDataAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  transitionStatus: SelectTransitionStatus | undefined,
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
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('side', resolvedSide(config)),
  h.DataAttribute('align', resolvedAlign(config)),
  h.DataAttribute(
    'side-offset',
    String(config.sideOffset ?? defaultSideOffset),
  ),
  h.DataAttribute(
    'align-offset',
    String(config.alignOffset ?? defaultAlignOffset),
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
  ...booleanDataAttribute(h, 'readonly', config.isReadOnly),
  ...booleanDataAttribute(h, 'required', config.isRequired),
  ...booleanDataAttribute(h, 'invalid', config.isInvalid),
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
  h.AriaHasPopup('listbox'),
  h.AriaExpanded(config.open),
  h.AriaControls(popupId(config)),
  h.AriaLabelledBy(valueId(config)),
  ...(config.highlightedValue === undefined
    ? []
    : [
        h.AriaActiveDescendant(
          itemId(config, { value: config.highlightedValue, label: '' }),
        ),
      ]),
  ...booleanDataAttribute(h, 'disabled', config.isDisabled),
  ...(config.open ? [h.DataAttribute('popup-open', '')] : []),
  ...(hasSelectedValue(config) ? [] : [h.DataAttribute('placeholder', '')]),
  ...optionalBooleanAttribute<Message>(config.isDisabled, value =>
    h.AriaDisabled(value),
  ),
  ...(config.isInvalid === true ? [h.AriaInvalid(true)] : []),
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

const valueAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.Id(valueId(config)),
  ...(hasSelectedValue(config) ? [] : [h.DataAttribute('placeholder', '')]),
]

const iconAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.Id(iconId(config)),
  h.AriaHidden(true),
  ...(config.open ? [h.DataAttribute('popup-open', '')] : []),
]

const portalAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
): ReadonlyArray<Attribute<Message>> => [h.DataAttribute('portal', '')]

const positionedPartAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  mounted: boolean,
  id: string,
): SelectPartAttributes<Message> => ({
  root: mounted
    ? [
        h.Id(id),
        ...(config.open ? [] : [h.Hidden(true)]),
        ...openStateDataAttributes(h, config.open),
        ...placementAttributes(h, config),
      ]
    : [],
  isMounted: mounted,
  isOpen: config.open,
})

const positionerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  mounted: boolean,
): SelectPartAttributes<Message> => ({
  root: mounted
    ? [
        h.Id(positionerId(config)),
        ...(config.open ? [] : [h.Hidden(true)]),
        ...openStateDataAttributes(h, config.open),
        ...placementAttributes(h, config),
        h.Style({
          position: 'absolute',
          inset: 'auto',
          margin: '0',
        }),
      ]
    : [],
  isMounted: mounted,
  isOpen: config.open,
})

const backdropAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  mounted: boolean,
): SelectPartAttributes<Message> => ({
  root: mounted
    ? [
        h.Role('presentation'),
        ...(config.open ? [] : [h.Hidden(true)]),
        ...openStateDataAttributes(h, config.open),
        ...transitionDataAttributes(h, config.transitionStatus),
        ...optionalMessageAttribute(
          openMessage(config, openChange(false, 'outside-press')),
          message => h.OnClick(message),
        ),
      ]
    : [],
  isMounted: mounted,
  isOpen: config.open,
})

const popupKeyboardMessage = <Message>(
  config: ViewConfig<Message>,
  key: string,
  modifiers: KeyboardModifiers,
): Option.Option<Message> => {
  if (modifiers.shiftKey) {
    return Option.none()
  }

  if (key === 'Escape') {
    return openMessage(config, openChange(false, 'escape-key'))
  }

  const direction = keyboardDirection(key)

  if (direction !== undefined) {
    const item = nextHighlightedItem(config, direction)

    return item === undefined
      ? Option.none()
      : highlightMessage(config, item, 'keyboard-navigation')
  }

  if (searchKeyPattern.test(key)) {
    const item = typeaheadItem(config, key)

    return item === undefined
      ? Option.none()
      : highlightMessage(config, item, 'typeahead')
  }

  return Option.none()
}

const popupAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  mounted: boolean,
): SelectPartAttributes<Message> => ({
  root: mounted
    ? [
        h.Id(popupId(config)),
        h.Popover('manual'),
        h.Role('listbox'),
        h.Tabindex(-1),
        h.AriaLabelledBy(valueId(config)),
        ...(config.open ? [] : [h.Hidden(true)]),
        ...openStateDataAttributes(h, config.open),
        ...transitionDataAttributes(h, config.transitionStatus),
        ...placementAttributes(h, config),
        h.DataAttribute(
          'align-trigger',
          String(config.alignItemWithTrigger ?? defaultAlignItemWithTrigger),
        ),
        h.OnKeyDownPreventDefault((key, modifiers) =>
          popupKeyboardMessage(config, key, modifiers),
        ),
      ]
    : [],
  isMounted: mounted,
  isOpen: config.open,
})

const listAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  mounted: boolean,
): SelectPartAttributes<Message> => ({
  root: mounted ? [h.Id(listId(config)), h.Role('presentation')] : [],
  isMounted: mounted,
  isOpen: config.open,
})

const itemStateDataAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: SelectItemDescriptor,
): ReadonlyArray<Attribute<Message>> => [
  ...(config.value === item.value ? [h.DataAttribute('selected', '')] : []),
  ...(config.highlightedValue === item.value
    ? [h.DataAttribute('highlighted', '')]
    : []),
  ...booleanDataAttribute(h, 'disabled', item.isDisabled),
]

const itemAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: SelectItemDescriptor,
): ReadonlyArray<Attribute<Message>> => [
  h.Id(itemId(config, item)),
  h.Role('option'),
  h.Tabindex(config.highlightedValue === item.value ? 0 : -1),
  h.AriaSelected(config.value === item.value),
  ...optionalBooleanAttribute<Message>(item.isDisabled, value =>
    h.AriaDisabled(value),
  ),
  ...itemStateDataAttributes(h, config, item),
  ...optionalMessageAttribute(
    valueMessage(config, item, 'item-press'),
    message => h.OnClick(message),
  ),
  ...optionalMessageAttribute(
    highlightMessage(config, item, 'item-hover'),
    message => h.OnMouseEnter(message),
  ),
  ...optionalMessageAttribute(
    valueMessage(config, item, 'keyboard-select'),
    message =>
      h.OnKeyDownPreventDefault(key =>
        activationKeys.has(key) ? Option.some(message) : Option.none(),
      ),
  ),
]

const itemTextAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: SelectItemDescriptor,
): ReadonlyArray<Attribute<Message>> => itemStateDataAttributes(h, config, item)

const itemIndicatorAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: SelectItemDescriptor,
): ReadonlyArray<Attribute<Message>> =>
  config.value === item.value ? itemStateDataAttributes(h, config, item) : []

const formOwnerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  form: string | undefined,
): ReadonlyArray<Attribute<Message>> =>
  Predicate.isNotUndefined(form) ? [h.Attribute('form', form)] : []

const hiddenInputAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> =>
  config.name === undefined
    ? []
    : [
        h.Type('hidden'),
        h.Name(config.name),
        h.Value(config.value ?? ''),
        ...formOwnerAttributes(h, config.form),
        ...optionalBooleanAttribute<Message>(config.isDisabled, value =>
          h.Disabled(value),
        ),
        ...optionalBooleanAttribute<Message>(config.isRequired, value =>
          h.Required(value),
        ),
      ]

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const mounted = isMounted(config)

  return config.toView({
    root: rootAttributes(h, config),
    trigger: triggerAttributes(h, config),
    value: valueAttributes(h, config),
    icon: iconAttributes(h, config),
    portal: portalAttributes(h),
    positioner: positionerAttributes(h, config, mounted),
    backdrop: backdropAttributes(h, config, mounted),
    popup: popupAttributes(h, config, mounted),
    list: listAttributes(h, config, mounted),
    arrow: positionedPartAttributes(h, config, mounted, arrowId(config)),
    scrollUp: positionedPartAttributes(h, config, mounted, scrollUpId(config)),
    scrollDown: positionedPartAttributes(
      h,
      config,
      mounted,
      scrollDownId(config),
    ),
    group: [h.Role('group')],
    groupLabel: [],
    separator: [h.Role('separator'), h.AriaOrientation('horizontal')],
    items: config.items.map(item => ({
      item,
      root: itemAttributes(h, config, item),
      text: itemTextAttributes(h, config, item),
      indicator: itemIndicatorAttributes(h, config, item),
    })),
    hiddenInput: hiddenInputAttributes(h, config),
    isMounted: mounted,
    isOpen: config.open,
  })
}
