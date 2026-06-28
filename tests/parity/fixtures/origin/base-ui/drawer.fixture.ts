import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { nativeEnabledKeyboard, suppressedKeyboard } from '../../../fixture'
import { snapshotElement } from '../../dom'

type CaseConfig = Readonly<{
  open: boolean
  disabled?: boolean
  forceMount?: boolean
  hasActiveDrawer?: boolean
  expanded?: boolean
  nestedDrawerOpen?: boolean
  modal?: boolean | 'trap-focus'
  swipeDirection?: 'up' | 'down' | 'left' | 'right'
  keyboard?: FixtureSnapshot['keyboardBehavior']
}>

const placementFromSwipeDirection = (
  swipeDirection: CaseConfig['swipeDirection'],
): string => {
  if (swipeDirection === 'up') {
    return 'top'
  }

  if (swipeDirection === 'left') {
    return 'left'
  }

  if (swipeDirection === 'right') {
    return 'right'
  }

  return 'bottom'
}

const setBooleanAttribute = (
  element: Element,
  name: string,
  value: boolean | undefined,
): void => {
  if (value === true) {
    element.setAttribute(name, '')
  }
}

const drawerRoot = (config: CaseConfig): FixtureSnapshot => {
  const swipeDirection = config.swipeDirection ?? 'down'
  const placement = placementFromSwipeDirection(config.swipeDirection)
  const active = config.hasActiveDrawer ?? config.open
  const root = document.createElement('div')
  root.dataset.modal = String(config.modal ?? true)
  root.dataset.swipeDirection = swipeDirection
  root.dataset.placement = placement

  if (config.disabled === true) {
    root.dataset.disabled = ''
  }

  const indentBackground = document.createElement('div')
  indentBackground.setAttribute(active ? 'data-active' : 'data-inactive', '')

  const indent = document.createElement('div')
  indent.setAttribute(active ? 'data-active' : 'data-inactive', '')

  const trigger = document.createElement('button')
  trigger.setAttribute('type', 'button')
  trigger.setAttribute('aria-haspopup', 'dialog')
  trigger.setAttribute('aria-expanded', String(config.open))
  trigger.setAttribute('aria-controls', 'activity-drawer-popup')

  if (config.open) {
    trigger.dataset.popupOpen = ''
  }

  if (config.disabled === true) {
    trigger.setAttribute('aria-disabled', 'true')
    trigger.dataset.disabled = ''
  }

  trigger.append(document.createTextNode('Open drawer'))

  const dialog = document.createElement('dialog')
  dialog.setAttribute('id', 'activity-drawer')
  dialog.setAttribute('role', 'dialog')
  dialog.setAttribute('aria-modal', String(config.modal !== false))
  dialog.setAttribute('aria-labelledby', 'activity-title')
  dialog.setAttribute('aria-describedby', 'activity-description')

  if (config.open) {
    dialog.setAttribute('open', '')
  }

  if (config.open || config.forceMount === true) {
    const backdrop = document.createElement('div')
    backdrop.setAttribute('role', 'presentation')
    backdrop.setAttribute(config.open ? 'data-open' : 'data-closed', '')

    if (!config.open) {
      backdrop.setAttribute('hidden', '')
    }

    const popup = document.createElement('div')
    popup.setAttribute('id', 'activity-drawer-popup')
    popup.setAttribute('role', 'dialog')
    popup.setAttribute('tabindex', '-1')
    popup.setAttribute('aria-labelledby', 'activity-title')
    popup.setAttribute('aria-describedby', 'activity-description')
    popup.setAttribute(config.open ? 'data-open' : 'data-closed', '')
    popup.dataset.swipeDirection = swipeDirection
    popup.dataset.placement = placement
    setBooleanAttribute(popup, 'data-expanded', config.expanded)
    setBooleanAttribute(
      popup,
      'data-nested-drawer-open',
      config.nestedDrawerOpen,
    )

    if (!config.open) {
      popup.setAttribute('hidden', '')
    }

    const content = document.createElement('div')
    content.dataset.drawerContent = ''

    const title = document.createElement('h2')
    title.setAttribute('id', 'activity-title')
    title.append(document.createTextNode('Activity'))

    const description = document.createElement('p')
    description.setAttribute('id', 'activity-description')
    description.append(document.createTextNode('Set your daily goal.'))

    const close = document.createElement('button')
    close.setAttribute('type', 'button')

    if (config.disabled === true) {
      close.setAttribute('aria-disabled', 'true')
      close.dataset.disabled = ''
    }

    close.append(document.createTextNode('Close'))
    content.append(title, description, close)
    popup.append(content)
    dialog.append(backdrop, popup)
  }

  root.append(indentBackground, indent, trigger, dialog)
  document.body.append(root)
  const snapshot = snapshotElement(
    root,
    config.keyboard ?? nativeEnabledKeyboard,
  )
  root.remove()

  return snapshot
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'drawer-open-bottom',
    snapshot: drawerRoot({ open: true }),
  },
  {
    id: 'drawer-closed',
    snapshot: drawerRoot({ open: false }),
  },
  {
    id: 'drawer-left-expanded',
    snapshot: drawerRoot({
      expanded: true,
      nestedDrawerOpen: true,
      open: true,
      swipeDirection: 'left',
    }),
  },
  {
    id: 'drawer-disabled',
    snapshot: drawerRoot({
      disabled: true,
      forceMount: true,
      hasActiveDrawer: true,
      keyboard: suppressedKeyboard,
      open: false,
    }),
  },
]
