import {
  Array as EffectArray,
  Option,
  Order,
  Predicate,
  Schema as S,
} from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import * as Checkbox from '../checkbox'

// MODEL

export const CheckboxGroupChangeReason = S.Literal('none')
export type CheckboxGroupChangeReason = typeof CheckboxGroupChangeReason.Type

export const CheckboxGroupValueChange = S.Struct({
  value: S.Array(S.String),
  checkedState: Checkbox.CheckboxCheckedState,
  reason: CheckboxGroupChangeReason,
  changedValue: S.optional(S.String),
})
export type CheckboxGroupValueChange = typeof CheckboxGroupValueChange.Type

export const CheckboxGroupItemDescriptor = S.Struct({
  id: S.optional(S.String),
  value: S.String,
  name: S.optional(S.String),
  isDisabled: S.optional(S.Boolean),
  isInvalid: S.optional(S.Boolean),
  isRequired: S.optional(S.Boolean),
  isReadOnly: S.optional(S.Boolean),
})
export type CheckboxGroupItemDescriptor =
  typeof CheckboxGroupItemDescriptor.Type

export const CheckboxGroupOptions = S.Struct({
  id: S.optional(S.String),
  ariaLabelledBy: S.optional(S.String),
  ariaDescribedBy: S.optional(S.String),
  name: S.optional(S.String),
  form: S.optional(S.String),
  value: S.Array(S.String),
  allValues: S.optional(S.Array(S.String)),
  items: S.Array(CheckboxGroupItemDescriptor),
  hasParent: S.optional(S.Boolean),
  parentId: S.optional(S.String),
  parentName: S.optional(S.String),
  parentValue: S.optional(S.String),
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
export type CheckboxGroupOptions = typeof CheckboxGroupOptions.Type

// UPDATE

export const canonicalValue = (
  value: ReadonlyArray<string>,
  allValues?: ReadonlyArray<string>,
): ReadonlyArray<string> => {
  const unique = [...new Set(value)]

  if (allValues === undefined) {
    return EffectArray.sort(unique, Order.String)
  }

  const allValueSet = new Set(allValues)
  const orderedKnownValues = allValues.filter(entry => unique.includes(entry))
  const orderedExtraValues = EffectArray.sort(
    unique.filter(entry => !allValueSet.has(entry)),
    Order.String,
  )

  return [...orderedKnownValues, ...orderedExtraValues]
}

export const valuesAreEqual = (
  left: ReadonlyArray<string>,
  right: ReadonlyArray<string>,
  allValues?: ReadonlyArray<string>,
): boolean => {
  const canonicalLeft = canonicalValue(left, allValues)
  const canonicalRight = canonicalValue(right, allValues)

  return (
    canonicalLeft.length === canonicalRight.length &&
    canonicalLeft.every((entry, index) => entry === canonicalRight[index])
  )
}

export const isChecked = (
  groupValue: ReadonlyArray<string>,
  item: Pick<CheckboxGroupItemDescriptor, 'value'>,
): boolean => groupValue.includes(item.value)

export const checkedState = (
  groupValue: ReadonlyArray<string>,
  item: Pick<CheckboxGroupItemDescriptor, 'value'>,
): Checkbox.CheckboxCheckedState =>
  isChecked(groupValue, item) ? 'checked' : 'unchecked'

const resolvedAllValues = (
  config: Pick<CheckboxGroupOptions, 'allValues' | 'items'>,
): ReadonlyArray<string> =>
  config.allValues === undefined
    ? config.items.map(item => item.value)
    : config.allValues

export const parentCheckedState = (
  groupValue: ReadonlyArray<string>,
  allValues: ReadonlyArray<string>,
): Checkbox.CheckboxCheckedState => {
  const selectedValueCount = canonicalValue(groupValue, allValues).filter(
    entry => allValues.includes(entry),
  ).length

  if (selectedValueCount === 0) {
    return 'unchecked'
  }

  return selectedValueCount === allValues.length ? 'checked' : 'indeterminate'
}

export const valueChange = (
  value: ReadonlyArray<string>,
  checkedStateValue: Checkbox.CheckboxCheckedState,
  changedValue?: string,
): CheckboxGroupValueChange => ({
  value: [...value],
  checkedState: checkedStateValue,
  reason: 'none',
  ...(changedValue === undefined ? {} : { changedValue }),
})

export const itemValueChange = (
  groupValue: ReadonlyArray<string>,
  allValues: ReadonlyArray<string>,
  item: Pick<CheckboxGroupItemDescriptor, 'value'>,
  nextCheckedState: Checkbox.CheckboxCheckedState,
): CheckboxGroupValueChange => {
  const nextValue =
    nextCheckedState === 'checked'
      ? canonicalValue([...groupValue, item.value], allValues)
      : canonicalValue(
          groupValue.filter(entry => entry !== item.value),
          allValues,
        )

  return valueChange(nextValue, nextCheckedState, item.value)
}

export const parentValueChange = (
  groupValue: ReadonlyArray<string>,
  allValues: ReadonlyArray<string>,
  items: ReadonlyArray<CheckboxGroupItemDescriptor>,
): CheckboxGroupValueChange => {
  const selectedValue = canonicalValue(groupValue, allValues)
  const selectedValueSet = new Set(selectedValue)
  const disabledValueSet = new Set(
    items.filter(item => item.isDisabled === true).map(item => item.value),
  )
  const none = allValues.filter(
    valueEntry =>
      disabledValueSet.has(valueEntry) && selectedValueSet.has(valueEntry),
  )
  const all = allValues.filter(
    valueEntry =>
      !disabledValueSet.has(valueEntry) || selectedValueSet.has(valueEntry),
  )
  const nextValue = valuesAreEqual(selectedValue, all, allValues) ? none : all

  return valueChange(
    canonicalValue(nextValue, allValues),
    parentCheckedState(nextValue, allValues),
  )
}

// VIEW

export type CheckboxGroupItemAttributes<Message> = Readonly<{
  item: CheckboxGroupItemDescriptor
  root: ReadonlyArray<Attribute<Message>>
  indicator: ReadonlyArray<Attribute<Message>>
  input: ReadonlyArray<Attribute<Message>>
}>

export type CheckboxGroupParentAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  indicator: ReadonlyArray<Attribute<Message>>
  input: ReadonlyArray<Attribute<Message>>
}>

export type CheckboxGroupAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  parent: Option.Option<CheckboxGroupParentAttributes<Message>>
  items: ReadonlyArray<CheckboxGroupItemAttributes<Message>>
}>

export type ViewConfig<Message> = CheckboxGroupOptions &
  Readonly<{
    toView: (attributes: CheckboxGroupAttributes<Message>) => Html
    onValueChange?: (change: CheckboxGroupValueChange) => Message
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
  state: Checkbox.CheckboxCheckedState,
): ReadonlyArray<Attribute<Message>> =>
  Checkbox.isIndeterminate(state)
    ? [h.DataAttribute('indeterminate', '')]
    : [h.DataAttribute(state, '')]

const stateDataAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<
    CheckboxGroupOptions,
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

const checkboxStateDataAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<
    CheckboxGroupOptions,
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
  state: Checkbox.CheckboxCheckedState,
  item?: Pick<
    CheckboxGroupItemDescriptor,
    'isDisabled' | 'isInvalid' | 'isReadOnly' | 'isRequired'
  >,
): ReadonlyArray<Attribute<Message>> => [
  ...checkedStateDataAttributes(h, state),
  ...booleanDataAttribute(h, 'disabled', config.isDisabled || item?.isDisabled),
  ...booleanDataAttribute(h, 'readonly', config.isReadOnly || item?.isReadOnly),
  ...booleanDataAttribute(h, 'required', config.isRequired || item?.isRequired),
  ...booleanDataAttribute(h, 'valid', config.isValid),
  ...booleanDataAttribute(
    h,
    'invalid',
    config.isFieldInvalid || item?.isInvalid,
  ),
  ...booleanDataAttribute(h, 'dirty', config.isDirty),
  ...booleanDataAttribute(h, 'touched', config.isTouched),
  ...booleanDataAttribute(h, 'filled', config.isFilled),
  ...booleanDataAttribute(h, 'focused', config.isFocused),
]

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
  h.Role('group'),
  ...optionalAttribute<Message>(config.id, value => h.Id(value)),
  ...optionalAttribute<Message>(config.ariaLabelledBy, value =>
    h.AriaLabelledBy(value),
  ),
  ...optionalAttribute<Message>(config.ariaDescribedBy, value =>
    h.AriaDescribedBy(value),
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

const parentId = (
  config: Pick<CheckboxGroupOptions, 'id' | 'parentId'>,
): string | undefined =>
  config.parentId ??
  (config.id === undefined ? undefined : `${config.id}-parent`)

const childRootId = (
  config: Pick<CheckboxGroupOptions, 'id' | 'parentId'>,
  item: Pick<CheckboxGroupItemDescriptor, 'id' | 'value'>,
): string | undefined => {
  const id = parentId(config)

  return item.id ?? (id === undefined ? undefined : `${id}-${item.value}`)
}

const checkboxAriaChecked = (
  state: Checkbox.CheckboxCheckedState,
): boolean | 'mixed' =>
  Checkbox.isIndeterminate(state) ? 'mixed' : Checkbox.isChecked(state)

const canActivateItem = (
  config: Pick<CheckboxGroupOptions, 'isDisabled' | 'isReadOnly'>,
  item?: Pick<CheckboxGroupItemDescriptor, 'isDisabled' | 'isReadOnly'>,
): boolean =>
  config.isDisabled !== true &&
  config.isReadOnly !== true &&
  item?.isDisabled !== true &&
  item?.isReadOnly !== true

const itemActivationMessage = <Message>(
  config: ViewConfig<Message>,
  item: CheckboxGroupItemDescriptor,
  nextCheckedState: Checkbox.CheckboxCheckedState,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onValueChange) &&
  canActivateItem(config, item)
    ? Option.some(
        config.onValueChange(
          itemValueChange(
            config.value,
            resolvedAllValues(config),
            item,
            nextCheckedState,
          ),
        ),
      )
    : Option.none()

const parentActivationMessage = <Message>(
  config: ViewConfig<Message>,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onValueChange) && canActivateItem(config)
    ? Option.some(
        config.onValueChange(
          parentValueChange(
            config.value,
            resolvedAllValues(config),
            config.items,
          ),
        ),
      )
    : Option.none()

const checkboxEventAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  maybeMessage: Option.Option<Message>,
): ReadonlyArray<Attribute<Message>> =>
  Option.match(maybeMessage, {
    onNone: () => [],
    onSome: message => [
      h.OnClick(message),
      h.OnKeyDownPreventDefault(key =>
        activationKeys.has(key) ? Option.some(message) : Option.none(),
      ),
    ],
  })

const itemAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: CheckboxGroupItemDescriptor,
): ReadonlyArray<Attribute<Message>> => {
  const state = checkedState(config.value, item)

  return [
    h.Role('checkbox'),
    h.AriaChecked(checkboxAriaChecked(state)),
    h.Tabindex(canActivateItem(config, item) ? 0 : -1),
    ...optionalAttribute<Message>(childRootId(config, item), value =>
      h.Id(value),
    ),
    ...optionalBooleanAttribute<Message>(
      config.isDisabled === true || item.isDisabled === true ? true : undefined,
      value => h.AriaDisabled(value),
    ),
    ...optionalBooleanAttribute<Message>(
      config.isReadOnly === true || item.isReadOnly === true ? true : undefined,
      value => h.AriaReadonly(value),
    ),
    ...optionalBooleanAttribute<Message>(
      config.isRequired === true || item.isRequired === true ? true : undefined,
      value => h.AriaRequired(value),
    ),
    ...(config.isInvalid === true || item.isInvalid === true
      ? [h.AriaInvalid(true)]
      : []),
    ...checkboxStateDataAttributes(h, config, state, item),
    ...checkboxEventAttributes(
      h,
      itemActivationMessage(config, item, Checkbox.nextCheckedState(state)),
    ),
  ]
}

const inputName = (
  config: Pick<CheckboxGroupOptions, 'name'>,
  item: Pick<CheckboxGroupItemDescriptor, 'name'>,
): string | undefined => item.name ?? config.name

const formOwnerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  form: string | undefined,
): ReadonlyArray<Attribute<Message>> =>
  Predicate.isNotUndefined(form) ? [h.Attribute('form', form)] : []

const inputAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: CheckboxGroupItemDescriptor,
): ReadonlyArray<Attribute<Message>> => {
  const state = checkedState(config.value, item)
  const maybeMessage = itemActivationMessage(
    config,
    item,
    Checkbox.nextCheckedState(state),
  )

  return [
    h.Type('checkbox'),
    h.AriaHidden(true),
    h.Tabindex(-1),
    h.Checked(Checkbox.isChecked(state)),
    h.Value(item.value),
    h.Attribute('style', visuallyHiddenInputStyle),
    ...optionalAttribute<Message>(childRootId(config, item), value =>
      h.Id(`${value}-input`),
    ),
    ...optionalAttribute<Message>(inputName(config, item), value =>
      h.Name(value),
    ),
    ...formOwnerAttributes(h, config.form),
    ...optionalBooleanAttribute<Message>(
      config.isDisabled === true || item.isDisabled === true ? true : undefined,
      value => h.Disabled(value),
    ),
    ...optionalBooleanAttribute<Message>(
      config.isReadOnly === true || item.isReadOnly === true ? true : undefined,
      value => h.Readonly(value),
    ),
    ...optionalBooleanAttribute<Message>(
      config.isRequired === true || item.isRequired === true ? true : undefined,
      value => h.Required(value),
    ),
    ...Option.match(maybeMessage, {
      onNone: () => [],
      onSome: message => [h.OnClick(message)],
    }),
  ]
}

const indicatorAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  state: Checkbox.CheckboxCheckedState,
  item?: CheckboxGroupItemDescriptor,
): ReadonlyArray<Attribute<Message>> =>
  config.keepIndicatorMounted === true || state !== 'unchecked'
    ? checkboxStateDataAttributes(h, config, state, item)
    : []

const parentControls = (
  config: Pick<CheckboxGroupOptions, 'id' | 'items' | 'parentId'>,
): string | undefined => {
  const ids = config.items
    .map(item => childRootId(config, item))
    .filter(Predicate.isNotUndefined)

  return ids.length === 0 ? undefined : ids.join(' ')
}

const parentRootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => {
  const state = parentCheckedState(config.value, resolvedAllValues(config))

  return [
    h.Role('checkbox'),
    h.AriaChecked(checkboxAriaChecked(state)),
    h.Tabindex(canActivateItem(config) ? 0 : -1),
    h.DataAttribute('parent', ''),
    ...optionalAttribute<Message>(parentId(config), value => h.Id(value)),
    ...optionalAttribute<Message>(parentControls(config), value =>
      h.AriaControls(value),
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
    ...checkboxStateDataAttributes(h, config, state),
    ...checkboxEventAttributes(h, parentActivationMessage(config)),
  ]
}

const parentInputAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => {
  const state = parentCheckedState(config.value, resolvedAllValues(config))
  const maybeMessage = parentActivationMessage(config)

  return [
    h.Type('checkbox'),
    h.AriaHidden(true),
    h.Tabindex(-1),
    h.Checked(Checkbox.isChecked(state)),
    h.Attribute('style', visuallyHiddenInputStyle),
    ...optionalAttribute<Message>(parentId(config), value =>
      h.Id(`${value}-input`),
    ),
    ...optionalAttribute<Message>(config.parentName, value => h.Name(value)),
    ...optionalAttribute<Message>(config.parentValue, value => h.Value(value)),
    ...formOwnerAttributes(h, config.form),
    ...optionalBooleanAttribute<Message>(config.isDisabled, value =>
      h.Disabled(value),
    ),
    ...optionalBooleanAttribute<Message>(config.isReadOnly, value =>
      h.Readonly(value),
    ),
    ...optionalBooleanAttribute<Message>(config.isRequired, value =>
      h.Required(value),
    ),
    ...Option.match(maybeMessage, {
      onNone: () => [],
      onSome: message => [h.OnClick(message)],
    }),
  ]
}

const parentAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): Option.Option<CheckboxGroupParentAttributes<Message>> =>
  config.hasParent === true
    ? Option.some({
        root: parentRootAttributes(h, config),
        indicator: indicatorAttributes(
          h,
          config,
          parentCheckedState(config.value, resolvedAllValues(config)),
        ),
        input: parentInputAttributes(h, config),
      })
    : Option.none()

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()

  return config.toView({
    root: rootAttributes(h, config),
    parent: parentAttributes(h, config),
    items: config.items.map(item => ({
      item,
      root: itemAttributes(h, config, item),
      indicator: indicatorAttributes(
        h,
        config,
        checkedState(config.value, item),
        item,
      ),
      input: inputAttributes(h, config, item),
    })),
  })
}
