import { Effect, Option, Predicate, Schema as S } from 'effect'
import * as Command from 'foldkit/command'
import * as Dom from 'foldkit/dom'
import type { Attribute, Html, KeyboardModifiers } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'

import * as PreviewCard from '../preview-card'

// MODEL

export const NavigationMenuSide = PreviewCard.PreviewCardSide
export type NavigationMenuSide = PreviewCard.PreviewCardSide

export const NavigationMenuAlign = PreviewCard.PreviewCardAlign
export type NavigationMenuAlign = PreviewCard.PreviewCardAlign

export const NavigationMenuTransitionStatus =
  PreviewCard.PreviewCardTransitionStatus
export type NavigationMenuTransitionStatus =
  PreviewCard.PreviewCardTransitionStatus

export const NavigationMenuInstant = PreviewCard.PreviewCardInstant
export type NavigationMenuInstant = PreviewCard.PreviewCardInstant

export const NavigationMenuOrientation = S.Union([
  S.Literal('horizontal'),
  S.Literal('vertical'),
])
export type NavigationMenuOrientation = typeof NavigationMenuOrientation.Type

export const NavigationMenuItemKind = S.Union([
  S.Literal('trigger'),
  S.Literal('link'),
])
export type NavigationMenuItemKind = typeof NavigationMenuItemKind.Type

export const NavigationMenuValueChangeReason = S.Union([
  S.Literal('trigger-press'),
  S.Literal('trigger-hover'),
  S.Literal('list-navigation'),
  S.Literal('outside-press'),
  S.Literal('focus-out'),
  S.Literal('escape-key'),
  S.Literal('link-press'),
  S.Literal('imperative-action'),
  S.Literal('none'),
])
export type NavigationMenuValueChangeReason =
  typeof NavigationMenuValueChangeReason.Type

export const NavigationMenuActivationDirection = S.Union([
  S.Literal('left'),
  S.Literal('right'),
  S.Literal('up'),
  S.Literal('down'),
])
export type NavigationMenuActivationDirection =
  typeof NavigationMenuActivationDirection.Type

export const NavigationMenuValueChange = S.Struct({
  value: S.optional(S.String),
  reason: NavigationMenuValueChangeReason,
  previousValue: S.optional(S.String),
  focusSelector: S.optional(S.String),
  activationDirection: S.optional(NavigationMenuActivationDirection),
})
export type NavigationMenuValueChange = typeof NavigationMenuValueChange.Type

export const NavigationMenuItemDescriptor = S.Struct({
  id: S.optional(S.String),
  value: S.String,
  label: S.String,
  textValue: S.optional(S.String),
  kind: S.optional(NavigationMenuItemKind),
  href: S.optional(S.String),
  isDisabled: S.optional(S.Boolean),
  isActive: S.optional(S.Boolean),
  closeOnClick: S.optional(S.Boolean),
  keepMounted: S.optional(S.Boolean),
  triggerId: S.optional(S.String),
  contentId: S.optional(S.String),
  linkId: S.optional(S.String),
})
export type NavigationMenuItemDescriptor =
  typeof NavigationMenuItemDescriptor.Type

export const NavigationMenuOptions = S.Struct({
  id: S.String,
  items: S.Array(NavigationMenuItemDescriptor),
  value: S.optional(S.String),
  orientation: S.optional(NavigationMenuOrientation),
  forceMount: S.optional(S.Boolean),
  transitionStatus: S.optional(NavigationMenuTransitionStatus),
  instant: S.optional(NavigationMenuInstant),
  isDisabled: S.optional(S.Boolean),
  side: S.optional(NavigationMenuSide),
  align: S.optional(NavigationMenuAlign),
  sideOffset: S.optional(S.Number),
  alignOffset: S.optional(S.Number),
  collisionAvoidance: S.optional(S.Boolean),
  collisionPadding: S.optional(S.Number),
  arrowPadding: S.optional(S.Number),
  arrowWidth: S.optional(S.Number),
  arrowHeight: S.optional(S.Number),
  isAnchorHidden: S.optional(S.Boolean),
  isArrowUncentered: S.optional(S.Boolean),
  delay: S.optional(S.Number),
  closeDelay: S.optional(S.Number),
  viewportActivationDirection: S.optional(NavigationMenuActivationDirection),
  isViewportTransitioning: S.optional(S.Boolean),
  hasViewport: S.optional(S.Boolean),
  isNested: S.optional(S.Boolean),
})
export type NavigationMenuOptions = typeof NavigationMenuOptions.Type

// MESSAGE

export const CompletedFocusNavigationMenu = m('CompletedFocusNavigationMenu')
export const CompletedRestoreNavigationMenuFocus = m(
  'CompletedRestoreNavigationMenuFocus',
)

export const CommandMessage = S.Union([
  CompletedFocusNavigationMenu,
  CompletedRestoreNavigationMenuFocus,
])
export type CommandMessage = typeof CommandMessage.Type

// UPDATE

const activationKeys = new Set(['Enter', ' '])
const defaultOrientation: NavigationMenuOrientation = 'horizontal'
const defaultSide: NavigationMenuSide = 'bottom'
const defaultAlign: NavigationMenuAlign = 'center'
const defaultSideOffset = 0
const defaultAlignOffset = 0
const defaultCollisionAvoidance = true
const defaultCollisionPadding = 5
const defaultArrowPadding = 5
const defaultArrowWidth = 10
const defaultArrowHeight = 5
const defaultDelay = 50
const defaultCloseDelay = 50

export const listId = (config: Pick<NavigationMenuOptions, 'id'>): string =>
  `${config.id}-list`

export const positionerId = (
  config: Pick<NavigationMenuOptions, 'id'>,
): string => `${config.id}-positioner`

export const popupId = (config: Pick<NavigationMenuOptions, 'id'>): string =>
  `${config.id}-popup`

export const viewportId = (config: Pick<NavigationMenuOptions, 'id'>): string =>
  `${config.id}-viewport`

export const backdropId = (config: Pick<NavigationMenuOptions, 'id'>): string =>
  `${config.id}-backdrop`

export const arrowId = (config: Pick<NavigationMenuOptions, 'id'>): string =>
  `${config.id}-arrow`

export const itemKind = (
  item: NavigationMenuItemDescriptor,
): NavigationMenuItemKind => item.kind ?? 'trigger'

export const itemId = (
  config: Pick<NavigationMenuOptions, 'id'>,
  item: NavigationMenuItemDescriptor,
): string => item.id ?? `${config.id}-item-${item.value}`

export const triggerId = (
  config: Pick<NavigationMenuOptions, 'id'>,
  item: NavigationMenuItemDescriptor,
): string => item.triggerId ?? `${config.id}-trigger-${item.value}`

export const contentId = (
  config: Pick<NavigationMenuOptions, 'id'>,
  item: NavigationMenuItemDescriptor,
): string => item.contentId ?? `${config.id}-content-${item.value}`

export const linkId = (
  config: Pick<NavigationMenuOptions, 'id'>,
  item: NavigationMenuItemDescriptor,
): string => item.linkId ?? `${config.id}-link-${item.value}`

export const iconId = (
  config: Pick<NavigationMenuOptions, 'id'>,
  item: NavigationMenuItemDescriptor,
): string => `${triggerId(config, item)}-icon`

export const activeItem = (
  config: Pick<NavigationMenuOptions, 'items' | 'value'>,
): NavigationMenuItemDescriptor | undefined =>
  config.items.find(item => item.value === config.value)

export const isTriggerItem = (item: NavigationMenuItemDescriptor): boolean =>
  itemKind(item) === 'trigger'

export const isActiveItem = (
  config: Pick<NavigationMenuOptions, 'value'>,
  item: NavigationMenuItemDescriptor,
): boolean => config.value === item.value && isTriggerItem(item)

export const isOpen = (
  config: Pick<NavigationMenuOptions, 'items' | 'value'>,
): boolean => {
  const item = activeItem(config)

  return item !== undefined && isTriggerItem(item)
}

export const enabledItems = (
  config: Pick<NavigationMenuOptions, 'isDisabled' | 'items'>,
): ReadonlyArray<NavigationMenuItemDescriptor> =>
  config.isDisabled === true
    ? []
    : config.items.filter(item => item.isDisabled !== true)

const orientation = (
  config: Pick<NavigationMenuOptions, 'orientation'>,
): NavigationMenuOrientation => config.orientation ?? defaultOrientation

const indexOffset = (
  currentIndex: number,
  direction: 'next' | 'previous',
): number => currentIndex + (direction === 'next' ? 1 : -1)

export const nextEnabledItem = (
  config: Pick<
    NavigationMenuOptions,
    'isDisabled' | 'items' | 'orientation' | 'value'
  >,
  direction: 'first' | 'last' | 'next' | 'previous',
  currentValue?: string | undefined,
): NavigationMenuItemDescriptor | undefined => {
  const items = enabledItems(config)

  if (direction === 'first') {
    return items[0]
  }

  if (direction === 'last') {
    return items.at(-1)
  }

  const resolvedValue = currentValue ?? config.value
  const currentIndex = items.findIndex(item => item.value === resolvedValue)
  const resolvedCurrentIndex = currentIndex === -1 ? 0 : currentIndex
  const candidateIndex = indexOffset(resolvedCurrentIndex, direction)

  if (candidateIndex >= 0 && candidateIndex < items.length) {
    return items[candidateIndex]
  }

  return direction === 'next' ? items[0] : items.at(-1)
}

const activationDirection = (
  config: Pick<NavigationMenuOptions, 'items' | 'orientation'>,
  value: string,
  previousValue?: string | undefined,
): NavigationMenuActivationDirection | undefined => {
  if (previousValue === undefined || value === previousValue) {
    return undefined
  }

  const previousIndex = config.items.findIndex(
    item => item.value === previousValue,
  )
  const nextIndex = config.items.findIndex(item => item.value === value)

  if (previousIndex === -1 || nextIndex === -1) {
    return undefined
  }

  if (orientation(config) === 'horizontal') {
    return nextIndex > previousIndex ? 'right' : 'left'
  }

  return nextIndex > previousIndex ? 'down' : 'up'
}

export const valueChange = (
  value: string | undefined,
  reason: NavigationMenuValueChangeReason = 'none',
  previousValue?: string | undefined,
  focusSelector?: string | undefined,
  nextActivationDirection?: NavigationMenuActivationDirection | undefined,
): NavigationMenuValueChange => ({
  value,
  reason,
  previousValue,
  focusSelector,
  activationDirection: nextActivationDirection,
})

export const triggerFocusSelector = (
  config: Pick<NavigationMenuOptions, 'id'>,
  item: NavigationMenuItemDescriptor,
): string => `#${triggerId(config, item)}`

export const linkFocusSelector = (
  config: Pick<NavigationMenuOptions, 'id'>,
  item: NavigationMenuItemDescriptor,
): string => `#${linkId(config, item)}`

export const contentFocusSelector = (
  config: Pick<NavigationMenuOptions, 'id'>,
): string => `#${popupId(config)}`

export const navigationMenuSelector = (
  config: Pick<NavigationMenuOptions, 'id'>,
): string => `#${popupId(config)}`

export const FocusNavigationMenu = Command.define(
  'FocusNavigationMenu',
  { selector: S.String },
  CompletedFocusNavigationMenu,
)(({ selector }) =>
  Dom.focus(selector, { makeFocusable: true }).pipe(
    Effect.ignore,
    Effect.catchCause(() => Effect.void),
    Effect.as(CompletedFocusNavigationMenu()),
  ),
)

export const RestoreNavigationMenuFocus = Command.define(
  'RestoreNavigationMenuFocus',
  { selector: S.String },
  CompletedRestoreNavigationMenuFocus,
)(({ selector }) =>
  Dom.focus(selector).pipe(
    Effect.ignore,
    Effect.catchCause(() => Effect.void),
    Effect.as(CompletedRestoreNavigationMenuFocus()),
  ),
)

export const commandForValueChange = (
  config: Pick<NavigationMenuOptions, 'id' | 'items'>,
  change: NavigationMenuValueChange,
): Command.Command<CommandMessage> => {
  if (change.value !== undefined) {
    return FocusNavigationMenu({ selector: contentFocusSelector(config) })
  }

  const item = config.items.find(
    candidate => candidate.value === change.previousValue,
  )
  const selector =
    item === undefined ? `#${config.id}` : triggerFocusSelector(config, item)

  return RestoreNavigationMenuFocus({ selector })
}

// VIEW

export type NavigationMenuPartAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  isMounted: boolean
  isOpen: boolean
}>

export type NavigationMenuItemAttributes<Message> = Readonly<{
  item: NavigationMenuItemDescriptor
  root: ReadonlyArray<Attribute<Message>>
  trigger: ReadonlyArray<Attribute<Message>>
  icon: ReadonlyArray<Attribute<Message>>
  content: NavigationMenuPartAttributes<Message>
  link: ReadonlyArray<Attribute<Message>>
  isActive: boolean
}>

export type NavigationMenuAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  list: ReadonlyArray<Attribute<Message>>
  portal: ReadonlyArray<Attribute<Message>>
  positioner: NavigationMenuPartAttributes<Message>
  backdrop: NavigationMenuPartAttributes<Message>
  popup: NavigationMenuPartAttributes<Message>
  viewport: NavigationMenuPartAttributes<Message>
  arrow: NavigationMenuPartAttributes<Message>
  items: ReadonlyArray<NavigationMenuItemAttributes<Message>>
  activeItem?: NavigationMenuItemAttributes<Message> | undefined
  isMounted: boolean
  isOpen: boolean
  orientation: NavigationMenuOrientation
}>

export type ViewConfig<Message> = NavigationMenuOptions &
  Readonly<{
    toView?: (attributes: NavigationMenuAttributes<Message>) => Html
    onValueChange?: (change: NavigationMenuValueChange) => Message
    onFocus?: Message
    onBlur?: Message
  }>

const mounted = (
  config: Pick<
    NavigationMenuOptions,
    'forceMount' | 'items' | 'transitionStatus' | 'value'
  >,
): boolean =>
  isOpen(config) ||
  config.forceMount === true ||
  config.transitionStatus === 'ending'

const contentMounted = (
  config: Pick<
    NavigationMenuOptions,
    'forceMount' | 'transitionStatus' | 'value'
  >,
  item: NavigationMenuItemDescriptor,
): boolean =>
  isActiveItem(config, item) ||
  item.keepMounted === true ||
  config.forceMount === true ||
  config.transitionStatus === 'ending'

const resolvedSide = (
  config: Pick<NavigationMenuOptions, 'side'>,
): NavigationMenuSide => config.side ?? defaultSide

const resolvedAlign = (
  config: Pick<NavigationMenuOptions, 'align'>,
): NavigationMenuAlign => config.align ?? defaultAlign

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

const openStateDataAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  open: boolean,
): ReadonlyArray<Attribute<Message>> =>
  open ? [h.DataAttribute('open', '')] : [h.DataAttribute('closed', '')]

const transitionDataAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  transitionStatus: NavigationMenuTransitionStatus | undefined,
): ReadonlyArray<Attribute<Message>> => {
  if (transitionStatus === 'starting') {
    return [h.DataAttribute('starting-style', '')]
  }

  if (transitionStatus === 'ending') {
    return [h.DataAttribute('ending-style', '')]
  }

  return []
}

const instantDataAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  instant: NavigationMenuInstant | undefined,
): ReadonlyArray<Attribute<Message>> =>
  instant === undefined ? [] : [h.DataAttribute('instant', instant)]

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
  h.DataAttribute(
    'arrow-padding',
    String(config.arrowPadding ?? defaultArrowPadding),
  ),
]

const valueMessage = <Message>(
  config: ViewConfig<Message>,
  change: NavigationMenuValueChange,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onValueChange)
    ? Option.some(config.onValueChange(change))
    : Option.none()

const rootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.Id(config.id),
  ...openStateDataAttributes(h, isOpen(config)),
  h.DataAttribute('orientation', orientation(config)),
  h.DataAttribute('side', resolvedSide(config)),
  h.DataAttribute('align', resolvedAlign(config)),
  ...booleanDataAttribute(h, 'nested', config.isNested),
  ...booleanDataAttribute(h, 'disabled', config.isDisabled),
  ...optionalBooleanAttribute<Message>(config.isDisabled, value =>
    h.AriaDisabled(value),
  ),
  ...(Predicate.isNotUndefined(config.onFocus)
    ? [h.OnFocus(config.onFocus)]
    : []),
  ...(Predicate.isNotUndefined(config.onBlur) ? [h.OnBlur(config.onBlur)] : []),
]

const navigationDirection = (
  config: Pick<NavigationMenuOptions, 'orientation'>,
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

const listKeyboardMessage = <Message>(
  config: ViewConfig<Message>,
  key: string,
  modifiers: KeyboardModifiers,
): Option.Option<Message> => {
  if (modifiers.shiftKey || config.isDisabled === true) {
    return Option.none()
  }

  const direction = navigationDirection(config, key)

  if (direction === undefined) {
    return Option.none()
  }

  const item = nextEnabledItem(config, direction)

  if (item === undefined || item.value === config.value) {
    return Option.none()
  }

  return valueMessage(
    config,
    valueChange(
      isTriggerItem(item) ? item.value : undefined,
      'list-navigation',
      config.value,
      triggerFocusSelector(config, item),
      activationDirection(config, item.value, config.value),
    ),
  )
}

const listAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.Id(listId(config)),
  ...openStateDataAttributes(h, isOpen(config)),
  h.DataAttribute('orientation', orientation(config)),
  h.OnKeyDownPreventDefault((key, modifiers) =>
    listKeyboardMessage(config, key, modifiers),
  ),
]

const itemAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: NavigationMenuItemDescriptor,
): ReadonlyArray<Attribute<Message>> => [
  h.Id(itemId(config, item)),
  h.DataAttribute('value', item.value),
  ...booleanDataAttribute(h, 'disabled', item.isDisabled),
  ...booleanDataAttribute(h, 'active', item.isActive),
]

const triggerOpenChangeForClick = <Message>(
  config: ViewConfig<Message>,
  item: NavigationMenuItemDescriptor,
): Option.Option<Message> => {
  if (
    config.isDisabled === true ||
    item.isDisabled === true ||
    !isTriggerItem(item)
  ) {
    return Option.none()
  }

  const nextValue = isActiveItem(config, item) ? undefined : item.value

  return valueMessage(
    config,
    valueChange(
      nextValue,
      'trigger-press',
      config.value,
      nextValue === undefined
        ? triggerFocusSelector(config, item)
        : contentFocusSelector(config),
      activationDirection(config, item.value, config.value),
    ),
  )
}

const triggerOpenChangeForHover = <Message>(
  config: ViewConfig<Message>,
  item: NavigationMenuItemDescriptor,
): Option.Option<Message> => {
  if (
    config.isDisabled === true ||
    item.isDisabled === true ||
    !isTriggerItem(item)
  ) {
    return Option.none()
  }

  return valueMessage(
    config,
    valueChange(
      item.value,
      'trigger-hover',
      config.value,
      contentFocusSelector(config),
      activationDirection(config, item.value, config.value),
    ),
  )
}

const triggerKeyboardMessage = <Message>(
  config: ViewConfig<Message>,
  item: NavigationMenuItemDescriptor,
  key: string,
  modifiers: KeyboardModifiers,
): Option.Option<Message> => {
  if (
    modifiers.shiftKey ||
    config.isDisabled === true ||
    item.isDisabled === true ||
    !isTriggerItem(item)
  ) {
    return Option.none()
  }

  const horizontalOpen =
    orientation(config) === 'horizontal' && key === 'ArrowDown'
  const verticalOpen =
    orientation(config) === 'vertical' && key === 'ArrowRight'

  if (activationKeys.has(key) || horizontalOpen || verticalOpen) {
    return valueMessage(
      config,
      valueChange(
        item.value,
        activationKeys.has(key) ? 'trigger-press' : 'list-navigation',
        config.value,
        contentFocusSelector(config),
        activationDirection(config, item.value, config.value),
      ),
    )
  }

  return Option.none()
}

const triggerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: NavigationMenuItemDescriptor,
): ReadonlyArray<Attribute<Message>> =>
  isTriggerItem(item)
    ? [
        h.Id(triggerId(config, item)),
        h.Type('button'),
        h.Tabindex(
          item.isDisabled === true || config.isDisabled === true ? -1 : 0,
        ),
        h.AriaExpanded(isActiveItem(config, item)),
        ...(isActiveItem(config, item)
          ? [h.AriaControls(popupId(config))]
          : []),
        h.DataAttribute('base-ui-navigation-menu-trigger', ''),
        h.DataAttribute('delay', String(config.delay ?? defaultDelay)),
        h.DataAttribute(
          'close-delay',
          String(config.closeDelay ?? defaultCloseDelay),
        ),
        ...booleanDataAttribute(h, 'disabled', item.isDisabled),
        ...booleanDataAttribute(h, 'popup-open', isActiveItem(config, item)),
        ...booleanDataAttribute(h, 'open', isActiveItem(config, item)),
        ...optionalBooleanAttribute<Message>(
          config.isDisabled === true || item.isDisabled === true,
          value => h.AriaDisabled(value),
        ),
        ...optionalMessageAttribute(
          triggerOpenChangeForHover(config, item),
          message => h.OnMouseEnter(message),
        ),
        ...optionalMessageAttribute(
          triggerOpenChangeForClick(config, item),
          message => h.OnClick(message),
        ),
        h.OnKeyDownPreventDefault((key, modifiers) =>
          triggerKeyboardMessage(config, item, key, modifiers),
        ),
      ]
    : []

const iconAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: NavigationMenuItemDescriptor,
): ReadonlyArray<Attribute<Message>> =>
  isTriggerItem(item)
    ? [
        h.Id(iconId(config, item)),
        h.AriaHidden(true),
        ...booleanDataAttribute(h, 'popup-open', isActiveItem(config, item)),
      ]
    : []

const linkClickMessage = <Message>(
  config: ViewConfig<Message>,
  item: NavigationMenuItemDescriptor,
): Option.Option<Message> =>
  item.closeOnClick === true
    ? valueMessage(
        config,
        valueChange(
          undefined,
          'link-press',
          config.value,
          linkFocusSelector(config, item),
        ),
      )
    : Option.none()

const linkAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: NavigationMenuItemDescriptor,
): ReadonlyArray<Attribute<Message>> =>
  itemKind(item) === 'link'
    ? [
        h.Id(linkId(config, item)),
        h.Href(item.href ?? '#'),
        ...booleanDataAttribute(h, 'active', item.isActive),
        ...(item.isActive === true
          ? [h.Attribute('aria-current', 'page')]
          : []),
        ...booleanDataAttribute(h, 'disabled', item.isDisabled),
        ...optionalBooleanAttribute<Message>(
          config.isDisabled === true || item.isDisabled === true,
          value => h.AriaDisabled(value),
        ),
        ...optionalMessageAttribute(linkClickMessage(config, item), message =>
          h.OnClick(message),
        ),
      ]
    : []

const contentAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: NavigationMenuItemDescriptor,
): NavigationMenuPartAttributes<Message> => {
  const contentIsOpen = isActiveItem(config, item)
  const isMounted = contentMounted(config, item)

  return {
    root: isMounted
      ? [
          h.Id(contentId(config, item)),
          ...(contentIsOpen ? [] : [h.Hidden(true)]),
          ...openStateDataAttributes(h, contentIsOpen),
          ...transitionDataAttributes(h, config.transitionStatus),
          ...(config.viewportActivationDirection === undefined
            ? []
            : [
                h.DataAttribute(
                  'activation-direction',
                  config.viewportActivationDirection,
                ),
              ]),
        ]
      : [],
    isMounted,
    isOpen: contentIsOpen,
  }
}

const navigationMenuItems = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<NavigationMenuItemAttributes<Message>> =>
  config.items.map(item => ({
    item,
    root: itemAttributes(h, config, item),
    trigger: triggerAttributes(h, config, item),
    icon: iconAttributes(h, config, item),
    content: contentAttributes(h, config, item),
    link: linkAttributes(h, config, item),
    isActive: isActiveItem(config, item),
  }))

const portalAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
): ReadonlyArray<Attribute<Message>> => [h.DataAttribute('portal', '')]

const positionerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  isMounted: boolean,
): NavigationMenuPartAttributes<Message> => ({
  root: isMounted
    ? [
        h.Id(positionerId(config)),
        ...(isOpen(config) ? [] : [h.Hidden(true), h.Inert(true)]),
        ...openStateDataAttributes(h, isOpen(config)),
        ...booleanDataAttribute(h, 'anchor-hidden', config.isAnchorHidden),
        ...instantDataAttribute(h, config.instant),
        ...placementAttributes(h, config),
        h.Style({ position: 'absolute', inset: 'auto', margin: '0' }),
      ]
    : [],
  isMounted,
  isOpen: isOpen(config),
})

const backdropAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  isMounted: boolean,
): NavigationMenuPartAttributes<Message> => ({
  root: isMounted
    ? [
        h.Id(backdropId(config)),
        h.Role('presentation'),
        ...(isOpen(config) ? [] : [h.Hidden(true)]),
        ...openStateDataAttributes(h, isOpen(config)),
        ...transitionDataAttributes(h, config.transitionStatus),
        h.Style({
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }),
        ...optionalMessageAttribute(
          valueMessage(
            config,
            valueChange(undefined, 'outside-press', config.value),
          ),
          message => h.OnClick(message),
        ),
      ]
    : [],
  isMounted,
  isOpen: isOpen(config),
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
    return valueMessage(
      config,
      valueChange(undefined, 'escape-key', config.value),
    )
  }

  return Option.none()
}

const popupAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  isMounted: boolean,
): NavigationMenuPartAttributes<Message> => ({
  root: isMounted
    ? [
        h.Id(popupId(config)),
        h.Tabindex(-1),
        ...(isOpen(config) ? [] : [h.Hidden(true)]),
        ...openStateDataAttributes(h, isOpen(config)),
        ...transitionDataAttributes(h, config.transitionStatus),
        ...booleanDataAttribute(h, 'anchor-hidden', config.isAnchorHidden),
        ...placementAttributes(h, config),
        h.OnKeyDownPreventDefault((key, modifiers) =>
          popupKeyboardMessage(config, key, modifiers),
        ),
      ]
    : [],
  isMounted,
  isOpen: isOpen(config),
})

const viewportAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  isMounted: boolean,
): NavigationMenuPartAttributes<Message> => ({
  root: isMounted
    ? [
        h.Id(viewportId(config)),
        ...instantDataAttribute(h, config.instant),
        ...booleanDataAttribute(
          h,
          'transitioning',
          config.isViewportTransitioning,
        ),
      ]
    : [],
  isMounted,
  isOpen: isOpen(config),
})

const arrowAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  isMounted: boolean,
): NavigationMenuPartAttributes<Message> => ({
  root: isMounted
    ? [
        h.Id(arrowId(config)),
        h.AriaHidden(true),
        ...openStateDataAttributes(h, isOpen(config)),
        ...booleanDataAttribute(h, 'uncentered', config.isArrowUncentered),
        h.DataAttribute('side', resolvedSide(config)),
        h.DataAttribute('align', resolvedAlign(config)),
        h.Style({
          width: `${config.arrowWidth ?? defaultArrowWidth}px`,
          height: `${config.arrowHeight ?? defaultArrowHeight}px`,
        }),
      ]
    : [],
  isMounted,
  isOpen: isOpen(config),
})

const defaultContent = <Message>(
  itemState: NavigationMenuItemAttributes<Message>,
): Html => {
  const h = html<Message>()

  return h.div([...itemState.content.root], [itemState.item.label])
}

const defaultItemView = <Message>(
  itemState: NavigationMenuItemAttributes<Message>,
): Html => {
  const h = html<Message>()

  if (itemKind(itemState.item) === 'link') {
    return h.li(
      [...itemState.root],
      [h.a([...itemState.link], [itemState.item.label])],
    )
  }

  return h.li(
    [...itemState.root],
    [
      h.button(
        [...itemState.trigger],
        [itemState.item.label, h.span([...itemState.icon], ['▼'])],
      ),
    ],
  )
}

const defaultView = <Message>(
  attributes: NavigationMenuAttributes<Message>,
): Html => {
  const h = html<Message>()

  return h.nav(
    [...attributes.root],
    [
      h.ul([...attributes.list], attributes.items.map(defaultItemView)),
      h.div(
        [...attributes.portal],
        attributes.isMounted
          ? [
              h.div([...attributes.backdrop.root], []),
              h.div(
                [...attributes.positioner.root],
                [
                  h.nav(
                    [...attributes.popup.root],
                    [
                      h.div(
                        [...attributes.viewport.root],
                        attributes.items
                          .filter(itemState => itemState.content.isMounted)
                          .map(defaultContent),
                      ),
                      h.div([...attributes.arrow.root], []),
                    ],
                  ),
                ],
              ),
            ]
          : [],
      ),
    ],
  )
}

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const isMounted = mounted(config)
  const items = navigationMenuItems(h, config)
  const attributes: NavigationMenuAttributes<Message> = {
    root: rootAttributes(h, config),
    list: listAttributes(h, config),
    portal: portalAttributes(h),
    positioner: positionerAttributes(h, config, isMounted),
    backdrop: backdropAttributes(h, config, isMounted),
    popup: popupAttributes(h, config, isMounted),
    viewport: viewportAttributes(h, config, isMounted),
    arrow: arrowAttributes(h, config, isMounted),
    items,
    activeItem: items.find(item => item.isActive),
    isMounted,
    isOpen: isOpen(config),
    orientation: orientation(config),
  }

  return config.toView === undefined
    ? defaultView(attributes)
    : config.toView(attributes)
}
