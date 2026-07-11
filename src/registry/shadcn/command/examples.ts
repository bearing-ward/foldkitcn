import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { view as Button } from '../button'
import type { DialogOpenChange } from '../dialog'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './index'

type CommandExampleDefinition = Readonly<{
  id: string
  title: string
  view: () => Html
}>

export type CommandDialogExampleController<Message> = Readonly<{
  id?: string
  isOpen?: boolean
  query?: string
  onOpen?: Message
  onOpenChange?: (change: DialogOpenChange) => Message
  onQueryChange?: (value: string) => Message
}>

type IconName =
  | 'bell'
  | 'calculator'
  | 'calendar'
  | 'clipboard-paste'
  | 'code'
  | 'copy'
  | 'credit-card'
  | 'file-text'
  | 'folder'
  | 'folder-plus'
  | 'help-circle'
  | 'home'
  | 'image'
  | 'inbox'
  | 'layout-grid'
  | 'list'
  | 'plus'
  | 'scissors'
  | 'settings'
  | 'smile'
  | 'trash'
  | 'user'
  | 'zoom-in'
  | 'zoom-out'

type CommandItemDefinition = Readonly<{
  label: string
  icon?: IconName
  shortcut?: string
  isDisabled?: boolean
}>

type CommandGroupDefinition = Readonly<{
  heading: string
  items: ReadonlyArray<CommandItemDefinition>
}>

const commandSuggestions: CommandGroupDefinition = {
  heading: 'Suggestions',
  items: [
    { label: 'Calendar', icon: 'calendar' },
    { label: 'Search Emoji', icon: 'smile' },
    { label: 'Calculator', icon: 'calculator', isDisabled: true },
  ],
}

const commandSettings: CommandGroupDefinition = {
  heading: 'Settings',
  items: [
    { label: 'Profile', icon: 'user', shortcut: '⌘P' },
    { label: 'Billing', icon: 'credit-card', shortcut: '⌘B' },
    { label: 'Settings', icon: 'settings', shortcut: '⌘S' },
  ],
}

const manyCommandGroups: ReadonlyArray<CommandGroupDefinition> = [
  {
    heading: 'Navigation',
    items: [
      { label: 'Home', icon: 'home', shortcut: '⌘H' },
      { label: 'Inbox', icon: 'inbox', shortcut: '⌘I' },
      { label: 'Documents', icon: 'file-text', shortcut: '⌘D' },
      { label: 'Folders', icon: 'folder', shortcut: '⌘F' },
    ],
  },
  {
    heading: 'Actions',
    items: [
      { label: 'New File', icon: 'plus', shortcut: '⌘N' },
      { label: 'New Folder', icon: 'folder-plus', shortcut: '⇧⌘N' },
      { label: 'Copy', icon: 'copy', shortcut: '⌘C' },
      { label: 'Cut', icon: 'scissors', shortcut: '⌘X' },
      { label: 'Paste', icon: 'clipboard-paste', shortcut: '⌘V' },
      { label: 'Delete', icon: 'trash', shortcut: '⌫' },
    ],
  },
  {
    heading: 'View',
    items: [
      { label: 'Grid View', icon: 'layout-grid' },
      { label: 'List View', icon: 'list' },
      { label: 'Zoom In', icon: 'zoom-in', shortcut: '⌘+' },
      { label: 'Zoom Out', icon: 'zoom-out', shortcut: '⌘-' },
    ],
  },
  {
    heading: 'Account',
    items: [
      { label: 'Profile', icon: 'user', shortcut: '⌘P' },
      { label: 'Billing', icon: 'credit-card', shortcut: '⌘B' },
      { label: 'Settings', icon: 'settings', shortcut: '⌘S' },
      { label: 'Notifications', icon: 'bell' },
      { label: 'Help & Support', icon: 'help-circle' },
    ],
  },
  {
    heading: 'Tools',
    items: [
      { label: 'Calculator', icon: 'calculator' },
      { label: 'Calendar', icon: 'calendar' },
      { label: 'Image Editor', icon: 'image' },
      { label: 'Code Editor', icon: 'code' },
    ],
  },
]

const arabicCommand = {
  dir: 'rtl',
  values: {
    placeholder: 'اكتب أمرًا أو ابحث...',
    empty: 'لم يتم العثور على نتائج.',
    suggestions: 'اقتراحات',
    calendar: 'التقويم',
    searchEmoji: 'البحث عن الرموز التعبيرية',
    calculator: 'الآلة الحاسبة',
    settings: 'الإعدادات',
    profile: 'الملف الشخصي',
    billing: 'الفوترة',
  },
} satisfies Readonly<{
  dir: 'rtl'
  values: Readonly<Record<string, string>>
}>

const iconPathByName: Readonly<Record<IconName, string>> = {
  bell: 'M10.3 21a1.9 1.9 0 0 0 3.4 0 M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9',
  calculator:
    'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2 M8 6h8 M8 10h2 M12 10h2 M16 10h0 M8 14h2 M12 14h2 M16 14h0 M8 18h2 M12 18h2 M16 18h0',
  calendar:
    'M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2',
  'clipboard-paste':
    'M8 4h8v4H8z M9 14h6 M12 11v6 M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2',
  code: 'm16 18 6-6-6-6 M8 6l-6 6 6 6',
  copy: 'M8 8h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2 M4 16c-1.1 0-2-.9-2-2V4a2 2 0 0 1 2-2h10c1.1 0 2 .9 2 2',
  'credit-card':
    'M2 7h20 M2 10h20 M6 15h2 M11 15h4 M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2',
  'file-text':
    'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M8 13h8 M8 17h8 M8 9h1',
  folder: 'M3 7h6l2 2h10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  'folder-plus':
    'M3 7h6l2 2h10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M12 12v6 M9 15h6',
  'help-circle':
    'M9 9a3 3 0 1 1 5 2c-1 1-2 1.5-2 3 M12 17h.01 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
  home: 'M3 11 12 3l9 8 M5 10v10h14V10 M9 20v-6h6v6',
  image: 'M4 5h16v14H4z M8 13l2-2 3 3 2-2 5 5 M8 8h.01',
  inbox:
    'M22 12h-6l-2 3h-4l-2-3H2 M5 5h14l3 7v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5z',
  'layout-grid': 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z',
  list: 'M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01',
  plus: 'M12 5v14 M5 12h14',
  scissors:
    'M4 4l16 16 M20 4 8.5 15.5 M6 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4 M6 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4',
  settings:
    'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M4 12h2 M18 12h2 M12 4v2 M12 18v2 M6.3 6.3l1.4 1.4 M16.3 16.3l1.4 1.4 M17.7 6.3l-1.4 1.4 M7.7 16.3l-1.4 1.4',
  smile:
    'M8 14s1.5 2 4 2 4-2 4-2 M9 9h.01 M15 9h.01 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
  trash: 'M3 6h18 M8 6V4h8v2 M6 6l1 16h10l1-16',
  user: 'M20 21a8 8 0 0 0-16 0 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
  'zoom-in':
    'M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16 M21 21l-4.3-4.3 M11 8v6 M8 11h6',
  'zoom-out': 'M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16 M21 21l-4.3-4.3 M8 11h6',
}

const icon = (name: IconName): Html => {
  const h = html<never>()
  const className = `lucide lucide-${name}`

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
      h.Class(className),
    ],
    [h.path([h.D(iconPathByName[name])], [])],
  )
}

const commandItem = (
  item: CommandItemDefinition,
  config: Readonly<{ dir?: 'rtl' }> = {},
): Html =>
  CommandItem<never>({
    ...(item.isDisabled === undefined ? {} : { isDisabled: item.isDisabled }),
    ...(config.dir === undefined ? {} : { dir: config.dir }),
    children: [
      ...(item.icon === undefined ? [] : [icon(item.icon)]),
      html<never>().span([], [item.label]),
      ...(item.shortcut === undefined
        ? []
        : [
            CommandShortcut<never>({
              ...(config.dir === undefined ? {} : { dir: config.dir }),
              children: [item.shortcut],
            }),
          ]),
    ],
  })

const commandGroup = (
  group: CommandGroupDefinition,
  config: Readonly<{ dir?: 'rtl' }> = {},
): Html =>
  CommandGroup<never>({
    heading: group.heading,
    children: group.items.map(item => commandItem(item, config)),
  })

const commandMenu = <Message = never>(
  groups: ReadonlyArray<CommandGroupDefinition>,
  config: Readonly<{
    dir?: 'rtl'
    placeholder?: string
    empty?: string
    className?: string
    query?: string
    onQueryChange?: (value: string) => Message
    isAutofocus?: boolean
  }> = {},
): Html => {
  const normalizedQuery = (config.query ?? '').trim().toLowerCase()
  const filteredGroups = groups
    .map(group => ({
      ...group,
      items: group.items.filter(item =>
        item.label.toLowerCase().includes(normalizedQuery),
      ),
    }))
    .filter(group => group.items.length > 0)

  return Command<Message>({
    className: config.className ?? 'max-w-sm rounded-lg border',
    ...(config.dir === undefined ? {} : { dir: config.dir }),
    children: [
      CommandInput<Message>({
        placeholder: config.placeholder ?? 'Type a command or search...',
        value: config.query ?? '',
        isAutofocus: config.isAutofocus ?? false,
        ...(config.onQueryChange === undefined
          ? {}
          : { onQueryChange: config.onQueryChange }),
        ...(config.dir === undefined ? {} : { dir: config.dir }),
      }),
      CommandList<Message>({
        children:
          filteredGroups.length === 0
            ? [
                CommandEmpty<Message>({
                  children: [config.empty ?? 'No results found.'],
                }),
              ]
            : filteredGroups.flatMap((group, index) => [
                ...(index === 0 ? [] : [CommandSeparator<never>()]),
                commandGroup(
                  group,
                  config.dir === undefined ? {} : { dir: config.dir },
                ),
              ]),
      }),
    ],
  })
}

const commandMenuControllerConfig = <Message>(
  controller: CommandDialogExampleController<Message> | undefined,
): Readonly<{
  query: string
  onQueryChange?: (value: string) => Message
  isAutofocus: boolean
}> => ({
  query: controller?.query ?? '',
  isAutofocus: true,
  ...(controller?.onQueryChange === undefined
    ? {}
    : { onQueryChange: controller.onQueryChange }),
})

const openMenuButton = <Message = never>(
  controller?: CommandDialogExampleController<Message>,
): Html =>
  Button<Message>({
    variant: 'outline',
    className: 'w-fit',
    ...(controller?.onOpen === undefined ? {} : { onClick: controller.onOpen }),
    toView: attributes =>
      html<Message>().button([...attributes.button], ['Open Menu']),
  })

const commandDialogShell = <Message = never>(
  controller: CommandDialogExampleController<Message> | undefined,
  children: ReadonlyArray<Html>,
): Html => {
  if (controller === undefined) {
    return html<Message>().empty
  }

  return CommandDialog<Message>({
    id: controller?.id ?? 'command-example-dialog',
    open: controller?.isOpen ?? false,
    ...(controller?.onOpenChange === undefined
      ? {}
      : { onOpenChange: controller.onOpenChange }),
    children,
  })
}

const commandButtonDialogExample = <Message = never>(
  controller: CommandDialogExampleController<Message> | undefined,
  content: Html,
): Html => {
  const h = html<Message>()

  return h.div(
    [h.Class('flex flex-col gap-4')],
    [openMenuButton(controller), commandDialogShell(controller, [content])],
  )
}

export const CommandManyItemsMenu = (): Html => commandMenu(manyCommandGroups)

export const CommandDemo = (): Html =>
  commandMenu([commandSuggestions, commandSettings])

export const CommandBasic = <Message = never>(
  controller?: CommandDialogExampleController<Message>,
): Html => {
  const h = html<Message>()

  return h.div(
    [h.Class('flex flex-col gap-4')],
    [
      openMenuButton(controller),
      commandDialogShell(controller, [
        commandMenu<Message>(
          [
            {
              heading: 'Suggestions',
              items: [
                { label: 'Calendar' },
                { label: 'Search Emoji' },
                { label: 'Calculator' },
              ],
            },
          ],
          commandMenuControllerConfig(controller),
        ),
      ]),
    ],
  )
}

export const CommandDialogDemo = <Message = never>(
  controller?: CommandDialogExampleController<Message>,
): Html => {
  const h = html<Message>()

  const shortcutHint = h.p(
    [h.Class('text-sm text-muted-foreground')],
    [
      'Press ',
      h.kbd(
        [
          h.Class(
            'pointer-events-none inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 select-none',
          ),
        ],
        [h.span([h.Class('text-xs')], ['⌘']), 'J'],
      ),
    ],
  )

  if (controller === undefined) {
    return shortcutHint
  }

  return h.div(
    [h.Class('flex flex-col gap-4')],
    [
      shortcutHint,
      commandDialogShell(controller, [
        commandMenu<Message>(
          [commandSuggestions, commandSettings],
          commandMenuControllerConfig(controller),
        ),
      ]),
    ],
  )
}

export const CommandWithGroups = <Message = never>(
  controller?: CommandDialogExampleController<Message>,
): Html =>
  commandButtonDialogExample(
    controller,
    commandMenu<Message>(
      [commandSuggestions, commandSettings],
      commandMenuControllerConfig(controller),
    ),
  )

export const CommandManyItems = <Message = never>(
  controller?: CommandDialogExampleController<Message>,
): Html =>
  commandButtonDialogExample(
    controller,
    commandMenu<Message>(
      manyCommandGroups,
      commandMenuControllerConfig(controller),
    ),
  )

export const CommandRtl = (): Html => {
  const { dir, values } = arabicCommand
  const groups: ReadonlyArray<CommandGroupDefinition> = [
    {
      heading: values.suggestions,
      items: [
        { label: values.calendar, icon: 'calendar' },
        { label: values.searchEmoji, icon: 'smile' },
        { label: values.calculator, icon: 'calculator', isDisabled: true },
      ],
    },
    {
      heading: values.settings,
      items: [
        { label: values.profile, icon: 'user', shortcut: '⌘P' },
        { label: values.billing, icon: 'credit-card', shortcut: '⌘B' },
        { label: values.settings, icon: 'settings', shortcut: '⌘S' },
      ],
    },
  ]

  return commandMenu(groups, {
    dir,
    placeholder: values.placeholder,
    empty: values.empty,
  })
}

export const CommandWithShortcuts = <Message = never>(
  controller?: CommandDialogExampleController<Message>,
): Html =>
  commandButtonDialogExample(
    controller,
    commandMenu<Message>(
      [
        {
          heading: 'Settings',
          items: commandSettings.items,
        },
      ],
      commandMenuControllerConfig(controller),
    ),
  )

export const commandExampleViews: ReadonlyArray<CommandExampleDefinition> = [
  {
    id: 'shadcn/command-demo',
    title: 'CommandDemo',
    view: CommandDemo,
  },
  {
    id: 'shadcn/command-basic',
    title: 'CommandBasic',
    view: CommandBasic,
  },
  {
    id: 'shadcn/command-dialog',
    title: 'CommandDialogDemo',
    view: CommandDialogDemo,
  },
  {
    id: 'shadcn/command-groups',
    title: 'CommandWithGroups',
    view: CommandWithGroups,
  },
  {
    id: 'shadcn/command-scrollable',
    title: 'CommandManyItems',
    view: CommandManyItems,
  },
  {
    id: 'shadcn/command-rtl',
    title: 'CommandRtl',
    view: CommandRtl,
  },
  {
    id: 'shadcn/command-shortcuts',
    title: 'CommandWithShortcuts',
    view: CommandWithShortcuts,
  },
]
