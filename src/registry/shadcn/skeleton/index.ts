import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'

// MODEL

export const SkeletonStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type SkeletonStyleOptions = typeof SkeletonStyleOptions.Type

// VIEW

export type SkeletonAttributes<Message> = Readonly<{
  skeleton: ReadonlyArray<Attribute<Message>>
}>

export type ViewConfig<Message> = SkeletonStyleOptions &
  Readonly<{
    toView: (attributes: SkeletonAttributes<Message>) => Html
  }>

export const baseClassName = 'animate-pulse rounded-md bg-muted'

export const skeletonClassName = ({
  className,
}: SkeletonStyleOptions = {}): string => cn(baseClassName, className)

const shadcnAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  className: string | undefined,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'skeleton'),
  h.Class(skeletonClassName({ className })),
]

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const { toView, className } = config

  return toView({
    skeleton: shadcnAttributes(h, className),
  })
}
