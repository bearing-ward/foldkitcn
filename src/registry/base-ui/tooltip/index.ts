import { Effect, Option, Predicate, Schema as S } from 'effect'
import { Mount } from 'foldkit'
import * as Command from 'foldkit/command'
import * as Dom from 'foldkit/dom'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'

import {
  anchorPlacement,
  PositionAnchoredSurface,
} from '../../../utils/anchor-positioning'
import type { AnchorPositioningConfig } from '../../../utils/anchor-positioning'

// MODEL

export const TooltipSide = S.Union([
  S.Literal('bottom'),
  S.Literal('top'),
  S.Literal('right'),
  S.Literal('left'),
  S.Literal('inline-start'),
  S.Literal('inline-end'),
])
export type TooltipSide = typeof TooltipSide.Type

export const TooltipAlign = S.Union([
  S.Literal('start'),
  S.Literal('center'),
  S.Literal('end'),
])
export type TooltipAlign = typeof TooltipAlign.Type

export const TooltipTransitionStatus = S.Union([
  S.Literal('idle'),
  S.Literal('starting'),
  S.Literal('ending'),
])
export type TooltipTransitionStatus = typeof TooltipTransitionStatus.Type

export const TooltipInstant = S.Union([
  S.Literal('delay'),
  S.Literal('dismiss'),
  S.Literal('focus'),
  S.Literal('tracking-cursor'),
])
export type TooltipInstant = typeof TooltipInstant.Type

export const TooltipTrackCursorAxis = S.Union([
  S.Literal('none'),
  S.Literal('x'),
  S.Literal('y'),
  S.Literal('both'),
])
export type TooltipTrackCursorAxis = typeof TooltipTrackCursorAxis.Type

export const TooltipChangeReason = S.Union([
  S.Literal('trigger-hover'),
  S.Literal('trigger-focus'),
  S.Literal('trigger-press'),
  S.Literal('outside-press'),
  S.Literal('escape-key'),
  S.Literal('disabled'),
  S.Literal('imperative-action'),
  S.Literal('none'),
])
export type TooltipChangeReason = typeof TooltipChangeReason.Type

export const TooltipOpenChange = S.Struct({
  open: S.Boolean,
  reason: TooltipChangeReason,
  activeTriggerId: S.optional(S.String),
})
export type TooltipOpenChange = typeof TooltipOpenChange.Type

export const TooltipOptions = S.Struct({
  id: S.String,
  open: S.Boolean,
  activeTriggerId: S.optional(S.String),
  triggerId: S.optional(S.String),
  triggerSelector: S.optional(S.String),
  isDisabled: S.optional(S.Boolean),
  forceMount: S.optional(S.Boolean),
  transitionStatus: S.optional(TooltipTransitionStatus),
  instant: S.optional(TooltipInstant),
  side: S.optional(TooltipSide),
  align: S.optional(TooltipAlign),
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
  closeOnClick: S.optional(S.Boolean),
  disableHoverablePopup: S.optional(S.Boolean),
  trackCursorAxis: S.optional(TooltipTrackCursorAxis),
  providerDelay: S.optional(S.Number),
  providerCloseDelay: S.optional(S.Number),
  providerTimeout: S.optional(S.Number),
  viewportActivationDirection: S.optional(S.String),
  isViewportTransitioning: S.optional(S.Boolean),
})
export type TooltipOptions = typeof TooltipOptions.Type

// MESSAGE

export const CompletedFocusTooltip = m('CompletedFocusTooltip')
export const CompletedRestoreTooltipFocus = m('CompletedRestoreTooltipFocus')

export const CommandMessage = S.Union([
  CompletedFocusTooltip,
  CompletedRestoreTooltipFocus,
])
export type CommandMessage = typeof CommandMessage.Type

// UPDATE

const defaultSide: TooltipSide = 'top'
const defaultAlign: TooltipAlign = 'center'
const defaultSideOffset = 0
const defaultAlignOffset = 0
const defaultCollisionAvoidance = true
const defaultCollisionPadding = 5
const defaultArrowPadding = 5
const defaultArrowWidth = 10
const defaultArrowHeight = 5
const defaultDelay = 600
const defaultCloseDelay = 0
const defaultProviderTimeout = 400
const defaultCloseOnClick = true
const defaultTrackCursorAxis: TooltipTrackCursorAxis = 'none'

export const popupId = (config: Pick<TooltipOptions, 'id'>): string =>
  `${config.id}-popup`

export const positionerId = (config: Pick<TooltipOptions, 'id'>): string =>
  `${config.id}-positioner`

export const arrowId = (config: Pick<TooltipOptions, 'id'>): string =>
  `${config.id}-arrow`

export const viewportId = (config: Pick<TooltipOptions, 'id'>): string =>
  `${config.id}-viewport`

export const tooltipSelector = (id: string): string => `#${popupId({ id })}`

export const triggerId = (
  config: Pick<TooltipOptions, 'id' | 'triggerId'>,
): string => config.triggerId ?? `${config.id}-trigger`

export const activeTriggerId = (
  config: Pick<TooltipOptions, 'activeTriggerId' | 'id' | 'triggerId'>,
): string => config.activeTriggerId ?? triggerId(config)

export const triggerSelector = (
  config: Pick<TooltipOptions, 'id' | 'triggerId' | 'triggerSelector'>,
): string => config.triggerSelector ?? `#${triggerId(config)}`

const rootAnchorName = (config: Pick<TooltipOptions, 'id'>): string =>
  `--${config.id}-anchor`

export const openChange = (
  open: boolean,
  reason: TooltipChangeReason = 'none',
  nextActiveTriggerId?: string | undefined,
): TooltipOpenChange => ({
  open,
  reason,
  ...(nextActiveTriggerId === undefined
    ? {}
    : { activeTriggerId: nextActiveTriggerId }),
})

export const hoverOpenChange = (
  nextActiveTriggerId?: string | undefined,
): TooltipOpenChange => openChange(true, 'trigger-hover', nextActiveTriggerId)

export const focusOpenChange = (
  nextActiveTriggerId?: string | undefined,
): TooltipOpenChange => openChange(true, 'trigger-focus', nextActiveTriggerId)

export const pressOpenChange = (
  nextActiveTriggerId?: string | undefined,
): TooltipOpenChange => openChange(true, 'trigger-press', nextActiveTriggerId)

export const hoverCloseChange = (
  nextActiveTriggerId?: string | undefined,
): TooltipOpenChange => openChange(false, 'trigger-hover', nextActiveTriggerId)

export const focusCloseChange = (
  nextActiveTriggerId?: string | undefined,
): TooltipOpenChange => openChange(false, 'trigger-focus', nextActiveTriggerId)

export const pressCloseChange = (
  nextActiveTriggerId?: string | undefined,
): TooltipOpenChange => openChange(false, 'trigger-press', nextActiveTriggerId)

export const outsideOpenChange = (): TooltipOpenChange =>
  openChange(false, 'outside-press')

export const escapeOpenChange = (): TooltipOpenChange =>
  openChange(false, 'escape-key')

export const disabledOpenChange = (): TooltipOpenChange =>
  openChange(false, 'disabled')

export const imperativeOpenChange = (): TooltipOpenChange =>
  openChange(false, 'imperative-action')

export const FocusTooltip = Command.define(
  'FocusTooltip',
  { selector: S.String },
  CompletedFocusTooltip,
)(({ selector }) =>
  Dom.focus(selector, { makeFocusable: true }).pipe(
    Effect.ignore,
    Effect.catchCause(() => Effect.void),
    Effect.as(CompletedFocusTooltip()),
  ),
)

export const RestoreTooltipFocus = Command.define(
  'RestoreTooltipFocus',
  { selector: S.String },
  CompletedRestoreTooltipFocus,
)(({ selector }) =>
  Dom.focus(selector).pipe(
    Effect.ignore,
    Effect.catchCause(() => Effect.void),
    Effect.as(CompletedRestoreTooltipFocus()),
  ),
)

export const commandForOpenChange = (
  config: Pick<TooltipOptions, 'id' | 'triggerId' | 'triggerSelector'>,
  change: TooltipOpenChange,
): Command.Command<CommandMessage> =>
  change.open
    ? FocusTooltip({ selector: tooltipSelector(config.id) })
    : RestoreTooltipFocus({ selector: triggerSelector(config) })

// VIEW

export type TooltipAttributes<Message> = Readonly<{
  provider: ReadonlyArray<Attribute<Message>>
  root: ReadonlyArray<Attribute<Message>>
  trigger: ReadonlyArray<Attribute<Message>>
  portal: ReadonlyArray<Attribute<Message>>
  positioner: TooltipPartAttributes<Message>
  popup: TooltipPartAttributes<Message>
  viewport: TooltipPartAttributes<Message>
  arrow: TooltipPartAttributes<Message>
  isMounted: boolean
  isOpen: boolean
}>

export type TooltipPartAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  isMounted: boolean
  isOpen: boolean
}>

export type ViewConfig<Message> = TooltipOptions &
  Readonly<{
    toView: (attributes: TooltipAttributes<Message>) => Html
    onOpenChange?: (change: TooltipOpenChange) => Message
  }> &
  AnchorPositioningConfig<Message>

const resolvedSide = (config: Pick<TooltipOptions, 'side'>): TooltipSide =>
  config.side ?? defaultSide

const resolvedAlign = (config: Pick<TooltipOptions, 'align'>): TooltipAlign =>
  config.align ?? defaultAlign

const resolvedDelay = (
  config: Pick<TooltipOptions, 'delay' | 'providerDelay'>,
): number => config.delay ?? config.providerDelay ?? defaultDelay

const resolvedCloseDelay = (
  config: Pick<TooltipOptions, 'closeDelay' | 'providerCloseDelay'>,
): number => config.closeDelay ?? config.providerCloseDelay ?? defaultCloseDelay

const mounted = (
  config: Pick<TooltipOptions, 'forceMount' | 'open' | 'transitionStatus'>,
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

const numberDataAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  name: string,
  value: number,
): Attribute<Message> => h.DataAttribute(name, String(value))

const openStateDataAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  open: boolean,
): ReadonlyArray<Attribute<Message>> =>
  open ? [h.DataAttribute('open', '')] : [h.DataAttribute('closed', '')]

const transitionDataAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  transitionStatus: TooltipTransitionStatus | undefined,
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
  instant: TooltipInstant | undefined,
): ReadonlyArray<Attribute<Message>> =>
  instant === undefined ? [] : [h.DataAttribute('instant', instant)]

const openMessage = <Message>(
  config: ViewConfig<Message>,
  change: TooltipOpenChange,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onOpenChange)
    ? Option.some(config.onOpenChange(change))
    : Option.none()

const optionalMessageAttribute = <Message>(
  message: Option.Option<Message>,
  toAttribute: (message: Message) => Attribute<Message>,
): ReadonlyArray<Attribute<Message>> =>
  Option.match(message, {
    onNone: () => [],
    onSome: value => [toAttribute(value)],
  })

const providerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('provider', ''),
  numberDataAttribute(h, 'delay', config.providerDelay ?? defaultDelay),
  numberDataAttribute(
    h,
    'close-delay',
    config.providerCloseDelay ?? defaultCloseDelay,
  ),
  numberDataAttribute(
    h,
    'timeout',
    config.providerTimeout ?? defaultProviderTimeout,
  ),
]

const rootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('side', resolvedSide(config)),
  h.DataAttribute('align', resolvedAlign(config)),
  h.DataAttribute(
    'track-cursor-axis',
    config.trackCursorAxis ?? defaultTrackCursorAxis,
  ),
  ...booleanDataAttribute(h, 'disabled', config.isDisabled),
  ...booleanDataAttribute(
    h,
    'disable-hoverable-popup',
    config.disableHoverablePopup,
  ),
]

const triggerOpenChangeForClick = <Message>(
  config: ViewConfig<Message>,
): Option.Option<Message> => {
  const shouldClose = config.open && config.closeOnClick !== false
  const change = shouldClose
    ? pressCloseChange(activeTriggerId(config))
    : pressOpenChange(activeTriggerId(config))

  return openMessage(config, change)
}

const triggerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.Id(triggerId(config)),
  h.Type('button'),
  h.Attribute('aria-describedby', popupId(config)),
  h.DataAttribute('delay', String(resolvedDelay(config))),
  h.DataAttribute('close-delay', String(resolvedCloseDelay(config))),
  h.DataAttribute(
    'close-on-click',
    String(config.closeOnClick ?? defaultCloseOnClick),
  ),
  h.Style({ anchorName: rootAnchorName(config) }),
  ...(config.open ? [h.DataAttribute('popup-open', '')] : []),
  ...(config.isDisabled === true
    ? [h.AriaDisabled(true), h.DataAttribute('trigger-disabled', '')]
    : [h.DataAttribute('base-ui-tooltip-trigger', '')]),
  ...optionalMessageAttribute(
    config.isDisabled === true
      ? Option.none()
      : openMessage(config, hoverOpenChange(activeTriggerId(config))),
    message => h.OnMouseEnter(message),
  ),
  ...optionalMessageAttribute(
    config.isDisabled === true
      ? Option.none()
      : openMessage(config, hoverCloseChange(activeTriggerId(config))),
    message => h.OnMouseLeave(message),
  ),
  ...optionalMessageAttribute(
    config.isDisabled === true
      ? Option.none()
      : openMessage(config, focusOpenChange(activeTriggerId(config))),
    message => h.OnFocus(message),
  ),
  ...optionalMessageAttribute(
    config.isDisabled === true
      ? Option.none()
      : openMessage(config, focusCloseChange(activeTriggerId(config))),
    message => h.OnBlur(message),
  ),
  ...optionalMessageAttribute(
    config.isDisabled === true
      ? Option.none()
      : triggerOpenChangeForClick(config),
    message => h.OnClick(message),
  ),
]

const portalAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
): ReadonlyArray<Attribute<Message>> => [h.DataAttribute('portal', '')]

const placementAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('side', resolvedSide(config)),
  h.DataAttribute('align', resolvedAlign(config)),
  numberDataAttribute(h, 'side-offset', config.sideOffset ?? defaultSideOffset),
  numberDataAttribute(
    h,
    'align-offset',
    config.alignOffset ?? defaultAlignOffset,
  ),
  h.DataAttribute(
    'collision-avoidance',
    String(config.collisionAvoidance ?? defaultCollisionAvoidance),
  ),
  numberDataAttribute(
    h,
    'collision-padding',
    config.collisionPadding ?? defaultCollisionPadding,
  ),
  numberDataAttribute(
    h,
    'arrow-padding',
    config.arrowPadding ?? defaultArrowPadding,
  ),
]

const positionArea = (
  config: Pick<TooltipOptions, 'align' | 'side'>,
): string => {
  const align = resolvedAlign(config)
  const side = resolvedSide(config)
  const inlineAlignments = {
    start: 'span-inline-start',
    center: 'center',
    end: 'span-inline-end',
  }
  const blockAlignments = {
    start: 'span-block-start',
    center: 'center',
    end: 'span-block-end',
  }

  if (side === 'top') {
    return `block-start ${inlineAlignments[align]}`
  }
  if (side === 'bottom') {
    return `block-end ${inlineAlignments[align]}`
  }
  if (side === 'left' || side === 'inline-start') {
    return `inline-start ${blockAlignments[align]}`
  }
  return `inline-end ${blockAlignments[align]}`
}

const positionerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  isMounted: boolean,
): TooltipPartAttributes<Message> => ({
  root: isMounted
    ? [
        h.Id(positionerId(config)),
        ...(config.open ? [] : [h.Hidden(true)]),
        ...openStateDataAttributes(h, config.open),
        ...booleanDataAttribute(h, 'anchor-hidden', config.isAnchorHidden),
        ...instantDataAttribute(h, config.instant),
        ...placementAttributes(h, config),
        h.Style({
          position: 'absolute',
          positionAnchor: rootAnchorName(config),
          inset: 'auto',
          margin: '0',
        }),
      ]
    : [],
  isMounted,
  isOpen: config.open,
})

const popupAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  isMounted: boolean,
): TooltipPartAttributes<Message> => ({
  root: isMounted
    ? [
        h.Key(`${popupId(config)}-${config.open ? 'open' : 'closed'}`),
        h.Id(popupId(config)),
        h.Role('tooltip'),
        ...(config.open ? [] : [h.Hidden(true)]),
        ...openStateDataAttributes(h, config.open),
        ...transitionDataAttributes(h, config.transitionStatus),
        ...instantDataAttribute(h, config.instant),
        ...placementAttributes(h, config),
        ...(config.open && config.onPositioned !== undefined
          ? [
              h.OnMount(
                Mount.mapMessage(
                  PositionAnchoredSurface({
                    id: popupId(config),
                    anchorId: activeTriggerId(config),
                    placement: anchorPlacement(
                      resolvedSide(config),
                      resolvedAlign(config),
                    ),
                    gap: config.sideOffset ?? defaultSideOffset,
                    offset: config.alignOffset ?? defaultAlignOffset,
                    padding: config.collisionPadding ?? defaultCollisionPadding,
                    collisionAvoidance:
                      config.collisionAvoidance ?? defaultCollisionAvoidance,
                  }),
                  config.onPositioned,
                ),
              ),
            ]
          : []),
        h.Style({
          position: config.onPositioned === undefined ? 'fixed' : 'absolute',
          ...(config.onPositioned === undefined
            ? {
                positionAnchor: rootAnchorName(config),
                positionArea: positionArea(config),
              }
            : { inset: 'auto' }),
          margin: '0',
          ...(config.onPositioned === undefined &&
          (config.collisionAvoidance ?? defaultCollisionAvoidance)
            ? { positionTryFallbacks: 'flip-inline, flip-block' }
            : {}),
        }),
        ...optionalMessageAttribute(
          openMessage(config, escapeOpenChange()),
          message =>
            h.OnKeyDownPreventDefault(key =>
              key === 'Escape' ? Option.some(message) : Option.none(),
            ),
        ),
      ]
    : [],
  isMounted,
  isOpen: config.open,
})

const viewportAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  isMounted: boolean,
): TooltipPartAttributes<Message> => ({
  root: isMounted
    ? [
        h.Id(viewportId(config)),
        ...instantDataAttribute(h, config.instant),
        ...(config.viewportActivationDirection === undefined
          ? []
          : [
              h.DataAttribute(
                'activation-direction',
                config.viewportActivationDirection,
              ),
            ]),
        ...booleanDataAttribute(
          h,
          'transitioning',
          config.isViewportTransitioning,
        ),
      ]
    : [],
  isMounted,
  isOpen: config.open,
})

const arrowAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  isMounted: boolean,
): TooltipPartAttributes<Message> => ({
  root: isMounted
    ? [
        h.Id(arrowId(config)),
        h.AriaHidden(true),
        ...openStateDataAttributes(h, config.open),
        ...booleanDataAttribute(h, 'uncentered', config.isArrowUncentered),
        ...instantDataAttribute(h, config.instant),
        ...placementAttributes(h, config),
        h.Style({
          width: `${config.arrowWidth ?? defaultArrowWidth}px`,
          height: `${config.arrowHeight ?? defaultArrowHeight}px`,
        }),
      ]
    : [],
  isMounted,
  isOpen: config.open,
})

export const view = <Message>(config: ViewConfig<Message>): Html => {
  if (
    config.onOpenChange !== undefined &&
    config.onPositioned === undefined &&
    config.positioning !== 'static'
  ) {
    throw new Error(
      'Interactive Tooltip positioning requires an onPositioned Message mapper.',
    )
  }

  const h = html<Message>()
  const isMounted = mounted(config)

  return config.toView({
    provider: providerAttributes(h, config),
    root: rootAttributes(h, config),
    trigger: triggerAttributes(h, config),
    portal: portalAttributes(h),
    positioner: positionerAttributes(h, config, isMounted),
    popup: popupAttributes(h, config, isMounted),
    viewport: viewportAttributes(h, config, isMounted),
    arrow: arrowAttributes(h, config, isMounted),
    isMounted,
    isOpen: config.open,
  })
}
