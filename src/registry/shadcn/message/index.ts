import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'

// MODEL

type Child = Html | string

export const MessageAlign = S.Union([S.Literal('start'), S.Literal('end')])
export type MessageAlign = typeof MessageAlign.Type

export const MessageRole = S.Union([
  S.Literal('user'),
  S.Literal('assistant'),
  S.Literal('system'),
])
export type MessageRole = typeof MessageRole.Type

export const MessageAvatarPlacement = S.Union([
  S.Literal('start'),
  S.Literal('end'),
])
export type MessageAvatarPlacement = typeof MessageAvatarPlacement.Type

export const messageAlignValues: ReadonlyArray<MessageAlign> = ['start', 'end']

export const messageRoleValues: ReadonlyArray<MessageRole> = [
  'user',
  'assistant',
  'system',
]

export const messageAvatarPlacementValues: ReadonlyArray<MessageAvatarPlacement> =
  ['start', 'end']

export const MessageStyleOptions = S.Struct({
  align: S.optional(MessageAlign),
  role: S.optional(MessageRole),
  className: S.optional(S.String),
})
export type MessageStyleOptions = typeof MessageStyleOptions.Type

export const MessageAvatarStyleOptions = S.Struct({
  placement: S.optional(MessageAvatarPlacement),
  className: S.optional(S.String),
})
export type MessageAvatarStyleOptions = typeof MessageAvatarStyleOptions.Type

export const MessagePartStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type MessagePartStyleOptions = typeof MessagePartStyleOptions.Type

// VIEW

export type MessageGroupAttributes<Message> = Readonly<{
  group: ReadonlyArray<Attribute<Message>>
}>

export type MessageAttributes<Message> = Readonly<{
  message: ReadonlyArray<Attribute<Message>>
}>

export type MessageAvatarAttributes<Message> = Readonly<{
  avatar: ReadonlyArray<Attribute<Message>>
}>

export type MessageContentAttributes<Message> = Readonly<{
  content: ReadonlyArray<Attribute<Message>>
}>

export type MessageHeaderAttributes<Message> = Readonly<{
  header: ReadonlyArray<Attribute<Message>>
}>

export type MessageFooterAttributes<Message> = Readonly<{
  footer: ReadonlyArray<Attribute<Message>>
}>

export type MessageGroupConfig<Message> = MessagePartStyleOptions &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>
    children?: ReadonlyArray<Child>
    toView?: (attributes: MessageGroupAttributes<Message>) => Html
  }>

export type ViewConfig<Message> = MessageStyleOptions &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>
    children?: ReadonlyArray<Child>
    toView?: (attributes: MessageAttributes<Message>) => Html
  }>

export type MessageAvatarConfig<Message> = MessageAvatarStyleOptions &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>
    children?: ReadonlyArray<Child>
    toView?: (attributes: MessageAvatarAttributes<Message>) => Html
  }>

export type MessageContentConfig<Message> = MessagePartStyleOptions &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>
    children?: ReadonlyArray<Child>
    toView?: (attributes: MessageContentAttributes<Message>) => Html
  }>

export type MessageHeaderConfig<Message> = MessagePartStyleOptions &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>
    children?: ReadonlyArray<Child>
    toView?: (attributes: MessageHeaderAttributes<Message>) => Html
  }>

export type MessageFooterConfig<Message> = MessagePartStyleOptions &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>
    children?: ReadonlyArray<Child>
    toView?: (attributes: MessageFooterAttributes<Message>) => Html
  }>

export const messageGroupBaseClassName = 'flex min-w-0 flex-col gap-2'

export const messageBaseClassName =
  'group/message relative flex w-full min-w-0 gap-2 text-sm data-[align=end]:flex-row-reverse'

export const messageRoleClassNames: Readonly<Record<MessageRole, string>> = {
  user: '',
  assistant: '',
  system: 'text-muted-foreground',
}

export const messageAvatarBaseClassName =
  'flex w-fit min-w-8 shrink-0 items-center justify-center self-end overflow-hidden rounded-full bg-muted group-has-data-[slot=message-footer]/message:-translate-y-8'

export const messageAvatarPlacementClassNames: Readonly<
  Record<MessageAvatarPlacement, string>
> = {
  start: '',
  end: 'order-last',
}

export const messageContentBaseClassName =
  'flex w-full min-w-0 flex-col gap-2.5 wrap-break-word group-data-[align=end]/message:*:data-slot:self-end'

export const messageHeaderBaseClassName =
  'flex max-w-full min-w-0 items-center px-3 text-xs font-medium text-muted-foreground group-has-data-[variant=ghost]/message:px-0'

export const messageFooterBaseClassName =
  'flex max-w-full min-w-0 items-center px-3 text-xs font-medium text-muted-foreground group-has-data-[variant=ghost]/message:px-0 group-data-[align=end]/message:justify-end'

export const messageGroupClassName = ({
  className,
}: MessagePartStyleOptions = {}): string =>
  cn(messageGroupBaseClassName, className)

export const messageClassName = ({
  className,
  role = 'assistant',
}: MessageStyleOptions = {}): string =>
  cn(messageBaseClassName, messageRoleClassNames[role], className)

export const messageAvatarClassName = ({
  className,
  placement = 'start',
}: MessageAvatarStyleOptions = {}): string =>
  cn(
    messageAvatarBaseClassName,
    messageAvatarPlacementClassNames[placement],
    className,
  )

export const messageContentClassName = ({
  className,
}: MessagePartStyleOptions = {}): string =>
  cn(messageContentBaseClassName, className)

export const messageHeaderClassName = ({
  className,
}: MessagePartStyleOptions = {}): string =>
  cn(messageHeaderBaseClassName, className)

export const messageFooterClassName = ({
  className,
}: MessagePartStyleOptions = {}): string =>
  cn(messageFooterBaseClassName, className)

const optionalClassAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  className: string,
): ReadonlyArray<Attribute<Message>> =>
  className === '' ? [] : [h.Class(className)]

const messageGroupAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: MessageGroupConfig<Message>,
): MessageGroupAttributes<Message> => ({
  group: [
    h.DataAttribute('slot', 'message-group'),
    ...optionalClassAttribute(h, messageGroupClassName(config)),
    ...(config.attributes ?? []),
  ],
})

const messageAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): MessageAttributes<Message> => ({
  message: [
    h.DataAttribute('slot', 'message'),
    h.DataAttribute('align', config.align ?? 'start'),
    ...optionalClassAttribute(h, messageClassName(config)),
    ...(config.attributes ?? []),
  ],
})

const messageAvatarAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: MessageAvatarConfig<Message>,
): MessageAvatarAttributes<Message> => ({
  avatar: [
    h.DataAttribute('slot', 'message-avatar'),
    ...optionalClassAttribute(h, messageAvatarClassName(config)),
    ...(config.attributes ?? []),
  ],
})

const messageContentAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: MessageContentConfig<Message>,
): MessageContentAttributes<Message> => ({
  content: [
    h.DataAttribute('slot', 'message-content'),
    ...optionalClassAttribute(h, messageContentClassName(config)),
    ...(config.attributes ?? []),
  ],
})

const messageHeaderAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: MessageHeaderConfig<Message>,
): MessageHeaderAttributes<Message> => ({
  header: [
    h.DataAttribute('slot', 'message-header'),
    ...optionalClassAttribute(h, messageHeaderClassName(config)),
    ...(config.attributes ?? []),
  ],
})

const messageFooterAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: MessageFooterConfig<Message>,
): MessageFooterAttributes<Message> => ({
  footer: [
    h.DataAttribute('slot', 'message-footer'),
    ...optionalClassAttribute(h, messageFooterClassName(config)),
    ...(config.attributes ?? []),
  ],
})

export const view = <Message>(config: ViewConfig<Message> = {}): Html => {
  const h = html<Message>()
  const attributes = messageAttributes(h, config)

  return config.toView === undefined
    ? h.div([...attributes.message], config.children ?? [])
    : config.toView(attributes)
}

export const Message = view

export const MessageGroup = <Message>(
  config: MessageGroupConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes = messageGroupAttributes(h, config)

  return config.toView === undefined
    ? h.div([...attributes.group], config.children ?? [])
    : config.toView(attributes)
}

export const MessageAvatar = <Message>(
  config: MessageAvatarConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes = messageAvatarAttributes(h, config)

  return config.toView === undefined
    ? h.div([...attributes.avatar], config.children ?? [])
    : config.toView(attributes)
}

export const MessageContent = <Message>(
  config: MessageContentConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes = messageContentAttributes(h, config)

  return config.toView === undefined
    ? h.div([...attributes.content], config.children ?? [])
    : config.toView(attributes)
}

export const MessageHeader = <Message>(
  config: MessageHeaderConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes = messageHeaderAttributes(h, config)

  return config.toView === undefined
    ? h.div([...attributes.header], config.children ?? [])
    : config.toView(attributes)
}

export const MessageFooter = <Message>(
  config: MessageFooterConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes = messageFooterAttributes(h, config)

  return config.toView === undefined
    ? h.div([...attributes.footer], config.children ?? [])
    : config.toView(attributes)
}
