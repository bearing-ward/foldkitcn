import { Option, Predicate, Schema as S } from 'effect'
import type { Attribute, Html, KeyboardModifiers } from 'foldkit/html'
import { html } from 'foldkit/html'

// MODEL

export const ToggleGroupOrientation = S.Union([
  S.Literal('horizontal'),
  S.Literal('vertical'),
])
export type ToggleGroupOrientation = typeof ToggleGroupOrientation.Type

export const ToggleGroupSelectionMode = S.Union([
  S.Literal('single'),
  S.Literal('multiple'),
])
export type ToggleGroupSelectionMode = typeof ToggleGroupSelectionMode.Type

export const ToggleGroupChangeReason = S.Literal('none')
export type ToggleGroupChangeReason = typeof ToggleGroupChangeReason.Type

export const ToggleGroupValueChange = S.Struct({
  value: S.Array(S.String),
  reason: ToggleGroupChangeReason,
  focusSelector: S.optional(S.String),
})
export type ToggleGroupValueChange = typeof ToggleGroupValueChange.Type

export const ToggleGroupHighlightChange = S.Struct({
  value: S.String,
  focusSelector: S.optional(S.String),
})
export type ToggleGroupHighlightChange = typeof ToggleGroupHighlightChange.Type

export const ToggleGroupItemDescriptor = S.Struct({
  id: S.optional(S.String),
  value: S.String,
  label: S.optional(S.String),
  isDisabled: S.optional(S.Boolean),
  isNativeButton: S.optional(S.Boolean),
})
export type ToggleGroupItemDescriptor = typeof ToggleGroupItemDescriptor.Type

export const ToggleGroupOptions = S.Struct({
  id: S.optional(S.String),
  value: S.Array(S.String),
  highlightedValue: S.optional(S.String),
  selectionMode: S.optional(ToggleGroupSelectionMode),
  orientation: S.optional(ToggleGroupOrientation),
  loopFocus: S.optional(S.Boolean),
  isDisabled: S.optional(S.Boolean),
  items: S.Array(ToggleGroupItemDescriptor),
})
export type ToggleGroupOptions = typeof ToggleGroupOptions.Type

// UPDATE

export const isPressed = (
  groupValue: ReadonlyArray<string>,
  item: Pick<ToggleGroupItemDescriptor, 'value'>,
): boolean => groupValue.includes(item.value)

export const pressedState = (
  groupValue: ReadonlyArray<string>,
  item: Pick<ToggleGroupItemDescriptor, 'value'>,
): 'on' | 'off' => (isPressed(groupValue, item) ? 'on' : 'off')

export const valueChange = (
  value: ReadonlyArray<string>,
  focusSelector?: string,
): ToggleGroupValueChange => ({
  value,
  reason: 'none',
  ...(focusSelector === undefined ? {} : { focusSelector }),
})

export const highlightChange = (
  value: string,
  focusSelector?: string,
): ToggleGroupHighlightChange => ({
  value,
  ...(focusSelector === undefined ? {} : { focusSelector }),
})

export const itemFocusSelector = (
  item: Pick<ToggleGroupItemDescriptor, 'id'>,
): string | undefined => (item.id === undefined ? undefined : `#${item.id}`)

export const nextValue = (
  groupValue: ReadonlyArray<string>,
  selectionMode: ToggleGroupSelectionMode,
  item: Pick<ToggleGroupItemDescriptor, 'value'>,
): ReadonlyArray<string> => {
  const itemIsPressed = isPressed(groupValue, item)

  if (selectionMode === 'single') {
    return itemIsPressed ? [] : [item.value]
  }

  return itemIsPressed
    ? groupValue.filter(value => value !== item.value)
    : [...groupValue, item.value]
}

// VIEW

export type ToggleGroupItemAttributes<Message> = Readonly<{
  item: ToggleGroupItemDescriptor
  root: ReadonlyArray<Attribute<Message>>
}>

export type ToggleGroupAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  items: ReadonlyArray<ToggleGroupItemAttributes<Message>>
}>

export type ViewConfig<Message> = ToggleGroupOptions &
  Readonly<{
    toView: (attributes: ToggleGroupAttributes<Message>) => Html
    onValueChange?: (change: ToggleGroupValueChange) => Message
    onHighlightChange?: (change: ToggleGroupHighlightChange) => Message
  }>

const defaultOrientation = 'horizontal'
const defaultSelectionMode = 'single'

const optionalAttribute = <Message>(
  value: string | undefined,
  toAttribute: (value: string) => Attribute<Message>,
): ReadonlyArray<Attribute<Message>> =>
  Predicate.isNotUndefined(value) ? [toAttribute(value)] : []

const booleanDataAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  name: string,
  value: boolean | undefined,
): ReadonlyArray<Attribute<Message>> =>
  value === true ? [h.DataAttribute(name, '')] : []

const stateDataAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<
    ToggleGroupOptions,
    'isDisabled' | 'orientation' | 'selectionMode'
  >,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('orientation', config.orientation ?? defaultOrientation),
  ...booleanDataAttribute(h, 'disabled', config.isDisabled),
  ...booleanDataAttribute(
    h,
    'multiple',
    (config.selectionMode ?? defaultSelectionMode) === 'multiple',
  ),
]

const enabledItems = (
  config: Pick<ToggleGroupOptions, 'isDisabled' | 'items'>,
): ReadonlyArray<ToggleGroupItemDescriptor> =>
  config.isDisabled === true
    ? []
    : config.items.filter(item => item.isDisabled !== true)

const firstEnabledItem = (
  config: Pick<ToggleGroupOptions, 'isDisabled' | 'items'>,
): ToggleGroupItemDescriptor | undefined => enabledItems(config)[0]

const firstPressedEnabledItem = (
  config: Pick<ToggleGroupOptions, 'isDisabled' | 'items' | 'value'>,
): ToggleGroupItemDescriptor | undefined =>
  enabledItems(config).find(item => isPressed(config.value, item))

const highlightedEnabledItem = (
  config: Pick<ToggleGroupOptions, 'highlightedValue' | 'isDisabled' | 'items'>,
): ToggleGroupItemDescriptor | undefined =>
  enabledItems(config).find(item => item.value === config.highlightedValue)

const tabbableValue = (
  config: Pick<
    ToggleGroupOptions,
    'highlightedValue' | 'isDisabled' | 'items' | 'value'
  >,
): string | undefined =>
  highlightedEnabledItem(config)?.value ??
  firstPressedEnabledItem(config)?.value ??
  firstEnabledItem(config)?.value

const canActivateItem = (
  config: Pick<ToggleGroupOptions, 'isDisabled'>,
  item: ToggleGroupItemDescriptor,
): boolean => config.isDisabled !== true && item.isDisabled !== true

const activationMessage = <Message>(
  config: Pick<
    ViewConfig<Message>,
    'isDisabled' | 'onValueChange' | 'selectionMode' | 'value'
  >,
  item: ToggleGroupItemDescriptor,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onValueChange) &&
  canActivateItem(config, item)
    ? Option.some(
        config.onValueChange(
          valueChange(
            nextValue(
              config.value,
              config.selectionMode ?? defaultSelectionMode,
              item,
            ),
            itemFocusSelector(item),
          ),
        ),
      )
    : Option.none()

const nextIndex = (
  currentIndex: number,
  enabled: ReadonlyArray<ToggleGroupItemDescriptor>,
  direction: 'next' | 'previous',
  loopFocus: boolean,
): number | undefined => {
  const offset = direction === 'next' ? 1 : -1
  const candidateIndex = currentIndex + offset

  if (candidateIndex >= 0 && candidateIndex < enabled.length) {
    return candidateIndex
  }

  if (!loopFocus) {
    return undefined
  }

  return direction === 'next' ? 0 : enabled.length - 1
}

const horizontalDirection = (
  key: string,
  dir: string | undefined,
): 'next' | 'previous' | undefined => {
  if (key === 'ArrowRight') {
    return dir === 'rtl' ? 'previous' : 'next'
  }

  if (key === 'ArrowLeft') {
    return dir === 'rtl' ? 'next' : 'previous'
  }

  return undefined
}

const verticalDirection = (key: string): 'next' | 'previous' | undefined => {
  if (key === 'ArrowDown') {
    return 'next'
  }

  if (key === 'ArrowUp') {
    return 'previous'
  }

  return undefined
}

const arrowDirection = (
  key: string,
  config: Pick<ToggleGroupOptions, 'orientation'> &
    Readonly<{ dir?: string | undefined }>,
): 'next' | 'previous' | undefined =>
  (config.orientation ?? defaultOrientation) === 'vertical'
    ? verticalDirection(key)
    : horizontalDirection(key, config.dir)

const rovingItem = (
  config: Pick<
    ToggleGroupOptions,
    'isDisabled' | 'items' | 'loopFocus' | 'orientation'
  > &
    Readonly<{ dir?: string | undefined }>,
  item: ToggleGroupItemDescriptor,
  key: string,
): ToggleGroupItemDescriptor | undefined => {
  const enabled = enabledItems(config)
  const currentIndex = enabled.findIndex(entry => entry.value === item.value)

  if (key === 'Home') {
    return enabled[0]
  }

  if (key === 'End') {
    return enabled.at(-1)
  }

  const direction = arrowDirection(key, config)
  const targetIndex =
    direction === undefined || currentIndex === -1
      ? undefined
      : nextIndex(currentIndex, enabled, direction, config.loopFocus ?? true)

  return targetIndex === undefined ? undefined : enabled[targetIndex]
}

const hasKeyboardModifier = (modifiers: KeyboardModifiers): boolean =>
  modifiers.altKey ||
  modifiers.ctrlKey ||
  modifiers.metaKey ||
  modifiers.shiftKey

const rovingMessage = <Message>(
  config: ViewConfig<Message> & Readonly<{ dir?: string | undefined }>,
  item: ToggleGroupItemDescriptor,
  key: string,
  modifiers: KeyboardModifiers,
): Option.Option<Message> => {
  if (
    hasKeyboardModifier(modifiers) ||
    Predicate.isUndefined(config.onHighlightChange)
  ) {
    return Option.none()
  }

  const targetItem = rovingItem(config, item, key)

  return targetItem === undefined
    ? Option.none()
    : Option.some(
        config.onHighlightChange(
          highlightChange(targetItem.value, itemFocusSelector(targetItem)),
        ),
      )
}

const keyboardMessage = <Message>(
  config: ViewConfig<Message> & Readonly<{ dir?: string | undefined }>,
  item: ToggleGroupItemDescriptor,
  key: string,
  modifiers: KeyboardModifiers,
): Option.Option<Message> =>
  rovingMessage(config, item, key, modifiers).pipe(
    Option.orElse(() =>
      key === ' ' || key === 'Enter'
        ? activationMessage(config, item)
        : Option.none(),
    ),
  )

const eventAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message> & Readonly<{ dir?: string | undefined }>,
  item: ToggleGroupItemDescriptor,
): ReadonlyArray<Attribute<Message>> => {
  if (!canActivateItem(config, item)) {
    return []
  }

  const keyboardAttributes =
    Predicate.isNotUndefined(config.onValueChange) ||
    Predicate.isNotUndefined(config.onHighlightChange)
      ? [
          h.OnKeyDownPreventDefault((key, modifiers) =>
            keyboardMessage(config, item, key, modifiers),
          ),
        ]
      : []

  return Option.match(activationMessage(config, item), {
    onNone: () => keyboardAttributes,
    onSome: message => [h.OnClick(message), ...keyboardAttributes],
  })
}

const rootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.Role('group'),
  ...optionalAttribute<Message>(config.id, value => h.Id(value)),
  ...(config.isDisabled === true ? [h.AriaDisabled(true)] : []),
  ...stateDataAttributes(h, config),
]

const pressedAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  isItemPressed: boolean,
): ReadonlyArray<Attribute<Message>> => [
  h.AriaPressed(String(isItemPressed)),
  h.DataAttribute('state', isItemPressed ? 'on' : 'off'),
  ...(isItemPressed ? [h.DataAttribute('pressed', '')] : []),
]

const itemTabIndex = (
  config: Pick<
    ToggleGroupOptions,
    'highlightedValue' | 'isDisabled' | 'items' | 'value'
  >,
  item: ToggleGroupItemDescriptor,
): number => {
  if (config.isDisabled === true || item.isDisabled === true) {
    return -1
  }

  return tabbableValue(config) === item.value ? 0 : -1
}

const itemKindAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  item: Pick<ToggleGroupItemDescriptor, 'isNativeButton'>,
): ReadonlyArray<Attribute<Message>> =>
  item.isNativeButton === false ? [h.Role('button')] : [h.Type('button')]

const disabledAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ToggleGroupOptions, 'isDisabled'>,
  item: Pick<ToggleGroupItemDescriptor, 'isDisabled'>,
): ReadonlyArray<Attribute<Message>> =>
  config.isDisabled === true || item.isDisabled === true
    ? [h.AriaDisabled(true), h.DataAttribute('disabled', '')]
    : []

const itemOrientationAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ToggleGroupOptions, 'orientation'>,
): Attribute<Message> =>
  h.DataAttribute('orientation', config.orientation ?? defaultOrientation)

const itemAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message> & Readonly<{ dir?: string | undefined }>,
  item: ToggleGroupItemDescriptor,
): ReadonlyArray<Attribute<Message>> => {
  const itemIsPressed = isPressed(config.value, item)

  return [
    ...itemKindAttributes(h, item),
    h.Tabindex(itemTabIndex(config, item)),
    ...optionalAttribute<Message>(item.id, value => h.Id(value)),
    ...pressedAttributes(h, itemIsPressed),
    ...disabledAttributes(h, config, item),
    itemOrientationAttribute(h, config),
    ...eventAttributes(h, config, item),
  ]
}

export const view = <Message>(
  config: ViewConfig<Message> & Readonly<{ dir?: string | undefined }>,
): Html => {
  const h = html<Message>()

  return config.toView({
    root: rootAttributes(h, config),
    items: config.items.map(item => ({
      item,
      root: itemAttributes(h, config, item),
    })),
  })
}
