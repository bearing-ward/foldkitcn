import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'

// MODEL

export const SpinnerStyleOptions = S.Struct({
  className: S.optional(S.String),
  ariaLabel: S.optional(S.String),
})
export type SpinnerStyleOptions = typeof SpinnerStyleOptions.Type

// VIEW

export type SpinnerAttributes<Message> = Readonly<{
  spinner: ReadonlyArray<Attribute<Message>>
}>

export type ViewConfig<Message> = SpinnerStyleOptions &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>
    toView?: (attributes: SpinnerAttributes<Message>) => Html
  }>

export const spinnerIconClassName = 'lucide lucide-loader-circle'
export const spinnerBaseClassName = 'size-4 animate-spin'
export const spinnerPath = 'M21 12a9 9 0 1 1-6.219-8.56'

export const spinnerClassName = ({
  className,
}: SpinnerStyleOptions = {}): string =>
  cn(spinnerIconClassName, spinnerBaseClassName, className)

const spinnerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.Xmlns('http://www.w3.org/2000/svg'),
  h.Width('24'),
  h.Height('24'),
  h.ViewBox('0 0 24 24'),
  h.Fill('none'),
  h.Stroke('currentColor'),
  h.StrokeWidth('2'),
  h.StrokeLinecap('round'),
  h.StrokeLinejoin('round'),
  h.Class(spinnerClassName(config)),
  h.DataAttribute('slot', 'spinner'),
  h.Role('status'),
  h.AriaLabel(config.ariaLabel ?? 'Loading'),
  ...(config.attributes ?? []),
]

export const view = <Message>(config: ViewConfig<Message> = {}): Html => {
  const h = html<Message>()
  const attributes = { spinner: spinnerAttributes(h, config) }

  if (config.toView !== undefined) {
    return config.toView(attributes)
  }

  return h.svg([...attributes.spinner], [h.path([h.D(spinnerPath)], [])])
}

export const Spinner = view
