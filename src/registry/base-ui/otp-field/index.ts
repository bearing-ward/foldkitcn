import { Effect, Option, Predicate, Schema as S } from 'effect'
import * as Command from 'foldkit/command'
import * as Dom from 'foldkit/dom'
import type { Attribute, Html, KeyboardModifiers } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'

// MODEL

export const OTPFieldValidationType = S.Literals([
  'numeric',
  'alpha',
  'alphanumeric',
  'none',
])
export type OTPFieldValidationType = typeof OTPFieldValidationType.Type

export const OTPFieldChangeReason = S.Union([
  S.Literal('none'),
  S.Literal('input-change'),
  S.Literal('input-clear'),
  S.Literal('input-paste'),
  S.Literal('keyboard'),
])
export type OTPFieldChangeReason = typeof OTPFieldChangeReason.Type

export const OTPFieldValueChange = S.Struct({
  value: S.String,
  reason: OTPFieldChangeReason,
  index: S.Number,
  isComplete: S.Boolean,
  didRejectCharacters: S.Boolean,
  invalidValue: S.optional(S.String),
  focusSelector: S.optional(S.String),
})
export type OTPFieldValueChange = typeof OTPFieldValueChange.Type

export const OTPFieldFocusChange = S.Struct({
  focused: S.Boolean,
  index: S.Number,
  focusSelector: S.optional(S.String),
})
export type OTPFieldFocusChange = typeof OTPFieldFocusChange.Type

export const OTPFieldOptions = S.Struct({
  id: S.optional(S.String),
  name: S.optional(S.String),
  form: S.optional(S.String),
  length: S.Number,
  value: S.optional(S.String),
  autoComplete: S.optional(S.String),
  inputMode: S.optional(S.String),
  validationType: S.optional(OTPFieldValidationType),
  mask: S.optional(S.Boolean),
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
  focusedIndex: S.optional(S.Number),
  dir: S.optional(S.String),
  ariaLabel: S.optional(S.String),
  ariaLabelledBy: S.optional(S.String),
  ariaDescribedBy: S.optional(S.String),
})
export type OTPFieldOptions = typeof OTPFieldOptions.Type

export type OTPFieldState = Readonly<{
  value: string
  length: number
  activeIndex: number
  isComplete: boolean
  isFilled: boolean
  validationType: OTPFieldValidationType
  inputMode: string | undefined
  slotPattern: string | undefined
  hiddenInputPattern: string | undefined
}>

export type OTPFieldSlotState = Readonly<{
  index: number
  value: string
  id: string | undefined
  isActive: boolean
  isComplete: boolean
  isFilled: boolean
}>

type OTPValidationConfig = Readonly<{
  slotPattern: string
  getRootPattern: (length: number) => string
  regexp: RegExp
  inputMode: 'numeric' | 'text'
}>

// MESSAGE

export const CompletedFocusOTPFieldInput = m('CompletedFocusOTPFieldInput')

export const CommandMessage = S.Union([CompletedFocusOTPFieldInput])
export type CommandMessage = typeof CommandMessage.Type

// UPDATE

const validationConfig: Readonly<
  Record<Exclude<OTPFieldValidationType, 'none'>, OTPValidationConfig>
> = {
  numeric: {
    slotPattern: '\\d{1}',
    getRootPattern: length => `\\d{${length}}`,
    regexp: /[^\d]/gu,
    inputMode: 'numeric',
  },
  alpha: {
    slotPattern: '[a-zA-Z]{1}',
    getRootPattern: length => `[a-zA-Z]{${length}}`,
    regexp: /[^a-zA-Z]/gu,
    inputMode: 'text',
  },
  alphanumeric: {
    slotPattern: '[a-zA-Z0-9]{1}',
    getRootPattern: length => `[a-zA-Z0-9]{${length}}`,
    regexp: /[^a-zA-Z0-9]/gu,
    inputMode: 'text',
  },
}

const positiveLength = (length: number): number =>
  Number.isInteger(length) && length > 0 ? length : 0

const otpValueLength = (value: string): number => [...value].length

const getValidationConfig = (
  validationType: OTPFieldValidationType,
): OTPValidationConfig | undefined =>
  validationType === 'none' ? undefined : validationConfig[validationType]

export const stripOTPWhitespace = (value: string | null | undefined): string =>
  (value ?? '').replaceAll(/\s/gu, '')

const applyOTPValidation = (
  value: string,
  config: OTPValidationConfig | undefined,
): string =>
  config === undefined ? value : value.replaceAll(config.regexp, '')

const clampOTPValue = (
  value: string,
  length: number,
): Readonly<{ value: string; didClamp: boolean }> => {
  const maxLength = positiveLength(length)
  const characters = [...value]

  return {
    value: characters.slice(0, maxLength).join(''),
    didClamp: characters.length > maxLength,
  }
}

export const normalizeOTPValueWithDetails = (
  value: string | null | undefined,
  length: number,
  validationType: OTPFieldValidationType = 'numeric',
  normalizeValue?: ((value: string) => string) | undefined,
): readonly [value: string, didRejectCharacters: boolean] => {
  const strippedValue = stripOTPWhitespace(value)
  const config = getValidationConfig(validationType)
  const validatedValue = applyOTPValidation(strippedValue, config)

  if (normalizeValue === undefined) {
    const clampedValue = clampOTPValue(validatedValue, length)

    return [
      clampedValue.value,
      strippedValue.length > validatedValue.length || clampedValue.didClamp,
    ]
  }

  const customNormalizedValue = normalizeValue(validatedValue)
  const revalidatedValue = applyOTPValidation(customNormalizedValue, config)
  const clampedValue = clampOTPValue(revalidatedValue, length)

  return [
    clampedValue.value,
    strippedValue.length > validatedValue.length ||
      validatedValue.length > customNormalizedValue.length ||
      customNormalizedValue.length > revalidatedValue.length ||
      clampedValue.didClamp,
  ]
}

export const normalizeOTPValue = (
  value: string | null | undefined,
  length: number,
  validationType: OTPFieldValidationType = 'numeric',
  normalizeValue?: ((value: string) => string) | undefined,
): string =>
  normalizeOTPValueWithDetails(value, length, validationType, normalizeValue)[0]

export const replaceOTPValue = (
  currentValue: string,
  index: number,
  nextValue: string,
  length: number,
  validationType: OTPFieldValidationType = 'numeric',
  normalizeValue?: ((value: string) => string) | undefined,
): string => {
  const normalizedValue = normalizeOTPValue(
    nextValue,
    length,
    validationType,
    normalizeValue,
  )
  const currentCharacters = [...currentValue]
  const replacementLength = otpValueLength(normalizedValue)
  const prefix = currentCharacters.slice(0, index).join('')
  const suffix = currentCharacters.slice(index + replacementLength).join('')

  return normalizeOTPValue(
    `${prefix}${normalizedValue}${suffix}`,
    length,
    validationType,
    normalizeValue,
  )
}

export const removeOTPCharacter = (
  currentValue: string,
  index: number,
): string =>
  [...currentValue]
    .filter((_character, characterIndex) => characterIndex !== index)
    .join('')

export const inputId = (
  config: Pick<OTPFieldOptions, 'id'>,
  index: number,
): string | undefined => {
  if (config.id === undefined) {
    return undefined
  }

  if (index === 0) {
    return config.id
  }

  return `${config.id}-${index + 1}`
}

export const hiddenInputId = (
  config: Pick<OTPFieldOptions, 'id' | 'name'>,
): string | undefined =>
  config.id === undefined || config.name !== undefined
    ? undefined
    : `${config.id}-hidden-input`

export const inputFocusSelector = (
  config: Pick<OTPFieldOptions, 'id'>,
  index: number,
): string | undefined => {
  const id = inputId(config, index)

  return id === undefined ? undefined : `#${id}`
}

export const otpFieldState = (
  config: OTPFieldOptions &
    Readonly<{ normalizeValue?: ((value: string) => string) | undefined }>,
): OTPFieldState => {
  const length = positiveLength(config.length)
  const validationType = config.validationType ?? 'numeric'
  const value = normalizeOTPValue(
    config.value,
    length,
    validationType,
    config.normalizeValue,
  )
  const valueLength = otpValueLength(value)
  const lastIndex = Math.max(length - 1, 0)
  const activeIndex =
    config.isFocused === true && config.focusedIndex !== undefined
      ? Math.min(Math.max(config.focusedIndex, 0), lastIndex)
      : Math.min(valueLength, lastIndex)
  const configForValidation = getValidationConfig(validationType)

  return {
    value,
    length,
    activeIndex,
    isComplete: length > 0 && valueLength === length,
    isFilled: value !== '',
    validationType,
    inputMode: config.inputMode ?? configForValidation?.inputMode,
    slotPattern: configForValidation?.slotPattern,
    hiddenInputPattern: configForValidation?.getRootPattern(length),
  }
}

export const otpFieldSlots = (
  config: OTPFieldOptions &
    Readonly<{ normalizeValue?: ((value: string) => string) | undefined }>,
): ReadonlyArray<OTPFieldSlotState> => {
  const state = otpFieldState(config)
  const characters = [...state.value]

  return Array.from({ length: state.length }, (_item, index) => {
    const value = characters[index] ?? ''

    return {
      index,
      value,
      id: inputId(config, index),
      isActive: state.activeIndex === index,
      isComplete: state.isComplete,
      isFilled: value !== '',
    }
  })
}

const changeFromValue = (
  config: OTPFieldOptions &
    Readonly<{ normalizeValue?: ((value: string) => string) | undefined }>,
  index: number,
  value: string,
  reason: OTPFieldChangeReason,
  didRejectCharacters: boolean,
  invalidValue?: string | undefined,
): OTPFieldValueChange => {
  const state = otpFieldState(config)
  const nextValueLength = otpValueLength(value)
  const nextFocusIndex = Math.min(
    Math.max(
      index + Math.max(nextValueLength - otpValueLength(state.value), 1),
      0,
    ),
    Math.max(state.length - 1, 0),
  )

  return {
    value,
    reason,
    index,
    isComplete: state.length > 0 && otpValueLength(value) === state.length,
    didRejectCharacters,
    invalidValue,
    focusSelector:
      value === state.value
        ? undefined
        : inputFocusSelector(config, nextFocusIndex),
  }
}

const inputChangeValue = (
  config: OTPFieldOptions &
    Readonly<{ normalizeValue?: ((value: string) => string) | undefined }>,
  index: number,
  rawValue: string,
  nextCharacters: string,
  state: OTPFieldState,
): string => {
  if (nextCharacters === '') {
    if (rawValue === '') {
      return removeOTPCharacter(state.value, index)
    }

    return state.value
  }

  return replaceOTPValue(
    state.value,
    index,
    nextCharacters,
    state.length,
    state.validationType,
    config.normalizeValue,
  )
}

export const otpFieldInputChange = (
  config: OTPFieldOptions &
    Readonly<{ normalizeValue?: ((value: string) => string) | undefined }>,
  index: number,
  rawValue: string,
): OTPFieldValueChange => {
  const state = otpFieldState(config)
  const slotValue = [...state.value][index] ?? ''
  const [nextCharacters, didRejectCharacters] = normalizeOTPValueWithDetails(
    rawValue,
    state.length,
    state.validationType,
    config.normalizeValue,
  )
  const reason =
    nextCharacters === '' && rawValue === '' ? 'input-clear' : 'input-change'
  const nextValue = inputChangeValue(
    config,
    index,
    rawValue,
    nextCharacters,
    state,
  )

  return {
    ...changeFromValue(
      config,
      index,
      nextValue,
      reason,
      didRejectCharacters,
      didRejectCharacters ? rawValue : undefined,
    ),
    focusSelector:
      nextCharacters === '' || (nextValue === state.value && slotValue !== '')
        ? undefined
        : inputFocusSelector(
            config,
            Math.min(
              index + otpValueLength(nextCharacters),
              Math.max(state.length - 1, 0),
            ),
          ),
  }
}

export const otpFieldPasteChange = (
  config: OTPFieldOptions &
    Readonly<{ normalizeValue?: ((value: string) => string) | undefined }>,
  index: number,
  rawValue: string,
): OTPFieldValueChange => {
  const state = otpFieldState(config)
  const [nextCharacters, didRejectCharacters] = normalizeOTPValueWithDetails(
    rawValue,
    state.length,
    state.validationType,
    config.normalizeValue,
  )
  const nextValue =
    nextCharacters === ''
      ? state.value
      : replaceOTPValue(
          state.value,
          index,
          nextCharacters,
          state.length,
          state.validationType,
          config.normalizeValue,
        )

  return {
    ...changeFromValue(
      config,
      index,
      nextValue,
      'input-paste',
      didRejectCharacters,
      didRejectCharacters ? rawValue : undefined,
    ),
    focusSelector:
      nextCharacters === ''
        ? undefined
        : inputFocusSelector(
            config,
            Math.min(
              index + otpValueLength(nextCharacters),
              Math.max(state.length - 1, 0),
            ),
          ),
  }
}

export const otpFieldFocusChange = (
  config: OTPFieldOptions &
    Readonly<{ normalizeValue?: ((value: string) => string) | undefined }>,
  index: number,
  focused: boolean,
): OTPFieldFocusChange => {
  const state = otpFieldState(config)
  const targetIndex =
    focused && index > otpValueLength(state.value)
      ? Math.min(otpValueLength(state.value), Math.max(state.length - 1, 0))
      : Math.min(Math.max(index, 0), Math.max(state.length - 1, 0))

  return {
    focused,
    index: targetIndex,
    focusSelector:
      focused && targetIndex !== index
        ? inputFocusSelector(config, targetIndex)
        : undefined,
  }
}

export const otpFieldKeyboardFocusChange = (
  config: OTPFieldOptions &
    Readonly<{ normalizeValue?: ((value: string) => string) | undefined }>,
  index: number,
  key: string,
  modifiers: KeyboardModifiers,
): Option.Option<OTPFieldFocusChange> => {
  const state = otpFieldState(config)
  const hasBoundaryModifier =
    (modifiers.ctrlKey || modifiers.metaKey) && !modifiers.altKey
  const isRtl = config.dir === 'rtl'
  const previousKey = isRtl ? 'ArrowRight' : 'ArrowLeft'
  const nextKey = isRtl ? 'ArrowLeft' : 'ArrowRight'
  const lastIndex = Math.max(state.length - 1, 0)
  const endTargetIndex = Math.min(otpValueLength(state.value), lastIndex)
  const slotValue = [...state.value][index] ?? ''

  if (key === previousKey) {
    return Option.some(
      otpFieldFocusChange(
        config,
        hasBoundaryModifier ? 0 : Math.max(0, index - 1),
        true,
      ),
    )
  }

  if (key === nextKey) {
    return Option.some(
      otpFieldFocusChange(
        config,
        hasBoundaryModifier ? endTargetIndex : Math.min(lastIndex, index + 1),
        true,
      ),
    )
  }

  if (key === 'Home' || key === 'ArrowUp') {
    return Option.some(otpFieldFocusChange(config, 0, true))
  }

  if (key === 'End' || key === 'ArrowDown') {
    return Option.some(otpFieldFocusChange(config, endTargetIndex, true))
  }

  if (key.length === 1 && slotValue === key && index < lastIndex) {
    return Option.some(otpFieldFocusChange(config, index + 1, true))
  }

  return Option.none()
}

export const otpFieldKeyboardValueChange = (
  config: OTPFieldOptions &
    Readonly<{ normalizeValue?: ((value: string) => string) | undefined }>,
  index: number,
  key: string,
  modifiers: KeyboardModifiers,
): Option.Option<OTPFieldValueChange> => {
  const state = otpFieldState(config)
  const hasBoundaryModifier =
    (modifiers.ctrlKey || modifiers.metaKey) && !modifiers.altKey

  if (key === 'Backspace' && hasBoundaryModifier) {
    return Option.some(changeFromValue(config, 0, '', 'keyboard', false))
  }

  if (key === 'Delete') {
    return Option.some(
      changeFromValue(
        config,
        index,
        removeOTPCharacter(state.value, index),
        'keyboard',
        false,
      ),
    )
  }

  if (key === 'Backspace') {
    const targetIndex = Math.max(0, index - 1)
    const slotValue = [...state.value][index] ?? ''
    const deleteIndex = slotValue === '' ? targetIndex : index

    return Option.some({
      ...changeFromValue(
        config,
        index,
        removeOTPCharacter(state.value, deleteIndex),
        'keyboard',
        false,
      ),
      focusSelector: inputFocusSelector(config, targetIndex),
    })
  }

  return Option.none()
}

export const FocusOTPFieldInput = Command.define(
  'FocusOTPFieldInput',
  { selector: S.String },
  CompletedFocusOTPFieldInput,
)(({ selector }) =>
  Dom.focus(selector).pipe(
    Effect.ignore,
    Effect.catchCause(() => Effect.void),
    Effect.as(CompletedFocusOTPFieldInput()),
  ),
)

export const commandForValueChange = (
  change: Pick<OTPFieldValueChange, 'focusSelector'>,
): Option.Option<Command.Command<CommandMessage>> =>
  change.focusSelector === undefined
    ? Option.none()
    : Option.some(FocusOTPFieldInput({ selector: change.focusSelector }))

export const commandForFocusChange = (
  change: Pick<OTPFieldFocusChange, 'focusSelector'>,
): Option.Option<Command.Command<CommandMessage>> =>
  change.focusSelector === undefined
    ? Option.none()
    : Option.some(FocusOTPFieldInput({ selector: change.focusSelector }))

// VIEW

export type OTPFieldSlotAttributes<Message> = Readonly<{
  state: OTPFieldSlotState
  input: ReadonlyArray<Attribute<Message>>
}>

export type OTPFieldAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  slots: ReadonlyArray<OTPFieldSlotAttributes<Message>>
  hiddenInput: ReadonlyArray<Attribute<Message>>
  state: OTPFieldState
}>

export type ViewConfig<Message> = OTPFieldOptions &
  Readonly<{
    normalizeValue?: ((value: string) => string) | undefined
    toView: (attributes: OTPFieldAttributes<Message>) => Html
    onValueChange?: (change: OTPFieldValueChange) => Message
    onFocusChange?: (change: OTPFieldFocusChange) => Message
  }>

const visuallyHiddenInputStyle =
  'clip-path: inset(50%); overflow: hidden; white-space: nowrap; border: 0px; padding: 0px; width: 1px; height: 1px; margin: -1px; position: absolute;'

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

const formOwnerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  form: string | undefined,
): ReadonlyArray<Attribute<Message>> =>
  form === undefined ? [] : [h.Attribute('form', form)]

const rootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  state: OTPFieldState,
): ReadonlyArray<Attribute<Message>> => [
  h.Role('group'),
  ...optionalAttribute<Message>(config.ariaLabelledBy, value =>
    h.AriaLabelledBy(value),
  ),
  ...optionalAttribute<Message>(config.ariaDescribedBy, value =>
    h.AriaDescribedBy(value),
  ),
  ...optionalAttribute<Message>(config.dir, value => h.Dir(value)),
  ...booleanDataAttribute(h, 'complete', state.isComplete),
  ...booleanDataAttribute(h, 'disabled', config.isDisabled),
  ...booleanDataAttribute(h, 'readonly', config.isReadOnly),
  ...booleanDataAttribute(h, 'required', config.isRequired),
  ...booleanDataAttribute(h, 'valid', config.isValid),
  ...booleanDataAttribute(h, 'invalid', config.isFieldInvalid),
  ...booleanDataAttribute(h, 'dirty', config.isDirty),
  ...booleanDataAttribute(h, 'touched', config.isTouched),
  ...booleanDataAttribute(h, 'filled', config.isFilled ?? state.isFilled),
  ...booleanDataAttribute(h, 'focused', config.isFocused),
]

const inputEventAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  index: number,
): ReadonlyArray<Attribute<Message>> => {
  const { onValueChange } = config
  const { onFocusChange } = config

  if (config.isDisabled === true) {
    return []
  }

  return [
    ...(onFocusChange === undefined
      ? []
      : [
          h.OnFocus(onFocusChange(otpFieldFocusChange(config, index, true))),
          h.OnBlur(onFocusChange(otpFieldFocusChange(config, index, false))),
          h.OnMouseDown(
            onFocusChange(otpFieldFocusChange(config, index, true)),
          ),
        ]),
    ...(config.isReadOnly === true || onValueChange === undefined
      ? []
      : [
          h.OnInput(value =>
            onValueChange(otpFieldInputChange(config, index, value)),
          ),
          h.OnPastePreventDefault(text =>
            Option.some(
              onValueChange(otpFieldPasteChange(config, index, text)),
            ),
          ),
        ]),
    ...(onFocusChange === undefined && onValueChange === undefined
      ? []
      : [
          h.OnKeyDownPreventDefault((key, modifiers) =>
            Option.match(
              otpFieldKeyboardFocusChange(config, index, key, modifiers),
              {
                onNone: () =>
                  config.isReadOnly === true || onValueChange === undefined
                    ? Option.none()
                    : Option.map(
                        otpFieldKeyboardValueChange(
                          config,
                          index,
                          key,
                          modifiers,
                        ),
                        change => onValueChange(change),
                      ),
                onSome: change =>
                  onFocusChange === undefined
                    ? Option.none()
                    : Option.some(onFocusChange(change)),
              },
            ),
          ),
        ]),
  ]
}

const inputAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  state: OTPFieldState,
  slot: OTPFieldSlotState,
): ReadonlyArray<Attribute<Message>> => [
  h.Type(config.mask === true ? 'password' : 'text'),
  h.Value(slot.value),
  h.InputMode(state.inputMode ?? 'text'),
  h.Autocomplete(
    slot.index === 0 ? (config.autoComplete ?? 'one-time-code') : 'off',
  ),
  h.Autocorrect('off'),
  h.Spellcheck(false),
  h.EnterKeyHint(slot.index === state.length - 1 ? 'done' : 'next'),
  h.Tabindex(slot.isActive ? 0 : -1),
  ...optionalAttribute<Message>(slot.id, value => h.Id(value)),
  ...optionalAttribute<Message>(state.slotPattern, value => h.Pattern(value)),
  ...(slot.index === 0 ? [h.Maxlength(state.length)] : []),
  ...optionalBooleanAttribute<Message>(config.isDisabled, value =>
    h.Disabled(value),
  ),
  ...optionalBooleanAttribute<Message>(config.isRequired, value =>
    h.Required(value),
  ),
  ...optionalBooleanAttribute<Message>(config.isReadOnly, value =>
    h.Readonly(value),
  ),
  ...(config.isInvalid === true ? [h.AriaInvalid(true)] : []),
  ...(config.ariaLabel !== undefined && slot.index !== 0
    ? [h.AriaLabel(config.ariaLabel)]
    : []),
  ...optionalAttribute<Message>(
    config.ariaLabel === undefined ? config.ariaLabelledBy : undefined,
    value => h.AriaLabelledBy(value),
  ),
  ...formOwnerAttributes(h, config.form),
  ...booleanDataAttribute(h, 'complete', slot.isComplete),
  ...booleanDataAttribute(h, 'filled', slot.isFilled),
  ...booleanDataAttribute(h, 'disabled', config.isDisabled),
  ...booleanDataAttribute(h, 'readonly', config.isReadOnly),
  ...booleanDataAttribute(h, 'required', config.isRequired),
  ...booleanDataAttribute(h, 'valid', config.isValid),
  ...booleanDataAttribute(h, 'invalid', config.isFieldInvalid),
  ...booleanDataAttribute(h, 'dirty', config.isDirty),
  ...booleanDataAttribute(h, 'touched', config.isTouched),
  ...booleanDataAttribute(h, 'focused', config.isFocused),
  ...inputEventAttributes(h, config, slot.index),
]

const hiddenInputAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  state: OTPFieldState,
): ReadonlyArray<Attribute<Message>> => [
  h.Type('text'),
  h.Value(state.value),
  h.AriaHidden(true),
  h.Tabindex(-1),
  h.Minlength(state.length),
  h.Maxlength(state.length),
  h.Autocomplete(config.autoComplete ?? 'one-time-code'),
  h.InputMode(state.inputMode ?? 'text'),
  h.Attribute('style', visuallyHiddenInputStyle),
  ...optionalAttribute<Message>(hiddenInputId(config), value => h.Id(value)),
  ...optionalAttribute<Message>(config.name, value => h.Name(value)),
  ...optionalAttribute<Message>(state.hiddenInputPattern, value =>
    h.Pattern(value),
  ),
  ...optionalBooleanAttribute<Message>(config.isDisabled, value =>
    h.Disabled(value),
  ),
  ...optionalBooleanAttribute<Message>(config.isRequired, value =>
    h.Required(value),
  ),
  ...optionalBooleanAttribute<Message>(config.isReadOnly, value =>
    h.Readonly(value),
  ),
  ...formOwnerAttributes(h, config.form),
]

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const state = otpFieldState(config)
  const slots = otpFieldSlots(config)

  return config.toView({
    root: rootAttributes(h, config, state),
    slots: slots.map(slot => ({
      state: slot,
      input: inputAttributes(h, config, state, slot),
    })),
    hiddenInput: hiddenInputAttributes(h, config, state),
    state,
  })
}
