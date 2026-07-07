import { Schema as S } from 'effect'

import {
  defaultWorkbenchComparisonPolicy,
  defaultWorkbenchEnvironment,
  ParityWorkbenchNeutralFixture as ParityWorkbenchNeutralFixtureSchema,
} from '../../src/registry/parity/workbench'
import type {
  ParityWorkbenchCase as ParityWorkbenchCaseType,
  ParityWorkbenchNeutralFixture,
} from '../../src/registry/parity/workbench'
import { paritySlots } from './slots'

const tabsFixturePath = 'tests/parity/fixtures/data/shadcn/tabs/tabs-demo.json'
const tabsOriginSourcePath = 'repos/ui/apps/v4/examples/base/tabs-demo.tsx'
let maybeTabsFixturePromise: Promise<ParityWorkbenchNeutralFixture> | undefined

const requireReadySlot = (itemId: string) => {
  const slot = paritySlots.find(candidate => candidate.itemId === itemId)

  if (slot === undefined) {
    throw new Error(`Missing parity slot for workbench item: ${itemId}`)
  }

  if (slot.status !== 'ready') {
    throw new Error(`Workbench item is not ready yet: ${itemId}`)
  }

  return slot
}

const ensureFixtureDom = async (): Promise<void> => {
  if (globalThis.window !== undefined && globalThis.document !== undefined) {
    return
  }

  const { Window } = await import('happy-dom')
  const window = new Window()

  Object.assign(globalThis, {
    window,
    document: window.document,
    navigator: window.navigator,
    HTMLElement: window.HTMLElement,
    Element: window.Element,
    Node: window.Node,
    Event: window.Event,
    MouseEvent: window.MouseEvent,
    KeyboardEvent: window.KeyboardEvent,
    PointerEvent: window.PointerEvent,
    requestAnimationFrame: window.requestAnimationFrame.bind(window),
    cancelAnimationFrame: window.cancelAnimationFrame.bind(window),
  })
}

const loadOriginTabsCases = async () => {
  await ensureFixtureDom()
  const module = await import('./fixtures/origin/shadcn/tabs.fixture')

  return module.cases
}

const firstTabsFixture = async () => {
  const originTabsCases = await loadOriginTabsCases()
  const maybeFixture = originTabsCases.find(
    fixtureCase => fixtureCase.id === 'tabs-demo',
  )

  if (maybeFixture === undefined) {
    throw new Error('Unable to derive neutral fixture data for shadcn/tabs.')
  }

  return maybeFixture.snapshot
}

const tabNodes = async () => {
  const snapshot = await firstTabsFixture()
  const listNode = snapshot.dom.children?.at(0)

  if (listNode === undefined) {
    throw new Error('Tabs fixture did not render a tab list.')
  }

  return listNode.children ?? []
}

const tabValueFromId = (id: string | undefined): string =>
  id === undefined ? '' : id.replace(/-tab$/u, '')

const deriveNeutralFixture =
  async (): Promise<ParityWorkbenchNeutralFixture> => {
    const snapshot = await firstTabsFixture()
    const tabList = await tabNodes()
    const tabs = tabList.map(tab => ({
      id: tab.attributes?.id ?? '',
      value: tabValueFromId(tab.attributes?.id),
      label: tab.text ?? '',
    }))
    const selectedValue =
      tabList.find(tab => tab.attributes?.['aria-selected'] === 'true')
        ?.attributes?.id ?? 'overview-tab'
    const disabledValues = tabList
      .filter(tab => tab.attributes?.['aria-disabled'] === 'true')
      .map(tab => tabValueFromId(tab.attributes?.id))
      .filter(Boolean)

    return S.decodeUnknownSync(ParityWorkbenchNeutralFixtureSchema)({
      schemaVersion: 1,
      itemId: 'shadcn/tabs',
      caseId: 'tabs-demo',
      originSourcePath: tabsOriginSourcePath,
      tabs,
      selectedValue: tabValueFromId(selectedValue),
      orientation:
        snapshot.dom.children?.[0]?.attributes?.['aria-orientation'] ===
        'vertical'
          ? 'vertical'
          : 'horizontal',
      listVariant: String(
        snapshot.dom.children?.[0]?.attributes?.['data-variant'] ?? 'default',
      ),
      disabledValues,
    })
  }

export const loadShadcnTabsWorkbenchFixture =
  (): Promise<ParityWorkbenchNeutralFixture> => {
    if (maybeTabsFixturePromise === undefined) {
      maybeTabsFixturePromise = deriveNeutralFixture()
    }

    return maybeTabsFixturePromise
  }

export const shadcnTabsWorkbenchCase: ParityWorkbenchCaseType = {
  itemId: 'shadcn/tabs',
  caseId: 'tabs-demo',
  originKind: 'pinned-shadcn',
  originSourcePath: tabsOriginSourcePath,
  originHarnessPath: 'tests/parity/fixtures/origin/shadcn/tabs.fixture.ts',
  foldkitSourceHintPaths: [
    'src/registry/shadcn/tabs/index.ts',
    'src/registry/shadcn/tabs/examples.ts',
  ],
  neutralFixturePath: tabsFixturePath,
  environment: defaultWorkbenchEnvironment,
  captureZones: {
    rootSelector: '[data-origin-fixture-root] > *',
    portalSelectors: [],
    layerSelectors: [],
  },
  comparisonPolicy: defaultWorkbenchComparisonPolicy,
  interactionRecipes: [
    {
      id: 'switch-tabs',
      title: 'Switch the selected tab',
      steps: [
        { kind: 'focus', selector: '[role="tab"]' },
        {
          kind: 'click',
          selector: '[data-slot="tabs-trigger"]:has-text("Analytics")',
        },
        { kind: 'press-key', key: 'ArrowLeft' },
        { kind: 'wait-for-stable-layout' },
      ],
    },
  ],
  allowedDeviations: [
    {
      id: 'tabs-screenshot-advisory',
      scope: 'shadcn/tabs#tabs-demo',
      comparison: 'screenshots',
      reason: 'Pixel drift is advisory in workbench v1.',
      owner: 'src/registry/shadcn/tabs/examples.ts',
    },
  ],
  reportPaths: {
    outputDir: '.parity-workbench/shadcn-tabs/tabs-demo',
    jsonPath: '.parity-workbench/shadcn-tabs/tabs-demo/report.json',
    markdownPath: '.parity-workbench/shadcn-tabs/tabs-demo/report.md',
    htmlPath: null,
    screenshotDir: '.parity-workbench/shadcn-tabs/tabs-demo/screenshots',
  },
}

export const shadcnTabsWorkbenchCases = [shadcnTabsWorkbenchCase]

export const resolveWorkbenchCase = (
  itemId: string,
  caseId: string,
): ParityWorkbenchCaseType => {
  const slot = requireReadySlot(itemId)

  if (itemId === 'shadcn/tabs' && caseId === 'tabs-demo') {
    void slot
    return shadcnTabsWorkbenchCase
  }

  throw new Error(`Unknown workbench case: ${itemId}/${caseId}`)
}

export const workbenchFixtureFor = (
  itemId: string,
  caseId: string,
): Promise<ParityWorkbenchNeutralFixture> => {
  if (itemId === 'shadcn/tabs' && caseId === 'tabs-demo') {
    return loadShadcnTabsWorkbenchFixture()
  }

  throw new Error(`Unknown workbench fixture: ${itemId}/${caseId}`)
}

export const validateWorkbenchCases =
  (): ReadonlyArray<ParityWorkbenchCaseType> =>
    shadcnTabsWorkbenchCases.map(caseConfig => {
      requireReadySlot(caseConfig.itemId)
      return caseConfig
    })
