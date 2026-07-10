import { describe, expect, test } from 'vitest'

import { renderWorkbenchMarkdownReport } from '../../src/registry/parity/workbench'
import {
  resolveWorkbenchCase,
  loadShadcnEmptyWorkbenchFixture,
  loadShadcnTabsWorkbenchFixture,
  validateWorkbenchCases,
  workbenchFixtureFor,
} from './workbench-cases'

describe('parity workbench config', () => {
  test('resolves the shadcn tabs workbench case from the ready slot', () => {
    const workbenchCase = resolveWorkbenchCase('shadcn/tabs', 'tabs-demo')

    expect(workbenchCase.itemId).toBe('shadcn/tabs')
    expect(workbenchCase.caseId).toBe('tabs-demo')
    expect(workbenchCase.originSourcePath).toBe(
      'repos/ui/apps/v4/examples/base/tabs-demo.tsx',
    )
    expect(workbenchCase.foldkitSourceHintPaths).toStrictEqual([
      'src/registry/shadcn/tabs/index.ts',
      'src/registry/shadcn/tabs/examples.ts',
    ])
    expect(workbenchCase.reportPaths.jsonPath).toContain('.parity-workbench')
  })

  test('resolves the shadcn empty workbench case from the ready slot', () => {
    const workbenchCase = resolveWorkbenchCase('shadcn/empty', 'empty-demo')

    expect(workbenchCase.itemId).toBe('shadcn/empty')
    expect(workbenchCase.caseId).toBe('empty-demo')
    expect(workbenchCase.originSourcePath).toBe(
      'repos/ui/apps/v4/examples/base/empty-demo.tsx',
    )
    expect(workbenchCase.foldkitSourceHintPaths).toStrictEqual([
      'src/registry/shadcn/empty/index.ts',
      'src/registry/shadcn/empty/examples.ts',
    ])
    expect(workbenchCase.interactionRecipes).toStrictEqual([])
  })

  test('uses shadcn empty report paths under the workbench output directory', () => {
    const workbenchCase = resolveWorkbenchCase('shadcn/empty', 'empty-demo')

    expect(workbenchCase.reportPaths.jsonPath).toBe(
      '.parity-workbench/shadcn-empty/empty-demo/report.json',
    )
  })

  test('validates the declared workbench case registry against slots', () => {
    expect(
      validateWorkbenchCases().map(workbenchCase => workbenchCase.itemId),
    ).toStrictEqual([
      'shadcn/tabs',
      'shadcn/empty',
      'shadcn/data-table',
      'shadcn/date-picker',
      'shadcn/popover',
      'shadcn/tooltip',
      'shadcn/select',
      'shadcn/dialog',
      'shadcn/slider',
      'shadcn/bubble',
      'shadcn/bubble',
      'shadcn/dropdown-menu',
      'shadcn/command',
      'shadcn/sonner',
      'shadcn/native-select',
    ])
  })

  test('loads the neutral tabs fixture proposal from the harvested source data', () =>
    expect(
      workbenchFixtureFor('shadcn/tabs', 'tabs-demo'),
    ).resolves.toMatchObject({
      itemId: 'shadcn/tabs',
      caseId: 'tabs-demo',
    }))

  test('loads the neutral empty fixture proposal from the aggregate source data', () =>
    expect(
      workbenchFixtureFor('shadcn/empty', 'empty-demo'),
    ).resolves.toMatchObject({
      itemId: 'shadcn/empty',
      caseId: 'empty-demo',
      originSourcePath: 'repos/ui/apps/v4/examples/base/empty-demo.tsx',
      tabs: [],
      disabledValues: [],
    }))

  test('loads the harvested fixture through the lazy origin snapshot import', async () => {
    await expect(loadShadcnTabsWorkbenchFixture()).resolves.toStrictEqual(
      await workbenchFixtureFor('shadcn/tabs', 'tabs-demo'),
    )
  })

  test('loads the empty fixture through the lazy aggregate case import', async () => {
    await expect(loadShadcnEmptyWorkbenchFixture()).resolves.toStrictEqual(
      await workbenchFixtureFor('shadcn/empty', 'empty-demo'),
    )
  })

  test('reports chart as a missing workbench parity surface', () => {
    expect(() => resolveWorkbenchCase('shadcn/chart', 'chart-demo')).toThrow(
      'Missing parity slot for workbench item: shadcn/chart',
    )
  })

  test('reports toast as a missing workbench parity surface', () => {
    expect(() => resolveWorkbenchCase('shadcn/toast', 'toast-demo')).toThrow(
      'Missing parity slot for workbench item: shadcn/toast',
    )
  })

  test('reports an unregistered case for an otherwise ready workbench item', () => {
    expect(() => resolveWorkbenchCase('shadcn/empty', 'empty-outline')).toThrow(
      'Unknown workbench case for ready parity slot: shadcn/empty/empty-outline',
    )
  })

  test('renders a markdown report contract', () => {
    const markdown = renderWorkbenchMarkdownReport({
      itemId: 'shadcn/tabs',
      caseId: 'tabs-demo',
      command:
        'bun run parity:workbench -- --item shadcn/tabs --case tabs-demo',
      originSourcePath: 'repos/ui/apps/v4/examples/base/tabs-demo.tsx',
      foldkitSourceHintPaths: [
        'src/registry/shadcn/tabs/index.ts',
        'src/registry/shadcn/tabs/examples.ts',
      ],
      captureZones: {
        rootSelector: '[data-origin-fixture-root] > *',
        portalSelectors: [],
        layerSelectors: [],
      },
      environment: {
        viewport: { width: 800, height: 400 },
        colorScheme: 'light',
        reducedMotion: 'reduce',
        locale: 'en-US',
        direction: 'ltr',
      },
      reportPaths: {
        outputDir: '.parity-workbench/shadcn-tabs/tabs-demo',
        jsonPath: '.parity-workbench/shadcn-tabs/tabs-demo/report.json',
        markdownPath: '.parity-workbench/shadcn-tabs/tabs-demo/report.md',
        htmlPath: null,
        screenshotDir: '.parity-workbench/shadcn-tabs/tabs-demo/screenshots',
      },
      captures: [
        {
          kind: 'origin',
          label: 'initial',
          recipeId: null,
          stepIndex: null,
          phase: 'initial',
          state: {
            snapshot: {
              caseId: 'tabs-demo',
              originFilePath: 'repos/ui/apps/v4/examples/base/tabs-demo.tsx',
              tagName: 'div',
              attributes: [],
              classTokens: [],
              text: '',
              computedStyle: [],
              colors: [],
              dimensions: [],
              boundingBox: { x: 0, y: 0, width: 0, height: 0 },
              domStructure: {
                tagName: 'div',
                attributes: [],
                text: '',
                children: [],
              },
            },
            allComputedStyles: [],
            customProperties: [],
            accessibilityTree: null,
            focusedElement: null,
            clientRects: [],
            scrollMetrics: {
              scrollLeft: 0,
              scrollTop: 0,
              scrollWidth: 0,
              scrollHeight: 0,
              clientWidth: 0,
              clientHeight: 0,
            },
            screenshotPath:
              '.parity-workbench/shadcn-tabs/tabs-demo/screenshots/origin-initial.png',
            screenshotHash: 'hash',
          },
        },
      ],
      hardFailures: [],
      advisoryDifferences: [],
      fixtureDifferences: [],
      appliedDeviations: [],
      likelyOwnerFiles: [
        'src/registry/shadcn/tabs/index.ts',
        'src/registry/shadcn/tabs/examples.ts',
      ],
    })

    expect(markdown).toContain('Parity Workbench Report')
    expect(markdown).toContain('shadcn/tabs')
    expect(markdown).toContain('tabs-demo')
    expect(markdown).toContain('initial')
  })
})
