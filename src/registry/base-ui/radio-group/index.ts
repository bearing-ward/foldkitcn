import { Option, Predicate, Schema as S } from 'effect'
import type { Attribute, Html, KeyboardModifiers } from 'foldkit/html'
import { html } from 'foldkit/html'

// MODEL

export const RadioGroupOrientation = S.Union([
  S.Literal('horizontal'),
  S.Literal('vertical'),
])
export type RadioGroupOrientation = typeof RadioGroupOrientation.Type

export const RadioGroupChangeReason = S.Literal('none')
export type RadioGroupChangeReason = typeof RadioGroupChangeReason.Type

export const RadioGroupValueChange = S.Struct({
  value: S.String,
  reason: RadioGroupChangeReason,
  focusSelector: S.optional(S.String),
})
export type RadioGroupValueChange = typeof RadioGroupValueChange.Type

export const RadioGroupItemDescriptor = S.Struct({
  id: S.optional(S.String),
  value: S.String,
  isDisabled: S.optional(S.Boolean),
  isInvalid: S.optional(S.Boolean),
})
export type RadioGroupItemDescriptor = typeof RadioGroupItemDescriptor.Type

export const RadioGroupOptions = S.Struct({
  id: S.optional(S.String),
  name: S.optional(S.String),
  form: S.optional(S.String),
  value: S.optional(S.String),
  orientation: S.optional(RadioGroupOrientation),
  loop: S.optional(S.Boolean),
  items: S.Array(RadioGroupItemDescriptor),
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
export type RadioGroupOptions = typeof RadioGroupOptions.Type

// UPDATE

export const isChecked = (
  groupValue: string | undefined,
  item: Pick<RadioGroupItemDescriptor, 'value'>,
): boolean => groupValue === item.value

export const checkedState = (
  groupValue: string | undefined,
  item: Pick<RadioGroupItemDescriptor, 'value'>,
): 'checked' | 'unchecked' =>
  isChecked(groupValue, item) ? 'checked' : 'unchecked'

export const valueChange = (
  value: string,
  focusSelector?: string,
): RadioGroupValueChange => ({
  value,
  reason: 'none',
  ...(focusSelector === undefined ? {} : { focusSelector }),
})

export const itemFocusSelector = (
  item: Pick<RadioGroupItemDescriptor, 'id'>,
): string | undefined => (item.id === undefined ? undefined : `#${item.id}`)

// VIEW

export type RadioGroupItemAttributes<Message> = Readonly<{
  item: RadioGroupItemDescriptor
  root: ReadonlyArray<Attribute<Message>>
  indicator: ReadonlyArray<Attribute<Message>>
  input: ReadonlyArray<Attribute<Message>>
}>

export type RadioGroupAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  items: ReadonlyArray<RadioGroupItemAttributes<Message>>
}>

export type ViewConfig<Message> = RadioGroupOptions &
  Readonly<{
    toView: (attributes: RadioGroupAttributes<Message>) => Html
    onValueChange?: (change: RadioGroupValueChange) => Message
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
    RadioGroupOptions,
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

const itemStateDataAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<
    RadioGroupOptions,
    | 'isDirty'
    | 'isDisabled'
    | 'isFieldInvalid'
    | 'isFilled'
    | 'isFocused'
    | 'isReadOnly'
    | 'isRequired'
    | 'isTouched'
    | 'isValid'
    | 'value'
  >,
  item: RadioGroupItemDescriptor,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute(checkedState(config.value, item), ''),
  ...booleanDataAttribute(h, 'disabled', config.isDisabled || item.isDisabled),
  ...booleanDataAttribute(h, 'readonly', config.isReadOnly),
  ...booleanDataAttribute(h, 'required', config.isRequired),
  ...booleanDataAttribute(h, 'valid', config.isValid),
  ...booleanDataAttribute(
    h,
    'invalid',
    config.isFieldInvalid || item.isInvalid,
  ),
  ...booleanDataAttribute(h, 'dirty', config.isDirty),
  ...booleanDataAttribute(h, 'touched', config.isTouched),
  ...booleanDataAttribute(h, 'filled', config.isFilled),
  ...booleanDataAttribute(h, 'focused', config.isFocused),
]

const enabledItems = (
  config: Pick<RadioGroupOptions, 'isDisabled' | 'items'>,
): ReadonlyArray<RadioGroupItemDescriptor> =>
  config.isDisabled === true
    ? []
    : config.items.filter(item => item.isDisabled !== true)

const tabbableValue = (
  config: Pick<RadioGroupOptions, 'isDisabled' | 'items' | 'value'>,
): string | undefined => {
  const enabled = enabledItems(config)
  const checkedEnabledItem = enabled.find(item => item.value === config.value)

  return checkedEnabledItem?.value ?? enabled[0]?.value
}

const canActivateItem = (
  config: Pick<RadioGroupOptions, 'isDisabled' | 'isReadOnly'>,
  item: RadioGroupItemDescriptor,
): boolean =>
  config.isDisabled !== true &&
  config.isReadOnly !== true &&
  item.isDisabled !== true

const activationMessage = <Message>(
  config: Pick<
    ViewConfig<Message>,
    'isDisabled' | 'isReadOnly' | 'onValueChange'
  >,
  item: RadioGroupItemDescriptor,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onValueChange) &&
  canActivateItem(config, item)
    ? Option.some(
        config.onValueChange(valueChange(item.value, itemFocusSelector(item))),
      )
    : Option.none()

const nextIndex = (
  currentIndex: number,
  enabled: ReadonlyArray<RadioGroupItemDescriptor>,
  direction: 'next' | 'previous',
  loop: boolean,
): number | undefined => {
  const offset = direction === 'next' ? 1 : -1
  const candidateIndex = currentIndex + offset

  if (candidateIndex >= 0 && candidateIndex < enabled.length) {
    return candidateIndex
  }

  if (!loop) {
    return undefined
  }

  return direction === 'next' ? 0 : enabled.length - 1
}

const rovingItem = (
  config: Pick<RadioGroupOptions, 'isDisabled' | 'items' | 'loop'>,
  item: RadioGroupItemDescriptor,
  direction: 'next' | 'previous',
): RadioGroupItemDescriptor | undefined => {
  const enabled = enabledItems(config)
  const currentIndex = enabled.findIndex(entry => entry.value === item.value)
  const targetIndex =
    currentIndex === -1
      ? undefined
      : nextIndex(currentIndex, enabled, direction, config.loop ?? true)

  return targetIndex === undefined ? undefined : enabled[targetIndex]
}

const horizontalDirection = (
  key: string,
  dir: string | undefined,
): 'next' | 'previous' | undefined => {
  if (key === 'ArrowRight') {
    return dir === 'rtl' ? 'previous' : 'next'
  }

  if (key === 'ArrowLeft') {
    return dir === 'rtl' ? 'next' : 'previous'
  }

  return undefined
}

const arrowDirection = (
  key: string,
  config: Pick<RadioGroupOptions, 'orientation'> & Readonly<{ dir?: string }>,
): 'next' | 'previous' | undefined => {
  if (key === 'ArrowDown') {
    return 'next'
  }

  if (key === 'ArrowUp') {
    return 'previous'
  }

  if (config.orientation === 'vertical') {
    return undefined
  }

  return horizontalDirection(key, config.dir)
}

const rovingMessage = <Message>(
  config: ViewConfig<Message>,
  item: RadioGroupItemDescriptor,
  key: string,
  modifiers: KeyboardModifiers,
): Option.Option<Message> => {
  if (modifiers.shiftKey) {
    return Option.none()
  }

  const direction = arrowDirection(key, config)

  if (
    direction === undefined ||
    Predicate.isUndefined(config.onValueChange) ||
    !canActivateItem(config, item)
  ) {
    return Option.none()
  }

  const targetItem = rovingItem(config, item, direction)

  return targetItem === undefined
    ? Option.none()
    : Option.some(
        config.onValueChange(
          valueChange(targetItem.value, itemFocusSelector(targetItem)),
        ),
      )
}

const eventAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: RadioGroupItemDescriptor,
): ReadonlyArray<Attribute<Message>> =>
  Option.match(activationMessage(config, item), {
    onNone: () => [],
    onSome: message => [
      h.OnClick(message),
      h.OnKeyUpPreventDefault(key =>
        key === ' ' ? Option.some(message) : Option.none(),
      ),
      h.OnKeyDownPreventDefault((key, modifiers) =>
        rovingMessage(config, item, key, modifiers),
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
  h.Role('radiogroup'),
  ...optionalAttribute<Message>(config.id, value => h.Id(value)),
  ...optionalAttribute<Message>(config.orientation, value =>
    h.AriaOrientation(value),
  ),
  ...optionalBooleanAttribute<Message>(config.isDisabled, value =>
    h.AriaDisabled(value),
  ),
  ...optionalBooleanAttribute<Message>(config.isReadOnly, value =>
    h.AriaReadonly(value),
  ),
  ...optionalBooleanAttribute<Message>(config.isRequired, value =>
    h.AriaRequired(value),
  ),
  ...(config.isInvalid === true ? [h.AriaInvalid(true)] : []),
  ...stateDataAttributes(h, config),
  ...focusAttributes(h, config),
]

const itemTabIndex = (
  config: Pick<RadioGroupOptions, 'isDisabled' | 'items' | 'value'>,
  item: RadioGroupItemDescriptor,
): number => {
  if (item.isDisabled === true || config.isDisabled === true) {
    return -1
  }

  if (tabbableValue(config) === item.value) {
    return 0
  }

  return -1
}

const itemAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: RadioGroupItemDescriptor,
): ReadonlyArray<Attribute<Message>> => [
  h.Role('radio'),
  h.AriaChecked(isChecked(config.value, item)),
  h.Tabindex(itemTabIndex(config, item)),
  ...optionalAttribute<Message>(item.id, value => h.Id(value)),
  ...optionalBooleanAttribute<Message>(
    config.isDisabled === true || item.isDisabled === true ? true : undefined,
    value => h.AriaDisabled(value),
  ),
  ...optionalBooleanAttribute<Message>(config.isReadOnly, value =>
    h.AriaReadonly(value),
  ),
  ...optionalBooleanAttribute<Message>(config.isRequired, value =>
    h.AriaRequired(value),
  ),
  ...(config.isInvalid === true || item.isInvalid === true
    ? [h.AriaInvalid(true)]
    : []),
  ...itemStateDataAttributes(h, config, item),
  ...eventAttributes(h, config, item),
]

const formOwnerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  form: string | undefined,
): ReadonlyArray<Attribute<Message>> =>
  Predicate.isNotUndefined(form) ? [h.Attribute('form', form)] : []

const inputAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: RadioGroupItemDescriptor,
): ReadonlyArray<Attribute<Message>> => [
  h.Type('radio'),
  h.AriaHidden(true),
  h.Tabindex(-1),
  h.Checked(isChecked(config.value, item)),
  h.Value(item.value),
  h.Attribute('style', visuallyHiddenInputStyle),
  ...optionalAttribute<Message>(item.id, value =>
    h.Attribute('id', `${value}-input`),
  ),
  ...optionalAttribute<Message>(config.name, value => h.Name(value)),
  ...formOwnerAttributes(h, config.form),
  ...optionalBooleanAttribute<Message>(
    config.isDisabled === true || item.isDisabled === true ? true : undefined,
    value => h.Disabled(value),
  ),
  ...optionalBooleanAttribute<Message>(config.isReadOnly, value =>
    h.Readonly(value),
  ),
  ...optionalBooleanAttribute<Message>(config.isRequired, value =>
    h.Required(value),
  ),
  ...Option.match(activationMessage(config, item), {
    onNone: () => [],
    onSome: message => [h.OnClick(message)],
  }),
]

const indicatorAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: RadioGroupItemDescriptor,
): ReadonlyArray<Attribute<Message>> =>
  config.keepIndicatorMounted === true || isChecked(config.value, item)
    ? itemStateDataAttributes(h, config, item)
    : []

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()

  return config.toView({
    root: rootAttributes(h, config),
    items: config.items.map(item => ({
      item,
      root: itemAttributes(h, config, item),
      indicator: indicatorAttributes(h, config, item),
      input: inputAttributes(h, config, item),
    })),
  })
}
