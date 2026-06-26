import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotElement } from '../../dom'

const enabledKeyboard = {
  click: 'activates',
  Enter: 'activates',
  Space: 'activates',
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

const collapsibleRoot = (
  options: Readonly<{
    open: boolean
    disabled?: boolean
    keepMounted?: boolean
    hiddenUntilFound?: boolean
    keyboard?: FixtureSnapshot['keyboardBehavior']
  }>,
): FixtureSnapshot => {
  const root = document.createElement('div')
  root.setAttribute(options.open ? 'data-open' : 'data-closed', '')

  const button = document.createElement('button')
  button.setAttribute('type', 'button')
  button.setAttribute('aria-expanded', String(options.open))

  if (options.open) {
    button.setAttribute('aria-controls', 'recovery-panel')
    button.dataset.panelOpen = ''
  }

  if (options.disabled === true) {
    button.setAttribute('aria-disabled', 'true')
    button.dataset.disabled = ''
  }

  button.append(document.createTextNode('Recovery keys'))
  root.append(button)

  if (
    options.open ||
    options.keepMounted === true ||
    options.hiddenUntilFound === true
  ) {
    const panel = document.createElement('div')
    panel.setAttribute('id', 'recovery-panel')
    panel.setAttribute(options.open ? 'data-open' : 'data-closed', '')

    if (!options.open) {
      panel.setAttribute(
        'hidden',
        options.hiddenUntilFound === true ? 'until-found' : '',
      )
    }

    panel.append(document.createTextNode('Recovery keys panel'))
    root.append(panel)
  }

  document.body.append(root)
  const snapshot = snapshotElement(root, options.keyboard ?? enabledKeyboard)
  root.remove()

  return snapshot
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'collapsible-open',
    snapshot: collapsibleRoot({ open: true }),
  },
  {
    id: 'collapsible-closed',
    snapshot: collapsibleRoot({ open: false }),
  },
  {
    id: 'collapsible-keep-mounted',
    snapshot: collapsibleRoot({ open: false, keepMounted: true }),
  },
  {
    id: 'collapsible-hidden-until-found',
    snapshot: collapsibleRoot({ open: false, hiddenUntilFound: true }),
  },
  {
    id: 'collapsible-disabled',
    snapshot: collapsibleRoot({
      open: false,
      disabled: true,
      keepMounted: true,
      keyboard: suppressedKeyboard,
    }),
  },
]
