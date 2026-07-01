import { Effect, Match as M, Schema as S } from 'effect'
import * as Command from 'foldkit/command'
import * as Dom from 'foldkit/dom'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'

import { cn } from '../../../utils/cn'
import * as ShadcnButton from '../button'

// MODEL

type Child = Html | string

export const MessageScrollerDirection = S.Union([
  S.Literal('start'),
  S.Literal('end'),
])
export type MessageScrollerDirection = typeof MessageScrollerDirection.Type

export const MessageScrollerState = S.Struct({
  id: S.String,
  isPinnedToEnd: S.Boolean,
  hasUnreadMessages: S.Boolean,
  messageCount: S.Number,
  lastScrollDirection: MessageScrollerDirection,
})
export type MessageScrollerState = typeof MessageScrollerState.Type

export const messageScrollerDirectionValues: ReadonlyArray<MessageScrollerDirection> =
  ['start', 'end']

export const init = (id: string, messageCount = 0): MessageScrollerState => ({
  id,
  isPinnedToEnd: true,
  hasUnreadMessages: false,
  messageCount,
  lastScrollDirection: 'end',
})

export const shouldShowScrollButton = (state: MessageScrollerState): boolean =>
  !state.isPinnedToEnd || state.hasUnreadMessages

export const endAnchorId = (id: string): string => `${id}-end-anchor`

export const startAnchorId = (id: string): string => `${id}-start-anchor`

// MESSAGE

export const UpdatedMessageScrollerPinned = m('UpdatedMessageScrollerPinned', {
  isPinnedToEnd: S.Boolean,
})
export const AppendedMessageScrollerItems = m('AppendedMessageScrollerItems', {
  count: S.Number,
})
export const ClickedMessageScrollerButton = m('ClickedMessageScrollerButton', {
  direction: MessageScrollerDirection,
})
export const CompletedScrollMessagesToEnd = m('CompletedScrollMessagesToEnd')
export const CompletedScrollMessagesToStart = m(
  'CompletedScrollMessagesToStart',
)

export const Message = S.Union([
  UpdatedMessageScrollerPinned,
  AppendedMessageScrollerItems,
  ClickedMessageScrollerButton,
  CompletedScrollMessagesToEnd,
  CompletedScrollMessagesToStart,
])
export type Message = typeof Message.Type

// COMMAND

export const ScrollMessagesToEnd = Command.define(
  'ScrollMessagesToEnd',
  { id: S.String },
  CompletedScrollMessagesToEnd,
)(({ id }) =>
  Dom.scrollIntoViewAfterPaint(`#${endAnchorId(id)}`, { block: 'end' }).pipe(
    Effect.catchTag('ElementNotFound', () => Effect.void),
    Effect.as(CompletedScrollMessagesToEnd()),
  ),
)

export const ScrollMessagesToStart = Command.define(
  'ScrollMessagesToStart',
  { id: S.String },
  CompletedScrollMessagesToStart,
)(({ id }) =>
  Dom.scrollIntoViewAfterPaint(`#${startAnchorId(id)}`, {
    block: 'start',
  }).pipe(
    Effect.catchTag('ElementNotFound', () => Effect.void),
    Effect.as(CompletedScrollMessagesToStart()),
  ),
)

// UPDATE

type UpdateReturn = readonly [
  MessageScrollerState,
  ReadonlyArray<Command.Command<Message>>,
]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

export const update = (
  state: MessageScrollerState,
  message: Message,
): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      UpdatedMessageScrollerPinned: ({ isPinnedToEnd }) => [
        evo(state, {
          isPinnedToEnd: () => isPinnedToEnd,
          hasUnreadMessages: unread =>
            isPinnedToEnd === true ? false : unread,
        }),
        [],
      ],
      AppendedMessageScrollerItems: ({ count }) => {
        const next = evo(state, {
          messageCount: current => current + count,
          hasUnreadMessages: unread =>
            state.isPinnedToEnd === true ? false : unread || count > 0,
        })

        return state.isPinnedToEnd === true && count > 0
          ? [next, [ScrollMessagesToEnd({ id: state.id })]]
          : [next, []]
      },
      ClickedMessageScrollerButton: ({ direction }) => [
        evo(state, {
          isPinnedToEnd: () => direction === 'end',
          hasUnreadMessages: () => false,
          lastScrollDirection: () => direction,
        }),
        [
          direction === 'end'
            ? ScrollMessagesToEnd({ id: state.id })
            : ScrollMessagesToStart({ id: state.id }),
        ],
      ],
      CompletedScrollMessagesToEnd: () => [
        evo(state, {
          isPinnedToEnd: () => true,
          hasUnreadMessages: () => false,
          lastScrollDirection: () => 'end',
        }),
        [],
      ],
      CompletedScrollMessagesToStart: () => [
        evo(state, {
          isPinnedToEnd: () => false,
          lastScrollDirection: () => 'start',
        }),
        [],
      ],
    }),
  )

// VIEW

export const MessageScrollerStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type MessageScrollerStyleOptions =
  typeof MessageScrollerStyleOptions.Type

export const MessageScrollerViewportStyleOptions = S.Struct({
  className: S.optional(S.String),
  isAutoscrolling: S.optional(S.Boolean),
})
export type MessageScrollerViewportStyleOptions =
  typeof MessageScrollerViewportStyleOptions.Type

export const MessageScrollerContentStyleOptions = S.Struct({
  className: S.optional(S.String),
  isBusy: S.optional(S.Boolean),
})
export type MessageScrollerContentStyleOptions =
  typeof MessageScrollerContentStyleOptions.Type

export const MessageScrollerItemStyleOptions = S.Struct({
  className: S.optional(S.String),
  scrollAnchor: S.optional(S.Boolean),
})
export type MessageScrollerItemStyleOptions =
  typeof MessageScrollerItemStyleOptions.Type

export type MessageScrollerAttributes<Message> = Readonly<{
  scroller: ReadonlyArray<Attribute<Message>>
}>

export type MessageScrollerViewportAttributes<Message> = Readonly<{
  viewport: ReadonlyArray<Attribute<Message>>
}>

export type MessageScrollerContentAttributes<Message> = Readonly<{
  content: ReadonlyArray<Attribute<Message>>
}>

export type MessageScrollerItemAttributes<Message> = Readonly<{
  item: ReadonlyArray<Attribute<Message>>
}>

export type MessageScrollerButtonAttributes<Message> = Readonly<{
  button: ReadonlyArray<Attribute<Message>>
}>

export type ViewConfig<Message> = MessageScrollerStyleOptions &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>
    children?: ReadonlyArray<Child>
    toView?: (attributes: MessageScrollerAttributes<Message>) => Html
  }>

export type MessageScrollerViewportConfig<Message> =
  MessageScrollerViewportStyleOptions &
    Readonly<{
      attributes?: ReadonlyArray<Attribute<Message>>
      children?: ReadonlyArray<Child>
      toView?: (attributes: MessageScrollerViewportAttributes<Message>) => Html
    }>

export type MessageScrollerContentConfig<Message> =
  MessageScrollerContentStyleOptions &
    Readonly<{
      attributes?: ReadonlyArray<Attribute<Message>>
      children?: ReadonlyArray<Child>
      toView?: (attributes: MessageScrollerContentAttributes<Message>) => Html
    }>

export type MessageScrollerItemConfig<Message> =
  MessageScrollerItemStyleOptions &
    Readonly<{
      attributes?: ReadonlyArray<Attribute<Message>>
      children?: ReadonlyArray<Child>
      toView?: (attributes: MessageScrollerItemAttributes<Message>) => Html
    }>

export type MessageScrollerButtonConfig<Message> = Readonly<{
  variant?: ShadcnButton.ButtonVariant
  className?: string
  direction?: MessageScrollerDirection
  isActive?: boolean
  ariaLabel?: string
  isDisabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  attributes?: ReadonlyArray<Attribute<Message>>
  children?: ReadonlyArray<Child>
  toView?: (attributes: MessageScrollerButtonAttributes<Message>) => Html
}>

export const messageScrollerBaseClassName =
  'group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden'

export const messageScrollerViewportBaseClassName =
  'size-full min-h-0 min-w-0 scroll-fade-b scrollbar-thin scrollbar-gutter-stable overflow-y-auto overscroll-contain contain-content data-autoscrolling:scrollbar-none'

export const messageScrollerContentBaseClassName =
  'flex h-max min-h-full flex-col gap-6'

export const messageScrollerItemBaseClassName =
  'min-w-0 shrink-0 [contain-intrinsic-size:auto_10rem] [content-visibility:auto]'

export const messageScrollerButtonBaseClassName =
  'absolute inset-s-1/2 -translate-x-1/2 border-border bg-background text-foreground transition-[translate,scale,opacity] duration-200 hover:bg-muted hover:text-foreground data-[active=false]:pointer-events-none data-[active=false]:scale-95 data-[active=false]:opacity-0 data-[active=false]:duration-400 data-[active=false]:ease-[cubic-bezier(0.7,0,0.84,0)] data-[active=true]:translate-y-0 data-[active=true]:scale-100 data-[active=true]:opacity-100 data-[active=true]:ease-[cubic-bezier(0.23,1,0.32,1)] data-[direction=end]:bottom-4 data-[direction=end]:data-[active=false]:translate-y-full data-[direction=start]:top-4 data-[direction=start]:data-[active=false]:-translate-y-full rtl:translate-x-1/2 data-[direction=start]:[&_svg]:rotate-180'

export const messageScrollerClassName = ({
  className,
}: MessageScrollerStyleOptions = {}): string =>
  cn(messageScrollerBaseClassName, className)

export const messageScrollerViewportClassName = ({
  className,
}: MessageScrollerViewportStyleOptions = {}): string =>
  cn(messageScrollerViewportBaseClassName, className)

export const messageScrollerContentClassName = ({
  className,
}: MessageScrollerContentStyleOptions = {}): string =>
  cn(messageScrollerContentBaseClassName, className)

export const messageScrollerItemClassName = ({
  className,
}: MessageScrollerItemStyleOptions = {}): string =>
  cn(messageScrollerItemBaseClassName, className)

export const messageScrollerButtonClassName = (
  className: string | undefined,
): string => cn(messageScrollerButtonBaseClassName, className)

const optionalClassAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  className: string,
): ReadonlyArray<Attribute<Message>> =>
  className === '' ? [] : [h.Class(className)]

export const view = <Message>(config: ViewConfig<Message> = {}): Html => {
  const h = html<Message>()
  const attributes = {
    scroller: [
      h.DataAttribute('slot', 'message-scroller'),
      ...optionalClassAttribute(h, messageScrollerClassName(config)),
      ...(config.attributes ?? []),
    ],
  }

  return config.toView === undefined
    ? h.div([...attributes.scroller], config.children ?? [])
    : config.toView(attributes)
}

export const MessageScroller = view

export const MessageScrollerViewport = <Message>(
  config: MessageScrollerViewportConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes = {
    viewport: [
      h.DataAttribute('slot', 'message-scroller-viewport'),
      ...(config.isAutoscrolling === true
        ? [h.DataAttribute('autoscrolling', '')]
        : []),
      ...optionalClassAttribute(h, messageScrollerViewportClassName(config)),
      ...(config.attributes ?? []),
    ],
  }

  return config.toView === undefined
    ? h.div([...attributes.viewport], config.children ?? [])
    : config.toView(attributes)
}

export const MessageScrollerContent = <Message>(
  config: MessageScrollerContentConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes = {
    content: [
      h.DataAttribute('slot', 'message-scroller-content'),
      h.Role('log'),
      h.AriaLive('polite'),
      h.AriaRelevant('additions'),
      h.AriaBusy(config.isBusy ?? false),
      ...optionalClassAttribute(h, messageScrollerContentClassName(config)),
      ...(config.attributes ?? []),
    ],
  }

  return config.toView === undefined
    ? h.div([...attributes.content], config.children ?? [])
    : config.toView(attributes)
}

export const MessageScrollerItem = <Message>(
  config: MessageScrollerItemConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes = {
    item: [
      h.DataAttribute('slot', 'message-scroller-item'),
      h.DataAttribute('scroll-anchor', String(config.scrollAnchor ?? false)),
      ...optionalClassAttribute(h, messageScrollerItemClassName(config)),
      ...(config.attributes ?? []),
    ],
  }

  return config.toView === undefined
    ? h.div([...attributes.item], config.children ?? [])
    : config.toView(attributes)
}

const arrowDownIcon = (): Html => {
  const h = html<never>()

  return h.svg(
    [
      h.Xmlns('http://www.w3.org/2000/svg'),
      h.Width('24'),
      h.Height('24'),
      h.ViewBox('0 0 24 24'),
      h.Fill('none'),
      h.Stroke('currentColor'),
      h.StrokeWidth('2'),
      h.StrokeLinecap('round'),
      h.StrokeLinejoin('round'),
      h.AriaHidden(true),
    ],
    [h.path([h.D('M12 5v14')], []), h.path([h.D('m19 12-7 7-7-7')], [])],
  )
}

export const MessageScrollerButton = <Message>(
  config: MessageScrollerButtonConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const {
    ariaLabel,
    attributes: customAttributes = [],
    children,
    className,
    direction = 'end',
    isDisabled = false,
    isActive = false,
    type = 'button',
    toView,
    variant = 'secondary',
  } = config

  const attributes = {
    button: [
      h.Type(type),
      h.DataAttribute('slot', 'message-scroller-button'),
      h.DataAttribute('direction', direction),
      h.DataAttribute('active', String(isActive)),
      h.AriaLabel(
        ariaLabel ??
          (direction === 'end' ? 'Scroll to end' : 'Scroll to start'),
      ),
      h.Tabindex(isActive ? 0 : -1),
      ...(isDisabled ? [h.Disabled(true)] : []),
      h.Class(
        ShadcnButton.buttonVariants({
          variant,
          size: 'icon-sm',
          className: messageScrollerButtonClassName(className),
        }),
      ),
      ...customAttributes,
    ],
  }

  return toView === undefined
    ? h.button([...attributes.button], children ?? [arrowDownIcon()])
    : toView(attributes)
}
