import { Option, Predicate, Schema as S } from 'effect'
import type { Attribute, Html, KeyboardModifiers } from 'foldkit/html'
import { html } from 'foldkit/html'

// MODEL

export const AccordionOrientation = S.Union([
  S.Literal('horizontal'),
  S.Literal('vertical'),
])
export type AccordionOrientation = typeof AccordionOrientation.Type

export const AccordionTransitionStatus = S.Union([
  S.Literal('idle'),
  S.Literal('starting'),
  S.Literal('ending'),
])
export type AccordionTransitionStatus = typeof AccordionTransitionStatus.Type

export const AccordionChangeReason = S.Union([
  S.Literal('trigger-press'),
  S.Literal('none'),
])
export type AccordionChangeReason = typeof AccordionChangeReason.Type

export const AccordionValueChange = S.Struct({
  value: S.Array(S.String),
  reason: AccordionChangeReason,
  focusSelector: S.optional(S.String),
})
export type AccordionValueChange = typeof AccordionValueChange.Type

export const AccordionFocusChange = S.Struct({
  value: S.String,
  focusSelector: S.optional(S.String),
})
export type AccordionFocusChange = typeof AccordionFocusChange.Type

export const AccordionPanelGeometry = S.Struct({
  height: S.optional(S.Number),
  width: S.optional(S.Number),
})
export type AccordionPanelGeometry = typeof AccordionPanelGeometry.Type

export const AccordionPanelDescriptor = S.Struct({
  id: S.optional(S.String),
  label: S.optional(S.String),
  keepMounted: S.optional(S.Boolean),
  hiddenUntilFound: S.optional(S.Boolean),
  geometry: S.optional(AccordionPanelGeometry),
})
export type AccordionPanelDescriptor = typeof AccordionPanelDescriptor.Type

export const AccordionItemDescriptor = S.Struct({
  id: S.optional(S.String),
  value: S.String,
  label: S.optional(S.String),
  triggerId: S.optional(S.String),
  headerId: S.optional(S.String),
  isDisabled: S.optional(S.Boolean),
  transitionStatus: S.optional(AccordionTransitionStatus),
  panel: S.optional(AccordionPanelDescriptor),
})
export type AccordionItemDescriptor = typeof AccordionItemDescriptor.Type

export const AccordionOptions = S.Struct({
  id: S.optional(S.String),
  value: S.Array(S.String),
  multiple: S.optional(S.Boolean),
  isDisabled: S.optional(S.Boolean),
  orientation: S.optional(AccordionOrientation),
  dir: S.optional(S.String),
  loopFocus: S.optional(S.Boolean),
  keepMounted: S.optional(S.Boolean),
  hiddenUntilFound: S.optional(S.Boolean),
  items: S.Array(AccordionItemDescriptor),
})
export type AccordionOptions = typeof AccordionOptions.Type

// UPDATE

export const isOpen = (
  value: ReadonlyArray<string>,
  item: Pick<AccordionItemDescriptor, 'value'>,
): boolean => value.includes(item.value)

export const triggerId = (
  item: Pick<AccordionItemDescriptor, 'id' | 'triggerId' | 'value'>,
): string => item.triggerId ?? `${item.id ?? item.value}-trigger`

export const panelId = (
  item: Pick<AccordionItemDescriptor, 'id' | 'panel' | 'value'>,
): string => item.panel?.id ?? `${item.id ?? item.value}-panel`

export const triggerFocusSelector = (
  item: Pick<AccordionItemDescriptor, 'id' | 'triggerId' | 'value'>,
): string => `#${triggerId(item)}`

export const toggleValue = (
  value: ReadonlyArray<string>,
  item: Pick<AccordionItemDescriptor, 'value'>,
  multiple = false,
): ReadonlyArray<string> => {
  if (!multiple) {
    return isOpen(value, item) ? [] : [item.value]
  }

  return isOpen(value, item)
    ? value.filter(openValue => openValue !== item.value)
    : [...value, item.value]
}

export const valueChange = (
  value: ReadonlyArray<string>,
  reason: AccordionChangeReason,
  focusSelector?: string,
): AccordionValueChange => ({
  value: [...value],
  reason,
  ...(focusSelector === undefined ? {} : { focusSelector }),
})

export const focusChange = (
  value: string,
  focusSelector?: string,
): AccordionFocusChange => ({
  value,
  ...(focusSelector === undefined ? {} : { focusSelector }),
})

// VIEW

export type AccordionItemAttributes<Message> = Readonly<{
  item: AccordionItemDescriptor
  root: ReadonlyArray<Attribute<Message>>
  header: ReadonlyArray<Attribute<Message>>
  trigger: ReadonlyArray<Attribute<Message>>
  panel: AccordionPanelAttributes<Message>
  isDisabled: boolean
  isOpen: boolean
}>

export type AccordionPanelAttributes<Message> = Readonly<{
  panel: AccordionPanelDescriptor
  root: ReadonlyArray<Attribute<Message>>
  isMounted: boolean
  isOpen: boolean
}>

export type AccordionAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  items: ReadonlyArray<AccordionItemAttributes<Message>>
}>

export type ViewConfig<Message> = AccordionOptions &
  Readonly<{
    toView: (attributes: AccordionAttributes<Message>) => Html
    onValueChange?: (change: AccordionValueChange) => Message
    onFocusChange?: (change: AccordionFocusChange) => Message
  }>

const defaultOrientation = 'vertical'
const defaultPanel: AccordionPanelDescriptor = {}

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

const transitionDataAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  transitionStatus: AccordionTransitionStatus | undefined,
): ReadonlyArray<Attribute<Message>> => {
  if (transitionStatus === 'starting') {
    return [h.DataAttribute('starting-style', '')]
  }

  if (transitionStatus === 'ending') {
    return [h.DataAttribute('ending-style', '')]
  }

  return []
}

const openStateDataAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  open: boolean,
): ReadonlyArray<Attribute<Message>> =>
  open ? [h.DataAttribute('open', '')] : [h.DataAttribute('closed', '')]

const enabledItems = (
  config: Pick<AccordionOptions, 'isDisabled' | 'items'>,
): ReadonlyArray<AccordionItemDescriptor> =>
  config.isDisabled === true
    ? []
    : config.items.filter(item => item.isDisabled !== true)

const activeIndex = (
  items: ReadonlyArray<AccordionItemDescriptor>,
  item: Pick<AccordionItemDescriptor, 'value'>,
): number => items.findIndex(entry => entry.value === item.value)

const nextIndex = (
  currentIndex: number,
  items: ReadonlyArray<AccordionItemDescriptor>,
  direction: 'next' | 'previous',
  loopFocus: boolean,
): number | undefined => {
  const offset = direction === 'next' ? 1 : -1
  const candidateIndex = currentIndex + offset

  if (candidateIndex >= 0 && candidateIndex < items.length) {
    return candidateIndex
  }

  if (!loopFocus) {
    return undefined
  }

  return direction === 'next' ? 0 : items.length - 1
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
  config: Pick<AccordionOptions, 'dir' | 'orientation'>,
): 'next' | 'previous' | undefined =>
  (config.orientation ?? defaultOrientation) === 'vertical'
    ? verticalDirection(key)
    : horizontalDirection(key, config.dir)

const rovingItem = (
  config: Pick<
    AccordionOptions,
    'dir' | 'isDisabled' | 'items' | 'loopFocus' | 'orientation'
  >,
  item: AccordionItemDescriptor,
  key: string,
): AccordionItemDescriptor | undefined => {
  const candidates = enabledItems(config)

  if (key === 'Home') {
    return candidates[0]
  }

  if (key === 'End') {
    return candidates.at(-1)
  }

  const currentIndex = activeIndex(candidates, item)
  const direction = arrowDirection(key, config)
  const targetIndex =
    direction === undefined || currentIndex === -1
      ? undefined
      : nextIndex(currentIndex, candidates, direction, config.loopFocus ?? true)

  return targetIndex === undefined ? undefined : candidates[targetIndex]
}

const hasKeyboardModifier = (modifiers: KeyboardModifiers): boolean =>
  modifiers.altKey ||
  modifiers.ctrlKey ||
  modifiers.metaKey ||
  modifiers.shiftKey

const canActivateItem = (
  config: Pick<ViewConfig<unknown>, 'isDisabled' | 'onValueChange'>,
  item: Pick<AccordionItemDescriptor, 'isDisabled'>,
): boolean =>
  config.isDisabled !== true &&
  item.isDisabled !== true &&
  Predicate.isNotUndefined(config.onValueChange)

const selectionMessage = <Message>(
  config: ViewConfig<Message>,
  item: AccordionItemDescriptor,
): Option.Option<Message> =>
  canActivateItem(config, item) && config.onValueChange !== undefined
    ? Option.some(
        config.onValueChange(
          valueChange(
            toggleValue(config.value, item, config.multiple),
            'trigger-press',
            triggerFocusSelector(item),
          ),
        ),
      )
    : Option.none()

const focusMessage = <Message>(
  config: ViewConfig<Message>,
  item: AccordionItemDescriptor,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onFocusChange)
    ? Option.some(
        config.onFocusChange(
          focusChange(item.value, triggerFocusSelector(item)),
        ),
      )
    : Option.none()

const rovingMessage = <Message>(
  config: ViewConfig<Message>,
  item: AccordionItemDescriptor,
  key: string,
  modifiers: KeyboardModifiers,
): Option.Option<Message> => {
  if (hasKeyboardModifier(modifiers) || config.isDisabled === true) {
    return Option.none()
  }

  const targetItem = rovingItem(config, item, key)

  return targetItem === undefined
    ? Option.none()
    : focusMessage(config, targetItem)
}

const keyActivationMessage = <Message>(
  config: ViewConfig<Message>,
  item: AccordionItemDescriptor,
  key: string,
): Option.Option<Message> =>
  key === ' ' || key === 'Enter'
    ? selectionMessage(config, item)
    : Option.none()

const clickAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: AccordionItemDescriptor,
): ReadonlyArray<Attribute<Message>> =>
  Option.match(selectionMessage(config, item), {
    onNone: () => [],
    onSome: message => [h.OnClick(message)],
  })

const keyboardAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: AccordionItemDescriptor,
): ReadonlyArray<Attribute<Message>> => {
  if (config.isDisabled === true || item.isDisabled === true) {
    return []
  }

  return [
    h.OnKeyDownPreventDefault((key, modifiers) =>
      keyActivationMessage(config, item, key).pipe(
        Option.orElse(() => rovingMessage(config, item, key, modifiers)),
      ),
    ),
  ]
}

const rootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  ...optionalAttribute<Message>(config.id, value => h.Id(value)),
  h.DataAttribute('orientation', config.orientation ?? defaultOrientation),
  ...booleanDataAttribute(h, 'disabled', config.isDisabled),
]

const itemAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: AccordionItemDescriptor,
  index: number,
): ReadonlyArray<Attribute<Message>> => {
  const itemIsOpen = isOpen(config.value, item)
  const itemIsDisabled = config.isDisabled === true || item.isDisabled === true

  return [
    ...optionalAttribute<Message>(item.id, value => h.Id(value)),
    h.Attribute('data-index', String(index)),
    ...openStateDataAttributes(h, itemIsOpen),
    ...booleanDataAttribute(h, 'disabled', itemIsDisabled),
  ]
}

const headerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: AccordionItemDescriptor,
  index: number,
): ReadonlyArray<Attribute<Message>> => {
  const itemIsOpen = isOpen(config.value, item)
  const itemIsDisabled = config.isDisabled === true || item.isDisabled === true

  return [
    ...optionalAttribute<Message>(item.headerId, value => h.Id(value)),
    h.Attribute('data-index', String(index)),
    ...openStateDataAttributes(h, itemIsOpen),
    ...booleanDataAttribute(h, 'disabled', itemIsDisabled),
  ]
}

const triggerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: AccordionItemDescriptor,
): ReadonlyArray<Attribute<Message>> => {
  const itemIsOpen = isOpen(config.value, item)
  const itemIsDisabled = config.isDisabled === true || item.isDisabled === true

  return [
    h.Type('button'),
    h.Id(triggerId(item)),
    h.AriaExpanded(itemIsOpen),
    ...optionalAttribute<Message>(
      itemIsOpen ? panelId(item) : undefined,
      value => h.AriaControls(value),
    ),
    ...booleanDataAttribute(h, 'panel-open', itemIsOpen),
    ...booleanDataAttribute(h, 'disabled', itemIsDisabled),
    ...(itemIsDisabled ? [h.AriaDisabled(true)] : []),
    ...clickAttributes(h, config, item),
    ...keyboardAttributes(h, config, item),
  ]
}

const panelStyle = (
  geometry: AccordionPanelGeometry | undefined,
): Record<string, string> => ({
  '--accordion-panel-height':
    geometry?.height === undefined ? 'auto' : `${geometry.height}px`,
  '--accordion-panel-width':
    geometry?.width === undefined ? 'auto' : `${geometry.width}px`,
})

const effectivePanel = (
  config: Pick<AccordionOptions, 'hiddenUntilFound' | 'keepMounted'>,
  item: AccordionItemDescriptor,
): AccordionPanelDescriptor => {
  const panel = item.panel ?? defaultPanel

  return {
    ...panel,
    keepMounted: panel.keepMounted ?? config.keepMounted,
    hiddenUntilFound: panel.hiddenUntilFound ?? config.hiddenUntilFound,
  }
}

const hiddenAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  panel: AccordionPanelDescriptor,
  open: boolean,
): ReadonlyArray<Attribute<Message>> => {
  if (open) {
    return []
  }

  return panel.hiddenUntilFound === true
    ? [h.Attribute('hidden', 'until-found')]
    : [h.Hidden(true)]
}

const panelAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: AccordionItemDescriptor,
  index: number,
): AccordionPanelAttributes<Message> => {
  const panel = effectivePanel(config, item)
  const itemIsOpen = isOpen(config.value, item)
  const itemIsDisabled = config.isDisabled === true || item.isDisabled === true
  const isMounted =
    itemIsOpen || panel.keepMounted === true || panel.hiddenUntilFound === true
  const attrs: ReadonlyArray<Attribute<Message>> = [
    h.Role('region'),
    h.Id(panelId(item)),
    h.AriaLabelledBy(triggerId(item)),
    h.Attribute('data-index', String(index)),
    ...hiddenAttributes(h, panel, itemIsOpen),
    ...(itemIsOpen ? [] : [h.Inert(true)]),
    h.DataAttribute('orientation', config.orientation ?? defaultOrientation),
    h.Style(panelStyle(panel.geometry)),
    ...openStateDataAttributes(h, itemIsOpen),
    ...booleanDataAttribute(h, 'disabled', itemIsDisabled),
    ...transitionDataAttributes(h, item.transitionStatus),
  ]

  return {
    panel,
    root: isMounted ? attrs : [],
    isMounted,
    isOpen: itemIsOpen,
  }
}

const accordionItemAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: AccordionItemDescriptor,
  index: number,
): AccordionItemAttributes<Message> => ({
  item,
  root: itemAttributes(h, config, item, index),
  header: headerAttributes(h, config, item, index),
  trigger: triggerAttributes(h, config, item),
  panel: panelAttributes(h, config, item, index),
  isDisabled: config.isDisabled === true || item.isDisabled === true,
  isOpen: isOpen(config.value, item),
})

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()

  return config.toView({
    root: rootAttributes(h, config),
    items: config.items.map((item, index) =>
      accordionItemAttributes(h, config, item, index),
    ),
  })
}
