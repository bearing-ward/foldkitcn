import * as ShadcnSelect from '../../../../../src/registry/shadcn/select'
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
  { value: 'grapes', label: 'Grapes', disabled: true },
]

const itemId = (value: string): string => `profile-select-item-${value}`

const appendPositionedPartAttributes = (
  element: HTMLElement,
  options: Readonly<{
    open: boolean
    align: string
    side: string
  }>,
): void => {
  element.dataset[options.open ? 'open' : 'closed'] = ''
  element.dataset.side = options.side
  element.dataset.align = options.align
  element.dataset.sideOffset = '4'
  element.dataset.alignOffset = '0'
  element.dataset.collisionAvoidance = 'true'
  element.dataset.collisionPadding = '0'
}

const appendPopupParts = (
  portal: HTMLDivElement,
  options: Readonly<{
    open: boolean
    align: string
    dir?: string
    forceMount?: boolean
    highlightedValue?: string
    side: string
    triggerClassName?: string
    value?: string
  }>,
): void => {
  if (!options.open && options.forceMount !== true) {
    return
  }

  const backdrop = document.createElement('div')
  backdrop.setAttribute('role', 'presentation')
  backdrop.dataset[options.open ? 'open' : 'closed'] = ''

  if (!options.open) {
    backdrop.setAttribute('hidden', '')
  }

  const positioner = document.createElement('div')
  positioner.setAttribute('id', 'profile-select-positioner')
  appendPositionedPartAttributes(positioner, options)
  positioner.setAttribute('class', ShadcnSelect.selectPositionerClassName())

  if (!options.open) {
    positioner.setAttribute('hidden', '')
  }

  const popup = document.createElement('div')
  popup.setAttribute('id', 'profile-select-popup')
  popup.setAttribute('popover', 'manual')
  popup.setAttribute('role', 'listbox')
  popup.setAttribute('tabindex', '-1')
  popup.setAttribute('aria-labelledby', 'profile-select-value')
  appendPositionedPartAttributes(popup, options)
  popup.dataset.alignTrigger = 'true'
  popup.dataset.slot = 'select-content'
  popup.setAttribute(
    'class',
    ShadcnSelect.selectContentClassName({ dir: options.dir }),
  )

  if (options.dir !== undefined) {
    popup.setAttribute('dir', options.dir)
  }

  if (!options.open) {
    popup.setAttribute('hidden', '')
  }

  const scrollUp = document.createElement('div')
  scrollUp.setAttribute('id', 'profile-select-scroll-up')
  appendPositionedPartAttributes(scrollUp, options)
  scrollUp.dataset.slot = 'select-scroll-up-button'
  scrollUp.setAttribute('class', ShadcnSelect.selectScrollUpClassName())
  scrollUp.append(document.createTextNode('Up'))

  if (!options.open) {
    scrollUp.setAttribute('hidden', '')
  }

  const list = document.createElement('div')
  list.setAttribute('id', 'profile-select-list')
  list.setAttribute('role', 'presentation')

  const group = document.createElement('div')
  group.setAttribute('role', 'group')
  group.dataset.slot = 'select-group'
  group.setAttribute('class', ShadcnSelect.selectGroupClassName())

  const label = document.createElement('div')
  label.dataset.slot = 'select-label'
  label.setAttribute('class', ShadcnSelect.selectLabelClassName())
  label.append(document.createTextNode('Fruits'))
  group.append(label)

  const itemNodes = fruitItems.map(item => {
    const itemRoot = document.createElement('div')
    itemRoot.setAttribute('id', itemId(item.value))
    itemRoot.setAttribute('role', 'option')
    itemRoot.setAttribute(
      'tabindex',
      options.highlightedValue === item.value ? '0' : '-1',
    )
    itemRoot.setAttribute('aria-selected', String(options.value === item.value))
    itemRoot.dataset.slot = 'select-item'
    itemRoot.setAttribute(
      'class',
      ShadcnSelect.selectItemClassName({ dir: options.dir }),
    )

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
    text.dataset.slot = 'select-item-text'
    text.setAttribute('class', ShadcnSelect.selectItemTextClassName())

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
    indicator.dataset.slot = 'select-item-indicator'
    indicator.setAttribute(
      'class',
      ShadcnSelect.selectItemIndicatorClassName({ dir: options.dir }),
    )

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
  separator.dataset.slot = 'select-separator'
  separator.setAttribute('class', ShadcnSelect.selectSeparatorClassName())

  const scrollDown = document.createElement('div')
  scrollDown.setAttribute('id', 'profile-select-scroll-down')
  appendPositionedPartAttributes(scrollDown, options)
  scrollDown.dataset.slot = 'select-scroll-down-button'
  scrollDown.setAttribute('class', ShadcnSelect.selectScrollDownClassName())
  scrollDown.append(document.createTextNode('Down'))

  if (!options.open) {
    scrollDown.setAttribute('hidden', '')
  }

  popup.append(scrollUp, list, separator, scrollDown)
  positioner.append(popup)
  portal.append(backdrop, positioner)
}

const selectRoot = (
  options: Readonly<{
    open: boolean
    align?: string
    dir?: string
    disabled?: boolean
    forceMount?: boolean
    highlightedValue?: string
    keyboard?: FixtureSnapshot['keyboardBehavior']
    side?: string
    triggerClassName?: string
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
  root.dataset.slot = 'select'

  if (options.dir !== undefined) {
    root.setAttribute('dir', options.dir)
  }

  if (options.disabled === true) {
    root.dataset.disabled = ''
  }

  const trigger = document.createElement('button')
  trigger.setAttribute('id', 'profile-select-trigger')
  trigger.setAttribute('type', 'button')
  trigger.setAttribute('aria-haspopup', 'listbox')
  trigger.setAttribute('aria-expanded', String(options.open))
  trigger.setAttribute('aria-controls', 'profile-select-popup')
  trigger.setAttribute('aria-labelledby', 'profile-select-value')
  trigger.dataset.size = 'default'
  trigger.dataset.slot = 'select-trigger'
  trigger.setAttribute(
    'class',
    ShadcnSelect.selectTriggerClassName({
      className: options.triggerClassName,
      dir: options.dir,
    }),
  )

  if (options.dir !== undefined) {
    trigger.setAttribute('dir', options.dir)
  }

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
  value.setAttribute('id', 'profile-select-value')
  value.dataset.slot = 'select-value'
  value.setAttribute(
    'class',
    ShadcnSelect.selectValueClassName({ dir: options.dir }),
  )

  if (selectedItem === undefined) {
    value.dataset.placeholder = ''
  }

  value.append(document.createTextNode(displayValue))

  const icon = document.createElement('span')
  icon.setAttribute('id', 'profile-select-icon')
  icon.setAttribute('aria-hidden', 'true')
  icon.dataset.slot = 'select-icon'
  icon.setAttribute('class', ShadcnSelect.selectIconClassName())

  if (options.open) {
    icon.dataset.popupOpen = ''
  }

  icon.append(document.createTextNode('v'))
  trigger.append(value, icon)
  root.append(trigger)

  const portal = document.createElement('div')
  portal.dataset.portal = ''
  appendPopupParts(portal, {
    ...options,
    align,
    side,
  })
  root.append(portal)

  document.body.append(root)
  const snapshot = snapshotElement(root, options.keyboard ?? enabledKeyboard)
  root.remove()

  return snapshot
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'select-basic',
    snapshot: selectRoot({ open: true, highlightedValue: 'banana' }),
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
    id: 'select-rtl',
    snapshot: selectRoot({
      open: true,
      dir: 'rtl',
      side: 'inline-start',
      triggerClassName: 'w-32',
    }),
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
