import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

// MODEL

export const ProgressStatus = S.Union([
  S.Literal('indeterminate'),
  S.Literal('progressing'),
  S.Literal('complete'),
])
export type ProgressStatus = typeof ProgressStatus.Type

export const ProgressFormatStyle = S.Union([
  S.Literal('decimal'),
  S.Literal('percent'),
  S.Literal('currency'),
])
export type ProgressFormatStyle = typeof ProgressFormatStyle.Type

export const ProgressFormatOptions = S.Struct({
  style: S.optional(ProgressFormatStyle),
  currency: S.optional(S.String),
  minimumFractionDigits: S.optional(S.Number),
  maximumFractionDigits: S.optional(S.Number),
})
export type ProgressFormatOptions = typeof ProgressFormatOptions.Type

export const ProgressOptions = S.Struct({
  value: S.Union([S.Number, S.Null]),
  min: S.optional(S.Number),
  max: S.optional(S.Number),
  locale: S.optional(S.String),
  format: S.optional(ProgressFormatOptions),
  labelId: S.optional(S.String),
})
export type ProgressOptions = typeof ProgressOptions.Type

export const ProgressPart = S.Union([
  S.Literal('root'),
  S.Literal('label'),
  S.Literal('track'),
  S.Literal('indicator'),
  S.Literal('value'),
])
export type ProgressPart = typeof ProgressPart.Type

export type ProgressState = Readonly<{
  status: ProgressStatus
  clampedValue: number | null
  percentage: number | null
  formattedValue: string
  ariaValueText: string
  min: number
  max: number
}>

// UPDATE

const defaultMin = 0
const defaultMax = 100

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(value, max))

const percentageFromValue = (
  value: number,
  min: number,
  max: number,
): number => {
  const rawPercentage = ((value - min) * 100) / (max - min)

  return clamp(Number.isNaN(rawPercentage) ? 0 : rawPercentage, 0, 100)
}

const formatValue = (
  value: number,
  locale: string | undefined,
  format?: ProgressFormatOptions,
): string => {
  const options: Intl.NumberFormatOptions =
    format === undefined ? { style: 'percent' } : format

  return new Intl.NumberFormat(locale, options).format(value)
}

export const progressState = (options: ProgressOptions): ProgressState => {
  const { value, min = defaultMin, max = defaultMax, locale, format } = options

  if (value === null || !Number.isFinite(value)) {
    return {
      status: 'indeterminate',
      clampedValue: null,
      percentage: null,
      formattedValue: '',
      ariaValueText: 'indeterminate progress',
      min,
      max,
    }
  }

  const percentage = percentageFromValue(value, min, max)
  const clampedValue = clamp(value, min, max)
  const formattedValue =
    format === undefined
      ? formatValue(percentage / 100, locale)
      : formatValue(value, locale, format)
  const status = clampedValue === max ? 'complete' : 'progressing'

  return {
    status,
    clampedValue,
    percentage,
    formattedValue,
    ariaValueText: formattedValue,
    min,
    max,
  }
}

// VIEW

export type ProgressAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  label: ReadonlyArray<Attribute<Message>>
  track: ReadonlyArray<Attribute<Message>>
  indicator: ReadonlyArray<Attribute<Message>>
  value: ReadonlyArray<Attribute<Message>>
}>

export type ViewConfig<Message> = ProgressOptions &
  Readonly<{
    toView: (attributes: ProgressAttributes<Message>) => Html
  }>

export const progressStatusAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  status: ProgressStatus,
): ReadonlyArray<Attribute<Message>> => {
  if (status === 'progressing') {
    return [h.DataAttribute('progressing', '')]
  }

  if (status === 'complete') {
    return [h.DataAttribute('complete', '')]
  }

  return [h.DataAttribute('indeterminate', '')]
}

export const indicatorStyle = (
  percentage: number | null,
): Readonly<Record<string, string>> =>
  percentage === null
    ? {}
    : {
        insetInlineStart: '0',
        height: 'inherit',
        width: `${percentage}%`,
      }

export const valueText = (state: ProgressState): string => state.formattedValue

const ariaValueNowAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  value: number | null,
): ReadonlyArray<Attribute<Message>> =>
  value === null ? [] : [h.AriaValuenow(value)]

const ariaLabelledByAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  labelId: string | undefined,
): ReadonlyArray<Attribute<Message>> =>
  labelId === undefined ? [] : [h.AriaLabelledBy(labelId)]

const labelIdAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  labelId: string | undefined,
): ReadonlyArray<Attribute<Message>> =>
  labelId === undefined ? [] : [h.Id(labelId)]

const styleAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  style: Readonly<Record<string, string>>,
): ReadonlyArray<Attribute<Message>> =>
  Object.keys(style).length === 0 ? [] : [h.Style(style)]

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const { labelId, toView } = config
  const state = progressState(config)
  const statusAttributes = progressStatusAttributes(h, state.status)

  return toView({
    root: [
      h.Role('progressbar'),
      h.AriaValuemin(state.min),
      h.AriaValuemax(state.max),
      ...ariaValueNowAttribute(h, state.clampedValue),
      h.AriaValuetext(state.ariaValueText),
      ...ariaLabelledByAttribute(h, labelId),
      ...statusAttributes,
    ],
    label: [
      h.Role('presentation'),
      ...labelIdAttribute(h, labelId),
      ...statusAttributes,
    ],
    track: [...statusAttributes],
    indicator: [
      ...statusAttributes,
      ...styleAttribute(h, indicatorStyle(state.percentage)),
    ],
    value: [h.AriaHidden(true), ...statusAttributes],
  })
}
