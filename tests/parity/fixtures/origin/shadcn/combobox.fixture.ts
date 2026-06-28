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
  forceMount?: boolean
  anchorToChips?: boolean
  isDisabled?: boolean
  dir?: 'rtl'
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
]

const inputGroupClassName =
  'group/input-group relative flex h-8 min-w-0 items-center rounded-lg border border-input transition-colors outline-none in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 has-disabled:bg-input/50 has-disabled:opacity-50 has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto dark:bg-input/30 dark:has-disabled:bg-input/80 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5 w-auto'
const inputClassName =
  'h-8 w-full min-w-0 border-input px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent'
const triggerClassName =
  "group/button shrink-0 justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 in-data-[slot=button-group]:rounded-lg flex items-center gap-2 text-sm shadow-none size-6 rounded-[calc(var(--radius)-3px)] p-0 has-[>svg]:p-0 group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent [&_svg:not([class*='size-'])]:size-4"
const clearClassName =
  "group/button shrink-0 justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3 flex items-center gap-2 text-sm shadow-none size-6 rounded-[calc(var(--radius)-3px)] p-0 has-[>svg]:p-0"
const contentClassName =
  'cn-menu-target cn-menu-translucent group/combobox-content relative max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+--spacing(7))] origin-(--transform-origin) overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[chips=true]:min-w-(--anchor-width) data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:border-input/30 *:data-[slot=input-group]:bg-input/30 *:data-[slot=input-group]:shadow-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95'
const contentRtlClassName =
  'cn-menu-target cn-menu-translucent group/combobox-content relative max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+--spacing(7))] origin-(--transform-origin) overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[chips=true]:min-w-(--anchor-width) data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:border-input/30 *:data-[slot=input-group]:bg-input/30 *:data-[slot=input-group]:shadow-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95'
const listClassName =
  'no-scrollbar max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0'
const itemClassName =
  "relative flex w-full cursor-default items-center gap-2 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
const itemRtlClassName =
  "relative flex w-full cursor-default items-center gap-2 rounded-md py-1 ps-1.5 pe-8 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
const itemTextClassName = 'flex flex-1 min-w-0'
const itemIndicatorClassName =
  'pointer-events-none absolute right-2 flex size-4 items-center justify-center'
const itemIndicatorRtlClassName =
  'pointer-events-none absolute end-2 flex size-4 items-center justify-center'
const labelClassName = 'px-2 py-1.5 text-xs text-muted-foreground'
const emptyClassName =
  'hidden w-full justify-center py-2 text-center text-sm text-muted-foreground group-data-empty/combobox-content:flex'
const separatorClassName = '-mx-1 my-1 h-px bg-border'
const chipsClassName =
  'flex min-h-8 flex-wrap items-center gap-1 rounded-lg border border-input bg-transparent bg-clip-padding px-2.5 py-1 text-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 has-data-[slot=combobox-chip]:px-1 dark:bg-input/30 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40'
const chipClassName =
  'flex h-[calc(--spacing(5.25))] w-fit items-center justify-center gap-1 rounded-sm bg-muted px-1.5 text-xs font-medium whitespace-nowrap text-foreground has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 has-data-[slot=combobox-chip-remove]:pr-0'
const chipRtlClassName =
  'flex h-[calc(--spacing(5.25))] w-fit items-center justify-center gap-1 rounded-sm bg-muted px-1.5 text-xs font-medium whitespace-nowrap text-foreground has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 has-data-[slot=combobox-chip-remove]:pe-0'
const chipRemoveClassName =
  "group/button shrink-0 justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3 flex items-center gap-2 text-sm shadow-none size-6 rounded-[calc(var(--radius)-3px)] p-0 has-[>svg]:p-0 -ml-1 opacity-50 hover:opacity-100"
const chipRemoveRtlClassName =
  "group/button shrink-0 justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3 flex items-center gap-2 text-sm shadow-none size-6 rounded-[calc(var(--radius)-3px)] p-0 has-[>svg]:p-0 -ms-1 opacity-50 hover:opacity-100"

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

const align = (config: CaseConfig): string => config.align ?? 'start'

const sideOffset = (config: CaseConfig): string =>
  String(config.sideOffset ?? 6)

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
    'data-slot': 'input-group-control',
    class: inputClassName,
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
    'data-slot': 'combobox-trigger',
    class: triggerClassName,
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
  'data-slot': 'combobox-clear',
  class: clearClassName,
})

const optionElement = (config: CaseConfig, item: ComboboxItem): HTMLElement => {
  const { dir } = config
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
      'data-slot': 'combobox-item',
      class: dir === 'rtl' ? itemRtlClassName : itemClassName,
      ...stateAttributes,
    },
    [
      element(
        'span',
        {
          'data-slot': 'combobox-item-text',
          class: itemTextClassName,
          ...stateAttributes,
        },
        [item.label],
      ),
      element('span', {
        class:
          dir === 'rtl' ? itemIndicatorRtlClassName : itemIndicatorClassName,
        ...indicatorAttributes,
      }),
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
      'data-slot': 'combobox-list',
      class: listClassName,
    },
    [
      element('div', { role: 'group', 'data-slot': 'combobox-group' }, [
        element(
          'div',
          { 'data-slot': 'combobox-label', class: labelClassName },
          ['Fruits'],
        ),
        ...filteredItems(config).map(item => optionElement(config, item)),
      ]),
    ],
  )

const chipElement = (config: CaseConfig, item: ComboboxItem): HTMLElement => {
  const { dir } = config

  return element(
    'div',
    {
      id: chipId(config, item),
      tabindex: config.highlightedChipValue === item.value ? '0' : '-1',
      'aria-disabled': config.isDisabled === true ? 'true' : undefined,
      'data-disabled': config.isDisabled === true ? '' : undefined,
      'data-highlighted':
        config.highlightedChipValue === item.value ? '' : undefined,
      'data-slot': 'combobox-chip',
      class: dir === 'rtl' ? chipRtlClassName : chipClassName,
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
          'data-slot': 'combobox-chip-remove',
          class: dir === 'rtl' ? chipRemoveRtlClassName : chipRemoveClassName,
        },
        ['x'],
      ),
    ],
  )
}

const chipsElement = (config: CaseConfig): HTMLElement =>
  element(
    'div',
    {
      id: `${config.id}-chips`,
      role: selectedItems(config).length > 0 ? 'toolbar' : undefined,
      'data-disabled': config.isDisabled === true ? '' : undefined,
      'data-slot': 'combobox-chips',
      class: chipsClassName,
    },
    selectedItems(config).map(item => chipElement(config, item)),
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
        class: 'isolate z-50',
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
            dir: config.dir,
            'data-slot': 'combobox-content',
            'data-chips': String(config.anchorToChips === true),
            class:
              config.dir === 'rtl' ? contentRtlClassName : contentClassName,
            ...openStateAttributes(config),
            ...placementAttributes(config),
            'data-empty': isEmpty(config) ? '' : undefined,
          },
          [
            element('div', {
              id: `${config.id}-empty`,
              role: 'status',
              'aria-live': 'polite',
              'aria-atomic': 'true',
              'data-slot': 'combobox-empty',
              class: emptyClassName,
            }),
            listElement(config),
            element('div', {
              role: 'separator',
              'aria-orientation': 'horizontal',
              'data-slot': 'combobox-separator',
              class: separatorClassName,
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
      dir: config.dir,
      'data-side': side(config),
      'data-align': align(config),
      'data-selection-mode': selectionMode(config),
      'data-disabled': config.isDisabled === true ? '' : undefined,
      'data-slot': 'combobox',
    },
    [
      element(
        'div',
        {
          id: `${config.id}-input-group`,
          role: 'group',
          'data-popup-open': config.open ? '' : undefined,
          'data-disabled': config.isDisabled === true ? '' : undefined,
          'data-slot': 'input-group',
          class: inputGroupClassName,
        },
        [
          element('input', inputAttributes(config)),
          element('button', triggerAttributes(config), ['v']),
          element('button', clearAttributes(config), ['x']),
        ],
      ),
      chipsElement(config),
      element('div', { 'data-portal': '' }, portalContent(config)),
    ],
  )

const snapshot = (
  config: CaseConfig,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = nativeEnabledKeyboard,
): FixtureSnapshot => {
  const root = rootElement({
    placeholder: 'Select a fruit',
    ...config,
  })

  document.body.append(root)
  const result = snapshotElement(root, keyboardBehavior)
  root.remove()

  return result
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'combobox-basic',
    snapshot: snapshot({
      id: 'profile-combobox',
      open: true,
      highlightedValue: 'banana',
    }),
  },
  {
    id: 'combobox-filtered',
    snapshot: snapshot({
      id: 'profile-combobox',
      open: true,
      inputValue: 'blue',
    }),
  },
  {
    id: 'combobox-selected',
    snapshot: snapshot({
      id: 'profile-combobox',
      open: true,
      value: 'banana',
      highlightedValue: 'banana',
    }),
  },
  {
    id: 'combobox-multiple',
    snapshot: snapshot({
      id: 'profile-combobox',
      open: true,
      selectionMode: 'multiple',
      values: ['apple', 'banana'],
      highlightedChipValue: 'banana',
      anchorToChips: true,
    }),
  },
  {
    id: 'combobox-rtl',
    snapshot: snapshot({
      id: 'profile-combobox',
      open: true,
      dir: 'rtl',
      side: 'inline-start',
      selectionMode: 'multiple',
      values: ['apple'],
      anchorToChips: true,
    }),
  },
  {
    id: 'combobox-disabled',
    snapshot: snapshot(
      {
        id: 'profile-combobox',
        open: false,
        isDisabled: true,
        forceMount: true,
      },
      suppressedKeyboard,
    ),
  },
]
