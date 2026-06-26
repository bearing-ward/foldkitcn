import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import * as Slider from '../../../../../src/registry/base-ui/slider'
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

type CaseConfig = Omit<Slider.ViewConfig<never>, 'toView'>

const keyboardBehavior = {
  click: 'activates',
  Enter: 'suppressed',
  Space: 'suppressed',
  ArrowDown: 'activates',
  ArrowLeft: 'activates',
  ArrowRight: 'activates',
  ArrowUp: 'activates',
  Home: 'activates',
  End: 'activates',
  PageDown: 'activates',
  PageUp: 'activates',
  mousedown: 'passes-through',
  pointerdown: 'activates',
}

const suppressedKeyboard = {
  click: 'suppressed',
  Enter: 'suppressed',
  Space: 'suppressed',
  ArrowDown: 'suppressed',
  ArrowLeft: 'suppressed',
  ArrowRight: 'suppressed',
  ArrowUp: 'suppressed',
  Home: 'suppressed',
  End: 'suppressed',
  PageDown: 'suppressed',
  PageUp: 'suppressed',
  mousedown: 'suppressed',
  pointerdown: 'suppressed',
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

const snapshotHtml = (htmlNode: Html, config: CaseConfig): FixtureSnapshot => {
  const element = htmlToElement(htmlNode)

  document.body.append(element)
  const snapshot = snapshotElement(
    element,
    config.isDisabled === true ? suppressedKeyboard : keyboardBehavior,
  )
  element.remove()

  return snapshot
}

const sliderView = (config: CaseConfig): Html => {
  const h = html<never>()

  return Slider.view<never>({
    ...config,
    toView: attributes =>
      h.div(
        [...attributes.root],
        [
          h.div(
            [...attributes.control],
            [
              h.div(
                [...attributes.track],
                [h.div([...attributes.indicator], [])],
              ),
              ...attributes.thumbs.map(thumb =>
                h.div([...thumb.root], [h.input([...thumb.input])]),
              ),
            ],
          ),
          h.output(
            [...attributes.value],
            [Slider.valueText(Slider.sliderState(config))],
          ),
        ],
      ),
  })
}

const caseConfigs: ReadonlyArray<CaseConfig & { readonly caseId: string }> = [
  {
    caseId: 'single-horizontal',
    values: [75],
    max: 100,
    step: 1,
  },
  {
    caseId: 'range-horizontal',
    values: [25, 50],
    max: 100,
    step: 5,
  },
  {
    caseId: 'disabled-vertical',
    values: [50],
    max: 100,
    step: 1,
    orientation: 'vertical',
    isDisabled: true,
  },
  {
    caseId: 'multiple-thumbs',
    values: [10, 20, 70],
    max: 100,
    step: 10,
  },
]

export const cases: ReadonlyArray<FixtureCase> = caseConfigs.map(config => ({
  id: config.caseId,
  snapshot: snapshotHtml(sliderView(config), config),
}))
