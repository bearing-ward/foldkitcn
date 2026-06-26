import type { Html } from 'foldkit/html'

import type { FixtureSnapshot } from '../../fixture'
import { snapshotElement } from '../dom'

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

export const htmlToStyledElement = (html: Html): Element => {
  if (!isVNodeLike(html)) {
    throw new Error('Expected Foldkit fixture to render a VNode.')
  }

  if (html.sel === undefined) {
    throw new Error('Expected Foldkit fixture root to render an element VNode.')
  }

  const element = document.createElement(html.sel)

  Object.entries(attributesFromVNode(html)).reduce(
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
  applyStyle(element, html.data?.style ?? {})

  const children = html.children ?? []

  children.reduce((currentElement, child) => {
    if (typeof child === 'string') {
      currentElement.append(document.createTextNode(child))
      return currentElement
    }

    if (child.sel === undefined) {
      currentElement.append(document.createTextNode(child.text ?? ''))
      return currentElement
    }

    currentElement.append(htmlToStyledElement(child))
    return currentElement
  }, element)

  return element
}

export const snapshotStyledHtml = (
  html: Html,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'],
): FixtureSnapshot => {
  const element = htmlToStyledElement(html)

  document.body.append(element)
  const snapshot = snapshotElement(element, keyboardBehavior)
  element.remove()

  return snapshot
}
