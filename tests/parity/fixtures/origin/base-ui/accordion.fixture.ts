import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotElement } from '../../dom'

const enabledKeyboard = {
  click: 'activates',
  Enter: 'activates',
  Space: 'activates',
  ArrowDown: 'moves-focus',
  ArrowUp: 'moves-focus',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const suppressedKeyboard = {
  click: 'suppressed',
  Enter: 'suppressed',
  Space: 'suppressed',
  ArrowDown: 'suppressed',
  ArrowUp: 'suppressed',
  mousedown: 'suppressed',
  pointerdown: 'suppressed',
}

const appendAccordionItem = (
  root: HTMLElement,
  options: Readonly<{
    index: number
    id: string
    value: string
    label: string
    panelId: string
    panelLabel: string
    open: boolean
    disabled?: boolean
    keepMounted?: boolean
    hiddenUntilFound?: boolean
  }>,
): void => {
  const item = document.createElement('div')
  item.setAttribute('id', options.id)
  item.dataset.index = String(options.index)
  item.setAttribute(options.open ? 'data-open' : 'data-closed', '')

  if (options.disabled === true) {
    item.dataset.disabled = ''
  }

  const header = document.createElement('h3')
  header.dataset.index = String(options.index)
  header.setAttribute(options.open ? 'data-open' : 'data-closed', '')

  if (options.disabled === true) {
    header.dataset.disabled = ''
  }

  const button = document.createElement('button')
  button.setAttribute('type', 'button')
  button.setAttribute('id', `${options.value}-trigger`)
  button.setAttribute('aria-expanded', String(options.open))

  if (options.open) {
    button.setAttribute('aria-controls', options.panelId)
    button.dataset.panelOpen = ''
  }

  if (options.disabled === true) {
    button.setAttribute('aria-disabled', 'true')
    button.dataset.disabled = ''
  }

  button.append(document.createTextNode(options.label))
  header.append(button)
  item.append(header)

  if (
    options.open ||
    options.keepMounted === true ||
    options.hiddenUntilFound === true
  ) {
    const panel = document.createElement('div')
    panel.setAttribute('role', 'region')
    panel.setAttribute('id', options.panelId)
    panel.setAttribute('aria-labelledby', `${options.value}-trigger`)
    panel.dataset.index = String(options.index)
    panel.dataset.orientation = 'vertical'
    panel.setAttribute(options.open ? 'data-open' : 'data-closed', '')

    if (!options.open) {
      panel.setAttribute(
        'hidden',
        options.hiddenUntilFound === true ? 'until-found' : '',
      )
      panel.setAttribute('inert', '')
    }

    if (options.disabled === true) {
      panel.dataset.disabled = ''
    }

    panel.append(document.createTextNode(options.panelLabel))
    item.append(panel)
  }

  root.append(item)
}

const accordionRoot = (
  options: Readonly<{
    value: ReadonlyArray<string>
    multiple?: boolean
    disabled?: boolean
    hiddenUntilFound?: boolean
    disabledSecond?: boolean
    keyboard?: FixtureSnapshot['keyboardBehavior']
  }>,
): FixtureSnapshot => {
  const root = document.createElement('div')
  root.dataset.orientation = 'vertical'

  if (options.disabled === true) {
    root.dataset.disabled = ''
  }

  appendAccordionItem(root, {
    index: 0,
    id: 'shipping-item',
    value: 'shipping',
    label: 'Shipping',
    panelId: 'shipping-panel',
    panelLabel: 'Shipping panel',
    open: options.value.includes('shipping'),
    hiddenUntilFound: options.hiddenUntilFound,
  })

  if (options.hiddenUntilFound !== true) {
    appendAccordionItem(root, {
      index: 1,
      id: 'billing-item',
      value: 'billing',
      label: 'Billing',
      panelId: 'billing-panel',
      panelLabel: 'Billing panel',
      open: options.value.includes('billing'),
      disabled: options.disabledSecond,
      keepMounted: true,
    })
  }

  document.body.append(root)
  const snapshot = snapshotElement(root, options.keyboard ?? enabledKeyboard)
  root.remove()

  return snapshot
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'accordion-single-open',
    snapshot: accordionRoot({ value: ['shipping'] }),
  },
  {
    id: 'accordion-multiple-open',
    snapshot: accordionRoot({ value: ['shipping', 'billing'], multiple: true }),
  },
  {
    id: 'accordion-disabled',
    snapshot: accordionRoot({
      value: ['shipping'],
      disabledSecond: true,
      keyboard: suppressedKeyboard,
    }),
  },
  {
    id: 'accordion-hidden-until-found',
    snapshot: accordionRoot({ value: [], hiddenUntilFound: true }),
  },
]
