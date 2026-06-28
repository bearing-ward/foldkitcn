import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotElement } from '../../dom'

const horizontalKeyboard = {
  click: 'activates',
  Enter: 'activates',
  Space: 'activates',
  ArrowRight: 'focuses',
  ArrowLeft: 'focuses',
  ArrowDown: 'opens',
  ArrowUp: 'opens',
  Home: 'focuses',
  End: 'focuses',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const verticalKeyboard = {
  click: 'activates',
  Enter: 'activates',
  Space: 'activates',
  ArrowRight: 'opens',
  ArrowLeft: 'opens',
  ArrowDown: 'focuses',
  ArrowUp: 'focuses',
  Home: 'focuses',
  End: 'focuses',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const suppressedKeyboard = {
  click: 'suppressed',
  Enter: 'suppressed',
  Space: 'suppressed',
  ArrowRight: 'suppressed',
  ArrowLeft: 'suppressed',
  ArrowDown: 'suppressed',
  ArrowUp: 'suppressed',
  Home: 'suppressed',
  End: 'suppressed',
  mousedown: 'suppressed',
  pointerdown: 'suppressed',
}

type ItemDefinition = Readonly<{
  value: string
  label: string
  kind?: 'item' | 'checkbox' | 'radio' | 'submenu-trigger'
  parentValue?: string
  checked?: boolean
  highlighted?: boolean
  submenuOpen?: boolean
}>

type MenuDefinition = Readonly<{
  value: string
  label: string
  open: boolean
  items: ReadonlyArray<ItemDefinition>
}>

type MenubarConfig = Readonly<{
  disabled?: boolean
  keyboard?: FixtureSnapshot['keyboardBehavior']
  menus: ReadonlyArray<MenuDefinition>
  orientation?: 'horizontal' | 'vertical'
}>

const placementAttributes = (
  parentValue?: string,
): Readonly<Record<string, string>> => ({
  'data-side': parentValue === undefined ? 'bottom' : 'right',
  'data-align': 'start',
  'data-side-offset': parentValue === undefined ? '4' : '0',
  'data-align-offset': parentValue === undefined ? '0' : '-3',
  'data-collision-avoidance': 'true',
  'data-collision-padding': '0',
})

const appendAttributes = (
  element: HTMLElement,
  attributes: Readonly<Record<string, string>>,
): HTMLElement => {
  Object.entries(attributes).map(([name, value]) =>
    element.setAttribute(name, value),
  )

  return element
}

const itemRole = (item: ItemDefinition): string => {
  if (item.kind === 'checkbox') {
    return 'menuitemcheckbox'
  }

  if (item.kind === 'radio') {
    return 'menuitemradio'
  }

  return 'menuitem'
}

const itemId = (menuValue: string, item: ItemDefinition): string =>
  `app-menubar-${menuValue}-item-${item.value}`

const popupId = (menuValue: string, parentValue?: string): string =>
  parentValue === undefined
    ? `app-menubar-${menuValue}-popup`
    : `app-menubar-${menuValue}-submenu-${parentValue}-popup`

const positionerId = (menuValue: string, parentValue?: string): string =>
  parentValue === undefined
    ? `app-menubar-${menuValue}-positioner`
    : `app-menubar-${menuValue}-submenu-${parentValue}-positioner`

const appendItem = (
  group: HTMLElement,
  menu: MenuDefinition,
  item: ItemDefinition,
): void => {
  const stateAttributes = {
    ...(item.highlighted === true ? { 'data-highlighted': '' } : {}),
    ...(item.kind === 'checkbox' || item.kind === 'radio'
      ? {
          [item.checked === true ? 'data-checked' : 'data-unchecked']: '',
        }
      : {}),
    ...(item.kind === 'submenu-trigger' && item.submenuOpen === true
      ? { 'data-popup-open': '', 'data-open': '' }
      : {}),
  }
  const root = appendAttributes(document.createElement('div'), {
    id: itemId(menu.value, item),
    role: itemRole(item),
    tabindex: item.highlighted === true ? '0' : '-1',
    ...(item.kind === 'checkbox' || item.kind === 'radio'
      ? {
          'aria-checked': item.checked === true ? 'true' : 'false',
        }
      : {}),
    ...(item.kind === 'submenu-trigger'
      ? {
          'aria-haspopup': 'menu',
          'aria-expanded': item.submenuOpen === true ? 'true' : 'false',
          'aria-controls': popupId(menu.value, item.value),
        }
      : {}),
    ...stateAttributes,
  })
  const label = appendAttributes(
    document.createElement('span'),
    stateAttributes,
  )
  label.append(document.createTextNode(item.label))
  const indicator = appendAttributes(
    document.createElement('span'),
    item.kind === 'checkbox' || item.kind === 'radio' ? stateAttributes : {},
  )
  const submenuIndicator = appendAttributes(
    document.createElement('span'),
    item.kind === 'submenu-trigger' ? stateAttributes : {},
  )
  submenuIndicator.append(document.createTextNode('>'))

  root.append(label, indicator, submenuIndicator)
  group.append(root)
}

const appendPopup = (
  portal: HTMLElement,
  menu: MenuDefinition,
  parentValue?: string,
  open = true,
): void => {
  const items = menu.items.filter(item => item.parentValue === parentValue)

  const backdrop = appendAttributes(document.createElement('div'), {
    role: 'presentation',
    [open ? 'data-open' : 'data-closed']: '',
    ...(open ? {} : { hidden: '' }),
  })
  const positioner = appendAttributes(document.createElement('div'), {
    id: positionerId(menu.value, parentValue),
    [open ? 'data-open' : 'data-closed']: '',
    ...(open ? {} : { hidden: '' }),
    ...placementAttributes(parentValue),
  })
  const popup = appendAttributes(document.createElement('div'), {
    id: popupId(menu.value, parentValue),
    popover: 'manual',
    role: 'menu',
    tabindex: '-1',
    [open ? 'data-open' : 'data-closed']: '',
    ...(open ? {} : { hidden: '' }),
    ...placementAttributes(parentValue),
  })
  const group = appendAttributes(document.createElement('div'), {
    role: 'group',
  })
  const separator = appendAttributes(document.createElement('div'), {
    role: 'separator',
    'aria-orientation': 'horizontal',
  })

  items.map(item => appendItem(group, menu, item))
  popup.append(group, separator)
  positioner.append(popup)
  portal.append(backdrop, positioner)
}

const appendMenu = (
  root: HTMLElement,
  menu: MenuDefinition,
  config: MenubarConfig,
): void => {
  const menuRoot = appendAttributes(document.createElement('div'), {
    'data-side': 'bottom',
    'data-align': 'start',
    'data-menubar-menu': '',
    'data-value': menu.value,
    ...(config.disabled === true ? { 'data-disabled': '' } : {}),
  })
  const trigger = appendAttributes(document.createElement('button'), {
    id: `app-menubar-${menu.value}-trigger`,
    type: 'button',
    'aria-haspopup': 'menu',
    'aria-expanded': menu.open ? 'true' : 'false',
    'aria-controls': popupId(menu.value),
    role: 'menuitem',
    tabindex: menu.value === 'file' && config.disabled !== true ? '0' : '-1',
    'data-menubar-trigger': '',
    'data-orientation': config.orientation ?? 'horizontal',
    'data-value': menu.value,
    ...(menu.open ? { 'data-popup-open': '' } : {}),
    ...(config.disabled === true
      ? { 'data-disabled': '', 'aria-disabled': 'true' }
      : {}),
  })
  const portal = appendAttributes(document.createElement('div'), {
    'data-portal': '',
  })

  trigger.append(document.createTextNode(menu.label))

  if (menu.open) {
    appendPopup(portal, menu)
    menu.items
      .filter(item => item.kind === 'submenu-trigger')
      .map(item =>
        appendPopup(portal, menu, item.value, item.submenuOpen === true),
      )
  }

  menuRoot.append(trigger, portal)
  root.append(menuRoot)
}

const menubarRoot = (config: MenubarConfig): FixtureSnapshot => {
  const orientation = config.orientation ?? 'horizontal'
  const root = appendAttributes(document.createElement('div'), {
    id: 'app-menubar',
    role: 'menubar',
    'aria-orientation': orientation,
    'data-orientation': orientation,
    'data-modal': '',
    'data-has-submenu-open': '',
    ...(config.disabled === true
      ? { 'data-disabled': '', 'aria-disabled': 'true' }
      : {}),
  })

  config.menus.map(menu => appendMenu(root, menu, config))

  document.body.append(root)
  const snapshot = snapshotElement(
    root,
    config.keyboard ??
      (orientation === 'vertical' ? verticalKeyboard : horizontalKeyboard),
  )
  root.remove()

  return snapshot
}

const defaultMenus: ReadonlyArray<MenuDefinition> = [
  {
    value: 'file',
    label: 'File',
    open: true,
    items: [
      { value: 'new', label: 'New', highlighted: true },
      {
        value: 'status-bar',
        label: 'Status Bar',
        kind: 'checkbox',
        checked: true,
      },
      {
        value: 'bottom',
        label: 'Bottom',
        kind: 'radio',
        checked: true,
      },
      { value: 'export', label: 'Export', kind: 'submenu-trigger' },
      { value: 'pdf', label: 'PDF', parentValue: 'export' },
      { value: 'png', label: 'PNG', parentValue: 'export' },
    ],
  },
  {
    value: 'edit',
    label: 'Edit',
    open: false,
    items: [
      { value: 'undo', label: 'Undo' },
      { value: 'redo', label: 'Redo' },
    ],
  },
]

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'menubar-open',
    snapshot: menubarRoot({ menus: defaultMenus }),
  },
  {
    id: 'menubar-submenu-open',
    snapshot: menubarRoot({
      menus: [
        {
          ...defaultMenus[0],
          items: defaultMenus[0].items.map(item =>
            item.value === 'export'
              ? { ...item, highlighted: true, submenuOpen: true }
              : { ...item, highlighted: false },
          ),
        },
        defaultMenus[1],
      ],
    }),
  },
  {
    id: 'menubar-vertical',
    snapshot: menubarRoot({ menus: defaultMenus, orientation: 'vertical' }),
  },
  {
    id: 'menubar-disabled',
    snapshot: menubarRoot({
      menus: defaultMenus,
      disabled: true,
      keyboard: suppressedKeyboard,
    }),
  },
]
