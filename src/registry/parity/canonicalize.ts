import { Array, Order } from 'effect'

export type AttributeValue = string | boolean | null | undefined

export interface AttributeSummary {
  readonly name: string
  readonly value: string
}

export interface DomSnapshot {
  readonly tagName: string
  readonly attributes?: Readonly<Record<string, AttributeValue>>
  readonly text?: string
  readonly children?: ReadonlyArray<DomSnapshot>
}

export interface DomStructureSummary {
  readonly tagName: string
  readonly attributes: ReadonlyArray<AttributeSummary>
  readonly text: string
  readonly children: ReadonlyArray<DomStructureSummary>
}

export interface BoundingBox {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}

const defaultStyleProperties = [
  'background-color',
  'border-color',
  'border-radius',
  'color',
  'display',
  'font-size',
  'height',
  'line-height',
  'opacity',
  'padding-bottom',
  'padding-left',
  'padding-right',
  'padding-top',
  'width',
]

const collapseWhitespace = (value: string): string =>
  value.trim().replaceAll(/\s+/gu, ' ')

export const canonicalClassTokens = (
  className: string,
): ReadonlyArray<string> =>
  Array.sort(
    [...new Set(collapseWhitespace(className).split(' ').filter(Boolean))],
    Order.String,
  )

export const canonicalAttributes = (
  attributes: Readonly<Record<string, AttributeValue>>,
): ReadonlyArray<AttributeSummary> =>
  Object.entries(attributes)
    .flatMap(([name, value]) => {
      if (value === false || value === null || value === undefined) {
        return []
      }

      return [
        {
          name: name.toLowerCase(),
          value: value === true ? '' : collapseWhitespace(value),
        },
      ]
    })
    .sort((left, right) => left.name.localeCompare(right.name))

export const canonicalDimension = (value: number): number => {
  const rounded = Math.round(value * 1000) / 1000

  return Object.is(rounded, -0) ? 0 : rounded
}

export const canonicalBoundingBox = (box: BoundingBox): BoundingBox => ({
  x: canonicalDimension(box.x),
  y: canonicalDimension(box.y),
  width: canonicalDimension(box.width),
  height: canonicalDimension(box.height),
})

export const canonicalColor = (value: string): string => {
  const color = value.trim().toLowerCase()
  const hexMatch =
    /^#(?<red>[0-9a-f]{2})(?<green>[0-9a-f]{2})(?<blue>[0-9a-f]{2})$/u.exec(
      color,
    )

  if (hexMatch !== null) {
    const { blue = '0', green = '0', red = '0' } = hexMatch.groups ?? {}

    return `rgba(${Number.parseInt(red ?? '0', 16)}, ${Number.parseInt(
      green ?? '0',
      16,
    )}, ${Number.parseInt(blue ?? '0', 16)}, 1)`
  }

  const rgbMatch = /^rgba?\((?<channels>[^)]+)\)$/u.exec(color)

  if (rgbMatch !== null) {
    const channels = (rgbMatch.groups?.channels ?? '')
      .split(',')
      .map(channel => channel.trim())
    const red = Number.parseFloat(channels.at(0) ?? '0')
    const green = Number.parseFloat(channels.at(1) ?? '0')
    const blue = Number.parseFloat(channels.at(2) ?? '0')
    const alpha = Number.parseFloat(channels.at(3) ?? '1')

    return `rgba(${canonicalDimension(red)}, ${canonicalDimension(
      green,
    )}, ${canonicalDimension(blue)}, ${canonicalDimension(alpha)})`
  }

  return color
}

const canonicalStyleValue = (property: string, value: string): string => {
  const normalized = value.trim().toLowerCase()
  const pixelMatch = /^(?<value>-?\d+(?:\.\d+)?)px$/u.exec(normalized)

  if (property.includes('color')) {
    return canonicalColor(normalized)
  }

  if (pixelMatch !== null) {
    return `${canonicalDimension(
      Number.parseFloat(pixelMatch.groups?.value ?? '0'),
    )}px`
  }

  return collapseWhitespace(normalized)
}

export const canonicalComputedStyleSummary = (
  styles: Readonly<Record<string, string>>,
  properties: ReadonlyArray<string> = defaultStyleProperties,
): ReadonlyArray<AttributeSummary> =>
  properties
    .flatMap(property => {
      const value = styles[property]

      return value === undefined
        ? []
        : [
            {
              name: property,
              value: canonicalStyleValue(property, value),
            },
          ]
    })
    .sort((left, right) => left.name.localeCompare(right.name))

export const canonicalDomStructure = (
  snapshot: DomSnapshot,
): DomStructureSummary => ({
  tagName: snapshot.tagName.toLowerCase(),
  attributes: canonicalAttributes(snapshot.attributes ?? {}),
  text: collapseWhitespace(snapshot.text ?? ''),
  children: (snapshot.children ?? []).map(canonicalDomStructure),
})
