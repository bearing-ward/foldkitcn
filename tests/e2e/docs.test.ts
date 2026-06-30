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
