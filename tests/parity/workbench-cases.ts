import { Schema as S } from 'effect'

import {
  defaultWorkbenchComparisonPolicy,
  defaultWorkbenchEnvironment,
  ParityWorkbenchComparisonPolicy,
  ParityWorkbenchNeutralFixture as ParityWorkbenchNeutralFixtureSchema,
} from '../../src/registry/parity/workbench'
import type {
  ParityWorkbenchCase as ParityWorkbenchCaseType,
  ParityWorkbenchInteractionRecipe,
  ParityWorkbenchNeutralFixture,
} from '../../src/registry/parity/workbench'
import { paritySlots } from './slots'

const tabsFixturePath = 'tests/parity/fixtures/data/shadcn/tabs/tabs-demo.json'
const tabsOriginSourcePath = 'repos/ui/apps/v4/examples/base/tabs-demo.tsx'
const emptyFixturePath =
  'tests/parity/fixtures/data/shadcn/empty/empty-demo.json'
const emptyOriginSourcePath = 'repos/ui/apps/v4/examples/base/empty-demo.tsx'
const genericFixture = (
  itemId: string,
  caseId: string,
  originSourcePath: string,
): ParityWorkbenchNeutralFixture =>
  S.decodeUnknownSync(ParityWorkbenchNeutralFixtureSchema)({
    schemaVersion: 1,
    itemId,
    caseId,
    originSourcePath,
    tabs: [],
    selectedValue: '',
    orientation: 'horizontal',
    listVariant: '',
    disabledValues: [],
  })
let maybeTabsFixturePromise: Promise<ParityWorkbenchNeutralFixture> | undefined
let maybeEmptyFixturePromise: Promise<ParityWorkbenchNeutralFixture> | undefined

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

export const ensureFixtureDom = async (): Promise<void> => {
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

const loadOriginShadcnCaseMetadata = async (caseId: string) => {
  const module = await import('./fixtures/origin/shadcn/case-metadata')
  const maybeMetadata = module.shadcnOriginCaseMetadata.find(
    metadata => metadata.id === caseId,
  )

  if (maybeMetadata === undefined) {
    throw new Error(`Unknown shadcn origin fixture case metadata: ${caseId}`)
  }

  return maybeMetadata
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

const deriveEmptyNeutralFixture =
  async (): Promise<ParityWorkbenchNeutralFixture> => {
    const originCase = await loadOriginShadcnCaseMetadata('empty-demo')

    return S.decodeUnknownSync(ParityWorkbenchNeutralFixtureSchema)({
      schemaVersion: 1,
      itemId: 'shadcn/empty',
      caseId: 'empty-demo',
      originSourcePath: originCase.originFilePath,
      tabs: [],
      selectedValue: '',
      orientation: 'horizontal',
      listVariant: '',
      disabledValues: [],
    })
  }

export const loadShadcnEmptyWorkbenchFixture =
  (): Promise<ParityWorkbenchNeutralFixture> => {
    if (maybeEmptyFixturePromise === undefined) {
      maybeEmptyFixturePromise = deriveEmptyNeutralFixture()
    }

    return maybeEmptyFixturePromise
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

export const shadcnEmptyWorkbenchCase: ParityWorkbenchCaseType = {
  itemId: 'shadcn/empty',
  caseId: 'empty-demo',
  originKind: 'pinned-shadcn',
  originSourcePath: emptyOriginSourcePath,
  originHarnessPath: 'tests/parity/fixtures/origin/shadcn/entry.tsx',
  foldkitSourceHintPaths: [
    'src/registry/shadcn/empty/index.ts',
    'src/registry/shadcn/empty/examples.ts',
  ],
  neutralFixturePath: emptyFixturePath,
  environment: defaultWorkbenchEnvironment,
  captureZones: {
    rootSelector: '[data-origin-fixture-root] > *',
    portalSelectors: [],
    layerSelectors: [],
  },
  comparisonPolicy: defaultWorkbenchComparisonPolicy,
  interactionRecipes: [],
  allowedDeviations: [
    {
      id: 'empty-screenshot-advisory',
      scope: 'shadcn/empty#empty-demo',
      comparison: 'screenshots',
      reason: 'Pixel drift is advisory in workbench v1.',
      owner: 'src/registry/shadcn/empty/examples.ts',
    },
  ],
  reportPaths: {
    outputDir: '.parity-workbench/shadcn-empty/empty-demo',
    jsonPath: '.parity-workbench/shadcn-empty/empty-demo/report.json',
    markdownPath: '.parity-workbench/shadcn-empty/empty-demo/report.md',
    htmlPath: null,
    screenshotDir: '.parity-workbench/shadcn-empty/empty-demo/screenshots',
  },
}

const aggregateOriginHarnessPath =
  'tests/parity/fixtures/origin/shadcn/entry.tsx'
const aggregateCaptureZones = {
  rootSelector: '[data-origin-fixture-root] > *',
  portalSelectors: [],
  layerSelectors: [],
}
const hardWorkbenchComparisonPolicy = S.decodeUnknownSync(
  ParityWorkbenchComparisonPolicy,
)({
  hard: ['geometry'],
  advisory: ['screenshots'],
})
const fixtureShimComparisonPolicy = S.decodeUnknownSync(
  ParityWorkbenchComparisonPolicy,
)({ hard: [], advisory: ['geometry', 'screenshots'] })

const aggregateWorkbenchCase = (
  itemId: string,
  caseId: string,
  originSourcePath: string,
  sourceHints: ReadonlyArray<string>,
  interactionRecipes: ReadonlyArray<ParityWorkbenchInteractionRecipe>,
  rootSelector = '[data-origin-fixture-root] > *',
  comparisonPolicy = hardWorkbenchComparisonPolicy,
): ParityWorkbenchCaseType => ({
  itemId,
  caseId,
  originKind: 'pinned-shadcn',
  originSourcePath,
  originHarnessPath: aggregateOriginHarnessPath,
  foldkitSourceHintPaths: sourceHints,
  neutralFixturePath: `tests/parity/fixtures/data/${itemId.replace('/', '-')}/${caseId}.json`,
  environment: defaultWorkbenchEnvironment,
  captureZones: { ...aggregateCaptureZones, rootSelector },
  comparisonPolicy,
  interactionRecipes,
  allowedDeviations: [],
  reportPaths: {
    outputDir: `.parity-workbench/${itemId.replace('/', '-')}/${caseId}`,
    jsonPath: `.parity-workbench/${itemId.replace('/', '-')}/${caseId}/report.json`,
    markdownPath: `.parity-workbench/${itemId.replace('/', '-')}/${caseId}/report.md`,
    htmlPath: null,
    screenshotDir: `.parity-workbench/${itemId.replace('/', '-')}/${caseId}/screenshots`,
  },
})

const highRiskWorkbenchCases: ReadonlyArray<ParityWorkbenchCaseType> = [
  aggregateWorkbenchCase(
    'shadcn/popover',
    'popover-basic',
    'repos/ui/apps/v4/examples/base/popover-basic.tsx',
    [
      'src/registry/shadcn/popover/index.ts',
      'src/registry/shadcn/popover/examples.ts',
    ],
    [
      {
        id: 'open-popover',
        title: 'Open and dismiss PopoverBasic',
        steps: [
          { kind: 'click', selector: '[data-slot="popover-trigger"]' },
          { kind: 'escape' },
        ],
      },
    ],
    '[data-slot="popover-trigger"]',
  ),
  aggregateWorkbenchCase(
    'shadcn/tooltip',
    'tooltip-demo',
    'repos/ui/apps/v4/examples/base/tooltip-demo.tsx',
    [
      'src/registry/shadcn/tooltip/index.ts',
      'src/registry/shadcn/tooltip/examples.ts',
    ],
    [
      {
        id: 'open-tooltip',
        title: 'Open and dismiss TooltipDemo',
        steps: [
          { kind: 'hover', selector: '[data-slot="tooltip-trigger"]' },
          { kind: 'wait-for-stable-layout' },
          { kind: 'escape' },
        ],
      },
    ],
    '[data-slot="tooltip-trigger"]',
  ),
  aggregateWorkbenchCase(
    'shadcn/select',
    'select-demo',
    'repos/ui/apps/v4/examples/base/select-demo.tsx',
    [
      'src/registry/shadcn/select/index.ts',
      'src/registry/shadcn/select/examples.ts',
    ],
    [
      {
        id: 'open-select',
        title: 'Open and dismiss SelectDemo',
        steps: [
          { kind: 'click', selector: '[data-slot="select-trigger"]' },
          { kind: 'escape' },
        ],
      },
    ],
    '[data-slot="select-trigger"]',
  ),
  aggregateWorkbenchCase(
    'shadcn/dialog',
    'dialog-demo',
    'repos/ui/apps/v4/examples/base/dialog-demo.tsx',
    [
      'src/registry/shadcn/dialog/index.ts',
      'src/registry/shadcn/dialog/examples.ts',
    ],
    [
      {
        id: 'open-dialog',
        title: 'Open and dismiss DialogDemo',
        steps: [
          { kind: 'click', selector: '[data-slot="dialog-trigger"]' },
          { kind: 'escape' },
        ],
      },
    ],
    '[data-slot="dialog-trigger"]',
  ),
  aggregateWorkbenchCase(
    'shadcn/slider',
    'slider-demo',
    'repos/ui/apps/v4/examples/base/slider-demo.tsx',
    [
      'src/registry/shadcn/slider/index.ts',
      'src/registry/shadcn/slider/examples.ts',
    ],
    [
      {
        id: 'focus-slider',
        title: 'Focus SliderDemo',
        steps: [
          { kind: 'focus', selector: '[role="slider"]' },
          { kind: 'press-key', key: 'ArrowRight' },
          { kind: 'wait-for-stable-layout' },
        ],
      },
    ],
    '[data-origin-fixture-root] > *',
    fixtureShimComparisonPolicy,
  ),
  aggregateWorkbenchCase(
    'shadcn/bubble',
    'bubble-tooltip',
    'repos/ui/apps/v4/examples/base/bubble-tooltip.tsx',
    [
      'src/registry/shadcn/bubble/index.ts',
      'src/registry/shadcn/bubble/examples.ts',
    ],
    [
      {
        id: 'open-tooltip',
        title: 'Open the tooltip',
        steps: [
          { kind: 'hover', selector: '[data-slot="tooltip-trigger"]' },
          { kind: 'wait-for-stable-layout' },
        ],
      },
    ],
  ),
  aggregateWorkbenchCase(
    'shadcn/bubble',
    'bubble-popover',
    'repos/ui/apps/v4/examples/base/bubble-popover.tsx',
    [
      'src/registry/shadcn/bubble/index.ts',
      'src/registry/shadcn/bubble/examples.ts',
    ],
    [
      {
        id: 'open-popover',
        title: 'Open the popover',
        steps: [
          { kind: 'click', selector: '[data-slot="popover-trigger"]' },
          { kind: 'wait-for-stable-layout' },
        ],
      },
    ],
  ),
  aggregateWorkbenchCase(
    'shadcn/dropdown-menu',
    'dropdown-menu-submenu',
    'repos/ui/apps/v4/examples/base/dropdown-menu-submenu.tsx',
    [
      'src/registry/shadcn/dropdown-menu/index.ts',
      'src/registry/shadcn/dropdown-menu/examples.ts',
    ],
    [
      {
        id: 'open-submenu',
        title: 'Open the nested submenu',
        steps: [
          { kind: 'click', selector: '[data-slot="dropdown-menu-trigger"]' },
          {
            kind: 'hover',
            selector: '[data-slot="dropdown-menu-sub-trigger"]',
          },
          { kind: 'wait-for-stable-layout' },
        ],
      },
    ],
  ),
  aggregateWorkbenchCase(
    'shadcn/command',
    'command-dialog',
    'repos/ui/apps/v4/examples/base/command-dialog.tsx',
    [
      'src/registry/shadcn/command/index.ts',
      'src/registry/shadcn/command/examples.ts',
    ],
    [
      {
        id: 'open-command-dialog',
        title: 'Open and dismiss the command dialog',
        steps: [
          { kind: 'click', selector: '[data-slot="command-dialog-trigger"]' },
          { kind: 'escape' },
        ],
      },
    ],
  ),
  aggregateWorkbenchCase(
    'shadcn/sonner',
    'sonner-demo',
    'repos/ui/apps/v4/examples/base/sonner-demo.tsx',
    [
      'src/registry/shadcn/sonner/index.ts',
      'src/registry/shadcn/sonner/examples.ts',
    ],
    [
      {
        id: 'show-toast',
        title: 'Show a toast',
        steps: [
          { kind: 'click', selector: '[data-slot="sonner-trigger"]' },
          { kind: 'wait-for-stable-layout' },
        ],
      },
    ],
  ),
  aggregateWorkbenchCase(
    'shadcn/native-select',
    'native-select-demo',
    'repos/ui/apps/v4/examples/base/native-select-demo.tsx',
    [
      'src/registry/shadcn/native-select/index.ts',
      'src/registry/shadcn/native-select/examples.ts',
    ],
    [
      {
        id: 'focus-select',
        title: 'Focus the native select',
        steps: [
          { kind: 'focus', selector: 'select' },
          { kind: 'press-key', key: 'ArrowDown' },
        ],
      },
    ],
  ),
]

export const shadcnWorkbenchCases = [
  shadcnTabsWorkbenchCase,
  shadcnEmptyWorkbenchCase,
  ...highRiskWorkbenchCases,
]

export const shadcnTabsWorkbenchCases = [shadcnTabsWorkbenchCase]

export const resolveWorkbenchCase = (
  itemId: string,
  caseId: string,
): ParityWorkbenchCaseType => {
  requireReadySlot(itemId)
  const maybeWorkbenchCase = shadcnWorkbenchCases.find(
    candidate => candidate.itemId === itemId && candidate.caseId === caseId,
  )

  if (maybeWorkbenchCase !== undefined) {
    return maybeWorkbenchCase
  }

  throw new Error(
    `Unknown workbench case for ready parity slot: ${itemId}/${caseId}`,
  )
}

export const workbenchFixtureFor = (
  itemId: string,
  caseId: string,
): Promise<ParityWorkbenchNeutralFixture> => {
  resolveWorkbenchCase(itemId, caseId)

  if (itemId === 'shadcn/tabs' && caseId === 'tabs-demo') {
    return loadShadcnTabsWorkbenchFixture()
  }

  if (itemId === 'shadcn/empty' && caseId === 'empty-demo') {
    return loadShadcnEmptyWorkbenchFixture()
  }

  const maybeHighRiskCase = highRiskWorkbenchCases.find(
    workbenchCase =>
      workbenchCase.itemId === itemId && workbenchCase.caseId === caseId,
  )

  if (maybeHighRiskCase !== undefined) {
    return Promise.resolve(
      genericFixture(itemId, caseId, maybeHighRiskCase.originSourcePath),
    )
  }

  throw new Error(`Unknown workbench fixture: ${itemId}/${caseId}`)
}

export const validateWorkbenchCases =
  (): ReadonlyArray<ParityWorkbenchCaseType> =>
    shadcnWorkbenchCases.map(caseConfig => {
      requireReadySlot(caseConfig.itemId)
      return caseConfig
    })
