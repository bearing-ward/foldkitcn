import { Option } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import * as ContextMenu from './index'
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
    separatorBefore?: boolean
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
  controller?: ContextMenuExampleController<Message>,
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

export type ContextMenuExampleController<Message> = Readonly<{
  contextPointFor: (
    menuId: string,
  ) => Option.Option<ContextMenu.ContextMenuPoint>
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
  onContextPointChange: (
    menuId: string,
    point: ContextMenu.ContextMenuPoint,
  ) => Message
  onOpenChange: (
    menuId: string,
    change: ContextMenu.ContextMenuOpenChange,
  ) => Message
  onHighlightChange: (menuId: string, change: MenuHighlightChange) => Message
  onItemPress?: (menuId: string, press: MenuItemPress) => Message
  onCheckedChange?: (menuId: string, change: MenuCheckedChange) => Message
  onRadioValueChange?: (menuId: string, change: MenuRadioValueChange) => Message
}>

const triggerClassName =
  'flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm'

const basicItems: ReadonlyArray<ExampleItem> = [
  { value: 'back', label: 'Back' },
  { value: 'forward', label: 'Forward', isDisabled: true },
  { value: 'reload', label: 'Reload' },
]

const demoItems: ReadonlyArray<ExampleItem> = [
  { value: 'back', label: 'Back', shortcut: '⌘[', icon: 'copy' },
  { value: 'forward', label: 'Forward', shortcut: '⌘]', isDisabled: true },
  { value: 'reload', label: 'Reload', shortcut: '⌘R', icon: 'refresh' },
  {
    value: 'more-tools',
    label: 'More Tools',
    kind: 'submenu-trigger',
    icon: 'settings',
  },
  { value: 'save-page', label: 'Save Page...', parentValue: 'more-tools' },
  {
    value: 'create-shortcut',
    label: 'Create Shortcut...',
    parentValue: 'more-tools',
  },
  { value: 'name-window', label: 'Name Window...', parentValue: 'more-tools' },
  {
    value: 'more-options',
    label: 'More Options',
    kind: 'submenu-trigger',
    parentValue: 'more-tools',
  },
  { value: 'inspect', label: 'Inspect', parentValue: 'more-options' },
  { value: 'task-manager', label: 'Task Manager', parentValue: 'more-options' },
  {
    value: 'developer-tools',
    label: 'Developer Tools',
    parentValue: 'more-tools',
  },
  { value: 'delete', label: 'Delete', parentValue: 'more-tools' },
  {
    value: 'show-bookmarks',
    label: 'Show Bookmarks',
    kind: 'checkbox',
    isChecked: true,
  },
  { value: 'show-full-urls', label: 'Show Full URLs', kind: 'checkbox' },
  {
    value: 'pedro',
    label: 'Pedro Duarte',
    kind: 'radio',
    radioGroupValue: 'people',
    isChecked: true,
  },
  {
    value: 'colm',
    label: 'Colm Tuite',
    kind: 'radio',
    radioGroupValue: 'people',
  },
]

const checkboxItems: ReadonlyArray<ExampleItem> = [
  {
    value: 'bookmarks-bar',
    label: 'Show Bookmarks Bar',
    kind: 'checkbox',
    isChecked: true,
  },
  { value: 'full-urls', label: 'Show Full URLs', kind: 'checkbox' },
  {
    value: 'developer-tools',
    label: 'Show Developer Tools',
    kind: 'checkbox',
    isChecked: true,
  },
]

const radioItems: ReadonlyArray<ExampleItem> = [
  {
    value: 'pedro',
    label: 'Pedro Duarte',
    kind: 'radio',
    radioGroupValue: 'people',
    isChecked: true,
  },
  {
    value: 'colm',
    label: 'Colm Tuite',
    kind: 'radio',
    radioGroupValue: 'people',
  },
  {
    value: 'light',
    label: 'Light',
    kind: 'radio',
    radioGroupValue: 'theme',
    isChecked: true,
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
  },
]

const submenuItems: ReadonlyArray<ExampleItem> = [
  { value: 'copy', label: 'Copy', shortcut: '⌘C' },
  { value: 'cut', label: 'Cut', shortcut: '⌘X' },
  { value: 'more-tools', label: 'More Tools', kind: 'submenu-trigger' },
  { value: 'save-page', label: 'Save Page...', parentValue: 'more-tools' },
  {
    value: 'create-shortcut',
    label: 'Create Shortcut...',
    parentValue: 'more-tools',
  },
  { value: 'name-window', label: 'Name Window...', parentValue: 'more-tools' },
  {
    value: 'developer-tools',
    label: 'Developer Tools',
    parentValue: 'more-tools',
  },
  { value: 'delete', label: 'Delete', parentValue: 'more-tools' },
]

const shortcutItems: ReadonlyArray<ExampleItem> = [
  { value: 'back', label: 'Back', shortcut: '⌘[' },
  { value: 'forward', label: 'Forward', shortcut: '⌘]', isDisabled: true },
  { value: 'reload', label: 'Reload', shortcut: '⌘R' },
  { value: 'save', label: 'Save', shortcut: '⌘S' },
  { value: 'save-as', label: 'Save As...', shortcut: '⇧⌘S' },
]

const groupItems: ReadonlyArray<ExampleItem> = [
  { value: 'new-file', label: 'New File', shortcut: '⌘N' },
  { value: 'open-file', label: 'Open File', shortcut: '⌘O' },
  { value: 'save', label: 'Save', shortcut: '⌘S' },
  { value: 'undo', label: 'Undo', shortcut: '⌘Z', separatorBefore: true },
  { value: 'redo', label: 'Redo', shortcut: '⇧⌘Z' },
  { value: 'cut', label: 'Cut', shortcut: '⌘X', separatorBefore: true },
  { value: 'copy', label: 'Copy', shortcut: '⌘C' },
  { value: 'paste', label: 'Paste', shortcut: '⌘V' },
  { value: 'delete', label: 'Delete', shortcut: '⌫', separatorBefore: true },
]

const iconItems: ReadonlyArray<ExampleItem> = [
  { value: 'copy', label: 'Copy', icon: 'copy' },
  { value: 'cut', label: 'Cut', icon: 'scissors' },
  { value: 'paste', label: 'Paste', icon: 'clipboard-paste' },
  { value: 'delete', label: 'Delete', icon: 'trash' },
]

const destructiveItems: ReadonlyArray<ExampleItem> = [
  { value: 'edit', label: 'Edit', icon: 'pencil' },
  { value: 'share', label: 'Share', icon: 'share' },
  { value: 'delete', label: 'Delete', icon: 'trash' },
]

const rtlItems: ReadonlyArray<ExampleItem> = [
  { value: 'navigation', label: 'التنقل', kind: 'submenu-trigger' },
  {
    value: 'back',
    label: 'رجوع',
    parentValue: 'navigation',
    icon: 'arrow-left',
  },
  {
    value: 'forward',
    label: 'تقدم',
    parentValue: 'navigation',
    icon: 'arrow-right',
    isDisabled: true,
  },
  { value: 'reload', label: 'إعادة تحميل', parentValue: 'navigation' },
  { value: 'more-tools', label: 'المزيد من الأدوات', kind: 'submenu-trigger' },
  { value: 'save-page', label: 'حفظ الصفحة...', parentValue: 'more-tools' },
  {
    value: 'create-shortcut',
    label: 'إنشاء اختصار...',
    parentValue: 'more-tools',
  },
  {
    value: 'developer-tools',
    label: 'أدوات المطور',
    parentValue: 'more-tools',
  },
  {
    value: 'show-bookmarks',
    label: 'إظهار الإشارات المرجعية',
    kind: 'checkbox',
    isChecked: true,
  },
  {
    value: 'show-full-urls',
    label: 'إظهار عناوين URL الكاملة',
    kind: 'checkbox',
  },
  {
    value: 'pedro',
    label: 'Pedro Duarte',
    kind: 'radio',
    radioGroupValue: 'people',
    isChecked: true,
  },
  {
    value: 'colm',
    label: 'Colm Tuite',
    kind: 'radio',
    radioGroupValue: 'people',
  },
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

const triggerContent = (label = 'Right click here'): ReadonlyArray<Html> => {
  const h = html<never>()

  return [
    h.span([h.Class('hidden pointer-fine:inline-block')], [label]),
    h.span(
      [h.Class('hidden pointer-coarse:inline-block')],
      [label.replace('Right click', 'Long press')],
    ),
  ]
}

const sourceItem = (
  items: ReadonlyArray<ExampleItem>,
  item: MenuItemDescriptor,
): ExampleItem =>
  items.find(candidate => candidate.value === item.value) ?? item

const itemRootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  source: ExampleItem,
  itemAttributes: ContextMenu.MenuItemAttributes<Message>,
  reservesLeadingIconSlot: boolean,
): ReadonlyArray<Attribute<Message>> =>
  reservesLeadingIconSlot && source.icon === undefined
    ? [...itemAttributes.root, h.DataAttribute('inset', 'true')]
    : itemAttributes.root

const itemContent = <Message>(
  source: ExampleItem,
  itemAttributes: ContextMenu.MenuItemAttributes<Message>,
): ReadonlyArray<Html> => {
  const h = html<Message>()
  const kind = ContextMenu.itemKind(itemAttributes.item)
  const indicator =
    kind === 'checkbox' || kind === 'radio'
      ? h.span([...itemAttributes.indicator], [ContextMenu.checkIcon([])])
      : h.span([], [])
  const maybeIcon = source.icon === undefined ? [] : [icon(source.icon)]
  const maybeShortcut =
    source.shortcut === undefined
      ? []
      : [h.span([...itemAttributes.shortcut], [source.shortcut])]
  const maybeSubmenuIcon =
    kind === 'submenu-trigger'
      ? [ContextMenu.chevronRightIcon(itemAttributes.submenuIndicator)]
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
  popup: ContextMenu.MenuPopupAttributes<Message>,
  submenus: ReadonlyArray<ContextMenu.MenuPopupAttributes<Message>> = [],
): ReadonlyArray<Html> => {
  const h = html<Message>()

  if (!popup.isMounted) {
    return []
  }

  const reservesLeadingIconSlot = items.some(item => item.icon !== undefined)

  return [
    ...(popup.parentValue === undefined
      ? [h.div([...popup.backdrop.root], [])]
      : []),
    h.div(
      [...popup.positioner.root],
      [
        h.div(
          [...popup.popup.root],
          [
            h.div(
              [...popup.group],
              popup.items.flatMap(itemAttributes => {
                const source = sourceItem(items, itemAttributes.item)
                const separator =
                  source.separatorBefore === true
                    ? [h.div([...popup.separator], [])]
                    : []

                return [
                  ...separator,
                  h.div(
                    itemRootAttributes(
                      h,
                      source,
                      itemAttributes,
                      reservesLeadingIconSlot,
                    ),
                    itemContent(source, itemAttributes),
                  ),
                ]
              }),
            ),
            ...submenus.flatMap(submenu => popupView(items, submenu)),
          ],
        ),
      ],
    ),
  ]
}

const contextMenuExampleWithController = <Message = never>(
  id: string,
  items: ReadonlyArray<ExampleItem>,
  options: Partial<ContextMenu.ViewConfig<Message>> &
    Readonly<{
      trigger?: ReadonlyArray<ExampleChild>
      triggerLabel?: string
      defaultOpen?: boolean
      defaultOpenSubmenuValues?: ReadonlyArray<string>
    }> = {},
  controller?: ContextMenuExampleController<Message>,
): Html => {
  const h = html<Message>()
  const {
    defaultOpen = true,
    defaultOpenSubmenuValues = [],
    trigger,
    triggerLabel,
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

  return ContextMenu.view<Message>({
    id,
    items: resolvedItems,
    open,
    contextPoint:
      controller === undefined
        ? ContextMenu.contextPoint(24, 32, 24, 32, 'mouse')
        : Option.getOrUndefined(controller.contextPointFor(id)),
    highlightedValue,
    openSubmenuValues,
    triggerClassName,
    ...(controller === undefined
      ? {}
      : {
          onOpenChange: change => controller.onOpenChange(id, change),
          onHighlightChange: change => controller.onHighlightChange(id, change),
          onPointerChange: point => controller.onContextPointChange(id, point),
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
          h.div(
            [...attributes.trigger],
            trigger ?? triggerContent(triggerLabel),
          ),
          h.div(
            [...attributes.portal],
            [
              ...popupView(
                resolvedItems,
                attributes.popup,
                attributes.submenus,
              ),
            ],
          ),
        ],
      ),
  })
}

export const ContextMenuBasic = <Message = never>(
  controller?: ContextMenuExampleController<Message>,
): Html =>
  contextMenuExampleWithController(
    'context-menu-basic',
    basicItems,
    { defaultOpen: controller === undefined },
    controller,
  )

export const ContextMenuCheckboxes = <Message = never>(
  controller?: ContextMenuExampleController<Message>,
): Html =>
  contextMenuExampleWithController(
    'context-menu-checkboxes',
    checkboxItems,
    {},
    controller,
  )

export const ContextMenuDemo = <Message = never>(
  controller?: ContextMenuExampleController<Message>,
): Html =>
  contextMenuExampleWithController(
    'context-menu-demo',
    demoItems,
    {
      contentClassName: 'w-48',
      highlightedValue: 'more-tools',
      defaultOpenSubmenuValues: ['more-tools'],
    },
    controller,
  )

export const ContextMenuDestructive = <Message = never>(
  controller?: ContextMenuExampleController<Message>,
): Html =>
  contextMenuExampleWithController(
    'context-menu-destructive',
    destructiveItems,
    {
      variant: 'destructive',
    },
    controller,
  )

export const ContextMenuGroups = <Message = never>(
  controller?: ContextMenuExampleController<Message>,
): Html =>
  contextMenuExampleWithController(
    'context-menu-groups',
    groupItems,
    {},
    controller,
  )

export const ContextMenuIcons = <Message = never>(
  controller?: ContextMenuExampleController<Message>,
): Html =>
  contextMenuExampleWithController(
    'context-menu-icons',
    iconItems,
    {},
    controller,
  )

export const ContextMenuRadio = <Message = never>(
  controller?: ContextMenuExampleController<Message>,
): Html =>
  contextMenuExampleWithController(
    'context-menu-radio',
    radioItems,
    {},
    controller,
  )

export const ContextMenuRtl = <Message = never>(
  controller?: ContextMenuExampleController<Message>,
): Html =>
  contextMenuExampleWithController(
    'context-menu-rtl',
    rtlItems,
    {
      contentClassName: 'w-48',
      dir: 'rtl',
      highlightedValue: 'navigation',
      defaultOpenSubmenuValues: ['navigation', 'more-tools'],
      trigger: triggerContent('انقر بزر الماوس الأيمن هنا'),
    },
    controller,
  )

export const ContextMenuShortcuts = <Message = never>(
  controller?: ContextMenuExampleController<Message>,
): Html =>
  contextMenuExampleWithController(
    'context-menu-shortcuts',
    shortcutItems,
    {},
    controller,
  )

export const ContextMenuSides = <Message = never>(
  controller?: ContextMenuExampleController<Message>,
): Html => {
  const h = html<Message>()
  const sides: ReadonlyArray<ContextMenu.MenuSide> = [
    'top',
    'right',
    'bottom',
    'left',
  ]

  return h.div(
    [h.Class('grid w-full max-w-sm grid-cols-2 gap-4')],
    sides.map(side =>
      contextMenuExampleWithController(
        `context-menu-sides-${side}`,
        basicItems,
        {
          side,
          triggerLabel: `Right click (${side})`,
        },
        controller,
      ),
    ),
  )
}

export const ContextMenuSubmenu = <Message = never>(
  controller?: ContextMenuExampleController<Message>,
): Html =>
  contextMenuExampleWithController(
    'context-menu-submenu',
    submenuItems,
    {
      highlightedValue: 'more-tools',
      defaultOpenSubmenuValues: ['more-tools'],
    },
    controller,
  )

export const contextMenuExampleViews: ReadonlyArray<ExampleDefinition> = [
  {
    id: 'shadcn/context-menu-basic',
    title: 'ContextMenuBasic',
    view: ContextMenuBasic,
  },
  {
    id: 'shadcn/context-menu-checkboxes',
    title: 'ContextMenuCheckboxes',
    view: ContextMenuCheckboxes,
  },
  {
    id: 'shadcn/context-menu-demo',
    title: 'ContextMenuDemo',
    view: ContextMenuDemo,
  },
  {
    id: 'shadcn/context-menu-destructive',
    title: 'ContextMenuDestructive',
    view: ContextMenuDestructive,
  },
  {
    id: 'shadcn/context-menu-groups',
    title: 'ContextMenuGroups',
    view: ContextMenuGroups,
  },
  {
    id: 'shadcn/context-menu-icons',
    title: 'ContextMenuIcons',
    view: ContextMenuIcons,
  },
  {
    id: 'shadcn/context-menu-radio',
    title: 'ContextMenuRadio',
    view: ContextMenuRadio,
  },
  {
    id: 'shadcn/context-menu-rtl',
    title: 'ContextMenuRtl',
    view: ContextMenuRtl,
  },
  {
    id: 'shadcn/context-menu-shortcuts',
    title: 'ContextMenuShortcuts',
    view: ContextMenuShortcuts,
  },
  {
    id: 'shadcn/context-menu-sides',
    title: 'ContextMenuSides',
    view: ContextMenuSides,
  },
  {
    id: 'shadcn/context-menu-submenu',
    title: 'ContextMenuSubmenu',
    view: ContextMenuSubmenu,
  },
]
