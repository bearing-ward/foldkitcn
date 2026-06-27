import { Option, Predicate, Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

// MODEL

export const RadioCheckedState = S.Union([
  S.Literal('checked'),
  S.Literal('unchecked'),
])
export type RadioCheckedState = typeof RadioCheckedState.Type

export const RadioChangeReason = S.Literal('none')
export type RadioChangeReason = typeof RadioChangeReason.Type

export const RadioCheckedChange = S.Struct({
  checkedState: RadioCheckedState,
  reason: RadioChangeReason,
})
export type RadioCheckedChange = typeof RadioCheckedChange.Type

export const RadioOptions = S.Struct({
  id: S.optional(S.String),
  inputId: S.optional(S.String),
  name: S.optional(S.String),
  form: S.optional(S.String),
  value: S.optional(S.String),
  checkedState: RadioCheckedState,
  isDisabled: S.optional(S.Boolean),
  isInvalid: S.optional(S.Boolean),
  isRequired: S.optional(S.Boolean),
  isReadOnly: S.optional(S.Boolean),
  isValid: S.optional(S.Boolean),
  isFieldInvalid: S.optional(S.Boolean),
  isDirty: S.optional(S.Boolean),
  isTouched: S.optional(S.Boolean),
  isFilled: S.optional(S.Boolean),
  isFocused: S.optional(S.Boolean),
})
export type RadioOptions = typeof RadioOptions.Type

// UPDATE

export const isChecked = (checkedState: RadioCheckedState): boolean =>
  checkedState === 'checked'

export const checkedChange = (): RadioCheckedChange => ({
  checkedState: 'checked',
  reason: 'none',
})

// VIEW

export type RadioAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  indicator: ReadonlyArray<Attribute<Message>>
  input: ReadonlyArray<Attribute<Message>>
}>

export type ViewConfig<Message> = RadioOptions &
  Readonly<{
    toView: (attributes: RadioAttributes<Message>) => Html
    onCheckedChange?: (change: RadioCheckedChange) => Message
    onFocus?: Message
    onBlur?: Message
    keepIndicatorMounted?: boolean
  }>

const visuallyHiddenInputStyle =
  'clip-path: inset(50%); overflow: hidden; white-space: nowrap; border: 0px; padding: 0px; width: 1px; height: 1px; margin: -1px; position: fixed; top: 0px; left: 0px;'

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

const booleanDataAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  name: string,
  value: boolean | undefined,
): ReadonlyArray<Attribute<Message>> =>
  value === true ? [h.DataAttribute(name, '')] : []

const stateDataAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<
    RadioOptions,
    | 'checkedState'
    | 'isDirty'
    | 'isDisabled'
    | 'isFieldInvalid'
    | 'isFilled'
    | 'isFocused'
    | 'isReadOnly'
    | 'isRequired'
    | 'isTouched'
    | 'isValid'
  >,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute(config.checkedState, ''),
  ...booleanDataAttribute(h, 'disabled', config.isDisabled),
  ...booleanDataAttribute(h, 'readonly', config.isReadOnly),
  ...booleanDataAttribute(h, 'required', config.isRequired),
  ...booleanDataAttribute(h, 'valid', config.isValid),
  ...booleanDataAttribute(h, 'invalid', config.isFieldInvalid),
  ...booleanDataAttribute(h, 'dirty', config.isDirty),
  ...booleanDataAttribute(h, 'touched', config.isTouched),
  ...booleanDataAttribute(h, 'filled', config.isFilled),
  ...booleanDataAttribute(h, 'focused', config.isFocused),
]

const canActivate = (
  config: Pick<
    ViewConfig<unknown>,
    'checkedState' | 'isDisabled' | 'isReadOnly'
  >,
): boolean =>
  config.isDisabled !== true &&
  config.isReadOnly !== true &&
  !isChecked(config.checkedState)

const activationMessage = <Message>(
  config: Pick<
    ViewConfig<Message>,
    'checkedState' | 'isDisabled' | 'isReadOnly' | 'onCheckedChange'
  >,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onCheckedChange) && canActivate(config)
    ? Option.some(config.onCheckedChange(checkedChange()))
    : Option.none()

const eventAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> =>
  Option.match(activationMessage(config), {
    onNone: () => [h.OnKeyDownPreventDefault(() => Option.none())],
    onSome: message => [
      h.OnClick(message),
      h.OnKeyDownPreventDefault(() => Option.none()),
      h.OnKeyUpPreventDefault(key =>
        key === ' ' ? Option.some(message) : Option.none(),
      ),
    ],
  })

const focusAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ViewConfig<Message>, 'onBlur' | 'onFocus'>,
): ReadonlyArray<Attribute<Message>> => [
  ...(Predicate.isNotUndefined(config.onFocus)
    ? [h.OnFocus(config.onFocus)]
    : []),
  ...(Predicate.isNotUndefined(config.onBlur) ? [h.OnBlur(config.onBlur)] : []),
]

const rootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.Role('radio'),
  h.AriaChecked(isChecked(config.checkedState)),
  h.Tabindex(config.isDisabled === true ? -1 : 0),
  ...optionalAttribute<Message>(config.id, value => h.Id(value)),
  ...(config.isDisabled === true ? [h.AriaDisabled(true)] : []),
  ...optionalBooleanAttribute<Message>(config.isReadOnly, value =>
    h.AriaReadonly(value),
  ),
  ...optionalBooleanAttribute<Message>(config.isRequired, value =>
    h.AriaRequired(value),
  ),
  ...(config.isInvalid === true ? [h.AriaInvalid(true)] : []),
  ...stateDataAttributes(h, config),
  ...eventAttributes(h, config),
  ...focusAttributes(h, config),
]

const inputValueAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  value: string | undefined,
): ReadonlyArray<Attribute<Message>> =>
  Predicate.isNotUndefined(value) ? [h.Value(value)] : []

const formOwnerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  form: string | undefined,
): ReadonlyArray<Attribute<Message>> =>
  Predicate.isNotUndefined(form) ? [h.Attribute('form', form)] : []

const resolvedInputId = (
  config: Pick<RadioOptions, 'id' | 'inputId'>,
): string | undefined =>
  config.inputId ?? (config.id === undefined ? undefined : `${config.id}-input`)

const inputAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.Type('radio'),
  h.AriaHidden(true),
  h.Tabindex(-1),
  h.Checked(isChecked(config.checkedState)),
  h.Attribute('style', visuallyHiddenInputStyle),
  ...optionalAttribute<Message>(resolvedInputId(config), value => h.Id(value)),
  ...optionalAttribute<Message>(config.name, value => h.Name(value)),
  ...formOwnerAttributes(h, config.form),
  ...inputValueAttributes(h, config.value),
  ...optionalBooleanAttribute<Message>(config.isDisabled, value =>
    h.Disabled(value),
  ),
  ...(config.isReadOnly === true ? [h.Attribute('readonly', '')] : []),
  ...optionalBooleanAttribute<Message>(config.isRequired, value =>
    h.Required(value),
  ),
  ...Option.match(activationMessage(config), {
    onNone: () => [],
    onSome: message => [h.OnClick(message)],
  }),
]

const indicatorAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> =>
  config.keepIndicatorMounted === true || isChecked(config.checkedState)
    ? stateDataAttributes(h, config)
    : []

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()

  return config.toView({
    root: rootAttributes(h, config),
    indicator: indicatorAttributes(h, config),
    input: inputAttributes(h, config),
  })
}
