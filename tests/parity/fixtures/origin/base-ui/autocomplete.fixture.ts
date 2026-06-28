import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { nativeEnabledKeyboard, suppressedKeyboard } from '../../../fixture'
import { snapshotElement } from '../../dom'

type AutocompleteItem = Readonly<{
  value: string
  label: string
  isDisabled?: boolean
  textValue?: string
}>

type AutocompleteMode = 'list' | 'both' | 'inline' | 'none'

type CaseConfig = Readonly<{
  id: string
  open: boolean
  value?: string
  highlightedValue?: string
  placeholder?: string
  name?: string
  form?: string
  forceMount?: boolean
  isDisabled?: boolean
  isInvalid?: boolean
  isRequired?: boolean
  isReadOnly?: boolean
  mode?: AutocompleteMode
  side?: string
  align?: string
  sideOffset?: number
  alignOffset?: number
}>

const fruitItems: ReadonlyArray<AutocompleteItem> = [
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

const mode = (config: CaseConfig): AutocompleteMode => config.mode ?? 'list'

const value = (config: CaseConfig): string => config.value ?? ''

const filtersItems = (config: CaseConfig): boolean =>
  mode(config) === 'list' || mode(config) === 'both'

const completesInline = (config: CaseConfig): boolean =>
  mode(config) === 'inline' || mode(config) === 'both'

const enabledItems = (config: CaseConfig): ReadonlyArray<AutocompleteItem> => {
  if (config.isDisabled === true) {
    return []
  }

  return fruitItems.filter(item => item.isDisabled !== true)
}

const itemMatchesInput = (
  config: CaseConfig,
  item: AutocompleteItem,
): boolean => {
  if (!filtersItems(config)) {
    return true
  }

  const query = value(config).trim().toLocaleLowerCase()

  if (query === '') {
    return true
  }

  return (item.textValue ?? item.label).toLocaleLowerCase().includes(query)
}

const filteredItems = (config: CaseConfig): ReadonlyArray<AutocompleteItem> =>
  enabledItems(config).filter(item => itemMatchesInput(config, item))

const highlightedItem = (config: CaseConfig): AutocompleteItem | undefined =>
  fruitItems.find(item => item.value === config.highlightedValue)

const displayValue = (config: CaseConfig): string => {
  if (!completesInline(config)) {
    return value(config)
  }

  return highlightedItem(config)?.label ?? value(config)
}

const isMounted = (config: CaseConfig): boolean =>
  config.open || config.forceMount === true

const isEmpty = (config: CaseConfig): boolean =>
  filteredItems(config).length === 0

const itemId = (
  config: CaseConfig,
  item: Pick<AutocompleteItem, 'value'>,
): string => `${config.id}-item-${item.value}`

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
  item: AutocompleteItem,
): Readonly<Record<string, string | undefined>> => ({
  'data-highlighted': config.highlightedValue === item.value ? '' : undefined,
  'data-disabled': item.isDisabled === true ? '' : undefined,
})

const inputAttributes = (
  config: CaseConfig,
): Readonly<Record<string, string | undefined>> => {
  const visibleItems = filteredItems(config)
  const displayedValue = displayValue(config)

  return {
    id: `${config.id}-input`,
    type: 'text',
    role: 'combobox',
    value: displayedValue,
    name: config.name,
    form: config.form,
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
    readonly: config.isReadOnly === true ? '' : undefined,
    required: config.isRequired === true ? '' : undefined,
    'aria-invalid': config.isInvalid === true ? 'true' : undefined,
    'aria-disabled': config.isDisabled === true ? 'true' : undefined,
    'aria-readonly': config.isReadOnly === true ? 'true' : undefined,
    'aria-required': config.isRequired === true ? 'true' : undefined,
    'data-popup-open': config.open ? '' : undefined,
    'data-popup-side': config.open ? side(config) : '',
    'data-list-empty': visibleItems.length === 0 ? '' : undefined,
    'data-disabled': config.isDisabled === true ? '' : undefined,
    'data-readonly': config.isReadOnly === true ? '' : undefined,
    'data-required': config.isRequired === true ? '' : undefined,
    'data-invalid': config.isInvalid === true ? '' : undefined,
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
    'aria-readonly': config.isReadOnly === true ? 'true' : undefined,
    'data-popup-open': config.open ? '' : undefined,
    'data-popup-side': config.open ? side(config) : '',
    'data-list-empty': visibleItems.length === 0 ? '' : undefined,
    'data-disabled': config.isDisabled === true ? '' : undefined,
    'data-readonly': config.isReadOnly === true ? '' : undefined,
    'data-filled': value(config) === '' ? undefined : '',
    'data-required': config.isRequired === true ? '' : undefined,
    'data-invalid': config.isInvalid === true ? '' : undefined,
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
  'data-visible': value(config) === '' ? undefined : '',
  'data-disabled': config.isDisabled === true ? '' : undefined,
})

const optionElement = (
  config: CaseConfig,
  item: AutocompleteItem,
): HTMLElement => {
  const highlighted = config.highlightedValue === item.value
  const stateAttributes = itemStateAttributes(config, item)

  return element(
    'div',
    {
      id: itemId(config, item),
      role: 'option',
      tabindex: highlighted ? '0' : '-1',
      'aria-selected': 'false',
      'aria-disabled': item.isDisabled === true ? 'true' : undefined,
      ...stateAttributes,
    },
    [element('span', stateAttributes, [item.label])],
  )
}

const listElement = (config: CaseConfig): HTMLElement =>
  element(
    'div',
    {
      id: `${config.id}-list`,
      role: 'listbox',
      tabindex: '-1',
      'data-empty': isEmpty(config) ? '' : undefined,
    },
    [
      element('div', { role: 'group' }, [
        element('div', {}, ['Fruits']),
        ...filteredItems(config).map(item => optionElement(config, item)),
      ]),
    ],
  )

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
      'data-selection-mode': 'single',
      'data-disabled': config.isDisabled === true ? '' : undefined,
      'data-readonly': config.isReadOnly === true ? '' : undefined,
      'data-required': config.isRequired === true ? '' : undefined,
      'data-invalid': config.isInvalid === true ? '' : undefined,
    },
    [
      element(
        'div',
        {
          id: `${config.id}-input-group`,
          role: 'group',
          'data-popup-open': config.open ? '' : undefined,
          'data-popup-side': config.open ? side(config) : '',
          'data-list-empty': isEmpty(config) ? '' : undefined,
          'data-disabled': config.isDisabled === true ? '' : undefined,
          'data-readonly': config.isReadOnly === true ? '' : undefined,
          'data-invalid': config.isInvalid === true ? '' : undefined,
        },
        [
          element('input', inputAttributes(config)),
          element('button', triggerAttributes(config), ['v']),
          element('button', clearAttributes(config), ['x']),
        ],
      ),
      element(
        'div',
        {
          id: `${config.id}-value`,
          'data-placeholder': '',
        },
        [value(config)],
      ),
      element('div', { 'data-portal': '' }, portalContent(config)),
    ],
  )

const snapshot = (
  config: CaseConfig,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = nativeEnabledKeyboard,
): FixtureSnapshot => {
  const root = rootElement({
    placeholder: 'Search fruit',
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
    id: 'autocomplete-open',
    snapshot: snapshot({
      id: 'fruit-autocomplete',
      open: true,
      highlightedValue: 'banana',
      side: 'top',
      align: 'end',
      sideOffset: 4,
    }),
  },
  {
    id: 'autocomplete-filtered',
    snapshot: snapshot({
      id: 'fruit-autocomplete',
      open: true,
      value: 'blue',
    }),
  },
  {
    id: 'autocomplete-empty',
    snapshot: snapshot({
      id: 'fruit-autocomplete',
      open: true,
      value: 'zz',
    }),
  },
  {
    id: 'autocomplete-selected',
    snapshot: snapshot({
      id: 'fruit-autocomplete',
      open: true,
      value: 'Banana',
      highlightedValue: 'banana',
    }),
  },
  {
    id: 'autocomplete-inline',
    snapshot: snapshot({
      id: 'fruit-autocomplete',
      open: true,
      value: 'ap',
      mode: 'inline',
      highlightedValue: 'apple',
    }),
  },
  {
    id: 'autocomplete-disabled',
    snapshot: snapshot(
      {
        id: 'fruit-autocomplete',
        open: false,
        isDisabled: true,
        forceMount: true,
      },
      suppressedKeyboard,
    ),
  },
]
