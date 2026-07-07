/* eslint-disable no-await-in-loop */
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

const openMenu = async (trigger: Locator): Promise<void> => {
  await trigger.click()
}

const assertSurfaceVisible = async (surface: Locator): Promise<Box> => {
  await playwrightExpect(surface).toBeVisible()
  return box(surface)
}

const moveToCenter = async (page: Page, target: Box): Promise<void> => {
  await page.mouse.move(
    target.x + target.width / 2,
    target.y + target.height / 2,
  )
}

const assertHoverBackgroundChanges = async (item: Locator): Promise<void> => {
  const initialBackground = await item.evaluate(
    element => getComputedStyle(element).backgroundColor,
  )

  await item.hover()
  await playwrightExpect
    .poll(() =>
      item.evaluate(element => getComputedStyle(element).backgroundColor),
    )
    .not.toBe(initialBackground)
}

const horizontalOverlap = (first: Box, second: Box): number =>
  Math.max(
    0,
    Math.min(first.x + first.width, second.x + second.width) -
      Math.max(first.x, second.x),
  )

const horizontalGap = (first: Box, second: Box): number =>
  first.x <= second.x
    ? Math.max(0, second.x - (first.x + first.width))
    : Math.max(0, first.x - (second.x + second.width))

const assertContextMenuContentOnSide = (
  side: 'top' | 'right' | 'bottom' | 'left',
  triggerBox: Box,
  contentBox: Box,
): void => {
  const clickPoint = {
    x: triggerBox.x + triggerBox.width / 2,
    y: triggerBox.y + triggerBox.height / 2,
  }

  if (side === 'top') {
    playwrightExpect(contentBox.y + contentBox.height).toBeLessThanOrEqual(
      clickPoint.y + 2,
    )
  }

  if (side === 'right') {
    playwrightExpect(contentBox.x).toBeGreaterThanOrEqual(clickPoint.x - 2)
  }

  if (side === 'bottom') {
    playwrightExpect(contentBox.y).toBeGreaterThanOrEqual(clickPoint.y - 2)
  }

  if (side === 'left') {
    playwrightExpect(contentBox.x + contentBox.width).toBeLessThanOrEqual(
      clickPoint.x + 2,
    )
  }
}

const overlapArea = (first: Box, second: Box): number => {
  const verticalOverlap = Math.max(
    0,
    Math.min(first.y + first.height, second.y + second.height) -
      Math.max(first.y, second.y),
  )

  return horizontalOverlap(first, second) * verticalOverlap
}

const assertBelowTrigger = (trigger: Box, surface: Box): void => {
  playwrightExpect(overlapArea(trigger, surface)).toBe(0)
  playwrightExpect(surface.y).toBeGreaterThanOrEqual(
    trigger.y + trigger.height - 1,
  )
}

playwrightTest(
  'dropdown, context menu, menubar, and navigation menu regressions stay anchored and dismissible',
  async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })

    await page.goto('/components/shadcn/dropdown-menu')
    const basicPreview = page.getByLabel('DropdownMenuBasic live preview')
    const basicMenu = basicPreview.locator(
      '[data-slot="dropdown-menu-content"]',
    )
    const basicTrigger = basicPreview.getByRole('button')

    await openMenu(basicTrigger)
    await playwrightExpect(basicMenu).toBeVisible()
    await playwrightExpect(basicMenu).toHaveAttribute('class', /min-w-32/u)
    await playwrightExpect(basicMenu.locator('[role="separator"]')).toHaveCount(
      0,
    )
    await playwrightExpect(
      basicPreview.getByRole('menuitem', { name: 'API' }),
    ).toHaveAttribute('aria-disabled', 'true')
    await page.keyboard.press('Escape')
    await playwrightExpect(basicMenu).not.toBeVisible()

    const checkPreview = page.getByLabel(
      'DropdownMenuCheckboxesIcons live preview',
    )
    const checkMenu = checkPreview.locator(
      '[data-slot="dropdown-menu-content"]',
    )
    const checkTrigger = checkPreview.getByRole('button', {
      name: 'Notifications',
    })

    await openMenu(checkTrigger)
    await playwrightExpect(checkMenu).toBeVisible()
    const emailItem = checkPreview.getByRole('menuitemcheckbox', {
      name: 'Email notifications',
    })
    const emailItemBox = await box(emailItem)
    const emailIconBox = await box(checkPreview.locator('[data-icon="mail"]'))
    const emailLabelBox = await box(
      checkPreview.getByText('Email notifications'),
    )
    const emailCheckBox = await box(
      emailItem.locator('[data-slot="dropdown-menu-checkbox-item-indicator"]'),
    )
    playwrightExpect(emailIconBox.x - emailItemBox.x).toBeLessThanOrEqual(24)
    playwrightExpect(emailLabelBox.x + emailLabelBox.width).toBeLessThanOrEqual(
      emailCheckBox.x - 8,
    )
    await playwrightExpect(emailItem).toHaveAttribute('aria-checked', 'true')
    await playwrightExpect(
      checkPreview.getByRole('menuitemcheckbox', { name: 'SMS notifications' }),
    ).toHaveAttribute('aria-checked', 'false')
    await playwrightExpect(
      checkPreview.getByRole('menuitemcheckbox', {
        name: 'Push notifications',
      }),
    ).toHaveAttribute('aria-checked', 'true')
    await page.mouse.click(8, 8)
    await playwrightExpect(checkMenu).not.toBeVisible()

    await page.goto('/components/shadcn/dropdown-menu')
    const demoPreview = page.getByLabel('DropdownMenuDemo live preview')
    const demoTrigger = demoPreview.getByRole('button', { name: 'Open' })
    const demoMenu = demoPreview.locator('[data-slot="dropdown-menu-content"]')
    const demoSubmenus = demoPreview.locator(
      '[data-slot="dropdown-menu-sub-content"][data-open]',
    )

    await openMenu(demoTrigger)
    const demoTriggerBox = await box(demoTrigger)
    const demoMenuBox = await assertSurfaceVisible(demoMenu)
    playwrightExpect(overlapArea(demoTriggerBox, demoMenuBox)).toBe(0)
    await playwrightExpect(demoSubmenus).toHaveCount(0)
    await demoPreview.getByRole('menuitem', { name: 'Invite users' }).hover()
    await playwrightExpect(demoSubmenus).toHaveCount(1)
    await assertSurfaceVisible(demoSubmenus.first())
    await moveToCenter(
      page,
      await box(demoPreview.getByRole('menuitem', { name: 'Email' })),
    )
    await playwrightExpect(demoSubmenus).toHaveCount(1)
    await playwrightExpect(
      demoPreview.getByRole('menuitem', { name: 'Email' }),
    ).toBeVisible()
    await page.keyboard.press('Escape')
    await playwrightExpect(demoMenu).not.toBeVisible()

    await page.goto('/components/shadcn/dropdown-menu')
    const complexPreview = page.getByLabel('DropdownMenuComplex live preview')
    const complexMenu = complexPreview.locator(
      '[data-slot="dropdown-menu-content"]',
    )
    const complexSubmenus = complexPreview.locator(
      '[data-slot="dropdown-menu-sub-content"][data-open]',
    )
    await openMenu(complexPreview.getByRole('button', { name: 'Complex Menu' }))
    const complexMenuBox = await assertSurfaceVisible(complexMenu)
    const newFileBox = await box(
      complexPreview.getByRole('menuitem', { name: 'New File' }),
    )
    const newFolderBox = await box(
      complexPreview.getByRole('menuitem', { name: 'New Folder' }),
    )
    await playwrightExpect(
      complexPreview.locator('[data-icon="folder"] path').first(),
    ).not.toHaveAttribute('d', 'M12 5v14M5 12h14')
    playwrightExpect(newFolderBox.height).toBeLessThanOrEqual(
      newFileBox.height + 8,
    )
    await complexPreview.getByRole('menuitem', { name: 'Open Recent' }).hover()
    await playwrightExpect(complexSubmenus).toHaveCount(1)
    const openRecentBox = await assertSurfaceVisible(complexSubmenus.first())
    playwrightExpect(
      horizontalOverlap(complexMenuBox, openRecentBox),
    ).toBeLessThanOrEqual(8)
    await playwrightExpect(
      complexPreview.getByRole('menuitem', { name: 'More Projects' }),
    ).toBeVisible()
    await complexPreview
      .getByRole('menuitem', { name: 'More Projects' })
      .hover()
    await playwrightExpect(complexSubmenus).toHaveCount(2)
    const moreProjectsBox = await assertSurfaceVisible(complexSubmenus.nth(1))
    playwrightExpect(
      horizontalOverlap(openRecentBox, moreProjectsBox),
    ).toBeLessThanOrEqual(8)
    await playwrightExpect(
      complexPreview.getByRole('menuitem', { name: 'Project Gamma' }),
    ).toBeVisible()
    await complexPreview
      .getByRole('menuitem', { name: 'Project Alpha' })
      .click()
    await playwrightExpect(complexMenu).not.toBeVisible()

    await page.goto('/components/shadcn/context-menu')
    const contextPreview = page.getByLabel('ContextMenuDemo live preview')
    const contextMenu = contextPreview.locator(
      '[data-slot="context-menu-content"]',
    )
    const contextSubmenus = contextPreview.locator(
      '[data-slot="context-menu-sub-content"][data-open]',
    )
    const contextTrigger = page.locator('#context-menu-demo-trigger')
    const contextBasicTrigger = page.locator('#context-menu-basic-trigger')
    const visibleContextContents = page.locator(
      '[data-slot="context-menu-content"]:visible',
    )
    const visibleContextSubmenus = page.locator(
      '[data-slot="context-menu-sub-content"][data-open]:visible',
    )
    const contextTriggerBox = await box(contextTrigger)

    for (const position of [
      { x: 16, y: 16 },
      { x: contextTriggerBox.width - 16, y: contextTriggerBox.height - 16 },
    ]) {
      await contextTrigger.click({ button: 'right', position })
      const menuBox = await assertSurfaceVisible(contextMenu)
      const contextPoint = await contextMenu.evaluate(element => {
        const positioner = element.parentElement

        return {
          x: Number(positioner?.dataset.anchorX),
          y: Number(positioner?.dataset.anchorY),
        }
      })
      playwrightExpect(Number.isFinite(contextPoint.x)).toBe(true)
      playwrightExpect(Number.isFinite(contextPoint.y)).toBe(true)
      const expectedX = Math.round(contextPoint.x)
      const expectedY = Math.round(contextPoint.y + 4)
      playwrightExpect(Math.abs(menuBox.x - expectedX)).toBeLessThanOrEqual(8)
      playwrightExpect(Math.abs(menuBox.y - expectedY)).toBeLessThanOrEqual(8)
      playwrightExpect(menuBox.x).toBeGreaterThanOrEqual(0)
      playwrightExpect(menuBox.y).toBeGreaterThanOrEqual(0)
      playwrightExpect(menuBox.x + menuBox.width).toBeLessThanOrEqual(1280)
      playwrightExpect(menuBox.y + menuBox.height).toBeLessThanOrEqual(900)
      await page.keyboard.press('Escape')
      await playwrightExpect(contextMenu).not.toBeVisible()
    }

    await contextTrigger.click({
      button: 'right',
      position: { x: 24, y: 24 },
    })
    await playwrightExpect(contextMenu).toBeVisible()
    await playwrightExpect
      .poll(() => page.evaluate(() => document.documentElement.style.overflow))
      .toBe('hidden')
    const lockedScrollY = await page.evaluate(() => window.scrollY)
    await page.mouse.wheel(0, 500)
    await playwrightExpect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBe(lockedScrollY)
    await page.keyboard.press('Escape')
    await playwrightExpect(contextMenu).not.toBeVisible()
    await playwrightExpect
      .poll(() => page.evaluate(() => document.documentElement.style.overflow))
      .not.toBe('hidden')

    await contextTrigger.click({
      button: 'right',
      position: { x: 24, y: 24 },
    })
    await playwrightExpect(contextMenu).toBeVisible()
    await playwrightExpect(contextSubmenus).toHaveCount(0)
    const backItem = contextPreview.getByRole('menuitem', { name: 'Back' })
    const reloadItem = contextPreview.getByRole('menuitem', { name: 'Reload' })
    await assertHoverBackgroundChanges(reloadItem)
    await playwrightExpect(backItem).not.toHaveAttribute('data-highlighted', '')
    const backBackground = await backItem.evaluate(
      element => getComputedStyle(element).backgroundColor,
    )
    const reloadBackground = await reloadItem.evaluate(
      element => getComputedStyle(element).backgroundColor,
    )
    playwrightExpect(backBackground).not.toBe(reloadBackground)
    const moreToolsBox = await box(
      contextPreview.getByRole('menuitem', { name: 'More Tools' }),
    )
    await contextPreview.getByRole('menuitem', { name: 'More Tools' }).hover()
    await playwrightExpect(contextSubmenus).toHaveCount(1)
    const moreToolsSubmenuBox = await assertSurfaceVisible(
      contextSubmenus.first(),
    )
    await moveToCenter(
      page,
      await box(contextPreview.getByRole('menuitem', { name: 'Save Page...' })),
    )
    await playwrightExpect(contextSubmenus).toHaveCount(1)
    await playwrightExpect(
      contextPreview.getByRole('menuitem', { name: 'Save Page...' }),
    ).toBeVisible()
    await playwrightExpect(contextPreview).toHaveCSS('overflow', 'visible')
    await playwrightExpect
      .poll(() =>
        contextSubmenus.first().evaluate(element => {
          const parentContent = element.closest(
            '[data-slot="context-menu-content"]',
          )

          return (
            parentContent === null ||
            getComputedStyle(parentContent).overflow === 'visible'
          )
        }),
      )
      .toBe(true)
    playwrightExpect(
      horizontalOverlap(moreToolsBox, moreToolsSubmenuBox),
    ).toBeLessThanOrEqual(8)
    playwrightExpect(
      horizontalGap(moreToolsBox, moreToolsSubmenuBox),
    ).toBeLessThanOrEqual(12)
    const contextPreviewBox = await box(contextPreview)
    await page.mouse.click(
      contextPreviewBox.x + contextPreviewBox.width - 8,
      contextPreviewBox.y + 8,
    )
    await playwrightExpect(visibleContextContents).toHaveCount(0)
    await playwrightExpect(visibleContextSubmenus).toHaveCount(0)
    await contextBasicTrigger.click({
      button: 'right',
      position: { x: 24, y: 24 },
    })
    await playwrightExpect(visibleContextContents).toHaveCount(1)
    await playwrightExpect(visibleContextSubmenus).toHaveCount(0)
    await page.mouse.click(
      contextPreviewBox.x + contextPreviewBox.width - 8,
      contextPreviewBox.y + 8,
    )
    await playwrightExpect(contextMenu).not.toBeVisible()

    const sidesPreview = page.getByLabel('ContextMenuSides live preview')
    for (const side of ['top', 'right', 'bottom', 'left'] as const) {
      const sideTrigger = sidesPreview
        .locator('[data-slot="context-menu-trigger"]')
        .filter({ hasText: `Right click (${side})` })
      const sideContents = sidesPreview.locator(
        '[data-slot="context-menu-content"]:visible',
      )
      const sideTriggerBox = await box(sideTrigger)
      await sideTrigger.click({
        button: 'right',
        position: {
          x: sideTriggerBox.width / 2,
          y: sideTriggerBox.height / 2,
        },
      })
      await playwrightExpect(sideContents).toHaveCount(1)
      assertContextMenuContentOnSide(
        side,
        sideTriggerBox,
        await assertSurfaceVisible(sideContents.first()),
      )
      await page.keyboard.press('Escape')
      await playwrightExpect(sideContents).toHaveCount(0)
    }

    await page.goto('/components/shadcn/menubar')
    const menubarPreview = page.getByLabel('MenubarDemo live preview')
    const menubarContent = menubarPreview.locator(
      '[data-slot="menubar-content"]',
    )
    const menubarRoot = menubarPreview.locator('[data-slot="menubar"]')
    await playwrightExpect(menubarRoot).not.toHaveCSS(
      'border-top-color',
      'rgb(0, 0, 0)',
    )
    await playwrightExpect(menubarRoot).not.toHaveCSS(
      'border-top-color',
      'oklch(0 0 0)',
    )
    const fileTrigger = menubarPreview.getByRole('menuitem', {
      exact: true,
      name: 'File',
    })
    const editTrigger = menubarPreview.getByRole('menuitem', {
      exact: true,
      name: 'Edit',
    })
    const viewTrigger = menubarPreview.getByRole('menuitem', {
      exact: true,
      name: 'View',
    })
    const initialFileTriggerBox = await box(fileTrigger)
    const initialEditTriggerBox = await box(editTrigger)
    const initialViewTriggerBox = await box(viewTrigger)
    playwrightExpect(
      initialEditTriggerBox.x -
        (initialFileTriggerBox.x + initialFileTriggerBox.width),
    ).toBeLessThanOrEqual(24)
    playwrightExpect(
      initialViewTriggerBox.x -
        (initialEditTriggerBox.x + initialEditTriggerBox.width),
    ).toBeLessThanOrEqual(24)

    await fileTrigger.click()
    await playwrightExpect(menubarContent).toBeVisible()
    const fileTriggerBox = await box(fileTrigger)
    const fileMenuBox = await box(menubarContent)
    playwrightExpect(overlapArea(fileTriggerBox, fileMenuBox)).toBe(0)
    playwrightExpect(fileMenuBox.x).toBeGreaterThanOrEqual(fileTriggerBox.x - 8)
    playwrightExpect(fileMenuBox.x).toBeLessThanOrEqual(fileTriggerBox.x + 8)
    playwrightExpect(fileMenuBox.y).toBeGreaterThanOrEqual(
      fileTriggerBox.y + fileTriggerBox.height - 1,
    )
    playwrightExpect(
      fileMenuBox.y - (fileTriggerBox.y + fileTriggerBox.height),
    ).toBeLessThanOrEqual(12)
    const newTabItem = menubarPreview.getByRole('menuitem', {
      name: /New Tab/u,
    })
    await playwrightExpect(newTabItem).toHaveCSS('display', 'flex')
    const newTabItemBox = await box(newTabItem)
    const newTabShortcutBox = await box(
      newTabItem.locator('[data-slot="menubar-shortcut"]'),
    )
    playwrightExpect(newTabShortcutBox.x).toBeGreaterThanOrEqual(
      newTabItemBox.x + newTabItemBox.width - 56,
    )
    await editTrigger.hover()
    await playwrightExpect(fileTrigger).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    await playwrightExpect(editTrigger).toHaveAttribute('aria-expanded', 'true')
    await playwrightExpect(
      menubarPreview.getByRole('menuitem', { name: 'Undo' }),
    ).toBeVisible()
    const hoveredEditTriggerBox = await box(editTrigger)
    const hoveredEditMenuBox = await box(menubarContent)
    playwrightExpect(hoveredEditMenuBox.x).toBeGreaterThanOrEqual(
      hoveredEditTriggerBox.x - 8,
    )
    playwrightExpect(hoveredEditMenuBox.x).toBeLessThanOrEqual(
      hoveredEditTriggerBox.x + 8,
    )
    await viewTrigger.hover({ timeout: 3000 })
    await playwrightExpect(editTrigger).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    await playwrightExpect(viewTrigger).toHaveAttribute('aria-expanded', 'true')
    await playwrightExpect(
      menubarPreview.getByRole('menuitemcheckbox', { name: 'Full URLs' }),
    ).toBeVisible()
    await fileTrigger.hover({ timeout: 3000 })
    await playwrightExpect(viewTrigger).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    await playwrightExpect(fileTrigger).toHaveAttribute('aria-expanded', 'true')
    await playwrightExpect(
      menubarPreview.getByRole('menuitem', { name: /New Tab/u }),
    ).toBeVisible()
    await viewTrigger.hover({ timeout: 3000 })
    await playwrightExpect(fileTrigger).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    await playwrightExpect(viewTrigger).toHaveAttribute('aria-expanded', 'true')
    await playwrightExpect(
      menubarPreview.getByRole('menuitemcheckbox', { name: 'Full URLs' }),
    ).toBeVisible()
    await editTrigger.hover({ timeout: 3000 })
    await playwrightExpect(viewTrigger).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    await playwrightExpect(editTrigger).toHaveAttribute('aria-expanded', 'true')
    await playwrightExpect(
      menubarPreview.getByRole('menuitem', { name: 'Undo' }),
    ).toBeVisible()
    await page.keyboard.press('Escape')
    await playwrightExpect(menubarContent).not.toBeVisible()
    await editTrigger.click()
    await playwrightExpect(menubarContent).toBeVisible()
    const editTriggerBox = await box(editTrigger)
    const editMenuBox = await box(menubarContent)
    playwrightExpect(overlapArea(editTriggerBox, editMenuBox)).toBe(0)
    playwrightExpect(editMenuBox.x).toBeGreaterThanOrEqual(editTriggerBox.x - 8)
    playwrightExpect(editMenuBox.x).toBeLessThanOrEqual(editTriggerBox.x + 8)
    playwrightExpect(
      editMenuBox.y - (editTriggerBox.y + editTriggerBox.height),
    ).toBeLessThanOrEqual(12)
    await playwrightExpect(fileTrigger).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    await playwrightExpect(editTrigger).toHaveAttribute('aria-expanded', 'true')
    const menubarSubmenus = menubarPreview.locator(
      '[data-slot="menubar-sub-content"][data-open]',
    )
    await playwrightExpect(menubarSubmenus).toHaveCount(0)
    const findItem = menubarPreview.getByRole('menuitem', {
      exact: true,
      name: 'Find',
    })
    await findItem.hover()
    await playwrightExpect(menubarSubmenus).toHaveCount(1)
    const findItemBox = await box(findItem)
    const findSubmenuBox = await assertSurfaceVisible(menubarSubmenus.first())
    await moveToCenter(page, findSubmenuBox)
    await playwrightExpect(menubarSubmenus).toHaveCount(1)
    await playwrightExpect(
      menubarPreview.getByRole('menuitem', { name: 'Find...' }),
    ).toBeVisible()
    playwrightExpect(
      horizontalOverlap(editMenuBox, findSubmenuBox),
    ).toBeLessThanOrEqual(8)
    playwrightExpect(findSubmenuBox.x).toBeGreaterThanOrEqual(
      findItemBox.x + findItemBox.width - 8,
    )
    playwrightExpect(findSubmenuBox.y).toBeGreaterThanOrEqual(findItemBox.y - 8)
    await page.keyboard.press('Escape')
    await playwrightExpect(menubarContent).not.toBeVisible()
    await viewTrigger.click()
    await playwrightExpect(menubarContent).toBeVisible()
    const viewTriggerBox = await box(viewTrigger)
    const viewMenuBox = await box(menubarContent)
    playwrightExpect(
      viewMenuBox.y - (viewTriggerBox.y + viewTriggerBox.height),
    ).toBeLessThanOrEqual(12)
    playwrightExpect(viewMenuBox.width).toBeGreaterThanOrEqual(176)
    await playwrightExpect(
      menubarContent.locator('[data-slot="menubar-separator"]'),
    ).toHaveCount(3)
    await playwrightExpect(
      menubarContent.locator(
        '[data-slot="menubar-checkbox-item-indicator"] svg',
      ),
    ).toHaveCount(1)
    const bookmarksLabelBox = await box(
      menubarPreview.getByText('Bookmarks Bar'),
    )
    playwrightExpect(bookmarksLabelBox.height).toBeLessThanOrEqual(24)
    const hideSidebarLabelBox = await box(
      menubarPreview.getByText('Hide Sidebar'),
    )
    playwrightExpect(hideSidebarLabelBox.height).toBeLessThanOrEqual(24)
    playwrightExpect(hideSidebarLabelBox.y).toBeGreaterThan(viewMenuBox.y)
    await page.keyboard.press('Escape')
    await playwrightExpect(menubarContent).not.toBeVisible()

    const checkboxMenubarPreview = page.getByLabel(
      'MenubarCheckbox live preview',
    )
    const checkboxMenubarContent = checkboxMenubarPreview.locator(
      '[data-slot="menubar-content"]',
    )
    const checkboxViewTrigger = checkboxMenubarPreview.getByRole('menuitem', {
      exact: true,
      name: 'View',
    })
    await checkboxViewTrigger.click()
    const checkboxViewMenuBox = await assertSurfaceVisible(
      checkboxMenubarContent,
    )
    playwrightExpect(checkboxViewMenuBox.width).toBeGreaterThanOrEqual(250)
    const bookmarksItem = checkboxMenubarPreview.getByRole('menuitemcheckbox', {
      name: 'Always Show Bookmarks Bar',
    })
    const urlsItem = checkboxMenubarPreview.getByRole('menuitemcheckbox', {
      name: 'Always Show Full URLs',
    })
    const bookmarksItemBox = await box(bookmarksItem)
    const urlsItemBox = await box(urlsItem)
    const bookmarksFullLabelBox = await box(
      checkboxMenubarPreview.getByText('Always Show Bookmarks Bar'),
    )
    const urlsFullLabelBox = await box(
      checkboxMenubarPreview.getByText('Always Show Full URLs'),
    )
    const reloadFullLabelBox = await box(
      checkboxMenubarPreview.getByText('Reload', { exact: true }),
    )
    playwrightExpect(bookmarksFullLabelBox.height).toBeLessThanOrEqual(24)
    playwrightExpect(urlsFullLabelBox.height).toBeLessThanOrEqual(24)
    playwrightExpect(
      Math.abs(bookmarksFullLabelBox.x - urlsFullLabelBox.x),
    ).toBeLessThanOrEqual(2)
    playwrightExpect(
      Math.abs(bookmarksFullLabelBox.x - reloadFullLabelBox.x),
    ).toBeLessThanOrEqual(2)
    const urlsCheckBox = await box(
      urlsItem.locator('[data-slot="menubar-checkbox-item-indicator"]'),
    )
    playwrightExpect(urlsCheckBox.x).toBeGreaterThanOrEqual(
      urlsItemBox.x + urlsItemBox.width - 32,
    )
    playwrightExpect(
      urlsFullLabelBox.x + urlsFullLabelBox.width,
    ).toBeLessThanOrEqual(urlsCheckBox.x - 8)
    playwrightExpect(bookmarksItemBox.x).toBe(urlsItemBox.x)
    await page.keyboard.press('Escape')
    await playwrightExpect(checkboxMenubarContent).not.toBeVisible()

    await page.goto('/components/shadcn/navigation-menu')
    const navigationPreview = page.getByLabel('NavigationMenuDemo live preview')
    const navigationContent = navigationPreview.locator(
      '[data-slot="navigation-menu-content"]',
    )
    const componentsTrigger = navigationPreview.getByRole('button', {
      name: 'Components',
    })
    const gettingStartedTrigger = navigationPreview.getByRole('button', {
      name: 'Getting started',
    })

    await componentsTrigger.hover()
    await playwrightExpect(navigationContent).toBeVisible()
    await playwrightExpect(gettingStartedTrigger).toBeVisible()
    await page.mouse.move(0, 0)
    await page.keyboard.press('Escape')
    await playwrightExpect(navigationContent).not.toBeVisible()
    await page.mouse.move(0, 0)
    await componentsTrigger.hover()
    await playwrightExpect(navigationContent).toBeVisible()
    await page.mouse.click(8, 8)
    await playwrightExpect(navigationContent).not.toBeVisible()
  },
)

playwrightTest(
  'hover card, tooltip, and popover surfaces stay stable across rapid cycles',
  async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })

    await page.goto('/components/shadcn/hover-card')
    const hoverPreview = page.getByLabel('HoverCardDemo live preview')
    const hoverTrigger = hoverPreview.getByRole('link', { name: 'Hover Here' })
    const hoverContent = hoverPreview.locator(
      '[data-slot="hover-card-content"]',
    )

    for (let index = 0; index < 10; index += 1) {
      await hoverTrigger.hover()
      await assertSurfaceVisible(hoverContent)
      await playwrightExpect(
        hoverPreview.locator('[data-slot="hover-card-content"]:visible'),
      ).toHaveCount(1)
      await page.mouse.move(0, 0)
      await playwrightExpect(hoverContent).not.toBeVisible()
    }

    await page.goto('/components/shadcn/hover-card')
    const hoverFocusedPreview = page.getByLabel('HoverCardDemo live preview')
    const hoverFocusedTrigger = hoverFocusedPreview.getByRole('link', {
      name: 'Hover Here',
    })
    const hoverFocusedContent = hoverFocusedPreview.locator(
      '[data-slot="hover-card-content"]',
    )

    await hoverFocusedTrigger.focus()
    await playwrightExpect(hoverFocusedContent).toBeVisible()
    await page.keyboard.press('Escape')
    await playwrightExpect(hoverFocusedContent).not.toBeVisible()
    await hoverFocusedTrigger.hover()
    await playwrightExpect(hoverFocusedContent).toBeVisible()

    await page.goto('/components/shadcn/tooltip')
    const tooltipPreview = page.getByLabel('TooltipDemo live preview')
    const tooltipTrigger = tooltipPreview.getByRole('button', { name: 'Hover' })
    const tooltipContent = tooltipPreview.locator(
      '[data-slot="tooltip-content"]',
    )

    for (let index = 0; index < 10; index += 1) {
      await tooltipTrigger.hover()
      await assertSurfaceVisible(tooltipContent)
      await playwrightExpect(
        tooltipPreview.locator('[data-slot="tooltip-content"]:visible'),
      ).toHaveCount(1)
      await page.mouse.move(0, 0)
      await playwrightExpect(tooltipContent).not.toBeVisible()
    }

    await page.goto('/components/shadcn/tooltip')
    const tooltipFocusedPreview = page.getByLabel('TooltipDemo live preview')
    const tooltipFocusedTrigger = tooltipFocusedPreview.getByRole('button', {
      name: 'Hover',
    })
    const tooltipFocusedContent = tooltipFocusedPreview.locator(
      '[data-slot="tooltip-content"]',
    )

    await tooltipFocusedTrigger.focus()
    await playwrightExpect(tooltipFocusedContent).toBeVisible()
    await page.keyboard.press('Escape')
    await playwrightExpect(tooltipFocusedContent).not.toBeVisible()
    await tooltipFocusedTrigger.hover()
    await playwrightExpect(tooltipFocusedContent).toBeVisible()

    await page.goto('/components/shadcn/popover')
    const popoverPreview = page.getByLabel('PopoverAlignments live preview')
    const startTrigger = popoverPreview.getByRole('button', { name: 'Start' })
    const centerTrigger = popoverPreview.getByRole('button', { name: 'Center' })
    const endTrigger = popoverPreview.getByRole('button', { name: 'End' })
    const popoverContent = popoverPreview.locator(
      '[data-slot="popover-content"]',
    )

    await openMenu(startTrigger)
    await playwrightExpect(popoverContent).toBeVisible()
    await page.waitForTimeout(150)
    const startTriggerBox = await box(startTrigger)
    const startContentBox = await assertSurfaceVisible(popoverContent)
    assertBelowTrigger(startTriggerBox, startContentBox)
    playwrightExpect(startContentBox.x).toBeGreaterThanOrEqual(
      startTriggerBox.x - 8,
    )
    playwrightExpect(startContentBox.x).toBeLessThanOrEqual(
      startTriggerBox.x + 8,
    )
    await page.mouse.click(8, 8)
    await playwrightExpect(popoverContent).not.toBeVisible()

    await openMenu(centerTrigger)
    await playwrightExpect(popoverContent).toBeVisible()
    await page.waitForTimeout(150)
    const centerTriggerBox = await box(centerTrigger)
    const centerContentBox = await assertSurfaceVisible(popoverContent)
    assertBelowTrigger(centerTriggerBox, centerContentBox)
    playwrightExpect(
      Math.abs(
        centerContentBox.x +
          centerContentBox.width / 2 -
          (centerTriggerBox.x + centerTriggerBox.width / 2),
      ),
    ).toBeLessThanOrEqual(8)
    await page.mouse.click(8, 8)
    await playwrightExpect(popoverContent).not.toBeVisible()

    await openMenu(endTrigger)
    await playwrightExpect(popoverContent).toBeVisible()
    await page.waitForTimeout(150)
    const endTriggerBox = await box(endTrigger)
    const endContentBox = await assertSurfaceVisible(popoverContent)
    assertBelowTrigger(endTriggerBox, endContentBox)
    playwrightExpect(
      endContentBox.x + endContentBox.width,
    ).toBeGreaterThanOrEqual(endTriggerBox.x + endTriggerBox.width - 8)
    playwrightExpect(endContentBox.x + endContentBox.width).toBeLessThanOrEqual(
      endTriggerBox.x + endTriggerBox.width + 8,
    )

    const startOffset = startContentBox.x - startTriggerBox.x
    const centerOffset = centerContentBox.x - centerTriggerBox.x
    const endOffset = endContentBox.x - endTriggerBox.x

    playwrightExpect(startOffset).toBeGreaterThanOrEqual(centerOffset)
    playwrightExpect(centerOffset).toBeGreaterThanOrEqual(endOffset)
  },
)

playwrightTest(
  'table actions and sidebar menu action menus remain attached to their triggers',
  async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })

    await page.goto('/components/shadcn/table')
    const tablePreview = page.getByLabel('TableActions live preview')
    const tableMenu = tablePreview.locator(
      '[data-slot="dropdown-menu-content"]',
    )
    const tableBox = await box(tablePreview)
    const tableButtons = tablePreview.getByRole('button', { name: 'Open menu' })

    for (let index = 0; index < 3; index += 1) {
      const button = tableButtons.nth(index)
      await openMenu(button)
      const menuBox = await assertSurfaceVisible(tableMenu)
      playwrightExpect(menuBox.x + menuBox.width).toBeLessThanOrEqual(
        tableBox.x + tableBox.width + 32,
      )
      playwrightExpect(menuBox.y + menuBox.height).toBeLessThanOrEqual(
        tableBox.y + tableBox.height + 16,
      )
      await tablePreview.getByRole('menuitem', { name: 'Duplicate' }).click()
      await playwrightExpect(tableMenu).not.toBeVisible()
    }

    await page.goto('/components/shadcn/sidebar')
    const sidebarPreview = page.getByLabel('SidebarMenuAction live preview')
    const sidebarMenu = sidebarPreview.locator(
      '[data-slot="dropdown-menu-content"]',
    )
    const sidebarTrigger = sidebarPreview.getByRole('button', {
      name: 'More Design Engineering',
    })

    await openMenu(sidebarTrigger)
    const triggerBox = await box(sidebarTrigger)
    const menuBox = await assertSurfaceVisible(sidebarMenu)

    const leftGap = Math.abs(menuBox.x - (triggerBox.x + triggerBox.width))
    const rightGap = Math.abs(menuBox.x + menuBox.width - triggerBox.x)

    playwrightExpect(Math.min(leftGap, rightGap)).toBeLessThanOrEqual(48)
    playwrightExpect(Math.abs(menuBox.y - triggerBox.y)).toBeLessThanOrEqual(24)

    await sidebarPreview.getByRole('menuitem', { name: 'View Project' }).click()
    await playwrightExpect(sidebarMenu).not.toBeVisible()
  },
)
