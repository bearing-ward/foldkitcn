/* eslint-disable no-await-in-loop */
import {
  expect as playwrightExpect,
  test as playwrightTest,
} from '@playwright/test'
import type { Locator } from '@playwright/test'

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

const horizontalOverlap = (first: Box, second: Box): number =>
  Math.max(
    0,
    Math.min(first.x + first.width, second.x + second.width) -
      Math.max(first.x, second.x),
  )

const overlapArea = (first: Box, second: Box): number => {
  const verticalOverlap = Math.max(
    0,
    Math.min(first.y + first.height, second.y + second.height) -
      Math.max(first.y, second.y),
  )

  return horizontalOverlap(first, second) * verticalOverlap
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
    const contextTrigger = page.locator('#context-menu-demo-trigger')
    const contextTriggerBox = await box(contextTrigger)

    for (const position of [
      { x: contextTriggerBox.width / 2, y: contextTriggerBox.height / 2 },
      { x: 16, y: 16 },
      { x: contextTriggerBox.width - 16, y: contextTriggerBox.height - 16 },
    ]) {
      await contextTrigger.click({ button: 'right', position })
      const menuBox = await assertSurfaceVisible(contextMenu)
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
    await page.mouse.click(10, 10)
    await playwrightExpect(contextMenu).not.toBeVisible()

    await page.goto('/components/shadcn/menubar')
    const menubarPreview = page.getByLabel('MenubarDemo live preview')
    const menubarContent = menubarPreview.locator(
      '[data-slot="menubar-content"]',
    )
    const fileTrigger = menubarPreview.getByRole('menuitem', {
      exact: true,
      name: 'File',
    })
    const editTrigger = menubarPreview.getByRole('menuitem', {
      exact: true,
      name: 'Edit',
    })

    await fileTrigger.click()
    await playwrightExpect(menubarContent).toBeVisible()
    await page.keyboard.press('Escape')
    await playwrightExpect(menubarContent).not.toBeVisible()
    await editTrigger.click()
    await playwrightExpect(menubarContent).toBeVisible()
    await playwrightExpect(fileTrigger).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    await playwrightExpect(editTrigger).toHaveAttribute('aria-expanded', 'true')
    await page.keyboard.press('Escape')
    await playwrightExpect(menubarContent).not.toBeVisible()

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
    const startTriggerBox = await box(startTrigger)
    const startContentBox = await assertSurfaceVisible(popoverContent)
    await page.mouse.click(8, 8)
    await playwrightExpect(popoverContent).not.toBeVisible()

    await openMenu(centerTrigger)
    const centerTriggerBox = await box(centerTrigger)
    const centerContentBox = await assertSurfaceVisible(popoverContent)
    await page.mouse.click(8, 8)
    await playwrightExpect(popoverContent).not.toBeVisible()

    await openMenu(endTrigger)
    const endTriggerBox = await box(endTrigger)
    const endContentBox = await assertSurfaceVisible(popoverContent)

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
