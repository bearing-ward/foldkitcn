import { Option, Predicate, Schema as S } from 'effect'
import type { Attribute, Html, KeyboardModifiers } from 'foldkit/html'
import { html } from 'foldkit/html'
import { ts } from 'foldkit/schema'

// MODEL

const NumberFormatStyle = S.Union([
  S.Literal('decimal'),
  S.Literal('percent'),
  S.Literal('currency'),
  S.Literal('unit'),
])
export type NumberFormatStyle = typeof NumberFormatStyle.Type

const NumberFormatCurrencyDisplay = S.Union([
  S.Literal('symbol'),
  S.Literal('narrowSymbol'),
  S.Literal('code'),
  S.Literal('name'),
])

const NumberFormatUnitDisplay = S.Union([
  S.Literal('short'),
  S.Literal('long'),
  S.Literal('narrow'),
])

const NumberFormatNotation = S.Union([
  S.Literal('standard'),
  S.Literal('scientific'),
  S.Literal('engineering'),
  S.Literal('compact'),
])

const NumberFormatSignDisplay = S.Union([
  S.Literal('auto'),
  S.Literal('never'),
  S.Literal('always'),
  S.Literal('exceptZero'),
])

const NumberFormatRoundingMode = S.Union([
  S.Literal('ceil'),
  S.Literal('floor'),
  S.Literal('expand'),
  S.Literal('trunc'),
  S.Literal('halfCeil'),
  S.Literal('halfFloor'),
  S.Literal('halfExpand'),
  S.Literal('halfTrunc'),
  S.Literal('halfEven'),
])

const NumberFormatRoundingPriority = S.Union([
  S.Literal('auto'),
  S.Literal('morePrecision'),
  S.Literal('lessPrecision'),
])

export const NumberFieldFormatOptions = S.Struct({
  style: S.optional(NumberFormatStyle),
  currency: S.optional(S.String),
  currencyDisplay: S.optional(NumberFormatCurrencyDisplay),
  unit: S.optional(S.String),
  unitDisplay: S.optional(NumberFormatUnitDisplay),
  notation: S.optional(NumberFormatNotation),
  signDisplay: S.optional(NumberFormatSignDisplay),
  useGrouping: S.optional(S.Boolean),
  minimumFractionDigits: S.optional(S.Number),
  maximumFractionDigits: S.optional(S.Number),
  minimumSignificantDigits: S.optional(S.Number),
  maximumSignificantDigits: S.optional(S.Number),
  roundingIncrement: S.optional(S.Number),
  roundingMode: S.optional(NumberFormatRoundingMode),
  roundingPriority: S.optional(NumberFormatRoundingPriority),
})
export type NumberFieldFormatOptions = typeof NumberFieldFormatOptions.Type &
  NumberFormatOptionsWithRounding

export const NumberFieldConstraints = S.Struct({
  min: S.optional(S.Number),
  max: S.optional(S.Number),
  step: S.optional(S.Union([S.Number, S.Literal('any')])),
  smallStep: S.optional(S.Number),
  largeStep: S.optional(S.Number),
  snapOnStep: S.optional(S.Boolean),
  allowOutOfRange: S.optional(S.Boolean),
})
export type NumberFieldConstraints = typeof NumberFieldConstraints.Type

export const NumberFieldParsed = ts('Parsed', {
  value: S.Number,
  textValue: S.String,
})
export const NumberFieldEmpty = ts('Empty', { textValue: S.String })
export const NumberFieldInvalid = ts('Invalid', { textValue: S.String })

export const NumberFieldValueState = S.Union([
  NumberFieldParsed,
  NumberFieldEmpty,
  NumberFieldInvalid,
])
export type NumberFieldValueState = typeof NumberFieldValueState.Type

export const NumberFieldChangeReason = S.Union([
  S.Literal('none'),
  S.Literal('input-change'),
  S.Literal('input-clear'),
  S.Literal('input-blur'),
  S.Literal('input-paste'),
  S.Literal('increment-press'),
  S.Literal('decrement-press'),
  S.Literal('keyboard'),
  S.Literal('scrub'),
  S.Literal('wheel'),
])
export type NumberFieldChangeReason = typeof NumberFieldChangeReason.Type

export const NumberFieldValueChange = S.Struct({
  value: S.Union([S.Number, S.Null]),
  textValue: S.String,
  state: NumberFieldValueState,
  reason: NumberFieldChangeReason,
})
export type NumberFieldValueChange = typeof NumberFieldValueChange.Type

export const NumberFieldOptions = S.Struct({
  id: S.optional(S.String),
  inputId: S.optional(S.String),
  labelId: S.optional(S.String),
  name: S.optional(S.String),
  form: S.optional(S.String),
  value: S.optional(S.Union([S.Number, S.Null])),
  textValue: S.optional(S.String),
  locale: S.optional(S.String),
  format: S.optional(NumberFieldFormatOptions),
  min: S.optional(S.Number),
  max: S.optional(S.Number),
  step: S.optional(S.Union([S.Number, S.Literal('any')])),
  smallStep: S.optional(S.Number),
  largeStep: S.optional(S.Number),
  snapOnStep: S.optional(S.Boolean),
  allowOutOfRange: S.optional(S.Boolean),
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
  isScrubbing: S.optional(S.Boolean),
})
export type NumberFieldOptions = typeof NumberFieldOptions.Type

export type NumberFieldState = Readonly<{
  value: number | null
  textValue: string
  valueState: NumberFieldValueState
  min: number
  max: number
  step: number
  smallStep: number
  largeStep: number
  inputId: string
  hiddenInputId: string
  isInputInvalid: boolean
  isIncrementDisabled: boolean
  isDecrementDisabled: boolean
}>

// UPDATE

type NumberFormatOptionsWithRounding = Intl.NumberFormatOptions & {
  readonly roundingIncrement?: number | undefined
  readonly roundingMode?: string | undefined
  readonly roundingPriority?: string | undefined
}

const defaultMin = Number.MIN_SAFE_INTEGER
const defaultMax = Number.MAX_SAFE_INTEGER
const defaultStep = 1
const defaultSmallStep = 0.1
const defaultLargeStep = 10
const floatingPointCleanupFactor = 1e-10
const maxFloatingPointCleanupDelta = 1e-10

const hanNumerals = [
  '零',
  '〇',
  '一',
  '二',
  '三',
  '四',
  '五',
  '六',
  '七',
  '八',
  '九',
]
const hanNumeralToDigit: Readonly<Record<string, string>> = {
  零: '0',
  〇: '0',
  一: '1',
  二: '2',
  三: '3',
  四: '4',
  五: '5',
  六: '6',
  七: '7',
  八: '8',
  九: '9',
}
const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
const persianNumerals = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
const fullwidthNumerals = [
  '０',
  '１',
  '２',
  '３',
  '４',
  '５',
  '６',
  '７',
  '８',
  '９',
]
const percentages = ['%', '٪', '％', '﹪']
const permille = ['‰', '؉']
const unicodeMinusSigns = ['−', '－', '‒', '–', '—', '﹣']
const unicodePlusSigns = ['＋', '﹢']
const baseNonNumericSymbols = ['.', ',', '．', '，', '٫', '٬']

const arabicRe = new RegExp(`[${arabicNumerals.join('')}]`, 'gu')
const persianRe = new RegExp(`[${persianNumerals.join('')}]`, 'gu')
const fullwidthRe = new RegExp(`[${fullwidthNumerals.join('')}]`, 'gu')
const hanRe = new RegExp(`[${hanNumerals.join('')}]`, 'gu')
const arabicDetectRe = new RegExp(`[${arabicNumerals.join('')}]`, 'u')
const persianDetectRe = new RegExp(`[${persianNumerals.join('')}]`, 'u')
const fullwidthDetectRe = new RegExp(`[${fullwidthNumerals.join('')}]`, 'u')
const hanDetectRe = new RegExp(`[${hanNumerals.join('')}]`, 'u')
const percentRe = new RegExp(`[${percentages.join('')}]`, 'u')
const percentGlobalRe = new RegExp(percentRe.source, 'gu')
const permilleRe = new RegExp(`[${permille.join('')}]`, 'u')
const permilleGlobalRe = new RegExp(permilleRe.source, 'gu')
const spaceSeparatorRe = /\p{Zs}/u

const escapeRegExp = (value: string): string =>
  value.replaceAll(/[.*+?^${}()|[\]\\]/gu, '\\$&')

const escapeClassChar = (value: string): string =>
  value.replaceAll(/[-\\\]^]/gu, match => `\\${match}`)

const charClassFrom = (chars: ReadonlyArray<string>): string =>
  `[${chars.map(escapeClassChar).join('')}]`

const anyMinusClass = charClassFrom(['-', ...unicodeMinusSigns])
const anyPlusClass = charClassFrom(['+', ...unicodePlusSigns])
const anyMinusRe = new RegExp(anyMinusClass, 'gu')
const anyPlusRe = new RegExp(anyPlusClass, 'gu')
const anyMinusDetectRe = new RegExp(anyMinusClass, 'u')
const anyPlusDetectRe = new RegExp(anyPlusClass, 'u')

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(value, max))

const shiftDecimal = (value: number, exponentDelta: number): number => {
  const [coefficient, exponent = '0'] = String(value).split('e')

  return Number(`${coefficient}e${Number(exponent) + exponentDelta}`)
}

const getFormatter = (
  locale?: string,
  options?: NumberFormatOptionsWithRounding,
): Intl.NumberFormat => new Intl.NumberFormat(locale, options)

export const formatNumber = (
  value: number | null,
  locale?: string,
  options?: NumberFormatOptionsWithRounding,
): string => (value === null ? '' : getFormatter(locale, options).format(value))

export const getNumberLocaleDetails = (
  locale?: string,
  options?: NumberFormatOptionsWithRounding,
): Partial<Record<Intl.NumberFormatPartTypes, string | undefined>> => {
  const result: Partial<
    Record<Intl.NumberFormatPartTypes, string | undefined>
  > = {}

  getFormatter(locale, options)
    .formatToParts(11_111.1)
    .map(part => {
      result[part.type] = part.value

      return part
    })

  getFormatter(locale)
    .formatToParts(0.1)
    .map(part => {
      if (part.type === 'decimal') {
        result[part.type] = part.value
      }

      return part
    })

  return result
}

const isNumeralChar = (char: string): boolean =>
  (char >= '0' && char <= '9') ||
  arabicDetectRe.test(char) ||
  persianDetectRe.test(char) ||
  hanDetectRe.test(char) ||
  fullwidthDetectRe.test(char)

const unitRegex = (
  locale?: string,
  options?: NumberFormatOptionsWithRounding,
): RegExp | null => {
  const unitParts = getFormatter(locale, options)
    .formatToParts(1)
    .filter(part => part.type === 'unit')
    .map(part => escapeRegExp(part.value))

  return unitParts.length === 0 ? null : new RegExp(unitParts.join('|'), 'gu')
}

const groupRegex = (group: string | undefined): RegExp | null => {
  if (group === undefined) {
    return null
  }

  if (spaceSeparatorRe.test(group)) {
    return /\p{Zs}/gu
  }

  if (group === "'" || group === '’') {
    return /['’]/gu
  }

  return new RegExp(escapeRegExp(group), 'gu')
}

const localeFromInput = (
  input: string,
  locale: string | undefined,
): string | undefined => {
  if (locale !== undefined) {
    return locale
  }

  if (arabicDetectRe.test(input) || persianDetectRe.test(input)) {
    return 'ar'
  }

  if (hanDetectRe.test(input)) {
    return 'zh'
  }

  return undefined
}

const signedInput = (
  normalizedInput: string,
): Readonly<{ input: string; isNegative: boolean }> => {
  const trailing = normalizedInput.match(/(?<sign>[+-])\s*$/u)
  const withoutTrailing =
    trailing === null
      ? normalizedInput
      : normalizedInput.replace(/(?<sign>[+-])\s*$/u, '')
  const leading = withoutTrailing.match(/^\s*(?<sign>[+-])/u)
  const input =
    leading === null
      ? withoutTrailing
      : withoutTrailing.replace(/^\s*(?<sign>[+-])/u, '')

  return {
    input,
    isNegative: trailing?.groups?.sign === '-' || leading?.groups?.sign === '-',
  }
}

export const parseNumber = (
  formattedNumber: string,
  locale?: string,
  options?: NumberFormatOptionsWithRounding,
): number | null => {
  const normalizedInput = String(formattedNumber)
    .replaceAll(/\p{Cf}/gu, '')
    .trim()
    .replaceAll(anyMinusRe, '-')
    .replaceAll(anyPlusRe, '+')
  const { input, isNegative } = signedInput(normalizedInput)
  const computedLocale = localeFromInput(input, locale)
  const { group, decimal, currency, exponentSeparator } =
    getNumberLocaleDetails(computedLocale, options)
  const replacements: ReadonlyArray<
    Readonly<{
      regex: RegExp | null
      replacement: string | ((substring: string) => string)
    }>
  > = [
    { regex: groupRegex(group), replacement: '' },
    {
      regex:
        decimal === undefined ? null : new RegExp(escapeRegExp(decimal), 'gu'),
      replacement: '.',
    },
    { regex: /．/gu, replacement: '.' },
    { regex: /，/gu, replacement: '' },
    { regex: /٫/gu, replacement: '.' },
    { regex: /٬/gu, replacement: '' },
    {
      regex:
        currency === undefined
          ? null
          : new RegExp(escapeRegExp(currency), 'gu'),
      replacement: '',
    },
    { regex: unitRegex(computedLocale, options), replacement: '' },
    { regex: percentGlobalRe, replacement: '' },
    { regex: permilleGlobalRe, replacement: '' },
    {
      regex:
        exponentSeparator === undefined
          ? null
          : new RegExp(escapeRegExp(exponentSeparator), 'gu'),
      replacement: 'e',
    },
    {
      regex: arabicRe,
      replacement: char => String(arabicNumerals.indexOf(char)),
    },
    {
      regex: persianRe,
      replacement: char => String(persianNumerals.indexOf(char)),
    },
    {
      regex: fullwidthRe,
      replacement: char => String(fullwidthNumerals.indexOf(char)),
    },
    {
      regex: hanRe,
      replacement: char => hanNumeralToDigit[char] ?? char,
    },
  ]
  let unformatted = replacements.reduce((text, { regex, replacement }) => {
    if (regex === null) {
      return text
    }

    return typeof replacement === 'string'
      ? text.replace(regex, replacement)
      : text.replace(regex, replacement)
  }, input)
  const lastDot = unformatted.lastIndexOf('.')

  if (lastDot !== -1) {
    unformatted = `${unformatted.slice(0, lastDot).replaceAll('.', '')}.${unformatted
      .slice(lastDot + 1)
      .replaceAll('.', '')}`
  }

  if (/^[-+]?Infinity$/iu.test(input) || input.includes('∞')) {
    return null
  }

  let numberValue = Number.parseFloat(`${isNegative ? '-' : ''}${unformatted}`)
  const formatStyle = options?.style
  const isUnitPercent = formatStyle === 'unit' && options?.unit === 'percent'
  const hasPercentSymbol =
    percentRe.test(formattedNumber) || formatStyle === 'percent'
  const hasPermilleSymbol = permilleRe.test(formattedNumber)

  if (hasPermilleSymbol) {
    numberValue = shiftDecimal(numberValue, -3)
  } else if (!isUnitPercent && hasPercentSymbol) {
    numberValue = shiftDecimal(numberValue, -2)
  }

  return Number.isFinite(numberValue) ? numberValue : null
}

export const valueStateFromText = (
  textValue: string,
  locale?: string,
  format?: NumberFormatOptionsWithRounding,
): NumberFieldValueState => {
  if (textValue.trim() === '') {
    return NumberFieldEmpty({ textValue })
  }

  const value = parseNumber(textValue, locale, format)

  return value === null
    ? NumberFieldInvalid({ textValue })
    : NumberFieldParsed({ value, textValue })
}

const hasNumberFormatRoundingOptions = (
  format?: NumberFormatOptionsWithRounding,
): format is NumberFormatOptionsWithRounding =>
  format?.maximumFractionDigits !== undefined ||
  format?.minimumFractionDigits !== undefined ||
  format?.maximumSignificantDigits !== undefined ||
  format?.minimumSignificantDigits !== undefined ||
  format?.roundingIncrement !== undefined ||
  format?.roundingMode !== undefined ||
  format?.roundingPriority !== undefined

export const removeFloatingPointErrors = (
  value: number,
  format?: NumberFormatOptionsWithRounding,
): number => {
  if (!Number.isFinite(value)) {
    return value
  }

  if (!hasNumberFormatRoundingOptions(format)) {
    const roundedValue = Number.parseFloat(value.toPrecision(15))
    const cleanupDelta = Math.abs(roundedValue - value)
    const cleanupTolerance = Math.min(
      Number.EPSILON * Math.max(1, Math.abs(value)),
      maxFloatingPointCleanupDelta,
    )

    return cleanupDelta <= cleanupTolerance ? roundedValue : value
  }

  const formatter = getFormatter('en-US', {
    ...format,
    signDisplay: 'auto',
    currencySign: 'standard',
    notation: format.notation === 'compact' ? 'standard' : format.notation,
    useGrouping: false,
  })
  const roundedText = formatter.format(value)
  const roundedValue = parseNumber(roundedText, 'en-US', format)

  if (roundedValue === null) {
    return value
  }

  return formatter.format(roundedValue) === roundedText ? roundedValue : value
}

const snapToStep = (
  value: number,
  base: number,
  step: number,
  mode: 'directional' | 'nearest' = 'directional',
): number => {
  const stepSize = Math.abs(step)
  const direction = Math.sign(step)
  const tolerance = stepSize * floatingPointCleanupFactor * direction
  const rawSteps = value - base + tolerance

  if (mode === 'nearest') {
    return base + Math.round(rawSteps / step) * step
  }

  const snappedSteps =
    direction > 0
      ? Math.floor(rawSteps / stepSize)
      : Math.ceil(rawSteps / stepSize)

  return base + snappedSteps * stepSize
}

const toValidatedNumber = (
  value: number | null,
  config: Readonly<{
    step: number | undefined
    min: number
    max: number
    minWithZeroDefault: number
    format: NumberFormatOptionsWithRounding | undefined
    snapOnStep: boolean
    small: boolean
    clamp: boolean
  }>,
): number | null => {
  if (value === null) {
    return value
  }

  const { step, min, max, minWithZeroDefault, format, snapOnStep, small } =
    config
  let nextValue = value

  if (step !== undefined && snapOnStep && step !== 0) {
    const base = small || min === defaultMin ? minWithZeroDefault : min

    nextValue = snapToStep(
      nextValue,
      base,
      step,
      small ? 'nearest' : 'directional',
    )
  }

  if (config.clamp) {
    nextValue = clamp(nextValue, min, max)
  }

  if (step === undefined && !hasNumberFormatRoundingOptions(format)) {
    return nextValue
  }

  const roundedValue = removeFloatingPointErrors(nextValue, format)

  return config.clamp ? clamp(roundedValue, min, max) : roundedValue
}

const stepAmount = (
  state: Pick<NumberFieldState, 'largeStep' | 'smallStep' | 'step'>,
  modifiers?: KeyboardModifiers,
): number => {
  if (modifiers?.altKey === true) {
    return state.smallStep
  }

  return modifiers?.shiftKey === true ? state.largeStep : state.step
}

const valueChange = (
  valueState: NumberFieldValueState,
  reason: NumberFieldChangeReason,
): NumberFieldValueChange => {
  if (valueState._tag === 'Parsed') {
    return {
      value: valueState.value,
      textValue: valueState.textValue,
      state: valueState,
      reason,
    }
  }

  return {
    value: null,
    textValue: valueState.textValue,
    state: valueState,
    reason,
  }
}

export const numberFieldState = (
  config: NumberFieldOptions,
): NumberFieldState => {
  const value = config.value ?? null
  const textValue =
    config.textValue ?? formatNumber(value, config.locale, config.format)
  const valueState = valueStateFromText(textValue, config.locale, config.format)
  const min = config.min ?? defaultMin
  const max = config.max ?? defaultMax
  const step =
    config.step === 'any' ? defaultStep : (config.step ?? defaultStep)

  return {
    value,
    textValue,
    valueState,
    min,
    max,
    step,
    smallStep: config.smallStep ?? defaultSmallStep,
    largeStep: config.largeStep ?? defaultLargeStep,
    inputId: config.inputId ?? config.id ?? 'number-field-input',
    hiddenInputId: `${config.inputId ?? config.id ?? 'number-field'}-hidden-input`,
    isInputInvalid: config.isInvalid === true || config.isFieldInvalid === true,
    isIncrementDisabled:
      config.isDisabled === true || (value !== null && value >= max),
    isDecrementDisabled:
      config.isDisabled === true || (value !== null && value <= min),
  }
}

export const numberFieldInputChange = (
  textValue: string,
  config: NumberFieldOptions,
  reason: Extract<
    NumberFieldChangeReason,
    'input-blur' | 'input-change' | 'input-clear' | 'input-paste' | 'none'
  > = 'input-change',
): NumberFieldValueChange => {
  const valueState = valueStateFromText(textValue, config.locale, config.format)

  if (valueState._tag !== 'Parsed') {
    return valueChange(valueState, reason)
  }

  const nextValue = toValidatedNumber(valueState.value, {
    step: undefined,
    min: config.min ?? defaultMin,
    max: config.max ?? defaultMax,
    minWithZeroDefault: config.min ?? 0,
    format: config.format,
    snapOnStep: config.snapOnStep ?? false,
    small: false,
    clamp: config.allowOutOfRange !== true,
  })

  return valueChange(
    nextValue === null
      ? NumberFieldEmpty({ textValue })
      : NumberFieldParsed({ value: nextValue, textValue }),
    reason,
  )
}

export const numberFieldStepChange = (
  state: NumberFieldState,
  config: Pick<
    NumberFieldOptions,
    'allowOutOfRange' | 'format' | 'locale' | 'min' | 'max' | 'snapOnStep'
  >,
  direction: 1 | -1,
  reason: Extract<
    NumberFieldChangeReason,
    'decrement-press' | 'increment-press' | 'keyboard' | 'scrub' | 'wheel'
  >,
  modifiers?: KeyboardModifiers,
): NumberFieldValueChange => {
  const amount = stepAmount(state, modifiers)
  const seedValue = state.value ?? 0
  const nextValue = toValidatedNumber(seedValue + amount * direction, {
    step: amount * direction,
    min: config.min ?? state.min,
    max: config.max ?? state.max,
    minWithZeroDefault: config.min ?? 0,
    format: config.format,
    snapOnStep: config.snapOnStep ?? false,
    small: modifiers?.altKey === true,
    clamp: true,
  })
  const textValue = formatNumber(nextValue, config.locale, config.format)

  return valueChange(
    nextValue === null
      ? NumberFieldEmpty({ textValue })
      : NumberFieldParsed({ value: nextValue, textValue }),
    reason,
  )
}

export const numberFieldKeyboardChange = (
  state: NumberFieldState,
  config: NumberFieldOptions,
  key: string,
  modifiers?: KeyboardModifiers,
): Option.Option<NumberFieldValueChange> => {
  if (key === 'ArrowUp') {
    return Option.some(
      numberFieldStepChange(state, config, 1, 'keyboard', modifiers),
    )
  }

  if (key === 'ArrowDown') {
    return Option.some(
      numberFieldStepChange(state, config, -1, 'keyboard', modifiers),
    )
  }

  if (key === 'Home' && config.min !== undefined) {
    return Option.some(
      valueChange(
        NumberFieldParsed({
          value: config.min,
          textValue: formatNumber(config.min, config.locale, config.format),
        }),
        'keyboard',
      ),
    )
  }

  if (key === 'End' && config.max !== undefined) {
    return Option.some(
      valueChange(
        NumberFieldParsed({
          value: config.max,
          textValue: formatNumber(config.max, config.locale, config.format),
        }),
        'keyboard',
      ),
    )
  }

  return Option.none()
}

// VIEW

export type NumberFieldPartAttributes<Message> = ReadonlyArray<
  Attribute<Message>
>

export type NumberFieldAttributes<Message> = Readonly<{
  state: NumberFieldState
  root: NumberFieldPartAttributes<Message>
  scrubArea: NumberFieldPartAttributes<Message>
  scrubAreaCursor: NumberFieldPartAttributes<Message>
  group: NumberFieldPartAttributes<Message>
  decrement: NumberFieldPartAttributes<Message>
  input: NumberFieldPartAttributes<Message>
  increment: NumberFieldPartAttributes<Message>
  hiddenInput: NumberFieldPartAttributes<Message>
}>

export type ViewConfig<Message> = NumberFieldOptions &
  Readonly<{
    toView: (attributes: NumberFieldAttributes<Message>) => Html
    onValueChange?: (change: NumberFieldValueChange) => Message
    onFocus?: Message
    onBlur?: Message
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
  Predicate.isNotUndefined(form) ? [h.Attribute('form', form)] : []

const stateDataAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<
    ViewConfig<Message>,
    | 'isDirty'
    | 'isDisabled'
    | 'isFieldInvalid'
    | 'isFilled'
    | 'isFocused'
    | 'isReadOnly'
    | 'isRequired'
    | 'isScrubbing'
    | 'isTouched'
    | 'isValid'
  >,
): ReadonlyArray<Attribute<Message>> => [
  ...booleanDataAttribute(h, 'scrubbing', config.isScrubbing),
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
  ...optionalAttribute<Message>(config.id, value => h.Id(value)),
  ...stateDataAttributes(h, config),
]

const scrubAreaAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.Attribute('style', 'touch-action: none; user-select: none;'),
  ...stateDataAttributes(h, config),
]

const scrubAreaCursorAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.Role('presentation'),
  h.Attribute(
    'style',
    'position: fixed; top: 0; left: 0; pointer-events: none;',
  ),
  ...stateDataAttributes(h, config),
]

const groupAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.Role('group'),
  ...stateDataAttributes(h, config),
]

const stepperAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  state: NumberFieldState,
  direction: 1 | -1,
): ReadonlyArray<Attribute<Message>> => {
  const isIncrement = direction === 1
  const isDisabled = isIncrement
    ? state.isIncrementDisabled
    : state.isDecrementDisabled

  return [
    h.AriaLabel(isIncrement ? 'Increase' : 'Decrease'),
    h.AriaControls(state.inputId),
    h.Tabindex(-1),
    ...optionalBooleanAttribute<Message>(
      isDisabled || config.isReadOnly === true,
      value => h.Disabled(value),
    ),
    ...stateDataAttributes(h, { ...config, isDisabled }),
    ...(Predicate.isNotUndefined(config.onValueChange) &&
    !isDisabled &&
    config.isReadOnly !== true
      ? [
          h.OnClick(
            config.onValueChange(
              numberFieldStepChange(
                state,
                config,
                direction,
                isIncrement ? 'increment-press' : 'decrement-press',
              ),
            ),
          ),
        ]
      : []),
  ]
}

const inputEventAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  state: NumberFieldState,
): ReadonlyArray<Attribute<Message>> => {
  const { onValueChange } = config

  if (config.isDisabled === true || onValueChange === undefined) {
    return []
  }

  return [
    ...(config.isReadOnly === true
      ? []
      : [
          h.OnInput(textValue =>
            onValueChange(
              numberFieldInputChange(textValue, config, 'input-change'),
            ),
          ),
          h.OnKeyDownPreventDefault((key, modifiers) =>
            Option.map(
              numberFieldKeyboardChange(state, config, key, modifiers),
              change => onValueChange(change),
            ),
          ),
        ]),
    ...focusAttributes(h, config),
  ]
}

const inputMode = (_state: NumberFieldState): string => 'numeric'

const inputAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  state: NumberFieldState,
): ReadonlyArray<Attribute<Message>> => [
  h.Type('text'),
  h.Id(state.inputId),
  h.Value(state.textValue),
  h.Attribute('inputmode', inputMode(state)),
  h.Attribute('autocomplete', 'off'),
  h.Attribute('autocorrect', 'off'),
  h.Attribute('spellcheck', 'false'),
  h.Attribute('aria-roledescription', 'Number field'),
  ...(state.isInputInvalid ? [h.AriaInvalid(true)] : []),
  ...optionalAttribute<Message>(config.labelId, value =>
    h.AriaLabelledBy(value),
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
  ...stateDataAttributes(h, config),
  ...inputEventAttributes(h, config, state),
]

const hiddenInputAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  state: NumberFieldState,
): ReadonlyArray<Attribute<Message>> => [
  h.Type('number'),
  h.Id(state.hiddenInputId),
  h.AriaHidden(true),
  h.Tabindex(-1),
  h.Value(state.value === null ? '' : String(state.value)),
  h.Attribute('style', visuallyHiddenInputStyle),
  ...optionalAttribute<Message>(config.name, value => h.Name(value)),
  ...formOwnerAttributes(h, config.form),
  ...(config.min === undefined ? [] : [h.Min(String(config.min))]),
  ...(config.max === undefined ? [] : [h.Max(String(config.max))]),
  h.Step(config.step === undefined ? String(defaultStep) : String(config.step)),
  ...optionalBooleanAttribute<Message>(config.isDisabled, value =>
    h.Disabled(value),
  ),
  ...optionalBooleanAttribute<Message>(config.isRequired, value =>
    h.Required(value),
  ),
  ...optionalBooleanAttribute<Message>(config.isReadOnly, value =>
    h.Readonly(value),
  ),
]

const addCharacters = (values: Set<string>, text: string): Set<string> =>
  [...text].reduce((nextValues, symbol) => {
    nextValues.add(symbol)

    return nextValues
  }, values)

export const allowedCharacters = (
  config: Pick<
    NumberFieldOptions,
    'allowOutOfRange' | 'format' | 'locale' | 'min'
  >,
): ReadonlySet<string> => {
  const { decimal, group, currency, literal } = getNumberLocaleDetails(
    config.locale,
    config.format,
  )
  const values = new Set<string>(baseNonNumericSymbols)

  if (decimal !== undefined) {
    values.add(decimal)
  }
  if (group !== undefined) {
    values.add(group)
    if (spaceSeparatorRe.test(group)) {
      values.add(' ')
    }
  }

  const formatStyle = config.format?.style
  const allowPercentSymbols =
    formatStyle === 'percent' ||
    (formatStyle === 'unit' && config.format?.unit === 'percent')
  const allowPermilleSymbols =
    formatStyle === 'percent' ||
    (formatStyle === 'unit' && config.format?.unit === 'permille')

  if (allowPercentSymbols) {
    percentages.map(symbol => values.add(symbol))
  }
  if (allowPermilleSymbols) {
    permille.map(symbol => values.add(symbol))
  }
  if (formatStyle === 'currency' && currency !== undefined) {
    values.add(currency)
  }
  if (literal !== undefined) {
    addCharacters(values, literal)
    if (spaceSeparatorRe.test(literal)) {
      values.add(' ')
    }
  }

  unicodePlusSigns.map(symbol => values.add(symbol))
  values.add('+')

  if ((config.min ?? defaultMin) < 0 || config.allowOutOfRange === true) {
    unicodeMinusSigns.map(symbol => values.add(symbol))
    values.add('-')
  }

  return values
}

export const isAllowedInputText = (
  textValue: string,
  config: Pick<
    NumberFieldOptions,
    'allowOutOfRange' | 'format' | 'locale' | 'min'
  >,
): boolean => {
  const allowed = allowedCharacters(config)

  return [...textValue].every(
    char =>
      isNumeralChar(char) ||
      anyMinusDetectRe.test(char) ||
      anyPlusDetectRe.test(char) ||
      allowed.has(char),
  )
}

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const state = numberFieldState(config)

  return config.toView({
    state,
    root: rootAttributes(h, config),
    scrubArea: scrubAreaAttributes(h, config),
    scrubAreaCursor: scrubAreaCursorAttributes(h, config),
    group: groupAttributes(h, config),
    decrement: stepperAttributes(h, config, state, -1),
    input: inputAttributes(h, config, state),
    increment: stepperAttributes(h, config, state, 1),
    hiddenInput: hiddenInputAttributes(h, config, state),
  })
}
