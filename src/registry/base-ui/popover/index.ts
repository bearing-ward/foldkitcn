import { Effect, Option, Predicate, Schema as S } from 'effect'
import * as Command from 'foldkit/command'
import * as Dom from 'foldkit/dom'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'

// MODEL

export const PopoverSide = S.Union([
  S.Literal('bottom'),
  S.Literal('top'),
  S.Literal('right'),
  S.Literal('left'),
  S.Literal('inline-start'),
  S.Literal('inline-end'),
])
export type PopoverSide = typeof PopoverSide.Type

export const PopoverAlign = S.Union([
  S.Literal('start'),
  S.Literal('center'),
  S.Literal('end'),
])
export type PopoverAlign = typeof PopoverAlign.Type

export const PopoverTransitionStatus = S.Union([
  S.Literal('idle'),
  S.Literal('starting'),
  S.Literal('ending'),
])
export type PopoverTransitionStatus = typeof PopoverTransitionStatus.Type

export const PopoverChangeReason = S.Union([
  S.Literal('trigger-press'),
  S.Literal('close-press'),
  S.Literal('outside-press'),
  S.Literal('escape-key'),
  S.Literal('none'),
])
export type PopoverChangeReason = typeof PopoverChangeReason.Type

export const PopoverOpenChange = S.Struct({
  open: S.Boolean,
  reason: PopoverChangeReason,
})
export type PopoverOpenChange = typeof PopoverOpenChange.Type

export const PopoverOptions = S.Struct({
  id: S.String,
  open: S.Boolean,
  isDisabled: S.optional(S.Boolean),
  forceMount: S.optional(S.Boolean),
  transitionStatus: S.optional(PopoverTransitionStatus),
  titleId: S.optional(S.String),
  descriptionId: S.optional(S.String),
  focusSelector: S.optional(S.String),
  triggerSelector: S.optional(S.String),
  disableOutsidePress: S.optional(S.Boolean),
  side: S.optional(PopoverSide),
  align: S.optional(PopoverAlign),
  sideOffset: S.optional(S.Number),
  alignOffset: S.optional(S.Number),
  collisionAvoidance: S.optional(S.Boolean),
  collisionPadding: S.optional(S.Number),
  arrowWidth: S.optional(S.Number),
  arrowHeight: S.optional(S.Number),
})
export type PopoverOptions = typeof PopoverOptions.Type

// MESSAGE

export const CompletedFocusPopover = m('CompletedFocusPopover')
export const CompletedRestorePopoverFocus = m('CompletedRestorePopoverFocus')

export const CommandMessage = S.Union([
  CompletedFocusPopover,
  CompletedRestorePopoverFocus,
])
export type CommandMessage = typeof CommandMessage.Type

// UPDATE

const defaultSide: PopoverSide = 'bottom'
const defaultAlign: PopoverAlign = 'center'
const defaultSideOffset = 0
const defaultAlignOffset = 0
const defaultCollisionAvoidance = true
const defaultCollisionPadding = 0
const defaultArrowWidth = 10
const defaultArrowHeight = 5

const maybeFocusSelectorSchema = S.Option(S.String)

export const popupId = (config: Pick<PopoverOptions, 'id'>): string =>
  `${config.id}-popup`

export const positionerId = (config: Pick<PopoverOptions, 'id'>): string =>
  `${config.id}-positioner`

export const arrowId = (config: Pick<PopoverOptions, 'id'>): string =>
  `${config.id}-arrow`

export const titleId = (
  config: Pick<PopoverOptions, 'id' | 'titleId'>,
): string => config.titleId ?? `${config.id}-title`

export const descriptionId = (
  config: Pick<PopoverOptions, 'descriptionId' | 'id'>,
): string => config.descriptionId ?? `${config.id}-description`

export const popoverSelector = (id: string): string => `#${popupId({ id })}`

export const triggerSelector = (
  config: Pick<PopoverOptions, 'id' | 'triggerSelector'>,
): string => config.triggerSelector ?? `#${config.id}-trigger`

export const openChange = (
  open: boolean,
  reason: PopoverChangeReason = 'none',
): PopoverOpenChange => ({
  open,
  reason,
})

export const triggerOpenChange = (): PopoverOpenChange =>
  openChange(true, 'trigger-press')

export const closeOpenChange = (): PopoverOpenChange =>
  openChange(false, 'close-press')

export const outsideOpenChange = (): PopoverOpenChange =>
  openChange(false, 'outside-press')

export const escapeOpenChange = (): PopoverOpenChange =>
  openChange(false, 'escape-key')

export const FocusPopover = Command.define(
  'FocusPopover',
  {
    id: S.String,
    maybeFocusSelector: maybeFocusSelectorSchema,
  },
  CompletedFocusPopover,
)(({ id, maybeFocusSelector }) => {
  const selector = Option.getOrElse(maybeFocusSelector, () =>
    popoverSelector(id),
  )

  return Dom.focus(selector, { makeFocusable: true }).pipe(
    Effect.ignore,
    Effect.catchCause(() => Effect.void),
    Effect.as(CompletedFocusPopover()),
  )
})

export const RestorePopoverFocus = Command.define(
  'RestorePopoverFocus',
  { selector: S.String },
  CompletedRestorePopoverFocus,
)(({ selector }) =>
  Dom.focus(selector).pipe(
    Effect.ignore,
    Effect.catchCause(() => Effect.void),
    Effect.as(CompletedRestorePopoverFocus()),
  ),
)

export const commandForOpenChange = (
  config: Pick<PopoverOptions, 'focusSelector' | 'id' | 'triggerSelector'>,
  change: PopoverOpenChange,
): Command.Command<CommandMessage> =>
  change.open
    ? FocusPopover({
        id: config.id,
        maybeFocusSelector: Option.fromNullishOr(config.focusSelector),
      })
    : RestorePopoverFocus({ selector: triggerSelector(config) })

// VIEW

export type PopoverAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  trigger: ReadonlyArray<Attribute<Message>>
  portal: ReadonlyArray<Attribute<Message>>
  positioner: PopoverPartAttributes<Message>
  backdrop: PopoverPartAttributes<Message>
  popup: PopoverPartAttributes<Message>
  arrow: PopoverPartAttributes<Message>
  title: ReadonlyArray<Attribute<Message>>
  description: ReadonlyArray<Attribute<Message>>
  close: ReadonlyArray<Attribute<Message>>
  isMounted: boolean
  isOpen: boolean
}>

export type PopoverPartAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  isMounted: boolean
  isOpen: boolean
}>

export type ViewConfig<Message> = PopoverOptions &
  Readonly<{
    toView: (attributes: PopoverAttributes<Message>) => Html
    onOpenChange?: (change: PopoverOpenChange) => Message
  }>

const resolvedSide = (config: Pick<PopoverOptions, 'side'>): PopoverSide =>
  config.side ?? defaultSide

const resolvedAlign = (config: Pick<PopoverOptions, 'align'>): PopoverAlign =>
  config.align ?? defaultAlign

const mounted = (
  config: Pick<PopoverOptions, 'forceMount' | 'open' | 'transitionStatus'>,
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
  transitionStatus: PopoverTransitionStatus | undefined,
): ReadonlyArray<Attribute<Message>> => {
  if (transitionStatus === 'starting') {
    return [h.DataAttribute('starting-style', '')]
  }

  if (transitionStatus === 'ending') {
    return [h.DataAttribute('ending-style', '')]
  }

  return []
}

const openMessage = <Message>(
  config: ViewConfig<Message>,
  change: PopoverOpenChange,
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

const triggerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.Id(triggerSelector(config).slice(1)),
  h.Type('button'),
  h.AriaHasPopup('dialog'),
  h.AriaExpanded(config.open),
  h.AriaControls(popupId(config)),
  ...booleanDataAttribute(h, 'disabled', config.isDisabled),
  ...(config.open ? [h.DataAttribute('popup-open', '')] : []),
  ...(config.isDisabled === true ? [h.AriaDisabled(true)] : []),
  ...optionalMessageAttribute(
    config.isDisabled === true
      ? Option.none()
      : openMessage(config, triggerOpenChange()),
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
]

const positionerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  isMounted: boolean,
): PopoverPartAttributes<Message> => ({
  root: isMounted
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
  isMounted,
  isOpen: config.open,
})

const backdropAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  isMounted: boolean,
): PopoverPartAttributes<Message> => ({
  root: isMounted
    ? [
        h.Role('presentation'),
        ...(config.open ? [] : [h.Hidden(true)]),
        ...openStateDataAttributes(h, config.open),
        ...transitionDataAttributes(h, config.transitionStatus),
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
): PopoverPartAttributes<Message> => ({
  root: isMounted
    ? [
        h.Id(popupId(config)),
        h.Popover('manual'),
        h.Role('dialog'),
        h.Tabindex(-1),
        ...(config.open ? [] : [h.Hidden(true)]),
        h.AriaLabelledBy(titleId(config)),
        h.Attribute('aria-describedby', descriptionId(config)),
        ...openStateDataAttributes(h, config.open),
        ...transitionDataAttributes(h, config.transitionStatus),
        ...placementAttributes(h, config),
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

const arrowAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  isMounted: boolean,
): PopoverPartAttributes<Message> => ({
  root: isMounted
    ? [
        h.Id(arrowId(config)),
        h.AriaHidden(true),
        ...openStateDataAttributes(h, config.open),
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

const closeAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.Type('button'),
  ...booleanDataAttribute(h, 'disabled', config.isDisabled),
  ...(config.isDisabled === true ? [h.AriaDisabled(true)] : []),
  ...optionalMessageAttribute(
    config.isDisabled === true
      ? Option.none()
      : openMessage(config, closeOpenChange()),
    message => h.OnClick(message),
  ),
]

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
    arrow: arrowAttributes(h, config, isMounted),
    title: [h.Id(titleId(config))],
    description: [h.Id(descriptionId(config))],
    close: closeAttributes(h, config),
    isMounted,
    isOpen: config.open,
  })
}
