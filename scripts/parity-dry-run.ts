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

import { execFile } from 'node:child_process'
import pathModule from 'node:path'
import { pathToFileURL } from 'node:url'
import { promisify } from 'node:util'

type ParitySlot = (typeof paritySlots)[number]

const execFileAsync = promisify(execFile)

const shadcnNamespaceGrep = (normalizedGrep: string): boolean =>
  normalizedGrep === 'shadcn' || normalizedGrep === 'shadcn/'

export const matchingParitySlots = (
  slots: ReadonlyArray<ParitySlot>,
  maybeGrep?: string,
): ReadonlyArray<ParitySlot> => {
  const normalizedGrep = maybeGrep?.toLowerCase()

  if (normalizedGrep === undefined) {
    return slots
  }

  if (shadcnNamespaceGrep(normalizedGrep)) {
    return slots.filter(slot => slot.itemId.startsWith('shadcn/'))
  }

  return slots.filter(slot =>
    slot.itemId.toLowerCase().includes(normalizedGrep),
  )
}

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

const printDiscoveredSlots = (
  matchingSlots: ReadonlyArray<ParitySlot>,
  maybeGrep: string | undefined,
): void => {
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

const normalizeSwitchDomAttributes = (
  attributes: ReadonlyArray<AttributeSummary>,
): ReadonlyArray<AttributeSummary> =>
  attributes.filter(attribute => {
    if (attribute.name === 'data-starting-style') {
      return false
    }

    if (
      attribute.name === 'data-can-scroll-next' ||
      attribute.name === 'data-can-scroll-previous' ||
      attribute.name === 'data-selected-index'
    ) {
      return false
    }

    if (attribute.name === 'aria-labelledby') {
      return false
    }

    if (
      attribute.name === 'aria-controls' &&
      (attribute.value.endsWith('-popup') ||
        attribute.value.startsWith('base-ui-') ||
        attribute.value.startsWith('sidebar-group-collapsible-') ||
        attribute.value.startsWith('sidebar-menu-collapsible-'))
    ) {
      return false
    }

    if (
      attribute.name === 'id' &&
      (attribute.value.startsWith('base-ui-') ||
        attribute.value.endsWith('-trigger') ||
        attribute.value.startsWith('sidebar-group-collapsible-') ||
        attribute.value.startsWith('sidebar-menu-collapsible-'))
    ) {
      return false
    }

    if (attribute.name === 'id' && attribute.value.endsWith('-label')) {
      return false
    }

    if (attribute.name === 'dir' && attribute.value === 'rtl') {
      return false
    }

    return true
  })

const comparisonReaders: Readonly<
  Record<ComparisonKind, (snapshot: FixtureSnapshot) => unknown>
> = {
  'class-tokens': snapshot => canonicalClassTokens(snapshot.className),
  attributes: snapshot =>
    normalizeSwitchDomAttributes(
      canonicalAttributes(snapshot.dom.attributes ?? {}),
    ),
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
  const attributes = normalizeSwitchDomAttributes(summary.attributes)

  if (summary.tagName === 'svg') {
    return {
      ...summary,
      attributes: selectedSvgAttributes(attributes),
      children: [],
    }
  }

  return {
    ...summary,
    attributes,
    children: summary.children.map(child => normalizeShadcnDomStructure(child)),
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
    return normalizeSwitchDomAttributes(snapshot.attributes)
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

const compareSlot = async (slot: ParitySlot): Promise<number> => {
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

export const shadcnComponentName = (itemId: string): string => {
  const componentName = itemId.split('/').at(1)

  if (componentName === undefined) {
    throw new Error(`Invalid shadcn parity slot id: ${itemId}`)
  }

  return componentName
}

export const shadcnCaseGrep = (itemId: string, maybeGrep?: string): string => {
  const componentName = shadcnComponentName(itemId)
  const normalizedGrep = maybeGrep?.toLowerCase()

  if (normalizedGrep === undefined || shadcnNamespaceGrep(normalizedGrep)) {
    return componentName
  }

  if (normalizedGrep.startsWith('shadcn/')) {
    return normalizedGrep.slice('shadcn/'.length)
  }

  if (componentName === 'input' && normalizedGrep === 'input') {
    return 'input-'
  }

  if (componentName === 'input-group') {
    return 'input-group-'
  }

  if (componentName === 'card' && normalizedGrep === 'card') {
    return 'card-'
  }

  if (componentName === 'table' && normalizedGrep === 'table') {
    return 'table-'
  }

  return normalizedGrep
}

const childOutput = async (args: ReadonlyArray<string>): Promise<string> => {
  const { stdout } = await execFileAsync(process.execPath, [...args], {
    cwd: process.cwd(),
    env: process.env,
    maxBuffer: 10 * 1024 * 1024,
  })

  return stdout
}

const captureShadcnSnapshotsInSubprocess = async (
  fixture: 'origin' | 'foldkit',
  grep: string,
): Promise<ReadonlyArray<OriginFixtureSnapshot>> => {
  const stdout = await childOutput([
    'run',
    'scripts/parity-dry-run.ts',
    `--capture-shadcn-${fixture}`,
    grep,
  ])

  try {
    const snapshots: ReadonlyArray<OriginFixtureSnapshot> = JSON.parse(stdout)

    return snapshots
  } catch (error: unknown) {
    throw new Error(`Unable to read ${fixture} shadcn snapshot JSON.`, {
      cause: error,
    })
  }
}

const compareShadcnSlot = async (
  slot: ParitySlot,
  maybeGrep?: string,
): Promise<number> => {
  const caseGrep = shadcnCaseGrep(slot.itemId, maybeGrep)
  const originSnapshots = await captureShadcnSnapshotsInSubprocess(
    'origin',
    caseGrep,
  )
  const foldkitSnapshots = await captureShadcnSnapshotsInSubprocess(
    'foldkit',
    caseGrep,
  )
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
  slot: ParitySlot,
  maybeGrep?: string,
): Promise<number> => {
  if (!slot.itemId.startsWith('shadcn/')) {
    return compareSlot(slot)
  }

  if (
    slot.originFixtureEntrypoint !==
      'tests/parity/fixtures/origin/shadcn/entry.tsx' ||
    slot.foldkitFixtureEntrypoint !==
      'tests/parity/fixtures/foldkit/shadcn/entry.ts'
  ) {
    return compareSlot(slot)
  }

  return compareShadcnSlot(slot, maybeGrep)
}

const runParity = async (
  matchingSlots: ReadonlyArray<ParitySlot>,
  maybeGrep?: string,
): Promise<void> => {
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

  const comparedCaseCount = await matchingSlots.reduce(
    async (pendingTotal, slot) => {
      const total = await pendingTotal
      const caseCount = await compareParitySlot(slot, maybeGrep)

      return total + caseCount
    },
    Promise.resolve(0),
  )

  console.log(
    `Compared ${comparedCaseCount} fixture case(s) across ${matchingSlots.length} parity slot(s).`,
  )
}

const captureShadcnSnapshotsForCli = async (
  fixture: 'origin' | 'foldkit',
  grep?: string,
): Promise<void> => {
  await ensureFixtureDom()

  if (fixture === 'origin') {
    const { captureShadcnOriginSnapshots } =
      await import('../tests/parity/fixtures/origin/shadcn/runner')
    const snapshots = await captureShadcnOriginSnapshots({ grep })

    process.stdout.write(JSON.stringify(snapshots))
    return
  }

  const { captureShadcnFoldkitSnapshots } =
    await import('../tests/parity/fixtures/foldkit/shadcn/runner')
  const snapshots = await captureShadcnFoldkitSnapshots({ grep })

  process.stdout.write(JSON.stringify(snapshots))
}

const runParityCli = async (args: ReadonlyArray<string>): Promise<void> => {
  const originCaptureIndex = args.indexOf('--capture-shadcn-origin')
  const foldkitCaptureIndex = args.indexOf('--capture-shadcn-foldkit')

  if (originCaptureIndex !== -1) {
    await captureShadcnSnapshotsForCli(
      'origin',
      args.at(originCaptureIndex + 1),
    )
    return
  }

  if (foldkitCaptureIndex !== -1) {
    await captureShadcnSnapshotsForCli(
      'foldkit',
      args.at(foldkitCaptureIndex + 1),
    )
    return
  }

  const grepIndex = args.indexOf('--grep')
  const maybeGrep = grepIndex === -1 ? undefined : args.at(grepIndex + 1)
  const dryRun = args.includes('--dry-run')
  const matchingSlots = matchingParitySlots(paritySlots, maybeGrep)

  if (dryRun) {
    printDiscoveredSlots(matchingSlots, maybeGrep)
  } else {
    await runParity(matchingSlots, maybeGrep)
  }
}

if (import.meta.main) {
  await runParityCli(process.argv.slice(2))
}
