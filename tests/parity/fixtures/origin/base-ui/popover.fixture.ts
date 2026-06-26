import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotElement } from '../../dom'

const enabledKeyboard = {
  click: 'activates',
  Enter: 'native-activates',
  Space: 'native-activates',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const suppressedKeyboard = {
  click: 'suppressed',
  Enter: 'suppressed',
  Space: 'suppressed',
  mousedown: 'suppressed',
  pointerdown: 'suppressed',
}

const appendPopoverParts = (
  portal: HTMLDivElement,
  options: Readonly<{
    open: boolean
    disabled?: boolean
    align?: string
    alignOffset?: number
    forceMount?: boolean
    modal?: boolean | 'trap-focus'
    side?: string
    sideOffset?: number
  }>,
): void => {
  if (!options.open && options.forceMount !== true) {
    return
  }

  const side = options.side ?? 'bottom'
  const align = options.align ?? 'center'
  const sideOffset = String(options.sideOffset ?? 0)
  const alignOffset = String(options.alignOffset ?? 0)

  const backdrop = document.createElement('div')
  backdrop.setAttribute('role', 'presentation')
  backdrop.setAttribute(options.open ? 'data-open' : 'data-closed', '')

  if (!options.open) {
    backdrop.setAttribute('hidden', '')
  }

  const positioner = document.createElement('div')
  positioner.setAttribute('id', 'settings-popover-positioner')
  positioner.setAttribute(options.open ? 'data-open' : 'data-closed', '')
  positioner.dataset.side = side
  positioner.dataset.align = align
  positioner.dataset.sideOffset = sideOffset
  positioner.dataset.alignOffset = alignOffset
  positioner.dataset.collisionAvoidance = 'true'
  positioner.dataset.collisionPadding = '0'

  if (!options.open) {
    positioner.setAttribute('hidden', '')
  }

  const popup = document.createElement('div')
  popup.setAttribute('id', 'settings-popover-popup')
  popup.setAttribute('popover', 'manual')
  popup.setAttribute('role', 'dialog')
  popup.setAttribute('tabindex', '-1')
  popup.setAttribute('aria-modal', String((options.modal ?? false) !== false))
  popup.setAttribute('aria-labelledby', 'settings-title')
  popup.setAttribute('aria-describedby', 'settings-description')
  popup.setAttribute(options.open ? 'data-open' : 'data-closed', '')
  popup.dataset.side = side
  popup.dataset.align = align
  popup.dataset.sideOffset = sideOffset
  popup.dataset.alignOffset = alignOffset
  popup.dataset.collisionAvoidance = 'true'
  popup.dataset.collisionPadding = '0'

  if (!options.open) {
    popup.setAttribute('hidden', '')
  }

  const arrow = document.createElement('div')
  arrow.setAttribute('id', 'settings-popover-arrow')
  arrow.setAttribute('aria-hidden', 'true')
  arrow.setAttribute(options.open ? 'data-open' : 'data-closed', '')
  arrow.dataset.side = side
  arrow.dataset.align = align
  arrow.dataset.sideOffset = sideOffset
  arrow.dataset.alignOffset = alignOffset
  arrow.dataset.collisionAvoidance = 'true'
  arrow.dataset.collisionPadding = '0'

  const title = document.createElement('h2')
  title.setAttribute('id', 'settings-title')
  title.append(document.createTextNode('Settings'))

  const description = document.createElement('p')
  description.setAttribute('id', 'settings-description')
  description.append(document.createTextNode('Manage settings.'))

  const close = document.createElement('button')
  close.setAttribute('type', 'button')

  if (options.disabled === true) {
    close.setAttribute('aria-disabled', 'true')
    close.dataset.disabled = ''
  }

  close.append(document.createTextNode('Close'))
  popup.append(arrow, title, description, close)
  positioner.append(popup)
  portal.append(backdrop, positioner)
}

const popoverRoot = (
  options: Readonly<{
    open: boolean
    disabled?: boolean
    align?: string
    alignOffset?: number
    forceMount?: boolean
    keyboard?: FixtureSnapshot['keyboardBehavior']
    modal?: boolean | 'trap-focus'
    side?: string
    sideOffset?: number
  }>,
): FixtureSnapshot => {
  const root = document.createElement('div')
  root.dataset.modal = String(options.modal ?? false)
  root.dataset.side = options.side ?? 'bottom'
  root.dataset.align = options.align ?? 'center'

  if (options.disabled === true) {
    root.dataset.disabled = ''
  }

  const trigger = document.createElement('button')
  trigger.setAttribute('id', 'settings-popover-trigger')
  trigger.setAttribute('type', 'button')
  trigger.setAttribute('aria-haspopup', 'dialog')
  trigger.setAttribute('aria-expanded', String(options.open))
  trigger.setAttribute('aria-controls', 'settings-popover-popup')

  if (options.open) {
    trigger.dataset.popupOpen = ''
  }

  if (options.disabled === true) {
    trigger.setAttribute('aria-disabled', 'true')
    trigger.dataset.disabled = ''
  }

  trigger.append(document.createTextNode('Open settings'))
  root.append(trigger)

  const portal = document.createElement('div')
  portal.dataset.portal = ''
  appendPopoverParts(portal, options)
  root.append(portal)
  document.body.append(root)
  const snapshot = snapshotElement(root, options.keyboard ?? enabledKeyboard)
  root.remove()

  return snapshot
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'popover-open',
    snapshot: popoverRoot({
      open: true,
      side: 'top',
      align: 'end',
      sideOffset: 4,
    }),
  },
  {
    id: 'popover-closed',
    snapshot: popoverRoot({ open: false }),
  },
  {
    id: 'popover-force-mounted',
    snapshot: popoverRoot({ open: false, forceMount: true, alignOffset: 2 }),
  },
  {
    id: 'popover-modal',
    snapshot: popoverRoot({ open: true, modal: true }),
  },
  {
    id: 'popover-disabled',
    snapshot: popoverRoot({
      open: false,
      disabled: true,
      forceMount: true,
      keyboard: suppressedKeyboard,
    }),
  },
]
