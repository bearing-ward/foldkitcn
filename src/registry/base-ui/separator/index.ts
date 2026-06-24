import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

// MODEL

export const SeparatorOrientation = S.Union([
  S.Literal('horizontal'),
  S.Literal('vertical'),
])
export type SeparatorOrientation = typeof SeparatorOrientation.Type

export const SeparatorOptions = S.Struct({
  orientation: S.optional(SeparatorOrientation),
})
export type SeparatorOptions = typeof SeparatorOptions.Type

// VIEW

export type SeparatorAttributes<Message> = Readonly<{
  separator: ReadonlyArray<Attribute<Message>>
}>

export type ViewConfig<Message> = SeparatorOptions &
  Readonly<{
    toView: (attributes: SeparatorAttributes<Message>) => Html
  }>

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()

  const { orientation = 'horizontal', toView } = config

  return toView({
    separator: [
      h.Role('separator'),
      h.AriaOrientation(orientation),
      h.DataAttribute('orientation', orientation),
    ],
  })
}
