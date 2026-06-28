import { Option, Predicate, Schema as S } from 'effect'
import type { Command } from 'foldkit'
import type { Attribute, Html, KeyboardModifiers } from 'foldkit/html'
import { html } from 'foldkit/html'

import * as Popover from '../popover'

// MODEL

export const ComboboxSide = Popover.PopoverSide
export type ComboboxSide = Popover.PopoverSide

export const ComboboxAlign = Popover.PopoverAlign
export type ComboboxAlign = Popover.PopoverAlign

export const ComboboxTransitionStatus = Popover.PopoverTransitionStatus
export type ComboboxTransitionStatus = Popover.PopoverTransitionStatus

export const ComboboxSelectionMode = S.Union([
  S.Literal('single'),
  S.Literal('multiple'),
])
export type ComboboxSelectionMode = typeof ComboboxSelectionMode.Type

export const ComboboxOpenChangeReason = S.Union([
  S.Literal('trigger-press'),
  S.Literal('input-change'),
  S.Literal('input-clear'),
  S.Literal('outside-press'),
  S.Literal('escape-key'),
  S.Literal('keyboard-open'),
  S.Literal('list-navigation'),
  S.Literal('none'),
])
export type ComboboxOpenChangeReason = typeof ComboboxOpenChangeReason.Type

export const ComboboxInputValueChangeReason = S.Union([
  S.Literal('input-change'),
  S.Literal('input-clear'),
  S.Literal('clear-press'),
  S.Literal('none'),
])
export type ComboboxInputValueChangeReason =
  typeof ComboboxInputValueChangeReason.Type

export const ComboboxValueChangeReason = S.Union([
  S.Literal('item-press'),
  S.Literal('keyboard-select'),
  S.Literal('input-clear'),
  S.Literal('clear-press'),
  S.Literal('chip-remove-press'),
  S.Literal('chip-keyboard-remove'),
  S.Literal('none'),
])
export type ComboboxValueChangeReason = typeof ComboboxValueChangeReason.Type

export const ComboboxHighlightChangeReason = S.Union([
  S.Literal('keyboard-navigation'),
  S.Literal('input-change'),
  S.Literal('item-hover'),
  S.Literal('none'),
])
export type ComboboxHighlightChangeReason =
  typeof ComboboxHighlightChangeReason.Type

export const ComboboxChipHighlightChangeReason = S.Union([
  S.Literal('keyboard-navigation'),
  S.Literal('none'),
])
export type ComboboxChipHighlightChangeReason =
  typeof ComboboxChipHighlightChangeReason.Type

export const ComboboxOpenChange = S.Struct({
  open: S.Boolean,
  reason: ComboboxOpenChangeReason,
})
export type ComboboxOpenChange = typeof ComboboxOpenChange.Type

export const ComboboxInputValueChange = S.Struct({
  value: S.String,
  reason: ComboboxInputValueChangeReason,
})
export type ComboboxInputValueChange = typeof ComboboxInputValueChange.Type

export const ComboboxValueChange = S.Struct({
  value: S.optional(S.String),
  values: S.Array(S.String),
  label: S.optional(S.String),
  changedValue: S.optional(S.String),
  reason: ComboboxValueChangeReason,
})
export type ComboboxValueChange = typeof ComboboxValueChange.Type

export const ComboboxHighlightChange = S.Struct({
  value: S.optional(S.String),
  reason: ComboboxHighlightChangeReason,
  focusSelector: S.optional(S.String),
})
export type ComboboxHighlightChange = typeof ComboboxHighlightChange.Type

export const ComboboxChipHighlightChange = S.Struct({
  value: S.optional(S.String),
  reason: ComboboxChipHighlightChangeReason,
  focusSelector: S.optional(S.String),
})
export type ComboboxChipHighlightChange =
  typeof ComboboxChipHighlightChange.Type

export const ComboboxItemDescriptor = S.Struct({
  id: S.optional(S.String),
  value: S.String,
  label: S.String,
  textValue: S.optional(S.String),
  isDisabled: S.optional(S.Boolean),
})
export type ComboboxItemDescriptor = typeof ComboboxItemDescriptor.Type

export const ComboboxOptions = S.Struct({
  id: S.String,
  open: S.Boolean,
  inputValue: S.String,
  displayInputValue: S.optional(S.String),
  filterValue: S.optional(S.String),
  items: S.Array(ComboboxItemDescriptor),
  selectionMode: S.optional(ComboboxSelectionMode),
  value: S.optional(S.String),
  values: S.optional(S.Array(S.String)),
  highlightedValue: S.optional(S.String),
  highlightedChipValue: S.optional(S.String),
  placeholder: S.optional(S.String),
  name: S.optional(S.String),
  form: S.optional(S.String),
  forceMount: S.optional(S.Boolean),
  transitionStatus: S.optional(ComboboxTransitionStatus),
  isDisabled: S.optional(S.Boolean),
  isInvalid: S.optional(S.Boolean),
  isRequired: S.optional(S.Boolean),
  isReadOnly: S.optional(S.Boolean),
  autoHighlight: S.optional(S.Boolean),
  side: S.optional(ComboboxSide),
  align: S.optional(ComboboxAlign),
  sideOffset: S.optional(S.Number),
  alignOffset: S.optional(S.Number),
  collisionAvoidance: S.optional(S.Boolean),
  collisionPadding: S.optional(S.Number),
  anchorToChips: S.optional(S.Boolean),
  showTriggerPlaceholder: S.optional(S.Boolean),
})
export type ComboboxOptions = typeof ComboboxOptions.Type

// UPDATE

const defaultSide: ComboboxSide = 'bottom'
const defaultAlign: ComboboxAlign = 'center'
const defaultSideOffset = 0
const defaultAlignOffset = 0
const defaultCollisionAvoidance = true
const defaultCollisionPadding = 0

const activationKeys = new Set(['Enter', ' '])

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
  FocusPopover: FocusCombobox,
  RestorePopoverFocus: RestoreComboboxFocus,
} = Popover

export const resolvedSelectionMode = (
  config: Pick<ComboboxOptions, 'selectionMode'>,
): ComboboxSelectionMode => config.selectionMode ?? 'single'

export const isMultiple = (
  config: Pick<ComboboxOptions, 'selectionMode'>,
): boolean => resolvedSelectionMode(config) === 'multiple'

export const rootId = (config: Pick<ComboboxOptions, 'id'>): string => config.id

export const inputId = (config: Pick<ComboboxOptions, 'id'>): string =>
  `${config.id}-input`

export const inputGroupId = (config: Pick<ComboboxOptions, 'id'>): string =>
  `${config.id}-input-group`

export const triggerId = (config: Pick<ComboboxOptions, 'id'>): string =>
  `${config.id}-trigger`

export const popupId = (config: Pick<ComboboxOptions, 'id'>): string =>
  `${config.id}-popup`

export const listId = (config: Pick<ComboboxOptions, 'id'>): string =>
  `${config.id}-list`

export const positionerId = (config: Pick<ComboboxOptions, 'id'>): string =>
  `${config.id}-positioner`

export const arrowId = (config: Pick<ComboboxOptions, 'id'>): string =>
  `${config.id}-arrow`

export const valueId = (config: Pick<ComboboxOptions, 'id'>): string =>
  `${config.id}-value`

export const clearId = (config: Pick<ComboboxOptions, 'id'>): string =>
  `${config.id}-clear`

export const chipsId = (config: Pick<ComboboxOptions, 'id'>): string =>
  `${config.id}-chips`

export const emptyId = (config: Pick<ComboboxOptions, 'id'>): string =>
  `${config.id}-empty`

export const collectionId = (config: Pick<ComboboxOptions, 'id'>): string =>
  `${config.id}-collection`

export const itemId = (
  config: Pick<ComboboxOptions, 'id'>,
  item: Pick<ComboboxItemDescriptor, 'id' | 'value'>,
): string => item.id ?? `${config.id}-item-${item.value}`

export const chipId = (
  config: Pick<ComboboxOptions, 'id'>,
  item: Pick<ComboboxItemDescriptor, 'value'>,
): string => `${config.id}-chip-${item.value}`

export const chipRemoveId = (
  config: Pick<ComboboxOptions, 'id'>,
  item: Pick<ComboboxItemDescriptor, 'value'>,
): string => `${config.id}-chip-${item.value}-remove`

export const itemFocusSelector = (
  config: Pick<ComboboxOptions, 'id'>,
  item: Pick<ComboboxItemDescriptor, 'id' | 'value'>,
): string => `#${itemId(config, item)}`

export const chipFocusSelector = (
  config: Pick<ComboboxOptions, 'id'>,
  item: Pick<ComboboxItemDescriptor, 'value'>,
): string => `#${chipId(config, item)}`

export const selectedValues = (
  config: Pick<ComboboxOptions, 'selectionMode' | 'value' | 'values'>,
): ReadonlyArray<string> => {
  if (isMultiple(config)) {
    return config.values ?? []
  }

  if (config.value === undefined) {
    return []
  }

  return [config.value]
}

export const selectedItems = (
  config: Pick<ComboboxOptions, 'items' | 'selectionMode' | 'value' | 'values'>,
): ReadonlyArray<ComboboxItemDescriptor> => {
  const values = new Set(selectedValues(config))

  return config.items.filter(item => values.has(item.value))
}

export const selectedItem = (
  config: Pick<ComboboxOptions, 'items' | 'value'>,
): ComboboxItemDescriptor | undefined =>
  config.items.find(item => item.value === config.value)

export const displayValue = (
  config: Pick<
    ComboboxOptions,
    'items' | 'placeholder' | 'selectionMode' | 'value' | 'values'
  >,
): string =>
  isMultiple(config)
    ? selectedItems(config)
        .map(item => item.label)
        .join(', ')
    : (selectedItem(config)?.label ?? config.placeholder ?? '')

export const inputDisplayValue = (
  config: Pick<
    ComboboxOptions,
    'displayInputValue' | 'inputValue' | 'items' | 'selectionMode' | 'value'
  >,
): string => {
  if (config.displayInputValue !== undefined) {
    return config.displayInputValue
  }

  if (isMultiple(config)) {
    return config.inputValue
  }

  if (config.inputValue === '') {
    return selectedItem(config)?.label ?? ''
  }

  return config.inputValue
}

export const hasSelectedValue = (
  config: Pick<ComboboxOptions, 'selectionMode' | 'value' | 'values'>,
): boolean => selectedValues(config).length > 0

export const enabledItems = (
  config: Pick<ComboboxOptions, 'isDisabled' | 'items'>,
): ReadonlyArray<ComboboxItemDescriptor> =>
  config.isDisabled === true
    ? []
    : config.items.filter(item => item.isDisabled !== true)

export const filteredItems = (
  config: Pick<
    ComboboxOptions,
    'filterValue' | 'inputValue' | 'isDisabled' | 'items'
  >,
): ReadonlyArray<ComboboxItemDescriptor> => {
  const normalizedInputValue = (config.filterValue ?? config.inputValue)
    .trim()
    .toLocaleLowerCase()
  const items = enabledItems(config)

  if (normalizedInputValue === '') {
    return items
  }

  return items.filter(item =>
    (item.textValue ?? item.label)
      .toLocaleLowerCase()
      .includes(normalizedInputValue),
  )
}

export const highlightedItem = (
  config: Pick<ComboboxOptions, 'highlightedValue' | 'items'>,
): ComboboxItemDescriptor | undefined =>
  config.items.find(item => item.value === config.highlightedValue)

export const firstFilteredItem = (
  config: Pick<
    ComboboxOptions,
    'filterValue' | 'inputValue' | 'isDisabled' | 'items'
  >,
): ComboboxItemDescriptor | undefined => filteredItems(config)[0]

export const visibleSelectedItems = (
  config: Pick<ComboboxOptions, 'items' | 'selectionMode' | 'value' | 'values'>,
): ReadonlyArray<ComboboxItemDescriptor> => selectedItems(config)

export const openChange = (
  open: boolean,
  reason: ComboboxOpenChangeReason = 'none',
): ComboboxOpenChange => ({
  open,
  reason,
})

export const inputValueChange = (
  value: string,
  reason: ComboboxInputValueChangeReason = 'none',
): ComboboxInputValueChange => ({
  value,
  reason,
})

const nextValuesForItem = (
  config: Pick<ComboboxOptions, 'selectionMode' | 'value' | 'values'>,
  item: Pick<ComboboxItemDescriptor, 'value'>,
): ReadonlyArray<string> => {
  if (!isMultiple(config)) {
    return [item.value]
  }

  const currentValues = selectedValues(config)

  return currentValues.includes(item.value)
    ? currentValues.filter(value => value !== item.value)
    : [...currentValues, item.value]
}

export const valueChange = (
  config: Pick<ComboboxOptions, 'selectionMode' | 'value' | 'values'>,
  item: ComboboxItemDescriptor,
  reason: ComboboxValueChangeReason = 'none',
): ComboboxValueChange => {
  const values = nextValuesForItem(config, item)
  const base = {
    values,
    label: item.label,
    changedValue: item.value,
    reason,
  }

  return isMultiple(config) ? base : { ...base, value: item.value }
}

export const clearValueChange = (
  reason: ComboboxValueChangeReason = 'none',
): ComboboxValueChange => ({
  values: [],
  reason,
})

export const removeValueChange = (
  config: Pick<ComboboxOptions, 'selectionMode' | 'value' | 'values'>,
  item: ComboboxItemDescriptor,
  reason: ComboboxValueChangeReason = 'none',
): ComboboxValueChange => ({
  values: selectedValues(config).filter(value => value !== item.value),
  changedValue: item.value,
  label: item.label,
  reason,
})

export const highlightChange = (
  config: Pick<ComboboxOptions, 'id'>,
  item: ComboboxItemDescriptor,
  reason: ComboboxHighlightChangeReason = 'none',
): ComboboxHighlightChange => ({
  value: item.value,
  reason,
  focusSelector: itemFocusSelector(config, item),
})

export const clearHighlightChange = (
  reason: ComboboxHighlightChangeReason = 'none',
): ComboboxHighlightChange => ({
  reason,
})

export const chipHighlightChange = (
  config: Pick<ComboboxOptions, 'id'>,
  item: ComboboxItemDescriptor,
  reason: ComboboxChipHighlightChangeReason = 'none',
): ComboboxChipHighlightChange => ({
  value: item.value,
  reason,
  focusSelector: chipFocusSelector(config, item),
})

export const clearChipHighlightChange = (
  reason: ComboboxChipHighlightChangeReason = 'none',
): ComboboxChipHighlightChange => ({
  reason,
})

const popoverChangeReason = (
  change: ComboboxOpenChange,
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
  config: Pick<ComboboxOptions, 'id'>,
  change: ComboboxOpenChange,
): Command.Command<Popover.CommandMessage> =>
  Popover.commandForOpenChange(
    {
      id: config.id,
      triggerId: inputId(config),
      triggerSelector: `#${inputId(config)}`,
      focusSelector: `#${inputId(config)}`,
    },
    Popover.openChange(change.open, popoverChangeReason(change)),
  )

const indexOffset = (
  currentIndex: number,
  direction: 'next' | 'previous',
): number => currentIndex + (direction === 'next' ? 1 : -1)

export const nextHighlightedItem = (
  config: Pick<
    ComboboxOptions,
    'filterValue' | 'highlightedValue' | 'inputValue' | 'isDisabled' | 'items'
  >,
  direction: 'first' | 'last' | 'next' | 'previous',
): ComboboxItemDescriptor | undefined => {
  const items = filteredItems(config)

  if (direction === 'first') {
    return items[0]
  }

  if (direction === 'last') {
    return items.at(-1)
  }

  const currentIndex = items.findIndex(
    item => item.value === config.highlightedValue,
  )
  const resolvedCurrentIndex = currentIndex === -1 ? 0 : currentIndex
  const candidateIndex = indexOffset(resolvedCurrentIndex, direction)

  if (candidateIndex >= 0 && candidateIndex < items.length) {
    return items[candidateIndex]
  }

  return items[resolvedCurrentIndex]
}

export const nextHighlightedChip = (
  config: Pick<
    ComboboxOptions,
    'highlightedChipValue' | 'items' | 'selectionMode' | 'value' | 'values'
  >,
  direction: 'next' | 'previous',
): ComboboxItemDescriptor | undefined => {
  const chips = visibleSelectedItems(config)
  const currentIndex = chips.findIndex(
    item => item.value === config.highlightedChipValue,
  )
  const resolvedCurrentIndex = currentIndex === -1 ? 0 : currentIndex
  const candidateIndex = indexOffset(resolvedCurrentIndex, direction)

  if (candidateIndex >= 0 && candidateIndex < chips.length) {
    return chips[candidateIndex]
  }

  return undefined
}

// VIEW

export type ComboboxPartAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  isMounted: boolean
  isOpen: boolean
}>

export type ComboboxItemAttributes<Message> = Readonly<{
  item: ComboboxItemDescriptor
  root: ReadonlyArray<Attribute<Message>>
  text: ReadonlyArray<Attribute<Message>>
  indicator: ReadonlyArray<Attribute<Message>>
}>

export type ComboboxChipAttributes<Message> = Readonly<{
  item: ComboboxItemDescriptor
  root: ReadonlyArray<Attribute<Message>>
  remove: ReadonlyArray<Attribute<Message>>
}>

export type ComboboxAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  inputGroup: ReadonlyArray<Attribute<Message>>
  input: ReadonlyArray<Attribute<Message>>
  trigger: ReadonlyArray<Attribute<Message>>
  value: ReadonlyArray<Attribute<Message>>
  clear: ReadonlyArray<Attribute<Message>>
  portal: ReadonlyArray<Attribute<Message>>
  positioner: ComboboxPartAttributes<Message>
  backdrop: ComboboxPartAttributes<Message>
  popup: ComboboxPartAttributes<Message>
  list: ComboboxPartAttributes<Message>
  arrow: ComboboxPartAttributes<Message>
  collection: ReadonlyArray<Attribute<Message>>
  group: ReadonlyArray<Attribute<Message>>
  groupLabel: ReadonlyArray<Attribute<Message>>
  empty: ReadonlyArray<Attribute<Message>>
  separator: ReadonlyArray<Attribute<Message>>
  items: ReadonlyArray<ComboboxItemAttributes<Message>>
  chips: ReadonlyArray<Attribute<Message>>
  chipInput: ReadonlyArray<Attribute<Message>>
  chipItems: ReadonlyArray<ComboboxChipAttributes<Message>>
  hiddenInputs: ReadonlyArray<ReadonlyArray<Attribute<Message>>>
  filteredItems: ReadonlyArray<ComboboxItemDescriptor>
  selectedItems: ReadonlyArray<ComboboxItemDescriptor>
  isMounted: boolean
  isOpen: boolean
  isEmpty: boolean
}>

export type ViewConfig<Message> = ComboboxOptions &
  Readonly<{
    toView: (attributes: ComboboxAttributes<Message>) => Html
    onOpenChange?: (change: ComboboxOpenChange) => Message
    onInputValueChange?: (change: ComboboxInputValueChange) => Message
    onValueChange?: (change: ComboboxValueChange) => Message
    onHighlightChange?: (change: ComboboxHighlightChange) => Message
    onChipHighlightChange?: (change: ComboboxChipHighlightChange) => Message
    onFocus?: Message
    onBlur?: Message
  }>

const resolvedSide = (config: Pick<ComboboxOptions, 'side'>): ComboboxSide =>
  config.side ?? defaultSide

const resolvedAlign = (config: Pick<ComboboxOptions, 'align'>): ComboboxAlign =>
  config.align ?? defaultAlign

const isMounted = (
  config: Pick<ComboboxOptions, 'forceMount' | 'open' | 'transitionStatus'>,
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
  change: ComboboxOpenChange,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onOpenChange)
    ? Option.some(config.onOpenChange(change))
    : Option.none()

const valueMessage = <Message>(
  config: Pick<
    ViewConfig<Message>,
    | 'isDisabled'
    | 'isReadOnly'
    | 'onValueChange'
    | 'selectionMode'
    | 'value'
    | 'values'
  >,
  item: ComboboxItemDescriptor,
  reason: ComboboxValueChangeReason,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onValueChange) &&
  config.isDisabled !== true &&
  config.isReadOnly !== true &&
  item.isDisabled !== true
    ? Option.some(config.onValueChange(valueChange(config, item, reason)))
    : Option.none()

const clearValueMessage = <Message>(
  config: Pick<
    ViewConfig<Message>,
    'isDisabled' | 'isReadOnly' | 'onValueChange'
  >,
  reason: ComboboxValueChangeReason,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onValueChange) &&
  config.isDisabled !== true &&
  config.isReadOnly !== true
    ? Option.some(config.onValueChange(clearValueChange(reason)))
    : Option.none()

const removeValueMessage = <Message>(
  config: Pick<
    ViewConfig<Message>,
    | 'isDisabled'
    | 'isReadOnly'
    | 'onValueChange'
    | 'selectionMode'
    | 'value'
    | 'values'
  >,
  item: ComboboxItemDescriptor,
  reason: ComboboxValueChangeReason,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onValueChange) &&
  config.isDisabled !== true &&
  config.isReadOnly !== true
    ? Option.some(config.onValueChange(removeValueChange(config, item, reason)))
    : Option.none()

const highlightMessage = <Message>(
  config: Pick<ViewConfig<Message>, 'id' | 'isDisabled' | 'onHighlightChange'>,
  item: ComboboxItemDescriptor,
  reason: ComboboxHighlightChangeReason,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onHighlightChange) &&
  config.isDisabled !== true
    ? Option.some(
        config.onHighlightChange(highlightChange(config, item, reason)),
      )
    : Option.none()

const chipHighlightMessage = <Message>(
  config: Pick<
    ViewConfig<Message>,
    'id' | 'isDisabled' | 'onChipHighlightChange'
  >,
  item: ComboboxItemDescriptor,
  reason: ComboboxChipHighlightChangeReason,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onChipHighlightChange) &&
  config.isDisabled !== true
    ? Option.some(
        config.onChipHighlightChange(chipHighlightChange(config, item, reason)),
      )
    : Option.none()

const clearChipHighlightMessageOption = <Message>(
  config: Pick<ViewConfig<Message>, 'isDisabled' | 'onChipHighlightChange'>,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onChipHighlightChange) &&
  config.isDisabled !== true
    ? Option.some(config.onChipHighlightChange(clearChipHighlightChange()))
    : Option.none()

const openStateDataAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  open: boolean,
): ReadonlyArray<Attribute<Message>> =>
  open ? [h.DataAttribute('open', '')] : [h.DataAttribute('closed', '')]

const transitionDataAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  transitionStatus: ComboboxTransitionStatus | undefined,
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
  h.Id(rootId(config)),
  h.DataAttribute('side', resolvedSide(config)),
  h.DataAttribute('align', resolvedAlign(config)),
  h.DataAttribute('selection-mode', resolvedSelectionMode(config)),
  ...booleanDataAttribute(h, 'disabled', config.isDisabled),
  ...booleanDataAttribute(h, 'readonly', config.isReadOnly),
  ...booleanDataAttribute(h, 'required', config.isRequired),
  ...booleanDataAttribute(h, 'invalid', config.isInvalid),
]

const inputGroupAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.Id(inputGroupId(config)),
  h.Role('group'),
  ...(config.open ? [h.DataAttribute('popup-open', '')] : []),
  ...booleanDataAttribute(h, 'disabled', config.isDisabled),
  ...booleanDataAttribute(h, 'invalid', config.isInvalid),
]

const inputKeyboardMessage = <Message>(
  config: ViewConfig<Message>,
  key: string,
  modifiers: KeyboardModifiers,
): Option.Option<Message> => {
  if (
    modifiers.shiftKey ||
    modifiers.ctrlKey ||
    modifiers.altKey ||
    modifiers.metaKey ||
    config.isDisabled === true ||
    config.isReadOnly === true
  ) {
    return Option.none()
  }

  if (key === 'Escape') {
    return config.open
      ? openMessage(config, openChange(false, 'escape-key'))
      : clearValueMessage(config, 'input-clear')
  }

  const direction = keyboardDirection(key)

  if (direction !== undefined) {
    const item = nextHighlightedItem(config, direction)

    return item === undefined
      ? Option.none()
      : highlightMessage(config, item, 'keyboard-navigation')
  }

  if (key === 'Enter' && config.highlightedValue !== undefined) {
    const item = highlightedItem(config)

    return item === undefined
      ? Option.none()
      : valueMessage(config, item, 'keyboard-select')
  }

  if (key === 'Backspace' && config.inputValue === '' && isMultiple(config)) {
    const chips = visibleSelectedItems(config)
    const item = chips.at(-1)

    return item === undefined
      ? Option.none()
      : removeValueMessage(config, item, 'chip-keyboard-remove')
  }

  return Option.none()
}

const inputAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  items: ReadonlyArray<ComboboxItemDescriptor>,
): ReadonlyArray<Attribute<Message>> => {
  const { onInputValueChange } = config

  return [
    h.Id(inputId(config)),
    h.Type('text'),
    h.Role('combobox'),
    h.Value(inputDisplayValue(config)),
    h.AriaHasPopup('listbox'),
    h.AriaExpanded(config.open),
    h.AriaControls(listId(config)),
    h.Attribute('aria-autocomplete', 'list'),
    ...(config.highlightedValue === undefined
      ? []
      : [
          h.AriaActiveDescendant(
            itemId(config, { value: config.highlightedValue }),
          ),
        ]),
    ...(config.placeholder === undefined
      ? []
      : [h.Placeholder(config.placeholder)]),
    ...optionalBooleanAttribute<Message>(config.isDisabled, value =>
      h.Disabled(value),
    ),
    ...optionalBooleanAttribute<Message>(config.isReadOnly, value =>
      h.Readonly(value),
    ),
    ...optionalBooleanAttribute<Message>(config.isRequired, value =>
      h.Required(value),
    ),
    ...(config.isInvalid === true ? [h.AriaInvalid(true)] : []),
    ...optionalBooleanAttribute<Message>(config.isDisabled, value =>
      h.AriaDisabled(value),
    ),
    ...optionalBooleanAttribute<Message>(config.isReadOnly, value =>
      h.AriaReadonly(value),
    ),
    ...optionalBooleanAttribute<Message>(config.isRequired, value =>
      h.AriaRequired(value),
    ),
    ...(config.open ? [h.DataAttribute('popup-open', '')] : []),
    h.DataAttribute('popup-side', config.open ? resolvedSide(config) : ''),
    ...(items.length === 0 ? [h.DataAttribute('list-empty', '')] : []),
    ...booleanDataAttribute(h, 'disabled', config.isDisabled),
    ...booleanDataAttribute(h, 'readonly', config.isReadOnly),
    ...booleanDataAttribute(h, 'required', config.isRequired),
    ...booleanDataAttribute(h, 'invalid', config.isInvalid),
    ...(inputDisplayValue(config) === ''
      ? []
      : [h.DataAttribute('filled', '')]),
    ...(Predicate.isNotUndefined(onInputValueChange) &&
    config.isDisabled !== true &&
    config.isReadOnly !== true
      ? [
          h.OnInput(value =>
            onInputValueChange(
              inputValueChange(
                value,
                value === '' ? 'input-clear' : 'input-change',
              ),
            ),
          ),
        ]
      : []),
    h.OnKeyDownPreventDefault((key, modifiers) =>
      inputKeyboardMessage(config, key, modifiers),
    ),
    ...(Predicate.isNotUndefined(config.onFocus)
      ? [h.OnFocus(config.onFocus)]
      : []),
    ...(Predicate.isNotUndefined(config.onBlur)
      ? [h.OnBlur(config.onBlur)]
      : []),
  ]
}

const triggerKeyboardMessage = <Message>(
  config: ViewConfig<Message>,
  key: string,
  modifiers: KeyboardModifiers,
): Option.Option<Message> => {
  if (
    modifiers.shiftKey ||
    config.isDisabled === true ||
    config.isReadOnly === true
  ) {
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
  items: ReadonlyArray<ComboboxItemDescriptor>,
): ReadonlyArray<Attribute<Message>> => [
  h.Id(triggerId(config)),
  h.Type('button'),
  h.AriaHasPopup('listbox'),
  h.AriaExpanded(config.open),
  h.AriaControls(listId(config)),
  ...(config.open ? [h.DataAttribute('popup-open', '')] : []),
  h.DataAttribute('popup-side', config.open ? resolvedSide(config) : ''),
  ...(items.length === 0 ? [h.DataAttribute('list-empty', '')] : []),
  ...(hasSelectedValue(config) || config.showTriggerPlaceholder === false
    ? []
    : [h.DataAttribute('placeholder', '')]),
  ...booleanDataAttribute(h, 'disabled', config.isDisabled),
  ...booleanDataAttribute(h, 'readonly', config.isReadOnly),
  ...optionalBooleanAttribute<Message>(config.isDisabled, value =>
    h.AriaDisabled(value),
  ),
  ...optionalBooleanAttribute<Message>(config.isReadOnly, value =>
    h.AriaReadonly(value),
  ),
  ...optionalMessageAttribute(
    config.isDisabled === true || config.isReadOnly === true
      ? Option.none()
      : openMessage(config, openChange(!config.open, 'trigger-press')),
    message => h.OnClick(message),
  ),
  h.OnKeyDownPreventDefault((key, modifiers) =>
    triggerKeyboardMessage(config, key, modifiers),
  ),
]

const valueAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.Id(valueId(config)),
  ...(hasSelectedValue(config) ? [] : [h.DataAttribute('placeholder', '')]),
]

const clearAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.Id(clearId(config)),
  h.Type('button'),
  h.Tabindex(-1),
  ...(config.open ? [h.DataAttribute('popup-open', '')] : []),
  ...(hasSelectedValue(config) || config.inputValue !== ''
    ? [h.DataAttribute('visible', '')]
    : []),
  ...booleanDataAttribute(h, 'disabled', config.isDisabled),
  ...optionalBooleanAttribute<Message>(config.isDisabled, value =>
    h.AriaDisabled(value),
  ),
  ...optionalMessageAttribute(
    hasSelectedValue(config) || config.inputValue !== ''
      ? clearValueMessage(config, 'clear-press')
      : Option.none(),
    message => h.OnClick(message),
  ),
]

const portalAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
): ReadonlyArray<Attribute<Message>> => [h.DataAttribute('portal', '')]

const positionerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  mounted: boolean,
  isEmpty: boolean,
): ComboboxPartAttributes<Message> => ({
  root: mounted
    ? [
        h.Id(positionerId(config)),
        ...(config.open ? [] : [h.Hidden(true)]),
        ...openStateDataAttributes(h, config.open),
        ...placementAttributes(h, config),
        ...(isEmpty ? [h.DataAttribute('empty', '')] : []),
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
): ComboboxPartAttributes<Message> => ({
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

  return Option.none()
}

const popupAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  mounted: boolean,
  isEmpty: boolean,
): ComboboxPartAttributes<Message> => ({
  root: mounted
    ? [
        h.Id(popupId(config)),
        h.Popover('manual'),
        h.Role('presentation'),
        h.Tabindex(-1),
        ...(config.open ? [] : [h.Hidden(true)]),
        ...openStateDataAttributes(h, config.open),
        ...transitionDataAttributes(h, config.transitionStatus),
        ...placementAttributes(h, config),
        ...(isEmpty ? [h.DataAttribute('empty', '')] : []),
        ...booleanDataAttribute(h, 'chips', config.anchorToChips),
        h.OnKeyDownPreventDefault((key, modifiers) =>
          popupKeyboardMessage(config, key, modifiers),
        ),
      ]
    : [],
  isMounted: mounted,
  isOpen: config.open,
})

const listKeyboardMessage = <Message>(
  config: ViewConfig<Message>,
  key: string,
  modifiers: KeyboardModifiers,
): Option.Option<Message> => inputKeyboardMessage(config, key, modifiers)

const listAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  mounted: boolean,
  isEmpty: boolean,
): ComboboxPartAttributes<Message> => ({
  root: mounted
    ? [
        h.Id(listId(config)),
        h.Role('listbox'),
        h.Tabindex(-1),
        ...(isMultiple(config)
          ? [h.Attribute('aria-multiselectable', 'true')]
          : []),
        ...(isEmpty ? [h.DataAttribute('empty', '')] : []),
        h.OnKeyDownPreventDefault((key, modifiers) =>
          listKeyboardMessage(config, key, modifiers),
        ),
      ]
    : [],
  isMounted: mounted,
  isOpen: config.open,
})

const arrowAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  mounted: boolean,
): ComboboxPartAttributes<Message> => ({
  root: mounted
    ? [
        h.Id(arrowId(config)),
        h.AriaHidden(true),
        ...openStateDataAttributes(h, config.open),
        ...placementAttributes(h, config),
      ]
    : [],
  isMounted: mounted,
  isOpen: config.open,
})

const itemStateDataAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: ComboboxItemDescriptor,
): ReadonlyArray<Attribute<Message>> => [
  ...(selectedValues(config).includes(item.value)
    ? [h.DataAttribute('selected', '')]
    : []),
  ...(config.highlightedValue === item.value
    ? [h.DataAttribute('highlighted', '')]
    : []),
  ...booleanDataAttribute(h, 'disabled', item.isDisabled),
]

const itemAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: ComboboxItemDescriptor,
): ReadonlyArray<Attribute<Message>> => [
  h.Id(itemId(config, item)),
  h.Role('option'),
  h.Tabindex(config.highlightedValue === item.value ? 0 : -1),
  h.AriaSelected(selectedValues(config).includes(item.value)),
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
  item: ComboboxItemDescriptor,
): ReadonlyArray<Attribute<Message>> => itemStateDataAttributes(h, config, item)

const itemIndicatorAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: ComboboxItemDescriptor,
): ReadonlyArray<Attribute<Message>> =>
  selectedValues(config).includes(item.value)
    ? itemStateDataAttributes(h, config, item)
    : []

const chipKeyboardMessage = <Message>(
  config: ViewConfig<Message>,
  item: ComboboxItemDescriptor,
  key: string,
  modifiers: KeyboardModifiers,
): Option.Option<Message> => {
  if (
    modifiers.shiftKey ||
    modifiers.ctrlKey ||
    modifiers.altKey ||
    modifiers.metaKey
  ) {
    return Option.none()
  }

  if (key === 'Backspace' || key === 'Delete') {
    return removeValueMessage(config, item, 'chip-keyboard-remove')
  }

  if (key === 'ArrowLeft') {
    const previous = nextHighlightedChip(config, 'previous')

    return previous === undefined
      ? clearChipHighlightMessageOption(config)
      : chipHighlightMessage(config, previous, 'keyboard-navigation')
  }

  if (key === 'ArrowRight') {
    const next = nextHighlightedChip(config, 'next')

    return next === undefined
      ? clearChipHighlightMessageOption(config)
      : chipHighlightMessage(config, next, 'keyboard-navigation')
  }

  return Option.none()
}

const chipAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: ComboboxItemDescriptor,
): ReadonlyArray<Attribute<Message>> => [
  h.Id(chipId(config, item)),
  h.Tabindex(config.highlightedChipValue === item.value ? 0 : -1),
  ...booleanDataAttribute(h, 'disabled', config.isDisabled),
  ...optionalBooleanAttribute<Message>(config.isDisabled, value =>
    h.AriaDisabled(value),
  ),
  ...optionalBooleanAttribute<Message>(config.isReadOnly, value =>
    h.AriaReadonly(value),
  ),
  ...(config.highlightedChipValue === item.value
    ? [h.DataAttribute('highlighted', '')]
    : []),
  h.OnKeyDownPreventDefault((key, modifiers) =>
    chipKeyboardMessage(config, item, key, modifiers),
  ),
]

const chipRemoveAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: ComboboxItemDescriptor,
): ReadonlyArray<Attribute<Message>> => [
  h.Id(chipRemoveId(config, item)),
  h.Type('button'),
  h.Tabindex(-1),
  ...booleanDataAttribute(h, 'disabled', config.isDisabled),
  ...optionalBooleanAttribute<Message>(config.isDisabled, value =>
    h.AriaDisabled(value),
  ),
  ...optionalMessageAttribute(
    removeValueMessage(config, item, 'chip-remove-press'),
    message => h.OnClick(message),
  ),
]

const formOwnerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  form: string | undefined,
): ReadonlyArray<Attribute<Message>> =>
  Predicate.isNotUndefined(form) ? [h.Attribute('form', form)] : []

const hiddenInputAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<ReadonlyArray<Attribute<Message>>> => {
  if (config.name === undefined) {
    return []
  }

  const values = isMultiple(config)
    ? selectedValues(config)
    : [config.value ?? '']

  return values.map(value => [
    h.Type('hidden'),
    h.Name(config.name ?? ''),
    h.Value(value),
    ...formOwnerAttributes(h, config.form),
    ...optionalBooleanAttribute<Message>(config.isDisabled, disabled =>
      h.Disabled(disabled),
    ),
    ...optionalBooleanAttribute<Message>(config.isRequired, required =>
      h.Required(required),
    ),
  ])
}

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const mounted = isMounted(config)
  const visibleItems = filteredItems(config)
  const selected = visibleSelectedItems(config)
  const empty = visibleItems.length === 0

  return config.toView({
    root: rootAttributes(h, config),
    inputGroup: inputGroupAttributes(h, config),
    input: inputAttributes(h, config, visibleItems),
    trigger: triggerAttributes(h, config, visibleItems),
    value: valueAttributes(h, config),
    clear: clearAttributes(h, config),
    portal: portalAttributes(h),
    positioner: positionerAttributes(h, config, mounted, empty),
    backdrop: backdropAttributes(h, config, mounted),
    popup: popupAttributes(h, config, mounted, empty),
    list: listAttributes(h, config, mounted, empty),
    arrow: arrowAttributes(h, config, mounted),
    collection: [h.Id(collectionId(config)), h.DataAttribute('collection', '')],
    group: [h.Role('group')],
    groupLabel: [],
    empty: [
      h.Id(emptyId(config)),
      h.Role('status'),
      h.Attribute('aria-live', 'polite'),
      h.Attribute('aria-atomic', 'true'),
    ],
    separator: [h.Role('separator'), h.AriaOrientation('horizontal')],
    items: visibleItems.map(item => ({
      item,
      root: itemAttributes(h, config, item),
      text: itemTextAttributes(h, config, item),
      indicator: itemIndicatorAttributes(h, config, item),
    })),
    chips: [
      h.Id(chipsId(config)),
      ...(selected.length > 0 ? [h.Role('toolbar')] : []),
      ...booleanDataAttribute(h, 'disabled', config.isDisabled),
    ],
    chipInput: [
      ...inputAttributes(h, config, visibleItems),
      h.Id(`${inputId(config)}-chip`),
    ],
    chipItems: selected.map(item => ({
      item,
      root: chipAttributes(h, config, item),
      remove: chipRemoveAttributes(h, config, item),
    })),
    hiddenInputs: hiddenInputAttributes(h, config),
    filteredItems: visibleItems,
    selectedItems: selected,
    isMounted: mounted,
    isOpen: config.open,
    isEmpty: empty,
  })
}
