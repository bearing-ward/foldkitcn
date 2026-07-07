import { describe, expect, test } from 'vitest'

import { renderWorkbenchMarkdownReport } from '../../src/registry/parity/workbench'
import {
  resolveWorkbenchCase,
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

  test('validates the declared workbench case registry against slots', () => {
    expect(validateWorkbenchCases()).toHaveLength(1)
  })

  test('loads the neutral tabs fixture proposal from the harvested source data', () =>
    expect(
      workbenchFixtureFor('shadcn/tabs', 'tabs-demo'),
    ).resolves.toMatchObject({
      itemId: 'shadcn/tabs',
      caseId: 'tabs-demo',
    }))

  test('loads the harvested fixture through the lazy origin snapshot import', async () => {
    await expect(loadShadcnTabsWorkbenchFixture()).resolves.toStrictEqual(
      await workbenchFixtureFor('shadcn/tabs', 'tabs-demo'),
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
