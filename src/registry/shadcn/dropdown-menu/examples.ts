import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import * as DropdownMenu from './index'
import type {
  MenuCheckedChange,
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
  onItemPress?: (menuId: string, press: MenuItemPress) => Message
  onCheckedChange?: (menuId: string, change: MenuCheckedChange) => Message
  onRadioValueChange?: (menuId: string, change: MenuRadioValueChange) => Message
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
      ...attributes,
    ],
    [h.path([h.D('M12 5v14M5 12h14')], [])],
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

const itemContent = <Message>(
  source: ExampleItem,
  itemAttributes: DropdownMenu.MenuItemAttributes<Message>,
): ReadonlyArray<Html> => {
  const h = html<Message>()
  const kind = DropdownMenu.itemKind(itemAttributes.item)
  const indicator =
    kind === 'checkbox' || kind === 'radio'
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
                  [...itemAttributes.root],
                  itemContent(
                    sourceItem(items, itemAttributes.item),
                    itemAttributes,
                  ),
                ),
              ),
            ),
            h.div([...popup.separator], []),
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

  return DropdownMenu.view<Message>({
    id,
    items: resolvedItems,
    open,
    highlightedValue: resolvedItems.find(item => item.parentValue === undefined)
      ?.value,
    openSubmenuValues,
    ...(controller === undefined
      ? {}
      : { onOpenChange: change => controller.onOpenChange(id, change) }),
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
      contentClassName: 'w-44',
      highlightedValue: 'open-recent',
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
      defaultOpenSubmenuValues: ['invite'],
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
