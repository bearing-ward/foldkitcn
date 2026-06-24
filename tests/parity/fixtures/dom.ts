import type { FixtureSnapshot } from '../fixture'

const styleProperties = [
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

const attributesFromElement = (
  element: Element,
): Readonly<Record<string, string>> =>
  Object.fromEntries(
    element
      .getAttributeNames()
      .map(name => [name, element.getAttribute(name) ?? '']),
  )

const textFromElement = (element: Element): string =>
  [...element.childNodes]
    .filter(node => node.nodeType === 3)
    .map(node => node.textContent ?? '')
    .join('')

const computedStyleFromElement = (
  element: Element,
): Readonly<Record<string, string>> => {
  const style = element.ownerDocument.defaultView?.getComputedStyle(element)

  if (style === undefined) {
    return {}
  }

  return Object.fromEntries(
    styleProperties.map(property => [
      property,
      style.getPropertyValue(property),
    ]),
  )
}

export const snapshotElement = (
  element: Element,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'],
): FixtureSnapshot => {
  const boundingBox = element.getBoundingClientRect()
  const className =
    typeof element.className === 'string' ? element.className : ''

  return {
    dom: {
      tagName: element.tagName,
      attributes: attributesFromElement(element),
      text: textFromElement(element),
      children: [...element.children].map(
        child => snapshotElement(child, {}).dom,
      ),
    },
    className,
    computedStyle: computedStyleFromElement(element),
    boundingBox: {
      x: boundingBox.x,
      y: boundingBox.y,
      width: boundingBox.width,
      height: boundingBox.height,
    },
    keyboardBehavior,
  }
}
