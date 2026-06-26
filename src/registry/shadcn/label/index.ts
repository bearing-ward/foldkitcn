import { Predicate, Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'

// MODEL

export const LabelOptions = S.Struct({
  id: S.optional(S.String),
  for: S.optional(S.String),
  htmlFor: S.optional(S.String),
  dir: S.optional(S.String),
  ariaLabel: S.optional(S.String),
  ariaLabelledBy: S.optional(S.String),
  ariaDescribedBy: S.optional(S.String),
})
export type LabelOptions = typeof LabelOptions.Type

export const LabelStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type LabelStyleOptions = typeof LabelStyleOptions.Type

// VIEW

export type LabelAttributes<Message> = Readonly<{
  label: ReadonlyArray<Attribute<Message>>
}>

export type ViewConfig<Message> = LabelOptions &
  LabelStyleOptions &
  Readonly<{
    toView: (attributes: LabelAttributes<Message>) => Html
  }>

export const labelBaseClassName =
  'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50'

export const labelClassName = ({ className }: LabelStyleOptions = {}): string =>
  cn(labelBaseClassName, className)

const optionalAttribute = <Message>(
  value: string | undefined,
  toAttribute: (value: string) => Attribute<Message>,
): ReadonlyArray<Attribute<Message>> =>
  Predicate.isNotUndefined(value) ? [toAttribute(value)] : []

const labelFor = (
  config: Pick<LabelOptions, 'for' | 'htmlFor'>,
): string | undefined => config.htmlFor ?? config.for

const labelAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'label'),
  h.Class(labelClassName({ className: config.className })),
  ...optionalAttribute<Message>(config.id, value => h.Id(value)),
  ...optionalAttribute<Message>(labelFor(config), value =>
    h.Attribute('for', value),
  ),
  ...optionalAttribute<Message>(config.dir, value => h.Dir(value)),
  ...optionalAttribute<Message>(config.ariaLabel, value => h.AriaLabel(value)),
  ...optionalAttribute<Message>(config.ariaLabelledBy, value =>
    h.AriaLabelledBy(value),
  ),
  ...optionalAttribute<Message>(config.ariaDescribedBy, value =>
    h.AriaDescribedBy(value),
  ),
]

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()

  return config.toView({
    label: labelAttributes(h, config),
  })
}
