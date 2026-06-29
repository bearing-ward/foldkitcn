import {
  expect as playwrightExpect,
  test as playwrightTest,
} from '@playwright/test'
import type { Page } from '@playwright/test'

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
