import { Effect, Option, Predicate, Schema as S } from 'effect'
import * as Command from 'foldkit/command'
import * as Dom from 'foldkit/dom'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'

// MODEL

export const DialogModalMode = S.Union([S.Boolean, S.Literal('trap-focus')])
export type DialogModalMode = typeof DialogModalMode.Type

export const DialogTransitionStatus = S.Union([
  S.Literal('idle'),
  S.Literal('starting'),
  S.Literal('ending'),
])
export type DialogTransitionStatus = typeof DialogTransitionStatus.Type

export const DialogChangeReason = S.Union([
  S.Literal('trigger-press'),
  S.Literal('close-press'),
  S.Literal('outside-press'),
  S.Literal('escape-key'),
  S.Literal('none'),
])
export type DialogChangeReason = typeof DialogChangeReason.Type

export const DialogOpenChange = S.Struct({
  open: S.Boolean,
  reason: DialogChangeReason,
})
export type DialogOpenChange = typeof DialogOpenChange.Type

export const DialogOptions = S.Struct({
  id: S.String,
  open: S.Boolean,
  modal: S.optional(DialogModalMode),
  isDisabled: S.optional(S.Boolean),
  isNested: S.optional(S.Boolean),
  hasNestedDialogOpen: S.optional(S.Boolean),
  transitionStatus: S.optional(DialogTransitionStatus),
  titleId: S.optional(S.String),
  descriptionId: S.optional(S.String),
  focusSelector: S.optional(S.String),
  forceMount: S.optional(S.Boolean),
  disableOutsidePress: S.optional(S.Boolean),
})
export type DialogOptions = typeof DialogOptions.Type

// MESSAGE

export const CompletedShowDialog = m('CompletedShowDialog')
export const CompletedCloseDialog = m('CompletedCloseDialog')

export const CommandMessage = S.Union([
  CompletedShowDialog,
  CompletedCloseDialog,
])
export type CommandMessage = typeof CommandMessage.Type

// UPDATE

const defaultModal: DialogModalMode = true

const dialogSelector = (id: string): string => `#${id}`

const maybeFocusSelectorSchema = S.Option(S.String)

export const ShowDialog = Command.define(
  'ShowDialog',
  {
    id: S.String,
    modal: DialogModalMode,
    maybeFocusSelector: maybeFocusSelectorSchema,
  },
  CompletedShowDialog,
)(({ id, modal, maybeFocusSelector }) => {
  const focusOptions = Option.match(maybeFocusSelector, {
    onNone: () => ({}),
    onSome: focusSelector => ({ focusSelector }),
  })
  const show = Dom.showModal(dialogSelector(id), focusOptions)

  if (modal === true) {
    return Dom.lockScroll.pipe(
      Effect.andThen(() => show),
      Effect.ignore,
      Effect.as(CompletedShowDialog()),
    )
  }

  if (modal === 'trap-focus') {
    return show.pipe(Effect.ignore, Effect.as(CompletedShowDialog()))
  }

  return Effect.succeed(CompletedShowDialog())
})

export const CloseDialog = Command.define(
  'CloseDialog',
  { id: S.String, modal: DialogModalMode },
  CompletedCloseDialog,
)(({ id, modal }) => {
  const close = Dom.closeModal(dialogSelector(id))

  if (modal === true) {
    return close.pipe(
      Effect.andThen(() => Dom.unlockScroll),
      Effect.ignore,
      Effect.as(CompletedCloseDialog()),
    )
  }

  if (modal === 'trap-focus') {
    return close.pipe(Effect.ignore, Effect.as(CompletedCloseDialog()))
  }

  return Effect.succeed(CompletedCloseDialog())
})

export const titleId = (
  config: Pick<DialogOptions, 'id' | 'titleId'>,
): string => config.titleId ?? `${config.id}-title`

export const descriptionId = (
  config: Pick<DialogOptions, 'descriptionId' | 'id'>,
): string => config.descriptionId ?? `${config.id}-description`

export const panelId = (config: Pick<DialogOptions, 'id'>): string =>
  `${config.id}-popup`

export const openChange = (
  open: boolean,
  reason: DialogChangeReason = 'none',
): DialogOpenChange => ({
  open,
  reason,
})

export const triggerOpenChange = (): DialogOpenChange =>
  openChange(true, 'trigger-press')

export const closeOpenChange = (): DialogOpenChange =>
  openChange(false, 'close-press')

export const outsideOpenChange = (): DialogOpenChange =>
  openChange(false, 'outside-press')

export const escapeOpenChange = (): DialogOpenChange =>
  openChange(false, 'escape-key')

export const commandForOpenChange = (
  config: Pick<DialogOptions, 'focusSelector' | 'id' | 'modal'>,
  change: DialogOpenChange,
): Command.Command<CommandMessage> =>
  change.open
    ? ShowDialog({
        id: config.id,
        modal: config.modal ?? defaultModal,
        maybeFocusSelector: Option.fromNullishOr(config.focusSelector),
      })
    : CloseDialog({ id: config.id, modal: config.modal ?? defaultModal })

// VIEW

export type DialogAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  trigger: ReadonlyArray<Attribute<Message>>
  dialog: ReadonlyArray<Attribute<Message>>
  portal: ReadonlyArray<Attribute<Message>>
  backdrop: DialogPartAttributes<Message>
  popup: DialogPartAttributes<Message>
  title: ReadonlyArray<Attribute<Message>>
  description: ReadonlyArray<Attribute<Message>>
  close: ReadonlyArray<Attribute<Message>>
  isMounted: boolean
  isOpen: boolean
}>

export type DialogPartAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  isMounted: boolean
  isOpen: boolean
}>

export type ViewConfig<Message> = DialogOptions &
  Readonly<{
    toView: (attributes: DialogAttributes<Message>) => Html
    onOpenChange?: (change: DialogOpenChange) => Message
  }>

const booleanDataAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  name: string,
  value: boolean | undefined,
): ReadonlyArray<Attribute<Message>> =>
  value === true ? [h.DataAttribute(name, '')] : []

const openStateDataAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  open: boolean,
): ReadonlyArray<Attribute<Message>> =>
  open ? [h.DataAttribute('open', '')] : [h.DataAttribute('closed', '')]

const transitionDataAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  transitionStatus: DialogTransitionStatus | undefined,
): ReadonlyArray<Attribute<Message>> => {
  if (transitionStatus === 'starting') {
    return [h.DataAttribute('starting-style', '')]
  }

  if (transitionStatus === 'ending') {
    return [h.DataAttribute('ending-style', '')]
  }

  return []
}

const mounted = (
  config: Pick<DialogOptions, 'forceMount' | 'open' | 'transitionStatus'>,
): boolean =>
  config.open ||
  config.forceMount === true ||
  config.transitionStatus === 'ending'

const openMessage = <Message>(
  config: ViewConfig<Message>,
  change: DialogOpenChange,
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
  h.DataAttribute('modal', String(config.modal ?? defaultModal)),
  ...booleanDataAttribute(h, 'disabled', config.isDisabled),
]

const triggerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.Type('button'),
  h.AriaHasPopup('dialog'),
  h.AriaExpanded(config.open),
  h.AriaControls(panelId(config)),
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

const dialogAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.Id(config.id),
  h.Open(config.open),
  h.Role('dialog'),
  h.AriaModal(config.modal !== false),
  h.AriaLabelledBy(titleId(config)),
  h.Attribute('aria-describedby', descriptionId(config)),
  h.Style({ position: 'fixed', inset: '0' }),
  ...optionalMessageAttribute(
    openMessage(config, escapeOpenChange()),
    message => h.OnCancel(message),
  ),
]

const portalAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
): ReadonlyArray<Attribute<Message>> => [h.DataAttribute('portal', '')]

const backdropAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  isMounted: boolean,
): DialogPartAttributes<Message> => ({
  root: isMounted
    ? [
        h.Role('presentation'),
        ...(config.open ? [] : [h.Hidden(true)]),
        h.Style({ userSelect: 'none', WebkitUserSelect: 'none' }),
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
): DialogPartAttributes<Message> => ({
  root: isMounted
    ? [
        h.Id(panelId(config)),
        h.Role('dialog'),
        h.Tabindex(-1),
        ...(config.open ? [] : [h.Hidden(true)]),
        h.AriaLabelledBy(titleId(config)),
        h.Attribute('aria-describedby', descriptionId(config)),
        ...openStateDataAttributes(h, config.open),
        ...transitionDataAttributes(h, config.transitionStatus),
        ...booleanDataAttribute(h, 'nested', config.isNested),
        ...booleanDataAttribute(
          h,
          'nested-dialog-open',
          config.hasNestedDialogOpen,
        ),
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
    dialog: dialogAttributes(h, config),
    portal: portalAttributes(h),
    backdrop: backdropAttributes(h, config, isMounted),
    popup: popupAttributes(h, config, isMounted),
    title: [h.Id(titleId(config))],
    description: [h.Id(descriptionId(config))],
    close: closeAttributes(h, config),
    isMounted,
    isOpen: config.open,
  })
}
