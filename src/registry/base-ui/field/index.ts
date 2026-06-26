import { Array, Predicate, Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { ts } from 'foldkit/schema'

// MODEL

export const FieldValidityIssue = S.Literals([
  'badInput',
  'customError',
  'patternMismatch',
  'rangeOverflow',
  'rangeUnderflow',
  'stepMismatch',
  'tooLong',
  'tooShort',
  'typeMismatch',
  'valueMissing',
])
export type FieldValidityIssue = typeof FieldValidityIssue.Type

export const UnknownFieldValidation = ts('UnknownFieldValidation')
export const ValidFieldValidation = ts('ValidFieldValidation', {
  value: S.optional(S.String),
})
export const InvalidFieldValidation = ts('InvalidFieldValidation', {
  error: S.String,
  errors: S.Array(S.String),
  issues: S.Array(FieldValidityIssue),
  value: S.optional(S.String),
})

export const FieldValidation = S.Union([
  UnknownFieldValidation,
  ValidFieldValidation,
  InvalidFieldValidation,
])
export type FieldValidation = typeof FieldValidation.Type

export const FieldOptions = S.Struct({
  id: S.optional(S.String),
  name: S.optional(S.String),
  controlId: S.optional(S.String),
  labelId: S.optional(S.String),
  descriptionId: S.optional(S.String),
  errorId: S.optional(S.String),
  type: S.optional(S.String),
  value: S.optional(S.Union([S.String, S.Number])),
  placeholder: S.optional(S.String),
  validation: S.optional(FieldValidation),
  isDisabled: S.optional(S.Boolean),
  isParentDisabled: S.optional(S.Boolean),
  isRequired: S.optional(S.Boolean),
  isReadOnly: S.optional(S.Boolean),
  isAutofocus: S.optional(S.Boolean),
  isTouched: S.optional(S.Boolean),
  isDirty: S.optional(S.Boolean),
  isFilled: S.optional(S.Boolean),
  isFocused: S.optional(S.Boolean),
  isInvalid: S.optional(S.Boolean),
})
export type FieldOptions = typeof FieldOptions.Type

export const InputValueChange = S.Struct({
  value: S.String,
  reason: S.Literal('none'),
})
export type InputValueChange = typeof InputValueChange.Type

export type FieldValidityData = Readonly<{
  valid: boolean | null
  badInput: boolean
  customError: boolean
  patternMismatch: boolean
  rangeOverflow: boolean
  rangeUnderflow: boolean
  stepMismatch: boolean
  tooLong: boolean
  tooShort: boolean
  typeMismatch: boolean
  valueMissing: boolean
  error: string
  errors: ReadonlyArray<string>
  value: string | undefined
}>

export type FieldState = Readonly<{
  controlId: string | undefined
  descriptionId: string | undefined
  errorId: string | undefined
  labelId: string | undefined
  describedBy: string | undefined
  isDisabled: boolean
  isRequired: boolean
  isInvalid: boolean
  isValid: boolean | null
  isTouched: boolean
  isDirty: boolean
  isFilled: boolean
  isFocused: boolean
  isErrorVisible: boolean
  validityData: FieldValidityData
}>

// UPDATE

const emptyValidityData = (
  validation: FieldValidation | undefined,
): FieldValidityData => ({
  valid: null,
  badInput: false,
  customError: false,
  patternMismatch: false,
  rangeOverflow: false,
  rangeUnderflow: false,
  stepMismatch: false,
  tooLong: false,
  tooShort: false,
  typeMismatch: false,
  valueMissing: false,
  error: '',
  errors: [],
  value:
    validation?._tag === 'ValidFieldValidation' ? validation.value : undefined,
})

export const validityData = (
  validation: FieldValidation | undefined,
): FieldValidityData => {
  if (validation?._tag !== 'InvalidFieldValidation') {
    return validation?._tag === 'ValidFieldValidation'
      ? { ...emptyValidityData(validation), valid: true }
      : emptyValidityData(validation)
  }

  const hasIssue = (issue: FieldValidityIssue): boolean =>
    validation.issues.includes(issue)

  return {
    valid: false,
    badInput: hasIssue('badInput'),
    customError: hasIssue('customError'),
    patternMismatch: hasIssue('patternMismatch'),
    rangeOverflow: hasIssue('rangeOverflow'),
    rangeUnderflow: hasIssue('rangeUnderflow'),
    stepMismatch: hasIssue('stepMismatch'),
    tooLong: hasIssue('tooLong'),
    tooShort: hasIssue('tooShort'),
    typeMismatch: hasIssue('typeMismatch'),
    valueMissing: hasIssue('valueMissing'),
    error: validation.error,
    errors: validation.errors,
    value: validation.value,
  }
}

export const combinedValidityData = (
  validation: FieldValidation | undefined,
  isInvalid: boolean | undefined,
): FieldValidityData => {
  const data = validityData(validation)

  return isInvalid === true ? { ...data, valid: false } : data
}

const derivedId = (
  id: string | undefined,
  suffix: string,
): string | undefined => (id === undefined ? undefined : `${id}-${suffix}`)

const spacedIds = (
  ids: ReadonlyArray<string | undefined>,
): string | undefined => {
  const presentIds = ids.filter((id): id is string => id !== undefined)

  return Array.isReadonlyArrayNonEmpty(presentIds)
    ? presentIds.join(' ')
    : undefined
}

export const fieldState = (options: FieldOptions): FieldState => {
  const data = combinedValidityData(options.validation, options.isInvalid)
  const isDisabled =
    options.isDisabled === true || options.isParentDisabled === true
  const isInvalid = isDisabled ? false : data.valid === false
  const descriptionId =
    options.descriptionId ?? derivedId(options.id, 'description')
  const errorId = options.errorId ?? derivedId(options.id, 'error')
  const isErrorVisible = !isDisabled && isInvalid && errorId !== undefined
  const visibleErrorId = isErrorVisible ? errorId : undefined

  return {
    controlId: options.controlId ?? derivedId(options.id, 'control'),
    descriptionId,
    errorId,
    labelId: options.labelId ?? derivedId(options.id, 'label'),
    describedBy: spacedIds([descriptionId, visibleErrorId]),
    isDisabled,
    isRequired: options.isRequired === true,
    isInvalid,
    isValid: isDisabled ? null : data.valid,
    isTouched: options.isTouched === true,
    isDirty: options.isDirty === true,
    isFilled: options.isFilled === true,
    isFocused: options.isFocused === true,
    isErrorVisible,
    validityData: data,
  }
}

// VIEW

export type FieldAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  item: ReadonlyArray<Attribute<Message>>
  label: ReadonlyArray<Attribute<Message>>
  control: ReadonlyArray<Attribute<Message>>
  description: ReadonlyArray<Attribute<Message>>
  error: ReadonlyArray<Attribute<Message>>
  state: FieldState
}>

export type ViewConfig<Message> = FieldOptions &
  Readonly<{
    toView: (attributes: FieldAttributes<Message>) => Html
    onValueChange?: (change: InputValueChange) => Message
    onFocus?: Message
    onBlur?: Message
  }>

const booleanDataAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  name: string,
  value: boolean,
): ReadonlyArray<Attribute<Message>> =>
  value ? [h.DataAttribute(name, '')] : []

const optionalAttribute = <Message>(
  value: string | undefined,
  toAttribute: (value: string) => Attribute<Message>,
): ReadonlyArray<Attribute<Message>> =>
  Predicate.isNotUndefined(value) ? [toAttribute(value)] : []

const optionalBooleanAttribute = <Message>(
  value: boolean,
  toAttribute: (value: boolean) => Attribute<Message>,
): ReadonlyArray<Attribute<Message>> => (value ? [toAttribute(true)] : [])

const validityAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  state: FieldState,
): ReadonlyArray<Attribute<Message>> => [
  ...booleanDataAttribute(h, 'disabled', state.isDisabled),
  ...booleanDataAttribute(h, 'required', state.isRequired),
  ...booleanDataAttribute(h, 'invalid', state.isInvalid),
  ...booleanDataAttribute(h, 'valid', state.isValid === true),
  ...booleanDataAttribute(h, 'touched', state.isTouched),
  ...booleanDataAttribute(h, 'dirty', state.isDirty),
  ...booleanDataAttribute(h, 'filled', state.isFilled),
  ...booleanDataAttribute(h, 'focused', state.isFocused),
]

const controlEvents = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  state: FieldState,
): ReadonlyArray<Attribute<Message>> => {
  const { onValueChange } = config

  return [
    ...(Predicate.isNotUndefined(onValueChange) && !state.isDisabled
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

const rootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  state: FieldState,
): ReadonlyArray<Attribute<Message>> => [
  h.Role('group'),
  ...optionalAttribute<Message>(config.id, value => h.Id(value)),
  ...validityAttributes(h, state),
]

const itemAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  state: FieldState,
): ReadonlyArray<Attribute<Message>> => [
  h.Role('group'),
  ...validityAttributes(h, state),
]

const labelAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  state: FieldState,
): ReadonlyArray<Attribute<Message>> => [
  ...optionalAttribute<Message>(state.labelId, value => h.Id(value)),
  ...optionalAttribute<Message>(state.controlId, value =>
    h.Attribute('for', value),
  ),
  ...validityAttributes(h, state),
]

const controlAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  state: FieldState,
): ReadonlyArray<Attribute<Message>> => [
  ...optionalAttribute<Message>(state.controlId, value => h.Id(value)),
  ...optionalAttribute<Message>(config.name, value => h.Name(value)),
  ...optionalAttribute<Message>(config.type, value => h.Type(value)),
  ...optionalAttribute<Message>(config.placeholder, value =>
    h.Placeholder(value),
  ),
  ...(config.value === undefined ? [] : [h.Value(String(config.value))]),
  ...optionalAttribute<Message>(state.labelId, value =>
    h.AriaLabelledBy(value),
  ),
  ...optionalAttribute<Message>(state.describedBy, value =>
    h.AriaDescribedBy(value),
  ),
  ...optionalBooleanAttribute<Message>(state.isDisabled, value =>
    h.Disabled(value),
  ),
  ...optionalBooleanAttribute<Message>(state.isRequired, value =>
    h.Required(value),
  ),
  ...optionalBooleanAttribute<Message>(config.isReadOnly === true, value =>
    h.Readonly(value),
  ),
  ...optionalBooleanAttribute<Message>(config.isAutofocus === true, value =>
    h.Autofocus(value),
  ),
  ...(state.isInvalid ? [h.AriaInvalid(true)] : []),
  ...validityAttributes(h, state),
  ...controlEvents(h, config, state),
]

const descriptionAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  state: FieldState,
): ReadonlyArray<Attribute<Message>> => [
  ...optionalAttribute<Message>(state.descriptionId, value => h.Id(value)),
  ...validityAttributes(h, state),
]

const errorAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  state: FieldState,
): ReadonlyArray<Attribute<Message>> => [
  ...optionalAttribute<Message>(state.errorId, value => h.Id(value)),
  ...validityAttributes(h, state),
]

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const state = fieldState(config)

  return config.toView({
    root: rootAttributes(h, config, state),
    item: itemAttributes(h, state),
    label: labelAttributes(h, state),
    control: controlAttributes(h, config, state),
    description: descriptionAttributes(h, state),
    error: errorAttributes(h, state),
    state,
  })
}
