import { Option, Predicate, Schema as S } from 'effect'
import type { Attribute, Html, KeyboardModifiers } from 'foldkit/html'
import { html } from 'foldkit/html'

// MODEL

export const TabsOrientation = S.Union([
  S.Literal('horizontal'),
  S.Literal('vertical'),
])
export type TabsOrientation = typeof TabsOrientation.Type

export const TabsActivationMode = S.Union([
  S.Literal('manual'),
  S.Literal('automatic'),
])
export type TabsActivationMode = typeof TabsActivationMode.Type

export const TabsActivationDirection = S.Union([
  S.Literal('left'),
  S.Literal('right'),
  S.Literal('up'),
  S.Literal('down'),
  S.Literal('none'),
])
export type TabsActivationDirection = typeof TabsActivationDirection.Type

export const TabsChangeReason = S.Literal('none')
export type TabsChangeReason = typeof TabsChangeReason.Type

export const TabsValueChange = S.Struct({
  value: S.String,
  reason: TabsChangeReason,
  activationDirection: TabsActivationDirection,
  focusSelector: S.optional(S.String),
})
export type TabsValueChange = typeof TabsValueChange.Type

export const TabsHighlightChange = S.Struct({
  value: S.String,
  focusSelector: S.optional(S.String),
})
export type TabsHighlightChange = typeof TabsHighlightChange.Type

export const TabsTabDescriptor = S.Struct({
  id: S.optional(S.String),
  value: S.String,
  label: S.optional(S.String),
  isDisabled: S.optional(S.Boolean),
})
export type TabsTabDescriptor = typeof TabsTabDescriptor.Type

export const TabsPanelDescriptor = S.Struct({
  id: S.optional(S.String),
  value: S.String,
  label: S.optional(S.String),
  keepMounted: S.optional(S.Boolean),
})
export type TabsPanelDescriptor = typeof TabsPanelDescriptor.Type

export const TabsIndicatorGeometry = S.Struct({
  left: S.Number,
  right: S.Number,
  top: S.Number,
  bottom: S.Number,
  width: S.Number,
  height: S.Number,
})
export type TabsIndicatorGeometry = typeof TabsIndicatorGeometry.Type

export const TabsOptions = S.Struct({
  id: S.optional(S.String),
  value: S.optional(S.String),
  highlightedValue: S.optional(S.String),
  orientation: S.optional(TabsOrientation),
  dir: S.optional(S.String),
  activationMode: S.optional(TabsActivationMode),
  loopFocus: S.optional(S.Boolean),
  activationDirection: S.optional(TabsActivationDirection),
  tabs: S.Array(TabsTabDescriptor),
  panels: S.optional(S.Array(TabsPanelDescriptor)),
  indicatorGeometry: S.optional(TabsIndicatorGeometry),
})
export type TabsOptions = typeof TabsOptions.Type

// UPDATE

export const isActive = (
  selectedValue: string | undefined,
  tab: Pick<TabsTabDescriptor, 'value'>,
): boolean => selectedValue === tab.value

export const valueChange = (
  value: string,
  activationDirection: TabsActivationDirection,
  focusSelector?: string,
): TabsValueChange => ({
  value,
  reason: 'none',
  activationDirection,
  ...(focusSelector === undefined ? {} : { focusSelector }),
})

export const highlightChange = (
  value: string,
  focusSelector?: string,
): TabsHighlightChange => ({
  value,
  ...(focusSelector === undefined ? {} : { focusSelector }),
})

export const tabFocusSelector = (
  tab: Pick<TabsTabDescriptor, 'id'>,
): string | undefined => (tab.id === undefined ? undefined : `#${tab.id}`)

// VIEW

export type TabsTabAttributes<Message> = Readonly<{
  tab: TabsTabDescriptor
  root: ReadonlyArray<Attribute<Message>>
}>

export type TabsPanelAttributes<Message> = Readonly<{
  panel: TabsPanelDescriptor
  root: ReadonlyArray<Attribute<Message>>
  isMounted: boolean
  isActive: boolean
}>

export type TabsAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  list: ReadonlyArray<Attribute<Message>>
  tabs: ReadonlyArray<TabsTabAttributes<Message>>
  panels: ReadonlyArray<TabsPanelAttributes<Message>>
  indicator: ReadonlyArray<Attribute<Message>>
}>

export type ViewConfig<Message> = TabsOptions &
  Readonly<{
    toView: (attributes: TabsAttributes<Message>) => Html
    onValueChange?: (change: TabsValueChange) => Message
    onHighlightChange?: (change: TabsHighlightChange) => Message
  }>

const defaultOrientation = 'horizontal'
const defaultActivationMode = 'manual'
const defaultActivationDirection = 'none'

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
  config: Pick<ViewConfig<Message>, 'activationDirection' | 'orientation'>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('orientation', config.orientation ?? defaultOrientation),
  h.DataAttribute(
    'activation-direction',
    config.activationDirection ?? defaultActivationDirection,
  ),
]

const selectedTab = (
  config: Pick<TabsOptions, 'tabs' | 'value'>,
): TabsTabDescriptor | undefined =>
  config.tabs.find(tab => tab.value === config.value && tab.isDisabled !== true)

const firstEnabledTab = (
  config: Pick<TabsOptions, 'tabs'>,
): TabsTabDescriptor | undefined =>
  config.tabs.find(tab => tab.isDisabled !== true)

const tabbableValue = (
  config: Pick<TabsOptions, 'highlightedValue' | 'tabs' | 'value'>,
): string | undefined => {
  const highlightedTab = config.tabs.find(
    tab => tab.value === config.highlightedValue,
  )

  return (
    highlightedTab?.value ??
    selectedTab(config)?.value ??
    firstEnabledTab(config)?.value
  )
}

const panelId = (
  config: Pick<TabsOptions, 'panels' | 'value'>,
  value: string,
): string | undefined =>
  config.panels?.find(panel => panel.value === value)?.id ??
  (config.value === value ? `${value}-panel` : undefined)

const tabId = (
  config: Pick<TabsOptions, 'tabs'>,
  value: string,
): string | undefined => config.tabs.find(tab => tab.value === value)?.id

const activeIndex = (
  tabs: ReadonlyArray<TabsTabDescriptor>,
  value: string,
): number => tabs.findIndex(tab => tab.value === value)

const activationDirection = (
  config: Pick<TabsOptions, 'orientation' | 'tabs'>,
  from: TabsTabDescriptor,
  to: TabsTabDescriptor,
): TabsActivationDirection => {
  const fromIndex = activeIndex(config.tabs, from.value)
  const toIndex = activeIndex(config.tabs, to.value)

  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
    return 'none'
  }

  if ((config.orientation ?? defaultOrientation) === 'vertical') {
    return toIndex > fromIndex ? 'down' : 'up'
  }

  return toIndex > fromIndex ? 'right' : 'left'
}

const nextIndex = (
  currentIndex: number,
  tabs: ReadonlyArray<TabsTabDescriptor>,
  direction: 'next' | 'previous',
  loopFocus: boolean,
): number | undefined => {
  const offset = direction === 'next' ? 1 : -1
  const candidateIndex = currentIndex + offset

  if (candidateIndex >= 0 && candidateIndex < tabs.length) {
    return candidateIndex
  }

  if (!loopFocus) {
    return undefined
  }

  return direction === 'next' ? 0 : tabs.length - 1
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
  config: Pick<TabsOptions, 'dir' | 'orientation'>,
): 'next' | 'previous' | undefined =>
  (config.orientation ?? defaultOrientation) === 'vertical'
    ? verticalDirection(key)
    : horizontalDirection(key, config.dir)

const rovingTab = (
  config: Pick<TabsOptions, 'dir' | 'loopFocus' | 'orientation' | 'tabs'>,
  tab: TabsTabDescriptor,
  key: string,
): TabsTabDescriptor | undefined => {
  const currentIndex = config.tabs.findIndex(entry => entry.value === tab.value)

  if (key === 'Home') {
    return config.tabs[0]
  }

  if (key === 'End') {
    return config.tabs.at(-1)
  }

  const direction = arrowDirection(key, config)
  const targetIndex =
    direction === undefined || currentIndex === -1
      ? undefined
      : nextIndex(
          currentIndex,
          config.tabs,
          direction,
          config.loopFocus ?? true,
        )

  return targetIndex === undefined ? undefined : config.tabs[targetIndex]
}

const canActivateTab = (tab: TabsTabDescriptor): boolean =>
  tab.isDisabled !== true

const selectionMessage = <Message>(
  config: Pick<
    ViewConfig<Message>,
    'onValueChange' | 'orientation' | 'tabs' | 'value'
  >,
  from: TabsTabDescriptor,
  to: TabsTabDescriptor,
): Option.Option<Message> => {
  const fromTab = selectedTab(config) ?? from

  return Predicate.isNotUndefined(config.onValueChange) && canActivateTab(to)
    ? Option.some(
        config.onValueChange(
          valueChange(
            to.value,
            activationDirection(config, fromTab, to),
            tabFocusSelector(to),
          ),
        ),
      )
    : Option.none()
}

const highlightMessage = <Message>(
  config: Pick<ViewConfig<Message>, 'onHighlightChange'>,
  tab: TabsTabDescriptor,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onHighlightChange)
    ? Option.some(
        config.onHighlightChange(
          highlightChange(tab.value, tabFocusSelector(tab)),
        ),
      )
    : Option.none()

const hasKeyboardModifier = (modifiers: KeyboardModifiers): boolean =>
  modifiers.altKey ||
  modifiers.ctrlKey ||
  modifiers.metaKey ||
  modifiers.shiftKey

const rovingMessage = <Message>(
  config: ViewConfig<Message>,
  tab: TabsTabDescriptor,
  key: string,
  modifiers: KeyboardModifiers,
): Option.Option<Message> => {
  if (hasKeyboardModifier(modifiers)) {
    return Option.none()
  }

  const targetTab = rovingTab(config, tab, key)

  if (targetTab === undefined) {
    return Option.none()
  }

  return (config.activationMode ?? defaultActivationMode) === 'automatic' &&
    canActivateTab(targetTab)
    ? selectionMessage(config, tab, targetTab)
    : highlightMessage(config, targetTab)
}

const keyActivationMessage = <Message>(
  config: ViewConfig<Message>,
  tab: TabsTabDescriptor,
  key: string,
): Option.Option<Message> =>
  key === ' ' || key === 'Enter'
    ? selectionMessage(config, tab, tab)
    : Option.none()

const clickAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  tab: TabsTabDescriptor,
): ReadonlyArray<Attribute<Message>> =>
  Option.match(selectionMessage(config, tab, tab), {
    onNone: () => [],
    onSome: message => [h.OnClick(message)],
  })

const keyboardAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  tab: TabsTabDescriptor,
): ReadonlyArray<Attribute<Message>> => [
  h.OnKeyDownPreventDefault((key, modifiers) =>
    keyActivationMessage(config, tab, key).pipe(
      Option.orElse(() => rovingMessage(config, tab, key, modifiers)),
    ),
  ),
]

const focusAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  tab: TabsTabDescriptor,
): ReadonlyArray<Attribute<Message>> => {
  if (isActive(config.value, tab)) {
    return []
  }

  const maybeMessage =
    (config.activationMode ?? defaultActivationMode) === 'automatic' &&
    canActivateTab(tab)
      ? selectionMessage(config, tab, tab)
      : highlightMessage(config, tab)

  return Option.match(maybeMessage, {
    onNone: () => [],
    onSome: message => [h.OnFocus(message)],
  })
}

const rootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  ...optionalAttribute<Message>(config.id, value => h.Id(value)),
  ...stateDataAttributes(h, config),
]

const listAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.Role('tablist'),
  ...((config.orientation ?? defaultOrientation) === 'vertical'
    ? [h.AriaOrientation('vertical')]
    : []),
  ...stateDataAttributes(h, config),
]

const tabAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  tab: TabsTabDescriptor,
): ReadonlyArray<Attribute<Message>> => [
  h.Role('tab'),
  h.Type('button'),
  h.AriaSelected(isActive(config.value, tab)),
  h.Tabindex(tabbableValue(config) === tab.value ? 0 : -1),
  ...optionalAttribute<Message>(tab.id, value => h.Id(value)),
  ...optionalAttribute<Message>(panelId(config, tab.value), value =>
    h.AriaControls(value),
  ),
  ...booleanDataAttribute(h, 'active', isActive(config.value, tab)),
  ...booleanDataAttribute(h, 'disabled', tab.isDisabled),
  ...(tab.isDisabled === true ? [h.AriaDisabled(true)] : []),
  ...stateDataAttributes(h, config),
  ...clickAttributes(h, config, tab),
  ...keyboardAttributes(h, config, tab),
  ...focusAttributes(h, config, tab),
]

const panelAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  panel: TabsPanelDescriptor,
  index: number,
): TabsPanelAttributes<Message> => {
  const panelIsActive = config.value === panel.value
  const isMounted = panel.keepMounted === true || panelIsActive
  const attrs: ReadonlyArray<Attribute<Message>> = [
    h.Role('tabpanel'),
    h.Tabindex(panelIsActive ? 0 : -1),
    h.Attribute('data-index', String(index)),
    ...optionalAttribute<Message>(panel.id, value => h.Id(value)),
    ...optionalAttribute<Message>(tabId(config, panel.value), value =>
      h.AriaLabelledBy(value),
    ),
    ...(panelIsActive ? [] : [h.Hidden(true), h.Inert(true)]),
    ...booleanDataAttribute(h, 'hidden', panelIsActive ? undefined : true),
    ...stateDataAttributes(h, config),
  ]

  return {
    panel,
    root: isMounted ? attrs : [],
    isMounted,
    isActive: panelIsActive,
  }
}

const indicatorStyle = (
  geometry: TabsIndicatorGeometry | undefined,
): Record<string, string> =>
  geometry === undefined
    ? {}
    : {
        '--active-tab-left': `${geometry.left}px`,
        '--active-tab-right': `${geometry.right}px`,
        '--active-tab-top': `${geometry.top}px`,
        '--active-tab-bottom': `${geometry.bottom}px`,
        '--active-tab-width': `${geometry.width}px`,
        '--active-tab-height': `${geometry.height}px`,
      }

const indicatorAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> =>
  config.value === undefined
    ? []
    : [
        h.Role('presentation'),
        h.Hidden(config.indicatorGeometry === undefined),
        h.Style(indicatorStyle(config.indicatorGeometry)),
        ...stateDataAttributes(h, config),
      ]

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const panels = config.panels ?? []

  return config.toView({
    root: rootAttributes(h, config),
    list: listAttributes(h, config),
    tabs: config.tabs.map(tab => ({
      tab,
      root: tabAttributes(h, config, tab),
    })),
    panels: panels.map((panel, index) =>
      panelAttributes(h, config, panel, index),
    ),
    indicator: indicatorAttributes(h, config),
  })
}
