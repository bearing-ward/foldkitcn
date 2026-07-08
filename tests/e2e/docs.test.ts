import {
  expect as playwrightExpect,
  test as playwrightTest,
} from '@playwright/test'
import type { Locator, Page } from '@playwright/test'

import {
  expectEscapingSurfaceHasVisibleOverflow,
  expectNoOpenSurfaces,
  expectOnlyVisibleSurface,
  expectSurfaceAnchoredToTrigger,
  visibleBox,
} from './floating-surface-assertions'

const expectNoHeaderMainOverlap = async (page: Page) => {
  await page.evaluate(() => {
    window.scrollTo(0, 0)
  })

  const headerBox = await page.locator('.site-header').boundingBox()
  const mainBox = await page.locator('#main-content').boundingBox()

  playwrightExpect(headerBox).not.toBeNull()
  playwrightExpect(mainBox).not.toBeNull()

  if (headerBox !== null && mainBox !== null) {
    playwrightExpect(mainBox.y).toBeGreaterThanOrEqual(
      headerBox.y + headerBox.height,
    )
  }
}

const MAX_EXAMPLE_CARD_WIDTH = 800
const DOCS_PREVIEW_CARD_SELECTOR = '[data-docs-slot="docs-preview-card"]'

const expectExampleCardsStayInsideMainColumn = async (page: Page) => {
  const mainBox = await page.locator('#main-content').boundingBox()
  const exampleCards = page.locator(DOCS_PREVIEW_CARD_SELECTOR)
  const count = await exampleCards.count()

  playwrightExpect(mainBox).not.toBeNull()
  playwrightExpect(count).toBeGreaterThan(0)

  await Promise.all(
    Array.from({ length: count }, async (_, index) => {
      const cardBox = await exampleCards.nth(index).boundingBox()

      playwrightExpect(cardBox).not.toBeNull()

      if (mainBox !== null && cardBox !== null) {
        playwrightExpect(cardBox.x).toBeGreaterThanOrEqual(mainBox.x - 1)
        playwrightExpect(cardBox.x + cardBox.width).toBeLessThanOrEqual(
          mainBox.x + mainBox.width + 1,
        )
        playwrightExpect(cardBox.width).toBeLessThanOrEqual(
          Math.min(mainBox.width, MAX_EXAMPLE_CARD_WIDTH),
        )
      }
    }),
  )
}

const expectLiveReadyCardsRenderPreviews = async (page: Page) => {
  const liveReadyCards = page.locator(DOCS_PREVIEW_CARD_SELECTOR, {
    hasText: 'live ready',
  })
  const count = await liveReadyCards.count()

  playwrightExpect(count).toBeGreaterThan(0)

  await Promise.all(
    Array.from({ length: count }, async (_, index) => {
      await playwrightExpect(
        liveReadyCards.nth(index).locator('.live-example-preview'),
      ).toBeVisible()
    }),
  )
}

const expectPreviewDescendantsStayInsidePreview = async (
  preview: Locator,
  selector: string,
) => {
  const previewBox = await preview.boundingBox()
  const elements = preview.locator(selector)
  const count = await elements.count()

  playwrightExpect(previewBox).not.toBeNull()
  playwrightExpect(count).toBeGreaterThan(0)

  await Promise.all(
    Array.from({ length: count }, async (_, index) => {
      const elementBox = await elements.nth(index).boundingBox()

      playwrightExpect(elementBox).not.toBeNull()

      if (previewBox !== null && elementBox !== null) {
        playwrightExpect(elementBox.x).toBeGreaterThanOrEqual(previewBox.x - 1)
        playwrightExpect(elementBox.x + elementBox.width).toBeLessThanOrEqual(
          previewBox.x + previewBox.width + 1,
        )
        playwrightExpect(elementBox.y).toBeGreaterThanOrEqual(previewBox.y - 1)
        playwrightExpect(elementBox.y + elementBox.height).toBeLessThanOrEqual(
          previewBox.y + previewBox.height + 1,
        )
      }
    }),
  )
}

const expectPreviewScrollRegionStaysInsidePreview = async (
  preview: Locator,
  selector: string,
) => {
  await expectPreviewDescendantsStayInsidePreview(preview, selector)

  const scrollRegion = preview.locator(selector).first()
  const isScrollable = await scrollRegion.evaluate(
    element => element.scrollHeight > element.clientHeight,
  )

  playwrightExpect(isScrollable).toBe(true)
}

const expectElementAbove = async (
  element: Locator,
  anchor: Locator,
): Promise<void> => {
  const elementBox = await element.boundingBox()
  const anchorBox = await anchor.boundingBox()

  playwrightExpect(elementBox).not.toBeNull()
  playwrightExpect(anchorBox).not.toBeNull()

  if (elementBox !== null && anchorBox !== null) {
    playwrightExpect(elementBox.y + elementBox.height).toBeLessThanOrEqual(
      anchorBox.y + 1,
    )
  }
}

const expectBoxInside = async (
  element: Locator,
  container: Locator,
): Promise<void> => {
  const elementBox = await visibleBox(element)
  const containerBox = await visibleBox(container)
  const tolerance = 4

  playwrightExpect(elementBox.x).toBeGreaterThanOrEqual(
    containerBox.x - tolerance,
  )
  playwrightExpect(elementBox.y).toBeGreaterThanOrEqual(
    containerBox.y - tolerance,
  )
  playwrightExpect(elementBox.x + elementBox.width).toBeLessThanOrEqual(
    containerBox.x + containerBox.width + tolerance,
  )
  playwrightExpect(elementBox.y + elementBox.height).toBeLessThanOrEqual(
    containerBox.y + containerBox.height + tolerance,
  )
}

const expectBoxesOrderedLeftToRight = async (
  boxes: ReadonlyArray<Locator>,
): Promise<void> => {
  const snapshots = await Promise.all(boxes.map(box => visibleBox(box)))

  snapshots.reduce((previous, current) => {
    playwrightExpect(previous.x + previous.width).toBeLessThanOrEqual(
      current.x + 1,
    )

    return current
  })
}

const expectNonTransparentBackground = async (
  element: Locator,
): Promise<void> => {
  const backgroundColor = await element.evaluate(
    node => window.getComputedStyle(node).backgroundColor,
  )

  playwrightExpect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
  playwrightExpect(backgroundColor).not.toBe('transparent')
  playwrightExpect(backgroundColor.endsWith('/ 0)')).toBe(false)
}

const expectEdgePanelBounded = async (
  preview: Locator,
  panel: Locator,
  edge: 'bottom' | 'top',
): Promise<void> => {
  await playwrightExpect(panel).toBeVisible()
  await expectBoxInside(panel, preview)

  const previewBox = await visibleBox(preview)
  const panelBox = await visibleBox(panel)

  playwrightExpect(panelBox.height).toBeLessThan(previewBox.height)

  if (edge === 'top') {
    playwrightExpect(panelBox.y).toBeLessThanOrEqual(previewBox.y + 2)
  } else {
    playwrightExpect(panelBox.y + panelBox.height).toBeGreaterThanOrEqual(
      previewBox.y + previewBox.height - 2,
    )
  }
}

const expectCardLikeFloatingSurface = async (
  surface: Locator,
): Promise<void> => {
  await playwrightExpect(surface).toBeVisible()

  await playwrightExpect
    .poll(
      () =>
        surface.evaluate(element => {
          const style = window.getComputedStyle(element)
          const borderWidths = [
            style.borderTopWidth,
            style.borderRightWidth,
            style.borderBottomWidth,
            style.borderLeftWidth,
          ].map(value => Number.parseFloat(value))
          const backgroundIsTransparent =
            style.backgroundColor === 'rgba(0, 0, 0, 0)' ||
            style.backgroundColor === 'transparent' ||
            style.backgroundColor.endsWith('/ 0)')

          return (
            !backgroundIsTransparent &&
            Number.parseFloat(style.borderTopLeftRadius) > 0 &&
            (borderWidths.some(width => width > 0) ||
              style.boxShadow !== 'none') &&
            Number.parseFloat(style.opacity) > 0.95
          )
        }),
      { timeout: 1000 },
    )
    .toBe(true)
}

const expectElementsStayInsideMainColumn = async (
  page: Page,
  selector: string,
  options?: { readonly requireMatch: boolean },
) => {
  const mainBox = await page.locator('#main-content').boundingBox()
  const elements = page.locator(selector)
  const count = await elements.count()
  const requireMatch = options?.requireMatch ?? true

  playwrightExpect(mainBox).not.toBeNull()
  if (requireMatch) {
    playwrightExpect(count).toBeGreaterThan(0)
  }

  await Promise.all(
    Array.from({ length: count }, async (_, index) => {
      const elementBox = await elements.nth(index).boundingBox()

      playwrightExpect(elementBox).not.toBeNull()

      if (mainBox !== null && elementBox !== null) {
        playwrightExpect(elementBox.x).toBeGreaterThanOrEqual(mainBox.x - 1)
        playwrightExpect(elementBox.x + elementBox.width).toBeLessThanOrEqual(
          mainBox.x + mainBox.width + 1,
        )
      }
    }),
  )
}

const expectRenderedTextStaysInside = async (page: Page, selector: string) => {
  const overflowingText = await page.locator(selector).evaluate(root => {
    const rootRect = root.getBoundingClientRect()
    const textNodes = [root, ...root.querySelectorAll('*')].flatMap(element =>
      [...element.childNodes].filter(
        (node): node is Text => node.nodeType === Node.TEXT_NODE,
      ),
    )

    return textNodes.flatMap(textNode => {
      const text = textNode.textContent?.replaceAll(/\s+/gu, ' ').trim() ?? ''

      if (text.length === 0) {
        return []
      }

      const range = document.createRange()
      range.selectNodeContents(textNode)
      const overflows = [...range.getClientRects()]
        .filter(rect => rect.width > 0 && rect.height > 0)
        .filter(
          rect =>
            rect.left < rootRect.left - 1 || rect.right > rootRect.right + 1,
        )
        .map(rect => ({
          text: text.slice(0, 80),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          containerLeft: Math.round(rootRect.left),
          containerRight: Math.round(rootRect.right),
        }))

      range.detach()

      return overflows
    })
  })

  playwrightExpect(overflowingText).toEqual([])
}

const expectUsageContentStaysInsideMainColumn = async (page: Page) => {
  await expectElementsStayInsideMainColumn(page, '#usage')
  await expectElementsStayInsideMainColumn(page, '#usage .snippet-block', {
    requireMatch: false,
  })
  await expectElementsStayInsideMainColumn(page, '#usage .meta-list', {
    requireMatch: false,
  })
  await expectElementsStayInsideMainColumn(page, '#usage .meta-list div', {
    requireMatch: false,
  })

  if ((await page.locator('#usage .meta-list').count()) > 0) {
    await expectRenderedTextStaysInside(page, '#usage .meta-list')
  }
}

const firstResizablePanel = (group: Locator): Locator =>
  group.locator('[data-slot="resizable-panel"]').first()

const firstResizableHandle = (group: Locator): Locator =>
  group.locator('[data-slot="resizable-handle"]').first()

const expectPanelBasis = async (panel: Locator, size: number) => {
  const roundedSize = Number(size.toFixed(6))

  await playwrightExpect(panel).toHaveAttribute(
    'style',
    new RegExp(
      `^(flex-basis: ${roundedSize}%;|flex: ${roundedSize} 1 0px; overflow: hidden;)$`,
      'u',
    ),
  )
}

const panelBasis = async (panel: Locator): Promise<number> => {
  const style = await panel.getAttribute('style')
  const match =
    /^flex-basis: (?<basisSize>[-.\d]+)%;$/u.exec(style ?? '') ??
    /^flex: (?<flexSize>[-.\d]+) 1 0px; overflow: hidden;$/u.exec(style ?? '')
  const size = match?.groups?.['size']
  const basisSize = match?.groups?.['basisSize']
  const flexSize = match?.groups?.['flexSize']

  if (basisSize === undefined && flexSize === undefined && size === undefined) {
    throw new Error(
      `Expected a resizable panel size style, got ${style ?? 'null'}.`,
    )
  }

  return Number(size ?? basisSize ?? flexSize)
}

const handleAxisPosition = async (group: Locator): Promise<number> => {
  const handle = firstResizableHandle(group)

  await handle.scrollIntoViewIfNeeded()

  const handleBox = await handle.boundingBox()

  if (handleBox === null) {
    throw new Error('Resizable handle did not have a browser layout box.')
  }

  const orientation = await group.getAttribute('aria-orientation')

  return orientation === 'vertical'
    ? handleBox.y + handleBox.height / 2
    : handleBox.x + handleBox.width / 2
}

const expectedPointerResizedBasis = async (
  group: Locator,
  currentSize: number,
  delta: Readonly<{ x: number; y: number }>,
  groupSizePx?: number,
): Promise<number> => {
  const box = await group.boundingBox()

  if (box === null) {
    throw new Error('Resizable group did not have a browser layout box.')
  }

  const orientation = await group.getAttribute('aria-orientation')
  const dir = await group.getAttribute('dir')
  const groupSize =
    groupSizePx ?? (orientation === 'vertical' ? box.height : box.width)
  const axisDelta = orientation === 'vertical' ? delta.y : delta.x
  const directionalAxisDelta =
    orientation === 'horizontal' && dir === 'rtl' ? -axisDelta : axisDelta

  return Math.min(
    90,
    Math.max(10, currentSize + (directionalAxisDelta / groupSize) * 100),
  )
}

const dragResizableHandle = async (
  page: Page,
  group: Locator,
  delta: Readonly<{ x: number; y: number }>,
  startOffset?: Readonly<{ x: number; y: number }>,
) => {
  const offset = startOffset ?? { x: 0, y: 0 }
  const handle = firstResizableHandle(group)

  await handle.scrollIntoViewIfNeeded()

  const handleBox = await handle.boundingBox()

  if (handleBox === null) {
    throw new Error('Resizable handle did not have a browser layout box.')
  }

  const startX = handleBox.x + handleBox.width / 2 + offset.x
  const startY = handleBox.y + handleBox.height / 2 + offset.y

  await page.mouse.move(startX, startY)
  await page.mouse.down()
  await page.mouse.move(startX + delta.x, startY + delta.y, { steps: 8 })
  await page.mouse.up()
}

type ResizableInteractionCase = Readonly<{
  name: string
  previewLabel: string
  groupIndex: number
  delta: Readonly<{ x: number; y: number }>
  groupSizePx: number
  startOffset?: Readonly<{ x: number; y: number }>
}>

const expectResizableCaseWorks = async (
  page: Page,
  testCase: ResizableInteractionCase,
) => {
  const group = page
    .getByLabel(testCase.previewLabel)
    .locator('[data-slot="resizable-panel-group"]')
    .nth(testCase.groupIndex)
  const panel = firstResizablePanel(group)
  const initialSize = await panelBasis(panel)
  const initialHandlePosition = await handleAxisPosition(group)
  const expectedForwardSize = await expectedPointerResizedBasis(
    group,
    initialSize,
    testCase.delta,
    testCase.groupSizePx,
  )

  await dragResizableHandle(page, group, testCase.delta, testCase.startOffset)
  await expectPanelBasis(panel, expectedForwardSize)
  const forwardHandlePosition = await handleAxisPosition(group)

  playwrightExpect(
    Math.abs(forwardHandlePosition - initialHandlePosition),
  ).toBeGreaterThan(8)

  const reverseDelta = {
    x: -testCase.delta.x,
    y: -testCase.delta.y,
  }
  const expectedReverseSize = await expectedPointerResizedBasis(
    group,
    expectedForwardSize,
    reverseDelta,
    testCase.groupSizePx,
  )

  await dragResizableHandle(page, group, reverseDelta, testCase.startOffset)
  await expectPanelBasis(panel, expectedReverseSize)
  const reverseHandlePosition = await handleAxisPosition(group)

  playwrightExpect(
    Math.abs(reverseHandlePosition - initialHandlePosition),
  ).toBeLessThanOrEqual(2)
}

type ToastDialogDiagnostic = Readonly<{
  text: string
  top: number
  bottom: number
  rootOpacity: number
  contentOpacity: number
  hasBehindContent: boolean
  isLimited: boolean
  zIndex: number
}>

const toastDialogsForPreview = (
  preview: Locator,
  strategy: 'base-ui-shuffle' | 'foldkit-push',
): Locator =>
  preview.locator(`[role="dialog"][data-stacking-strategy="${strategy}"]`)

const toastDialogDiagnostics = (
  preview: Locator,
  strategy: 'base-ui-shuffle' | 'foldkit-push' = 'foldkit-push',
): Promise<ReadonlyArray<ToastDialogDiagnostic>> =>
  toastDialogsForPreview(preview, strategy).evaluateAll(dialogs =>
    dialogs.map(dialog => {
      const rect = dialog.getBoundingClientRect()
      const content = dialog.querySelector('[id$="-content"]')

      return {
        text: dialog.textContent?.replaceAll(/\s+/gu, ' ').trim() ?? '',
        top: Math.round(rect.top),
        bottom: Math.round(rect.bottom),
        rootOpacity: Number.parseFloat(window.getComputedStyle(dialog).opacity),
        contentOpacity:
          content === null
            ? Number.NaN
            : Number.parseFloat(window.getComputedStyle(content).opacity),
        hasBehindContent:
          content instanceof HTMLElement
            ? content.dataset.behind !== undefined
            : false,
        isLimited:
          dialog instanceof HTMLElement
            ? dialog.dataset.limited !== undefined
            : false,
        zIndex: Number.parseInt(window.getComputedStyle(dialog).zIndex, 10),
      }
    }),
  )

const expectFoldkitPushToastsVisible = async (
  preview: Locator,
  expectedTexts: ReadonlyArray<string>,
) => {
  await playwrightExpect(
    preview.getByRole('region', { name: 'Notifications' }),
  ).toHaveCSS('position', 'fixed')
  await Promise.all(
    expectedTexts.map(text =>
      playwrightExpect(preview.getByText(text)).toBeAttached(),
    ),
  )

  const diagnostics = await toastDialogDiagnostics(preview)

  playwrightExpect(diagnostics).toHaveLength(expectedTexts.length)

  for (const text of expectedTexts) {
    playwrightExpect(
      diagnostics.some(diagnostic => diagnostic.text.includes(text)),
      `Expected one toast to include text: ${text}`,
    ).toBeTruthy()
  }
  for (const diagnostic of diagnostics) {
    playwrightExpect(diagnostic.contentOpacity).toBeGreaterThan(0.95)
    playwrightExpect(diagnostic.hasBehindContent).toBe(false)
  }

  const uniqueTops = new Set(diagnostics.map(diagnostic => diagnostic.top))

  playwrightExpect(uniqueTops.size).toBe(expectedTexts.length)
}

const clickPreviewButton = async (preview: Locator, name: string) => {
  const button = preview.getByRole('button', { name })

  await button.scrollIntoViewIfNeeded()
  await button.click()
}

const expectAnchoredShuffleStackVisible = async (preview: Locator) => {
  const diagnostics = await toastDialogDiagnostics(preview, 'base-ui-shuffle')

  playwrightExpect(diagnostics).toHaveLength(3)
  playwrightExpect(
    diagnostics.every(diagnostic => diagnostic.text.includes('Copied')),
  ).toBeTruthy()
  playwrightExpect(
    diagnostics.every(diagnostic => diagnostic.rootOpacity > 0.95),
  ).toBeTruthy()
  playwrightExpect(
    diagnostics.every(diagnostic => !diagnostic.isLimited),
  ).toBeTruthy()
  playwrightExpect(
    diagnostics.filter(diagnostic => diagnostic.hasBehindContent),
  ).toHaveLength(2)
  playwrightExpect(diagnostics[0]?.zIndex).toBeGreaterThan(
    diagnostics[1]?.zIndex ?? Number.NaN,
  )
  playwrightExpect(diagnostics[1]?.zIndex).toBeGreaterThan(
    diagnostics[2]?.zIndex ?? Number.NaN,
  )

  const uniqueTops = new Set(diagnostics.map(diagnostic => diagnostic.top))

  playwrightExpect(uniqueTops.size).toBe(3)
}

playwrightTest(
  'button docs are prerendered, searchable, and responsive',
  async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/components/shadcn/button')

    await playwrightExpect(
      page.getByRole('heading', { exact: true, level: 1, name: 'Button' }),
    ).toBeVisible()

    const buttonDefaultPreview = page.getByLabel('ButtonDefault live preview')
    await playwrightExpect(
      buttonDefaultPreview.getByRole('button', { name: 'Button' }),
    ).toBeVisible()
    await buttonDefaultPreview.getByRole('button', { name: 'Button' }).click()

    await page.getByLabel('Search documentation').fill('button')
    await playwrightExpect(
      page.getByText('shadcn/button').first(),
    ).toBeVisible()
    await playwrightExpect(
      page.getByRole('heading', { name: 'Documentation' }),
    ).toBeVisible({ timeout: 15_000 })

    await expectNoHeaderMainOverlap(page)
    await expectExampleCardsStayInsideMainColumn(page)
    await expectLiveReadyCardsRenderPreviews(page)
    await expectUsageContentStaysInsideMainColumn(page)

    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/components/shadcn/button')
    await playwrightExpect(page.locator('#main-content')).toBeVisible()
    await expectNoHeaderMainOverlap(page)
    await expectExampleCardsStayInsideMainColumn(page)
    await expectUsageContentStaysInsideMainColumn(page)
  },
)

playwrightTest(
  'docs shell keeps the sidebar and TOC responsive',
  async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/components/shadcn/button')

    await playwrightExpect(page.locator('.docs-layout.has-toc')).toBeVisible()
    await playwrightExpect(page.locator('.docs-sidebar')).toBeVisible()
    await playwrightExpect(page.locator('#main-content')).toBeVisible()
    await playwrightExpect(page.locator('.docs-toc')).toBeVisible()
    await expectBoxesOrderedLeftToRight([
      page.locator('.docs-sidebar'),
      page.locator('#main-content'),
      page.locator('.docs-toc'),
    ])

    await page.goto('/docs')
    await playwrightExpect(page.locator('.docs-layout.no-toc')).toBeVisible()
    await playwrightExpect(page.locator('.docs-sidebar')).toBeVisible()
    await playwrightExpect(page.locator('#main-content')).toBeVisible()
    await playwrightExpect(page.locator('.docs-toc')).toHaveCount(0)

    const docsMainBox = await visibleBox(page.locator('#main-content'))

    playwrightExpect(docsMainBox.x + docsMainBox.width).toBeGreaterThanOrEqual(
      1200,
    )

    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/components/shadcn/button')

    await playwrightExpect(page.locator('.docs-sidebar')).toBeHidden()
    await playwrightExpect(page.locator('#main-content')).toBeVisible()
    await playwrightExpect(page.locator('.docs-toc')).toBeHidden()
    await playwrightExpect(
      page.getByRole('button', { name: 'Browse components' }),
    ).toBeVisible()

    await page.getByRole('button', { name: 'Browse components' }).click()
    await playwrightExpect(page.locator('.docs-sidebar')).toBeVisible()

    const sidebarBox = await visibleBox(page.locator('.docs-sidebar'))
    const mobileMainBox = await visibleBox(page.locator('#main-content'))
    const searchInput = page.getByLabel('Search documentation')
    const searchResultsStack = page.locator('.search-results-stack')

    await expectBoxInside(searchInput, page.locator('.docs-sidebar'))
    await searchInput.fill('button')
    await playwrightExpect(searchResultsStack).toBeVisible()
    await expectBoxInside(searchResultsStack, page.locator('.docs-sidebar'))
    await expectRenderedTextStaysInside(page, '.docs-sidebar')

    playwrightExpect(sidebarBox.y + sidebarBox.height).toBeLessThanOrEqual(
      mobileMainBox.y + 1,
    )
    playwrightExpect(sidebarBox.x).toBeLessThanOrEqual(mobileMainBox.x + 1)

    const scrollMetrics = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))

    playwrightExpect(scrollMetrics.scrollWidth).toBeLessThanOrEqual(
      scrollMetrics.innerWidth + 1,
    )
  },
)

playwrightTest('item docs show bounded actual examples', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/components/shadcn/item')

  await playwrightExpect(
    page.getByRole('heading', { exact: true, level: 1, name: 'Item' }),
  ).toBeVisible()

  const itemDemoPreview = page.getByLabel('ItemDemo live preview')

  await playwrightExpect(
    itemDemoPreview.getByRole('button', { exact: true, name: 'Action' }),
  ).toBeVisible()
  await playwrightExpect(
    page
      .getByLabel('ItemAvatar live preview')
      .getByRole('button', {
        exact: true,
        name: 'Invite',
      })
      .first(),
  ).toBeVisible()

  await expectExampleCardsStayInsideMainColumn(page)
  await expectLiveReadyCardsRenderPreviews(page)
  await expectUsageContentStaysInsideMainColumn(page)

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/components/shadcn/item')
  await playwrightExpect(page.locator('#main-content')).toBeVisible()
  await expectUsageContentStaysInsideMainColumn(page)
})

playwrightTest(
  'overlay docs dismiss dialog and alert dialog actions',
  async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/components/shadcn/alert-dialog')

    const alertPreview = page.getByLabel('AlertDialogDemo live preview')
    const alertDialog = alertPreview.locator(
      '[data-slot="alert-dialog-content"]',
    )

    await alertPreview.getByRole('button', { name: 'Show Dialog' }).click()
    await playwrightExpect(alertDialog).toBeVisible()
    await alertPreview.getByRole('button', { name: 'Cancel' }).click()
    await playwrightExpect(alertDialog).not.toBeVisible()

    await alertPreview.getByRole('button', { name: 'Show Dialog' }).click()
    await playwrightExpect(alertDialog).toBeVisible()
    await alertPreview.getByRole('button', { name: 'Continue' }).click()
    await playwrightExpect(alertDialog).not.toBeVisible()

    await page.goto('/components/shadcn/dialog')

    const dialogPreview = page.getByLabel('DialogDemo live preview')
    const dialogContent = dialogPreview.locator('[data-slot="dialog-content"]')

    await dialogPreview.getByRole('button', { name: 'Open Dialog' }).click()
    await playwrightExpect(dialogContent).toBeVisible()
    await dialogPreview.getByRole('button', { name: 'Close' }).click()
    await playwrightExpect(dialogContent).not.toBeVisible()

    await dialogPreview.getByRole('button', { name: 'Open Dialog' }).click()
    await playwrightExpect(dialogContent).toBeVisible()
    await dialogPreview.getByRole('button', { name: 'Cancel' }).click()
    await playwrightExpect(dialogContent).not.toBeVisible()
  },
)

playwrightTest(
  'dropdown docs open live menus and dismiss on selection',
  async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })

    await page.goto('/components/shadcn/avatar')
    const avatarPreview = page.getByLabel('AvatarDropdown live preview')
    const avatarMenu = avatarPreview.locator(
      '[data-slot="dropdown-menu-content"]',
    )

    await avatarPreview.locator('button').first().click()
    await playwrightExpect(avatarMenu).toBeVisible()
    await avatarPreview.getByRole('menuitem', { name: 'Account' }).click()
    await playwrightExpect(avatarMenu).not.toBeVisible()

    await page.goto('/components/shadcn/breadcrumb')
    const breadcrumbPreview = page.getByLabel('BreadcrumbDropdown live preview')
    const breadcrumbMenu = breadcrumbPreview.locator(
      '[data-slot="dropdown-menu-content"]',
    )

    await breadcrumbPreview.getByRole('button', { name: 'Components' }).click()
    await playwrightExpect(breadcrumbMenu).toBeVisible()
    await breadcrumbPreview.getByRole('menuitem', { name: 'GitHub' }).click()
    await playwrightExpect(breadcrumbMenu).not.toBeVisible()

    await page.goto('/components/shadcn/button-group')
    const buttonGroupDropdown = page.getByLabel(
      'ButtonGroupDropdown live preview',
    )
    const buttonGroupDropdownMenu = buttonGroupDropdown.locator(
      '[data-slot="dropdown-menu-content"]',
    )

    await buttonGroupDropdown.locator('button').nth(1).click()
    await playwrightExpect(buttonGroupDropdownMenu).toBeVisible()
    await buttonGroupDropdown.getByRole('menuitem', { name: 'Mute' }).click()
    await playwrightExpect(buttonGroupDropdownMenu).not.toBeVisible()

    const buttonGroupPopover = page.getByLabel(
      'ButtonGroupPopover live preview',
    )
    const buttonGroupPopoverContent = buttonGroupPopover.locator(
      '[data-slot="popover-content"]',
    )

    await buttonGroupPopover
      .getByRole('button', { name: 'Open Popover' })
      .click()
    await playwrightExpect(buttonGroupPopoverContent).toBeVisible()
    await page.mouse.click(8, 8)
    await playwrightExpect(buttonGroupPopoverContent).not.toBeVisible()

    const buttonGroupSelect = page.getByLabel('ButtonGroupSelect live preview')
    const buttonGroupSelectPopup = buttonGroupSelect.locator(
      '[data-slot="select-content"]',
    )

    await buttonGroupSelect.locator('button').first().click()
    await playwrightExpect(buttonGroupSelectPopup).toBeVisible()
    await buttonGroupSelect.getByRole('option', { name: 'EUR' }).click()
    await playwrightExpect(buttonGroupSelectPopup).not.toBeVisible()

    await page.goto('/components/shadcn/item')
    const itemPreview = page.getByLabel('ItemDropdown live preview')
    const itemMenu = itemPreview.locator('[data-slot="dropdown-menu-content"]')

    await itemPreview.getByRole('button', { name: /Select/u }).click()
    await playwrightExpect(itemMenu).toBeVisible()
    await itemPreview.getByRole('menuitem', { name: 'Delete' }).click()
    await playwrightExpect(itemMenu).not.toBeVisible()
  },
)

playwrightTest(
  'dropdown menu docs keep checked values, context menus, and menubar state in sync',
  async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })

    await page.goto('/components/shadcn/dropdown-menu')
    const dropdownPreview = page.getByLabel(
      'DropdownMenuCheckboxes live preview',
    )
    const dropdownMenu = dropdownPreview.locator(
      '[data-slot="dropdown-menu-content"]',
    )

    await dropdownPreview.getByRole('button').click()
    await playwrightExpect(dropdownMenu).toBeVisible()
    await playwrightExpect(
      dropdownPreview.getByRole('menuitemcheckbox', { name: 'Status Bar' }),
    ).toHaveAttribute('aria-checked', 'true')
    await dropdownPreview
      .getByRole('menuitemcheckbox', { name: 'Panel' })
      .click()
    await playwrightExpect(
      dropdownPreview.getByRole('menuitemcheckbox', { name: 'Panel' }),
    ).toHaveAttribute('aria-checked', 'true')
    await playwrightExpect(
      dropdownPreview.getByRole('menuitemcheckbox', { name: 'Status Bar' }),
    ).toHaveAttribute('aria-checked', 'true')
    await page.keyboard.press('Escape')
    await playwrightExpect(dropdownMenu).not.toBeVisible()

    const submenuPreview = page.getByLabel('DropdownMenuComplex live preview')
    const submenuMenu = submenuPreview.locator(
      '[data-slot="dropdown-menu-content"]',
    )

    await submenuPreview.getByRole('button', { name: 'Complex Menu' }).click()
    await playwrightExpect(submenuMenu).toBeVisible()
    await submenuPreview.getByRole('menuitem', { name: 'Open Recent' }).hover()
    await playwrightExpect(
      submenuPreview.getByRole('menuitem', { name: 'More Projects' }),
    ).toBeVisible()
    await submenuPreview
      .getByRole('menuitem', { name: 'Project Alpha' })
      .click()
    await playwrightExpect(submenuMenu).not.toBeVisible()

    await page.goto('/components/shadcn/context-menu')
    const contextPreview = page.getByLabel('ContextMenuDemo live preview')
    const contextMenu = contextPreview.locator(
      '[data-slot="context-menu-content"]',
    )

    const contextTrigger = contextPreview.getByText('Right click here')

    await contextTrigger.click({ button: 'right' })
    await playwrightExpect(contextMenu).toBeVisible()
    await page.keyboard.press('Escape')
    await playwrightExpect(contextMenu).not.toBeVisible()

    await contextTrigger.click({ button: 'right' })
    await playwrightExpect(contextMenu).toBeVisible()
    await page.mouse.click(12, 12)
    await playwrightExpect(contextMenu).not.toBeVisible()

    await page.goto('/components/shadcn/menubar')
    const menubarPreview = page.getByLabel('MenubarDemo live preview')
    const menubarContent = menubarPreview.locator(
      '[data-slot="menubar-content"]',
    )

    const fileMenuTrigger = menubarPreview.getByRole('menuitem', {
      exact: true,
      name: 'File',
    })
    const editMenuTrigger = menubarPreview.getByRole('menuitem', {
      exact: true,
      name: 'Edit',
    })

    await fileMenuTrigger.click()
    await playwrightExpect(menubarContent).toBeVisible()
    await page.keyboard.press('Escape')
    await playwrightExpect(menubarContent).not.toBeVisible()
    await editMenuTrigger.click()
    await playwrightExpect(menubarContent).toBeVisible()
    await playwrightExpect(fileMenuTrigger).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    await playwrightExpect(editMenuTrigger).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  },
)

playwrightTest(
  'visual floating surfaces keep card styling',
  async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })

    await page.goto('/components/shadcn/hover-card')
    const hoverPreview = page.getByLabel('HoverCardDemo live preview')
    const hoverTrigger = hoverPreview.getByRole('link', { name: 'Hover Here' })
    const hoverCard = hoverPreview.locator(
      'xpath=ancestor::*[@data-docs-slot="docs-preview-card"][1]',
    )
    const hoverContentSelector = '[data-slot="hover-card-content"]'

    await hoverTrigger.focus()
    const focusedHoverContent = await expectOnlyVisibleSurface(
      hoverPreview,
      hoverContentSelector,
    )
    await expectSurfaceAnchoredToTrigger(focusedHoverContent, hoverTrigger)
    await expectCardLikeFloatingSurface(focusedHoverContent)
    await expectEscapingSurfaceHasVisibleOverflow(
      focusedHoverContent,
      hoverCard,
    )
    await page.keyboard.press('Escape')
    await expectNoOpenSurfaces(hoverPreview, hoverContentSelector)

    await hoverTrigger.hover()
    const hoveredHoverContent = await expectOnlyVisibleSurface(
      hoverPreview,
      hoverContentSelector,
    )
    await expectSurfaceAnchoredToTrigger(hoveredHoverContent, hoverTrigger)
    const hoverPositioner = hoveredHoverContent.locator('xpath=..')
    await playwrightExpect(hoverPositioner).toHaveCSS('position', 'absolute')
    await page.mouse.move(0, 0)
    await expectNoOpenSurfaces(hoverPreview, hoverContentSelector)

    await page.goto('/components/shadcn/popover')
    const popoverPreview = page.getByLabel('PopoverDemo live preview')
    const popoverTrigger = popoverPreview.getByRole('button', {
      name: 'Open popover',
    })
    const popoverCard = popoverPreview.locator(
      'xpath=ancestor::*[@data-docs-slot="docs-preview-card"][1]',
    )
    const popoverContentSelector = '[data-slot="popover-content"][data-open]'

    await popoverTrigger.click()
    const popoverContent = await expectOnlyVisibleSurface(
      popoverPreview,
      popoverContentSelector,
    )
    await expectSurfaceAnchoredToTrigger(popoverContent, popoverTrigger)
    const initialTriggerBox = await visibleBox(popoverTrigger)
    const initialContentBox = await visibleBox(popoverContent)
    const initialOffset = {
      x: initialContentBox.x - initialTriggerBox.x,
      y: initialContentBox.y - initialTriggerBox.y,
    }
    await page.evaluate(() => {
      window.scrollBy(0, 160)
    })
    const scrolledTriggerBox = await visibleBox(popoverTrigger)
    const scrolledContentBox = await visibleBox(popoverContent)
    playwrightExpect({
      x: scrolledContentBox.x - scrolledTriggerBox.x,
      y: scrolledContentBox.y - scrolledTriggerBox.y,
    }).toStrictEqual(initialOffset)
    await expectCardLikeFloatingSurface(popoverContent)
    await expectEscapingSurfaceHasVisibleOverflow(popoverContent, popoverCard)
    await page.mouse.click(12, 12)
    await expectNoOpenSurfaces(popoverPreview, popoverContentSelector)

    await page.goto('/components/shadcn/dropdown-menu')
    const dropdownPreview = page.getByLabel('DropdownMenuDemo live preview')
    const dropdownTrigger = dropdownPreview.getByRole('button')
    const dropdownCard = dropdownPreview.locator(
      'xpath=ancestor::*[@data-docs-slot="docs-preview-card"][1]',
    )
    const dropdownContentSelector =
      '[data-slot="dropdown-menu-content"][data-open]'

    await dropdownTrigger.click()
    const dropdownContent = await expectOnlyVisibleSurface(
      dropdownPreview,
      dropdownContentSelector,
    )
    await expectSurfaceAnchoredToTrigger(dropdownContent, dropdownTrigger)
    await expectCardLikeFloatingSurface(dropdownContent)
    await expectEscapingSurfaceHasVisibleOverflow(dropdownContent, dropdownCard)
    await page.keyboard.press('Escape')
    await expectNoOpenSurfaces(dropdownPreview, dropdownContentSelector)

    await page.goto('/components/shadcn/context-menu')
    const contextPreview = page.getByLabel('ContextMenuDemo live preview')
    const contextTrigger = contextPreview.getByText('Right click here')
    const contextCard = contextPreview.locator(
      'xpath=ancestor::*[@data-docs-slot="docs-preview-card"][1]',
    )
    const contextContentSelector =
      '[data-slot="context-menu-content"][data-open]'

    await contextTrigger.click({ button: 'right' })
    const contextContent = await expectOnlyVisibleSurface(
      contextPreview,
      contextContentSelector,
    )
    await expectSurfaceAnchoredToTrigger(contextContent, contextTrigger)
    await expectCardLikeFloatingSurface(contextContent)
    await expectEscapingSurfaceHasVisibleOverflow(contextContent, contextCard)
    await page.keyboard.press('Escape')
    await expectNoOpenSurfaces(contextPreview, contextContentSelector)

    await page.goto('/components/shadcn/select')
    const selectPreview = page.getByLabel('SelectDemo live preview')
    const selectTrigger = selectPreview.locator('[data-slot="select-trigger"]')
    const selectCard = selectPreview.locator(
      'xpath=ancestor::*[@data-docs-slot="docs-preview-card"][1]',
    )
    const selectContentSelector = '[data-slot="select-content"][data-open]'

    await selectTrigger.click()
    const selectContent = await expectOnlyVisibleSurface(
      selectPreview,
      selectContentSelector,
    )
    await expectSurfaceAnchoredToTrigger(selectContent, selectTrigger)
    await expectCardLikeFloatingSurface(selectContent)
    await expectEscapingSurfaceHasVisibleOverflow(selectContent, selectCard)
    await selectTrigger.click()
    await expectNoOpenSurfaces(selectPreview, selectContentSelector)

    await page.goto('/components/shadcn/combobox')
    const comboboxPreview = page.getByLabel('ComboboxBasic live preview')
    const comboboxTrigger = comboboxPreview.locator(
      '[data-slot="combobox-trigger"]',
    )
    const comboboxCard = comboboxPreview.locator(
      'xpath=ancestor::*[@data-docs-slot="docs-preview-card"][1]',
    )
    const comboboxContentSelector = '[data-slot="combobox-content"][data-open]'

    await comboboxTrigger.click()
    const comboboxContent = await expectOnlyVisibleSurface(
      comboboxPreview,
      comboboxContentSelector,
    )
    await expectSurfaceAnchoredToTrigger(comboboxContent, comboboxTrigger, {
      tolerance: 64,
    })
    await expectCardLikeFloatingSurface(comboboxContent)
    await expectEscapingSurfaceHasVisibleOverflow(comboboxContent, comboboxCard)
    await comboboxTrigger.click()
    await expectNoOpenSurfaces(comboboxPreview, comboboxContentSelector)
  },
)

playwrightTest(
  'tooltip visual geometry stays stable across cycles',
  async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/components/shadcn/tooltip')

    const tooltipPreview = page.getByLabel('TooltipDemo live preview')
    const tooltipTrigger = tooltipPreview.getByRole('button', { name: 'Hover' })
    const tooltipContent = tooltipPreview.locator(
      '[data-slot="tooltip-content"]',
    )

    await tooltipTrigger.hover()
    await playwrightExpect(tooltipContent).toBeVisible()
    const firstBox = await visibleBox(tooltipContent)

    await page.mouse.move(0, 0)
    await playwrightExpect(tooltipContent).not.toBeVisible()
    await tooltipTrigger.focus()
    await playwrightExpect(tooltipContent).toBeVisible()
    const focusedBox = await visibleBox(tooltipContent)

    await page.keyboard.press('Escape')
    await playwrightExpect(tooltipContent).not.toBeVisible()
    await tooltipTrigger.hover()
    await playwrightExpect(tooltipContent).toBeVisible()
    const secondHoverBox = await visibleBox(tooltipContent)

    playwrightExpect(focusedBox).toStrictEqual(firstBox)
    playwrightExpect(secondHoverBox).toStrictEqual(firstBox)
  },
)

playwrightTest(
  'sidebar docs contain shell examples inside previews',
  async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/components/shadcn/sidebar')

    await playwrightExpect(
      page.getByRole('heading', { exact: true, level: 1, name: 'Sidebar' }),
    ).toBeVisible()

    await expectExampleCardsStayInsideMainColumn(page)
    await expectLiveReadyCardsRenderPreviews(page)
    await expectPreviewDescendantsStayInsidePreview(
      page.getByLabel('SidebarControlled live preview'),
      '[data-slot="sidebar-container"]',
    )

    const sidebarDemo = page.getByLabel('SidebarDemo live preview')

    await sidebarDemo.getByRole('button', { name: /Acme Inc/u }).click()
    await playwrightExpect(sidebarDemo.getByText('Acme Corp.')).toBeVisible()
    await sidebarDemo.getByText('Acme Corp.').click()
    await playwrightExpect(sidebarDemo.getByText('Startup')).toBeVisible()

    await playwrightExpect(sidebarDemo.getByText('History')).toBeVisible()
    await sidebarDemo.getByRole('button', { name: 'Playground' }).click()
    await playwrightExpect(sidebarDemo.getByText('History')).not.toBeVisible()
    await sidebarDemo.getByRole('button', { name: 'Playground' }).click()

    const demoTrigger = sidebarDemo.locator('[data-slot="sidebar-trigger"]')
    const demoSidebar = sidebarDemo.locator('[data-slot="sidebar"]')
    const playgroundButton = sidebarDemo.getByRole('button', {
      name: 'Playground',
    })

    await demoTrigger.click()
    await playwrightExpect(demoSidebar).toHaveAttribute(
      'data-state',
      'collapsed',
    )
    await playwrightExpect(playgroundButton).toBeVisible()
    await playgroundButton.focus()
    await playwrightExpect(playgroundButton).toBeFocused()
    await playwrightExpect(sidebarDemo.getByText('History')).not.toBeVisible()
    await demoTrigger.click()
    await playwrightExpect(demoSidebar).toHaveAttribute(
      'data-state',
      'expanded',
    )
    await playwrightExpect(sidebarDemo.getByText('History')).toBeVisible()

    await sidebarDemo.getByRole('link', { name: 'Design Engineering' }).hover()
    await sidebarDemo
      .getByRole('button', { name: 'More Design Engineering' })
      .click()
    await playwrightExpect(sidebarDemo.getByText('View Project')).toBeVisible()
    await sidebarDemo.getByText('View Project').click()

    const userMenuTrigger = sidebarDemo.getByRole('button', { name: /shadcn/u })
    const userMenuContent = sidebarDemo.locator(
      '[data-slot="dropdown-menu-content"][data-side="right"]',
    )

    await userMenuTrigger.click()
    await playwrightExpect(
      sidebarDemo.getByText('Upgrade to Pro'),
    ).toBeVisible()
    await playwrightExpect(userMenuContent).toBeVisible()
    await userMenuContent.press('Escape')
    await playwrightExpect(
      sidebarDemo.getByText('Upgrade to Pro'),
    ).not.toBeVisible()

    const footerPreview = page.getByLabel('SidebarFooter live preview')
    const footerTrigger = footerPreview.locator('[data-slot="sidebar-trigger"]')
    const footerMenuTrigger = footerPreview.getByRole('button', {
      name: /Username/u,
    })
    const footerMenuContent = footerPreview.locator(
      '[data-slot="dropdown-menu-content"][data-side="top"]',
    )

    await footerTrigger.click()
    await playwrightExpect(
      footerPreview.locator('[data-slot="sidebar"]'),
    ).toHaveAttribute('data-state', 'collapsed')
    await playwrightExpect(footerMenuTrigger).toBeVisible()
    await footerMenuTrigger.click()
    await playwrightExpect(footerPreview.getByText('Account')).toBeVisible()
    await playwrightExpect(footerMenuContent).toBeVisible()
    await footerMenuContent.press('Escape')
    await playwrightExpect(footerPreview.getByText('Billing')).not.toBeVisible()

    const groupCollapsible = page.getByLabel(
      'SidebarGroupCollapsible live preview',
    )

    await playwrightExpect(groupCollapsible.getByText('Support')).toBeVisible()
    await groupCollapsible.getByRole('button', { name: /Help/u }).click()
    await playwrightExpect(
      groupCollapsible.getByText('Support'),
    ).not.toBeVisible()

    const menuCollapsible = page.getByLabel(
      'SidebarMenuCollapsible live preview',
    )

    await playwrightExpect(
      menuCollapsible.getByText('Installation'),
    ).toBeVisible()
    await menuCollapsible
      .getByRole('button', { name: /Getting Started/u })
      .click()
    await playwrightExpect(
      menuCollapsible.getByText('Installation'),
    ).not.toBeVisible()

    const menuAction = page.getByLabel('SidebarMenuAction live preview')

    await menuAction
      .getByRole('button', { name: 'More Design Engineering' })
      .click()
    await playwrightExpect(menuAction.getByText('View Project')).toBeVisible()
    await menuAction.getByText('Share Project').click()
    await playwrightExpect(
      menuAction.getByText('Archive Project'),
    ).not.toBeVisible()

    const menuSub = page.getByLabel('SidebarMenuSub live preview')

    await expectPreviewScrollRegionStaysInsidePreview(
      menuSub,
      '[data-slot="sidebar-content"]',
    )
    await playwrightExpect(menuSub.getByText('Installation')).toBeVisible()

    const sidebarTogglePreviews = [
      'SidebarControlled',
      'SidebarDemo',
      'SidebarHeader',
      'SidebarRtl',
    ] as const

    await sidebarTogglePreviews.reduce(async (previous, exampleTitle) => {
      await previous
      const preview = page.getByLabel(`${exampleTitle} live preview`)
      const toggle =
        exampleTitle === 'SidebarControlled'
          ? preview.getByRole('button', { name: 'Close Sidebar' })
          : preview.locator('[data-slot="sidebar-trigger"]')

      await toggle.click()

      await playwrightExpect(
        preview.locator('[data-slot="sidebar"]'),
      ).toHaveAttribute('data-state', 'collapsed')
    }, Promise.resolve())

    await playwrightExpect(
      page
        .getByLabel('SidebarControlled live preview')
        .getByRole('button', { name: 'Open Sidebar' }),
    ).toBeVisible()
    await expectPreviewDescendantsStayInsidePreview(
      page.getByLabel('SidebarRtl live preview'),
      '[data-slot="sidebar-container"]',
    )
  },
)

playwrightTest(
  'bubble docs expose live collapsible toast tooltip and popover examples',
  async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/components/shadcn/bubble')

    const collapsible = page.getByLabel('BubbleCollapsibleDemo live preview')

    await playwrightExpect(
      collapsible.getByText('The menu needs the hover and focus tokens split'),
    ).not.toBeVisible()
    await clickPreviewButton(collapsible, 'Show more')
    await playwrightExpect(
      collapsible.getByText('The menu needs the hover and focus tokens split'),
    ).toBeVisible()
    await clickPreviewButton(collapsible, 'Show less')
    await playwrightExpect(
      collapsible.getByText('The menu needs the hover and focus tokens split'),
    ).not.toBeVisible()

    const linkButtons = page.getByLabel('BubbleLinkButtonDemo live preview')

    await clickPreviewButton(linkButtons, 'I forgot my password')
    await clickPreviewButton(linkButtons, 'I need help with my subscription')
    await playwrightExpect(linkButtons.getByText('Reply selected')).toHaveCount(
      2,
    )
    const linkNotifications = linkButtons.getByRole('region', {
      name: 'Notifications',
    })

    await playwrightExpect(
      linkNotifications.getByText('I forgot my password'),
    ).toBeVisible()
    await playwrightExpect(
      linkNotifications.getByText('I need help with my subscription'),
    ).toBeVisible()
    await playwrightExpect(
      toastDialogsForPreview(linkButtons, 'base-ui-shuffle'),
    ).toHaveCount(2)

    const tooltip = page.getByLabel('BubbleTooltipDemo live preview')
    const tooltipTrigger = tooltip.getByRole('button', {
      name: 'Read on Jan 5, 2026 at 4:32 PM',
    })
    const tooltipContent = tooltip.locator('[data-slot="tooltip-content"]')

    await tooltipTrigger.hover()
    await playwrightExpect(tooltipContent).toBeVisible()
    await visibleBox(tooltipContent)
    await page.keyboard.press('Escape')
    await playwrightExpect(tooltipContent).not.toBeVisible()

    const popover = page.getByLabel('BubblePopoverDemo live preview')
    const popoverTrigger = popover.getByRole('button', {
      name: 'Show error details',
    })
    const popoverContent = popover.locator('[data-slot="popover-content"]')

    await popoverTrigger.click()
    await playwrightExpect(popoverContent).toBeVisible()
    await playwrightExpect(popover.getByText('Command failed')).toBeVisible()
    await expectElementAbove(popoverContent, popoverTrigger)
    await page.mouse.click(10, 10)
    await playwrightExpect(popoverContent).not.toBeVisible()
    await popoverTrigger.click()
    await playwrightExpect(popoverContent).toBeVisible()
    await page.keyboard.press('Escape')
    await playwrightExpect(popoverContent).not.toBeVisible()
  },
)

playwrightTest(
  'toast docs render repeated fixed foldkit-push toasts as distinct visible instances',
  async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/components/base-ui/toast#base-ui-toast-undo-action')

    const customPosition = page.getByLabel('Custom position live preview')

    await clickPreviewButton(customPosition, 'Create toast')
    await clickPreviewButton(customPosition, 'Create toast')
    await expectFoldkitPushToastsVisible(customPosition, [
      'Toast 1 created',
      'Toast 2 created',
    ])

    const customViewport = customPosition.getByRole('region', {
      name: 'Notifications',
    })
    const customPreviewBox = await customPosition.boundingBox()
    const customViewportBox = await customViewport.boundingBox()

    await playwrightExpect(customViewport).toHaveAttribute(
      'data-position',
      'top-center',
    )
    playwrightExpect(customPreviewBox).not.toBeNull()
    playwrightExpect(customViewportBox).not.toBeNull()
    if (customPreviewBox !== null && customViewportBox !== null) {
      playwrightExpect(customViewportBox.y).toBeGreaterThanOrEqual(
        customPreviewBox.y - 1,
      )
      playwrightExpect(customViewportBox.y).toBeLessThan(
        customPreviewBox.y + 32,
      )
    }

    const undo = page.getByLabel('Undo action live preview')

    await clickPreviewButton(undo, 'Perform action')
    await clickPreviewButton(undo, 'Perform action')
    await clickPreviewButton(undo, 'Perform action')
    await expectFoldkitPushToastsVisible(undo, [
      'Action 1 performed',
      'Action 2 performed',
      'Action 3 performed',
    ])

    const custom = page.getByLabel('Custom live preview')

    await clickPreviewButton(custom, 'Create custom toast')
    await clickPreviewButton(custom, 'Create custom toast')
    await expectFoldkitPushToastsVisible(custom, [
      'Toast with custom data 1',
      'Toast with custom data 2',
    ])

    const varyingHeights = page.getByLabel('Varying heights live preview')

    await clickPreviewButton(varyingHeights, 'Create varying height toast')
    await clickPreviewButton(varyingHeights, 'Create varying height toast')
    await expectFoldkitPushToastsVisible(varyingHeights, [
      'Short message.',
      'A bit longer message that spans two lines.',
    ])
  },
)

playwrightTest(
  'toast anchored example exposes repeated shuffled toast instances',
  async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/components/base-ui/toast#base-ui-toast-anchored-toasts')

    const anchored = page.getByLabel('Anchored toasts live preview')

    await clickPreviewButton(anchored, 'Stacked toast')
    await playwrightExpect(
      toastDialogsForPreview(anchored, 'base-ui-shuffle'),
    ).toHaveCount(1)
    await clickPreviewButton(anchored, 'Stacked toast')
    await playwrightExpect(
      toastDialogsForPreview(anchored, 'base-ui-shuffle'),
    ).toHaveCount(2)
    await clickPreviewButton(anchored, 'Stacked toast')
    await playwrightExpect(
      toastDialogsForPreview(anchored, 'base-ui-shuffle'),
    ).toHaveCount(3)
    await expectAnchoredShuffleStackVisible(anchored)
  },
)

playwrightTest(
  'visual drawer sheet dialog progress separator and tabs surfaces stay styled and bounded',
  async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })

    await page.goto('/components/shadcn/drawer')
    const drawerSidesPreview = page.getByLabel('DrawerWithSides live preview')

    await drawerSidesPreview.getByRole('button', { name: 'top' }).click()
    const topDrawer = drawerSidesPreview.locator(
      '[data-slot="drawer-content"][data-vaul-drawer-direction="top"]',
    )

    await expectEdgePanelBounded(drawerSidesPreview, topDrawer, 'top')
    await page.keyboard.press('Escape')
    await playwrightExpect(topDrawer).not.toBeVisible()
    await drawerSidesPreview.getByRole('button', { name: 'bottom' }).click()
    const bottomDrawer = drawerSidesPreview.locator(
      '[data-slot="drawer-content"][data-vaul-drawer-direction="bottom"]',
    )

    await expectEdgePanelBounded(drawerSidesPreview, bottomDrawer, 'bottom')
    await page.keyboard.press('Escape')

    await page.goto('/components/shadcn/sheet')
    const sheetSidesPreview = page.getByLabel('SheetSide live preview')

    await sheetSidesPreview.getByRole('button', { name: 'top' }).click()
    const topSheet = sheetSidesPreview.locator(
      '[data-slot="sheet-content"][data-side="top"]',
    )

    await expectEdgePanelBounded(sheetSidesPreview, topSheet, 'top')
    await page.keyboard.press('Escape')
    await playwrightExpect(topSheet).not.toBeVisible()
    await sheetSidesPreview.getByRole('button', { name: 'bottom' }).click()
    const bottomSheet = sheetSidesPreview.locator(
      '[data-slot="sheet-content"][data-side="bottom"]',
    )

    await expectEdgePanelBounded(sheetSidesPreview, bottomSheet, 'bottom')
    await page.keyboard.press('Escape')

    await page.goto('/components/shadcn/dialog')
    const stickyDialogPreview = page.getByLabel(
      'DialogStickyFooter live preview',
    )
    const stickyDialogContent = stickyDialogPreview.locator(
      '[data-slot="dialog-content"]',
    )
    const stickyDialogFooter = stickyDialogPreview.locator(
      '[data-slot="dialog-footer"]',
    )

    await stickyDialogPreview
      .getByRole('button', { name: 'Sticky Footer' })
      .click()
    await playwrightExpect(stickyDialogContent).toBeVisible()
    await playwrightExpect(stickyDialogFooter).toBeVisible()
    await expectBoxInside(stickyDialogContent, stickyDialogPreview)

    const scrollableDialogBody = stickyDialogContent.locator(
      '.no-scrollbar.overflow-y-auto',
    )

    await scrollableDialogBody.evaluate(element => {
      element.scrollTop = element.scrollHeight
    })
    await playwrightExpect(stickyDialogFooter).toBeVisible()
    await expectNonTransparentBackground(stickyDialogFooter)
    await page.keyboard.press('Escape')

    await page.goto('/components/shadcn/progress')
    const progressPreview = page.getByLabel('ProgressDemo live preview')
    const progressTrack = progressPreview.locator(
      '[data-slot="progress-track"]',
    )
    const progressIndicator = progressPreview.locator(
      '[data-slot="progress-indicator"]',
    )

    await playwrightExpect(progressTrack).toBeVisible()
    await playwrightExpect(progressIndicator).toBeVisible()
    await expectNonTransparentBackground(progressTrack)
    await expectNonTransparentBackground(progressIndicator)

    const progressTrackBox = await visibleBox(progressTrack)
    const progressIndicatorBox = await visibleBox(progressIndicator)
    const progressRatio = progressIndicatorBox.width / progressTrackBox.width

    playwrightExpect(progressRatio).toBeGreaterThan(0.1)
    playwrightExpect(progressRatio).toBeLessThan(0.16)

    await page.goto('/components/shadcn/separator')
    const horizontalSeparator = page
      .getByLabel('SeparatorDemo live preview')
      .locator('[data-slot="separator"]')
    const verticalSeparators = page
      .getByLabel('SeparatorVertical live preview')
      .locator('[data-slot="separator"]')

    await playwrightExpect(horizontalSeparator).toBeVisible()
    await expectNonTransparentBackground(horizontalSeparator)
    const horizontalSeparatorBox = await visibleBox(horizontalSeparator)

    playwrightExpect(horizontalSeparatorBox.width).toBeGreaterThan(100)
    playwrightExpect(horizontalSeparatorBox.height).toBeGreaterThanOrEqual(1)

    await playwrightExpect(verticalSeparators).toHaveCount(2)
    await Promise.all(
      Array.from({ length: 2 }, async (_, index) => {
        const separator = verticalSeparators.nth(index)

        await playwrightExpect(separator).toBeVisible()
        await expectNonTransparentBackground(separator)

        const separatorBox = await visibleBox(separator)

        playwrightExpect(separatorBox.width).toBeGreaterThanOrEqual(1)
        playwrightExpect(separatorBox.height).toBeGreaterThan(8)
      }),
    )

    await page.goto('/components/shadcn/tabs')
    const tabsIconsPreview = page.getByLabel('TabsIcons live preview')
    const previewTab = tabsIconsPreview.getByRole('tab', { name: 'Preview' })
    const codeTab = tabsIconsPreview.getByRole('tab', { name: 'Code' })

    await playwrightExpect(previewTab).toHaveAttribute('data-active')
    await playwrightExpect(
      previewTab.locator('[data-icon="preview"]'),
    ).toHaveCSS('display', 'block')
    await playwrightExpect(codeTab.locator('[data-icon="code"]')).toHaveCSS(
      'display',
      'block',
    )

    const activeTabVisual = await previewTab.evaluate(element => {
      const style = window.getComputedStyle(element)

      return {
        backgroundColor: style.backgroundColor,
        boxShadow: style.boxShadow,
        color: style.color,
      }
    })
    const inactiveTabVisual = await codeTab.evaluate(element => {
      const style = window.getComputedStyle(element)

      return {
        backgroundColor: style.backgroundColor,
        boxShadow: style.boxShadow,
        color: style.color,
      }
    })

    playwrightExpect(activeTabVisual).not.toStrictEqual(inactiveTabVisual)

    await codeTab.click()
    await playwrightExpect(codeTab).toHaveAttribute('data-active')
    await playwrightExpect(
      tabsIconsPreview.getByText('Installable example code'),
    ).toBeVisible()
  },
)

playwrightTest(
  'resizable docs resize every live example forward and backward',
  async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 1200 })
    await page.goto('/components/shadcn/resizable')

    const cases: ReadonlyArray<ResizableInteractionCase> = [
      {
        name: 'ResizableHandleDemo root',
        previewLabel: 'ResizableHandleDemo live preview',
        groupIndex: 0,
        delta: { x: 80, y: 0 },
        groupSizePx: 400,
      },
      {
        name: 'ResizableDemo root',
        previewLabel: 'ResizableDemo live preview',
        groupIndex: 0,
        delta: { x: 80, y: 0 },
        groupSizePx: 400,
      },
      {
        name: 'ResizableDemo nested vertical',
        previewLabel: 'ResizableDemo live preview',
        groupIndex: 1,
        delta: { x: 0, y: 80 },
        groupSizePx: 200,
        startOffset: { x: 0, y: 5 },
      },
      {
        name: 'ResizableVertical root',
        previewLabel: 'ResizableVertical live preview',
        groupIndex: 0,
        delta: { x: 0, y: 80 },
        groupSizePx: 200,
        startOffset: { x: 0, y: 5 },
      },
      {
        name: 'ResizableRtl root',
        previewLabel: 'ResizableRtl live preview',
        groupIndex: 0,
        delta: { x: -80, y: 0 },
        groupSizePx: 400,
        startOffset: { x: 5, y: 0 },
      },
      {
        name: 'ResizableRtl nested vertical',
        previewLabel: 'ResizableRtl live preview',
        groupIndex: 1,
        delta: { x: 0, y: 80 },
        groupSizePx: 200,
        startOffset: { x: 0, y: 5 },
      },
    ]

    await cases.reduce<Promise<void>>(
      (previous, testCase) =>
        previous.then(() =>
          playwrightTest.step(testCase.name, () =>
            expectResizableCaseWorks(page, testCase),
          ),
        ),
      Promise.resolve(),
    )

    const verticalRoot = page
      .getByLabel('ResizableVertical live preview')
      .locator('[data-slot="resizable-panel-group"]')
      .first()
    const verticalHandleVisualLine = await firstResizableHandle(
      verticalRoot,
    ).evaluate(handle =>
      Number.parseFloat(window.getComputedStyle(handle, '::after').height),
    )

    playwrightExpect(verticalHandleVisualLine).toBeLessThanOrEqual(2)
  },
)

playwrightTest(
  'checkbox field and switch docs keep descriptions and selection state interactive',
  async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })

    await page.goto('/components/shadcn/checkbox')

    const checkboxDescription = page.getByLabel(
      'CheckboxDescription live preview',
    )
    await playwrightExpect(
      checkboxDescription.getByText(
        'By clicking this checkbox, you agree to the terms and conditions.',
      ),
    ).toBeVisible()

    const checkboxTable = page.getByLabel('CheckboxInTable live preview')
    const tableCheckboxes = checkboxTable.getByRole('checkbox')
    const selectAllCheckbox = tableCheckboxes.first()
    const firstRowCheckbox = tableCheckboxes.nth(1)
    const secondRowCheckbox = tableCheckboxes.nth(2)

    await selectAllCheckbox.click()
    await playwrightExpect(firstRowCheckbox).toHaveAttribute(
      'aria-checked',
      'true',
    )
    await playwrightExpect(secondRowCheckbox).toHaveAttribute(
      'aria-checked',
      'true',
    )
    await secondRowCheckbox.click()
    await playwrightExpect(selectAllCheckbox).toHaveAttribute(
      'aria-checked',
      /^(?<checkedState>false|mixed)$/u,
    )

    await page.goto('/components/shadcn/field')

    const fieldCheckbox = page.getByLabel('FieldCheckbox live preview')
    const externalDisksLabel = fieldCheckbox.getByText('External disks')
    const externalDisksCheckbox = fieldCheckbox.getByRole('checkbox').nth(1)

    await externalDisksLabel.click()
    await playwrightExpect(externalDisksCheckbox).toHaveAttribute(
      'aria-checked',
      'true',
    )

    await page.goto('/components/shadcn/switch')

    const switchDescription = page.getByLabel('SwitchDescription live preview')
    await playwrightExpect(
      switchDescription.getByText(
        'Focus is shared across devices, and turns off when you leave the app.',
      ),
    ).toBeVisible()
  },
)

playwrightTest(
  'calendar date picker carousel data table pagination table docs keep shadcn live state interactive',
  async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })

    await page.goto('/components/shadcn/calendar')
    const calendarPreview = page.getByLabel('CalendarDemo live preview')
    const calendarHeading = calendarPreview.getByText('January 2025')

    await playwrightExpect(calendarHeading).toBeVisible()
    await calendarPreview
      .getByRole('button', { name: 'Go to the next month' })
      .click()
    await playwrightExpect(
      calendarPreview.getByText('February 2025'),
    ).toBeVisible()
    await calendarPreview
      .getByRole('button', { name: 'Go to the previous month' })
      .click()
    await playwrightExpect(calendarHeading).toBeVisible()
    await calendarPreview
      .getByRole('button', { name: 'Friday, January 10, 2025' })
      .click()
    await playwrightExpect(
      calendarPreview.locator('[data-day="2025-01-10"]'),
    ).toHaveAttribute('aria-selected', 'true')

    await page.goto('/components/shadcn/date-picker')
    const datePickerPreview = page.getByLabel('DatePickerDemo live preview')
    const datePickerCard = page.locator(DOCS_PREVIEW_CARD_SELECTOR, {
      has: datePickerPreview,
    })
    const datePickerTrigger = datePickerPreview.getByRole('button', {
      name: /June 12, 2025/u,
    })

    await datePickerTrigger.click()

    const datePickerPanel = page.locator('[id$="-panel"]').first()

    await playwrightExpect(datePickerPanel).toBeVisible()

    const panelStyles = await datePickerPanel.evaluate(element => {
      const style = window.getComputedStyle(element)

      return {
        backgroundColor: style.backgroundColor,
        borderTopWidth: style.borderTopWidth,
        boxShadow: style.boxShadow,
        zIndex: Number.parseInt(style.zIndex, 10),
      }
    })

    playwrightExpect(panelStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    playwrightExpect(panelStyles.borderTopWidth).not.toBe('0px')
    playwrightExpect(panelStyles.boxShadow).not.toBe('none')
    playwrightExpect(panelStyles.zIndex).toBeGreaterThanOrEqual(50)

    const panelBox = await datePickerPanel.boundingBox()
    const cardBox = await datePickerCard.boundingBox()

    playwrightExpect(panelBox).not.toBeNull()
    playwrightExpect(cardBox).not.toBeNull()
    if (panelBox !== null && cardBox !== null) {
      playwrightExpect(panelBox.y + panelBox.height).toBeLessThanOrEqual(
        cardBox.y + cardBox.height + 1,
      )
    }

    await datePickerPanel
      .getByRole('button', { name: 'Saturday, June 14, 2025' })
      .click()
    await playwrightExpect(datePickerPanel).not.toBeVisible()
    await playwrightExpect(
      datePickerPreview.getByRole('button', { name: /June 14, 2025/u }),
    ).toBeVisible()

    const compactTrigger = page
      .getByLabel('DatePickerBasic live preview')
      .getByRole('button', { name: /January 6, 2025/u })
    const regularBox = await datePickerPreview
      .locator('[id$="-button"]')
      .first()
      .boundingBox()
    const compactBox = await compactTrigger.boundingBox()

    playwrightExpect(regularBox).not.toBeNull()
    playwrightExpect(compactBox).not.toBeNull()
    if (regularBox !== null && compactBox !== null) {
      playwrightExpect(compactBox.height).toBeLessThan(regularBox.height)
    }

    await page.goto('/components/shadcn/carousel')
    const carouselPreview = page.getByLabel('CarouselDemo live preview')
    const carouselRoot = carouselPreview.locator('[data-slot="carousel"]')
    const carouselTrack = carouselPreview
      .locator('[data-slot="carousel-content"]')
      .locator('div')
      .first()
    const previousSlide = carouselPreview.getByRole('button', {
      name: 'Previous slide',
    })
    const nextSlide = carouselPreview.getByRole('button', {
      name: 'Next slide',
    })

    await playwrightExpect(previousSlide).toBeDisabled()
    await playwrightExpect(nextSlide).toBeEnabled()
    await playwrightExpect(carouselRoot).toHaveAttribute(
      'data-selected-index',
      '0',
    )

    const initialTransform = await carouselTrack.evaluate(
      element => window.getComputedStyle(element).transform,
    )

    await nextSlide.click()
    await playwrightExpect(carouselRoot).toHaveAttribute(
      'data-selected-index',
      '1',
    )
    await playwrightExpect(previousSlide).toBeEnabled()

    const carouselMotion = await carouselTrack.evaluate(element => {
      const style = window.getComputedStyle(element)

      return {
        transform: style.transform,
        transitionDuration: style.transitionDuration,
        transitionProperty: style.transitionProperty,
      }
    })

    playwrightExpect(carouselMotion.transform).not.toBe(initialTransform)
    playwrightExpect(carouselMotion.transitionProperty).toContain('transform')
    playwrightExpect(carouselMotion.transitionDuration).not.toBe('0s')

    await carouselRoot.press('ArrowLeft')
    await playwrightExpect(carouselRoot).toHaveAttribute(
      'data-selected-index',
      '0',
    )
    await playwrightExpect(previousSlide).toBeDisabled()

    await page.goto('/components/shadcn/data-table')
    const dataTablePreview = page.getByLabel('DataTableDemo live preview')
    const dataTableBodyRows = dataTablePreview.locator(
      '[data-slot="table-body"] [data-slot="table-row"]',
    )

    await playwrightExpect(dataTableBodyRows).toHaveCount(10)
    await dataTablePreview.getByRole('button', { name: 'Columns' }).click()
    await playwrightExpect(
      dataTablePreview.locator('[data-slot="dropdown-menu-content"]'),
    ).toBeVisible()
    await dataTablePreview
      .getByRole('menuitemcheckbox', { name: 'Amount' })
      .click()
    await playwrightExpect(
      dataTablePreview.getByRole('columnheader', { name: 'Amount' }),
    ).not.toBeVisible()
    await page.keyboard.press('Escape')
    await playwrightExpect(
      dataTablePreview.locator('[data-slot="dropdown-menu-content"]'),
    ).not.toBeVisible()

    await dataTablePreview.locator('[data-slot="select-trigger"]').click()
    await page.getByRole('option', { exact: true, name: '20' }).click()
    await playwrightExpect(dataTableBodyRows).toHaveCount(20)
    await playwrightExpect(
      dataTablePreview.getByText('Page 1 of 2'),
    ).toBeVisible()

    await dataTablePreview
      .getByRole('checkbox', { name: 'Select all payments' })
      .click()
    await playwrightExpect(
      dataTablePreview.getByText('20 of 25 row(s) selected.'),
    ).toBeVisible()

    await page.goto('/components/shadcn/pagination')
    const paginationPreview = page.getByLabel(
      'PaginationIconsOnly live preview',
    )

    await playwrightExpect(
      paginationPreview.locator('[data-slot="pagination-rows"] li'),
    ).toHaveCount(25)
    await paginationPreview.locator('[data-slot="select-trigger"]').click()
    await paginationPreview
      .getByRole('option', { exact: true, name: '10' })
      .click()
    await playwrightExpect(
      paginationPreview.locator('[data-slot="pagination-rows"] li'),
    ).toHaveCount(10)
    await playwrightExpect(
      paginationPreview.locator('[data-slot="pagination-status"]'),
    ).toHaveText('Showing 10 of 25 rows')

    await page.goto('/components/shadcn/table')
    const tableActionsPreview = page.getByLabel('TableActions live preview')
    const tableActionsMenu = tableActionsPreview.locator(
      '[data-slot="dropdown-menu-content"]',
    )

    await tableActionsPreview
      .getByRole('button', { name: 'Open menu' })
      .first()
      .click()
    await playwrightExpect(tableActionsMenu).toBeVisible()
    await tableActionsPreview
      .getByRole('menuitem', { name: 'Duplicate' })
      .click()
    await playwrightExpect(tableActionsMenu).not.toBeVisible()
  },
)

playwrightTest(
  'input otp docs render one logical input surface with styled slots',
  async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/components/shadcn/input-otp')

    const otpPreview = page.getByLabel('InputOTPDemo live preview')

    await playwrightExpect(
      otpPreview.locator('[data-slot="input-otp-slot"]'),
    ).toHaveCount(6)
    await playwrightExpect(
      otpPreview.locator('[data-slot="input-otp-input"]'),
    ).toHaveCount(1)
  },
)

playwrightTest(
  'collapsible and tabs docs switch views and render real icons',
  async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/components/shadcn/collapsible')

    const fileTreePreview = page.getByLabel('CollapsibleFileTree live preview')

    await fileTreePreview.getByRole('button', { name: 'Outline' }).click()
    await playwrightExpect(
      fileTreePreview.getByText('Project structure'),
    ).toBeVisible()
    await fileTreePreview.getByRole('button', { name: 'Explorer' }).click()
    await playwrightExpect(
      fileTreePreview.getByText('components'),
    ).toBeVisible()

    await page.goto('/components/shadcn/tabs')

    const tabsIconsPreview = page.getByLabel('TabsIcons live preview')

    await playwrightExpect(
      tabsIconsPreview.locator('[data-icon="preview"]'),
    ).toBeVisible()
    await playwrightExpect(
      tabsIconsPreview.locator('[data-icon="code"]'),
    ).toBeVisible()
    await tabsIconsPreview.getByRole('tab', { name: 'Code' }).click()
    await playwrightExpect(
      tabsIconsPreview.getByText('Installable example code'),
    ).toBeVisible()
  },
)
