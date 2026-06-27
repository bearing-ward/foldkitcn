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

const alertDialogRoot = (
  options: Readonly<{
    open: boolean
    disabled?: boolean
    forceMount?: boolean
    keyboard?: FixtureSnapshot['keyboardBehavior']
  }>,
): FixtureSnapshot => {
  const root = document.createElement('div')
  root.dataset.modal = 'true'

  if (options.disabled === true) {
    root.dataset.disabled = ''
  }

  const trigger = document.createElement('button')
  trigger.setAttribute('type', 'button')
  trigger.setAttribute('aria-haspopup', 'dialog')
  trigger.setAttribute('aria-expanded', String(options.open))
  trigger.setAttribute('aria-controls', 'confirm-dialog-popup')

  if (options.open) {
    trigger.dataset.popupOpen = ''
  }

  if (options.disabled === true) {
    trigger.setAttribute('aria-disabled', 'true')
    trigger.dataset.disabled = ''
  }

  trigger.append(document.createTextNode('Delete account'))
  root.append(trigger)

  const dialog = document.createElement('dialog')
  dialog.setAttribute('id', 'confirm-dialog')
  dialog.setAttribute('role', 'dialog')
  dialog.setAttribute('aria-modal', 'true')
  dialog.setAttribute('aria-labelledby', 'confirm-title')
  dialog.setAttribute('aria-describedby', 'confirm-description')

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
    popup.setAttribute('id', 'confirm-dialog-popup')
    popup.setAttribute('role', 'alertdialog')
    popup.setAttribute('tabindex', '-1')
    popup.setAttribute('aria-labelledby', 'confirm-title')
    popup.setAttribute('aria-describedby', 'confirm-description')
    popup.setAttribute(options.open ? 'data-open' : 'data-closed', '')

    if (!options.open) {
      popup.setAttribute('hidden', '')
    }

    const title = document.createElement('h2')
    title.setAttribute('id', 'confirm-title')
    title.append(document.createTextNode('Are you sure?'))

    const description = document.createElement('p')
    description.setAttribute('id', 'confirm-description')
    description.append(document.createTextNode('This action cannot be undone.'))

    const cancel = document.createElement('button')
    cancel.setAttribute('type', 'button')
    cancel.append(document.createTextNode('Cancel'))

    const action = document.createElement('button')
    action.setAttribute('type', 'button')
    action.append(document.createTextNode('Continue'))

    if (options.disabled === true) {
      cancel.setAttribute('aria-disabled', 'true')
      cancel.dataset.disabled = ''
      action.setAttribute('aria-disabled', 'true')
      action.dataset.disabled = ''
    }

    popup.append(title, description, cancel, action)
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
    id: 'alert-dialog-open',
    snapshot: alertDialogRoot({ open: true }),
  },
  {
    id: 'alert-dialog-closed',
    snapshot: alertDialogRoot({ open: false }),
  },
  {
    id: 'alert-dialog-disabled',
    snapshot: alertDialogRoot({
      open: false,
      disabled: true,
      forceMount: true,
      keyboard: suppressedKeyboard,
    }),
  },
]
