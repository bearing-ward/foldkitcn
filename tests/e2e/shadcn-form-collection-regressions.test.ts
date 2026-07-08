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

const clickSliderControlAt = async (
  page: Page,
  control: Locator,
  xPercent: number,
  yPercent: number,
): Promise<void> => {
  await control.scrollIntoViewIfNeeded()

  const layoutBox = await control.boundingBox()

  if (layoutBox === null) {
    throw new Error('Expected slider control to have a browser layout box.')
  }

  await page.mouse.click(
    layoutBox.x + layoutBox.width * xPercent,
    layoutBox.y + layoutBox.height * yPercent,
  )
}

const expectSliderValue = async (
  input: Locator,
  value: number,
): Promise<void> => {
  const valueText = String(value)

  await playwrightExpect(input).toHaveAttribute('aria-valuenow', valueText)
  await playwrightExpect(input).toHaveValue(valueText)
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

playwrightTest('slider docs hit exact pointer values', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1200 })
  await page.goto('/components/shadcn/slider')

  const demoPreview = page.getByLabel('SliderDemo live preview')
  const demoControl = demoPreview.locator('[data-base-ui-slider-control]')
  const demoInput = demoPreview.locator('input[type="range"]').first()

  await expectSliderValue(demoInput, 75)
  await clickSliderControlAt(page, demoControl, 0.5, 0.5)
  await expectSliderValue(demoInput, 50)
  await clickSliderControlAt(page, demoControl, 0.25, 0.5)
  await expectSliderValue(demoInput, 25)
  await clickSliderControlAt(page, demoControl, 0.75, 0.5)
  await expectSliderValue(demoInput, 75)

  const rangePreview = page.getByLabel('SliderRange live preview')
  const rangeControl = rangePreview.locator('[data-base-ui-slider-control]')
  const rangeInputs = rangePreview.locator('input[type="range"]')

  await playwrightExpect(rangeInputs).toHaveCount(2)
  await expectSliderValue(rangeInputs.nth(0), 25)
  await expectSliderValue(rangeInputs.nth(1), 50)
  await clickSliderControlAt(page, rangeControl, 0.3, 0.5)
  await expectSliderValue(rangeInputs.nth(0), 30)
  await expectSliderValue(rangeInputs.nth(1), 50)
  await clickSliderControlAt(page, rangeControl, 0.8, 0.5)
  await expectSliderValue(rangeInputs.nth(0), 30)
  await expectSliderValue(rangeInputs.nth(1), 80)
  await clickSliderControlAt(page, rangeControl, 0.6, 0.5)
  await expectSliderValue(rangeInputs.nth(0), 30)
  await expectSliderValue(rangeInputs.nth(1), 60)

  const rtlPreview = page.getByLabel('SliderRtl live preview')
  const rtlControl = rtlPreview.locator('[data-base-ui-slider-control]')
  const rtlInput = rtlPreview.locator('input[type="range"]').first()

  await clickSliderControlAt(page, rtlControl, 0.25, 0.5)
  await expectSliderValue(rtlInput, 75)
  await clickSliderControlAt(page, rtlControl, 0.75, 0.5)
  await expectSliderValue(rtlInput, 25)

  const verticalPreview = page.getByLabel('SliderVertical live preview')
  const verticalControl = verticalPreview.locator(
    '[data-base-ui-slider-control]',
  )
  const verticalInput = verticalPreview.locator('input[type="range"]').first()

  await clickSliderControlAt(page, verticalControl, 0.5, 0.25)
  await expectSliderValue(verticalInput, 75)
  await clickSliderControlAt(page, verticalControl, 0.5, 0.75)
  await expectSliderValue(verticalInput, 25)

  const disabledPreview = page.getByLabel('SliderDisabled live preview')
  const disabledControl = disabledPreview.locator(
    '[data-base-ui-slider-control]',
  )
  const disabledInput = disabledPreview.locator('input[type="range"]').first()

  await expectSliderValue(disabledInput, 50)
  await clickSliderControlAt(page, disabledControl, 0.25, 0.5)
  await expectSliderValue(disabledInput, 50)
  await clickSliderControlAt(page, disabledControl, 0.5, 0.5)
  await expectSliderValue(disabledInput, 50)
  await clickSliderControlAt(page, disabledControl, 0.75, 0.5)
  await expectSliderValue(disabledInput, 50)
})

playwrightTest(
  'slider docs preserve keyboard and native input state',
  async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 1200 })
    await page.goto('/components/shadcn/slider')

    const demoPreview = page.getByLabel('SliderDemo live preview')
    const demoInput = demoPreview.locator('input[type="range"]').first()

    await expectSliderValue(demoInput, 75)
    await demoInput.focus()
    await demoInput.press('ArrowRight')
    await expectSliderValue(demoInput, 76)
    await playwrightExpect(demoInput).toHaveAttribute('min', '0')
    await playwrightExpect(demoInput).toHaveAttribute('max', '100')
    await playwrightExpect(demoInput).toHaveAttribute('step', '1')
    await playwrightExpect(demoPreview.getByText('76')).toBeVisible()

    const rangePreview = page.getByLabel('SliderRange live preview')
    const rangeInputs = rangePreview.locator('input[type="range"]')

    await playwrightExpect(rangeInputs).toHaveCount(2)
    await rangeInputs.nth(0).focus()
    await rangeInputs.nth(0).press('ArrowRight')
    await expectSliderValue(rangeInputs.nth(0), 30)
    await expectSliderValue(rangeInputs.nth(1), 50)

    const rtlPreview = page.getByLabel('SliderRtl live preview')
    const rtlInput = rtlPreview.locator('input[type="range"]').first()

    await expectSliderValue(rtlInput, 75)
    await rtlInput.focus()
    await rtlInput.press('ArrowRight')
    await expectSliderValue(rtlInput, 74)

    const disabledPreview = page.getByLabel('SliderDisabled live preview')
    const disabledInput = disabledPreview.locator('input[type="range"]').first()
    const disabledControl = disabledPreview.locator(
      '[data-base-ui-slider-control]',
    )
    const disabledThumb = disabledPreview.locator('[data-slot="slider-thumb"]')

    await expectSliderValue(disabledInput, 50)
    await playwrightExpect(disabledInput).toBeDisabled()
    await playwrightExpect(disabledControl).toHaveAttribute('data-disabled', '')
    await playwrightExpect(disabledThumb).toHaveAttribute('data-disabled', '')
  },
)
