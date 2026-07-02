import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import * as Menubar from './index'
import type { MenubarMenuDescriptor, MenuItemDescriptor } from './index'

type ExampleItem = MenuItemDescriptor &
  Readonly<{
    icon?: string
    shortcut?: string
  }>

type ExampleMenu = Omit<MenubarMenuDescriptor, 'items' | 'open'> &
  Readonly<{
    items: ReadonlyArray<ExampleItem>
  }>

type ExampleDefinition = Readonly<{
  id: string
  title: string
  view: () => Html
}>

export type MenubarExampleController<Message> = Readonly<{
  openMenuValueFor: (
    menubarId: string,
    defaultValue: string | undefined,
  ) => string | undefined
  openSubmenuValuesFor: (
    menubarId: string,
    menuValue: string,
    defaultValues: ReadonlyArray<string>,
  ) => ReadonlyArray<string>
  onMenuOpenChange: (
    menubarId: string,
    change: Menubar.MenubarMenuOpenChange,
  ) => Message
  onOpenMenuValueChange: (
    menubarId: string,
    change: Readonly<{ value?: string | undefined }>,
  ) => Message
}>

const fileItems: ReadonlyArray<ExampleItem> = [
  { value: 'new-tab', label: 'New Tab', shortcut: '⌘T' },
  { value: 'new-window', label: 'New Window', shortcut: '⌘N' },
  {
    value: 'new-incognito-window',
    label: 'New Incognito Window',
    isDisabled: true,
  },
  { value: 'share', label: 'Share', kind: 'submenu-trigger' },
  { value: 'email-link', label: 'Email link', parentValue: 'share' },
  { value: 'messages', label: 'Messages', parentValue: 'share' },
  { value: 'notes', label: 'Notes', parentValue: 'share' },
  { value: 'print', label: 'Print...', shortcut: '⌘P' },
]

const editItems: ReadonlyArray<ExampleItem> = [
  { value: 'undo', label: 'Undo', shortcut: '⌘Z' },
  { value: 'redo', label: 'Redo', shortcut: '⇧⌘Z' },
  { value: 'find', label: 'Find', kind: 'submenu-trigger' },
  { value: 'search-web', label: 'Search the web', parentValue: 'find' },
  { value: 'find-item', label: 'Find...', parentValue: 'find' },
  { value: 'find-next', label: 'Find Next', parentValue: 'find' },
  { value: 'find-previous', label: 'Find Previous', parentValue: 'find' },
  { value: 'cut', label: 'Cut' },
  { value: 'copy', label: 'Copy' },
  { value: 'paste', label: 'Paste' },
]

const viewItems: ReadonlyArray<ExampleItem> = [
  { value: 'bookmarks-bar', label: 'Bookmarks Bar', kind: 'checkbox' },
  { value: 'full-urls', label: 'Full URLs', kind: 'checkbox', isChecked: true },
  { value: 'reload', label: 'Reload', shortcut: '⌘R' },
  {
    value: 'force-reload',
    label: 'Force Reload',
    shortcut: '⇧⌘R',
    isDisabled: true,
  },
  { value: 'toggle-fullscreen', label: 'Toggle Fullscreen' },
  { value: 'hide-sidebar', label: 'Hide Sidebar' },
]

const profileItems: ReadonlyArray<ExampleItem> = [
  {
    value: 'andy',
    label: 'Andy',
    kind: 'radio',
    radioGroupValue: 'profile',
  },
  {
    value: 'benoit',
    label: 'Benoit',
    kind: 'radio',
    radioGroupValue: 'profile',
    isChecked: true,
  },
  {
    value: 'luis',
    label: 'Luis',
    kind: 'radio',
    radioGroupValue: 'profile',
  },
  { value: 'edit-profile', label: 'Edit...' },
  { value: 'add-profile', label: 'Add Profile...' },
]

const checkboxViewItems: ReadonlyArray<ExampleItem> = [
  {
    value: 'bookmarks',
    label: 'Always Show Bookmarks Bar',
    kind: 'checkbox',
  },
  {
    value: 'urls',
    label: 'Always Show Full URLs',
    kind: 'checkbox',
    isChecked: true,
  },
  { value: 'reload', label: 'Reload', shortcut: '⌘R' },
  {
    value: 'force-reload',
    label: 'Force Reload',
    shortcut: '⇧⌘R',
    isDisabled: true,
  },
]

const formatItems: ReadonlyArray<ExampleItem> = [
  {
    value: 'strikethrough',
    label: 'Strikethrough',
    kind: 'checkbox',
    isChecked: true,
  },
  { value: 'code', label: 'Code', kind: 'checkbox' },
  { value: 'superscript', label: 'Superscript', kind: 'checkbox' },
]

const iconFileItems: ReadonlyArray<ExampleItem> = [
  { value: 'new-file', label: 'New File', icon: 'file', shortcut: '⌘N' },
  { value: 'open-folder', label: 'Open Folder', icon: 'folder' },
  { value: 'save', label: 'Save', icon: 'save', shortcut: '⌘S' },
]

const moreItems: ReadonlyArray<ExampleItem> = [
  { value: 'settings', label: 'Settings', icon: 'settings' },
  { value: 'help', label: 'Help', icon: 'help-circle' },
  { value: 'delete', label: 'Delete', icon: 'trash' },
]

const radioProfileItems = profileItems.slice(0, 3)

const themeItems: ReadonlyArray<ExampleItem> = [
  {
    value: 'light',
    label: 'Light',
    kind: 'radio',
    radioGroupValue: 'theme',
  },
  {
    value: 'dark',
    label: 'Dark',
    kind: 'radio',
    radioGroupValue: 'theme',
  },
  {
    value: 'system',
    label: 'System',
    kind: 'radio',
    radioGroupValue: 'theme',
    isChecked: true,
  },
]

const submenuFileItems: ReadonlyArray<ExampleItem> = [
  { value: 'share', label: 'Share', kind: 'submenu-trigger' },
  { value: 'email-link', label: 'Email link', parentValue: 'share' },
  { value: 'messages', label: 'Messages', parentValue: 'share' },
  { value: 'notes', label: 'Notes', parentValue: 'share' },
  { value: 'print', label: 'Print...', shortcut: '⌘P' },
]

const submenuEditItems: ReadonlyArray<ExampleItem> = [
  { value: 'undo', label: 'Undo', shortcut: '⌘Z' },
  { value: 'redo', label: 'Redo', shortcut: '⇧⌘Z' },
  { value: 'find', label: 'Find', kind: 'submenu-trigger' },
  { value: 'find-item', label: 'Find...', parentValue: 'find' },
  { value: 'find-next', label: 'Find Next', parentValue: 'find' },
  { value: 'find-previous', label: 'Find Previous', parentValue: 'find' },
  { value: 'cut', label: 'Cut' },
  { value: 'copy', label: 'Copy' },
  { value: 'paste', label: 'Paste' },
]

const rtlFileItems: ReadonlyArray<ExampleItem> = [
  { value: 'new-tab', label: 'علامة تبويب جديدة', shortcut: '⌘T' },
  { value: 'new-window', label: 'نافذة جديدة', shortcut: '⌘N' },
  {
    value: 'new-incognito-window',
    label: 'نافذة التصفح المتخفي الجديدة',
    isDisabled: true,
  },
  { value: 'share', label: 'مشاركة', kind: 'submenu-trigger' },
  { value: 'email-link', label: 'رابط البريد الإلكتروني', parentValue: 'share' },
  { value: 'messages', label: 'الرسائل', parentValue: 'share' },
  { value: 'notes', label: 'الملاحظات', parentValue: 'share' },
  { value: 'print', label: 'طباعة...', shortcut: '⌘P' },
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

const sourceItem = (
  items: ReadonlyArray<ExampleItem>,
  item: MenuItemDescriptor,
): ExampleItem =>
  items.find(candidate => candidate.value === item.value) ?? item

const itemContent = <Message>(
  source: ExampleItem,
  itemAttributes: Menubar.MenuItemAttributes<Message>,
): ReadonlyArray<Html> => {
  const h = html<Message>()
  const kind = Menubar.itemKind(itemAttributes.item)
  const indicator =
    kind === 'checkbox' || kind === 'radio'
      ? h.span([...itemAttributes.indicator], [Menubar.checkIcon([])])
      : h.span([], [])
  const maybeIcon = source.icon === undefined ? [] : [icon(source.icon)]
  const maybeShortcut =
    source.shortcut === undefined
      ? []
      : [h.span([...itemAttributes.shortcut], [source.shortcut])]
  const maybeSubmenuIcon =
    kind === 'submenu-trigger'
      ? [Menubar.chevronRightIcon(itemAttributes.submenuIndicator)]
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
  popup: Menubar.MenuPopupAttributes<Message>,
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

const menuView = <Message>(
  items: ReadonlyArray<ExampleItem>,
  attributes: Menubar.MenubarMenuAttributes<Message>,
): Html => {
  const h = html<Message>()

  return h.div(
    [...attributes.root],
    [
      h.button([...attributes.trigger], [attributes.menu.label]),
      h.div(
        [...attributes.portal],
        [
          ...popupView(items, attributes.popup),
          ...attributes.submenus.flatMap(submenu => popupView(items, submenu)),
        ],
      ),
    ],
  )
}

const menubarExampleWithController = <Message = never>(
  id: string,
  menus: ReadonlyArray<ExampleMenu>,
  options: Partial<Menubar.ViewConfig<Message>> = {},
  controller?: MenubarExampleController<Message>,
): Html => {
  const itemsByMenuValue = new Map<string, ReadonlyArray<ExampleItem>>(
    menus.map(menu => [menu.value, menu.items]),
  )
  const defaultOpenMenuValue =
    controller === undefined ? menus.at(0)?.value : undefined
  const openMenuValue =
    controller?.openMenuValueFor(id, defaultOpenMenuValue) ??
    defaultOpenMenuValue

  return Menubar.view<Message>({
    id,
    menus: menus.map(menu => ({
      ...menu,
      open: menu.value === openMenuValue,
      highlightedValue: menu.items.find(item => item.parentValue === undefined)
        ?.value,
      openSubmenuValues:
        controller?.openSubmenuValuesFor(
          id,
          menu.value,
          menu.items
            .filter(item => item.kind === 'submenu-trigger')
            .slice(0, 1)
            .map(item => item.value),
        ) ??
        menu.items
          .filter(item => item.kind === 'submenu-trigger')
          .slice(0, 1)
          .map(item => item.value),
    })),
    focusedMenuValue: openMenuValue ?? menus.at(0)?.value,
    ...(controller === undefined
      ? {}
      : {
          onMenuOpenChange: change => {
            if (change.parentValue === undefined) {
              return controller.onOpenMenuValueChange(id, {
                value: change.open ? change.menuValue : undefined,
              })
            }

            return controller.onMenuOpenChange(id, change)
          },
          onTriggerChange: change =>
            controller.onOpenMenuValueChange(id, {
              value: change.open ? change.value : undefined,
            }),
        }),
    ...options,
    toMenuView: attributes =>
      menuView(itemsByMenuValue.get(attributes.menu.value) ?? [], attributes),
  })
}

const browserMenus: ReadonlyArray<ExampleMenu> = [
  { value: 'file', label: 'File', items: fileItems },
  { value: 'edit', label: 'Edit', items: editItems },
  { value: 'view', label: 'View', items: viewItems },
  { value: 'profiles', label: 'Profiles', items: profileItems },
]

export const MenubarDemo = <Message = never>(
  controller?: MenubarExampleController<Message>,
): Html =>
  menubarExampleWithController(
    'menubar-demo',
    browserMenus,
    {
      className: 'w-72',
    },
    controller,
  )

export const MenubarCheckbox = <Message = never>(
  controller?: MenubarExampleController<Message>,
): Html =>
  menubarExampleWithController(
    'menubar-checkbox',
    [
      { value: 'view', label: 'View', items: checkboxViewItems },
      { value: 'format', label: 'Format', items: formatItems },
    ],
    { className: 'w-72' },
    controller,
  )

export const MenubarIcons = <Message = never>(
  controller?: MenubarExampleController<Message>,
): Html =>
  menubarExampleWithController(
    'menubar-icons',
    [
      { value: 'file', label: 'File', items: iconFileItems },
      { value: 'more', label: 'More', items: moreItems },
    ],
    { className: 'w-72' },
    controller,
  )

export const MenubarRadio = <Message = never>(
  controller?: MenubarExampleController<Message>,
): Html =>
  menubarExampleWithController(
    'menubar-radio',
    [
      { value: 'profiles', label: 'Profiles', items: radioProfileItems },
      { value: 'theme', label: 'Theme', items: themeItems },
    ],
    { className: 'w-72' },
    controller,
  )

export const MenubarRtl = <Message = never>(
  controller?: MenubarExampleController<Message>,
): Html =>
  menubarExampleWithController(
    'menubar-rtl',
    [
      { value: 'file', label: 'ملف', items: rtlFileItems },
      { value: 'edit', label: 'تعديل', items: editItems },
      { value: 'view', label: 'عرض', items: viewItems },
      { value: 'profiles', label: 'الملفات الشخصية', items: profileItems },
    ],
    { className: 'w-72', dir: 'rtl' },
    controller,
  )

export const MenubarSubmenu = <Message = never>(
  controller?: MenubarExampleController<Message>,
): Html =>
  menubarExampleWithController(
    'menubar-submenu',
    [
      { value: 'file', label: 'File', items: submenuFileItems },
      { value: 'edit', label: 'Edit', items: submenuEditItems },
    ],
    { className: 'w-72' },
    controller,
  )

export const menubarExampleViews: ReadonlyArray<ExampleDefinition> = [
  {
    id: 'shadcn/menubar-checkbox',
    title: 'MenubarCheckbox',
    view: MenubarCheckbox,
  },
  {
    id: 'shadcn/menubar-demo',
    title: 'MenubarDemo',
    view: MenubarDemo,
  },
  {
    id: 'shadcn/menubar-icons',
    title: 'MenubarIcons',
    view: MenubarIcons,
  },
  {
    id: 'shadcn/menubar-radio',
    title: 'MenubarRadio',
    view: MenubarRadio,
  },
  {
    id: 'shadcn/menubar-rtl',
    title: 'MenubarRtl',
    view: MenubarRtl,
  },
  {
    id: 'shadcn/menubar-submenu',
    title: 'MenubarSubmenu',
    view: MenubarSubmenu,
  },
]
