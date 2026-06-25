import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import * as Meter from '../../../../../src/registry/base-ui/meter'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotElement } from '../../dom'

type VNodeLike = Readonly<{
  sel?: string
  text?: string
  data?: Readonly<{
    attrs?: Readonly<Record<string, unknown>>
    props?: Readonly<Record<string, unknown>>
    class?: Readonly<Record<string, boolean>>
    style?: Readonly<Record<string, string>>
  }>
  children?: ReadonlyArray<VNodeLike | string>
}>

type CaseConfig = Readonly<{
  id: string
  value: number
  min?: number
  max?: number
  low?: number
  high?: number
  optimum?: number
  label?: string
  labelId?: string
  includeValue?: boolean
}>

const visuallyHiddenStyle: Readonly<Record<string, string>> = {
  clipPath: 'inset(50%)',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  border: '0',
  padding: '0',
  width: '1px',
  height: '1px',
  margin: '-1px',
  position: 'fixed',
  top: '0',
  left: '0',
}

const isVNodeLike = (value: unknown): value is VNodeLike =>
  typeof value === 'object' && value !== null

const normalizeAttributeValue = (
  value: unknown,
): string | boolean | null | undefined => {
  if (
    typeof value === 'string' ||
    typeof value === 'boolean' ||
    value === null ||
    value === undefined
  ) {
    return value
  }

  if (typeof value === 'number') {
    return String(value)
  }

  return undefined
}

const classNameFromVNode = (vnode: VNodeLike): string =>
  Object.entries(vnode.data?.class ?? {})
    .filter(([, isActive]) => isActive)
    .map(([className]) => className)
    .join(' ')

const attributesFromVNode = (
  vnode: VNodeLike,
): Readonly<Record<string, string | boolean | null | undefined>> => {
  const attrs = Object.fromEntries(
    Object.entries(vnode.data?.attrs ?? {}).flatMap(([name, value]) => {
      const normalizedValue = normalizeAttributeValue(value)

      return normalizedValue === undefined ? [] : [[name, normalizedValue]]
    }),
  )
  const props = Object.fromEntries(
    Object.entries(vnode.data?.props ?? {}).flatMap(([name, value]) => {
      const normalizedValue = normalizeAttributeValue(value)

      return normalizedValue === undefined ? [] : [[name, normalizedValue]]
    }),
  )
  const className = classNameFromVNode(vnode)

  return className.length > 0
    ? { ...attrs, ...props, class: className }
    : { ...attrs, ...props }
}

const cssPropertyName = (property: string): string =>
  property.replaceAll(/[A-Z]/gu, match => `-${match.toLowerCase()}`)

const applyStyle = (
  element: HTMLElement,
  style: Readonly<Record<string, string>>,
): HTMLElement => {
  Object.entries(style).reduce((currentElement, [property, value]) => {
    currentElement.style.setProperty(cssPropertyName(property), value)

    return currentElement
  }, element)

  return element
}

const htmlToElement = (htmlNode: Html): Element => {
  if (!isVNodeLike(htmlNode)) {
    throw new Error('Expected Foldkit fixture to render a VNode.')
  }

  if (htmlNode.sel === undefined) {
    throw new Error('Expected Foldkit fixture root to render an element VNode.')
  }

  const element = document.createElement(htmlNode.sel)

  Object.entries(attributesFromVNode(htmlNode)).reduce(
    (currentElement, [name, value]) => {
      if (value === false || value === null || value === undefined) {
        return currentElement
      }

      const attributeName = name === 'tabIndex' ? 'tabindex' : name
      currentElement.setAttribute(
        attributeName,
        value === true ? '' : String(value),
      )

      return currentElement
    },
    element,
  )
  applyStyle(element, htmlNode.data?.style ?? {})

  const children = htmlNode.children ?? []

  children.reduce((currentElement, child) => {
    if (typeof child === 'string') {
      currentElement.append(document.createTextNode(child))
      return currentElement
    }

    if (child.sel === undefined) {
      currentElement.append(document.createTextNode(child.text ?? ''))
      return currentElement
    }

    currentElement.append(htmlToElement(child))
    return currentElement
  }, element)

  return element
}

const snapshotHtml = (htmlNode: Html): FixtureSnapshot => {
  const element = htmlToElement(htmlNode)

  document.body.append(element)
  const snapshot = snapshotElement(element, {})
  element.remove()

  return snapshot
}

const meterChildren = (
  h: ReturnType<typeof html<never>>,
  config: CaseConfig,
  attributes: Meter.MeterAttributes<never>,
  state: Meter.MeterState,
): ReadonlyArray<Html | string> => {
  const maybeLabel =
    config.label === undefined
      ? []
      : [h.span([...attributes.label], [config.label])]
  const maybeValue = config.includeValue
    ? [h.span([...attributes.value], [Meter.valueText(state)])]
    : []

  return [
    ...maybeLabel,
    ...maybeValue,
    h.div([...attributes.track], [h.div([...attributes.indicator], [])]),
    h.span([h.Role('presentation'), h.Style(visuallyHiddenStyle)], ['x']),
  ]
}

const renderFoldkitMeter = (config: CaseConfig): FixtureSnapshot => {
  const h = html<never>()
  const state = Meter.meterState(config)

  return snapshotHtml(
    Meter.view<never>({
      ...config,
      toView: attributes =>
        h.div(
          [...attributes.root],
          [...meterChildren(h, config, attributes, state)],
        ),
    }),
  )
}

const caseConfigs: ReadonlyArray<CaseConfig> = [
  {
    id: 'default-meter',
    value: 30,
  },
  {
    id: 'custom-range',
    value: 30,
    min: 20,
    max: 40,
    includeValue: true,
  },
  {
    id: 'low-high-optimum',
    value: 60,
    low: 20,
    high: 80,
    optimum: 60,
  },
  {
    id: 'label-value-composition',
    value: 45,
    label: 'Battery Level',
    labelId: 'meter-label',
    includeValue: true,
  },
]

export const cases: ReadonlyArray<FixtureCase> = caseConfigs.map(config => ({
  id: config.id,
  snapshot: renderFoldkitMeter(config),
}))
