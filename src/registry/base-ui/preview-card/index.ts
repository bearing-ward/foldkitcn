import { Effect, Option, Predicate, Schema as S } from 'effect'
import * as Command from 'foldkit/command'
import * as Dom from 'foldkit/dom'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'

// MODEL

export const PreviewCardSide = S.Union([
  S.Literal('bottom'),
  S.Literal('top'),
  S.Literal('right'),
  S.Literal('left'),
  S.Literal('inline-start'),
  S.Literal('inline-end'),
])
export type PreviewCardSide = typeof PreviewCardSide.Type

export const PreviewCardAlign = S.Union([
  S.Literal('start'),
  S.Literal('center'),
  S.Literal('end'),
])
export type PreviewCardAlign = typeof PreviewCardAlign.Type

export const PreviewCardTransitionStatus = S.Union([
  S.Literal('idle'),
  S.Literal('starting'),
  S.Literal('ending'),
])
export type PreviewCardTransitionStatus =
  typeof PreviewCardTransitionStatus.Type

export const PreviewCardInstant = S.Union([
  S.Literal('dismiss'),
  S.Literal('focus'),
])
export type PreviewCardInstant = typeof PreviewCardInstant.Type

export const PreviewCardChangeReason = S.Union([
  S.Literal('trigger-hover'),
  S.Literal('trigger-focus'),
  S.Literal('trigger-press'),
  S.Literal('outside-press'),
  S.Literal('escape-key'),
  S.Literal('imperative-action'),
  S.Literal('disabled'),
  S.Literal('none'),
])
export type PreviewCardChangeReason = typeof PreviewCardChangeReason.Type

export const PreviewCardOpenChange = S.Struct({
  open: S.Boolean,
  reason: PreviewCardChangeReason,
  activeTriggerId: S.optional(S.String),
})
export type PreviewCardOpenChange = typeof PreviewCardOpenChange.Type

export const PreviewCardOptions = S.Struct({
  id: S.String,
  open: S.Boolean,
  activeTriggerId: S.optional(S.String),
  triggerId: S.optional(S.String),
  triggerSelector: S.optional(S.String),
  isDisabled: S.optional(S.Boolean),
  forceMount: S.optional(S.Boolean),
  transitionStatus: S.optional(PreviewCardTransitionStatus),
  instant: S.optional(PreviewCardInstant),
  side: S.optional(PreviewCardSide),
  align: S.optional(PreviewCardAlign),
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
  disableOutsidePress: S.optional(S.Boolean),
  viewportActivationDirection: S.optional(S.String),
  isViewportTransitioning: S.optional(S.Boolean),
})
export type PreviewCardOptions = typeof PreviewCardOptions.Type

// MESSAGE

export const CompletedFocusPreviewCard = m('CompletedFocusPreviewCard')
export const CompletedRestorePreviewCardFocus = m(
  'CompletedRestorePreviewCardFocus',
)

export const CommandMessage = S.Union([
  CompletedFocusPreviewCard,
  CompletedRestorePreviewCardFocus,
])
export type CommandMessage = typeof CommandMessage.Type

// UPDATE

const defaultSide: PreviewCardSide = 'bottom'
const defaultAlign: PreviewCardAlign = 'center'
const defaultSideOffset = 0
const defaultAlignOffset = 0
const defaultCollisionAvoidance = true
const defaultCollisionPadding = 5
const defaultArrowPadding = 5
const defaultArrowWidth = 10
const defaultArrowHeight = 5
const defaultDelay = 600
const defaultCloseDelay = 300

export const popupId = (config: Pick<PreviewCardOptions, 'id'>): string =>
  `${config.id}-popup`

export const positionerId = (config: Pick<PreviewCardOptions, 'id'>): string =>
  `${config.id}-positioner`

export const arrowId = (config: Pick<PreviewCardOptions, 'id'>): string =>
  `${config.id}-arrow`

export const viewportId = (config: Pick<PreviewCardOptions, 'id'>): string =>
  `${config.id}-viewport`

export const previewCardSelector = (id: string): string => `#${popupId({ id })}`

export const triggerId = (
  config: Pick<PreviewCardOptions, 'id' | 'triggerId'>,
): string => config.triggerId ?? `${config.id}-trigger`

export const activeTriggerId = (
  config: Pick<PreviewCardOptions, 'activeTriggerId' | 'id' | 'triggerId'>,
): string => config.activeTriggerId ?? triggerId(config)

export const triggerSelector = (
  config: Pick<PreviewCardOptions, 'id' | 'triggerId' | 'triggerSelector'>,
): string => config.triggerSelector ?? `#${triggerId(config)}`

export const openChange = (
  open: boolean,
  reason: PreviewCardChangeReason = 'none',
  nextActiveTriggerId?: string | undefined,
): PreviewCardOpenChange => ({
  open,
  reason,
  ...(nextActiveTriggerId === undefined
    ? {}
    : { activeTriggerId: nextActiveTriggerId }),
})

export const hoverOpenChange = (
  nextActiveTriggerId?: string | undefined,
): PreviewCardOpenChange =>
  openChange(true, 'trigger-hover', nextActiveTriggerId)

export const focusOpenChange = (
  nextActiveTriggerId?: string | undefined,
): PreviewCardOpenChange =>
  openChange(true, 'trigger-focus', nextActiveTriggerId)

export const pressOpenChange = (
  nextActiveTriggerId?: string | undefined,
): PreviewCardOpenChange =>
  openChange(true, 'trigger-press', nextActiveTriggerId)

export const hoverCloseChange = (
  nextActiveTriggerId?: string | undefined,
): PreviewCardOpenChange =>
  openChange(false, 'trigger-hover', nextActiveTriggerId)

export const focusCloseChange = (
  nextActiveTriggerId?: string | undefined,
): PreviewCardOpenChange =>
  openChange(false, 'trigger-focus', nextActiveTriggerId)

export const pressCloseChange = (
  nextActiveTriggerId?: string | undefined,
): PreviewCardOpenChange =>
  openChange(false, 'trigger-press', nextActiveTriggerId)

export const outsideOpenChange = (): PreviewCardOpenChange =>
  openChange(false, 'outside-press')

export const escapeOpenChange = (): PreviewCardOpenChange =>
  openChange(false, 'escape-key')

export const imperativeOpenChange = (): PreviewCardOpenChange =>
  openChange(false, 'imperative-action')

export const disabledOpenChange = (): PreviewCardOpenChange =>
  openChange(false, 'disabled')

export const FocusPreviewCard = Command.define(
  'FocusPreviewCard',
  { selector: S.String },
  CompletedFocusPreviewCard,
)(({ selector }) =>
  Dom.focus(selector, { makeFocusable: true }).pipe(
    Effect.ignore,
    Effect.catchCause(() => Effect.void),
    Effect.as(CompletedFocusPreviewCard()),
  ),
)

export const RestorePreviewCardFocus = Command.define(
  'RestorePreviewCardFocus',
  { selector: S.String },
  CompletedRestorePreviewCardFocus,
)(({ selector }) =>
  Dom.focus(selector).pipe(
    Effect.ignore,
    Effect.catchCause(() => Effect.void),
    Effect.as(CompletedRestorePreviewCardFocus()),
  ),
)

export const commandForOpenChange = (
  config: Pick<PreviewCardOptions, 'id' | 'triggerId' | 'triggerSelector'>,
  change: PreviewCardOpenChange,
): Command.Command<CommandMessage> =>
  change.open
    ? FocusPreviewCard({ selector: previewCardSelector(config.id) })
    : RestorePreviewCardFocus({ selector: triggerSelector(config) })

// VIEW

export type PreviewCardAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  trigger: ReadonlyArray<Attribute<Message>>
  portal: ReadonlyArray<Attribute<Message>>
  positioner: PreviewCardPartAttributes<Message>
  backdrop: PreviewCardPartAttributes<Message>
  popup: PreviewCardPartAttributes<Message>
  viewport: PreviewCardPartAttributes<Message>
  arrow: PreviewCardPartAttributes<Message>
  isMounted: boolean
  isOpen: boolean
}>

export type PreviewCardPartAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  isMounted: boolean
  isOpen: boolean
}>

export type ViewConfig<Message> = PreviewCardOptions &
  Readonly<{
    toView: (attributes: PreviewCardAttributes<Message>) => Html
    onOpenChange?: (change: PreviewCardOpenChange) => Message
  }>

const resolvedSide = (
  config: Pick<PreviewCardOptions, 'side'>,
): PreviewCardSide => config.side ?? defaultSide

const resolvedAlign = (
  config: Pick<PreviewCardOptions, 'align'>,
): PreviewCardAlign => config.align ?? defaultAlign

const resolvedDelay = (config: Pick<PreviewCardOptions, 'delay'>): number =>
  config.delay ?? defaultDelay

const resolvedCloseDelay = (
  config: Pick<PreviewCardOptions, 'closeDelay'>,
): number => config.closeDelay ?? defaultCloseDelay

const mounted = (
  config: Pick<PreviewCardOptions, 'forceMount' | 'open' | 'transitionStatus'>,
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
  transitionStatus: PreviewCardTransitionStatus | undefined,
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
  instant: PreviewCardInstant | undefined,
): ReadonlyArray<Attribute<Message>> =>
  instant === undefined ? [] : [h.DataAttribute('instant', instant)]

const openMessage = <Message>(
  config: ViewConfig<Message>,
  change: PreviewCardOpenChange,
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

const rootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('side', resolvedSide(config)),
  h.DataAttribute('align', resolvedAlign(config)),
  ...booleanDataAttribute(h, 'disabled', config.isDisabled),
]

const triggerOpenChangeForClick = <Message>(
  config: ViewConfig<Message>,
): Option.Option<Message> => {
  const currentTriggerId = activeTriggerId(config)
  const shouldClose = config.open && currentTriggerId === triggerId(config)
  const change = shouldClose
    ? pressCloseChange(currentTriggerId)
    : pressOpenChange(currentTriggerId)

  return openMessage(config, change)
}

const triggerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.Id(triggerId(config)),
  h.Attribute('aria-describedby', popupId(config)),
  h.DataAttribute('delay', String(resolvedDelay(config))),
  h.DataAttribute('close-delay', String(resolvedCloseDelay(config))),
  ...(config.open && activeTriggerId(config) === triggerId(config)
    ? [h.DataAttribute('popup-open', '')]
    : []),
  ...(config.isDisabled === true
    ? [h.AriaDisabled(true), h.DataAttribute('trigger-disabled', '')]
    : [h.DataAttribute('base-ui-preview-card-trigger', '')]),
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

const positionerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  isMounted: boolean,
): PreviewCardPartAttributes<Message> => ({
  root: isMounted
    ? [
        h.Id(positionerId(config)),
        ...(config.open ? [] : [h.Hidden(true), h.Inert(true)]),
        ...openStateDataAttributes(h, config.open),
        ...booleanDataAttribute(h, 'anchor-hidden', config.isAnchorHidden),
        ...instantDataAttribute(h, config.instant),
        ...placementAttributes(h, config),
        h.Style({
          position: 'absolute',
          inset: 'auto',
          margin: '0',
        }),
      ]
    : [],
  isMounted,
  isOpen: config.open,
})

const backdropAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  isMounted: boolean,
): PreviewCardPartAttributes<Message> => ({
  root: isMounted
    ? [
        h.Role('presentation'),
        ...(config.open ? [] : [h.Hidden(true)]),
        ...openStateDataAttributes(h, config.open),
        ...transitionDataAttributes(h, config.transitionStatus),
        h.Style({
          pointerEvents: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }),
        ...optionalMessageAttribute(
          config.disableOutsidePress === true
            ? Option.none()
            : openMessage(config, outsideOpenChange()),
          message => h.OnClick(message),
        ),
      ]
    : [],
  isMounted,
  isOpen: config.open,
})

const popupAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  isMounted: boolean,
): PreviewCardPartAttributes<Message> => ({
  root: isMounted
    ? [
        h.Id(popupId(config)),
        h.Tabindex(-1),
        ...(config.open ? [] : [h.Hidden(true)]),
        ...openStateDataAttributes(h, config.open),
        ...transitionDataAttributes(h, config.transitionStatus),
        ...instantDataAttribute(h, config.instant),
        ...placementAttributes(h, config),
        ...optionalMessageAttribute(
          openMessage(config, hoverOpenChange(activeTriggerId(config))),
          message => h.OnMouseEnter(message),
        ),
        ...optionalMessageAttribute(
          openMessage(config, hoverCloseChange(activeTriggerId(config))),
          message => h.OnMouseLeave(message),
        ),
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
): PreviewCardPartAttributes<Message> => ({
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
): PreviewCardPartAttributes<Message> => ({
  root: isMounted
    ? [
        h.Id(arrowId(config)),
        h.AriaHidden(true),
        ...openStateDataAttributes(h, config.open),
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
  isOpen: config.open,
})

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const isMounted = mounted(config)

  return config.toView({
    root: rootAttributes(h, config),
    trigger: triggerAttributes(h, config),
    portal: portalAttributes(h),
    positioner: positionerAttributes(h, config, isMounted),
    backdrop: backdropAttributes(h, config, isMounted),
    popup: popupAttributes(h, config, isMounted),
    viewport: viewportAttributes(h, config, isMounted),
    arrow: arrowAttributes(h, config, isMounted),
    isMounted,
    isOpen: config.open,
  })
}
