import {
  expect as playwrightExpect,
  test as playwrightTest,
} from '@playwright/test'
import { Schema as S } from 'effect'

import {
  ComponentDocsArtifact,
  ComponentDocsIndex,
} from '../../src/registry/schema'

/* eslint-disable no-await-in-loop, complexity */
import { readFileSync } from 'node:fs'

const docsIndex = S.decodeUnknownSync(ComponentDocsIndex)(
  JSON.parse(readFileSync('registry/docs/index.json', 'utf-8')),
)
const components = docsIndex.routes.map(route =>
  S.decodeUnknownSync(ComponentDocsArtifact)(
    JSON.parse(readFileSync(route.docsArtifactPath, 'utf-8')),
  ),
)

const escapedAttributeValue = (value: string): string =>
  value.replaceAll('\\', '\\\\').replaceAll('"', '\\"')

const resolvedPhysicalSide = (
  side: string | null,
  direction: string,
): string | null => {
  if (side === 'inline-start') {
    return direction === 'rtl' ? 'right' : 'left'
  }
  if (side === 'inline-end') {
    return direction === 'rtl' ? 'left' : 'right'
  }
  return side
}

playwrightTest.describe('declared component and example behavior', () => {
  for (const component of components) {
    playwrightTest(
      `${component.itemId} satisfies its generated behavior contract`,
      async ({ page }) => {
        const runtimeErrors: Array<string> = []
        page.on('console', message => {
          if (message.type() === 'error') {
            runtimeErrors.push(message.text())
          }
        })
        page.on('pageerror', error => runtimeErrors.push(error.message))

        playwrightExpect(component.distinguishes.trim()).not.toBe('')
        playwrightExpect(component.behaviorExpectations.length).toBeGreaterThan(
          0,
        )

        await page.goto(component.routePath)
        const additionalExamples = page.locator('details.additional-examples')
        if ((await additionalExamples.count()) > 0) {
          await additionalExamples.evaluateAll(details => {
            for (const detail of details) {
              if (detail instanceof HTMLDetailsElement) {
                detail.open = true
              }
            }
          })
        }

        for (const example of component.examples) {
          playwrightExpect(example.distinguishes.trim()).not.toBe('')
          playwrightExpect(example.behaviorExpectations.length).toBeGreaterThan(
            0,
          )

          const card = page.locator(
            `[data-example-id="${escapedAttributeValue(example.id)}"]`,
          )
          await playwrightExpect(
            card.getByRole('heading', { name: example.title }),
          ).toBeVisible()

          if (example.behaviorExpectations.includes('renders-without-errors')) {
            await playwrightExpect(card).toBeVisible()
            if (example.previewStatus === 'live-ready') {
              await playwrightExpect(
                card.locator('.live-example-preview'),
              ).toBeVisible()
            }
          }

          if (example.behaviorExpectations.includes('preview-contained')) {
            const preview = card.locator('.docs-preview-surface')
            await playwrightExpect(preview).toBeVisible()
            playwrightExpect(
              await preview.evaluate(
                element => element.scrollWidth <= element.clientWidth + 1,
              ),
            ).toBe(true)
          }

          if (example.behaviorExpectations.includes('closed-content-hidden')) {
            await playwrightExpect(
              card.locator(
                '[data-slot$="-content"]:visible, [data-popup]:visible',
              ),
            ).toHaveCount(0)
          }

          if (example.behaviorExpectations.includes('opens-without-scroll')) {
            const trigger = card
              .locator('.live-example-preview')
              .getByRole('button')
              .first()
            await trigger.click()
            const menu = page.getByRole('menu')
            await playwrightExpect(menu).toBeVisible()
            playwrightExpect(
              await menu.evaluate(
                element => element.scrollHeight <= element.clientHeight,
              ),
            ).toBe(true)
            await page.keyboard.press('Escape')
            await playwrightExpect(menu).not.toBeVisible()
          }

          if (example.behaviorExpectations.includes('single-submenu-chain')) {
            const trigger = card
              .locator('.live-example-preview')
              .getByRole('button')
              .first()
            await trigger.click()
            const rootMenu = page.locator('[data-slot="dropdown-menu-content"]')
            const rootSubmenuTriggers = rootMenu.locator(
              '[data-slot="dropdown-menu-sub-trigger"]',
            )
            const openSubmenus = page.locator(
              '[data-slot="dropdown-menu-sub-content"][data-open]',
            )
            await rootSubmenuTriggers.first().hover()
            await playwrightExpect(openSubmenus).toHaveCount(1)
            await openSubmenus
              .first()
              .locator('[data-slot="dropdown-menu-sub-trigger"]')
              .first()
              .hover()
            await playwrightExpect(openSubmenus).toHaveCount(2)
            await rootSubmenuTriggers.nth(1).hover()
            await playwrightExpect(openSubmenus).toHaveCount(1)
            await page.keyboard.press('Escape')
          }

          if (
            example.behaviorExpectations.includes('viewport-command-dialog')
          ) {
            await card.getByRole('button', { name: 'Open Menu' }).click()
            const dialog = page.locator('dialog[open]')
            const inputGroup = dialog.locator('[data-slot="input-group"]')
            const input = dialog.locator('[data-slot="command-input"]')
            const searchIcon = dialog.locator(
              '[data-slot="input-group-addon"] svg',
            )
            const dialogBox = await dialog.boundingBox()
            const groupBox = await inputGroup.boundingBox()
            const inputBox = await input.boundingBox()
            const searchIconBox = await searchIcon.boundingBox()
            playwrightExpect(dialogBox).not.toBeNull()
            playwrightExpect(groupBox).not.toBeNull()
            playwrightExpect(inputBox).not.toBeNull()
            playwrightExpect(searchIconBox).not.toBeNull()
            if (
              dialogBox !== null &&
              groupBox !== null &&
              inputBox !== null &&
              searchIconBox !== null
            ) {
              playwrightExpect(dialogBox.x).toBe(0)
              playwrightExpect(dialogBox.y).toBe(0)
              playwrightExpect(dialogBox.width).toBe(1280)
              playwrightExpect(dialogBox.height).toBe(720)
              playwrightExpect(inputBox.width).toBeGreaterThan(
                groupBox.width * 0.75,
              )
              playwrightExpect(
                Math.abs(
                  inputBox.y +
                    inputBox.height / 2 -
                    (searchIconBox.y + searchIconBox.height / 2),
                ),
              ).toBeLessThanOrEqual(1)
            }
            await page.keyboard.press('Escape')
            await playwrightExpect(dialog).not.toBeVisible()
          }

          if (example.behaviorExpectations.includes('focuses-input-on-open')) {
            await card.getByRole('button', { name: 'Open Menu' }).click()
            const dialog = page.locator('dialog[open]')
            await playwrightExpect(
              dialog.locator('[data-slot="command-input"]'),
            ).toBeFocused()
            await page.keyboard.press('Escape')
          }

          if (example.behaviorExpectations.includes('filters-to-empty-state')) {
            await card.getByRole('button', { name: 'Open Menu' }).click()
            const dialog = page.locator('dialog[open]')
            const input = dialog.locator('[data-slot="command-input"]')
            await playwrightExpect(
              dialog.getByText('No results found.'),
            ).toHaveCount(0)
            await input.fill('not-a-command')
            await playwrightExpect(
              dialog.getByText('No results found.'),
            ).toBeVisible()
            await playwrightExpect(
              dialog.locator('[data-slot="command-group"]'),
            ).toHaveCount(0)
            await input.fill('')
            await playwrightExpect(
              dialog.getByText('No results found.'),
            ).toHaveCount(0)
            await playwrightExpect(
              dialog.locator('[data-slot="command-group"]').first(),
            ).toBeVisible()
            await page.keyboard.press('Escape')
          }

          if (
            example.behaviorExpectations.includes('interaction-updates-state')
          ) {
            const progress = card.getByRole('progressbar')
            if ((await progress.count()) > 0) {
              const slider = card.locator('[data-slot="slider"]').first()
              const before = await progress.getAttribute('aria-valuenow')
              await slider.scrollIntoViewIfNeeded()
              const sliderBox = await slider.boundingBox()
              playwrightExpect(sliderBox).not.toBeNull()
              if (sliderBox !== null) {
                await page.mouse.move(
                  sliderBox.x + sliderBox.width / 2,
                  sliderBox.y + sliderBox.height / 2,
                )
                await page.mouse.down()
                await page.mouse.move(
                  sliderBox.x + sliderBox.width * 0.8,
                  sliderBox.y + sliderBox.height / 2,
                  { steps: 5 },
                )
                await page.mouse.up()
              }
              await playwrightExpect(progress).not.toHaveAttribute(
                'aria-valuenow',
                before ?? '',
              )
            } else {
              const trigger = card
                .locator('.live-example-preview')
                .getByRole('button')
                .first()
              const surface = card.locator('[data-slot="popover-content"]')
              await trigger.click()
              await playwrightExpect(surface).toBeVisible()
              await page.keyboard.press('Escape')
              await playwrightExpect(surface).not.toBeVisible()
            }
          }

          if (example.behaviorExpectations.includes('placement-correct')) {
            const triggers = card
              .locator('.live-example-preview')
              .getByRole('button')
            for (let index = 0; index < (await triggers.count()); index += 1) {
              const trigger = triggers.nth(index)
              await trigger.scrollIntoViewIfNeeded()
              await trigger.click()
              const surface = page.locator(
                '[data-slot="popover-content"]:visible',
              )
              await playwrightExpect(surface).toHaveCount(1)
              const side = await surface.getAttribute('data-side')
              const direction = await surface.evaluate(
                element => window.getComputedStyle(element).direction,
              )
              const resolvedSide = resolvedPhysicalSide(side, direction)
              const triggerBox = await trigger.boundingBox()
              const surfaceBox = await surface.boundingBox()
              playwrightExpect(triggerBox).not.toBeNull()
              playwrightExpect(surfaceBox).not.toBeNull()
              if (triggerBox !== null && surfaceBox !== null) {
                if (resolvedSide === 'top') {
                  playwrightExpect(
                    surfaceBox.y + surfaceBox.height,
                  ).toBeLessThanOrEqual(triggerBox.y + 1)
                } else if (resolvedSide === 'bottom') {
                  playwrightExpect(surfaceBox.y).toBeGreaterThanOrEqual(
                    triggerBox.y + triggerBox.height - 1,
                  )
                } else if (resolvedSide === 'left') {
                  playwrightExpect(
                    surfaceBox.x + surfaceBox.width,
                  ).toBeLessThanOrEqual(triggerBox.x + 1)
                } else if (resolvedSide === 'right') {
                  playwrightExpect(surfaceBox.x).toBeGreaterThanOrEqual(
                    triggerBox.x + triggerBox.width - 1,
                  )
                }
              }
              await page.keyboard.press('Escape')
              await playwrightExpect(surface).toHaveCount(0)
            }
          }
        }

        if (
          component.behaviorExpectations.includes(
            'examples-render-without-errors',
          )
        ) {
          playwrightExpect(runtimeErrors).toStrictEqual([])
        }
      },
    )
  }
})
