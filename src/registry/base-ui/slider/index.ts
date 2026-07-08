import {
  Array as EffectArray,
  Match as M,
  Option,
  Order,
  Predicate,
  Schema as S,
} from 'effect'
import type { Attribute, Html, KeyboardModifiers } from 'foldkit/html'
import { html } from 'foldkit/html'

// MODEL

export const SliderOrientation = S.Union([
  S.Literal('horizontal'),
  S.Literal('vertical'),
])
export type SliderOrientation = typeof SliderOrientation.Type

export const SliderDirection = S.Union([S.Literal('ltr'), S.Literal('rtl')])
export type SliderDirection = typeof SliderDirection.Type

export const SliderThumbCollisionBehavior = S.Union([
  S.Literal('none'),
  S.Literal('push'),
  S.Literal('swap'),
])
export type SliderThumbCollisionBehavior =
  typeof SliderThumbCollisionBehavior.Type

export const SliderChangeReason = S.Union([
  S.Literal('none'),
  S.Literal('input-change'),
  S.Literal('track-press'),
  S.Literal('drag'),
  S.Literal('keyboard'),
])
export type SliderChangeReason = typeof SliderChangeReason.Type

export const SliderFormatStyle = S.Union([
  S.Literal('decimal'),
  S.Literal('percent'),
  S.Literal('currency'),
])
export type SliderFormatStyle = typeof SliderFormatStyle.Type

export const SliderFormatOptions = S.Struct({
  style: S.optional(SliderFormatStyle),
  currency: S.optional(S.String),
  minimumFractionDigits: S.optional(S.Number),
  maximumFractionDigits: S.optional(S.Number),
})
export type SliderFormatOptions = typeof SliderFormatOptions.Type

export const SliderOptions = S.Struct({
  id: S.optional(S.String),
  labelId: S.optional(S.String),
  values: S.Array(S.Number),
  min: S.optional(S.Number),
  max: S.optional(S.Number),
  step: S.optional(S.Number),
  largeStep: S.optional(S.Number),
  minStepsBetweenValues: S.optional(S.Number),
  orientation: S.optional(SliderOrientation),
  dir: S.optional(SliderDirection),
  name: S.optional(S.String),
  form: S.optional(S.String),
  locale: S.optional(S.String),
  format: S.optional(SliderFormatOptions),
  isDisabled: S.optional(S.Boolean),
  isRequired: S.optional(S.Boolean),
  isInvalid: S.optional(S.Boolean),
  isDirty: S.optional(S.Boolean),
  isTouched: S.optional(S.Boolean),
  isFocused: S.optional(S.Boolean),
  isValid: S.optional(S.Boolean),
  isDragging: S.optional(S.Boolean),
  activeThumbIndex: S.optional(S.Number),
  thumbAlignment: S.optional(S.Union([S.Literal('center'), S.Literal('edge')])),
  thumbSizePx: S.optional(S.Number),
})
export type SliderOptions = typeof SliderOptions.Type

export const SliderValueChange = S.Struct({
  values: S.Array(S.Number),
  reason: SliderChangeReason,
  activeThumbIndex: S.Number,
})
export type SliderValueChange = typeof SliderValueChange.Type

export const SliderPointer = S.Struct({
  clientX: S.Number,
  clientY: S.Number,
})
export type SliderPointer = typeof SliderPointer.Type

export const SliderControlRect = S.Struct({
  left: S.Number,
  right: S.Number,
  bottom: S.Number,
  width: S.Number,
  height: S.Number,
})
export type SliderControlRect = typeof SliderControlRect.Type

export type SliderThumbState = Readonly<{
  index: number
  value: number
  percentage: number
  isActive: boolean
  inputId: string
  thumbId: string
  ariaValueText: string | undefined
}>

export type SliderState = Readonly<{
  values: ReadonlyArray<number>
  percentages: ReadonlyArray<number>
  thumbs: ReadonlyArray<SliderThumbState>
  min: number
  max: number
  step: number
  largeStep: number
  minStepsBetweenValues: number
  orientation: SliderOrientation
  dir: SliderDirection
  isRange: boolean
  activeThumbIndex: number
  formattedValues: ReadonlyArray<string>
  displayValue: string
}>

// UPDATE

const defaultMin = 0
const defaultMax = 100
const defaultStep = 1
const defaultLargeStep = 10
const defaultMinStepsBetweenValues = 0
const defaultThumbSizePx = 12

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(value, max))

const valueToPercent = (value: number, min: number, max: number): number => {
  const percentage = ((value - min) * 100) / (max - min)

  return clamp(Number.isNaN(percentage) ? 0 : percentage, 0, 100)
}

export const getDecimalPrecision = (value: number): number => {
  if (value === 0) {
    return 0
  }

  if (Math.abs(value) < 1) {
    const parts = value.toExponential().split('e-')
    const mantissaDecimalPart = parts[0]?.split('.')[1]

    return (
      (mantissaDecimalPart === undefined ? 0 : mantissaDecimalPart.length) +
      Number.parseInt(parts[1] ?? '0', 10)
    )
  }

  const [, decimalPart] = value.toString().split('.')

  return decimalPart === undefined ? 0 : decimalPart.length
}

export const roundValueToStep = (
  value: number,
  step: number,
  min: number,
): number => {
  const nearest = Math.round((value - min) / step) * step + min

  return Number(
    nearest.toFixed(
      Math.max(getDecimalPrecision(step), getDecimalPrecision(min)),
    ),
  )
}

const roundedClamp = (value: number, min: number, max: number): number =>
  Number(clamp(value, min, max).toFixed(12))

export const canonicalValues = (
  values: ReadonlyArray<number>,
  min = defaultMin,
  max = defaultMax,
): ReadonlyArray<number> => {
  const safeValues = values.length === 0 ? [min] : values

  return EffectArray.sort(
    safeValues.map(value =>
      Number.isFinite(value) ? clamp(value, min, max) : min,
    ),
    Order.Number,
  )
}

export const valueArrayToPercentages = (
  values: ReadonlyArray<number>,
  min: number,
  max: number,
): ReadonlyArray<number> => values.map(value => valueToPercent(value, min, max))

export const getSliderValue = (
  valueInput: number,
  index: number,
  min: number,
  max: number,
  range: boolean,
  values: ReadonlyArray<number>,
): number | ReadonlyArray<number> => {
  const clampedValue = clamp(valueInput, min, max)

  if (!range) {
    return clampedValue
  }

  return values.map((value, valueIndex) =>
    valueIndex === index
      ? clamp(
          clampedValue,
          values[valueIndex - 1] ?? -Infinity,
          values[valueIndex + 1] ?? Infinity,
        )
      : value,
  )
}

export const validateMinimumDistance = (
  values: number | ReadonlyArray<number>,
  step: number,
  minStepsBetweenValues: number,
): boolean => {
  if (!Array.isArray(values) || values.length < 2) {
    return true
  }

  const minValueDifference = step * minStepsBetweenValues

  return values.every((value, index) => {
    const nextValue = values[index + 1]

    return nextValue === undefined || nextValue - value >= minValueDifference
  })
}

export const getPushedThumbValues = (config: {
  readonly values: ReadonlyArray<number>
  readonly index: number
  readonly nextValue: number
  readonly min: number
  readonly max: number
  readonly step: number
  readonly minStepsBetweenValues: number
  readonly initialValues?: ReadonlyArray<number>
}): ReadonlyArray<number> => {
  const {
    values,
    index,
    nextValue,
    min,
    max,
    step,
    minStepsBetweenValues,
    initialValues,
  } = config

  if (values.length === 0) {
    return []
  }

  const minValueDifference = step * minStepsBetweenValues
  const lastIndex = values.length - 1
  const baseInitialValues = initialValues ?? values
  const firstPass = values.map((value, valueIndex) =>
    valueIndex === index
      ? clamp(
          nextValue,
          min + valueIndex * minValueDifference,
          max - (lastIndex - valueIndex) * minValueDifference,
        )
      : value,
  )
  const forwardPass = firstPass.reduce<ReadonlyArray<number>>(
    (nextValues, _value, valueIndex) => {
      if (valueIndex <= index) {
        return nextValues
      }

      const previousValue = nextValues[valueIndex - 1] ?? min
      const currentValue = nextValues[valueIndex] ?? min
      const minAllowed = previousValue + minValueDifference
      const maxAllowed = max - (lastIndex - valueIndex) * minValueDifference
      const initialValue = baseInitialValues[valueIndex] ?? currentValue
      const pushedCandidate = Math.max(currentValue, minAllowed)
      const candidate =
        initialValue < pushedCandidate
          ? Math.max(initialValue, minAllowed)
          : pushedCandidate

      return nextValues.map((entry, entryIndex) =>
        entryIndex === valueIndex
          ? clamp(candidate, minAllowed, maxAllowed)
          : entry,
      )
    },
    firstPass,
  )
  const backwardIndexes = EffectArray.reverse(
    forwardPass.map((_, valueIndex) => valueIndex),
  )

  return backwardIndexes
    .reduce<ReadonlyArray<number>>((nextValues, valueIndex) => {
      if (valueIndex >= index) {
        return nextValues
      }

      const nextValueAfter = nextValues[valueIndex + 1] ?? max
      const currentValue = nextValues[valueIndex] ?? min
      const maxAllowed = nextValueAfter - minValueDifference
      const minAllowed = min + valueIndex * minValueDifference
      const initialValue = baseInitialValues[valueIndex] ?? currentValue
      const pushedCandidate = Math.min(currentValue, maxAllowed)
      const candidate =
        initialValue > pushedCandidate
          ? Math.min(initialValue, maxAllowed)
          : pushedCandidate

      return nextValues.map((entry, entryIndex) =>
        entryIndex === valueIndex
          ? clamp(candidate, minAllowed, maxAllowed)
          : entry,
      )
    }, forwardPass)
    .map(value => Number(value.toFixed(12)))
}

interface ResolveThumbCollisionConfig {
  readonly behavior: SliderThumbCollisionBehavior
  readonly values: ReadonlyArray<number>
  readonly currentValues?: ReadonlyArray<number> | null
  readonly initialValues?: ReadonlyArray<number> | null
  readonly pressedIndex: number
  readonly nextValue: number
  readonly min: number
  readonly max: number
  readonly step: number
  readonly minStepsBetweenValues: number
}

type ResolveThumbCollisionResult = Readonly<{
  value: number | ReadonlyArray<number>
  thumbIndex: number
  didSwap: boolean
}>

const resolvePushCollision = (
  config: ResolveThumbCollisionConfig,
  activeValues: ReadonlyArray<number>,
): ResolveThumbCollisionResult => ({
  value: getPushedThumbValues({
    values: activeValues,
    index: config.pressedIndex,
    nextValue: config.nextValue,
    min: config.min,
    max: config.max,
    step: config.step,
    minStepsBetweenValues: config.minStepsBetweenValues,
  }),
  thumbIndex: config.pressedIndex,
  didSwap: false,
})

const resolveNoneCollision = (
  config: ResolveThumbCollisionConfig,
  activeValues: ReadonlyArray<number>,
  minValueDifference: number,
): ResolveThumbCollisionResult => {
  const { max, min, nextValue, pressedIndex } = config
  const previousNeighbor = activeValues[pressedIndex - 1]
  const nextNeighbor = activeValues[pressedIndex + 1]
  const lowerBound =
    previousNeighbor === undefined ? min : previousNeighbor + minValueDifference
  const upperBound =
    nextNeighbor === undefined ? max : nextNeighbor - minValueDifference

  return {
    value: activeValues.map((value, index) =>
      index === pressedIndex
        ? roundedClamp(nextValue, lowerBound, upperBound)
        : value,
    ),
    thumbIndex: pressedIndex,
    didSwap: false,
  }
}

const restoredSwapValues = (
  config: ResolveThumbCollisionConfig,
  pushedValues: ReadonlyArray<number>,
  neighborIndex: number,
  pressedValueAfterClamp: number,
  minValueDifference: number,
): ReadonlyArray<number> =>
  neighborIndex >= 0 && neighborIndex < pushedValues.length
    ? pushedValues.map((value, index) => {
        if (index !== neighborIndex) {
          return value
        }

        const previousValue = pushedValues[neighborIndex - 1]
        const nextValueAfter = pushedValues[neighborIndex + 1]
        const neighborLowerBound = Math.max(
          previousValue === undefined
            ? config.min
            : previousValue + minValueDifference,
          config.min + neighborIndex * minValueDifference,
        )
        const neighborUpperBound = Math.min(
          nextValueAfter === undefined
            ? config.max
            : nextValueAfter - minValueDifference,
          config.max -
            (pushedValues.length - 1 - neighborIndex) * minValueDifference,
        )

        return roundedClamp(
          pressedValueAfterClamp,
          neighborLowerBound,
          neighborUpperBound,
        )
      })
    : pushedValues

const resolveSwapCollision = (
  config: ResolveThumbCollisionConfig,
  activeValues: ReadonlyArray<number>,
  baselineValues: ReadonlyArray<number>,
  minValueDifference: number,
): ResolveThumbCollisionResult => {
  const { pressedIndex, nextValue, min, max, step, minStepsBetweenValues } =
    config
  const pressedInitialValue = activeValues[pressedIndex] ?? min
  const previousNeighbor = activeValues[pressedIndex - 1]
  const nextNeighbor = activeValues[pressedIndex + 1]
  const lowerBound =
    previousNeighbor === undefined ? min : previousNeighbor + minValueDifference
  const upperBound =
    nextNeighbor === undefined ? max : nextNeighbor - minValueDifference
  const pressedValueAfterClamp = roundedClamp(nextValue, lowerBound, upperBound)
  const candidateValues = activeValues.map((value, index) =>
    index === pressedIndex ? pressedValueAfterClamp : value,
  )
  const movingForward = nextValue > pressedInitialValue
  const movingBackward = nextValue < pressedInitialValue
  const epsilon = 1e-7
  const shouldSwapForward =
    movingForward &&
    nextNeighbor !== undefined &&
    nextValue >= nextNeighbor - epsilon
  const shouldSwapBackward =
    movingBackward &&
    previousNeighbor !== undefined &&
    nextValue <= previousNeighbor + epsilon

  if (!shouldSwapForward && !shouldSwapBackward) {
    return {
      value: candidateValues,
      thumbIndex: pressedIndex,
      didSwap: false,
    }
  }

  const targetIndex = shouldSwapForward ? pressedIndex + 1 : pressedIndex - 1
  const initialValuesForPush = candidateValues.map((_, index) =>
    index === pressedIndex
      ? pressedValueAfterClamp
      : (baselineValues[index] ?? activeValues[index] ?? min),
  )
  const nextValueForTarget = shouldSwapForward
    ? Math.max(nextValue, candidateValues[targetIndex] ?? min)
    : Math.min(nextValue, candidateValues[targetIndex] ?? max)
  const pushedValues = getPushedThumbValues({
    values: candidateValues,
    index: targetIndex,
    nextValue: nextValueForTarget,
    min,
    max,
    step,
    minStepsBetweenValues,
    initialValues: initialValuesForPush,
  })
  const neighborIndex = shouldSwapForward ? targetIndex - 1 : targetIndex + 1

  return {
    value: restoredSwapValues(
      config,
      pushedValues,
      neighborIndex,
      pressedValueAfterClamp,
      minValueDifference,
    ),
    thumbIndex: targetIndex,
    didSwap: true,
  }
}

export const resolveThumbCollision = (
  config: ResolveThumbCollisionConfig,
): ResolveThumbCollisionResult => {
  const activeValues = config.currentValues ?? config.values
  const baselineValues = config.initialValues ?? config.values

  if (activeValues.length < 2) {
    return { value: config.nextValue, thumbIndex: 0, didSwap: false }
  }

  const minValueDifference = config.step * config.minStepsBetweenValues

  if (config.behavior === 'push') {
    return resolvePushCollision(config, activeValues)
  }

  if (config.behavior === 'swap') {
    return resolveSwapCollision(
      config,
      activeValues,
      baselineValues,
      minValueDifference,
    )
  }

  return resolveNoneCollision(config, activeValues, minValueDifference)
}

const nextNumericValue = (
  thumbValue: number,
  increment: number,
  direction: 1 | -1,
  min: number,
  max: number,
): number => {
  const value =
    direction === 1 ? thumbValue + increment : thumbValue - increment

  return clamp(
    Number(
      value.toFixed(
        Math.max(
          getDecimalPrecision(thumbValue),
          getDecimalPrecision(increment),
          getDecimalPrecision(min),
        ),
      ),
    ),
    min,
    max,
  )
}

const valueChangeFromValue = (
  value: number | ReadonlyArray<number>,
  reason: SliderChangeReason,
  activeThumbIndex: number,
): SliderValueChange => ({
  values: Array.isArray(value) ? [...value] : [value],
  reason,
  activeThumbIndex,
})

const defaultKeyboardModifiers: KeyboardModifiers = {
  altKey: false,
  ctrlKey: false,
  metaKey: false,
  shiftKey: false,
}

export const keyboardValueChange = (
  state: SliderState,
  index: number,
  key: string,
  modifiers: KeyboardModifiers = defaultKeyboardModifiers,
): SliderValueChange | undefined => {
  const thumbValue = state.values[index]

  if (thumbValue === undefined) {
    return undefined
  }

  const roundedValue = roundValueToStep(thumbValue, state.step, state.min)
  const increment = modifiers.shiftKey ? state.largeStep : state.step
  const nextValue = M.value(key).pipe(
    M.when('ArrowUp', () =>
      nextNumericValue(roundedValue, increment, 1, state.min, state.max),
    ),
    M.when('ArrowRight', () =>
      nextNumericValue(
        roundedValue,
        increment,
        state.dir === 'rtl' ? -1 : 1,
        state.min,
        state.max,
      ),
    ),
    M.when('ArrowDown', () =>
      nextNumericValue(roundedValue, increment, -1, state.min, state.max),
    ),
    M.when('ArrowLeft', () =>
      nextNumericValue(
        roundedValue,
        increment,
        state.dir === 'rtl' ? 1 : -1,
        state.min,
        state.max,
      ),
    ),
    M.when('PageUp', () =>
      nextNumericValue(roundedValue, state.largeStep, 1, state.min, state.max),
    ),
    M.when('PageDown', () =>
      nextNumericValue(roundedValue, state.largeStep, -1, state.min, state.max),
    ),
    M.when('End', () =>
      state.isRange && state.values[index + 1] !== undefined
        ? (state.values[index + 1] ?? state.max) -
          state.step * state.minStepsBetweenValues
        : state.max,
    ),
    M.when('Home', () =>
      state.isRange && state.values[index - 1] !== undefined
        ? (state.values[index - 1] ?? state.min) +
          state.step * state.minStepsBetweenValues
        : state.min,
    ),
    M.orElse(() => Number.NaN),
  )

  if (Number.isNaN(nextValue)) {
    return undefined
  }

  const value = getSliderValue(
    nextValue,
    index,
    state.min,
    state.max,
    state.isRange,
    state.values,
  )

  return validateMinimumDistance(value, state.step, state.minStepsBetweenValues)
    ? valueChangeFromValue(value, 'keyboard', index)
    : undefined
}

export const pointerValue = (config: {
  readonly pointer: SliderPointer
  readonly rect: SliderControlRect
  readonly min: number
  readonly max: number
  readonly step: number
  readonly orientation: SliderOrientation
  readonly dir: SliderDirection
}): number => {
  const { pointer, rect, min, max, step, orientation, dir } = config
  const controlSize = orientation === 'vertical' ? rect.height : rect.width
  const valueSize = (() => {
    if (orientation === 'vertical') {
      return rect.bottom - pointer.clientY
    }

    if (dir === 'rtl') {
      return rect.right - pointer.clientX
    }

    return pointer.clientX - rect.left
  })()
  const valueRescaled = clamp(valueSize / controlSize, 0, 1)
  const rawValue = (max - min) * valueRescaled + min

  return clamp(roundValueToStep(rawValue, step, min), min, max)
}

export const closestThumbIndex = (
  values: ReadonlyArray<number>,
  nextValue: number,
): number =>
  values.reduce(
    (closest, value, index) => {
      const distance = Math.abs(value - nextValue)

      return distance <= closest.distance ? { index, distance } : closest
    },
    { index: 0, distance: Number.POSITIVE_INFINITY },
  ).index

export const pointerValueChange = (config: {
  readonly state: SliderState
  readonly pointer: SliderPointer
  readonly rect: SliderControlRect
  readonly activeThumbIndex?: number
  readonly behavior?: SliderThumbCollisionBehavior
  readonly reason?: Extract<SliderChangeReason, 'track-press' | 'drag'>
  readonly initialValues?: ReadonlyArray<number>
}): SliderValueChange => {
  const {
    state,
    pointer,
    rect,
    activeThumbIndex,
    behavior = 'push',
    reason = 'track-press',
    initialValues,
  } = config
  const nextValue = pointerValue({
    pointer,
    rect,
    min: state.min,
    max: state.max,
    step: state.step,
    orientation: state.orientation,
    dir: state.dir,
  })
  const index =
    activeThumbIndex === undefined
      ? closestThumbIndex(state.values, nextValue)
      : activeThumbIndex
  const collision = resolveThumbCollision({
    behavior,
    values: state.values,
    pressedIndex: index,
    nextValue,
    min: state.min,
    max: state.max,
    step: state.step,
    minStepsBetweenValues: state.minStepsBetweenValues,
    ...(initialValues === undefined ? {} : { initialValues }),
  })

  return valueChangeFromValue(collision.value, reason, collision.thumbIndex)
}

const formatValue = (
  value: number,
  locale: string | undefined,
  format: SliderFormatOptions | undefined,
): string => new Intl.NumberFormat(locale, format).format(value)

const inputId = (config: Pick<SliderOptions, 'id'>, index: number): string =>
  `${config.id ?? 'slider'}-input-${index}`

const thumbId = (config: Pick<SliderOptions, 'id'>, index: number): string =>
  `${config.id ?? 'slider'}-thumb-${index}`

const ariaValueText = (
  values: ReadonlyArray<number>,
  formattedValues: ReadonlyArray<string>,
  value: number,
  index: number,
  format: SliderFormatOptions | undefined,
): string | undefined => {
  if (values.length === 2) {
    return `${formattedValues[index] ?? value} ${index === 0 ? 'start' : 'end'} range`
  }

  if (format !== undefined) {
    return formattedValues[index] ?? String(value)
  }

  return undefined
}

export const sliderState = (options: SliderOptions): SliderState => {
  const {
    min = defaultMin,
    max = defaultMax,
    step = defaultStep,
    largeStep = defaultLargeStep,
    minStepsBetweenValues = defaultMinStepsBetweenValues,
    orientation = 'horizontal',
    dir = 'ltr',
    activeThumbIndex = -1,
  } = options
  const values = canonicalValues(options.values, min, max)
  const percentages = valueArrayToPercentages(values, min, max)
  const formattedValues = values.map(value =>
    formatValue(value, options.locale, options.format),
  )

  return {
    values,
    percentages,
    thumbs: values.map((value, index) => ({
      index,
      value,
      percentage: percentages[index] ?? 0,
      isActive: activeThumbIndex === index,
      inputId: inputId(options, index),
      thumbId: thumbId(options, index),
      ariaValueText: ariaValueText(
        values,
        formattedValues,
        value,
        index,
        options.format,
      ),
    })),
    min,
    max,
    step,
    largeStep,
    minStepsBetweenValues,
    orientation,
    dir,
    isRange: values.length > 1,
    activeThumbIndex,
    formattedValues,
    displayValue: formattedValues.join(' – '),
  }
}

// VIEW

export type SliderThumbAttributes<Message> = Readonly<{
  state: SliderThumbState
  root: ReadonlyArray<Attribute<Message>>
  input: ReadonlyArray<Attribute<Message>>
}>

export type SliderAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  label: ReadonlyArray<Attribute<Message>>
  control: ReadonlyArray<Attribute<Message>>
  track: ReadonlyArray<Attribute<Message>>
  indicator: ReadonlyArray<Attribute<Message>>
  value: ReadonlyArray<Attribute<Message>>
  thumbs: ReadonlyArray<SliderThumbAttributes<Message>>
}>

export type ViewConfig<Message> = SliderOptions &
  Readonly<{
    toView: (attributes: SliderAttributes<Message>) => Html
    onValueChange?: (change: SliderValueChange) => Message
    onFocus?: Message
    onBlur?: Message
    controlRect?: SliderControlRect
    thumbCollisionBehavior?: SliderThumbCollisionBehavior
  }>

const visuallyHiddenInputStyle =
  'clip-path: inset(50%); overflow: hidden; white-space: nowrap; border: 0px; padding: 0px; width: 100%; height: 100%; margin: -1px; position: fixed; top: 0px; left: 0px;'

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
    | 'isDirty'
    | 'isDisabled'
    | 'isFocused'
    | 'isDragging'
    | 'isTouched'
    | 'isValid'
    | 'orientation'
  >,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('orientation', config.orientation ?? 'horizontal'),
  ...booleanDataAttribute(h, 'disabled', config.isDisabled),
  ...booleanDataAttribute(h, 'dragging', config.isDragging),
  ...booleanDataAttribute(h, 'dirty', config.isDirty),
  ...booleanDataAttribute(h, 'touched', config.isTouched),
  ...booleanDataAttribute(h, 'focused', config.isFocused),
  ...(config.isValid === undefined
    ? []
    : [h.DataAttribute(config.isValid ? 'valid' : 'invalid', '')]),
]

const formOwnerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  form: string | undefined,
): ReadonlyArray<Attribute<Message>> =>
  Predicate.isNotUndefined(form) ? [h.Attribute('form', form)] : []

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
  ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
  ...optionalAttribute<Message>(config.labelId, value =>
    h.AriaLabelledBy(value),
  ),
  ...stateDataAttributes(h, config),
]

const labelAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  ...optionalAttribute<Message>(config.labelId, value => h.Id(value)),
  ...stateDataAttributes(h, config),
]

const controlPointerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  state: SliderState,
): ReadonlyArray<Attribute<Message>> => {
  if (
    config.isDisabled === true ||
    config.controlRect === undefined ||
    config.onValueChange === undefined
  ) {
    return []
  }

  const { controlRect, onValueChange } = config

  return [
    h.OnPointerDown(
      (_pointerType, button, _screenX, _screenY, _time, clientX, clientY) =>
        button === 0
          ? Option.some(
              onValueChange(
                pointerValueChange({
                  state,
                  pointer: { clientX, clientY },
                  rect: controlRect,
                  ...(config.thumbCollisionBehavior === undefined
                    ? {}
                    : { behavior: config.thumbCollisionBehavior }),
                }),
              ),
            )
          : Option.none(),
    ),
  ]
}

const controlAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  state: SliderState,
): ReadonlyArray<Attribute<Message>> => [
  h.Attribute('data-base-ui-slider-control', ''),
  ...stateDataAttributes(h, config),
  ...controlPointerAttributes(h, config, state),
]

const trackAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.Style({ position: 'relative' }),
  ...stateDataAttributes(h, config),
]

const cssNumber = (value: number): string => String(Number(value.toFixed(6)))

const edgePosition = (percentage: number, thumbSizePx: number): string =>
  `calc(${cssNumber(percentage)}% + ${cssNumber(
    thumbSizePx / 2 - (thumbSizePx * percentage) / 100,
  )}px)`

const edgeSize = (percentage: number, thumbSizePx: number): string =>
  `calc(${cssNumber(percentage)}% + ${cssNumber(
    -(thumbSizePx * percentage) / 100,
  )}px)`

const startPositionStyle = (
  percentage: number,
  config: Pick<SliderOptions, 'orientation' | 'thumbAlignment' | 'thumbSizePx'>,
): string => {
  if (config.thumbAlignment !== 'edge') {
    return `${percentage}%`
  }

  return edgePosition(percentage, config.thumbSizePx ?? defaultThumbSizePx)
}

export const indicatorStyle = (
  state: SliderState,
  config: Pick<SliderOptions, 'thumbAlignment' | 'thumbSizePx'> = {},
): Readonly<Record<string, string>> => {
  const start = state.percentages[0] ?? 0
  const end = state.percentages.at(-1) ?? start
  const size = state.isRange ? end - start : start
  const startEdge =
    state.orientation === 'vertical' ? 'bottom' : 'insetInlineStart'
  const mainSide = state.orientation === 'vertical' ? 'height' : 'width'
  const crossSide = state.orientation === 'vertical' ? 'width' : 'height'
  const startValue = state.isRange
    ? startPositionStyle(start, { ...config, orientation: state.orientation })
    : '0'
  const sizeValue = (() => {
    if (config.thumbAlignment !== 'edge') {
      return `${size}%`
    }

    if (state.isRange) {
      return edgeSize(size, config.thumbSizePx ?? defaultThumbSizePx)
    }

    return edgePosition(size, config.thumbSizePx ?? defaultThumbSizePx)
  })()

  return {
    position: state.orientation === 'vertical' ? 'absolute' : 'relative',
    [crossSide]: 'inherit',
    [startEdge]: startValue,
    [mainSide]: sizeValue,
  }
}

const indicatorAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  state: SliderState,
): ReadonlyArray<Attribute<Message>> => [
  h.Attribute('data-base-ui-slider-indicator', ''),
  h.Style(indicatorStyle(state, config)),
  ...stateDataAttributes(h, config),
]

const outputForAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  state: SliderState,
): ReadonlyArray<Attribute<Message>> =>
  state.thumbs.length === 0
    ? []
    : [h.Attribute('for', state.thumbs.map(thumb => thumb.inputId).join(' '))]

const valueAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  state: SliderState,
): ReadonlyArray<Attribute<Message>> => [
  h.Attribute('aria-live', 'off'),
  ...outputForAttribute(h, state),
  ...stateDataAttributes(h, config),
]

const thumbStyle = (
  state: SliderState,
  thumb: SliderThumbState,
  config: Pick<SliderOptions, 'thumbAlignment' | 'thumbSizePx'>,
): Readonly<Record<string, string>> => {
  const startEdge =
    state.orientation === 'vertical' ? 'bottom' : 'insetInlineStart'
  const crossOffsetProperty = state.orientation === 'vertical' ? 'left' : 'top'
  const translateX =
    state.orientation === 'vertical' || state.dir !== 'rtl' ? -50 : 50
  const translateY = state.orientation === 'vertical' ? 50 : -50

  return {
    position: 'absolute',
    [startEdge]: startPositionStyle(thumb.percentage, {
      orientation: state.orientation,
      thumbAlignment: config.thumbAlignment,
      thumbSizePx: config.thumbSizePx,
    }),
    [crossOffsetProperty]: '50%',
    translate: `${translateX}% ${translateY}%`,
    ...(thumb.isActive ? { zIndex: state.isRange ? '2' : '1' } : {}),
  }
}

const inputChangeAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  state: SliderState,
  thumb: SliderThumbState,
): ReadonlyArray<Attribute<Message>> => {
  if (config.isDisabled === true || config.onValueChange === undefined) {
    return []
  }

  const { onValueChange } = config

  return [
    h.OnChange(value => {
      const valueAsNumber = Number(value)
      const nextValue = getSliderValue(
        valueAsNumber,
        thumb.index,
        state.min,
        state.max,
        state.isRange,
        state.values,
      )

      return onValueChange(
        valueChangeFromValue(nextValue, 'input-change', thumb.index),
      )
    }),
    h.OnKeyDownPreventDefault((key, modifiers) => {
      const change = keyboardValueChange(state, thumb.index, key, modifiers)

      return change === undefined
        ? Option.none()
        : Option.some(onValueChange(change))
    }),
  ]
}

const thumbAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  state: SliderState,
  thumb: SliderThumbState,
): SliderThumbAttributes<Message> => ({
  state: thumb,
  root: [
    h.Id(thumb.thumbId),
    h.DataAttribute('index', String(thumb.index)),
    h.Style(thumbStyle(state, thumb, config)),
    ...stateDataAttributes(h, config),
    ...focusAttributes(h, config),
  ],
  input: [
    h.Type('range'),
    h.Id(thumb.inputId),
    h.AriaOrientation(state.orientation),
    h.AriaValuenow(thumb.value),
    ...(thumb.ariaValueText === undefined
      ? []
      : [h.AriaValuetext(thumb.ariaValueText)]),
    ...optionalAttribute<Message>(config.labelId, value =>
      h.AriaLabelledBy(value),
    ),
    h.Min(String(state.min)),
    h.Max(String(state.max)),
    h.Step(String(state.step)),
    h.Value(String(thumb.value)),
    h.Attribute('style', visuallyHiddenInputStyle),
    ...optionalAttribute<Message>(config.name, value => h.Name(value)),
    ...formOwnerAttributes(h, config.form),
    ...optionalBooleanAttribute<Message>(config.isDisabled, value =>
      h.Disabled(value),
    ),
    ...optionalBooleanAttribute<Message>(config.isRequired, value =>
      h.Required(value),
    ),
    ...(config.isInvalid === true ? [h.AriaInvalid(true)] : []),
    ...inputChangeAttributes(h, config, state, thumb),
  ],
})

export const valueText = (state: SliderState): string => state.displayValue

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const state = sliderState(config)

  return config.toView({
    root: rootAttributes(h, config),
    label: labelAttributes(h, config),
    control: controlAttributes(h, config, state),
    track: trackAttributes(h, config),
    indicator: indicatorAttributes(h, config, state),
    value: valueAttributes(h, config, state),
    thumbs: state.thumbs.map(thumb => thumbAttributes(h, config, state, thumb)),
  })
}
