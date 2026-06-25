import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'

// MODEL

export const AspectRatioOptions = S.Struct({
  ratio: S.Number,
  className: S.optional(S.String),
})
export type AspectRatioOptions = typeof AspectRatioOptions.Type

// VIEW

export type AspectRatioAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
}>

export type ViewConfig<Message> = AspectRatioOptions &
  Readonly<{
    toView: (attributes: AspectRatioAttributes<Message>) => Html
  }>

export const baseClassName = 'relative aspect-(--ratio)'

export const aspectRatioClassName = ({
  className,
}: Pick<AspectRatioOptions, 'className'> = {}): string =>
  cn(baseClassName, className)

export const aspectRatioStyle = (
  ratio: number,
): Readonly<Record<string, string>> => ({
  '--ratio': String(ratio),
})

export const aspectRatioStyleAttribute = (ratio: number): string =>
  `--ratio: ${String(ratio)};`

const shadcnAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  { className, ratio }: AspectRatioOptions,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'aspect-ratio'),
  h.Attribute('style', aspectRatioStyleAttribute(ratio)),
  h.Class(aspectRatioClassName({ className })),
]

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const { toView, ...options } = config

  return toView({
    root: shadcnAttributes(h, options),
  })
}
