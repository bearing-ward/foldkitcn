import { chromium } from '@playwright/test'
import type { Page } from '@playwright/test'
import { Effect, Schema as S } from 'effect'
import { Command, Flag } from 'effect/unstable/cli'

import { canonicalBoundingBox } from '../src/registry/parity/canonicalize'
import type {
  AttributeSummary,
  BoundingBox,
} from '../src/registry/parity/canonicalize'
import {
  defaultWorkbenchComparisonPolicy,
  defaultWorkbenchEnvironment,
  ParityWorkbenchNeutralFixture as ParityWorkbenchNeutralFixtureSchema,
  renderWorkbenchMarkdownReport,
} from '../src/registry/parity/workbench'
import type {
  ParityWorkbenchCase,
  ParityWorkbenchComparisonKind,
  ParityWorkbenchNeutralFixture,
  ParityWorkbenchReportPaths,
} from '../src/registry/parity/workbench'
import type { OriginFixtureSnapshot } from '../tests/parity/fixtures/origin/shadcn/snapshot'
import {
  ensureFixtureDom,
  resolveWorkbenchCase,
  validateWorkbenchCases,
  workbenchFixtureFor,
} from '../tests/parity/workbench-cases'

import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const VERSION = '0.1.0'
const PARITY_RANDOM_SEED = 123_456_789
const PARITY_RANDOM_MULTIPLIER = 1_664_525
const PARITY_RANDOM_INCREMENT = 1_013_904_223
const PARITY_RANDOM_MODULUS = 4_294_967_296

type WorkbenchKind = 'origin' | 'foldkit'
type WorkbenchCapturePhase = 'initial' | 'before' | 'after'

type WorkbenchCliInput = Readonly<{
  itemId: string
  caseId: string
  outputDir: string
  dryRun: boolean
  writeFixture: boolean
}>

type AccessibilitySnapshot = Readonly<{
  role?: string
  name?: string
  description?: string
  focused?: boolean
  selected?: boolean
  checked?: boolean
  expanded?: boolean
  pressed?: boolean
  disabled?: boolean
  children?: ReadonlyArray<AccessibilitySnapshot>
}>

type FocusedElementSummary = Readonly<{
  tagName: string
  role: string | null
  text: string
  ariaLabel: string | null
}>

type ScrollMetrics = Readonly<{
  scrollLeft: number
  scrollTop: number
  scrollWidth: number
  scrollHeight: number
  clientWidth: number
  clientHeight: number
}>

type BrowserState = Readonly<{
  snapshot: OriginFixtureSnapshot
  allComputedStyles: ReadonlyArray<AttributeSummary>
  customProperties: ReadonlyArray<AttributeSummary>
  accessibilityTree: AccessibilitySnapshot | null
  focusedElement: FocusedElementSummary | null
  clientRects: ReadonlyArray<BoundingBox>
  scrollMetrics: ScrollMetrics
  screenshotPath: string
  screenshotHash: string
}>

type WorkbenchCapture = Readonly<{
  kind: WorkbenchKind
  label: string
  recipeId: string | null
  stepIndex: number | null
  phase: WorkbenchCapturePhase
  state: BrowserState
}>

type ComparisonFinding = Readonly<{
  kind: ParityWorkbenchComparisonKind
  summary: string
  expected: unknown
  actual: unknown
}>

type ComparisonGroup = Readonly<{
  kind: ParityWorkbenchComparisonKind
  status: 'passed' | 'failed' | 'advisory'
  findings: ReadonlyArray<ComparisonFinding>
}>

type WorkbenchReport = Readonly<{
  schemaVersion: 1
  generatedAt: string
  command: string
  itemId: string
  caseId: string
  originSourcePath: string
  originHarnessPath: string
  foldkitSourceHintPaths: ReadonlyArray<string>
  environment: typeof defaultWorkbenchEnvironment
  captureZones: ParityWorkbenchCase['captureZones']
  comparisonPolicy: typeof defaultWorkbenchComparisonPolicy
  reportPaths: ParityWorkbenchReportPaths
  fixtureData: ParityWorkbenchNeutralFixture
  origin: BrowserState
  foldkit: BrowserState
  captures: ReadonlyArray<WorkbenchCapture>
  comparisons: ReadonlyArray<ComparisonGroup>
  hardFailures: ReadonlyArray<ComparisonFinding>
  advisoryDifferences: ReadonlyArray<ComparisonFinding>
  fixtureDifferences: ReadonlyArray<ComparisonFinding>
  appliedDeviations: ParityWorkbenchCase['allowedDeviations']
  likelyOwnerFiles: ReadonlyArray<string>
}>

const logWorkbenchStage = (message: string): void => {
  console.log(`[parity:workbench] ${message}`)
}

const ensureDir = async (dirPath: string): Promise<void> => {
  await mkdir(dirPath, { recursive: true })
}

const readJson = async (filePath: string): Promise<unknown> =>
  JSON.parse(await readFile(filePath, 'utf-8'))

const writeJson = async (filePath: string, value: unknown): Promise<void> => {
  await ensureDir(path.dirname(filePath))
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf-8')
}

const stableHash = async (filePath: string): Promise<string> => {
  const bytes = await readFile(filePath)
  return createHash('sha256').update(bytes).digest('hex')
}

const captureGlobalName = (kind: WorkbenchKind): string =>
  kind === 'origin' ? '__SHADCN_ORIGIN_FIXTURE__' : '__SHADCN_FOLDKIT_FIXTURE__'

const captureLabel = (
  recipeId: string | null,
  stepIndex: number | null,
  phase: WorkbenchCapturePhase,
): string => {
  if (recipeId === null || stepIndex === null) {
    return 'initial'
  }

  return `${recipeId}/step-${stepIndex + 1}-${phase}`
}

const rootSelectorFor = (
  workbenchCase: ParityWorkbenchCase,
  kind: WorkbenchKind,
): string =>
  kind === 'origin'
    ? workbenchCase.captureZones.rootSelector
    : workbenchCase.captureZones.rootSelector.replace(
        '[data-origin-fixture-root]',
        '[data-foldkit-fixture-root]',
      )

const allStyleEntries = (
  page: Page,
  selector: string,
): Promise<ReadonlyArray<AttributeSummary>> =>
  page.evaluate(currentSelector => {
    const element = document.querySelector(currentSelector)

    if (element === null) {
      throw new Error(`Unable to find element for selector: ${currentSelector}`)
    }

    const styles = window.getComputedStyle(element)

    return [...styles]
      .filter((property): property is string => property !== null)
      .map(property => ({
        name: property,
        value: styles.getPropertyValue(property),
      }))
      .toSorted((left, right) => left.name.localeCompare(right.name))
  }, selector)

const customPropertyEntries = (
  page: Page,
  selector: string,
): Promise<ReadonlyArray<AttributeSummary>> =>
  page.evaluate(currentSelector => {
    const element = document.querySelector(currentSelector)

    if (element === null) {
      throw new Error(`Unable to find element for selector: ${currentSelector}`)
    }

    const styles = window.getComputedStyle(element)

    return [...styles]
      .filter(
        (property): property is string =>
          property !== null && property.startsWith('--'),
      )
      .map(property => ({
        name: property,
        value: styles.getPropertyValue(property),
      }))
      .toSorted((left, right) => left.name.localeCompare(right.name))
  }, selector)

const clientRectEntries = (
  page: Page,
  selector: string,
): Promise<ReadonlyArray<BoundingBox>> =>
  page.evaluate(currentSelector => {
    const element = document.querySelector(currentSelector)

    if (element === null) {
      throw new Error(`Unable to find element for selector: ${currentSelector}`)
    }

    return [...element.getClientRects()].map(rect => ({
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    }))
  }, selector)

const scrollMetricsFor = (
  page: Page,
  selector: string,
): Promise<ScrollMetrics> =>
  page.evaluate(currentSelector => {
    const element = document.querySelector(currentSelector)

    if (element === null) {
      throw new Error(`Unable to find element for selector: ${currentSelector}`)
    }

    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop,
      scrollWidth: element.scrollWidth,
      scrollHeight: element.scrollHeight,
      clientWidth: element.clientWidth,
      clientHeight: element.clientHeight,
    }
  }, selector)

const focusedElementSummary = (
  page: Page,
): Promise<FocusedElementSummary | null> =>
  page.evaluate(() => {
    const element = document.activeElement

    if (element === null) {
      return null
    }

    return {
      tagName: element.tagName.toLowerCase(),
      role: element.getAttribute('role'),
      text: element.textContent?.trim() ?? '',
      ariaLabel: element.getAttribute('aria-label'),
    }
  })

const accessibilitySnapshot = (
  page: Page,
  selector: string,
): Promise<AccessibilitySnapshot | null> =>
  page.evaluate(currentSelector => {
    const root = document.querySelector(currentSelector)

    if (root === null) {
      return null
    }

    // eslint-disable-next-line unicorn/consistent-function-scoping
    const describe = (element: Element): AccessibilitySnapshot => {
      const ariaLabel = element.getAttribute('aria-label') ?? undefined
      const ariaLabelledBy = element.getAttribute('aria-labelledby')
      const ariaDescribedBy = element.getAttribute('aria-describedby')
      const role = element.getAttribute('role') ?? undefined
      const text = element.textContent?.trim() ?? ''
      const children = [...element.children].map(child => describe(child))
      let maybeName = ariaLabel

      if (maybeName === undefined && ariaLabelledBy !== null) {
        maybeName = text.length > 0 ? text : ariaLabelledBy
      }

      return {
        role,
        name: maybeName,
        description: ariaDescribedBy ?? undefined,
        focused: element === document.activeElement,
        selected: element.getAttribute('aria-selected') === 'true',
        checked: element.getAttribute('aria-checked') === 'true',
        expanded: element.getAttribute('aria-expanded') === 'true',
        pressed: element.getAttribute('aria-pressed') === 'true',
        disabled:
          element.hasAttribute('disabled') ||
          element.getAttribute('aria-disabled') === 'true',
        children: children.length > 0 ? children : undefined,
      }
    }

    return describe(root)
  }, selector)

const captureState = async (
  page: Page,
  kind: WorkbenchKind,
  selector: string,
  screenshotPath: string,
): Promise<BrowserState> => {
  const locator = page.locator(selector).first()
  logWorkbenchStage(`Waiting for ${kind} root ${selector}`)
  try {
    await locator.waitFor({ state: 'attached', timeout: 5000 })
  } catch (error: unknown) {
    const bodyText = await page.locator('body').textContent()
    const message = error instanceof Error ? error.message : String(error)

    throw new Error(
      [
        `Unable to capture ${kind} root ${selector}`,
        message,
        `body=${bodyText ?? ''}`,
      ].join('\n'),
      { cause: error },
    )
  }
  logWorkbenchStage(`Screenshotting ${kind} root ${selector}`)
  await ensureDir(path.dirname(screenshotPath))
  await locator.screenshot({ path: screenshotPath })
  logWorkbenchStage(`Collecting ${kind} browser state`)

  const snapshot = await page.evaluate(globalName => {
    const maybeFixture = Reflect.get(globalThis, globalName)

    if (
      typeof maybeFixture !== 'object' ||
      maybeFixture === null ||
      !('captureSnapshot' in maybeFixture) ||
      typeof maybeFixture.captureSnapshot !== 'function'
    ) {
      throw new Error(`Unable to find capture snapshot helper: ${globalName}`)
    }

    return maybeFixture.captureSnapshot()
  }, captureGlobalName(kind))
  logWorkbenchStage(`Collected ${kind} DOM snapshot`)
  const allComputedStyles = await allStyleEntries(page, selector)
  logWorkbenchStage(`Collected ${kind} computed styles`)
  const customProperties = await customPropertyEntries(page, selector)
  logWorkbenchStage(`Collected ${kind} custom properties`)
  const accessibilityTree = await accessibilitySnapshot(page, selector)
  logWorkbenchStage(`Collected ${kind} accessibility tree`)
  const focusedElement = await focusedElementSummary(page)
  logWorkbenchStage(`Collected ${kind} focused element`)
  const clientRects = await clientRectEntries(page, selector)
  logWorkbenchStage(`Collected ${kind} client rects`)
  const scrollMetrics = await scrollMetricsFor(page, selector)
  logWorkbenchStage(`Collected ${kind} scroll metrics`)

  return {
    snapshot,
    allComputedStyles,
    customProperties,
    accessibilityTree,
    focusedElement,
    clientRects,
    scrollMetrics,
    screenshotPath,
    screenshotHash: await stableHash(screenshotPath),
  }
}

const captureLabeledState = async (
  page: Page,
  kind: WorkbenchKind,
  selector: string,
  screenshotPath: string,
  recipeId: string | null,
  stepIndex: number | null,
  phase: WorkbenchCapturePhase,
): Promise<WorkbenchCapture> => ({
  kind,
  label: captureLabel(recipeId, stepIndex, phase),
  recipeId,
  stepIndex,
  phase,
  state: await captureState(page, kind, selector, screenshotPath),
})

const requireBrowserState = (
  captures: ReadonlyArray<WorkbenchCapture>,
  label: string,
): BrowserState => {
  const capture = captures.find(candidate => candidate.label === label)

  if (capture === undefined) {
    throw new Error(`Missing ${label} browser capture.`)
  }

  return capture.state
}

const collectAttributesByPrefix = (
  node: OriginFixtureSnapshot['domStructure'],
  prefix: string,
): ReadonlyArray<Readonly<{ name: string; value: string }>> => {
  const current = node.attributes
    .filter(attribute => attribute.name.startsWith(prefix))
    .map(attribute => ({ name: attribute.name, value: attribute.value }))
  const children = node.children?.flatMap(child =>
    collectAttributesByPrefix(child, prefix),
  )

  return [...current, ...(children ?? [])].toSorted((left, right) =>
    left.name.localeCompare(right.name),
  )
}

const collectRoles = (
  node: OriginFixtureSnapshot['domStructure'],
): ReadonlyArray<string> => {
  const maybeRole = node.attributes.find(attribute => attribute.name === 'role')
  const currentRole = maybeRole === undefined ? [] : [maybeRole.value]
  const childRoles = node.children?.flatMap(child => collectRoles(child)) ?? []

  return [...currentRole, ...childRoles].toSorted()
}

const compareJson = (
  kind: ParityWorkbenchComparisonKind,
  expected: unknown,
  actual: unknown,
  statusIfDifferent: 'failed' | 'advisory' = 'failed',
): ComparisonGroup => {
  const expectedJson = JSON.stringify(expected)
  const actualJson = JSON.stringify(actual)

  if (expectedJson === actualJson) {
    return { kind, status: 'passed', findings: [] }
  }

  return {
    kind,
    status: statusIfDifferent,
    findings: [
      {
        kind,
        summary: 'Values differ.',
        expected,
        actual,
      },
    ],
  }
}

const compareGeometry = (
  kind: ParityWorkbenchComparisonKind,
  expected: ReadonlyArray<BoundingBox>,
  actual: ReadonlyArray<BoundingBox>,
): ComparisonGroup => {
  const tolerance = 1
  const valuesMatch =
    expected.length === actual.length &&
    expected.every((box, index) => {
      const candidate = actual[index]

      if (candidate === undefined) {
        return false
      }

      return (
        Math.abs(box.x - candidate.x) <= tolerance &&
        Math.abs(box.y - candidate.y) <= tolerance &&
        Math.abs(box.width - candidate.width) <= tolerance &&
        Math.abs(box.height - candidate.height) <= tolerance
      )
    })

  if (valuesMatch) {
    return { kind, status: 'passed', findings: [] }
  }

  return {
    kind,
    status: 'failed',
    findings: [
      {
        kind,
        summary: 'Geometry differs beyond tolerance.',
        expected,
        actual,
      },
    ],
  }
}

const compareBrowserPair = (
  origin: BrowserState,
  foldkit: BrowserState,
  fixtureDataExpected: ParityWorkbenchNeutralFixture,
  fixtureDataActual: ParityWorkbenchNeutralFixture,
  phaseLabel: string,
  includeSnapshotBoundingBox: boolean,
): ReadonlyArray<ComparisonGroup> => [
  compareJson(
    'dom-structure',
    origin.snapshot.domStructure,
    foldkit.snapshot.domStructure,
  ),
  compareJson(
    'attributes',
    origin.snapshot.attributes,
    foldkit.snapshot.attributes,
  ),
  compareJson(
    'roles',
    collectRoles(origin.snapshot.domStructure),
    collectRoles(foldkit.snapshot.domStructure),
  ),
  compareJson(
    'aria-state',
    collectAttributesByPrefix(origin.snapshot.domStructure, 'aria-'),
    collectAttributesByPrefix(foldkit.snapshot.domStructure, 'aria-'),
  ),
  compareJson(
    'accessible-name',
    origin.accessibilityTree?.name ?? null,
    foldkit.accessibilityTree?.name ?? null,
  ),
  compareJson(
    'class-tokens',
    origin.snapshot.classTokens,
    foldkit.snapshot.classTokens,
  ),
  compareJson(
    'computed-style',
    origin.snapshot.computedStyle,
    foldkit.snapshot.computedStyle,
  ),
  compareJson('colors', origin.snapshot.colors, foldkit.snapshot.colors),
  compareJson(
    'dimensions',
    origin.snapshot.dimensions,
    foldkit.snapshot.dimensions,
  ),
  compareGeometry(
    'geometry',
    includeSnapshotBoundingBox
      ? [
          canonicalBoundingBox(origin.snapshot.boundingBox),
          ...origin.clientRects,
        ]
      : origin.clientRects,
    includeSnapshotBoundingBox
      ? [
          canonicalBoundingBox(foldkit.snapshot.boundingBox),
          ...foldkit.clientRects,
        ]
      : foldkit.clientRects,
  ),
  compareJson('fixture-data', fixtureDataExpected, fixtureDataActual),
  compareJson(
    'interaction-state',
    {
      snapshot: origin.snapshot.domStructure,
      accessibilityName: origin.accessibilityTree?.name ?? null,
      focusedElement: origin.focusedElement,
      phaseLabel,
    },
    {
      snapshot: foldkit.snapshot.domStructure,
      accessibilityName: foldkit.accessibilityTree?.name ?? null,
      focusedElement: foldkit.focusedElement,
      phaseLabel,
    },
  ),
  compareJson(
    'screenshots',
    origin.screenshotHash,
    foldkit.screenshotHash,
    'advisory',
  ),
  compareJson(
    'all-computed-style',
    origin.allComputedStyles,
    foldkit.allComputedStyles,
    'advisory',
  ),
  compareJson(
    'accessibility-tree',
    origin.accessibilityTree,
    foldkit.accessibilityTree,
    'advisory',
  ),
  {
    kind: 'animation-timing',
    status: 'advisory',
    findings: [
      {
        kind: 'animation-timing',
        summary: `Animation timing is advisory in v1 for ${phaseLabel}.`,
        expected: null,
        actual: null,
      },
    ],
  },
]

const comparisonFailures = (
  comparisons: ReadonlyArray<ComparisonGroup>,
  hardKinds: ReadonlyArray<ParityWorkbenchComparisonKind>,
): ReadonlyArray<ComparisonFinding> =>
  comparisons.flatMap(group =>
    group.status === 'failed' && hardKinds.includes(group.kind)
      ? group.findings
      : [],
  )

const advisoryFindings = (
  comparisons: ReadonlyArray<ComparisonGroup>,
): ReadonlyArray<ComparisonFinding> =>
  comparisons.flatMap(group =>
    group.status === 'advisory' ? group.findings : [],
  )

const loadFixtureData = async (
  workbenchCase: ParityWorkbenchCase,
): Promise<ParityWorkbenchNeutralFixture | null> => {
  if (!existsSync(workbenchCase.neutralFixturePath)) {
    return null
  }

  return S.decodeUnknownSync(ParityWorkbenchNeutralFixtureSchema)(
    await readJson(workbenchCase.neutralFixturePath),
  )
}

const runInteractionStep = (
  page: Page,
  step: ParityWorkbenchCase['interactionRecipes'][number]['steps'][number],
): Promise<void> => {
  if (step.kind === 'click') {
    return page.locator(step.selector).first().click()
  }

  if (step.kind === 'hover') {
    return page.locator(step.selector).first().hover()
  }

  if (step.kind === 'focus') {
    return page.locator(step.selector).first().focus()
  }

  if (step.kind === 'tab') {
    return page.keyboard.press('Tab')
  }

  if (step.kind === 'press-key') {
    return page.keyboard.press(step.key)
  }

  if (step.kind === 'escape') {
    return page.keyboard.press('Escape')
  }

  if (step.kind === 'outside-click') {
    return page.mouse.click(1, 1)
  }

  return page.waitForTimeout(32)
}

const captureSource = async (
  kind: WorkbenchKind,
  workbenchCase: ParityWorkbenchCase,
  baseUrl: string,
  screenshotDir: string,
): Promise<ReadonlyArray<WorkbenchCapture>> => {
  logWorkbenchStage(`Launching ${kind} browser`)
  const browser = await chromium.launch()

  try {
    logWorkbenchStage(`Creating ${kind} browser context`)
    const context = await browser.newContext({
      viewport: workbenchCase.environment.viewport,
      locale: workbenchCase.environment.locale,
      colorScheme: workbenchCase.environment.colorScheme,
    })
    const page = await context.newPage()
    page.on('pageerror', error => {
      logWorkbenchStage(`${kind} pageerror: ${error.message}`)
    })
    page.on('response', response => {
      if (response.status() >= 500) {
        logWorkbenchStage(
          `${kind} response ${response.status()}: ${response.url()}`,
        )
      }
    })
    page.on('console', message => {
      if (message.type() === 'error') {
        logWorkbenchStage(`${kind} console error: ${message.text()}`)
      }
    })

    await page.addInitScript(
      ({ increment, modulus, multiplier, seed }) => {
        let state = Math.trunc(seed) % modulus

        Math.random = () => {
          state = (multiplier * state + increment) % modulus
          return state / modulus
        }
      },
      {
        increment: PARITY_RANDOM_INCREMENT,
        modulus: PARITY_RANDOM_MODULUS,
        multiplier: PARITY_RANDOM_MULTIPLIER,
        seed: PARITY_RANDOM_SEED,
      },
    )
    await page.emulateMedia({
      colorScheme: workbenchCase.environment.colorScheme,
      reducedMotion: workbenchCase.environment.reducedMotion,
    })

    const url = new URL(baseUrl)
    url.searchParams.set('case', workbenchCase.caseId)
    logWorkbenchStage(`Navigating ${kind} page`)
    await page.goto(url.toString(), { waitUntil: 'domcontentloaded' })
    await page.evaluate(direction => {
      document.documentElement.dir = direction
    }, workbenchCase.environment.direction)

    logWorkbenchStage(`Capturing ${kind} initial state`)
    const initialState = await captureLabeledState(
      page,
      kind,
      rootSelectorFor(workbenchCase, kind),
      path.join(screenshotDir, `${kind}-initial.png`),
      null,
      null,
      'initial',
    )
    const states = [initialState]

    const captureRecipeStep = async (
      recipe: ParityWorkbenchCase['interactionRecipes'][number],
      stepIndex: number,
    ): Promise<void> => {
      const step = recipe.steps[stepIndex]

      if (step === undefined) {
        return
      }

      const stepNumber = stepIndex + 1
      const beforeLabel = `${recipe.id}/step-${stepNumber}-before`
      const afterLabel = `${recipe.id}/step-${stepNumber}-after`

      logWorkbenchStage(`Capturing ${kind} ${beforeLabel}`)
      states.push(
        await captureLabeledState(
          page,
          kind,
          rootSelectorFor(workbenchCase, kind),
          path.join(
            screenshotDir,
            `${kind}-${recipe.id}-step-${stepNumber}-before.png`,
          ),
          recipe.id,
          stepIndex,
          'before',
        ),
      )
      logWorkbenchStage(
        `Running ${kind} recipe ${recipe.id} step ${stepNumber}`,
      )
      await runInteractionStep(page, step)
      logWorkbenchStage(`Capturing ${kind} ${afterLabel}`)
      states.push(
        await captureLabeledState(
          page,
          kind,
          rootSelectorFor(workbenchCase, kind),
          path.join(
            screenshotDir,
            `${kind}-${recipe.id}-step-${stepNumber}-after.png`,
          ),
          recipe.id,
          stepIndex,
          'after',
        ),
      )
      await captureRecipeStep(recipe, stepIndex + 1)
    }

    const captureRecipeSequence = async (index: number): Promise<void> => {
      const recipe = workbenchCase.interactionRecipes[index]

      if (recipe === undefined) {
        return
      }

      await captureRecipeStep(recipe, 0)
      await captureRecipeSequence(index + 1)
    }

    await captureRecipeSequence(0)

    await context.close()
    return states
  } finally {
    await browser.close()
  }
}

const workbenchReportPaths = (
  workbenchCase: ParityWorkbenchCase,
  outputDir: string,
): ParityWorkbenchReportPaths => ({
  outputDir: path.join(
    outputDir,
    workbenchCase.itemId.replaceAll('/', '-'),
    workbenchCase.caseId,
  ),
  jsonPath: path.join(
    outputDir,
    workbenchCase.itemId.replaceAll('/', '-'),
    workbenchCase.caseId,
    'report.json',
  ),
  markdownPath: path.join(
    outputDir,
    workbenchCase.itemId.replaceAll('/', '-'),
    workbenchCase.caseId,
    'report.md',
  ),
  htmlPath: null,
  screenshotDir: path.join(
    outputDir,
    workbenchCase.itemId.replaceAll('/', '-'),
    workbenchCase.caseId,
    'screenshots',
  ),
})

const dryRunSummary = (
  workbenchCase: ParityWorkbenchCase,
  reportPaths: ParityWorkbenchReportPaths,
): string =>
  [
    `Workbench item: ${workbenchCase.itemId}`,
    `Workbench case: ${workbenchCase.caseId}`,
    `Origin kind: ${workbenchCase.originKind}`,
    `Origin source: ${workbenchCase.originSourcePath}`,
    `Origin harness: ${workbenchCase.originHarnessPath}`,
    `Environment: ${JSON.stringify(workbenchCase.environment)}`,
    `Capture root: ${workbenchCase.captureZones.rootSelector}`,
    `Portal selectors: ${
      workbenchCase.captureZones.portalSelectors.length === 0
        ? 'none'
        : workbenchCase.captureZones.portalSelectors.join(', ')
    }`,
    `Layer selectors: ${
      workbenchCase.captureZones.layerSelectors.length === 0
        ? 'none'
        : workbenchCase.captureZones.layerSelectors.join(', ')
    }`,
    `Comparison policy: ${JSON.stringify(workbenchCase.comparisonPolicy)}`,
    `Report JSON: ${reportPaths.jsonPath}`,
    `Report Markdown: ${reportPaths.markdownPath}`,
    `Screenshot dir: ${reportPaths.screenshotDir}`,
  ].join('\n')

const buildLikelyOwnerFiles = (
  workbenchCase: ParityWorkbenchCase,
): ReadonlyArray<string> => [
  ...new Set([
    ...workbenchCase.foldkitSourceHintPaths,
    workbenchCase.originHarnessPath,
    workbenchCase.neutralFixturePath,
    'src/styles.css',
  ]),
]

const commandFor = (input: WorkbenchCliInput): string =>
  `bun run parity:workbench -- --item ${input.itemId} --case ${input.caseId}${
    input.outputDir === '.parity-workbench'
      ? ''
      : ` --output ${input.outputDir}`
  }${input.writeFixture ? ' --write-fixture' : ''}`

const runWorkbench = async (input: WorkbenchCliInput): Promise<void> => {
  validateWorkbenchCases()
  const workbenchCase = resolveWorkbenchCase(input.itemId, input.caseId)
  const reportPaths = workbenchReportPaths(workbenchCase, input.outputDir)

  if (input.dryRun) {
    console.log(dryRunSummary(workbenchCase, reportPaths))
    return
  }

  logWorkbenchStage(
    `Loaded case ${workbenchCase.itemId}/${workbenchCase.caseId}`,
  )
  logWorkbenchStage('Loading fixture data')
  const loadedFixture = await loadFixtureData(workbenchCase)
  const harvestedFixture = await workbenchFixtureFor(input.itemId, input.caseId)
  let activeFixture = loadedFixture ?? harvestedFixture

  if (
    input.writeFixture &&
    (loadedFixture === null ||
      JSON.stringify(loadedFixture) !== JSON.stringify(harvestedFixture))
  ) {
    await writeJson(workbenchCase.neutralFixturePath, harvestedFixture)
    activeFixture = harvestedFixture
  }

  await ensureFixtureDom()

  const {
    createFixtureServer: createOriginFixtureServer,
    serverUrl: originServerUrl,
  } = await import('../tests/parity/fixtures/origin/shadcn/runner')
  const {
    createFixtureServer: createFoldkitFixtureServer,
    serverUrl: foldkitServerUrl,
  } = await import('../tests/parity/fixtures/foldkit/shadcn/runner')

  logWorkbenchStage('Starting origin fixture server')
  const originFixtureServer = await createOriginFixtureServer()
  logWorkbenchStage('Starting foldkit fixture server')
  const foldkitFixtureServer = await createFoldkitFixtureServer()

  try {
    logWorkbenchStage('Capturing origin and foldkit browser state')
    const [originCaptures, foldkitCaptures] = await Promise.all([
      captureSource(
        'origin',
        workbenchCase,
        originServerUrl(originFixtureServer),
        reportPaths.screenshotDir,
      ),
      captureSource(
        'foldkit',
        workbenchCase,
        foldkitServerUrl(foldkitFixtureServer),
        reportPaths.screenshotDir,
      ),
    ])

    const foldkitCaptureByLabel = new Map(
      foldkitCaptures.map(capture => [capture.label, capture]),
    )

    const comparisons = originCaptures.flatMap(originCapture => {
      const foldkitCapture = foldkitCaptureByLabel.get(originCapture.label)

      if (foldkitCapture === undefined) {
        return []
      }

      return compareBrowserPair(
        originCapture.state,
        foldkitCapture.state,
        harvestedFixture,
        activeFixture,
        originCapture.label,
        workbenchCase.captureZones.rootSelector ===
          '[data-origin-fixture-root] > *',
      )
    })

    const hardFailures = comparisonFailures(
      comparisons,
      workbenchCase.comparisonPolicy.hard,
    )
    const advisoryDifferences = advisoryFindings(comparisons)
    let fixtureDifferences: ReadonlyArray<ComparisonFinding> = []

    if (input.writeFixture) {
      fixtureDifferences = []
    } else if (loadedFixture === null) {
      fixtureDifferences = [
        {
          kind: 'fixture-data',
          summary: 'Neutral fixture file is missing.',
          expected: harvestedFixture,
          actual: null,
        },
      ]
    } else {
      fixtureDifferences = compareJson(
        'fixture-data',
        harvestedFixture,
        activeFixture,
      ).findings
    }

    const report: WorkbenchReport = {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      command: commandFor(input),
      itemId: workbenchCase.itemId,
      caseId: workbenchCase.caseId,
      originSourcePath: workbenchCase.originSourcePath,
      originHarnessPath: workbenchCase.originHarnessPath,
      foldkitSourceHintPaths: workbenchCase.foldkitSourceHintPaths,
      environment: defaultWorkbenchEnvironment,
      captureZones: workbenchCase.captureZones,
      comparisonPolicy: defaultWorkbenchComparisonPolicy,
      reportPaths,
      fixtureData: harvestedFixture,
      origin: requireBrowserState(originCaptures, 'initial'),
      foldkit: requireBrowserState(foldkitCaptures, 'initial'),
      captures: [...originCaptures, ...foldkitCaptures],
      comparisons,
      hardFailures,
      advisoryDifferences,
      fixtureDifferences,
      appliedDeviations: workbenchCase.allowedDeviations,
      likelyOwnerFiles: buildLikelyOwnerFiles(workbenchCase),
    }

    logWorkbenchStage('Writing report artifacts')
    await ensureDir(reportPaths.outputDir)
    await writeJson(reportPaths.jsonPath, report)
    await writeFile(
      reportPaths.markdownPath,
      `${renderWorkbenchMarkdownReport({
        itemId: report.itemId,
        caseId: report.caseId,
        command: report.command,
        originSourcePath: report.originSourcePath,
        foldkitSourceHintPaths: report.foldkitSourceHintPaths,
        captureZones: report.captureZones,
        environment: report.environment,
        reportPaths: report.reportPaths,
        captures: report.captures,
        hardFailures: report.hardFailures,
        advisoryDifferences: report.advisoryDifferences,
        fixtureDifferences: report.fixtureDifferences,
        appliedDeviations: report.appliedDeviations,
        likelyOwnerFiles: report.likelyOwnerFiles,
      })}\n`,
      'utf-8',
    )

    console.log(`Wrote ${reportPaths.jsonPath}`)
    console.log(`Wrote ${reportPaths.markdownPath}`)

    if (hardFailures.length > 0 || fixtureDifferences.length > 0) {
      logWorkbenchStage(
        `Completed with ${hardFailures.length} hard differences and ${fixtureDifferences.length} fixture differences.`,
      )
    }
  } finally {
    await originFixtureServer.close()
    await foldkitFixtureServer.close()
  }
}

const createWorkbenchCommand = () =>
  Command.make(
    'parity-workbench',
    {
      itemId: Flag.string('item').pipe(
        Flag.withDescription('Workbench item id, for example shadcn/tabs.'),
      ),
      caseId: Flag.string('case').pipe(
        Flag.withDescription('Workbench case id, for example tabs-demo.'),
      ),
      outputDir: Flag.string('output').pipe(
        Flag.withDefault('.parity-workbench'),
        Flag.withDescription('Output directory for local workbench artifacts.'),
      ),
      dryRun: Flag.boolean('dry-run').pipe(
        Flag.withDescription(
          'Resolve the workbench plan without launching browsers.',
        ),
      ),
      writeFixture: Flag.boolean('write-fixture').pipe(
        Flag.withDescription(
          'Update the neutral fixture proposal from origin data.',
        ),
      ),
    },
    input =>
      Effect.promise(() =>
        runWorkbench({
          itemId: input.itemId,
          caseId: input.caseId,
          outputDir: input.outputDir,
          dryRun: input.dryRun,
          writeFixture: input.writeFixture,
        }),
      ),
  ).pipe(
    Command.withDescription(
      'Run the agent-first shadcn parity workbench for one selected case.',
    ),
  )

export const runParityWorkbenchCli = (args: ReadonlyArray<string>) =>
  Command.runWith(createWorkbenchCommand(), { version: VERSION })(args)

if (import.meta.main) {
  await Effect.runPromise(runParityWorkbenchCli(process.argv.slice(2)))
}
