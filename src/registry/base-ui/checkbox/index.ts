import { Option, Predicate, Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

// MODEL

export const CheckboxCheckedState = S.Union([
  S.Literal('checked'),
  S.Literal('unchecked'),
  S.Literal('indeterminate'),
])
export type CheckboxCheckedState = typeof CheckboxCheckedState.Type

export const CheckboxChangeReason = S.Literal('none')
export type CheckboxChangeReason = typeof CheckboxChangeReason.Type

export const CheckboxCheckedChange = S.Struct({
  checkedState: CheckboxCheckedState,
  reason: CheckboxChangeReason,
})
export type CheckboxCheckedChange = typeof CheckboxCheckedChange.Type

export const CheckboxOptions = S.Struct({
  id: S.optional(S.String),
  name: S.optional(S.String),
  form: S.optional(S.String),
  value: S.optional(S.String),
  uncheckedValue: S.optional(S.String),
  checkedState: CheckboxCheckedState,
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
export type CheckboxOptions = typeof CheckboxOptions.Type

// UPDATE

export const isChecked = (checkedState: CheckboxCheckedState): boolean =>
  checkedState === 'checked'

export const isIndeterminate = (checkedState: CheckboxCheckedState): boolean =>
  checkedState === 'indeterminate'

export const nextCheckedState = (
  checkedState: CheckboxCheckedState,
): CheckboxCheckedState =>
  checkedState === 'checked' ? 'unchecked' : 'checked'

export const checkedChange = (
  checkedState: CheckboxCheckedState,
): CheckboxCheckedChange => ({
  checkedState,
  reason: 'none',
})

// VIEW

export type CheckboxAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  indicator: ReadonlyArray<Attribute<Message>>
  input: ReadonlyArray<Attribute<Message>>
  uncheckedInput: ReadonlyArray<Attribute<Message>>
}>

export type ViewConfig<Message> = CheckboxOptions &
  Readonly<{
    toView: (attributes: CheckboxAttributes<Message>) => Html
    onCheckedChange?: (change: CheckboxCheckedChange) => Message
    onFocus?: Message
    onBlur?: Message
    keepIndicatorMounted?: boolean
  }>

const activationKeys = new Set([' '])

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

const checkedStateDataAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  checkedState: CheckboxCheckedState,
): ReadonlyArray<Attribute<Message>> =>
  isIndeterminate(checkedState)
    ? [h.DataAttribute('indeterminate', '')]
    : [h.DataAttribute(checkedState, '')]

const stateDataAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<
    ViewConfig<Message>,
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
  ...checkedStateDataAttributes(h, config.checkedState),
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
  !isIndeterminate(config.checkedState)

const activationMessage = <Message>(
  config: Pick<
    ViewConfig<Message>,
    'checkedState' | 'isDisabled' | 'isReadOnly' | 'onCheckedChange'
  >,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onCheckedChange) && canActivate(config)
    ? Option.some(
        config.onCheckedChange(
          checkedChange(nextCheckedState(config.checkedState)),
        ),
      )
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
  h.Role('checkbox'),
  h.AriaChecked(
    isIndeterminate(config.checkedState)
      ? 'mixed'
      : isChecked(config.checkedState),
  ),
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
  h.Checked(isChecked(config.checkedState)),
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
    isChecked(config.checkedState) ||
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

const indicatorAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> =>
  config.keepIndicatorMounted === true || config.checkedState !== 'unchecked'
    ? stateDataAttributes(h, config)
    : []

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()

  return config.toView({
    root: rootAttributes(h, config),
    indicator: indicatorAttributes(h, config),
    input: inputAttributes(h, config),
    uncheckedInput: uncheckedInputAttributes(h, config),
  })
}
