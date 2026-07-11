/* eslint-disable no-await-in-loop, unicorn/prefer-ternary, unicorn/no-await-expression-member */

import {
  expect as playwrightExpect,
  test as playwrightTest,
} from '@playwright/test'
import type { Locator } from '@playwright/test'

import { installAdditionalExamplesAutoReveal } from './additional-examples'

playwrightTest.beforeEach(async ({ page }) => {
  await installAdditionalExamplesAutoReveal(page)
})

const visibleBox = async (locator: Locator) => {
  const box = await locator.boundingBox()

  if (box === null) {
    throw new Error('Expected element to have a layout box.')
  }

  return {
    x: Math.round(box.x),
    y: Math.round(box.y),
    width: Math.round(box.width),
    height: Math.round(box.height),
  }
}

const expectBoxInside = async (element: Locator, container: Locator) => {
  const elementBox = await visibleBox(element)
  const containerBox = await visibleBox(container)
  const tolerance = 4

  playwrightExpect(elementBox.x).toBeGreaterThanOrEqual(
    containerBox.x - tolerance,
  )
  playwrightExpect(elementBox.y).toBeGreaterThanOrEqual(
    containerBox.y - tolerance,
  )
  playwrightExpect(elementBox.x + elementBox.width).toBeLessThanOrEqual(
    containerBox.x + containerBox.width + tolerance,
  )
  playwrightExpect(elementBox.y + elementBox.height).toBeLessThanOrEqual(
    containerBox.y + containerBox.height + tolerance,
  )
}

const expectNonTransparentBackground = async (element: Locator) => {
  const backgroundColor = await element.evaluate(
    node => window.getComputedStyle(node).backgroundColor,
  )

  playwrightExpect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
  playwrightExpect(backgroundColor).not.toBe('transparent')
  playwrightExpect(backgroundColor.endsWith('/ 0)')).toBe(false)
}

const expectScrollable = async (element: Locator) => {
  const scrollMetrics = await element.evaluate(node => ({
    clientHeight: node.clientHeight,
    clientWidth: node.clientWidth,
    scrollHeight: node.scrollHeight,
    scrollWidth: node.scrollWidth,
  }))

  playwrightExpect(
    scrollMetrics.scrollHeight > scrollMetrics.clientHeight ||
      scrollMetrics.scrollWidth > scrollMetrics.clientWidth,
  ).toBe(true)
}

const openDrawer = async (
  preview: Locator,
  buttonName: string,
  panelSelector: string,
) => {
  await preview.getByRole('button', { name: buttonName }).click()
  const panel = preview.locator(panelSelector)

  await playwrightExpect(panel).toBeVisible()

  return panel
}

const expectTopBottomPanelBounded = async (
  preview: Locator,
  panel: Locator,
) => {
  const previewBox = await visibleBox(preview)
  const panelBox = await visibleBox(panel)

  await expectBoxInside(panel, preview)
  playwrightExpect(panelBox.height).toBeLessThanOrEqual(
    Math.round(previewBox.height * 0.55),
  )
}

const expectTopSideMenuAboveTrigger = async (
  menu: Locator,
  trigger: Locator,
  preview: Locator,
) => {
  const menuBox = await visibleBox(menu)
  const triggerBox = await visibleBox(trigger)
  const previewBox = await visibleBox(preview)
  const tolerance = 2

  playwrightExpect(menuBox.y).toBeGreaterThanOrEqual(previewBox.y - tolerance)
  playwrightExpect(menuBox.y + menuBox.height).toBeLessThanOrEqual(
    previewBox.y + previewBox.height + tolerance,
  )
  playwrightExpect(menuBox.y + menuBox.height).toBeLessThanOrEqual(
    triggerBox.y + tolerance,
  )
}

const expectRightSideMenuBesideTrigger = async (
  menu: Locator,
  trigger: Locator,
  preview: Locator,
) => {
  const menuBox = await visibleBox(menu)
  const triggerBox = await visibleBox(trigger)
  const previewBox = await visibleBox(preview)
  const tolerance = 2

  playwrightExpect(menuBox.x).toBeGreaterThanOrEqual(
    triggerBox.x + triggerBox.width - tolerance,
  )
  playwrightExpect(menuBox.y).toBeGreaterThanOrEqual(previewBox.y - tolerance)
  playwrightExpect(menuBox.y + menuBox.height).toBeLessThanOrEqual(
    previewBox.y + previewBox.height + tolerance,
  )
  playwrightExpect(triggerBox.y).toBeLessThanOrEqual(menuBox.y + menuBox.height)
  playwrightExpect(triggerBox.y + triggerBox.height).toBeGreaterThanOrEqual(
    menuBox.y,
  )
}

playwrightTest(
  'alert dialog, dialog, drawer, sheet, and sidebar layouts stay measurably bounded',
  async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })

    await page.goto('/components/shadcn/alert-dialog')
    const alertDialogCases = [
      {
        label: 'AlertDialogDemo live preview',
        preview: page.getByLabel('AlertDialogDemo live preview'),
        buttonName: 'Show Dialog',
        selector: '[data-slot="alert-dialog-content"]',
      },
      {
        label: 'AlertDialogWithMedia live preview',
        preview: page.getByLabel('AlertDialogWithMedia live preview'),
        buttonName: 'Share Project',
        selector: '[data-slot="alert-dialog-content"]',
      },
      {
        label: 'AlertDialogSmall live preview',
        preview: page.getByLabel('AlertDialogSmall live preview'),
        buttonName: 'Show Dialog',
        selector: '[data-slot="alert-dialog-content"]',
      },
      {
        label: 'AlertDialogSmallWithMedia live preview',
        preview: page.getByLabel('AlertDialogSmallWithMedia live preview'),
        buttonName: 'Show Dialog',
        selector: '[data-slot="alert-dialog-content"]',
      },
    ] as const

    const alertDialogBoxes: Array<
      Readonly<{
        contentBox: Readonly<{
          height: number
          width: number
          x: number
          y: number
        }>
        preview: Locator
      }>
    > = []

    for (const { label, preview, buttonName, selector } of alertDialogCases) {
      const content = await openDrawer(preview, buttonName, selector)
      const contentBox = await visibleBox(content)

      await expectBoxInside(content, preview)
      if (label.includes('Small')) {
        await playwrightExpect(
          preview.getByRole('button', { name: "Don't allow", exact: true }),
        ).toBeVisible()
        await playwrightExpect(
          preview.getByRole('button', { name: 'Allow', exact: true }),
        ).toBeVisible()
      }
      await page.keyboard.press('Escape')
      await content.waitFor({ state: 'hidden' })

      alertDialogBoxes.push({ preview, contentBox })
    }

    const defaultAlertDialogBox = alertDialogBoxes[0].contentBox
    const mediaAlertDialogBox = alertDialogBoxes[1].contentBox
    const smallAlertDialogBox = alertDialogBoxes[2].contentBox
    const smallMediaAlertDialogBox = alertDialogBoxes[3].contentBox

    playwrightExpect(defaultAlertDialogBox.width).toBeGreaterThan(
      smallAlertDialogBox.width,
    )
    playwrightExpect(
      defaultAlertDialogBox.width - smallAlertDialogBox.width,
    ).toBeGreaterThanOrEqual(48)
    playwrightExpect(
      Math.abs(defaultAlertDialogBox.width - mediaAlertDialogBox.width),
    ).toBeLessThanOrEqual(8)
    playwrightExpect(
      Math.abs(smallAlertDialogBox.width - smallMediaAlertDialogBox.width),
    ).toBeLessThanOrEqual(8)

    await page.goto('/components/shadcn/dialog')
    const stickyDialogPreview = page.getByLabel(
      'DialogStickyFooter live preview',
    )
    const stickyDialogContent = await openDrawer(
      stickyDialogPreview,
      'Sticky Footer',
      '[data-slot="dialog-content"]',
    )
    const stickyDialogFooter = stickyDialogPreview.locator(
      '[data-slot="dialog-footer"]',
    )
    const stickyDialogHeader = stickyDialogPreview.locator(
      '[data-slot="dialog-header"]',
    )
    const scrollableDialogBody = stickyDialogContent.locator(
      '.no-scrollbar.overflow-y-auto',
    )
    const firstParagraph = scrollableDialogBody.locator('p').first()

    await playwrightExpect(stickyDialogFooter).toBeVisible()
    await expectNonTransparentBackground(stickyDialogFooter)
    const footerBoxBefore = await visibleBox(stickyDialogFooter)
    const firstParagraphBoxBefore = await visibleBox(firstParagraph)

    await scrollableDialogBody.evaluate(element => {
      element.scrollTop = element.scrollHeight
    })
    await playwrightExpect
      .poll(
        async () =>
          await scrollableDialogBody.evaluate(element => element.scrollTop),
        {
          timeout: 2000,
        },
      )
      .toBeGreaterThan(0)

    const footerBoxAfter = await visibleBox(stickyDialogFooter)
    const firstParagraphBoxAfter = await visibleBox(firstParagraph)
    const headerPosition = await stickyDialogHeader.evaluate(
      element => window.getComputedStyle(element).position,
    )

    playwrightExpect(headerPosition).not.toBe('sticky')
    playwrightExpect(footerBoxAfter.y).toBe(footerBoxBefore.y)
    playwrightExpect(firstParagraphBoxAfter.y).toBeLessThan(
      firstParagraphBoxBefore.y - 100,
    )

    await page.keyboard.press('Escape')
    await stickyDialogContent.waitFor({ state: 'hidden' })

    await page.goto('/components/shadcn/drawer')
    const drawerDemoPreview = page.getByLabel('DrawerDemo live preview')
    const drawerDemoPanel = await openDrawer(
      drawerDemoPreview,
      'Open Drawer',
      '[data-slot="drawer-content"][data-vaul-drawer-direction="bottom"]',
    )
    const drawerDemoPreviewBox = await visibleBox(drawerDemoPreview)
    const drawerDemoPanelBox = await visibleBox(drawerDemoPanel)

    await expectBoxInside(drawerDemoPanel, drawerDemoPreview)
    playwrightExpect(drawerDemoPanelBox.height).toBeLessThanOrEqual(
      Math.round(drawerDemoPreviewBox.height * 0.55),
    )
    await page.keyboard.press('Escape')
    await drawerDemoPanel.waitFor({ state: 'hidden' })

    const drawerSidesPreview = page.getByLabel('DrawerWithSides live preview')
    for (const side of ['top', 'right', 'bottom', 'left'] as const) {
      const panel = await openDrawer(
        drawerSidesPreview,
        side,
        `[data-slot="drawer-content"][data-vaul-drawer-direction="${side}"]`,
      )

      if (side === 'top' || side === 'bottom') {
        await expectTopBottomPanelBounded(drawerSidesPreview, panel)
      } else {
        await expectBoxInside(panel, drawerSidesPreview)
      }

      await page.keyboard.press('Escape')
      await panel.waitFor({ state: 'hidden' })
    }

    await page.goto('/components/shadcn/sheet')
    const sheetDemoPreview = page.getByLabel('SheetDemo live preview')
    const sheetDemoPanel = await openDrawer(
      sheetDemoPreview,
      'Open',
      '[data-slot="sheet-content"][data-side="right"]',
    )

    await expectBoxInside(sheetDemoPanel, sheetDemoPreview)
    await page.keyboard.press('Escape')
    await sheetDemoPanel.waitFor({ state: 'hidden' })

    const sheetSidesPreview = page.getByLabel('SheetSide live preview')
    for (const side of ['top', 'right', 'bottom', 'left'] as const) {
      const panel = await openDrawer(
        sheetSidesPreview,
        side,
        `[data-slot="sheet-content"][data-side="${side}"]`,
      )

      if (side === 'top' || side === 'bottom') {
        await expectBoxInside(panel, sheetSidesPreview)
      } else {
        await expectBoxInside(panel, sheetSidesPreview)
      }

      await page.keyboard.press('Escape')
      await panel.waitFor({ state: 'hidden' })
    }

    await page.goto('/components/shadcn/sidebar')
    const sidebarScenarios = [
      'SidebarDemo live preview',
      'SidebarFooter live preview',
      'SidebarHeader live preview',
    ] as const

    for (const label of sidebarScenarios) {
      const preview = page.getByLabel(label)
      const sidebar = preview.locator('[data-slot="sidebar"]')
      const sidebarGap = preview.locator('[data-slot="sidebar-gap"]')
      const container = preview.locator('[data-slot="sidebar-container"]')

      if (label === 'SidebarDemo live preview') {
        const userMenuTrigger = preview.getByRole('button', { name: /shadcn/u })
        const userMenuContent = preview.locator(
          '[data-slot="dropdown-menu-content"][data-side="right"]',
        )

        await playwrightExpect(userMenuTrigger).toBeVisible()
        await userMenuTrigger.click()
        await playwrightExpect(userMenuContent).toBeVisible()
        await expectNonTransparentBackground(userMenuContent)
        await expectRightSideMenuBesideTrigger(
          userMenuContent,
          userMenuTrigger,
          preview,
        )
        await userMenuContent.press('Escape')
        await userMenuContent.waitFor({ state: 'hidden' })
      }

      await preview.locator('[data-slot="sidebar-trigger"]').click()
      await playwrightExpect(sidebar).toHaveAttribute('data-state', 'collapsed')

      await playwrightExpect
        .poll(async () => (await visibleBox(container)).width, {
          timeout: 2000,
        })
        .toBeGreaterThan(0)

      await playwrightExpect
        .poll(async () => (await visibleBox(sidebarGap)).width, {
          timeout: 2000,
        })
        .toBeLessThanOrEqual(56)

      const containerBox = await visibleBox(container)

      if (label === 'SidebarDemo live preview') {
        await playwrightExpect(preview.getByText('History')).not.toBeVisible()
        const playgroundButton = preview.getByRole('button', {
          name: 'Playground',
        })

        await playwrightExpect(playgroundButton).toBeVisible()
        const playgroundBox = await visibleBox(playgroundButton)

        playwrightExpect(playgroundBox.width).toBeLessThanOrEqual(40)
        playwrightExpect(playgroundBox.height).toBeLessThanOrEqual(40)
      }

      if (label === 'SidebarFooter live preview') {
        const footerMenuTrigger = preview.getByRole('button', {
          name: /Username/u,
        })
        const footerMenuContent = preview.locator(
          '[data-slot="dropdown-menu-content"][data-side="top"]',
        )

        await playwrightExpect(footerMenuTrigger).toBeVisible()
        await footerMenuTrigger.click()
        await playwrightExpect(footerMenuContent).toBeVisible()
        await expectNonTransparentBackground(footerMenuContent)
        await expectTopSideMenuAboveTrigger(
          footerMenuContent,
          footerMenuTrigger,
          preview,
        )
        await footerMenuContent.press('Escape')
        await footerMenuContent.waitFor({ state: 'hidden' })
      }

      if (label === 'SidebarHeader live preview') {
        const workspaceSelect = preview.getByRole('button', {
          name: 'Select Workspace',
        })

        await playwrightExpect(workspaceSelect).toBeVisible()
        const workspaceBox = await visibleBox(workspaceSelect)

        playwrightExpect(workspaceBox.x).toBeGreaterThanOrEqual(
          containerBox.x - 1,
        )
        playwrightExpect(
          workspaceBox.x + workspaceBox.width,
        ).toBeLessThanOrEqual(containerBox.x + containerBox.width + 1)
      }
    }
  },
)

playwrightTest(
  'attachment, data table, sidebar detail, and edge-to-edge card previews stay contained',
  async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })

    await page.goto('/components/shadcn/attachment')
    const attachmentPreview = page.getByLabel(
      'AttachmentGroupDemo live preview',
    )
    const attachmentGroup = attachmentPreview.locator(
      '[data-slot="attachment-group"]',
    )

    await expectBoxInside(attachmentGroup, attachmentPreview)
    await playwrightExpect(
      attachmentPreview.getByRole('button', {
        name: 'Remove briefing-notes.pdf',
      }),
    ).toBeVisible()

    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/components/shadcn/attachment')
    const narrowAttachmentPreview = page.getByLabel(
      'AttachmentGroupDemo live preview',
    )
    const narrowAttachmentGroup = narrowAttachmentPreview.locator(
      '[data-slot="attachment-group"]',
    )

    await expectBoxInside(narrowAttachmentGroup, narrowAttachmentPreview)
    await expectScrollable(narrowAttachmentGroup)

    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/components/shadcn/data-table')
    const tasksPreview = page.getByLabel('DataTableTasks live preview')
    const tasksCard = tasksPreview.locator('[data-slot="card"]').first()
    const tasksTableContainer = tasksPreview
      .locator('[data-slot="table-container"]')
      .first()

    await expectBoxInside(tasksCard, tasksPreview)
    await expectBoxInside(tasksTableContainer, tasksPreview)
    await playwrightExpect(
      tasksPreview.locator('[data-slot="card-title"]'),
    ).toHaveText('Tasks')

    await page.goto('/components/shadcn/sidebar')
    const menuSubPreview = page.getByLabel('SidebarMenuSub live preview')
    const menuSubContainer = menuSubPreview.locator(
      '[data-slot="sidebar-container"]',
    )
    const menuSubContent = menuSubPreview.locator(
      '[data-slot="sidebar-content"]',
    )

    await expectBoxInside(menuSubContainer, menuSubPreview)
    await expectScrollable(menuSubContent)
    await playwrightExpect(
      menuSubPreview.getByText('Installation'),
    ).toBeVisible()

    const rtlPreview = page.getByLabel('SidebarRtl live preview')
    const rtlContainer = rtlPreview.locator('[data-slot="sidebar-container"]')

    await expectBoxInside(rtlContainer, rtlPreview)
    await rtlPreview.locator('[data-slot="sidebar-trigger"]').click()
    await playwrightExpect(
      rtlPreview.locator('[data-slot="sidebar"]'),
    ).toHaveAttribute('data-state', 'collapsed')

    await page.goto('/components/shadcn/card')
    const edgePreview = page.getByLabel('CardEdgeToEdge live preview')
    const edgeCard = edgePreview.locator('[data-slot="card"]')
    const scrollRegion = edgePreview.locator(
      '[data-slot="card-content"] .overflow-y-scroll',
    )

    await expectBoxInside(edgeCard, edgePreview)
    await expectBoxInside(scrollRegion, edgePreview)
    await expectScrollable(scrollRegion)
  },
)

playwrightTest(
  'command dialogs use the viewport and keep the search input in one row',
  async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/components/shadcn/command')

    const preview = page.getByLabel('CommandBasic live preview')
    await preview.getByRole('button', { name: 'Open Menu' }).click()

    const dialog = page.locator('dialog[open]')
    const popup = dialog.locator('[data-slot="dialog-content"]')
    const inputGroup = dialog.locator('[data-slot="input-group"]')
    const input = dialog.locator('[data-slot="command-input"]')
    const searchIcon = dialog.locator('[data-slot="input-group-addon"] svg')
    const dialogBox = await visibleBox(dialog)
    const groupBox = await visibleBox(inputGroup)
    const inputBox = await visibleBox(input)
    const searchIconBox = await visibleBox(searchIcon)

    playwrightExpect(dialogBox).toStrictEqual({
      x: 0,
      y: 0,
      width: 1280,
      height: 900,
    })
    playwrightExpect(inputBox.y).toBeGreaterThanOrEqual(groupBox.y)
    playwrightExpect(inputBox.y + inputBox.height).toBeLessThanOrEqual(
      groupBox.y + groupBox.height,
    )
    playwrightExpect(
      Math.abs(
        inputBox.y +
          inputBox.height / 2 -
          (searchIconBox.y + searchIconBox.height / 2),
      ),
    ).toBeLessThanOrEqual(1)
    playwrightExpect(inputBox.width).toBeGreaterThan(groupBox.width * 0.75)
    await playwrightExpect(input).toBeFocused()
    playwrightExpect(
      await input.evaluate(element => getComputedStyle(element).outlineStyle),
    ).toBe('none')
    playwrightExpect(
      await inputGroup.evaluate(element => getComputedStyle(element).boxShadow),
    ).not.toBe('none')

    await playwrightExpect(dialog.getByText('No results found.')).toHaveCount(0)
    playwrightExpect((await visibleBox(popup)).height).toBeLessThanOrEqual(320)

    await input.fill('not-a-command')
    await playwrightExpect(dialog.getByText('No results found.')).toBeVisible()
    await playwrightExpect(dialog.getByText('Suggestions')).toHaveCount(0)
    await playwrightExpect(dialog.getByText('Calendar')).toHaveCount(0)

    await input.fill('cal')
    await playwrightExpect(dialog.getByText('No results found.')).toHaveCount(0)
    await playwrightExpect(dialog.getByText('Calendar')).toBeVisible()
    await playwrightExpect(dialog.getByText('Search Emoji')).toHaveCount(0)
  },
)

playwrightTest(
  'AttachmentWorkflowDemo live preview accepts a file',
  async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/components/shadcn/attachment')

    const workflowPreview = page.getByLabel(
      'AttachmentWorkflowDemo live preview',
    )
    await playwrightExpect(workflowPreview).toBeVisible()
    await playwrightExpect(
      workflowPreview.getByText(
        'Accepted files will appear here after they are dropped or chosen.',
      ),
    ).toBeVisible()

    await workflowPreview.locator('input[type="file"]').setInputFiles({
      name: 'workflow-brief.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('workflow brief'),
    })

    await playwrightExpect(
      workflowPreview.getByText(
        'Accepted files will appear here after they are dropped or chosen.',
      ),
    ).toBeHidden()
    await playwrightExpect(
      workflowPreview.locator('[data-slot="attachment-group"]'),
    ).toBeVisible()
    await playwrightExpect(
      workflowPreview.getByText('workflow-brief.pdf'),
    ).toBeVisible()
    await playwrightExpect(
      workflowPreview.getByText(/application\/pdf/u),
    ).toBeVisible()
  },
)
