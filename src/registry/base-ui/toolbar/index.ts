import { Option, Predicate, Schema as S } from 'effect'
import type { Attribute, Html, KeyboardModifiers } from 'foldkit/html'
import { html } from 'foldkit/html'

// MODEL

export const ToolbarOrientation = S.Union([
  S.Literal('horizontal'),
  S.Literal('vertical'),
])
export type ToolbarOrientation = typeof ToolbarOrientation.Type

export const ToolbarItemKind = S.Union([
  S.Literal('button'),
  S.Literal('link'),
  S.Literal('input'),
])
export type ToolbarItemKind = typeof ToolbarItemKind.Type

export const ToolbarChildKind = S.Union([ToolbarItemKind, S.Literal('group')])
export type ToolbarChildKind = typeof ToolbarChildKind.Type

export const ToolbarHighlightChange = S.Struct({
  value: S.String,
  focusSelector: S.optional(S.String),
})
export type ToolbarHighlightChange = typeof ToolbarHighlightChange.Type

export const ToolbarItemPress = S.Struct({
  value: S.String,
  kind: ToolbarItemKind,
})
export type ToolbarItemPress = typeof ToolbarItemPress.Type

export const ToolbarInputChangeReason = S.Literal('none')
export type ToolbarInputChangeReason = typeof ToolbarInputChangeReason.Type

export const ToolbarInputValueChange = S.Struct({
  value: S.String,
  itemValue: S.String,
  reason: ToolbarInputChangeReason,
})
export type ToolbarInputValueChange = typeof ToolbarInputValueChange.Type

export const ToolbarItemDescriptor = S.Struct({
  id: S.optional(S.String),
  value: S.String,
  label: S.optional(S.String),
  kind: S.optional(ToolbarItemKind),
  href: S.optional(S.String),
  name: S.optional(S.String),
  type: S.optional(S.String),
  inputValue: S.optional(S.Union([S.String, S.Number])),
  placeholder: S.optional(S.String),
  isDisabled: S.optional(S.Boolean),
  isFocusableWhenDisabled: S.optional(S.Boolean),
  isNativeButton: S.optional(S.Boolean),
})
export type ToolbarItemDescriptor = typeof ToolbarItemDescriptor.Type

export const ToolbarChildDescriptor = S.Struct({
  id: S.optional(S.String),
  value: S.String,
  label: S.optional(S.String),
  kind: S.optional(ToolbarChildKind),
  href: S.optional(S.String),
  name: S.optional(S.String),
  type: S.optional(S.String),
  inputValue: S.optional(S.Union([S.String, S.Number])),
  placeholder: S.optional(S.String),
  isDisabled: S.optional(S.Boolean),
  isFocusableWhenDisabled: S.optional(S.Boolean),
  isNativeButton: S.optional(S.Boolean),
  items: S.optional(S.Array(ToolbarItemDescriptor)),
})
export type ToolbarChildDescriptor = typeof ToolbarChildDescriptor.Type

export const ToolbarOptions = S.Struct({
  id: S.optional(S.String),
  orientation: S.optional(ToolbarOrientation),
  highlightedValue: S.optional(S.String),
  loopFocus: S.optional(S.Boolean),
  isDisabled: S.optional(S.Boolean),
  dir: S.optional(S.String),
  children: S.Array(ToolbarChildDescriptor),
})
export type ToolbarOptions = typeof ToolbarOptions.Type

// UPDATE

type ToolbarItemSource = ToolbarItemDescriptor | ToolbarChildDescriptor

type ResolvedToolbarItem = Readonly<{
  group?: ToolbarChildDescriptor
  item: ToolbarItemSource
}>

const defaultOrientation: ToolbarOrientation = 'horizontal'
const defaultLoopFocus = true
const defaultItemKind: ToolbarItemKind = 'button'
const defaultFocusableWhenDisabled = true
const activationKeys = new Set(['Enter', ' '])

export const itemKind = (item: ToolbarItemSource): ToolbarItemKind => {
  if (item.kind === 'link' || item.kind === 'input') {
    return item.kind
  }

  return defaultItemKind
}

export const childKind = (child: ToolbarChildDescriptor): ToolbarChildKind =>
  child.kind ?? defaultItemKind

export const highlightChange = (
  value: string,
  focusSelector?: string | undefined,
): ToolbarHighlightChange => ({
  value,
  ...(focusSelector === undefined ? {} : { focusSelector }),
})

export const itemPress = (item: ToolbarItemSource): ToolbarItemPress => ({
  value: item.value,
  kind: itemKind(item),
})

export const inputValueChange = (
  item: ToolbarItemSource,
  value: string,
): ToolbarInputValueChange => ({
  value,
  itemValue: item.value,
  reason: 'none',
})

export const itemFocusSelector = (
  item: Pick<ToolbarItemSource, 'id'>,
): string | undefined => (item.id === undefined ? undefined : `#${item.id}`)

const resolvedChildItems = (
  child: ToolbarChildDescriptor,
): ReadonlyArray<ResolvedToolbarItem> =>
  childKind(child) === 'group'
    ? (child.items ?? []).map(item => ({ group: child, item }))
    : [{ item: child }]

const resolvedItems = (
  children: ReadonlyArray<ToolbarChildDescriptor>,
): ReadonlyArray<ResolvedToolbarItem> => children.flatMap(resolvedChildItems)

const isDisabledByContext = (
  config: Pick<ToolbarOptions, 'isDisabled'>,
  resolvedItem: ResolvedToolbarItem,
): boolean =>
  config.isDisabled === true ||
  resolvedItem.group?.isDisabled === true ||
  resolvedItem.item.isDisabled === true

const isItemDisabled = (
  config: Pick<ToolbarOptions, 'isDisabled'>,
  resolvedItem: ResolvedToolbarItem,
): boolean =>
  itemKind(resolvedItem.item) === 'link'
    ? false
    : isDisabledByContext(config, resolvedItem)

const focusableWhenDisabled = (item: ToolbarItemSource): boolean =>
  item.isFocusableWhenDisabled ?? defaultFocusableWhenDisabled

const isNavigableItem = (
  config: Pick<ToolbarOptions, 'isDisabled'>,
  resolvedItem: ResolvedToolbarItem,
): boolean =>
  !isItemDisabled(config, resolvedItem) ||
  itemKind(resolvedItem.item) === 'link' ||
  focusableWhenDisabled(resolvedItem.item)

const navigableItems = (
  config: Pick<ToolbarOptions, 'children' | 'isDisabled'>,
): ReadonlyArray<ResolvedToolbarItem> =>
  resolvedItems(config.children).filter(item => isNavigableItem(config, item))

const highlightedItem = (
  config: Pick<ToolbarOptions, 'children' | 'highlightedValue' | 'isDisabled'>,
): ResolvedToolbarItem | undefined =>
  navigableItems(config).find(
    item => item.item.value === config.highlightedValue,
  )

const tabbableValue = (
  config: Pick<ToolbarOptions, 'children' | 'highlightedValue' | 'isDisabled'>,
): string | undefined =>
  highlightedItem(config)?.item.value ?? navigableItems(config)[0]?.item.value

const itemTabIndex = (
  config: Pick<ToolbarOptions, 'children' | 'highlightedValue' | 'isDisabled'>,
  item: ToolbarItemSource,
): number => (tabbableValue(config) === item.value ? 0 : -1)

const nextIndex = (
  currentIndex: number,
  enabled: ReadonlyArray<ResolvedToolbarItem>,
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
  config: Pick<ToolbarOptions, 'dir' | 'orientation'>,
): 'next' | 'previous' | undefined =>
  (config.orientation ?? defaultOrientation) === 'vertical'
    ? verticalDirection(key)
    : horizontalDirection(key, config.dir)

const rovingItem = (
  config: Pick<
    ToolbarOptions,
    'children' | 'dir' | 'isDisabled' | 'loopFocus' | 'orientation'
  >,
  item: ToolbarItemSource,
  key: string,
): ResolvedToolbarItem | undefined => {
  const enabled = navigableItems(config)
  const currentIndex = enabled.findIndex(
    entry => entry.item.value === item.value,
  )

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
      : nextIndex(
          currentIndex,
          enabled,
          direction,
          config.loopFocus ?? defaultLoopFocus,
        )

  return targetIndex === undefined ? undefined : enabled[targetIndex]
}

const hasKeyboardModifier = (modifiers: KeyboardModifiers): boolean =>
  modifiers.altKey ||
  modifiers.ctrlKey ||
  modifiers.metaKey ||
  modifiers.shiftKey

// VIEW

export type ToolbarItemAttributes<Message> = Readonly<{
  kind: ToolbarItemKind
  item: ToolbarItemSource
  root: ReadonlyArray<Attribute<Message>>
}>

export type ToolbarGroupAttributes<Message> = Readonly<{
  group: ToolbarChildDescriptor
  items: ReadonlyArray<ToolbarItemAttributes<Message>>
  root: ReadonlyArray<Attribute<Message>>
}>

export type ToolbarChildAttributes<Message> =
  | Readonly<{
      _tag: 'Item'
      item: ToolbarItemAttributes<Message>
    }>
  | Readonly<{
      _tag: 'Group'
      group: ToolbarGroupAttributes<Message>
    }>

export type ToolbarAttributes<Message> = Readonly<{
  children: ReadonlyArray<ToolbarChildAttributes<Message>>
  root: ReadonlyArray<Attribute<Message>>
}>

export type ViewConfig<Message> = ToolbarOptions &
  Readonly<{
    toView: (attributes: ToolbarAttributes<Message>) => Html
    onHighlightChange?: (change: ToolbarHighlightChange) => Message
    onInputValueChange?: (change: ToolbarInputValueChange) => Message
    onItemPress?: (press: ToolbarItemPress) => Message
  }>

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

const valueAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  value: string | number | undefined,
): ReadonlyArray<Attribute<Message>> =>
  Predicate.isNotUndefined(value) ? [h.Value(String(value))] : []

const nativeDisabledAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  item: ToolbarItemSource,
): ReadonlyArray<Attribute<Message>> =>
  focusableWhenDisabled(item)
    ? [h.AriaDisabled(true), h.DataAttribute('disabled', '')]
    : [h.Disabled(true), h.DataAttribute('disabled', '')]

const nonNativeButtonDisabledAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  item: ToolbarItemSource,
): ReadonlyArray<Attribute<Message>> => [
  h.AriaDisabled(true),
  ...(focusableWhenDisabled(item) ? [] : [h.Tabindex(-1)]),
  h.DataAttribute('disabled', ''),
]

const disabledAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  kind: ToolbarItemKind,
  item: ToolbarItemSource,
  isDisabled: boolean,
): ReadonlyArray<Attribute<Message>> => {
  if (!isDisabled || kind === 'link') {
    return []
  }

  if (kind === 'button' && item.isNativeButton === false) {
    return nonNativeButtonDisabledAttributes(h, item)
  }

  return nativeDisabledAttributes(h, item)
}

const focusableAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  kind: ToolbarItemKind,
  item: ToolbarItemSource,
): ReadonlyArray<Attribute<Message>> =>
  kind === 'button' || kind === 'input'
    ? booleanDataAttribute(h, 'focusable', focusableWhenDisabled(item))
    : []

const kindAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  kind: ToolbarItemKind,
  item: ToolbarItemSource,
): ReadonlyArray<Attribute<Message>> => {
  if (kind === 'link') {
    return optionalAttribute<Message>(item.href, value => h.Href(value))
  }

  if (kind === 'input') {
    return [
      ...optionalAttribute<Message>(item.type, value => h.Type(value)),
      ...optionalAttribute<Message>(item.name, value => h.Name(value)),
      ...optionalAttribute<Message>(item.placeholder, value =>
        h.Placeholder(value),
      ),
      ...valueAttribute(h, item.inputValue),
    ]
  }

  return item.isNativeButton === false ? [h.Role('button')] : [h.Type('button')]
}

const activationMessage = <Message>(
  config: Pick<ViewConfig<Message>, 'onItemPress'>,
  item: ToolbarItemSource,
  isDisabled: boolean,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onItemPress) && !isDisabled
    ? Option.some(config.onItemPress(itemPress(item)))
    : Option.none()

const rovingMessage = <Message>(
  config: ViewConfig<Message>,
  item: ToolbarItemSource,
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
          highlightChange(
            targetItem.item.value,
            itemFocusSelector(targetItem.item),
          ),
        ),
      )
}

const keyboardMessage = <Message>(
  config: ViewConfig<Message>,
  item: ToolbarItemSource,
  key: string,
  modifiers: KeyboardModifiers,
  isDisabled: boolean,
): Option.Option<Message> =>
  rovingMessage(config, item, key, modifiers).pipe(
    Option.orElse(() =>
      activationKeys.has(key) && itemKind(item) === 'button'
        ? activationMessage(config, item, isDisabled)
        : Option.none(),
    ),
  )

const clickAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: ToolbarItemSource,
  isDisabled: boolean,
): ReadonlyArray<Attribute<Message>> =>
  Option.match(activationMessage(config, item, isDisabled), {
    onNone: () => [],
    onSome: message => [h.OnClick(message)],
  })

const keyboardAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: ToolbarItemSource,
  isDisabled: boolean,
): ReadonlyArray<Attribute<Message>> =>
  Predicate.isNotUndefined(config.onHighlightChange) ||
  Predicate.isNotUndefined(config.onItemPress)
    ? [
        h.OnKeyDownPreventDefault((key, modifiers) =>
          keyboardMessage(config, item, key, modifiers, isDisabled),
        ),
      ]
    : []

const inputChangeAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: ToolbarItemSource,
  isDisabled: boolean,
): ReadonlyArray<Attribute<Message>> => {
  const { onInputValueChange } = config

  return Predicate.isNotUndefined(onInputValueChange) && !isDisabled
    ? [h.OnInput(value => onInputValueChange(inputValueChange(item, value)))]
    : []
}

const eventAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: ToolbarItemSource,
  isDisabled: boolean,
): ReadonlyArray<Attribute<Message>> => {
  const kind = itemKind(item)
  const inputEvents =
    kind === 'input' ? inputChangeAttributes(h, config, item, isDisabled) : []

  return [
    ...clickAttributes(h, config, item, isDisabled),
    ...keyboardAttributes(h, config, item, isDisabled),
    ...inputEvents,
  ]
}

const rootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.Role('toolbar'),
  h.AriaOrientation(config.orientation ?? defaultOrientation),
  h.DataAttribute('orientation', config.orientation ?? defaultOrientation),
  ...optionalAttribute<Message>(config.id, value => h.Id(value)),
  ...optionalAttribute<Message>(config.dir, value => h.Attribute('dir', value)),
  ...booleanDataAttribute(h, 'disabled', config.isDisabled),
]

const groupAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  group: ToolbarChildDescriptor,
): ReadonlyArray<Attribute<Message>> => [
  h.Role('group'),
  ...optionalAttribute<Message>(group.id, value => h.Id(value)),
  h.DataAttribute('orientation', config.orientation ?? defaultOrientation),
  ...booleanDataAttribute(
    h,
    'disabled',
    config.isDisabled === true || group.isDisabled === true,
  ),
]

const itemAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  resolvedItem: ResolvedToolbarItem,
): ToolbarItemAttributes<Message> => {
  const kind = itemKind(resolvedItem.item)
  const isDisabled = isItemDisabled(config, resolvedItem)

  return {
    kind,
    item: resolvedItem.item,
    root: [
      ...kindAttributes(h, kind, resolvedItem.item),
      h.Tabindex(itemTabIndex(config, resolvedItem.item)),
      ...optionalAttribute<Message>(resolvedItem.item.id, value => h.Id(value)),
      ...disabledAttributes(h, kind, resolvedItem.item, isDisabled),
      h.DataAttribute('orientation', config.orientation ?? defaultOrientation),
      ...focusableAttributes(h, kind, resolvedItem.item),
      ...eventAttributes(h, config, resolvedItem.item, isDisabled),
    ],
  }
}

const childAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  child: ToolbarChildDescriptor,
): ToolbarChildAttributes<Message> => {
  if (childKind(child) === 'group') {
    return {
      _tag: 'Group',
      group: {
        group: child,
        root: groupAttributes(h, config, child),
        items: (child.items ?? []).map(item =>
          itemAttributes(h, config, { group: child, item }),
        ),
      },
    }
  }

  return {
    _tag: 'Item',
    item: itemAttributes(h, config, { item: child }),
  }
}

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()

  return config.toView({
    root: rootAttributes(h, config),
    children: config.children.map(child => childAttributes(h, config, child)),
  })
}
