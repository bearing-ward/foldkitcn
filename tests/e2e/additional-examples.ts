/* eslint-disable unicorn/consistent-function-scoping */
import type { Page } from '@playwright/test'

export const installAdditionalExamplesAutoReveal = async (
  page: Page,
): Promise<void> => {
  await page.addInitScript(() => {
    const revealAdditionalExamples = (): void => {
      const disclosures = document.querySelectorAll<HTMLDetailsElement>(
        'details.additional-examples',
      )
      for (const disclosure of disclosures) {
        disclosure.open = true
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      revealAdditionalExamples()
      new MutationObserver(revealAdditionalExamples).observe(document.body, {
        childList: true,
        subtree: true,
      })
    })
  })
}
