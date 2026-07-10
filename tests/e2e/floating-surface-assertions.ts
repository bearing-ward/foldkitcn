import { expect as playwrightExpect } from '@playwright/test'
import type { Locator } from '@playwright/test'

export type Box = Readonly<{
  height: number
  width: number
  x: number
  y: number
}>

export const visibleBox = async (locator: Locator): Promise<Box> => {
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

export const expectOnlyVisibleSurface = async (
  container: Locator,
  selector: string,
): Promise<Locator> => {
  const surfaces = container.locator(`${selector}:visible`)

  await playwrightExpect(surfaces).toHaveCount(1)

  return surfaces.first()
}

export const expectSurfaceAnchoredToTrigger = async (
  surface: Locator,
  trigger: Locator,
  options?: { tolerance?: number; settleMs?: number },
): Promise<void> => {
  const tolerance = options?.tolerance ?? 8
  const settleMs = options?.settleMs ?? 150

  if (settleMs > 0) {
    await surface.page().waitForTimeout(settleMs)
  }

  await playwrightExpect(surface).toBeVisible()

  const surfaceBox = await visibleBox(surface)
  const triggerBox = await visibleBox(trigger)
  const horizontalOverlap =
    Math.min(surfaceBox.x + surfaceBox.width, triggerBox.x + triggerBox.width) -
    Math.max(surfaceBox.x, triggerBox.x)
  const verticalOverlap =
    Math.min(
      surfaceBox.y + surfaceBox.height,
      triggerBox.y + triggerBox.height,
    ) - Math.max(surfaceBox.y, triggerBox.y)

  playwrightExpect(horizontalOverlap).toBeGreaterThanOrEqual(-tolerance)
  playwrightExpect(verticalOverlap).toBeGreaterThanOrEqual(-tolerance)
}

export const expectEscapingSurfaceHasVisibleOverflow = async (
  surface: Locator,
  previewCard: Locator,
): Promise<void> => {
  const surfaceBox = await visibleBox(surface)
  const previewCardBox = await visibleBox(previewCard)

  const escapesPreview =
    surfaceBox.x < previewCardBox.x ||
    surfaceBox.y < previewCardBox.y ||
    surfaceBox.x + surfaceBox.width > previewCardBox.x + previewCardBox.width ||
    surfaceBox.y + surfaceBox.height > previewCardBox.y + previewCardBox.height

  if (escapesPreview) {
    await playwrightExpect(previewCard).toHaveCSS('overflow', 'visible')
  }
}

export const expectNoOpenSurfaces = async (
  container: Locator,
  selector: string,
): Promise<void> => {
  await playwrightExpect(container.locator(`${selector}:visible`)).toHaveCount(
    0,
  )
}
