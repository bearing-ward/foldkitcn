import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import type { AnchorPositioningMessage } from '../../../utils/anchor-positioning'
import * as DropdownMenu from './index'
import type {
  MenuCheckedChange,
  MenuHighlightChange,
  MenuItemDescriptor,
  MenuItemPress,
  MenuRadioValueChange,
} from './index'

type ExampleItem = MenuItemDescriptor &
  Readonly<{
    icon?: string
    shortcut?: string
  }>

type ExampleDefinition = Readonly<{
  id: string
  title: string
  view: () => Html
}>

type ExampleChild = Html | string

const fallbackIconPaths = ['M5 12h14', 'M12 5v14']

const iconPaths: Readonly<Record<string, ReadonlyArray<string>>> = {
  'badge-check': [
    'M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.78 4.78 4 4 0 0 1-6.74 0 4 4 0 0 1-4.78-4.78 4 4 0 0 1 0-6.75',
    'm9 12 2 2 4-4',
  ],
  bell: [
    'M10.268 21a2 2 0 0 0 3.464 0',
    'M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326',
  ],
  'credit-card': [
    'M2 10h20',
    'M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z',
  ],
  download: ['M12 15V3', 'm7 10 5 5 5-5', 'M5 21h14'],
  eye: [
    'M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0',
    'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
  ],
  file: [
    'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z',
    'M14 2v4a2 2 0 0 0 2 2h4',
  ],
  'file-code': [
    'M10 12.5 8 15l2 2.5',
    'm14 12.5 2 2.5-2 2.5',
    'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z',
    'M14 2v6h6',
  ],
  'file-text': [
    'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z',
    'M14 2v4a2 2 0 0 0 2 2h4',
    'M10 9H8',
    'M16 13H8',
    'M16 17H8',
  ],
  folder: [
    'M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z',
  ],
  'folder-open': [
    'm6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6A2 2 0 0 1 18.46 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2',
  ],
  'help-circle': ['M9.09 9a3 3 0 1 1 5.83 1c0 2-3 2-3 4', 'M12 17h.01'],
  keyboard: [
    'M10 8h.01',
    'M12 12h.01',
    'M14 8h.01',
    'M16 12h.01',
    'M18 8h.01',
    'M6 8h.01',
    'M7 16h10',
    'M8 12h.01',
    'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
  ],
  languages: [
    'm5 8 6 6',
    'm4 14 6-6 2-3',
    'M2 5h12',
    'M7 2h1',
    'm22 22-5-10-5 10',
    'M14 18h6',
  ],
  layout: ['M3 5h18', 'M3 12h18', 'M3 19h18', 'M8 5v14', 'M16 5v14'],
  'log-out': [
    'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4',
    'm16 17 5-5-5-5',
    'M21 12H9',
  ],
  mail: [
    'm22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7',
    'M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z',
  ],
  monitor: [
    'M20 3H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z',
    'M8 21h8',
    'M12 17v4',
  ],
  moon: ['M20.985 12.486A9 9 0 1 1 11.514 3.015 7 7 0 0 0 20.985 12.486Z'],
  'more-horizontal': ['M12 12h.01', 'M19 12h.01', 'M5 12h.01'],
  palette: [
    'M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z',
    'M13.5 6.5h.01',
    'M17.5 10.5h.01',
    'M6.5 12.5h.01',
    'M8.5 7.5h.01',
  ],
  save: [
    'M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z',
    'M17 21v-7H7v7',
    'M7 3v4h8',
  ],
  settings: [
    'M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.32-1.915',
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  ],
  shield: ['M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3z'],
  sun: [
    'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z',
    'M12 1v2',
    'M12 21v2',
    'm4.22 4.22 1.42 1.42',
    'm18.36 18.36 1.42 1.42',
    'M1 12h2',
    'M21 12h2',
    'm4.22 19.78 1.42-1.42',
    'm18.36 5.64 1.42-1.42',
  ],
  user: [
    'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2',
    'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  ],
}

const defaultRadioValuesFor = (
  items: ReadonlyArray<ExampleItem>,
): Readonly<Record<string, string>> =>
  items.reduce<Record<string, string>>((values, item) => {
    if (item.kind !== 'radio' || item.isChecked !== true) {
      return values
    }

    const groupValue = item.radioGroupValue ?? 'default'

    if (values[groupValue] === undefined) {
      values[groupValue] = item.value
    }

    return values
  }, {})

const itemsWithState = <Message>(
  menuId: string,
  items: ReadonlyArray<ExampleItem>,
  controller?: DropdownMenuExampleController<Message>,
): ReadonlyArray<ExampleItem> => {
  if (controller === undefined) {
    return items
  }

  const defaultRadioValues = defaultRadioValuesFor(items)

  return items.map(item => {
    if (item.kind === 'checkbox') {
      return {
        ...item,
        isChecked:
          controller.checkedStateFor?.(
            menuId,
            item.value,
            item.isChecked === true,
          ) ?? item.isChecked === true,
      }
    }

    if (item.kind === 'radio') {
      const groupValue = item.radioGroupValue ?? 'default'
      const defaultValue = defaultRadioValues[groupValue]
      const selectedValue =
        controller.radioValueFor?.(menuId, groupValue, defaultValue) ??
        defaultValue

      return {
        ...item,
        isChecked: selectedValue === item.value,
      }
    }

    return item
  })
}

export type DropdownMenuExampleController<Message> = Readonly<{
  isOpenFor: (menuId: string, defaultOpen: boolean) => boolean
  highlightedValueFor: (
    menuId: string,
    defaultValue: string | undefined,
  ) => string | undefined
  openSubmenuValuesFor: (
    menuId: string,
    defaultValues: ReadonlyArray<string>,
  ) => ReadonlyArray<string>
  checkedStateFor?: (
    menuId: string,
    itemValue: string,
    defaultChecked: boolean,
  ) => boolean
  radioValueFor?: (
    menuId: string,
    groupValue: string,
    defaultValue: string | undefined,
  ) => string | undefined
  onOpenChange: (menuId: string, change: DropdownMenu.MenuOpenChange) => Message
  onHighlightChange: (menuId: string, change: MenuHighlightChange) => Message
  onItemPress?: (menuId: string, press: MenuItemPress) => Message
  onCheckedChange?: (menuId: string, change: MenuCheckedChange) => Message
  onRadioValueChange?: (menuId: string, change: MenuRadioValueChange) => Message
  onPositioned?: (message: AnchorPositioningMessage) => Message
}>

const basicItems: ReadonlyArray<ExampleItem> = [
  { value: 'profile', label: 'Profile' },
  { value: 'billing', label: 'Billing' },
  { value: 'settings', label: 'Settings' },
  { value: 'github', label: 'GitHub' },
  { value: 'support', label: 'Support' },
  { value: 'api', label: 'API', isDisabled: true },
]

const demoItems: ReadonlyArray<ExampleItem> = [
  { value: 'profile', label: 'Profile', shortcut: '⇧⌘P' },
  { value: 'billing', label: 'Billing', shortcut: '⌘B' },
  { value: 'settings', label: 'Settings', shortcut: '⌘S' },
  { value: 'team', label: 'Team' },
  { value: 'invite', label: 'Invite users', kind: 'submenu-trigger' },
  { value: 'email', label: 'Email', parentValue: 'invite' },
  { value: 'message', label: 'Message', parentValue: 'invite' },
  { value: 'more', label: 'More...', parentValue: 'invite' },
  { value: 'new-team', label: 'New Team', shortcut: '⌘+T' },
  { value: 'github', label: 'GitHub' },
  { value: 'support', label: 'Support' },
  { value: 'api', label: 'API', isDisabled: true },
  { value: 'logout', label: 'Log out', shortcut: '⇧⌘Q' },
]

const checkboxItems: ReadonlyArray<ExampleItem> = [
  {
    value: 'status-bar',
    label: 'Status Bar',
    kind: 'checkbox',
    isChecked: true,
  },
  {
    value: 'activity-bar',
    label: 'Activity Bar',
    kind: 'checkbox',
    isDisabled: true,
  },
  { value: 'panel', label: 'Panel', kind: 'checkbox' },
]

const checkboxIconItems: ReadonlyArray<ExampleItem> = [
  {
    value: 'email',
    label: 'Email notifications',
    kind: 'checkbox',
    isChecked: true,
    icon: 'mail',
  },
  {
    value: 'sms',
    label: 'SMS notifications',
    kind: 'checkbox',
    icon: 'message-square',
  },
  {
    value: 'push',
    label: 'Push notifications',
    kind: 'checkbox',
    isChecked: true,
    icon: 'bell',
  },
]

const radioItems: ReadonlyArray<ExampleItem> = [
  {
    value: 'top',
    label: 'Top',
    kind: 'radio',
    radioGroupValue: 'panel-position',
  },
  {
    value: 'bottom',
    label: 'Bottom',
    kind: 'radio',
    radioGroupValue: 'panel-position',
    isChecked: true,
  },
  {
    value: 'right',
    label: 'Right',
    kind: 'radio',
    radioGroupValue: 'panel-position',
  },
]

const radioIconItems: ReadonlyArray<ExampleItem> = [
  {
    value: 'card',
    label: 'Credit Card',
    kind: 'radio',
    radioGroupValue: 'payment-method',
    isChecked: true,
    icon: 'credit-card',
  },
  {
    value: 'paypal',
    label: 'PayPal',
    kind: 'radio',
    radioGroupValue: 'payment-method',
    icon: 'wallet',
  },
  {
    value: 'bank',
    label: 'Bank Transfer',
    kind: 'radio',
    radioGroupValue: 'payment-method',
    icon: 'building',
  },
]

const submenuItems: ReadonlyArray<ExampleItem> = [
  { value: 'team', label: 'Team' },
  { value: 'invite', label: 'Invite users', kind: 'submenu-trigger' },
  { value: 'email', label: 'Email', parentValue: 'invite' },
  { value: 'message', label: 'Message', parentValue: 'invite' },
  {
    value: 'more-options',
    label: 'More options',
    kind: 'submenu-trigger',
    parentValue: 'invite',
  },
  { value: 'calendly', label: 'Calendly', parentValue: 'more-options' },
  { value: 'slack', label: 'Slack', parentValue: 'more-options' },
  { value: 'webhook', label: 'Webhook', parentValue: 'more-options' },
  { value: 'advanced', label: 'Advanced...', parentValue: 'invite' },
  { value: 'new-team', label: 'New Team', shortcut: '⌘+T' },
]

const iconItems: ReadonlyArray<ExampleItem> = [
  { value: 'profile', label: 'Profile', icon: 'user' },
  { value: 'billing', label: 'Billing', icon: 'credit-card' },
  { value: 'settings', label: 'Settings', icon: 'settings' },
  { value: 'logout', label: 'Log out', icon: 'log-out' },
]

const avatarItems: ReadonlyArray<ExampleItem> = [
  { value: 'account', label: 'Account', icon: 'badge-check' },
  { value: 'billing', label: 'Billing', icon: 'credit-card' },
  { value: 'notifications', label: 'Notifications', icon: 'bell' },
  { value: 'sign-out', label: 'Sign Out', icon: 'log-out' },
]

const complexItems: ReadonlyArray<ExampleItem> = [
  { value: 'new-file', label: 'New File', icon: 'file', shortcut: '⌘N' },
  {
    value: 'new-folder',
    label: 'New Folder',
    icon: 'folder',
    shortcut: '⇧⌘N',
  },
  {
    value: 'open-recent',
    label: 'Open Recent',
    kind: 'submenu-trigger',
    icon: 'folder-open',
  },
  {
    value: 'project-alpha',
    label: 'Project Alpha',
    parentValue: 'open-recent',
    icon: 'file-code',
  },
  {
    value: 'project-beta',
    label: 'Project Beta',
    parentValue: 'open-recent',
    icon: 'file-code',
  },
  {
    value: 'more-projects',
    label: 'More Projects',
    kind: 'submenu-trigger',
    parentValue: 'open-recent',
    icon: 'more-horizontal',
  },
  {
    value: 'project-gamma',
    label: 'Project Gamma',
    parentValue: 'more-projects',
    icon: 'file-code',
  },
  {
    value: 'project-delta',
    label: 'Project Delta',
    parentValue: 'more-projects',
    icon: 'file-code',
  },
  { value: 'browse', label: 'Browse...', parentValue: 'open-recent' },
  { value: 'save', label: 'Save', icon: 'save', shortcut: '⌘S' },
  { value: 'export', label: 'Export', icon: 'download', shortcut: '⇧⌘E' },
  {
    value: 'show-sidebar',
    label: 'Show Sidebar',
    kind: 'checkbox',
    isChecked: true,
    icon: 'eye',
  },
  {
    value: 'show-status-bar',
    label: 'Show Status Bar',
    kind: 'checkbox',
    icon: 'layout',
  },
  {
    value: 'theme',
    label: 'Theme',
    kind: 'submenu-trigger',
    icon: 'palette',
  },
  {
    value: 'light',
    label: 'Light',
    kind: 'radio',
    radioGroupValue: 'theme',
    isChecked: true,
    parentValue: 'theme',
    icon: 'sun',
  },
  {
    value: 'dark',
    label: 'Dark',
    kind: 'radio',
    radioGroupValue: 'theme',
    parentValue: 'theme',
    icon: 'moon',
  },
  {
    value: 'system',
    label: 'System',
    kind: 'radio',
    radioGroupValue: 'theme',
    parentValue: 'theme',
    icon: 'monitor',
  },
  { value: 'account', label: 'Profile', icon: 'user', shortcut: '⇧⌘P' },
  { value: 'billing', label: 'Billing', icon: 'credit-card' },
  {
    value: 'settings',
    label: 'Settings',
    kind: 'submenu-trigger',
    icon: 'settings',
  },
  {
    value: 'keyboard-shortcuts',
    label: 'Keyboard Shortcuts',
    parentValue: 'settings',
    icon: 'keyboard',
  },
  {
    value: 'language',
    label: 'Language',
    parentValue: 'settings',
    icon: 'languages',
  },
  {
    value: 'notifications',
    label: 'Notifications',
    kind: 'submenu-trigger',
    parentValue: 'settings',
    icon: 'bell',
  },
  {
    value: 'push-notifications',
    label: 'Push Notifications',
    kind: 'checkbox',
    isChecked: true,
    parentValue: 'notifications',
    icon: 'bell',
  },
  {
    value: 'email-notifications',
    label: 'Email Notifications',
    kind: 'checkbox',
    isChecked: true,
    parentValue: 'notifications',
    icon: 'mail',
  },
  {
    value: 'privacy',
    label: 'Privacy & Security',
    parentValue: 'settings',
    icon: 'shield',
  },
  { value: 'help', label: 'Help & Support', icon: 'help-circle' },
  { value: 'docs', label: 'Documentation', icon: 'file-text' },
  { value: 'sign-out', label: 'Sign Out', icon: 'log-out', shortcut: '⇧⌘Q' },
]

const icon = <Message>(
  name: string,
  attributes: ReadonlyArray<Attribute<Message>> = [],
): Html => {
  const h = html<Message>()
  const paths = iconPaths[name] ?? fallbackIconPaths

  return h.svg(
    [
      h.Xmlns('http://www.w3.org/2000/svg'),
      h.Width('24'),
      h.Height('24'),
      h.ViewBox('0 0 24 24'),
      h.Fill('none'),
      h.Stroke('currentColor'),
      h.StrokeWidth('2'),
      h.StrokeLinecap('round'),
      h.StrokeLinejoin('round'),
      h.AriaHidden(true),
      h.DataAttribute('icon', name),
      h.Class('size-4 shrink-0 text-muted-foreground'),
      ...attributes,
    ],
    paths.map(path => h.path([h.D(path)], [])),
  )
}

const avatar = (): Html => {
  const h = html<never>()

  return h.span(
    [
      h.DataAttribute('slot', 'avatar'),
      h.Class(
        'relative flex size-8 shrink-0 overflow-hidden rounded-full bg-muted text-xs',
      ),
    ],
    [
      h.span(
        [
          h.DataAttribute('slot', 'avatar-fallback'),
          h.Class('flex size-full items-center justify-center'),
        ],
        ['LR'],
      ),
    ],
  )
}

const sourceItem = (
  items: ReadonlyArray<ExampleItem>,
  item: MenuItemDescriptor,
): ExampleItem =>
  items.find(candidate => candidate.value === item.value) ?? item

const itemRootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  source: ExampleItem,
  itemAttributes: DropdownMenu.MenuItemAttributes<Message>,
  reservesLeadingIconSlot: boolean,
): ReadonlyArray<Attribute<Message>> =>
  reservesLeadingIconSlot && source.icon === undefined
    ? [...itemAttributes.root, h.DataAttribute('inset', 'true')]
    : itemAttributes.root

const itemContent = <Message>(
  source: ExampleItem,
  itemAttributes: DropdownMenu.MenuItemAttributes<Message>,
): ReadonlyArray<Html> => {
  const h = html<Message>()
  const kind = DropdownMenu.itemKind(itemAttributes.item)
  const hasMountedIndicator =
    itemAttributes.item.isChecked === true &&
    (kind === 'checkbox' || kind === 'radio')
  const indicator = hasMountedIndicator
    ? h.span([...itemAttributes.indicator], [DropdownMenu.checkIcon([])])
    : h.span([], [])
  const maybeIcon = source.icon === undefined ? [] : [icon(source.icon)]
  const maybeShortcut =
    source.shortcut === undefined
      ? []
      : [h.span([...itemAttributes.shortcut], [source.shortcut])]
  const maybeSubmenuIcon =
    kind === 'submenu-trigger'
      ? [DropdownMenu.chevronRightIcon(itemAttributes.submenuIndicator)]
      : []

  return [
    indicator,
    ...maybeIcon,
    h.span([...itemAttributes.label], [itemAttributes.item.label]),
    ...maybeShortcut,
    ...maybeSubmenuIcon,
  ]
}

const popupView = <Message>(
  items: ReadonlyArray<ExampleItem>,
  popup: DropdownMenu.MenuPopupAttributes<Message>,
): ReadonlyArray<Html> => {
  const h = html<Message>()

  if (!popup.isMounted) {
    return []
  }

  const reservesLeadingIconSlot = items.some(item => item.icon !== undefined)

  return [
    h.div([...popup.backdrop.root], []),
    h.div(
      [...popup.positioner.root],
      [
        h.div(
          [...popup.popup.root],
          [
            h.div(
              [...popup.group],
              popup.items.map(itemAttributes =>
                h.div(
                  itemRootAttributes(
                    h,
                    sourceItem(items, itemAttributes.item),
                    itemAttributes,
                    reservesLeadingIconSlot,
                  ),
                  itemContent(
                    sourceItem(items, itemAttributes.item),
                    itemAttributes,
                  ),
                ),
              ),
            ),
          ],
        ),
      ],
    ),
  ]
}

const menuExampleWithController = <Message = never>(
  id: string,
  items: ReadonlyArray<ExampleItem>,
  options: Partial<DropdownMenu.ViewConfig<Message>> &
    Readonly<{
      trigger?: ReadonlyArray<ExampleChild>
      defaultOpen?: boolean
      defaultOpenSubmenuValues?: ReadonlyArray<string>
    }> = {},
  controller?: DropdownMenuExampleController<Message>,
): Html => {
  const h = html<Message>()
  const {
    defaultOpen = true,
    defaultOpenSubmenuValues = [],
    trigger,
    ...viewOptions
  } = options
  const onCheckedChange = controller?.onCheckedChange
  const onRadioValueChange = controller?.onRadioValueChange
  const onItemPress = controller?.onItemPress
  const fallbackOpen = controller === undefined ? defaultOpen : false
  const open = controller?.isOpenFor(id, fallbackOpen) ?? fallbackOpen
  const openSubmenuValues =
    controller?.openSubmenuValuesFor(id, defaultOpenSubmenuValues) ??
    defaultOpenSubmenuValues
  const resolvedItems = itemsWithState(id, items, controller)
  const defaultHighlightedValue = resolvedItems.find(
    item => item.parentValue === undefined,
  )?.value
  const highlightedValue =
    controller?.highlightedValueFor(id, defaultHighlightedValue) ??
    defaultHighlightedValue

  return DropdownMenu.view<Message>({
    id,
    items: resolvedItems,
    open,
    highlightedValue,
    openSubmenuValues,
    ...(controller === undefined
      ? {}
      : {
          onOpenChange: change => controller.onOpenChange(id, change),
          onHighlightChange: change => controller.onHighlightChange(id, change),
          ...(controller.onPositioned === undefined
            ? { positioning: 'static' as const }
            : { onPositioned: controller.onPositioned }),
        }),
    ...(onItemPress === undefined
      ? {}
      : { onItemPress: press => onItemPress(id, press) }),
    ...(onCheckedChange === undefined
      ? {}
      : { onCheckedChange: change => onCheckedChange(id, change) }),
    ...(onRadioValueChange === undefined
      ? {}
      : {
          onRadioValueChange: change => onRadioValueChange(id, change),
        }),
    ...viewOptions,
    toView: attributes =>
      h.div(
        [...attributes.root],
        [
          h.button([...attributes.trigger], trigger ?? ['Open']),
          h.div(
            [...attributes.portal],
            [
              ...popupView(resolvedItems, attributes.popup),
              ...attributes.submenus.flatMap(submenu =>
                popupView(resolvedItems, submenu),
              ),
            ],
          ),
        ],
      ),
  })
}

export const DropdownMenuAvatar = <Message = never>(
  controller?: DropdownMenuExampleController<Message>,
): Html =>
  menuExampleWithController(
    'dropdown-menu-avatar',
    avatarItems,
    {
      align: 'end',
      trigger: [avatar()],
    },
    controller,
  )

export const DropdownMenuBasic = <Message = never>(
  controller?: DropdownMenuExampleController<Message>,
): Html =>
  menuExampleWithController('dropdown-menu-basic', basicItems, {}, controller)

export const DropdownMenuCheckboxesIcons = <Message = never>(
  controller?: DropdownMenuExampleController<Message>,
): Html =>
  menuExampleWithController(
    'dropdown-menu-checkboxes-icons',
    checkboxIconItems,
    {
      contentClassName: 'w-48',
      trigger: ['Notifications'],
    },
    controller,
  )

export const DropdownMenuCheckboxes = <Message = never>(
  controller?: DropdownMenuExampleController<Message>,
): Html =>
  menuExampleWithController(
    'dropdown-menu-checkboxes',
    checkboxItems,
    {
      contentClassName: 'w-40',
    },
    controller,
  )

export const DropdownMenuComplex = <Message = never>(
  controller?: DropdownMenuExampleController<Message>,
): Html =>
  menuExampleWithController(
    'dropdown-menu-complex',
    complexItems,
    {
      contentClassName: 'min-w-56',
      highlightedValue: 'open-recent',
      subContentClassName: 'min-w-48',
      trigger: ['Complex Menu'],
    },
    controller,
  )

export const DropdownMenuDemo = <Message = never>(
  controller?: DropdownMenuExampleController<Message>,
): Html =>
  menuExampleWithController(
    'dropdown-menu-demo',
    demoItems,
    {
      contentClassName: 'w-40',
      highlightedValue: 'invite',
    },
    controller,
  )

export const DropdownMenuDestructive = <Message = never>(
  controller?: DropdownMenuExampleController<Message>,
): Html =>
  menuExampleWithController(
    'dropdown-menu-destructive',
    iconItems,
    {
      variant: 'destructive',
      trigger: ['Actions'],
    },
    controller,
  )

export const DropdownMenuIcons = <Message = never>(
  controller?: DropdownMenuExampleController<Message>,
): Html =>
  menuExampleWithController('dropdown-menu-icons', iconItems, {}, controller)

export const DropdownMenuRadioGroup = <Message = never>(
  controller?: DropdownMenuExampleController<Message>,
): Html =>
  menuExampleWithController(
    'dropdown-menu-radio-group',
    radioItems,
    {
      contentClassName: 'w-32',
    },
    controller,
  )

export const DropdownMenuRadioIcons = <Message = never>(
  controller?: DropdownMenuExampleController<Message>,
): Html =>
  menuExampleWithController(
    'dropdown-menu-radio-icons',
    radioIconItems,
    {
      contentClassName: 'min-w-56',
      trigger: ['Payment Method'],
    },
    controller,
  )

export const DropdownMenuRtl = <Message = never>(
  controller?: DropdownMenuExampleController<Message>,
): Html =>
  menuExampleWithController(
    'dropdown-menu-rtl',
    demoItems,
    {
      dir: 'rtl',
      highlightedValue: 'invite',
      defaultOpenSubmenuValues: ['invite'],
    },
    controller,
  )

export const DropdownMenuShortcuts = <Message = never>(
  controller?: DropdownMenuExampleController<Message>,
): Html =>
  menuExampleWithController(
    'dropdown-menu-shortcuts',
    demoItems,
    {},
    controller,
  )

export const DropdownMenuSubmenu = <Message = never>(
  controller?: DropdownMenuExampleController<Message>,
): Html =>
  menuExampleWithController(
    'dropdown-menu-submenu',
    submenuItems,
    {
      highlightedValue: 'invite',
      defaultOpenSubmenuValues: ['invite', 'more-options'],
    },
    controller,
  )

export const dropdownMenuExampleViews: ReadonlyArray<ExampleDefinition> = [
  {
    id: 'shadcn/dropdown-menu-avatar',
    title: 'DropdownMenuAvatar',
    view: DropdownMenuAvatar,
  },
  {
    id: 'shadcn/dropdown-menu-basic',
    title: 'DropdownMenuBasic',
    view: DropdownMenuBasic,
  },
  {
    id: 'shadcn/dropdown-menu-checkboxes-icons',
    title: 'DropdownMenuCheckboxesIcons',
    view: DropdownMenuCheckboxesIcons,
  },
  {
    id: 'shadcn/dropdown-menu-checkboxes',
    title: 'DropdownMenuCheckboxes',
    view: DropdownMenuCheckboxes,
  },
  {
    id: 'shadcn/dropdown-menu-complex',
    title: 'DropdownMenuComplex',
    view: DropdownMenuComplex,
  },
  {
    id: 'shadcn/dropdown-menu-demo',
    title: 'DropdownMenuDemo',
    view: DropdownMenuDemo,
  },
  {
    id: 'shadcn/dropdown-menu-destructive',
    title: 'DropdownMenuDestructive',
    view: DropdownMenuDestructive,
  },
  {
    id: 'shadcn/dropdown-menu-icons',
    title: 'DropdownMenuIcons',
    view: DropdownMenuIcons,
  },
  {
    id: 'shadcn/dropdown-menu-radio-group',
    title: 'DropdownMenuRadioGroup',
    view: DropdownMenuRadioGroup,
  },
  {
    id: 'shadcn/dropdown-menu-radio-icons',
    title: 'DropdownMenuRadioIcons',
    view: DropdownMenuRadioIcons,
  },
  {
    id: 'shadcn/dropdown-menu-rtl',
    title: 'DropdownMenuRtl',
    view: DropdownMenuRtl,
  },
  {
    id: 'shadcn/dropdown-menu-shortcuts',
    title: 'DropdownMenuShortcuts',
    view: DropdownMenuShortcuts,
  },
  {
    id: 'shadcn/dropdown-menu-submenu',
    title: 'DropdownMenuSubmenu',
    view: DropdownMenuSubmenu,
  },
]
