import { Predicate, Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

// MODEL

export const FieldsetOptions = S.Struct({
  id: S.optional(S.String),
  name: S.optional(S.String),
  form: S.optional(S.String),
  legendId: S.optional(S.String),
  isDisabled: S.optional(S.Boolean),
  isParentDisabled: S.optional(S.Boolean),
})
export type FieldsetOptions = typeof FieldsetOptions.Type

export const FieldsetPart = S.Union([S.Literal('root'), S.Literal('legend')])
export type FieldsetPart = typeof FieldsetPart.Type

export type FieldsetState = Readonly<{
  isDisabled: boolean
  legendId: string | undefined
}>

// UPDATE

const derivedLegendId = (id: string | undefined): string | undefined =>
  id === undefined ? undefined : `${id}-legend`

export const legendId = (
  options: Pick<FieldsetOptions, 'id' | 'legendId'>,
): string | undefined => options.legendId ?? derivedLegendId(options.id)

export const fieldsetState = (options: FieldsetOptions): FieldsetState => ({
  isDisabled: options.isDisabled === true || options.isParentDisabled === true,
  legendId: legendId(options),
})

// VIEW

export type FieldsetAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  legend: ReadonlyArray<Attribute<Message>>
}>

export type ViewConfig<Message> = FieldsetOptions &
  Readonly<{
    toView: (attributes: FieldsetAttributes<Message>) => Html
  }>

const optionalAttribute = <Message>(
  value: string | undefined,
  toAttribute: (value: string) => Attribute<Message>,
): ReadonlyArray<Attribute<Message>> =>
  Predicate.isNotUndefined(value) ? [toAttribute(value)] : []

const booleanDataAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  name: string,
  value: boolean,
): ReadonlyArray<Attribute<Message>> =>
  value ? [h.DataAttribute(name, '')] : []

const disabledAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  isDisabled: boolean,
): ReadonlyArray<Attribute<Message>> => (isDisabled ? [h.Disabled(true)] : [])

const ariaLabelledByAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  id: string | undefined,
): ReadonlyArray<Attribute<Message>> =>
  id === undefined ? [] : [h.AriaLabelledBy(id)]

const formOwnerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  form: string | undefined,
): ReadonlyArray<Attribute<Message>> =>
  form === undefined ? [] : [h.Attribute('form', form)]

const rootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  state: FieldsetState,
): ReadonlyArray<Attribute<Message>> => [
  ...optionalAttribute<Message>(config.id, value => h.Id(value)),
  ...optionalAttribute<Message>(config.name, value => h.Name(value)),
  ...formOwnerAttributes(h, config.form),
  ...ariaLabelledByAttribute(h, state.legendId),
  ...disabledAttribute(h, state.isDisabled),
  ...booleanDataAttribute(h, 'disabled', state.isDisabled),
]

const legendAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  state: FieldsetState,
): ReadonlyArray<Attribute<Message>> => [
  ...optionalAttribute<Message>(state.legendId, value => h.Id(value)),
  ...booleanDataAttribute(h, 'disabled', state.isDisabled),
]

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const state = fieldsetState(config)

  return config.toView({
    root: rootAttributes(h, config, state),
    legend: legendAttributes(h, state),
  })
}
