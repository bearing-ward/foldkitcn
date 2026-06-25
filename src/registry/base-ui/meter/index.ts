import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

// MODEL

export const MeterFormatStyle = S.Union([
  S.Literal('decimal'),
  S.Literal('percent'),
  S.Literal('currency'),
])
export type MeterFormatStyle = typeof MeterFormatStyle.Type

export const MeterFormatOptions = S.Struct({
  style: S.optional(MeterFormatStyle),
  currency: S.optional(S.String),
  minimumFractionDigits: S.optional(S.Number),
  maximumFractionDigits: S.optional(S.Number),
})
export type MeterFormatOptions = typeof MeterFormatOptions.Type

export const MeterOptions = S.Struct({
  value: S.Number,
  min: S.optional(S.Number),
  max: S.optional(S.Number),
  low: S.optional(S.Number),
  high: S.optional(S.Number),
  optimum: S.optional(S.Number),
  locale: S.optional(S.String),
  format: S.optional(MeterFormatOptions),
  labelId: S.optional(S.String),
})
export type MeterOptions = typeof MeterOptions.Type

export const MeterPart = S.Union([
  S.Literal('root'),
  S.Literal('label'),
  S.Literal('track'),
  S.Literal('indicator'),
  S.Literal('value'),
])
export type MeterPart = typeof MeterPart.Type

export type MeterState = Readonly<{
  value: number
  clampedValue: number
  percentage: number
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
  format: MeterFormatOptions,
): string => new Intl.NumberFormat(locale, format).format(value)

export const meterState = (options: MeterOptions): MeterState => {
  const { value, min = defaultMin, max = defaultMax, locale, format } = options
  const safeValue = Number.isNaN(value) ? min : value
  const percentage = percentageFromValue(safeValue, min, max)
  const clampedValue = clamp(safeValue, min, max)
  const formattedValue =
    format === undefined
      ? formatValue(percentage / 100, locale, { style: 'percent' })
      : formatValue(value, locale, format)

  return {
    value,
    clampedValue,
    percentage,
    formattedValue,
    ariaValueText: formattedValue,
    min,
    max,
  }
}

// VIEW

export type MeterAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  label: ReadonlyArray<Attribute<Message>>
  track: ReadonlyArray<Attribute<Message>>
  indicator: ReadonlyArray<Attribute<Message>>
  value: ReadonlyArray<Attribute<Message>>
}>

export type ViewConfig<Message> = MeterOptions &
  Readonly<{
    toView: (attributes: MeterAttributes<Message>) => Html
  }>

export const indicatorStyle = (
  percentage: number,
): Readonly<Record<string, string>> => ({
  insetInlineStart: '0',
  height: 'inherit',
  width: `${percentage}%`,
})

export const valueText = (state: MeterState): string => state.formattedValue

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

const numberAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  name: string,
  value: number | undefined,
): ReadonlyArray<Attribute<Message>> =>
  value === undefined ? [] : [h.Attribute(name, String(value))]

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const { labelId, low, high, optimum, toView } = config
  const state = meterState(config)

  return toView({
    root: [
      h.Role('meter'),
      h.AriaValuemin(state.min),
      h.AriaValuemax(state.max),
      h.AriaValuenow(state.clampedValue),
      h.AriaValuetext(state.ariaValueText),
      ...ariaLabelledByAttribute(h, labelId),
      ...numberAttribute(h, 'low', low),
      ...numberAttribute(h, 'high', high),
      ...numberAttribute(h, 'optimum', optimum),
    ],
    label: [h.Role('presentation'), ...labelIdAttribute(h, labelId)],
    track: [],
    indicator: [h.Style(indicatorStyle(state.percentage))],
    value: [h.AriaHidden(true)],
  })
}
