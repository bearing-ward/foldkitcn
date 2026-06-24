import {
  canonicalAttributes,
  canonicalBoundingBox,
  canonicalClassTokens,
  canonicalComputedStyleSummary,
  canonicalDomStructure,
} from '../src/registry/parity/canonicalize'
import type {
  AttributeSummary,
  DomStructureSummary,
} from '../src/registry/parity/canonicalize'
import type {
  ComparisonKind,
  FixtureCase,
  FixtureModule,
  FixtureSnapshot,
} from '../tests/parity/fixture'
import type { OriginFixtureSnapshot } from '../tests/parity/fixtures/origin/shadcn/snapshot'
import { paritySlots } from '../tests/parity/slots'

import pathModule from 'node:path'
import { pathToFileURL } from 'node:url'

const args = process.argv.slice(2)
const grepIndex = args.indexOf('--grep')
const maybeGrep = grepIndex === -1 ? undefined : args.at(grepIndex + 1)
const dryRun = args.includes('--dry-run')
const normalizedGrep = maybeGrep?.toLowerCase()
const matchingSlots =
  normalizedGrep === undefined
    ? paritySlots
    : paritySlots.filter(slot =>
        slot.itemId.toLowerCase().includes(normalizedGrep),
      )

const defineGlobal = (name: string, value: unknown): void => {
  Object.defineProperty(globalThis, name, {
    value,
    writable: true,
    configurable: true,
  })
}

const ensureFixtureDom = async (): Promise<void> => {
  if (globalThis.window !== undefined && globalThis.document !== undefined) {
    return
  }

  const { Window } = await import('happy-dom')
  const window = new Window()
  const requestAnimationFrame = window.requestAnimationFrame.bind(window)
  const cancelAnimationFrame = window.cancelAnimationFrame.bind(window)

  defineGlobal('window', window)
  defineGlobal('document', window.document)
  defineGlobal('navigator', window.navigator)
  defineGlobal('HTMLElement', window.HTMLElement)
  defineGlobal('Element', window.Element)
  defineGlobal('Node', window.Node)
  defineGlobal('Event', window.Event)
  defineGlobal('MouseEvent', window.MouseEvent)
  defineGlobal('KeyboardEvent', window.KeyboardEvent)
  defineGlobal('PointerEvent', window.PointerEvent)
  defineGlobal('requestAnimationFrame', requestAnimationFrame)
  defineGlobal('cancelAnimationFrame', cancelAnimationFrame)
}

const printDiscoveredSlots = (): void => {
  if (matchingSlots.length === 0) {
    throw new Error(`No parity slots matched: ${maybeGrep ?? '<none>'}`)
  }

  console.log(`Discovered ${matchingSlots.length} parity slot(s):`)
  console.log(
    matchingSlots
      .map(slot =>
        [
          `- ${slot.itemId}`,
          `status=${slot.status}`,
          `origin=${slot.originFixtureEntrypoint}`,
          `foldkit=${slot.foldkitFixtureEntrypoint}`,
          `comparisons=${slot.comparisons.join(',')}`,
        ].join(' '),
      )
      .join('\n'),
  )
}

const loadFixtureModule = async (
  fixturePath: string,
): Promise<FixtureModule> => {
  const absolutePath = pathModule.resolve(fixturePath)
  const module = await import(pathToFileURL(absolutePath).href)

  if (!Array.isArray(module.cases)) {
    throw new TypeError(`Fixture module did not export cases: ${fixturePath}`)
  }

  return { cases: module.cases }
}

const assertEqual = (
  itemId: string,
  caseId: string,
  comparison: ComparisonKind,
  origin: unknown,
  foldkit: unknown,
): void => {
  const originJson = JSON.stringify(origin)
  const foldkitJson = JSON.stringify(foldkit)

  if (originJson !== foldkitJson) {
    throw new Error(
      [
        `${itemId}/${caseId} failed ${comparison}`,
        `origin=${originJson}`,
        `foldkit=${foldkitJson}`,
      ].join('\n'),
    )
  }
}

const colors = (snapshot: FixtureSnapshot) =>
  canonicalComputedStyleSummary(snapshot.computedStyle, [
    'background-color',
    'border-color',
    'color',
  ])

const dimensions = (snapshot: FixtureSnapshot) =>
  canonicalComputedStyleSummary(snapshot.computedStyle, [
    'height',
    'padding-bottom',
    'padding-left',
    'padding-right',
    'padding-top',
    'width',
  ])

const comparisonReaders: Readonly<
  Record<ComparisonKind, (snapshot: FixtureSnapshot) => unknown>
> = {
  'class-tokens': snapshot => canonicalClassTokens(snapshot.className),
  attributes: snapshot => canonicalAttributes(snapshot.dom.attributes ?? {}),
  'dom-structure': snapshot => canonicalDomStructure(snapshot.dom),
  'computed-style': snapshot =>
    canonicalComputedStyleSummary(snapshot.computedStyle),
  colors,
  dimensions,
  'bounding-box': snapshot => canonicalBoundingBox(snapshot.boundingBox),
  'keyboard-behavior': snapshot =>
    Object.entries(snapshot.keyboardBehavior).toSorted(([left], [right]) =>
      left.localeCompare(right),
    ),
}

const comparisonValue = (
  comparison: ComparisonKind,
  snapshot: FixtureSnapshot,
): unknown => comparisonReaders[comparison](snapshot)

const attributeValue = (
  attributes: ReadonlyArray<AttributeSummary>,
  name: string,
): string | undefined =>
  attributes.find(attribute => attribute.name === name)?.value

const selectedSvgAttributes = (
  attributes: ReadonlyArray<AttributeSummary>,
): ReadonlyArray<AttributeSummary> => {
  const isSpinner = attributeValue(attributes, 'data-slot') === 'spinner'
  const retainedNames = isSpinner
    ? ['aria-label', 'class', 'data-icon', 'data-slot', 'role']
    : ['data-icon']

  return attributes.filter(attribute => retainedNames.includes(attribute.name))
}

const normalizeShadcnDomStructure = (
  summary: DomStructureSummary,
): DomStructureSummary => {
  if (summary.tagName === 'svg') {
    return {
      ...summary,
      attributes: selectedSvgAttributes(summary.attributes),
      children: [],
    }
  }

  return {
    ...summary,
    children: summary.children.map(normalizeShadcnDomStructure),
  }
}

const shadcnComparisonValue = (
  comparison: ComparisonKind,
  snapshot: OriginFixtureSnapshot,
): unknown => {
  if (comparison === 'class-tokens') {
    return snapshot.classTokens
  }

  if (comparison === 'attributes') {
    return snapshot.attributes
  }

  if (comparison === 'dom-structure') {
    return normalizeShadcnDomStructure(snapshot.domStructure)
  }

  if (comparison === 'computed-style') {
    return snapshot.computedStyle
  }

  if (comparison === 'colors') {
    return snapshot.colors
  }

  if (comparison === 'dimensions') {
    return snapshot.dimensions
  }

  if (comparison === 'bounding-box') {
    return snapshot.boundingBox
  }

  return []
}

const foldkitCaseById = (
  cases: ReadonlyArray<FixtureCase>,
): ReadonlyMap<string, FixtureCase> =>
  new Map(cases.map(fixtureCase => [fixtureCase.id, fixtureCase]))

const compareFixtureCase = (
  itemId: string,
  comparisons: ReadonlyArray<ComparisonKind>,
  originCase: FixtureCase,
  foldkitCase: FixtureCase,
): void => {
  comparisons.map(comparison =>
    assertEqual(
      itemId,
      originCase.id,
      comparison,
      comparisonValue(comparison, originCase.snapshot),
      comparisonValue(comparison, foldkitCase.snapshot),
    ),
  )
}

const compareSlot = async (
  slot: (typeof paritySlots)[number],
): Promise<number> => {
  await ensureFixtureDom()

  const [originFixture, foldkitFixture] = await Promise.all([
    loadFixtureModule(slot.originFixtureEntrypoint),
    loadFixtureModule(slot.foldkitFixtureEntrypoint),
  ])
  const foldkitCases = foldkitCaseById(foldkitFixture.cases)

  return originFixture.cases.reduce((caseCount, originCase) => {
    const foldkitCase = foldkitCases.get(originCase.id)

    if (foldkitCase === undefined) {
      throw new Error(
        `${slot.itemId} missing Foldkit fixture case: ${originCase.id}`,
      )
    }

    compareFixtureCase(slot.itemId, slot.comparisons, originCase, foldkitCase)

    return caseCount + 1
  }, 0)
}

const shadcnSnapshotById = (
  snapshots: ReadonlyArray<OriginFixtureSnapshot>,
): ReadonlyMap<string, OriginFixtureSnapshot> =>
  new Map(snapshots.map(snapshot => [snapshot.caseId, snapshot]))

const shadcnComponentName = (itemId: string): string => {
  const componentName = itemId.split('/').at(1)

  if (componentName === undefined) {
    throw new Error(`Invalid shadcn parity slot id: ${itemId}`)
  }

  return componentName
}

const shadcnCaseGrep = (itemId: string): string => {
  const componentName = shadcnComponentName(itemId)

  if (maybeGrep === undefined || maybeGrep.includes('/')) {
    return componentName
  }

  return maybeGrep
}

const compareShadcnSlot = async (
  slot: (typeof paritySlots)[number],
): Promise<number> => {
  await ensureFixtureDom()

  const [{ captureShadcnOriginSnapshots }, { captureShadcnFoldkitSnapshots }] =
    await Promise.all([
      import('../tests/parity/fixtures/origin/shadcn/runner'),
      import('../tests/parity/fixtures/foldkit/shadcn/runner'),
    ])
  const caseGrep = shadcnCaseGrep(slot.itemId)
  const [originSnapshots, foldkitSnapshots] = await Promise.all([
    captureShadcnOriginSnapshots({ grep: caseGrep }),
    captureShadcnFoldkitSnapshots({ grep: caseGrep }),
  ])
  const foldkitSnapshotsById = shadcnSnapshotById(foldkitSnapshots)

  return originSnapshots.reduce((caseCount, originSnapshot) => {
    const foldkitSnapshot = foldkitSnapshotsById.get(originSnapshot.caseId)

    if (foldkitSnapshot === undefined) {
      throw new Error(
        `${slot.itemId} missing Foldkit fixture case: ${originSnapshot.caseId}`,
      )
    }

    slot.comparisons.reduce((comparisonCount, comparison) => {
      assertEqual(
        slot.itemId,
        originSnapshot.caseId,
        comparison,
        shadcnComparisonValue(comparison, originSnapshot),
        shadcnComparisonValue(comparison, foldkitSnapshot),
      )

      return comparisonCount + 1
    }, 0)

    return caseCount + 1
  }, 0)
}

const compareParitySlot = (
  slot: (typeof paritySlots)[number],
): Promise<number> =>
  slot.itemId.startsWith('shadcn/')
    ? compareShadcnSlot(slot)
    : compareSlot(slot)

const runParity = async (): Promise<void> => {
  if (matchingSlots.length === 0) {
    throw new Error(`No parity slots matched: ${maybeGrep ?? '<none>'}`)
  }

  const plannedSlots = matchingSlots.filter(slot => slot.status !== 'ready')

  if (plannedSlots.length > 0) {
    throw new Error(
      `Matched parity slots are still planned: ${plannedSlots
        .map(slot => slot.itemId)
        .join(', ')}`,
    )
  }

  const comparedCaseCounts = await Promise.all(
    matchingSlots.map(compareParitySlot),
  )
  const comparedCaseCount = comparedCaseCounts.reduce(
    (total, count) => total + count,
    0,
  )

  console.log(
    `Compared ${comparedCaseCount} fixture case(s) across ${matchingSlots.length} parity slot(s).`,
  )
}

if (dryRun) {
  printDiscoveredSlots()
} else {
  await runParity()
}
