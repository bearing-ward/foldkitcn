import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotElement } from '../../dom'

const baseKeyboard = {
  click: 'activates',
  Enter: 'activates',
  Space: 'activates',
  ArrowRight: 'focuses',
  ArrowLeft: 'focuses',
  Home: 'focuses',
  End: 'focuses',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const verticalKeyboard = {
  click: 'activates',
  Enter: 'activates',
  Space: 'activates',
  ArrowDown: 'focuses',
  ArrowUp: 'focuses',
  Home: 'focuses',
  End: 'focuses',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

type ItemDefinition = Readonly<{
  id: string
  isDisabled?: boolean
  label: string
  value: string
}>

const itemDefinitions: ReadonlyArray<ItemDefinition> = [
  { id: 'align-left', value: 'left', label: 'Left' },
  { id: 'align-center', value: 'center', label: 'Center' },
  { id: 'align-right', value: 'right', label: 'Right' },
]

const rootAttributes = (
  orientation: 'horizontal' | 'vertical',
  multiple: boolean,
): Readonly<Record<string, string>> => ({
  role: 'group',
  'data-orientation': orientation,
  ...(multiple ? { 'data-multiple': '' } : {}),
})

const itemAttributes = (
  item: ItemDefinition,
  value: ReadonlyArray<string>,
  orientation: 'horizontal' | 'vertical',
  tabindex: string,
): Readonly<Record<string, string>> => {
  const isPressed = value.includes(item.value)

  return {
    type: 'button',
    tabindex,
    id: item.id,
    'aria-pressed': String(isPressed),
    'data-state': isPressed ? 'on' : 'off',
    ...(isPressed ? { 'data-pressed': '' } : {}),
    ...(item.isDisabled === true
      ? { 'aria-disabled': 'true', 'data-disabled': '' }
      : {}),
    'data-orientation': orientation,
  }
}

const appendAttributes = (
  element: HTMLElement,
  attributes: Readonly<Record<string, string>>,
): HTMLElement => {
  Object.entries(attributes).map(([name, value]) =>
    element.setAttribute(name, value),
  )

  return element
}

const toggleGroupRoot = (
  config: Readonly<{
    items?: ReadonlyArray<ItemDefinition>
    keyboard?: FixtureSnapshot['keyboardBehavior']
    multiple?: boolean
    orientation?: 'horizontal' | 'vertical'
    value?: ReadonlyArray<string>
  }> = {},
): FixtureSnapshot => {
  const items = config.items ?? itemDefinitions
  const value = config.value ?? ['center']
  const orientation = config.orientation ?? 'horizontal'
  const multiple = config.multiple ?? false
  const root = appendAttributes(
    document.createElement('div'),
    rootAttributes(orientation, multiple),
  )
  const tabbableValue =
    items.find(item => value.includes(item.value) && item.isDisabled !== true)
      ?.value ?? items.find(item => item.isDisabled !== true)?.value

  items.map(item => {
    const button = appendAttributes(
      document.createElement('button'),
      itemAttributes(
        item,
        value,
        orientation,
        tabbableValue === item.value && item.isDisabled !== true ? '0' : '-1',
      ),
    )
    button.append(document.createTextNode(item.label))
    root.append(button)

    return item.value
  })

  document.body.append(root)
  const snapshot = snapshotElement(root, config.keyboard ?? baseKeyboard)
  root.remove()

  return snapshot
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'toggle-group-single',
    snapshot: toggleGroupRoot(),
  },
  {
    id: 'toggle-group-multiple',
    snapshot: toggleGroupRoot({
      multiple: true,
      value: ['left', 'center'],
    }),
  },
  {
    id: 'toggle-group-vertical-disabled',
    snapshot: toggleGroupRoot({
      orientation: 'vertical',
      value: ['left'],
      items: [
        { id: 'align-left', value: 'left', label: 'Left' },
        {
          id: 'align-center',
          value: 'center',
          label: 'Center',
          isDisabled: true,
        },
      ],
      keyboard: verticalKeyboard,
    }),
  },
]
