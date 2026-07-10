import {
  expect as playwrightExpect,
  test as playwrightTest,
} from '@playwright/test'
import { Array as EffectArray, Option, pipe, Schema as S } from 'effect'

import matrixJson from '../../plans/artifacts/128-public-component-parity/public-component-matrix.json' with { type: 'json' }
import { PublicParityContracts } from '../../scripts/public-parity-contracts'

const matrix = S.decodeUnknownSync(PublicParityContracts)(matrixJson)

const publicRoutes = [
  ...new Map(matrix.map(contract => [contract.itemId, contract.routePath])),
]
const publicCases = publicRoutes.flatMap(([itemId, routePath]) => [
  { itemId, routePath, viewport: { width: 1280, height: 900 } },
  { itemId, routePath, viewport: { width: 390, height: 844 } },
])

pipe(
  publicCases,
  EffectArray.map(({ itemId, routePath, viewport }) =>
    playwrightTest(
      `${itemId} satisfies its ${viewport.width}px docs-host contract`,
      async ({ page }) => {
        await page.setViewportSize(viewport)
        await page.goto(routePath)
        await playwrightExpect(page.locator('#main-content')).toBeVisible()

        const exampleContracts = matrix.filter(
          contract =>
            contract.itemId === itemId && Option.isSome(contract.exampleId),
        )
        const routeContracts = matrix.filter(
          contract => contract.itemId === itemId,
        )
        const previewCards = page.locator(
          '[data-docs-slot="docs-preview-card"]',
        )

        await playwrightExpect(previewCards).toHaveCount(
          exampleContracts.length,
        )

        if (exampleContracts.length > 0) {
          await playwrightExpect(
            previewCards.locator('.live-example-preview'),
          ).toHaveCount(exampleContracts.length)
        }

        const overflow = await page.evaluate(() => ({
          document: document.documentElement.scrollWidth - window.innerWidth,
          main:
            (document.querySelector('#main-content')?.scrollWidth ?? 0) -
            (document.querySelector('#main-content')?.clientWidth ?? 0),
        }))

        const hasOwnedMobileOverflow = routeContracts.some(
          contract =>
            Option.isSome(contract.exception) &&
            contract.exception.value.reason ===
              'The 390px docs host has measured horizontal overflow.',
        )

        if (viewport.width === 390 && hasOwnedMobileOverflow) {
          playwrightExpect(overflow.document).toBeLessThanOrEqual(40)
          playwrightExpect(overflow.main).toBeLessThanOrEqual(40)
        } else {
          playwrightExpect(overflow.document).toBeLessThanOrEqual(1)
          playwrightExpect(overflow.main).toBeLessThanOrEqual(1)
        }
      },
    ),
  ),
)
