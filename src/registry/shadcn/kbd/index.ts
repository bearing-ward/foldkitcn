import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'

// MODEL

export const KbdStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type KbdStyleOptions = typeof KbdStyleOptions.Type

export const KbdGroupStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type KbdGroupStyleOptions = typeof KbdGroupStyleOptions.Type

// VIEW

export type KbdAttributes<Message> = Readonly<{
  kbd: ReadonlyArray<Attribute<Message>>
}>

export type KbdGroupAttributes<Message> = Readonly<{
  kbdGroup: ReadonlyArray<Attribute<Message>>
}>

export type ViewConfig<Message> = KbdStyleOptions &
  Readonly<{
    toView: (attributes: KbdAttributes<Message>) => Html
  }>

export type GroupViewConfig<Message> = KbdGroupStyleOptions &
  Readonly<{
    toView: (attributes: KbdGroupAttributes<Message>) => Html
  }>

export const kbdBaseClassName =
  "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm bg-muted px-1 font-sans text-xs font-medium text-muted-foreground select-none in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10 [&_svg:not([class*='size-'])]:size-3"

export const kbdGroupBaseClassName = 'inline-flex items-center gap-1'

export const kbdClassName = ({ className }: KbdStyleOptions = {}): string =>
  cn(kbdBaseClassName, className)

export const kbdGroupClassName = ({
  className,
}: KbdGroupStyleOptions = {}): string => cn(kbdGroupBaseClassName, className)

const kbdAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  className: string | undefined,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'kbd'),
  h.Class(kbdClassName({ className })),
]

const groupAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  className: string | undefined,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'kbd-group'),
  h.Class(kbdGroupClassName({ className })),
]

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const { toView, className } = config

  return toView({
    kbd: kbdAttributes(h, className),
  })
}

export const groupView = <Message>(config: GroupViewConfig<Message>): Html => {
  const h = html<Message>()
  const { toView, className } = config

  return toView({
    kbdGroup: groupAttributes(h, className),
  })
}
