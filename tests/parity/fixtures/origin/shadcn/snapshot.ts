import {
  canonicalAttributes,
  canonicalBoundingBox,
  canonicalClassTokens,
  canonicalComputedStyleSummary,
  canonicalDomStructure,
} from '../../../../../src/registry/parity/canonicalize'
import type {
  AttributeSummary,
  BoundingBox,
  DomSnapshot,
  DomStructureSummary,
} from '../../../../../src/registry/parity/canonicalize'

export interface OriginFixtureSnapshot {
  readonly caseId: string
  readonly originFilePath: string
  readonly tagName: string
  readonly attributes: ReadonlyArray<AttributeSummary>
  readonly classTokens: ReadonlyArray<string>
  readonly text: string
  readonly computedStyle: ReadonlyArray<AttributeSummary>
  readonly colors: ReadonlyArray<AttributeSummary>
  readonly dimensions: ReadonlyArray<AttributeSummary>
  readonly boundingBox: BoundingBox
  readonly domStructure: DomStructureSummary
}

interface OriginSnapshotMetadata {
  readonly caseId: string
  readonly originFilePath: string
}

const computedStyleProperties = [
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

const colorProperties = ['background-color', 'border-color', 'color']
const dimensionProperties = [
  'border-radius',
  'font-size',
  'height',
  'line-height',
  'padding-bottom',
  'padding-left',
  'padding-right',
  'padding-top',
  'width',
]

const styleRecord = (
  styles: CSSStyleDeclaration,
  properties: ReadonlyArray<string>,
): Readonly<Record<string, string>> =>
  Object.fromEntries(
    properties.map(property => [property, styles.getPropertyValue(property)]),
  )

const elementAttributes = (
  element: Element,
): Readonly<Record<string, string>> =>
  Object.fromEntries(
    [...element.attributes].map(attribute => [attribute.name, attribute.value]),
  )

const domSnapshot = (element: Element): DomSnapshot => ({
  tagName: element.tagName,
  attributes: elementAttributes(element),
  text: element.textContent ?? '',
  children: [...element.children].map(domSnapshot),
})

export const captureOriginSnapshot = (
  element: Element,
  metadata: OriginSnapshotMetadata,
): OriginFixtureSnapshot => {
  const styles = window.getComputedStyle(element)
  const boundingBox = element.getBoundingClientRect()

  return {
    caseId: metadata.caseId,
    originFilePath: metadata.originFilePath,
    tagName: element.tagName.toLowerCase(),
    attributes: canonicalAttributes(elementAttributes(element)),
    classTokens: canonicalClassTokens(element.getAttribute('class') ?? ''),
    text: element.textContent?.trim() ?? '',
    computedStyle: canonicalComputedStyleSummary(
      styleRecord(styles, computedStyleProperties),
      computedStyleProperties,
    ),
    colors: canonicalComputedStyleSummary(
      styleRecord(styles, colorProperties),
      colorProperties,
    ),
    dimensions: canonicalComputedStyleSummary(
      styleRecord(styles, dimensionProperties),
      dimensionProperties,
    ),
    boundingBox: canonicalBoundingBox({
      x: boundingBox.x,
      y: boundingBox.y,
      width: boundingBox.width,
      height: boundingBox.height,
    }),
    domStructure: canonicalDomStructure(domSnapshot(element)),
  }
}
