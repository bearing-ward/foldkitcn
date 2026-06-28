import { Predicate, Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import * as Combobox from '../combobox'

// MODEL

export const AutocompleteSide = Combobox.ComboboxSide
export type AutocompleteSide = Combobox.ComboboxSide

export const AutocompleteAlign = Combobox.ComboboxAlign
export type AutocompleteAlign = Combobox.ComboboxAlign

export const AutocompleteTransitionStatus = Combobox.ComboboxTransitionStatus
export type AutocompleteTransitionStatus = Combobox.ComboboxTransitionStatus

export const AutocompleteMode = S.Union([
  S.Literal('list'),
  S.Literal('both'),
  S.Literal('inline'),
  S.Literal('none'),
])
export type AutocompleteMode = typeof AutocompleteMode.Type

export const AutocompleteAutoHighlight = S.Boolean
export type AutocompleteAutoHighlight = typeof AutocompleteAutoHighlight.Type

export const AutocompleteOpenChangeReason = S.Union([
  S.Literal('trigger-press'),
  S.Literal('input-press'),
  S.Literal('input-change'),
  S.Literal('input-clear'),
  S.Literal('outside-press'),
  S.Literal('escape-key'),
  S.Literal('keyboard-open'),
  S.Literal('list-navigation'),
  S.Literal('none'),
])
export type AutocompleteOpenChangeReason =
  typeof AutocompleteOpenChangeReason.Type

export const AutocompleteValueChangeReason = S.Union([
  S.Literal('input-change'),
  S.Literal('input-clear'),
  S.Literal('item-press'),
  S.Literal('keyboard-select'),
  S.Literal('clear-press'),
  S.Literal('none'),
])
export type AutocompleteValueChangeReason =
  typeof AutocompleteValueChangeReason.Type

export const AutocompleteHighlightChangeReason =
  Combobox.ComboboxHighlightChangeReason
export type AutocompleteHighlightChangeReason =
  Combobox.ComboboxHighlightChangeReason

export const AutocompleteOpenChange = S.Struct({
  open: S.Boolean,
  reason: AutocompleteOpenChangeReason,
})
export type AutocompleteOpenChange = typeof AutocompleteOpenChange.Type

export const AutocompleteValueChange = S.Struct({
  value: S.String,
  label: S.optional(S.String),
  itemValue: S.optional(S.String),
  reason: AutocompleteValueChangeReason,
})
export type AutocompleteValueChange = typeof AutocompleteValueChange.Type

export const AutocompleteHighlightChange = Combobox.ComboboxHighlightChange
export type AutocompleteHighlightChange = Combobox.ComboboxHighlightChange

export const AutocompleteItemDescriptor = Combobox.ComboboxItemDescriptor
export type AutocompleteItemDescriptor = Combobox.ComboboxItemDescriptor

export const AutocompleteOptions = S.Struct({
  id: S.String,
  open: S.Boolean,
  value: S.String,
  items: S.Array(AutocompleteItemDescriptor),
  highlightedValue: S.optional(S.String),
  placeholder: S.optional(S.String),
  name: S.optional(S.String),
  form: S.optional(S.String),
  forceMount: S.optional(S.Boolean),
  transitionStatus: S.optional(AutocompleteTransitionStatus),
  isDisabled: S.optional(S.Boolean),
  isInvalid: S.optional(S.Boolean),
  isRequired: S.optional(S.Boolean),
  isReadOnly: S.optional(S.Boolean),
  mode: S.optional(AutocompleteMode),
  autoHighlight: S.optional(AutocompleteAutoHighlight),
  openOnInputClick: S.optional(S.Boolean),
  side: S.optional(AutocompleteSide),
  align: S.optional(AutocompleteAlign),
  sideOffset: S.optional(S.Number),
  alignOffset: S.optional(S.Number),
  collisionAvoidance: S.optional(S.Boolean),
  collisionPadding: S.optional(S.Number),
})
export type AutocompleteOptions = typeof AutocompleteOptions.Type

// UPDATE

const defaultSide: AutocompleteSide = 'bottom'
const defaultMode: AutocompleteMode = 'list'

export const {
  FocusCombobox: FocusAutocomplete,
  RestoreComboboxFocus: RestoreAutocompleteFocus,
  rootId,
  inputId,
  inputGroupId,
  triggerId,
  popupId,
  listId,
  positionerId,
  arrowId,
  valueId,
  clearId,
  collectionId,
  emptyId,
  itemId,
  itemFocusSelector,
  enabledItems,
  highlightedItem,
  highlightChange,
  clearHighlightChange,
} = Combobox

export const resolvedMode = (
  config: Pick<AutocompleteOptions, 'mode'>,
): AutocompleteMode => config.mode ?? defaultMode

export const filtersItems = (
  config: Pick<AutocompleteOptions, 'mode'>,
): boolean => {
  const mode = resolvedMode(config)

  return mode === 'list' || mode === 'both'
}

export const completesInline = (
  config: Pick<AutocompleteOptions, 'mode'>,
): boolean => {
  const mode = resolvedMode(config)

  return mode === 'inline' || mode === 'both'
}

export const filterValue = (
  config: Pick<AutocompleteOptions, 'mode' | 'value'>,
): string => (filtersItems(config) ? config.value : '')

export const displayValue = (
  config: Pick<
    AutocompleteOptions,
    'highlightedValue' | 'items' | 'mode' | 'value'
  >,
): string => {
  if (!completesInline(config)) {
    return config.value
  }

  return highlightedItem(config)?.label ?? config.value
}

export const filteredItems = (
  config: Pick<AutocompleteOptions, 'isDisabled' | 'items' | 'mode' | 'value'>,
): ReadonlyArray<AutocompleteItemDescriptor> =>
  Combobox.filteredItems({
    inputValue: config.value,
    filterValue: filterValue(config),
    isDisabled: config.isDisabled,
    items: config.items,
  })

export const firstFilteredItem = (
  config: Pick<AutocompleteOptions, 'isDisabled' | 'items' | 'mode' | 'value'>,
): AutocompleteItemDescriptor | undefined => filteredItems(config)[0]

export const nextHighlightedItem = (
  config: Pick<
    AutocompleteOptions,
    'highlightedValue' | 'isDisabled' | 'items' | 'mode' | 'value'
  >,
  direction: 'first' | 'last' | 'next' | 'previous',
): AutocompleteItemDescriptor | undefined =>
  Combobox.nextHighlightedItem(
    {
      highlightedValue: config.highlightedValue,
      inputValue: config.value,
      filterValue: filterValue(config),
      isDisabled: config.isDisabled,
      items: config.items,
    },
    direction,
  )

export const openChange = (
  open: boolean,
  reason: AutocompleteOpenChangeReason = 'none',
): AutocompleteOpenChange => ({
  open,
  reason,
})

export const valueChange = (
  value: string,
  reason: AutocompleteValueChangeReason = 'none',
): AutocompleteValueChange => ({
  value,
  reason,
})

export const itemValueChange = (
  item: AutocompleteItemDescriptor,
  reason: Extract<
    AutocompleteValueChangeReason,
    'item-press' | 'keyboard-select'
  > = 'item-press',
): AutocompleteValueChange => ({
  value: item.label,
  label: item.label,
  itemValue: item.value,
  reason,
})

export const clearValueChange = (
  reason: Extract<
    AutocompleteValueChangeReason,
    'clear-press' | 'input-clear'
  > = 'input-clear',
): AutocompleteValueChange => ({
  value: '',
  reason,
})

const comboboxOpenChange = (
  change: Combobox.ComboboxOpenChange,
): AutocompleteOpenChange => ({
  open: change.open,
  reason: change.reason,
})

const valueReasonFromCombobox = (
  reason: Combobox.ComboboxValueChangeReason,
): AutocompleteValueChangeReason => {
  if (reason === 'item-press' || reason === 'keyboard-select') {
    return reason
  }

  if (reason === 'input-clear' || reason === 'clear-press') {
    return reason
  }

  return 'none'
}

const valueChangeFromCombobox = (
  change: Combobox.ComboboxValueChange,
): AutocompleteValueChange => {
  if (change.reason === 'input-clear' || change.reason === 'clear-press') {
    return clearValueChange(change.reason)
  }

  return {
    value: change.label ?? change.value ?? '',
    label: change.label,
    itemValue: change.changedValue ?? change.value,
    reason: valueReasonFromCombobox(change.reason),
  }
}

const valueChangeFromInput = (
  change: Combobox.ComboboxInputValueChange,
): AutocompleteValueChange => ({
  value: change.value,
  reason: change.reason,
})

export const commandForOpenChange = (
  config: Pick<AutocompleteOptions, 'id'>,
  change: AutocompleteOpenChange,
) =>
  Combobox.commandForOpenChange(
    config,
    Combobox.openChange(
      change.open,
      change.reason === 'input-press' ? 'trigger-press' : change.reason,
    ),
  )

// VIEW

export type AutocompletePartAttributes<Message> =
  Combobox.ComboboxPartAttributes<Message>

export type AutocompleteItemAttributes<Message> =
  Combobox.ComboboxItemAttributes<Message>

export type AutocompleteAttributes<Message> = Omit<
  Combobox.ComboboxAttributes<Message>,
  'chipInput' | 'chipItems' | 'chips' | 'hiddenInputs' | 'selectedItems'
> &
  Readonly<{
    valueText: string
  }>

export type ViewConfig<Message> = AutocompleteOptions &
  Readonly<{
    toView: (attributes: AutocompleteAttributes<Message>) => Html
    onOpenChange?: (change: AutocompleteOpenChange) => Message
    onValueChange?: (change: AutocompleteValueChange) => Message
    onHighlightChange?: (change: AutocompleteHighlightChange) => Message
    onFocus?: Message
    onBlur?: Message
  }>

const resolvedSide = (
  config: Pick<AutocompleteOptions, 'side'>,
): AutocompleteSide => config.side ?? defaultSide

const booleanDataAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  name: string,
  value: boolean | undefined,
): ReadonlyArray<Attribute<Message>> =>
  value === true ? [h.DataAttribute(name, '')] : []

const formOwnerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<AutocompleteOptions, 'form' | 'name'>,
): ReadonlyArray<Attribute<Message>> => [
  ...(Predicate.isNotUndefined(config.name) ? [h.Name(config.name)] : []),
  ...(Predicate.isNotUndefined(config.form)
    ? [h.Attribute('form', config.form)]
    : []),
]

const inputClickAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> =>
  config.openOnInputClick === true &&
  config.open !== true &&
  config.isDisabled !== true &&
  config.isReadOnly !== true &&
  Predicate.isNotUndefined(config.onOpenChange)
    ? [h.OnClick(config.onOpenChange(openChange(true, 'input-press')))]
    : []

const inputGroupAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  isEmpty: boolean,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('popup-side', config.open ? resolvedSide(config) : ''),
  ...(isEmpty ? [h.DataAttribute('list-empty', '')] : []),
  ...booleanDataAttribute(h, 'readonly', config.isReadOnly),
]

const triggerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  ...(config.value === '' ? [] : [h.DataAttribute('filled', '')]),
  ...booleanDataAttribute(h, 'required', config.isRequired),
  ...booleanDataAttribute(h, 'invalid', config.isInvalid),
  ...booleanDataAttribute(h, 'readonly', config.isReadOnly),
]

const optionalComboboxOptions = <Message>(
  config: ViewConfig<Message>,
): Partial<Combobox.ViewConfig<Message>> => {
  const {
    align,
    alignOffset,
    autoHighlight,
    collisionAvoidance,
    collisionPadding,
    forceMount,
    highlightedValue,
    isDisabled,
    isInvalid,
    isReadOnly,
    isRequired,
    placeholder,
    side,
    sideOffset,
    transitionStatus,
  } = config

  return {
    ...(highlightedValue === undefined ? {} : { highlightedValue }),
    ...(placeholder === undefined ? {} : { placeholder }),
    ...(forceMount === undefined ? {} : { forceMount }),
    ...(transitionStatus === undefined ? {} : { transitionStatus }),
    ...(isDisabled === undefined ? {} : { isDisabled }),
    ...(isInvalid === undefined ? {} : { isInvalid }),
    ...(isRequired === undefined ? {} : { isRequired }),
    ...(isReadOnly === undefined ? {} : { isReadOnly }),
    ...(autoHighlight === undefined ? {} : { autoHighlight }),
    ...(side === undefined ? {} : { side }),
    ...(align === undefined ? {} : { align }),
    ...(sideOffset === undefined ? {} : { sideOffset }),
    ...(alignOffset === undefined ? {} : { alignOffset }),
    ...(collisionAvoidance === undefined ? {} : { collisionAvoidance }),
    ...(collisionPadding === undefined ? {} : { collisionPadding }),
  }
}

const optionalComboboxCallbacks = <Message>(
  config: ViewConfig<Message>,
): Partial<Combobox.ViewConfig<Message>> => {
  const { onBlur, onFocus, onHighlightChange, onOpenChange, onValueChange } =
    config

  return {
    ...(onOpenChange === undefined
      ? {}
      : {
          onOpenChange: (change: Combobox.ComboboxOpenChange) =>
            onOpenChange(comboboxOpenChange(change)),
        }),
    ...(onValueChange === undefined
      ? {}
      : {
          onInputValueChange: (change: Combobox.ComboboxInputValueChange) =>
            onValueChange(valueChangeFromInput(change)),
          onValueChange: (change: Combobox.ComboboxValueChange) =>
            onValueChange(valueChangeFromCombobox(change)),
        }),
    ...(onHighlightChange === undefined ? {} : { onHighlightChange }),
    ...(onFocus === undefined ? {} : { onFocus }),
    ...(onBlur === undefined ? {} : { onBlur }),
  }
}

const comboboxConfig = <Message>(
  config: ViewConfig<Message>,
): Combobox.ViewConfig<Message> => {
  const { id, items, open, value } = config

  return {
    id,
    open,
    inputValue: value,
    displayInputValue: displayValue(config),
    filterValue: filterValue(config),
    items,
    values: [],
    showTriggerPlaceholder: false,
    ...optionalComboboxOptions(config),
    ...optionalComboboxCallbacks(config),
    toView: attributes => {
      const h = html<Message>()

      return config.toView({
        root: attributes.root,
        inputGroup: [
          ...attributes.inputGroup,
          ...inputGroupAttributes(h, config, attributes.isEmpty),
        ],
        input: [
          ...attributes.input,
          ...formOwnerAttributes(h, config),
          ...inputClickAttributes(h, config),
        ],
        trigger: [...attributes.trigger, ...triggerAttributes(h, config)],
        value: attributes.value,
        clear: attributes.clear,
        portal: attributes.portal,
        positioner: attributes.positioner,
        backdrop: attributes.backdrop,
        popup: attributes.popup,
        list: attributes.list,
        arrow: attributes.arrow,
        collection: attributes.collection,
        group: attributes.group,
        groupLabel: attributes.groupLabel,
        empty: attributes.empty,
        separator: attributes.separator,
        items: attributes.items,
        filteredItems: attributes.filteredItems,
        isMounted: attributes.isMounted,
        isOpen: attributes.isOpen,
        isEmpty: attributes.isEmpty,
        valueText: config.value,
      })
    },
  }
}

export const view = <Message>(config: ViewConfig<Message>): Html =>
  Combobox.view(comboboxConfig(config))
