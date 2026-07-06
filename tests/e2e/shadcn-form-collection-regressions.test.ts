import {
  expect as playwrightExpect,
  test as playwrightTest,
} from '@playwright/test'
import type { Locator, Page } from '@playwright/test'

type Box = Readonly<{
  height: number
  width: number
  x: number
  y: number
}>

const box = async (locator: Locator): Promise<Box> => {
  const layoutBox = await locator.boundingBox()

  if (layoutBox === null) {
    throw new Error('Expected element to have a browser layout box.')
  }

  return {
    height: Math.round(layoutBox.height),
    width: Math.round(layoutBox.width),
    x: Math.round(layoutBox.x),
    y: Math.round(layoutBox.y),
  }
}

const dragFromCenter = async (
  page: Page,
  locator: Locator,
  offsetX: number,
  offsetY: number,
): Promise<void> => {
  const layoutBox = await locator.boundingBox()

  if (layoutBox === null) {
    throw new Error('Expected draggable element to have a browser layout box.')
  }

  const startX = layoutBox.x + layoutBox.width / 2
  const startY = layoutBox.y + layoutBox.height / 2

  await page.mouse.move(startX, startY)
  await page.mouse.down()
  await page.mouse.move(startX + offsetX, startY + offsetY)
  await page.mouse.up()
}

playwrightTest(
  'combobox docs keep popup filtering, clearing, and custom items live',
  async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/components/shadcn/combobox')

    const popupPreview = page.getByLabel('ComboboxPopup live preview')
    const popupTrigger = popupPreview.locator('[data-slot="combobox-trigger"]')
    const popupInput = popupPreview.locator('[data-slot="input-group-control"]')
    const popupContent = page.locator('[data-slot="combobox-content"]')

    await playwrightExpect(popupTrigger.locator('svg')).toHaveCount(1)
    await playwrightExpect(popupTrigger).not.toHaveText('v')

    await popupInput.fill('chi')
    await playwrightExpect(popupContent).toBeVisible()
    const beforeClear = await box(popupContent)
    await playwrightExpect(
      page.getByRole('option', { name: 'China' }),
    ).toBeVisible()
    await popupInput.press('Backspace')
    await popupInput.press('Backspace')
    await popupInput.press('Backspace')
    await playwrightExpect(popupInput).toHaveValue('')
    await playwrightExpect(page.getByRole('option')).toHaveCount(10)
    const afterClear = await box(popupContent)
    playwrightExpect(
      Math.abs(beforeClear.x - afterClear.x),
    ).toBeLessThanOrEqual(4)
    playwrightExpect(
      Math.abs(beforeClear.y - afterClear.y),
    ).toBeLessThanOrEqual(4)
    playwrightExpect(
      Math.abs(beforeClear.height - afterClear.height),
    ).toBeLessThanOrEqual(300)

    const clearPreview = page.getByLabel('ComboboxWithClear live preview')
    const clearTrigger = clearPreview.locator('[data-slot="combobox-trigger"]')
    const clearButton = clearPreview.locator('[data-slot="combobox-clear"]')
    const clearInput = clearPreview.locator('[data-slot="input-group-control"]')

    await playwrightExpect(clearTrigger.locator('svg')).toHaveCount(1)
    await clearButton.click()
    await playwrightExpect(clearInput).toHaveValue('')

    const customPreview = page.getByLabel(
      'ComboboxWithCustomItems live preview',
    )
    await customPreview.locator('[data-slot="combobox-trigger"]').click()
    await playwrightExpect(
      customPreview.getByRole('option', { name: 'Argentina' }),
    ).toBeVisible()
    await playwrightExpect(
      customPreview.getByRole('option', { name: 'Australia' }),
    ).toBeVisible()
    await playwrightExpect(
      customPreview.getByRole('option', { name: 'Next.js' }),
    ).toHaveCount(0)
  },
)

playwrightTest(
  'data table docs keep page-size and selection aggregates synchronized',
  async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/components/shadcn/data-table')

    const preview = page.getByLabel('DataTableDemo live preview')
    const bodyRows = preview.locator(
      '[data-slot="table-body"] [data-slot="table-row"]',
    )
    const pageSizeTrigger = preview.locator('[data-slot="select-trigger"]')
    const pageSizeOptions = ['10', '20', '30', '40', '50'] as const
    const pageSizeOption = (value: string) =>
      page.getByRole('option', { exact: true, name: value })

    await playwrightExpect(bodyRows).toHaveCount(10)
    await pageSizeTrigger.click()
    await playwrightExpect(pageSizeOption(pageSizeOptions[0])).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await playwrightExpect(pageSizeOption(pageSizeOptions[0])).toHaveAttribute(
      'data-selected',
      '',
    )
    await playwrightExpect(pageSizeOption(pageSizeOptions[1])).toHaveAttribute(
      'aria-selected',
      'false',
    )
    await playwrightExpect(pageSizeOption(pageSizeOptions[2])).toHaveAttribute(
      'aria-selected',
      'false',
    )
    await playwrightExpect(pageSizeOption(pageSizeOptions[3])).toHaveAttribute(
      'aria-selected',
      'false',
    )
    await playwrightExpect(pageSizeOption(pageSizeOptions[4])).toHaveAttribute(
      'aria-selected',
      'false',
    )
    await pageSizeOption(pageSizeOptions[1]).click()
    await playwrightExpect(bodyRows).toHaveCount(20)
    await playwrightExpect(preview.getByText('Page 1 of 2')).toBeVisible()
    await playwrightExpect(pageSizeTrigger).toHaveText('20')

    await preview.getByRole('checkbox', { name: 'Select all payments' }).click()
    await playwrightExpect(
      preview.getByText('20 of 25 row(s) selected.'),
    ).toBeVisible()
    await preview
      .getByRole('checkbox', { name: 'Select payment' })
      .nth(1)
      .click()
    await playwrightExpect(
      preview.getByText('19 of 25 row(s) selected.'),
    ).toBeVisible()
    await playwrightExpect(
      preview.getByRole('checkbox', { name: 'Select all payments' }),
    ).toHaveAttribute('aria-checked', 'mixed')
  },
)

playwrightTest(
  'pagination docs keep only the active rows-per-page option checked',
  async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/components/shadcn/pagination')

    const preview = page.getByLabel('PaginationIconsOnly live preview')
    const trigger = preview.locator('[data-slot="select-trigger"]')
    const option10 = preview.getByRole('option', { exact: true, name: '10' })
    const option25 = preview.getByRole('option', { exact: true, name: '25' })
    const option50 = preview.getByRole('option', { exact: true, name: '50' })
    const option100 = preview.getByRole('option', { exact: true, name: '100' })

    await trigger.click()
    await playwrightExpect(option25).toHaveAttribute('aria-selected', 'true')
    await playwrightExpect(option25).toHaveAttribute('data-selected', '')
    await playwrightExpect(option10).not.toHaveAttribute('data-selected', '')
    await playwrightExpect(option50).not.toHaveAttribute('data-selected', '')
    await playwrightExpect(option100).not.toHaveAttribute('data-selected', '')
    await option10.click()
    await playwrightExpect(
      preview.locator('[data-slot="pagination-rows"] li'),
    ).toHaveCount(10)
    await playwrightExpect(
      preview.locator('[data-slot="pagination-status"]'),
    ).toHaveText('Showing 10 of 25 rows')

    await trigger.click()
    await playwrightExpect(option10).toHaveAttribute('aria-selected', 'true')
    await playwrightExpect(option25).toHaveAttribute('aria-selected', 'false')
    await playwrightExpect(option50).toHaveAttribute('aria-selected', 'false')
    await playwrightExpect(option100).toHaveAttribute('aria-selected', 'false')
    await playwrightExpect(option10).toHaveAttribute('data-selected', '')
    await playwrightExpect(option25).not.toHaveAttribute('data-selected', '')
    await playwrightExpect(option50).not.toHaveAttribute('data-selected', '')
    await playwrightExpect(option100).not.toHaveAttribute('data-selected', '')
  },
)

playwrightTest(
  'progress docs expose a live control that changes the fill',
  async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/components/shadcn/progress')

    const preview = page.getByLabel('ProgressControlled live preview')
    const control = preview.getByRole('slider')
    const track = preview.locator('[data-slot="progress-track"]')
    const indicator = preview.locator('[data-slot="progress-indicator"]')

    await playwrightExpect(control).toBeVisible()
    await playwrightExpect(track).toBeVisible()
    await playwrightExpect(indicator).toBeVisible()

    const beforeIndicator = await box(indicator)

    await control.focus()
    await control.press('ArrowRight')

    await playwrightExpect(control).not.toHaveAttribute('aria-valuenow', '50')
    await playwrightExpect(preview.getByText('51%')).toBeVisible()
    await playwrightExpect(await box(indicator)).not.toEqual(beforeIndicator)
  },
)

playwrightTest(
  'input otp docs accept all digits and recover after backspace',
  async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/components/shadcn/input-otp')

    const preview = page.getByLabel('InputOTPDemo live preview')
    const inputs = preview.locator('[data-slot="input-otp-slot"] input')
    const slots = preview.locator('[data-slot="input-otp-slot"]')

    await playwrightExpect(slots).toHaveCount(6)
    await playwrightExpect(slots).toHaveText(['1', '2', '3', '4', '5', '6'])
    await inputs.last().press('Backspace')
    await playwrightExpect(slots).toHaveText(['1', '2', '3', '4', '5', ''])
    await inputs.last().click()
    await page.keyboard.type('6', { delay: 25 })
    await playwrightExpect(slots).toHaveText(['1', '2', '3', '4', '5', '6'])
  },
)

playwrightTest(
  'slider docs respond to drag and keyboard input',
  async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 1200 })
    await page.goto('/components/shadcn/slider')

    const demoPreview = page.getByLabel('SliderDemo live preview')
    const demoInput = demoPreview.locator('input[type="range"]').first()
    const demoThumb = demoPreview.locator('[data-slot="slider-thumb"]').first()

    await playwrightExpect(demoInput).toHaveAttribute('aria-valuenow', '75')
    await demoInput.focus()
    await demoInput.press('ArrowRight')
    await playwrightExpect(demoInput).toHaveAttribute('aria-valuenow', '76')
    const demoThumbBefore = await box(demoThumb)
    await dragFromCenter(page, demoThumb, 80, 0)
    await playwrightExpect(demoInput).not.toHaveAttribute('aria-valuenow', '76')
    await playwrightExpect(await box(demoThumb)).not.toEqual(demoThumbBefore)

    const rangePreview = page.getByLabel('SliderRange live preview')
    const rangeInputs = rangePreview.locator('input[type="range"]')
    const rangeThumbs = rangePreview.locator('[data-slot="slider-thumb"]')

    await playwrightExpect(rangeInputs).toHaveCount(2)
    await rangeInputs.nth(0).focus()
    await rangeInputs.nth(0).press('ArrowRight')
    await playwrightExpect(rangeInputs.nth(0)).toHaveAttribute(
      'aria-valuenow',
      '30',
    )
    const rangeThumbBefore = await box(rangeThumbs.nth(1))
    await dragFromCenter(page, rangeThumbs.nth(1), 60, 0)
    await playwrightExpect(rangeInputs.nth(1)).not.toHaveAttribute(
      'aria-valuenow',
      '50',
    )
    await playwrightExpect(await box(rangeThumbs.nth(1))).not.toEqual(
      rangeThumbBefore,
    )

    const verticalPreview = page.getByLabel('SliderVertical live preview')
    const verticalInputs = verticalPreview.locator('input[type="range"]')
    const verticalThumb = verticalPreview
      .locator('[data-slot="slider-thumb"]')
      .first()

    await playwrightExpect(verticalInputs).toHaveCount(1)
    await verticalInputs.first().focus()
    await verticalInputs.first().press('ArrowUp')
    await playwrightExpect(verticalInputs.first()).toHaveAttribute(
      'aria-valuenow',
      '51',
    )
    const verticalThumbBefore = await box(verticalThumb)
    await dragFromCenter(page, verticalThumb, 0, -60)
    await playwrightExpect(verticalInputs.first()).not.toHaveAttribute(
      'aria-valuenow',
      '51',
    )
    await playwrightExpect(await box(verticalThumb)).not.toEqual(
      verticalThumbBefore,
    )
  },
)
