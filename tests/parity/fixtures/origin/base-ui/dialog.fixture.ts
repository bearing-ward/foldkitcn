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

const dialogRoot = (
  options: Readonly<{
    open: boolean
    disabled?: boolean
    forceMount?: boolean
    modal?: boolean | 'trap-focus'
    keyboard?: FixtureSnapshot['keyboardBehavior']
  }>,
): FixtureSnapshot => {
  const root = document.createElement('div')
  root.dataset.modal = String(options.modal ?? true)

  if (options.disabled === true) {
    root.dataset.disabled = ''
  }

  const trigger = document.createElement('button')
  trigger.setAttribute('type', 'button')
  trigger.setAttribute('aria-haspopup', 'dialog')
  trigger.setAttribute('aria-expanded', String(options.open))
  trigger.setAttribute('aria-controls', 'settings-dialog-popup')

  if (options.open) {
    trigger.dataset.popupOpen = ''
  }

  if (options.disabled === true) {
    trigger.setAttribute('aria-disabled', 'true')
    trigger.dataset.disabled = ''
  }

  trigger.append(document.createTextNode('Open settings'))
  root.append(trigger)

  const dialog = document.createElement('dialog')
  dialog.setAttribute('id', 'settings-dialog')
  dialog.setAttribute('role', 'dialog')
  dialog.setAttribute('aria-modal', String(options.modal !== false))
  dialog.setAttribute('aria-labelledby', 'settings-title')
  dialog.setAttribute('aria-describedby', 'settings-description')

  if (options.open) {
    dialog.setAttribute('open', '')
  }

  if (options.open || options.forceMount === true) {
    const backdrop = document.createElement('div')
    backdrop.setAttribute('role', 'presentation')
    backdrop.setAttribute(options.open ? 'data-open' : 'data-closed', '')

    if (!options.open) {
      backdrop.setAttribute('hidden', '')
    }

    const popup = document.createElement('div')
    popup.setAttribute('id', 'settings-dialog-popup')
    popup.setAttribute('role', 'dialog')
    popup.setAttribute('tabindex', '-1')
    popup.setAttribute('aria-labelledby', 'settings-title')
    popup.setAttribute('aria-describedby', 'settings-description')
    popup.setAttribute(options.open ? 'data-open' : 'data-closed', '')

    if (!options.open) {
      popup.setAttribute('hidden', '')
    }

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
    popup.append(title, description, close)
    dialog.append(backdrop, popup)
  }

  root.append(dialog)
  document.body.append(root)
  const snapshot = snapshotElement(root, options.keyboard ?? enabledKeyboard)
  root.remove()

  return snapshot
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'dialog-open',
    snapshot: dialogRoot({ open: true }),
  },
  {
    id: 'dialog-closed',
    snapshot: dialogRoot({ open: false }),
  },
  {
    id: 'dialog-non-modal',
    snapshot: dialogRoot({ open: true, modal: false }),
  },
  {
    id: 'dialog-disabled',
    snapshot: dialogRoot({
      open: false,
      disabled: true,
      forceMount: true,
      keyboard: suppressedKeyboard,
    }),
  },
]
