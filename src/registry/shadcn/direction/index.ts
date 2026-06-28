import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'

// MODEL

export const Direction = S.Union([S.Literal('ltr'), S.Literal('rtl')])
export type Direction = typeof Direction.Type

export const directionValues: ReadonlyArray<Direction> = ['ltr', 'rtl']

export const DirectionStyleOptions = S.Struct({
  className: S.optional(S.String),
  direction: S.optional(Direction),
  lang: S.optional(S.String),
})
export type DirectionStyleOptions = typeof DirectionStyleOptions.Type

// VIEW

export type DirectionAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  direction: Direction
}>

export type ViewConfig<Message> = DirectionStyleOptions &
  Readonly<{
    toView: (attributes: DirectionAttributes<Message>) => Html
  }>

export const defaultDirection: Direction = 'ltr'

export const resolvedDirection = (direction?: Direction): Direction =>
  direction ?? defaultDirection

export const isRtl = (direction: Direction): boolean => direction === 'rtl'

export const directionClassName = ({
  className,
}: Pick<DirectionStyleOptions, 'className'> = {}): string => cn(className)

export const directionAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: DirectionStyleOptions = {},
): DirectionAttributes<Message> => {
  const direction = resolvedDirection(config.direction)
  const className = directionClassName(config)

  return {
    direction,
    root: [
      h.Dir(direction),
      h.DataAttribute('direction', direction),
      ...(config.lang === undefined ? [] : [h.Attribute('lang', config.lang)]),
      ...(className === '' ? [] : [h.Class(className)]),
    ],
  }
}

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()

  return config.toView(directionAttributes(h, config))
}

export const DirectionProvider = view
