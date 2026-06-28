import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'

// MODEL

export const CardSize = S.Union([S.Literal('default'), S.Literal('sm')])
export type CardSize = typeof CardSize.Type

export const cardSizeValues: ReadonlyArray<CardSize> = ['default', 'sm']

export const CardStyleOptions = S.Struct({
  size: S.optional(CardSize),
  className: S.optional(S.String),
  dir: S.optional(S.String),
})
export type CardStyleOptions = typeof CardStyleOptions.Type

export const CardPartStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type CardPartStyleOptions = typeof CardPartStyleOptions.Type

type Child = Html | string

// VIEW

export type CardContainerConfig<Message> = CardPartStyleOptions &
  Readonly<{
    children?: ReadonlyArray<Child>
    attributes?: ReadonlyArray<Attribute<Message>>
  }>

export type CardConfig<Message> = CardStyleOptions &
  CardContainerConfig<Message>

export const cardBaseClassName =
  'group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl bg-card py-(--card-spacing) text-sm text-card-foreground ring-1 ring-foreground/10 [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl'

export const cardHeaderBaseClassName =
  'group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)'

export const cardTitleBaseClassName =
  'cn-font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm'

export const cardDescriptionBaseClassName = 'text-sm text-muted-foreground'

export const cardActionBaseClassName =
  'col-start-2 row-span-2 row-start-1 self-start justify-self-end'

export const cardContentBaseClassName = 'px-(--card-spacing)'

export const cardFooterBaseClassName =
  'flex items-center rounded-b-xl border-t bg-muted/50 p-(--card-spacing)'

export const cardClassName = ({ className }: CardStyleOptions = {}): string =>
  cn(cardBaseClassName, className)

export const cardHeaderClassName = ({
  className,
}: CardPartStyleOptions = {}): string => cn(cardHeaderBaseClassName, className)

export const cardTitleClassName = ({
  className,
}: CardPartStyleOptions = {}): string => cn(cardTitleBaseClassName, className)

export const cardDescriptionClassName = ({
  className,
}: CardPartStyleOptions = {}): string =>
  cn(cardDescriptionBaseClassName, className)

export const cardActionClassName = ({
  className,
}: CardPartStyleOptions = {}): string => cn(cardActionBaseClassName, className)

export const cardContentClassName = ({
  className,
}: CardPartStyleOptions = {}): string => cn(cardContentBaseClassName, className)

export const cardFooterClassName = ({
  className,
}: CardPartStyleOptions = {}): string => cn(cardFooterBaseClassName, className)

const optionalDir = <Message>(
  h: ReturnType<typeof html<Message>>,
  dir: string | undefined,
): ReadonlyArray<Attribute<Message>> => (dir === undefined ? [] : [h.Dir(dir)])

const containerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  slot: string,
  className: string,
  config: CardContainerConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', slot),
  h.Class(cn(className, config.className)),
  ...(config.attributes ?? []),
]

export const Card = <Message>(config: CardConfig<Message> = {}): Html => {
  const h = html<Message>()
  const size = config.size ?? 'default'

  return h.div(
    [
      h.DataAttribute('slot', 'card'),
      h.DataAttribute('size', size),
      h.Class(cardClassName(config)),
      ...optionalDir(h, config.dir),
      ...(config.attributes ?? []),
    ],
    config.children ?? [],
  )
}

export const CardHeader = <Message>(
  config: CardContainerConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.div(
    [...containerAttributes(h, 'card-header', cardHeaderBaseClassName, config)],
    config.children ?? [],
  )
}

export const CardTitle = <Message>(
  config: CardContainerConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.div(
    [...containerAttributes(h, 'card-title', cardTitleBaseClassName, config)],
    config.children ?? [],
  )
}

export const CardDescription = <Message>(
  config: CardContainerConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.div(
    [
      ...containerAttributes(
        h,
        'card-description',
        cardDescriptionBaseClassName,
        config,
      ),
    ],
    config.children ?? [],
  )
}

export const CardAction = <Message>(
  config: CardContainerConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.div(
    [...containerAttributes(h, 'card-action', cardActionBaseClassName, config)],
    config.children ?? [],
  )
}

export const CardContent = <Message>(
  config: CardContainerConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.div(
    [
      ...containerAttributes(
        h,
        'card-content',
        cardContentBaseClassName,
        config,
      ),
    ],
    config.children ?? [],
  )
}

export const CardFooter = <Message>(
  config: CardContainerConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.div(
    [...containerAttributes(h, 'card-footer', cardFooterBaseClassName, config)],
    config.children ?? [],
  )
}
