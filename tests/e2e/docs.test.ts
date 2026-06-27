import {
  expect as playwrightExpect,
  test as playwrightTest,
} from '@playwright/test'
import type { Page } from '@playwright/test'

const expectNoHeaderMainOverlap = async (page: Page) => {
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

playwrightTest(
  'button docs are prerendered, searchable, and responsive',
  async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/components/shadcn/button')

    await playwrightExpect(
      page.getByRole('heading', { exact: true, level: 1, name: 'Button' }),
    ).toBeVisible()

    await page.getByLabel('Search documentation').fill('button')
    await playwrightExpect(
      page.getByText('shadcn/button').first(),
    ).toBeVisible()
    await playwrightExpect(
      page.getByRole('heading', { name: 'Documentation' }),
    ).toBeVisible({ timeout: 15_000 })

    await expectNoHeaderMainOverlap(page)

    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/components/shadcn/button')
    await playwrightExpect(page.locator('#main-content')).toBeVisible()
    await expectNoHeaderMainOverlap(page)
  },
)
