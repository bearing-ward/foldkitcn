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

const fruitItems: ReadonlyArray<
  Readonly<{
    value: string
    label: string
    disabled?: boolean
  }>
> = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'grapes', label: 'Grapes', disabled: true },
  { value: 'pineapple', label: 'Pineapple' },
]

const itemId = (value: string): string => `fruit-select-item-${value}`

const appendPopupParts = (
  portal: HTMLDivElement,
  options: Readonly<{
    open: boolean
    align?: string
    disabled?: boolean
    forceMount?: boolean
    highlightedValue?: string
    side?: string
    sideOffset?: number
    value?: string
  }>,
): void => {
  if (!options.open && options.forceMount !== true) {
    return
  }

  const side = options.side ?? 'bottom'
  const align = options.align ?? 'center'
  const sideOffset = String(options.sideOffset ?? 0)

  const backdrop = document.createElement('div')
  backdrop.setAttribute('role', 'presentation')
  backdrop.setAttribute(options.open ? 'data-open' : 'data-closed', '')

  if (!options.open) {
    backdrop.setAttribute('hidden', '')
  }

  const positioner = document.createElement('div')
  positioner.setAttribute('id', 'fruit-select-positioner')
  positioner.setAttribute(options.open ? 'data-open' : 'data-closed', '')
  positioner.dataset.side = side
  positioner.dataset.align = align
  positioner.dataset.sideOffset = sideOffset
  positioner.dataset.alignOffset = '0'
  positioner.dataset.collisionAvoidance = 'true'
  positioner.dataset.collisionPadding = '0'

  if (!options.open) {
    positioner.setAttribute('hidden', '')
  }

  const popup = document.createElement('div')
  popup.setAttribute('id', 'fruit-select-popup')
  popup.setAttribute('popover', 'manual')
  popup.setAttribute('role', 'listbox')
  popup.setAttribute('tabindex', '-1')
  popup.setAttribute('aria-labelledby', 'fruit-select-value')
  popup.dataset[options.open ? 'open' : 'closed'] = ''
  popup.dataset.side = side
  popup.dataset.align = align
  popup.dataset.sideOffset = sideOffset
  popup.dataset.alignOffset = '0'
  popup.dataset.collisionAvoidance = 'true'
  popup.dataset.collisionPadding = '0'
  popup.dataset.alignTrigger = 'true'

  if (!options.open) {
    popup.setAttribute('hidden', '')
  }

  const arrow = document.createElement('div')
  arrow.setAttribute('id', 'fruit-select-arrow')
  arrow.setAttribute(options.open ? 'data-open' : 'data-closed', '')
  arrow.dataset.side = side
  arrow.dataset.align = align
  arrow.dataset.sideOffset = sideOffset
  arrow.dataset.alignOffset = '0'
  arrow.dataset.collisionAvoidance = 'true'
  arrow.dataset.collisionPadding = '0'

  if (!options.open) {
    arrow.setAttribute('hidden', '')
  }

  const scrollUp = document.createElement('div')
  scrollUp.setAttribute('id', 'fruit-select-scroll-up')
  scrollUp.setAttribute(options.open ? 'data-open' : 'data-closed', '')
  scrollUp.dataset.side = side
  scrollUp.dataset.align = align
  scrollUp.dataset.sideOffset = sideOffset
  scrollUp.dataset.alignOffset = '0'
  scrollUp.dataset.collisionAvoidance = 'true'
  scrollUp.dataset.collisionPadding = '0'
  scrollUp.append(document.createTextNode('Up'))

  if (!options.open) {
    scrollUp.setAttribute('hidden', '')
  }

  const list = document.createElement('div')
  list.setAttribute('id', 'fruit-select-list')
  list.setAttribute('role', 'presentation')

  const group = document.createElement('div')
  group.setAttribute('role', 'group')

  const groupLabel = document.createElement('div')
  groupLabel.append(document.createTextNode('Fruits'))
  group.append(groupLabel)

  const itemNodes = fruitItems.map(item => {
    const itemRoot = document.createElement('div')
    itemRoot.setAttribute('id', itemId(item.value))
    itemRoot.setAttribute('role', 'option')
    itemRoot.setAttribute(
      'tabindex',
      options.highlightedValue === item.value ? '0' : '-1',
    )
    itemRoot.setAttribute('aria-selected', String(options.value === item.value))

    if (options.value === item.value) {
      itemRoot.dataset.selected = ''
    }

    if (options.highlightedValue === item.value) {
      itemRoot.dataset.highlighted = ''
    }

    if (item.disabled === true) {
      itemRoot.setAttribute('aria-disabled', 'true')
      itemRoot.dataset.disabled = ''
    }

    const text = document.createElement('span')

    if (options.value === item.value) {
      text.dataset.selected = ''
    }

    if (options.highlightedValue === item.value) {
      text.dataset.highlighted = ''
    }

    if (item.disabled === true) {
      text.dataset.disabled = ''
    }

    text.append(document.createTextNode(item.label))
    const indicator = document.createElement('span')

    if (options.value === item.value) {
      indicator.dataset.selected = ''

      if (options.highlightedValue === item.value) {
        indicator.dataset.highlighted = ''
      }

      if (item.disabled === true) {
        indicator.dataset.disabled = ''
      }
    }

    itemRoot.append(text, indicator)
    return itemRoot
  })

  group.append(...itemNodes)

  list.append(group)

  const separator = document.createElement('div')
  separator.setAttribute('role', 'separator')
  separator.setAttribute('aria-orientation', 'horizontal')

  const scrollDown = document.createElement('div')
  scrollDown.setAttribute('id', 'fruit-select-scroll-down')
  scrollDown.setAttribute(options.open ? 'data-open' : 'data-closed', '')
  scrollDown.dataset.side = side
  scrollDown.dataset.align = align
  scrollDown.dataset.sideOffset = sideOffset
  scrollDown.dataset.alignOffset = '0'
  scrollDown.dataset.collisionAvoidance = 'true'
  scrollDown.dataset.collisionPadding = '0'
  scrollDown.append(document.createTextNode('Down'))

  if (!options.open) {
    scrollDown.setAttribute('hidden', '')
  }

  popup.append(arrow, scrollUp, list, separator, scrollDown)
  positioner.append(popup)
  portal.append(backdrop, positioner)
}

const selectRoot = (
  options: Readonly<{
    open: boolean
    align?: string
    disabled?: boolean
    forceMount?: boolean
    highlightedValue?: string
    keyboard?: FixtureSnapshot['keyboardBehavior']
    side?: string
    sideOffset?: number
    value?: string
  }>,
): FixtureSnapshot => {
  const side = options.side ?? 'bottom'
  const align = options.align ?? 'center'
  const selectedItem = fruitItems.find(item => item.value === options.value)
  const displayValue = selectedItem?.label ?? 'Select a fruit'
  const root = document.createElement('div')
  root.dataset.side = side
  root.dataset.align = align

  if (options.disabled === true) {
    root.dataset.disabled = ''
  }

  const trigger = document.createElement('button')
  trigger.setAttribute('id', 'fruit-select-trigger')
  trigger.setAttribute('type', 'button')
  trigger.setAttribute('aria-haspopup', 'listbox')
  trigger.setAttribute('aria-expanded', String(options.open))
  trigger.setAttribute('aria-controls', 'fruit-select-popup')
  trigger.setAttribute('aria-labelledby', 'fruit-select-value')

  if (options.highlightedValue !== undefined) {
    trigger.setAttribute(
      'aria-activedescendant',
      itemId(options.highlightedValue),
    )
  }

  if (options.open) {
    trigger.dataset.popupOpen = ''
  }

  if (selectedItem === undefined) {
    trigger.dataset.placeholder = ''
  }

  if (options.disabled === true) {
    trigger.setAttribute('aria-disabled', 'true')
    trigger.dataset.disabled = ''
  }

  const value = document.createElement('span')
  value.setAttribute('id', 'fruit-select-value')

  if (selectedItem === undefined) {
    value.dataset.placeholder = ''
  }

  value.append(document.createTextNode(displayValue))

  const icon = document.createElement('span')
  icon.setAttribute('id', 'fruit-select-icon')
  icon.setAttribute('aria-hidden', 'true')

  if (options.open) {
    icon.dataset.popupOpen = ''
  }

  icon.append(document.createTextNode('v'))
  trigger.append(value, icon)
  root.append(trigger)

  const portal = document.createElement('div')
  portal.dataset.portal = ''
  appendPopupParts(portal, options)
  root.append(portal)

  const input = document.createElement('input')
  input.setAttribute('type', 'hidden')
  input.setAttribute('name', 'fruit')
  input.setAttribute('value', options.value ?? '')

  if (options.disabled === true) {
    input.setAttribute('disabled', '')
  }

  root.append(input)
  document.body.append(root)
  const snapshot = snapshotElement(root, options.keyboard ?? enabledKeyboard)
  root.remove()

  return snapshot
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'select-open',
    snapshot: selectRoot({
      open: true,
      highlightedValue: 'banana',
      side: 'top',
      align: 'end',
      sideOffset: 4,
    }),
  },
  {
    id: 'select-closed',
    snapshot: selectRoot({ open: false }),
  },
  {
    id: 'select-selected',
    snapshot: selectRoot({
      open: true,
      value: 'banana',
      highlightedValue: 'banana',
    }),
  },
  {
    id: 'select-force-mounted',
    snapshot: selectRoot({ open: false, forceMount: true }),
  },
  {
    id: 'select-disabled',
    snapshot: selectRoot({
      open: false,
      disabled: true,
      forceMount: true,
      keyboard: suppressedKeyboard,
    }),
  },
]
