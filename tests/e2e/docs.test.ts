import {
  expect as playwrightExpect,
  test as playwrightTest,
} from '@playwright/test'
import type { Locator, Page } from '@playwright/test'

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

const expectExampleCardsStayInsideMainColumn = async (page: Page) => {
  const mainBox = await page.locator('#main-content').boundingBox()
  const exampleCards = page.locator('.example-card')
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
  const liveReadyCards = page.locator('.example-card', {
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

const expectElementsStayInsideMainColumn = async (
  page: Page,
  selector: string,
) => {
  const mainBox = await page.locator('#main-content').boundingBox()
  const elements = page.locator(selector)
  const count = await elements.count()

  playwrightExpect(mainBox).not.toBeNull()
  playwrightExpect(count).toBeGreaterThan(0)

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
  await expectElementsStayInsideMainColumn(page, '#usage .snippet-block')
  await expectElementsStayInsideMainColumn(page, '#usage .meta-list')
  await expectElementsStayInsideMainColumn(page, '#usage .meta-list div')
  await expectRenderedTextStaysInside(page, '#usage .meta-list')
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
    const customViewportBox = await customViewport.boundingBox()

    await playwrightExpect(customViewport).toHaveAttribute(
      'data-position',
      'top-center',
    )
    playwrightExpect(customViewportBox).not.toBeNull()
    if (customViewportBox !== null) {
      playwrightExpect(customViewportBox.y).toBeLessThan(32)
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
