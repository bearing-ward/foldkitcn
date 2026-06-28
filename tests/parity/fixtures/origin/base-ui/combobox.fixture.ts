import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { nativeEnabledKeyboard, suppressedKeyboard } from '../../../fixture'
import { snapshotElement } from '../../dom'

type ComboboxItem = Readonly<{
  value: string
  label: string
  isDisabled?: boolean
  textValue?: string
}>

type CaseConfig = Readonly<{
  id: string
  open: boolean
  inputValue?: string
  value?: string
  values?: ReadonlyArray<string>
  highlightedValue?: string
  highlightedChipValue?: string
  selectionMode?: 'single' | 'multiple'
  placeholder?: string
  name?: string
  forceMount?: boolean
  anchorToChips?: boolean
  isDisabled?: boolean
  side?: string
  align?: string
  sideOffset?: number
  alignOffset?: number
}>

const fruitItems: ReadonlyArray<ComboboxItem> = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'grapes', label: 'Grapes', isDisabled: true },
  { value: 'pineapple', label: 'Pineapple' },
]

const setAttributes = <ElementType extends HTMLElement>(
  element: ElementType,
  attributes: Readonly<Record<string, string | undefined>>,
): ElementType =>
  Object.entries(attributes).reduce((currentElement, [name, value]) => {
    if (value !== undefined) {
      currentElement.setAttribute(name, value)
    }

    return currentElement
  }, element)

const element = <TagName extends keyof HTMLElementTagNameMap>(
  tagName: TagName,
  attributes: Readonly<Record<string, string | undefined>>,
  children: ReadonlyArray<Node | string> = [],
): HTMLElementTagNameMap[TagName] => {
  const node = setAttributes(document.createElement(tagName), attributes)
  node.append(...children)

  return node
}

const side = (config: CaseConfig): string => config.side ?? 'bottom'

const align = (config: CaseConfig): string => config.align ?? 'center'

const sideOffset = (config: CaseConfig): string =>
  String(config.sideOffset ?? 0)

const alignOffset = (config: CaseConfig): string =>
  String(config.alignOffset ?? 0)

const selectionMode = (config: CaseConfig): 'single' | 'multiple' =>
  config.selectionMode ?? 'single'

const isMultiple = (config: CaseConfig): boolean =>
  selectionMode(config) === 'multiple'

const inputValue = (config: CaseConfig): string => config.inputValue ?? ''

const enabledItems = (config: CaseConfig): ReadonlyArray<ComboboxItem> => {
  if (config.isDisabled === true) {
    return []
  }

  return fruitItems.filter(item => item.isDisabled !== true)
}

const selectedValues = (config: CaseConfig): ReadonlyArray<string> => {
  if (isMultiple(config)) {
    return config.values ?? []
  }

  if (config.value === undefined) {
    return []
  }

  return [config.value]
}

const selectedItem = (config: CaseConfig): ComboboxItem | undefined =>
  fruitItems.find(item => item.value === config.value)

const selectedItems = (config: CaseConfig): ReadonlyArray<ComboboxItem> => {
  const values = new Set(selectedValues(config))

  return fruitItems.filter(item => values.has(item.value))
}

const inputDisplayValue = (config: CaseConfig): string => {
  if (isMultiple(config)) {
    return inputValue(config)
  }

  if (inputValue(config) === '') {
    return selectedItem(config)?.label ?? ''
  }

  return inputValue(config)
}

const hasSelectedValue = (config: CaseConfig): boolean =>
  selectedValues(config).length > 0

const itemMatchesInput = (config: CaseConfig, item: ComboboxItem): boolean => {
  const query = inputValue(config).trim().toLocaleLowerCase()

  if (query === '') {
    return true
  }

  return (item.textValue ?? item.label).toLocaleLowerCase().includes(query)
}

const filteredItems = (config: CaseConfig): ReadonlyArray<ComboboxItem> =>
  enabledItems(config).filter(item => itemMatchesInput(config, item))

const isMounted = (config: CaseConfig): boolean =>
  config.open || config.forceMount === true

const isEmpty = (config: CaseConfig): boolean =>
  filteredItems(config).length === 0

const itemId = (
  config: CaseConfig,
  item: Pick<ComboboxItem, 'value'>,
): string => `${config.id}-item-${item.value}`

const chipId = (
  config: CaseConfig,
  item: Pick<ComboboxItem, 'value'>,
): string => `${config.id}-chip-${item.value}`

const chipRemoveId = (
  config: CaseConfig,
  item: Pick<ComboboxItem, 'value'>,
): string => `${chipId(config, item)}-remove`

const openStateAttributes = (
  config: CaseConfig,
): Readonly<Record<string, string | undefined>> => ({
  'data-open': config.open ? '' : undefined,
  'data-closed': config.open ? undefined : '',
})

const placementAttributes = (
  config: CaseConfig,
): Readonly<Record<string, string>> => ({
  'data-side': side(config),
  'data-align': align(config),
  'data-side-offset': sideOffset(config),
  'data-align-offset': alignOffset(config),
  'data-collision-avoidance': 'true',
  'data-collision-padding': '0',
})

const itemStateAttributes = (
  config: CaseConfig,
  item: ComboboxItem,
): Readonly<Record<string, string | undefined>> => {
  const selected = selectedValues(config).includes(item.value)
  const highlighted = config.highlightedValue === item.value

  return {
    'data-selected': selected ? '' : undefined,
    'data-highlighted': highlighted ? '' : undefined,
    'data-disabled': item.isDisabled === true ? '' : undefined,
  }
}

const inputAttributes = (
  config: CaseConfig,
): Readonly<Record<string, string | undefined>> => {
  const visibleItems = filteredItems(config)
  const displayedValue = inputDisplayValue(config)

  return {
    id: `${config.id}-input`,
    type: 'text',
    role: 'combobox',
    value: displayedValue,
    placeholder: config.placeholder,
    'aria-haspopup': 'listbox',
    'aria-expanded': String(config.open),
    'aria-controls': `${config.id}-list`,
    'aria-autocomplete': 'list',
    'aria-activedescendant':
      config.highlightedValue === undefined
        ? undefined
        : itemId(config, { value: config.highlightedValue }),
    disabled: config.isDisabled === true ? '' : undefined,
    'aria-disabled': config.isDisabled === true ? 'true' : undefined,
    'data-popup-open': config.open ? '' : undefined,
    'data-popup-side': config.open ? side(config) : '',
    'data-list-empty': visibleItems.length === 0 ? '' : undefined,
    'data-disabled': config.isDisabled === true ? '' : undefined,
    'data-filled': displayedValue === '' ? undefined : '',
  }
}

const triggerAttributes = (
  config: CaseConfig,
): Readonly<Record<string, string | undefined>> => {
  const visibleItems = filteredItems(config)

  return {
    id: `${config.id}-trigger`,
    type: 'button',
    'aria-haspopup': 'listbox',
    'aria-expanded': String(config.open),
    'aria-controls': `${config.id}-list`,
    'aria-disabled': config.isDisabled === true ? 'true' : undefined,
    'data-popup-open': config.open ? '' : undefined,
    'data-popup-side': config.open ? side(config) : '',
    'data-list-empty': visibleItems.length === 0 ? '' : undefined,
    'data-placeholder': hasSelectedValue(config) ? undefined : '',
    'data-disabled': config.isDisabled === true ? '' : undefined,
  }
}

const clearAttributes = (
  config: CaseConfig,
): Readonly<Record<string, string | undefined>> => ({
  id: `${config.id}-clear`,
  type: 'button',
  tabindex: '-1',
  'aria-disabled': config.isDisabled === true ? 'true' : undefined,
  'data-popup-open': config.open ? '' : undefined,
  'data-visible':
    hasSelectedValue(config) || inputValue(config) !== '' ? '' : undefined,
  'data-disabled': config.isDisabled === true ? '' : undefined,
})

const optionElement = (config: CaseConfig, item: ComboboxItem): HTMLElement => {
  const selected = selectedValues(config).includes(item.value)
  const highlighted = config.highlightedValue === item.value
  const stateAttributes = itemStateAttributes(config, item)
  const indicatorAttributes = selected ? stateAttributes : {}

  return element(
    'div',
    {
      id: itemId(config, item),
      role: 'option',
      tabindex: highlighted ? '0' : '-1',
      'aria-selected': String(selected),
      'aria-disabled': item.isDisabled === true ? 'true' : undefined,
      ...stateAttributes,
    },
    [
      element('span', stateAttributes, [item.label]),
      element('span', indicatorAttributes),
    ],
  )
}

const listElement = (config: CaseConfig): HTMLElement =>
  element(
    'div',
    {
      id: `${config.id}-list`,
      role: 'listbox',
      tabindex: '-1',
      'aria-multiselectable': isMultiple(config) ? 'true' : undefined,
      'data-empty': isEmpty(config) ? '' : undefined,
    },
    [
      element('div', { role: 'group' }, [
        element('div', {}, ['Fruits']),
        ...filteredItems(config).map(item => optionElement(config, item)),
      ]),
    ],
  )

const chipElement = (config: CaseConfig, item: ComboboxItem): HTMLElement =>
  element(
    'div',
    {
      id: chipId(config, item),
      tabindex: config.highlightedChipValue === item.value ? '0' : '-1',
      'aria-disabled': config.isDisabled === true ? 'true' : undefined,
      'data-disabled': config.isDisabled === true ? '' : undefined,
      'data-highlighted':
        config.highlightedChipValue === item.value ? '' : undefined,
    },
    [
      item.label,
      element(
        'button',
        {
          id: chipRemoveId(config, item),
          type: 'button',
          tabindex: '-1',
          'aria-disabled': config.isDisabled === true ? 'true' : undefined,
          'data-disabled': config.isDisabled === true ? '' : undefined,
        },
        ['x'],
      ),
    ],
  )

const chipsElement = (config: CaseConfig): HTMLElement =>
  element(
    'div',
    {
      id: `${config.id}-chips`,
      role: selectedItems(config).length > 0 ? 'toolbar' : undefined,
      'data-disabled': config.isDisabled === true ? '' : undefined,
    },
    selectedItems(config).map(item => chipElement(config, item)),
  )

const hiddenInputs = (config: CaseConfig): ReadonlyArray<HTMLInputElement> => {
  if (config.name === undefined) {
    return []
  }

  const values = isMultiple(config)
    ? selectedValues(config)
    : [config.value ?? '']

  return values.map(value =>
    element('input', {
      type: 'hidden',
      name: config.name,
      value,
      disabled: config.isDisabled === true ? '' : undefined,
    }),
  )
}

const portalContent = (config: CaseConfig): ReadonlyArray<HTMLElement> => {
  if (!isMounted(config)) {
    return []
  }

  return [
    element('div', {
      role: 'presentation',
      hidden: config.open ? undefined : '',
      ...openStateAttributes(config),
    }),
    element(
      'div',
      {
        id: `${config.id}-positioner`,
        hidden: config.open ? undefined : '',
        ...openStateAttributes(config),
        ...placementAttributes(config),
        'data-empty': isEmpty(config) ? '' : undefined,
      },
      [
        element(
          'div',
          {
            id: `${config.id}-popup`,
            popover: 'manual',
            role: 'presentation',
            tabindex: '-1',
            hidden: config.open ? undefined : '',
            ...openStateAttributes(config),
            ...placementAttributes(config),
            'data-empty': isEmpty(config) ? '' : undefined,
            'data-chips': config.anchorToChips === true ? '' : undefined,
          },
          [
            element('div', {
              id: `${config.id}-arrow`,
              'aria-hidden': 'true',
              ...openStateAttributes(config),
              ...placementAttributes(config),
            }),
            element(
              'div',
              {
                id: `${config.id}-empty`,
                role: 'status',
                'aria-live': 'polite',
                'aria-atomic': 'true',
              },
              isEmpty(config) ? ['No fruit found.'] : [],
            ),
            listElement(config),
            element('div', {
              role: 'separator',
              'aria-orientation': 'horizontal',
            }),
          ],
        ),
      ],
    ),
  ]
}

const rootElement = (config: CaseConfig): HTMLElement =>
  element(
    'div',
    {
      id: config.id,
      'data-side': side(config),
      'data-align': align(config),
      'data-selection-mode': selectionMode(config),
      'data-disabled': config.isDisabled === true ? '' : undefined,
    },
    [
      element(
        'div',
        {
          id: `${config.id}-input-group`,
          role: 'group',
          'data-popup-open': config.open ? '' : undefined,
          'data-disabled': config.isDisabled === true ? '' : undefined,
        },
        [
          element('input', inputAttributes(config)),
          element('button', triggerAttributes(config), ['v']),
          element('button', clearAttributes(config), ['x']),
        ],
      ),
      chipsElement(config),
      element('div', { 'data-portal': '' }, portalContent(config)),
      ...hiddenInputs(config),
    ],
  )

const snapshot = (
  config: CaseConfig,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = nativeEnabledKeyboard,
): FixtureSnapshot => {
  const root = rootElement({
    placeholder: 'Select a fruit',
    name: 'fruit',
    ...config,
  })

  document.body.append(root)
  const result = snapshotElement(root, keyboardBehavior)
  root.remove()

  return result
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'combobox-open',
    snapshot: snapshot({
      id: 'fruit-combobox',
      open: true,
      highlightedValue: 'banana',
      side: 'top',
      align: 'end',
      sideOffset: 4,
    }),
  },
  {
    id: 'combobox-filtered',
    snapshot: snapshot({
      id: 'fruit-combobox',
      open: true,
      inputValue: 'blue',
    }),
  },
  {
    id: 'combobox-empty',
    snapshot: snapshot({
      id: 'fruit-combobox',
      open: true,
      inputValue: 'zz',
    }),
  },
  {
    id: 'combobox-selected',
    snapshot: snapshot({
      id: 'fruit-combobox',
      open: true,
      value: 'banana',
      highlightedValue: 'banana',
    }),
  },
  {
    id: 'combobox-multiple',
    snapshot: snapshot({
      id: 'fruit-combobox',
      open: true,
      selectionMode: 'multiple',
      values: ['apple', 'banana'],
      highlightedChipValue: 'banana',
      anchorToChips: true,
    }),
  },
  {
    id: 'combobox-disabled',
    snapshot: snapshot(
      {
        id: 'fruit-combobox',
        open: false,
        isDisabled: true,
        forceMount: true,
      },
      suppressedKeyboard,
    ),
  },
]
