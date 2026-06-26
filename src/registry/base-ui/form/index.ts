import { Array, Predicate, Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import * as Field from '../field'

// MODEL

export const FormValidationMode = S.Union([
  S.Literal('onSubmit'),
  S.Literal('onBlur'),
  S.Literal('onChange'),
])
export type FormValidationMode = typeof FormValidationMode.Type

export const FormMethod = S.Union([
  S.Literal('get'),
  S.Literal('post'),
  S.Literal('dialog'),
])
export type FormMethod = typeof FormMethod.Type

export const FormEncodingType = S.Union([
  S.Literal('application/x-www-form-urlencoded'),
  S.Literal('multipart/form-data'),
  S.Literal('text/plain'),
])
export type FormEncodingType = typeof FormEncodingType.Type

export const FormValue = S.Union([S.String, S.Number, S.Boolean])
export type FormValue = typeof FormValue.Type

export const FormFieldValue = S.Struct({
  name: S.String,
  value: FormValue,
  validation: S.optional(Field.FieldValidation),
  isDisabled: S.optional(S.Boolean),
})
export type FormFieldValue = typeof FormFieldValue.Type

export const FormSubmitPayload = S.Struct({
  reason: S.Literal('none'),
  validationMode: FormValidationMode,
  values: S.Array(FormFieldValue),
  invalidNames: S.Array(S.String),
  isValid: S.Boolean,
})
export type FormSubmitPayload = typeof FormSubmitPayload.Type

export const FormResetPayload = S.Struct({
  reason: S.Literal('none'),
  values: S.Array(FormFieldValue),
})
export type FormResetPayload = typeof FormResetPayload.Type

export const FormOptions = S.Struct({
  id: S.optional(S.String),
  name: S.optional(S.String),
  action: S.optional(S.String),
  method: S.optional(FormMethod),
  encType: S.optional(FormEncodingType),
  target: S.optional(S.String),
  autocomplete: S.optional(S.String),
  noValidate: S.optional(S.Boolean),
  validationMode: S.optional(FormValidationMode),
  fields: S.optional(S.Array(FormFieldValue)),
  isDisabled: S.optional(S.Boolean),
  isSubmitting: S.optional(S.Boolean),
  isSubmitted: S.optional(S.Boolean),
  isInvalid: S.optional(S.Boolean),
})
export type FormOptions = typeof FormOptions.Type

export type FormState = Readonly<{
  validationMode: FormValidationMode
  values: ReadonlyArray<FormFieldValue>
  invalidNames: ReadonlyArray<string>
  isDisabled: boolean
  isSubmitting: boolean
  isSubmitted: boolean
  isInvalid: boolean
  isValid: boolean
}>

// UPDATE

const isFieldInvalid = (field: FormFieldValue): boolean =>
  Field.fieldState({
    name: field.name,
    validation: field.validation,
    isDisabled: field.isDisabled,
  }).isInvalid

export const submittableValues = (
  fields: ReadonlyArray<FormFieldValue> | undefined,
): ReadonlyArray<FormFieldValue> =>
  (fields ?? []).filter(field => field.isDisabled !== true)

export const invalidFieldNames = (
  fields: ReadonlyArray<FormFieldValue> | undefined,
): ReadonlyArray<string> =>
  submittableValues(fields).flatMap(field =>
    isFieldInvalid(field) ? [field.name] : [],
  )

export const valuesByName = (
  fields: ReadonlyArray<FormFieldValue>,
): Readonly<Record<string, FormValue>> =>
  Object.fromEntries(fields.map(field => [field.name, field.value]))

export const formState = (options: FormOptions): FormState => {
  const values = submittableValues(options.fields)
  const invalidNames = invalidFieldNames(options.fields)
  const isInvalid =
    options.isDisabled === true
      ? false
      : options.isInvalid === true ||
        Array.isReadonlyArrayNonEmpty(invalidNames)

  return {
    validationMode: options.validationMode ?? 'onSubmit',
    values,
    invalidNames,
    isDisabled: options.isDisabled === true,
    isSubmitting: options.isSubmitting === true,
    isSubmitted: options.isSubmitted === true,
    isInvalid,
    isValid: !isInvalid,
  }
}

export const submitPayload = (state: FormState): FormSubmitPayload => ({
  reason: 'none',
  validationMode: state.validationMode,
  values: state.values,
  invalidNames: state.invalidNames,
  isValid: state.isValid,
})

export const resetPayload = (state: FormState): FormResetPayload => ({
  reason: 'none',
  values: state.values,
})

// VIEW

export type FormAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  state: FormState
}>

export type ViewConfig<Message> = FormOptions &
  Readonly<{
    toView: (attributes: FormAttributes<Message>) => Html
    onSubmit?: (payload: FormSubmitPayload) => Message
    onReset?: (payload: FormResetPayload) => Message
  }>

const optionalAttribute = <Message>(
  value: string | undefined,
  toAttribute: (value: string) => Attribute<Message>,
): ReadonlyArray<Attribute<Message>> =>
  Predicate.isNotUndefined(value) ? [toAttribute(value)] : []

const optionalBooleanAttribute = <Message>(
  value: boolean,
  toAttribute: (value: boolean) => Attribute<Message>,
): ReadonlyArray<Attribute<Message>> => (value ? [toAttribute(true)] : [])

const booleanDataAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  name: string,
  value: boolean,
): ReadonlyArray<Attribute<Message>> =>
  value ? [h.DataAttribute(name, '')] : []

const formOwnerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<
    ViewConfig<Message>,
    'action' | 'autocomplete' | 'encType' | 'method' | 'target'
  >,
): ReadonlyArray<Attribute<Message>> => [
  ...optionalAttribute<Message>(config.action, value => h.Action(value)),
  ...optionalAttribute<Message>(config.method, value => h.Method(value)),
  ...optionalAttribute<Message>(config.encType, value => h.Enctype(value)),
  ...optionalAttribute<Message>(config.target, value => h.Target(value)),
  ...optionalAttribute<Message>(config.autocomplete, value =>
    h.Autocomplete(value),
  ),
]

const stateDataAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  state: FormState,
): ReadonlyArray<Attribute<Message>> => [
  ...booleanDataAttribute(h, 'disabled', state.isDisabled),
  ...booleanDataAttribute(h, 'valid', state.isValid),
  ...booleanDataAttribute(h, 'invalid', state.isInvalid),
  ...booleanDataAttribute(h, 'submitting', state.isSubmitting),
  ...booleanDataAttribute(h, 'submitted', state.isSubmitted),
]

const eventAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  state: FormState,
): ReadonlyArray<Attribute<Message>> => {
  if (state.isDisabled) {
    return []
  }

  return [
    ...(Predicate.isNotUndefined(config.onSubmit)
      ? [h.OnSubmit(config.onSubmit(submitPayload(state)))]
      : []),
    ...(Predicate.isNotUndefined(config.onReset)
      ? [h.OnReset(config.onReset(resetPayload(state)))]
      : []),
  ]
}

const rootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  state: FormState,
): ReadonlyArray<Attribute<Message>> => [
  ...optionalAttribute<Message>(config.id, value => h.Id(value)),
  ...optionalAttribute<Message>(config.name, value => h.Name(value)),
  ...formOwnerAttributes(h, config),
  ...optionalBooleanAttribute<Message>(config.noValidate !== false, value =>
    h.Novalidate(value),
  ),
  ...stateDataAttributes(h, state),
  ...eventAttributes(h, config, state),
]

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const state = formState(config)

  return config.toView({
    root: rootAttributes(h, config, state),
    state,
  })
}
