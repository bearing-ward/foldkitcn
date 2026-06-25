import { Predicate, Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

// MODEL

export const InputType = S.String
export type InputType = typeof InputType.Type

export const InputChangeReason = S.Literal('none')
export type InputChangeReason = typeof InputChangeReason.Type

export const InputValueChange = S.Struct({
  value: S.String,
  reason: InputChangeReason,
})
export type InputValueChange = typeof InputValueChange.Type

export const InputOptions = S.Struct({
  id: S.optional(S.String),
  name: S.optional(S.String),
  type: S.optional(InputType),
  value: S.optional(S.Union([S.String, S.Number])),
  placeholder: S.optional(S.String),
  isDisabled: S.optional(S.Boolean),
  isInvalid: S.optional(S.Boolean),
  isRequired: S.optional(S.Boolean),
  isReadOnly: S.optional(S.Boolean),
  isAutofocus: S.optional(S.Boolean),
  isValid: S.optional(S.Boolean),
  isFieldInvalid: S.optional(S.Boolean),
  isDirty: S.optional(S.Boolean),
  isTouched: S.optional(S.Boolean),
  isFilled: S.optional(S.Boolean),
  isFocused: S.optional(S.Boolean),
})
export type InputOptions = typeof InputOptions.Type

// VIEW

export type InputAttributes<Message> = Readonly<{
  input: ReadonlyArray<Attribute<Message>>
}>

export type ViewConfig<Message> = InputOptions &
  Readonly<{
    toView: (attributes: InputAttributes<Message>) => Html
    onValueChange?: (change: InputValueChange) => Message
    onFocus?: Message
    onBlur?: Message
  }>

const booleanAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  name: string,
  value: boolean | undefined,
): ReadonlyArray<Attribute<Message>> =>
  value === true ? [h.Attribute(name, '')] : []

const optionalAttribute = <Message>(
  value: string | undefined,
  toAttribute: (value: string) => Attribute<Message>,
): ReadonlyArray<Attribute<Message>> =>
  Predicate.isNotUndefined(value) ? [toAttribute(value)] : []

const optionalBooleanAttribute = <Message>(
  value: boolean | undefined,
  toAttribute: (value: boolean) => Attribute<Message>,
): ReadonlyArray<Attribute<Message>> =>
  value === true ? [toAttribute(true)] : []

const valueAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  value: string | number | undefined,
): ReadonlyArray<Attribute<Message>> =>
  Predicate.isNotUndefined(value) ? [h.Value(String(value))] : []

const dataStateAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<
    ViewConfig<Message>,
    | 'isDirty'
    | 'isDisabled'
    | 'isFieldInvalid'
    | 'isFilled'
    | 'isFocused'
    | 'isTouched'
    | 'isValid'
  >,
): ReadonlyArray<Attribute<Message>> => [
  ...booleanAttribute(h, 'data-disabled', config.isDisabled),
  ...booleanAttribute(h, 'data-valid', config.isValid),
  ...booleanAttribute(h, 'data-invalid', config.isFieldInvalid),
  ...booleanAttribute(h, 'data-dirty', config.isDirty),
  ...booleanAttribute(h, 'data-touched', config.isTouched),
  ...booleanAttribute(h, 'data-filled', config.isFilled),
  ...booleanAttribute(h, 'data-focused', config.isFocused),
]

const eventAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => {
  const { onValueChange } = config

  return [
    ...(Predicate.isNotUndefined(onValueChange) && !config.isDisabled
      ? [
          h.OnInput(value =>
            onValueChange({
              value,
              reason: 'none',
            }),
          ),
        ]
      : []),
    ...(Predicate.isNotUndefined(config.onFocus)
      ? [h.OnFocus(config.onFocus)]
      : []),
    ...(Predicate.isNotUndefined(config.onBlur)
      ? [h.OnBlur(config.onBlur)]
      : []),
  ]
}

const inputAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  ...optionalAttribute<Message>(config.type, value => h.Type(value)),
  ...optionalAttribute<Message>(config.id, value => h.Id(value)),
  ...optionalAttribute<Message>(config.name, value => h.Name(value)),
  ...optionalAttribute<Message>(config.placeholder, value =>
    h.Placeholder(value),
  ),
  ...valueAttribute(h, config.value),
  ...optionalBooleanAttribute<Message>(config.isDisabled, value =>
    h.Disabled(value),
  ),
  ...optionalBooleanAttribute<Message>(config.isRequired, value =>
    h.Required(value),
  ),
  ...optionalBooleanAttribute<Message>(config.isReadOnly, value =>
    h.Readonly(value),
  ),
  ...optionalBooleanAttribute<Message>(config.isAutofocus, value =>
    h.Autofocus(value),
  ),
  ...(config.isInvalid === true ? [h.AriaInvalid(true)] : []),
  ...dataStateAttributes(h, config),
  ...eventAttributes(h, config),
]

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()

  return config.toView({
    input: inputAttributes(h, config),
  })
}
