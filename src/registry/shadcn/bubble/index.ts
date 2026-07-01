import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'

// MODEL

type Child = Html | string

export const BubbleVariant = S.Union([
  S.Literal('default'),
  S.Literal('secondary'),
  S.Literal('muted'),
  S.Literal('tinted'),
  S.Literal('outline'),
  S.Literal('ghost'),
  S.Literal('destructive'),
])
export type BubbleVariant = typeof BubbleVariant.Type

export const BubbleAlign = S.Union([S.Literal('start'), S.Literal('end')])
export type BubbleAlign = typeof BubbleAlign.Type

export const BubbleReactionSide = S.Union([
  S.Literal('top'),
  S.Literal('bottom'),
])
export type BubbleReactionSide = typeof BubbleReactionSide.Type

export const BubbleReactionAlign = S.Union([
  S.Literal('start'),
  S.Literal('end'),
])
export type BubbleReactionAlign = typeof BubbleReactionAlign.Type

export const bubbleVariantValues: ReadonlyArray<BubbleVariant> = [
  'default',
  'secondary',
  'muted',
  'tinted',
  'outline',
  'ghost',
  'destructive',
]

export const bubbleAlignValues: ReadonlyArray<BubbleAlign> = ['start', 'end']

export const bubbleReactionSideValues: ReadonlyArray<BubbleReactionSide> = [
  'top',
  'bottom',
]

export const bubbleReactionAlignValues: ReadonlyArray<BubbleReactionAlign> = [
  'start',
  'end',
]

export const BubbleStyleOptions = S.Struct({
  className: S.optional(S.String),
  variant: S.optional(BubbleVariant),
  align: S.optional(BubbleAlign),
})
export type BubbleStyleOptions = typeof BubbleStyleOptions.Type

export const BubbleGroupStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type BubbleGroupStyleOptions = typeof BubbleGroupStyleOptions.Type

export const BubbleContentStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type BubbleContentStyleOptions = typeof BubbleContentStyleOptions.Type

export const BubbleReactionsStyleOptions = S.Struct({
  className: S.optional(S.String),
  side: S.optional(BubbleReactionSide),
  align: S.optional(BubbleReactionAlign),
})
export type BubbleReactionsStyleOptions =
  typeof BubbleReactionsStyleOptions.Type

// VIEW

export type BubbleAttributes<Message> = Readonly<{
  bubble: ReadonlyArray<Attribute<Message>>
}>

export type BubbleGroupAttributes<Message> = Readonly<{
  group: ReadonlyArray<Attribute<Message>>
}>

export type BubbleContentAttributes<Message> = Readonly<{
  content: ReadonlyArray<Attribute<Message>>
}>

export type BubbleReactionsAttributes<Message> = Readonly<{
  reactions: ReadonlyArray<Attribute<Message>>
}>

export type ViewConfig<Message> = BubbleStyleOptions &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>
    children?: ReadonlyArray<Child>
    toView?: (attributes: BubbleAttributes<Message>) => Html
  }>

export type BubbleGroupConfig<Message> = BubbleGroupStyleOptions &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>
    children?: ReadonlyArray<Child>
    toView?: (attributes: BubbleGroupAttributes<Message>) => Html
  }>

export type BubbleContentConfig<Message> = BubbleContentStyleOptions &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>
    children?: ReadonlyArray<Child>
    toView?: (attributes: BubbleContentAttributes<Message>) => Html
  }>

export type BubbleReactionsConfig<Message> = BubbleReactionsStyleOptions &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>
    children?: ReadonlyArray<Child>
    toView?: (attributes: BubbleReactionsAttributes<Message>) => Html
  }>

export const bubbleGroupBaseClassName = 'flex min-w-0 flex-col gap-2'

export const bubbleBaseClassName =
  'group/bubble relative flex w-fit max-w-[80%] min-w-0 flex-col gap-1 group-data-[align=end]/message:self-end data-[align=end]:self-end data-[variant=ghost]:max-w-full'

export const bubbleContentBaseClassName =
  'w-fit max-w-full min-w-0 overflow-hidden rounded-3xl border border-transparent px-3 py-2.5 text-sm leading-relaxed wrap-break-word group-data-[align=end]/bubble:self-end [button]:text-left [button,a]:transition-colors [button,a]:outline-none [button,a]:focus-visible:border-ring [button,a]:focus-visible:ring-3 [button,a]:focus-visible:ring-ring/30'

export const bubbleReactionsBaseClassName =
  'absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-sm ring-3 ring-card has-[button]:p-0'

export const bubbleVariantClassNames: Readonly<Record<BubbleVariant, string>> =
  {
    default:
      '*:data-[slot=bubble-content]:bg-primary *:data-[slot=bubble-content]:text-primary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-primary/80',
    secondary:
      '*:data-[slot=bubble-content]:bg-secondary *:data-[slot=bubble-content]:text-secondary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]',
    muted:
      '*:data-[slot=bubble-content]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--muted),var(--foreground)_5%)]',
    tinted:
      '*:data-[slot=bubble-content]:bg-[oklch(from_var(--primary)_0.93_calc(c*0.4)_h)] *:data-[slot=bubble-content]:text-foreground dark:*:data-[slot=bubble-content]:bg-[oklch(from_var(--primary)_0.3_calc(c*0.4)_h)] [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--primary)_0.88_calc(c*0.5)_h)] dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--primary)_0.35_calc(c*0.5)_h)]',
    outline:
      '*:data-[slot=bubble-content]:border-border *:data-[slot=bubble-content]:bg-background [&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-input/30',
    ghost:
      'border-none *:data-[slot=bubble-content]:rounded-none *:data-[slot=bubble-content]:bg-transparent *:data-[slot=bubble-content]:p-0 [&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted/50',
    destructive:
      '*:data-[slot=bubble-content]:bg-destructive/10 *:data-[slot=bubble-content]:text-destructive dark:*:data-[slot=bubble-content]:bg-destructive/20 [&>[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/20 dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/30',
  }

export const bubbleReactionSideClassNames: Readonly<
  Record<BubbleReactionSide, string>
> = {
  top: 'top-0 -translate-y-3/4',
  bottom: 'bottom-0 translate-y-3/4',
}

export const bubbleReactionAlignClassNames: Readonly<
  Record<BubbleReactionAlign, string>
> = {
  start: 'left-3',
  end: 'right-3',
}

export const bubbleClassName = ({
  className,
  variant = 'default',
}: BubbleStyleOptions = {}): string =>
  cn(bubbleBaseClassName, bubbleVariantClassNames[variant], className)

export const bubbleGroupClassName = ({
  className,
}: BubbleGroupStyleOptions = {}): string =>
  cn(bubbleGroupBaseClassName, className)

export const bubbleContentClassName = ({
  className,
}: BubbleContentStyleOptions = {}): string =>
  cn(bubbleContentBaseClassName, className)

export const bubbleReactionsClassName = ({
  align = 'end',
  className,
  side = 'bottom',
}: BubbleReactionsStyleOptions = {}): string =>
  cn(
    bubbleReactionsBaseClassName,
    bubbleReactionSideClassNames[side],
    bubbleReactionAlignClassNames[align],
    className,
  )

const optionalClassAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  className: string,
): ReadonlyArray<Attribute<Message>> =>
  className === '' ? [] : [h.Class(className)]

const bubbleAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): BubbleAttributes<Message> => ({
  bubble: [
    h.DataAttribute('slot', 'bubble'),
    h.DataAttribute('variant', config.variant ?? 'default'),
    h.DataAttribute('align', config.align ?? 'start'),
    ...optionalClassAttribute(h, bubbleClassName(config)),
    ...(config.attributes ?? []),
  ],
})

const bubbleGroupAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: BubbleGroupConfig<Message>,
): BubbleGroupAttributes<Message> => ({
  group: [
    h.DataAttribute('slot', 'bubble-group'),
    ...optionalClassAttribute(h, bubbleGroupClassName(config)),
    ...(config.attributes ?? []),
  ],
})

const bubbleContentAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: BubbleContentConfig<Message>,
): BubbleContentAttributes<Message> => ({
  content: [
    h.DataAttribute('slot', 'bubble-content'),
    ...optionalClassAttribute(h, bubbleContentClassName(config)),
    ...(config.attributes ?? []),
  ],
})

const bubbleReactionsAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: BubbleReactionsConfig<Message>,
): BubbleReactionsAttributes<Message> => ({
  reactions: [
    h.DataAttribute('slot', 'bubble-reactions'),
    h.DataAttribute('align', config.align ?? 'end'),
    h.DataAttribute('side', config.side ?? 'bottom'),
    ...optionalClassAttribute(h, bubbleReactionsClassName(config)),
    ...(config.attributes ?? []),
  ],
})

export const view = <Message>(config: ViewConfig<Message> = {}): Html => {
  const h = html<Message>()
  const attributes = bubbleAttributes(h, config)

  return config.toView === undefined
    ? h.div([...attributes.bubble], config.children ?? [])
    : config.toView(attributes)
}

export const Bubble = view

export const BubbleGroup = <Message>(
  config: BubbleGroupConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes = bubbleGroupAttributes(h, config)

  return config.toView === undefined
    ? h.div([...attributes.group], config.children ?? [])
    : config.toView(attributes)
}

export const BubbleContent = <Message>(
  config: BubbleContentConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes = bubbleContentAttributes(h, config)

  return config.toView === undefined
    ? h.div([...attributes.content], config.children ?? [])
    : config.toView(attributes)
}

export const BubbleReactions = <Message>(
  config: BubbleReactionsConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes = bubbleReactionsAttributes(h, config)

  return config.toView === undefined
    ? h.div([...attributes.reactions], config.children ?? [])
    : config.toView(attributes)
}
