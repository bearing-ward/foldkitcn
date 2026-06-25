import { Option, Predicate, Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

// MODEL

export const SwitchCheckedState = S.Union([
  S.Literal('checked'),
  S.Literal('unchecked'),
])
export type SwitchCheckedState = typeof SwitchCheckedState.Type

export const SwitchChangeReason = S.Literal('none')
export type SwitchChangeReason = typeof SwitchChangeReason.Type

export const SwitchCheckedChange = S.Struct({
  isChecked: S.Boolean,
  reason: SwitchChangeReason,
})
export type SwitchCheckedChange = typeof SwitchCheckedChange.Type

export const SwitchOptions = S.Struct({
  id: S.optional(S.String),
  name: S.optional(S.String),
  form: S.optional(S.String),
  value: S.optional(S.String),
  uncheckedValue: S.optional(S.String),
  isChecked: S.Boolean,
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
export type SwitchOptions = typeof SwitchOptions.Type

// UPDATE

export const checkedState = (
  options: Pick<SwitchOptions, 'isChecked'>,
): SwitchCheckedState => (options.isChecked ? 'checked' : 'unchecked')

export const checkedChange = (isChecked: boolean): SwitchCheckedChange => ({
  isChecked,
  reason: 'none',
})

// VIEW

export type SwitchAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  thumb: ReadonlyArray<Attribute<Message>>
  input: ReadonlyArray<Attribute<Message>>
  uncheckedInput: ReadonlyArray<Attribute<Message>>
}>

export type ViewConfig<Message> = SwitchOptions &
  Readonly<{
    toView: (attributes: SwitchAttributes<Message>) => Html
    onCheckedChange?: (change: SwitchCheckedChange) => Message
    onFocus?: Message
    onBlur?: Message
  }>

const activationKeys = new Set(['Enter', ' '])

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
    ViewConfig<Message>,
    | 'isChecked'
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
  h.DataAttribute(checkedState(config), ''),
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
  config: Pick<ViewConfig<unknown>, 'isDisabled' | 'isReadOnly'>,
): boolean => config.isDisabled !== true && config.isReadOnly !== true

const activationMessage = <Message>(
  config: Pick<
    ViewConfig<Message>,
    'isChecked' | 'isDisabled' | 'isReadOnly' | 'onCheckedChange'
  >,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onCheckedChange) && canActivate(config)
    ? Option.some(config.onCheckedChange(checkedChange(!config.isChecked)))
    : Option.none()

const eventAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> =>
  Option.match(activationMessage(config), {
    onNone: () => [],
    onSome: message => [
      h.OnClick(message),
      h.OnKeyDownPreventDefault(key =>
        activationKeys.has(key) ? Option.some(message) : Option.none(),
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
  h.Role('switch'),
  h.AriaChecked(config.isChecked),
  h.Tabindex(config.isDisabled === true ? -1 : 0),
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

const inputAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.Type('checkbox'),
  h.AriaHidden(true),
  h.Tabindex(-1),
  h.Checked(config.isChecked),
  h.Attribute('style', visuallyHiddenInputStyle),
  ...optionalAttribute<Message>(config.id, value => h.Id(value)),
  ...optionalAttribute<Message>(config.name, value => h.Name(value)),
  ...formOwnerAttributes(h, config.form),
  ...inputValueAttributes(h, config.value),
  ...optionalBooleanAttribute<Message>(config.isDisabled, value =>
    h.Disabled(value),
  ),
  ...optionalBooleanAttribute<Message>(config.isRequired, value =>
    h.Required(value),
  ),
  ...Option.match(activationMessage(config), {
    onNone: () => [],
    onSome: message => [h.OnClick(message)],
  }),
]

const uncheckedInputAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => {
  if (
    config.isChecked ||
    config.isDisabled === true ||
    config.name === undefined ||
    config.uncheckedValue === undefined
  ) {
    return []
  }

  return [
    h.Type('hidden'),
    h.Name(config.name),
    h.Value(config.uncheckedValue),
    ...formOwnerAttributes(h, config.form),
  ]
}

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const attributes = stateDataAttributes(h, config)

  return config.toView({
    root: rootAttributes(h, config),
    thumb: attributes,
    input: inputAttributes(h, config),
    uncheckedInput: uncheckedInputAttributes(h, config),
  })
}
