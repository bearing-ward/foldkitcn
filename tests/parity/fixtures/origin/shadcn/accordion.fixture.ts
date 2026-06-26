import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotElement } from '../../dom'

const enabledKeyboard = {
  click: 'activates',
  Enter: 'activates',
  Space: 'activates',
  ArrowDown: 'passes-through',
  ArrowUp: 'passes-through',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const suppressedKeyboard = {
  click: 'suppressed',
  Enter: 'suppressed',
  Space: 'suppressed',
  ArrowDown: 'passes-through',
  ArrowUp: 'passes-through',
  mousedown: 'suppressed',
  pointerdown: 'suppressed',
}

const rootClassName = 'flex w-full flex-col max-w-lg'
const itemClassName = 'not-last:border-b'
const headerClassName = 'flex'
const triggerClassName =
  'group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-2.5 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring aria-disabled:pointer-events-none aria-disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground'
const contentClassName =
  'overflow-hidden text-sm data-open:animate-accordion-down data-closed:animate-accordion-up'
const contentInnerClassName =
  'h-(--accordion-panel-height) pt-0 pb-2.5 data-ending-style:h-0 data-starting-style:h-0 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4'
const closedIconClassName =
  'pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden'
const openIconClassName =
  'pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline'

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
  }>,
): void => {
  const item = document.createElement('div')
  item.setAttribute('id', options.id)
  item.dataset.index = String(options.index)
  item.setAttribute(options.open ? 'data-open' : 'data-closed', '')
  item.dataset.slot = 'accordion-item'
  item.setAttribute('class', itemClassName)

  if (options.disabled === true) {
    item.dataset.disabled = ''
  }

  const header = document.createElement('h3')
  header.dataset.index = String(options.index)
  header.setAttribute(options.open ? 'data-open' : 'data-closed', '')
  header.setAttribute('class', headerClassName)

  if (options.disabled === true) {
    header.dataset.disabled = ''
  }

  const button = document.createElement('button')
  button.setAttribute('type', 'button')
  button.setAttribute('id', `${options.value}-trigger`)
  button.setAttribute('aria-expanded', String(options.open))
  button.dataset.slot = 'accordion-trigger'
  button.setAttribute('class', triggerClassName)

  if (options.open) {
    button.setAttribute('aria-controls', options.panelId)
    button.dataset.panelOpen = ''
  }

  if (options.disabled === true) {
    button.setAttribute('aria-disabled', 'true')
    button.dataset.disabled = ''
  }

  const closedIcon = document.createElement('span')
  closedIcon.dataset.slot = 'accordion-trigger-icon'
  closedIcon.setAttribute('class', closedIconClassName)

  const openIcon = document.createElement('span')
  openIcon.dataset.slot = 'accordion-trigger-icon'
  openIcon.setAttribute('class', openIconClassName)

  button.append(document.createTextNode(options.label), closedIcon, openIcon)
  header.append(button)
  item.append(header)

  if (options.open || options.keepMounted === true) {
    const panel = document.createElement('div')
    panel.setAttribute('role', 'region')
    panel.setAttribute('id', options.panelId)
    panel.setAttribute('aria-labelledby', `${options.value}-trigger`)
    panel.dataset.index = String(options.index)
    panel.dataset.orientation = 'vertical'
    panel.setAttribute(options.open ? 'data-open' : 'data-closed', '')
    panel.dataset.slot = 'accordion-content'
    panel.setAttribute('class', contentClassName)

    if (!options.open) {
      panel.setAttribute('hidden', '')
      panel.setAttribute('inert', '')
    }

    if (options.disabled === true) {
      panel.dataset.disabled = ''
    }

    const inner = document.createElement('div')
    inner.setAttribute('class', contentInnerClassName)
    inner.append(document.createTextNode(options.panelLabel))
    panel.append(inner)
    item.append(panel)
  }

  root.append(item)
}

const accordionRoot = (
  options: Readonly<{
    value: ReadonlyArray<string>
    disabledSecond?: boolean
    keyboard?: FixtureSnapshot['keyboardBehavior']
  }>,
): FixtureSnapshot => {
  const root = document.createElement('div')
  root.dataset.orientation = 'vertical'
  root.dataset.slot = 'accordion'
  root.setAttribute('class', rootClassName)

  appendAccordionItem(root, {
    index: 0,
    id: 'shipping-item',
    value: 'shipping',
    label: 'Shipping',
    panelId: 'shipping-panel',
    panelLabel: 'Shipping panel',
    open: options.value.includes('shipping'),
  })

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

  document.body.append(root)
  const snapshot = snapshotElement(root, options.keyboard ?? enabledKeyboard)
  root.remove()

  return snapshot
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'accordion-basic',
    snapshot: accordionRoot({ value: ['shipping'] }),
  },
  {
    id: 'accordion-multiple',
    snapshot: accordionRoot({ value: ['shipping', 'billing'] }),
  },
  {
    id: 'accordion-disabled',
    snapshot: accordionRoot({
      value: ['shipping'],
      disabledSecond: true,
      keyboard: suppressedKeyboard,
    }),
  },
]
