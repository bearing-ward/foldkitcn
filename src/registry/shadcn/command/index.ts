import { Array, Match as M, Option, Schema as S, String, pipe } from 'effect'
import type { Command as FoldkitCommand } from 'foldkit'
import type { Attribute, Html, KeyboardModifiers } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'

import { cn } from '../../../utils/cn'
import * as Dialog from '../dialog'
import * as InputGroup from '../input-group'

// MODEL

type Child = Html | string

export const CommandKey = S.Union([
  S.Literal('ArrowDown'),
  S.Literal('ArrowUp'),
  S.Literal('Home'),
  S.Literal('End'),
  S.Literal('Enter'),
  S.Literal('Escape'),
])
export type CommandKey = typeof CommandKey.Type

export const commandKeyValues: ReadonlyArray<CommandKey> = [
  'ArrowDown',
  'ArrowUp',
  'Home',
  'End',
  'Enter',
  'Escape',
]

export const CommandItemDescriptor = S.Struct({
  value: S.String,
  label: S.String,
  keywords: S.optional(S.Array(S.String)),
  shortcut: S.optional(S.String),
  isDisabled: S.optional(S.Boolean),
})
export type CommandItemDescriptor = typeof CommandItemDescriptor.Type

export const CommandGroupDescriptor = S.Struct({
  heading: S.optional(S.String),
  items: S.Array(CommandItemDescriptor),
})
export type CommandGroupDescriptor = typeof CommandGroupDescriptor.Type

export const CommandState = S.Struct({
  query: S.String,
  highlightedValue: S.OptionFromNullOr(S.String),
  selectedValue: S.OptionFromNullOr(S.String),
  isDialogOpen: S.Boolean,
})
export type CommandState = typeof CommandState.Type

export const CommandStateOptions = S.Struct({
  query: S.optional(S.String),
  highlightedValue: S.optional(S.OptionFromNullOr(S.String)),
  selectedValue: S.optional(S.OptionFromNullOr(S.String)),
  isDialogOpen: S.optional(S.Boolean),
})
export type CommandStateOptions = typeof CommandStateOptions.Type

const normalizedQuery = (query: string): string =>
  String.trim(query).toLowerCase()

const itemSearchText = (item: CommandItemDescriptor): string =>
  [item.value, item.label, ...(item.keywords ?? [])].join(' ')

const itemMatchesQuery = (
  item: CommandItemDescriptor,
  query: string,
): boolean => {
  const needle = normalizedQuery(query)

  return String.isEmpty(needle)
    ? true
    : itemSearchText(item).toLowerCase().includes(needle)
}

export const filterCommandGroups = (
  groups: ReadonlyArray<CommandGroupDescriptor>,
  query: string,
): ReadonlyArray<CommandGroupDescriptor> =>
  pipe(
    groups,
    Array.map(group => {
      const items = pipe(
        group.items,
        Array.filter(item => itemMatchesQuery(item, query)),
      )

      return { ...group, items }
    }),
    Array.filter(group => Array.isReadonlyArrayNonEmpty(group.items)),
  )

export const enabledCommandItems = (
  groups: ReadonlyArray<CommandGroupDescriptor>,
): ReadonlyArray<CommandItemDescriptor> =>
  pipe(
    groups,
    Array.flatMap(group => group.items),
    Array.filter(item => item.isDisabled !== true),
  )

export const highlightedCommandItem = (
  groups: ReadonlyArray<CommandGroupDescriptor>,
  state: Pick<CommandState, 'highlightedValue'>,
): Option.Option<CommandItemDescriptor> =>
  pipe(
    state.highlightedValue,
    Option.flatMap(value =>
      pipe(
        enabledCommandItems(groups),
        Array.findFirst(item => item.value === value),
      ),
    ),
  )

const firstEnabledValue = (
  groups: ReadonlyArray<CommandGroupDescriptor>,
): Option.Option<string> =>
  pipe(
    enabledCommandItems(groups),
    Array.head,
    Option.map(item => item.value),
  )

const lastEnabledValue = (
  groups: ReadonlyArray<CommandGroupDescriptor>,
): Option.Option<string> =>
  pipe(
    enabledCommandItems(groups),
    Array.last,
    Option.map(item => item.value),
  )

const highlightedIndex = (
  items: ReadonlyArray<CommandItemDescriptor>,
  highlightedValue: Option.Option<string>,
): number =>
  Option.match(highlightedValue, {
    onNone: () => -1,
    onSome: value => items.findIndex(item => item.value === value),
  })

const wrappedIndex = (index: number, length: number): number => {
  if (length === 0) {
    return -1
  }

  if (index < 0) {
    return length - 1
  }

  if (index >= length) {
    return 0
  }

  return index
}

const movedHighlightedValue = (
  groups: ReadonlyArray<CommandGroupDescriptor>,
  state: CommandState,
  delta: number,
): Option.Option<string> => {
  const items = enabledCommandItems(groups)
  const index = highlightedIndex(items, state.highlightedValue)
  const nextIndex = wrappedIndex(index + delta, items.length)

  return nextIndex === -1
    ? Option.none()
    : Option.some(items[nextIndex]?.value ?? '')
}

export const commandState = (
  groups: ReadonlyArray<CommandGroupDescriptor>,
  options: CommandStateOptions = {},
): CommandState => {
  const query = options.query ?? ''
  const filteredGroups = filterCommandGroups(groups, query)

  return {
    query,
    highlightedValue:
      options.highlightedValue ?? firstEnabledValue(filteredGroups),
    selectedValue: options.selectedValue ?? Option.none(),
    isDialogOpen: options.isDialogOpen ?? false,
  }
}

export const selectedCommandState = (
  state: CommandState,
  value: string,
): CommandState => ({
  ...state,
  selectedValue: Option.some(value),
  highlightedValue: Option.some(value),
  isDialogOpen: false,
})

export const queriedCommandState = (
  groups: ReadonlyArray<CommandGroupDescriptor>,
  state: CommandState,
  query: string,
): CommandState => {
  const filteredGroups = filterCommandGroups(groups, query)

  return {
    ...state,
    query,
    highlightedValue: firstEnabledValue(filteredGroups),
  }
}

// MESSAGE

export const UpdatedCommandQuery = m('UpdatedCommandQuery', {
  value: S.String,
})
export const PressedCommandKey = m('PressedCommandKey', {
  key: S.String,
})
export const SelectedCommandItem = m('SelectedCommandItem', {
  value: S.String,
})
export const OpenedCommandDialog = m('OpenedCommandDialog')
export const ClosedCommandDialog = m('ClosedCommandDialog')
export const CommandMessage = S.Union([
  UpdatedCommandQuery,
  PressedCommandKey,
  SelectedCommandItem,
  OpenedCommandDialog,
  ClosedCommandDialog,
])
export type CommandMessage = typeof CommandMessage.Type

// UPDATE

export type UpdateReturn = readonly [
  CommandState,
  ReadonlyArray<FoldkitCommand.Command<CommandMessage>>,
]

const withUpdateReturn = M.withReturnType<UpdateReturn>()

export const commandKeyMessage = (key: string): Option.Option<CommandMessage> =>
  commandKeyValues.some(value => value === key)
    ? Option.some(PressedCommandKey({ key }))
    : Option.none()

export const updateWithGroups = (
  groups: ReadonlyArray<CommandGroupDescriptor>,
  state: CommandState,
  message: CommandMessage,
): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      UpdatedCommandQuery: ({ value }) => [
        queriedCommandState(groups, state, value),
        [],
      ],
      PressedCommandKey: ({ key }) => {
        const filteredGroups = filterCommandGroups(groups, state.query)

        if (key === 'ArrowDown') {
          return [
            {
              ...state,
              highlightedValue: movedHighlightedValue(filteredGroups, state, 1),
            },
            [],
          ]
        }

        if (key === 'ArrowUp') {
          return [
            {
              ...state,
              highlightedValue: movedHighlightedValue(
                filteredGroups,
                state,
                -1,
              ),
            },
            [],
          ]
        }

        if (key === 'Home') {
          return [
            { ...state, highlightedValue: firstEnabledValue(filteredGroups) },
            [],
          ]
        }

        if (key === 'End') {
          return [
            { ...state, highlightedValue: lastEnabledValue(filteredGroups) },
            [],
          ]
        }

        if (key === 'Escape') {
          return [{ ...state, isDialogOpen: false }, []]
        }

        if (key === 'Enter') {
          return Option.match(highlightedCommandItem(filteredGroups, state), {
            onNone: () => [state, []],
            onSome: item => [selectedCommandState(state, item.value), []],
          })
        }

        return [state, []]
      },
      SelectedCommandItem: ({ value }) => [
        selectedCommandState(state, value),
        [],
      ],
      OpenedCommandDialog: () => [{ ...state, isDialogOpen: true }, []],
      ClosedCommandDialog: () => [{ ...state, isDialogOpen: false }, []],
    }),
  )

export const update = (
  state: CommandState,
  message: CommandMessage,
): UpdateReturn => updateWithGroups([], state, message)

// VIEW

export const CommandStyleOptions = S.Struct({
  className: S.optional(S.String),
  dir: S.optional(S.String),
})
export type CommandStyleOptions = typeof CommandStyleOptions.Type

export const CommandInputStyleOptions = S.Struct({
  className: S.optional(S.String),
  wrapperClassName: S.optional(S.String),
  dir: S.optional(S.String),
  isAutofocus: S.optional(S.Boolean),
})
export type CommandInputStyleOptions = typeof CommandInputStyleOptions.Type

export const CommandPartStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type CommandPartStyleOptions = typeof CommandPartStyleOptions.Type

export const CommandItemStyleOptions = S.Struct({
  className: S.optional(S.String),
  dir: S.optional(S.String),
  isDisabled: S.optional(S.Boolean),
  isSelected: S.optional(S.Boolean),
  isChecked: S.optional(S.Boolean),
})
export type CommandItemStyleOptions = typeof CommandItemStyleOptions.Type

export type CommandAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
}>

export type CommandInputAttributes<Message> = Readonly<{
  wrapper: ReadonlyArray<Attribute<Message>>
  inputGroup: ReadonlyArray<Attribute<Message>>
  input: ReadonlyArray<Attribute<Message>>
  addon: ReadonlyArray<Attribute<Message>>
}>

export type CommandPartAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
}>

export type CommandItemAttributes<Message> = Readonly<{
  item: ReadonlyArray<Attribute<Message>>
}>

export type ViewConfig<Message> = CommandStyleOptions &
  Readonly<{
    children?: ReadonlyArray<Child>
    attributes?: ReadonlyArray<Attribute<Message>>
    toView?: (attributes: CommandAttributes<Message>) => Html
  }>

export type CommandInputConfig<Message> = CommandInputStyleOptions &
  Readonly<{
    value?: string
    placeholder?: string
    ariaLabel?: string
    attributes?: ReadonlyArray<Attribute<Message>>
    onQueryChange?: (value: string) => Message
    onKeyDown?: (
      key: string,
      modifiers: KeyboardModifiers,
    ) => Option.Option<Message>
    toView?: (attributes: CommandInputAttributes<Message>) => Html
  }>

export type CommandPartConfig<Message> = CommandPartStyleOptions &
  Readonly<{
    children?: ReadonlyArray<Child>
    attributes?: ReadonlyArray<Attribute<Message>>
    toView?: (attributes: CommandPartAttributes<Message>) => Html
  }>

export type CommandGroupConfig<Message> = CommandPartConfig<Message> &
  Readonly<{
    heading?: string
  }>

export type CommandItemConfig<Message> = CommandItemStyleOptions &
  Readonly<{
    value?: string
    children?: ReadonlyArray<Child>
    attributes?: ReadonlyArray<Attribute<Message>>
    onSelect?: Message
    toView?: (attributes: CommandItemAttributes<Message>) => Html
  }>

export type CommandShortcutConfig<Message> = CommandPartConfig<Message> &
  Readonly<{
    dir?: string
  }>

export type CommandDialogConfig<Message> = Omit<
  Dialog.ViewConfig<Message>,
  'toView' | 'showCloseButton' | 'contentClassName'
> &
  Readonly<{
    children?: ReadonlyArray<Child>
    contentClassName?: string
    title?: string
    description?: string
  }>

export const commandBaseClassName =
  'flex size-full flex-col overflow-hidden rounded-xl! bg-popover p-1 text-popover-foreground'

export const commandDialogContentBaseClassName =
  'top-1/3 translate-y-0 overflow-hidden rounded-xl! p-0'

const commandDialogShellStyle = {
  position: 'fixed',
  inset: '0',
  zIndex: '1000',
  width: '100vw',
  maxWidth: 'none',
  height: '100vh',
  maxHeight: 'none',
  margin: '0',
  border: '0',
  background: 'transparent',
  color: 'inherit',
  overflow: 'visible',
  padding: '0',
}

export const commandInputWrapperBaseClassName = 'p-1 pb-0'

export const commandInputGroupBaseClassName =
  'h-8! rounded-lg! border-input/30 bg-input/30 shadow-none focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 *:data-[slot=input-group-addon]:pl-2!'

export const commandInputGroupRtlBaseClassName =
  'h-8! rounded-lg! border-input/30 bg-input/30 shadow-none focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 *:data-[slot=input-group-addon]:ps-2!'

export const commandInputBaseClassName =
  'w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50'

export const commandListBaseClassName =
  'no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none'

export const commandEmptyBaseClassName = 'py-6 text-center text-sm'

export const commandGroupBaseClassName =
  'overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground'

export const commandSeparatorBaseClassName = '-mx-1 h-px bg-border'

export const commandItemBaseClassName =
  "group/command-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none in-data-[slot=dialog-content]:rounded-lg! data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-selected:bg-muted data-selected:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-selected:*:[svg]:text-foreground"

export const commandShortcutBaseClassName =
  'ml-auto text-xs tracking-widest text-muted-foreground group-data-selected/command-item:text-foreground'

export const commandShortcutRtlBaseClassName =
  'ms-auto text-xs tracking-widest text-muted-foreground group-data-selected/command-item:text-foreground'

export const commandCheckIconClassName =
  'ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100'

export const commandCheckIconRtlClassName =
  'ms-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100'

export const commandClassName = ({
  className,
}: Pick<CommandStyleOptions, 'className'> = {}): string =>
  cn(commandBaseClassName, className)

export const commandDialogContentClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(commandDialogContentBaseClassName, className)

export const commandInputWrapperClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(commandInputWrapperBaseClassName, className)

export const commandInputGroupClassName = ({
  className,
  dir,
}: Readonly<{
  className?: string | undefined
  dir?: string | undefined
}> = {}): string =>
  cn(
    dir === 'rtl'
      ? commandInputGroupRtlBaseClassName
      : commandInputGroupBaseClassName,
    className,
  )

export const commandInputClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(commandInputBaseClassName, className)

export const commandListClassName = ({
  className,
}: CommandPartStyleOptions = {}): string =>
  cn(commandListBaseClassName, className)

export const commandEmptyClassName = ({
  className,
}: CommandPartStyleOptions = {}): string =>
  cn(commandEmptyBaseClassName, className)

export const commandGroupClassName = ({
  className,
}: CommandPartStyleOptions = {}): string =>
  cn(commandGroupBaseClassName, className)

export const commandSeparatorClassName = ({
  className,
}: CommandPartStyleOptions = {}): string =>
  cn(commandSeparatorBaseClassName, className)

export const commandItemClassName = ({
  className,
}: CommandItemStyleOptions = {}): string =>
  cn(commandItemBaseClassName, className)

export const commandShortcutClassName = ({
  className,
  dir,
}: Readonly<{
  className?: string | undefined
  dir?: string | undefined
}> = {}): string =>
  cn(
    dir === 'rtl'
      ? commandShortcutRtlBaseClassName
      : commandShortcutBaseClassName,
    className,
  )

const optionalAttribute = <Message>(
  value: string | undefined,
  toAttribute: (value: string) => Attribute<Message>,
): ReadonlyArray<Attribute<Message>> =>
  value === undefined ? [] : [toAttribute(value)]

const optionalMessageAttribute = <Message>(
  value: Message | undefined,
  toAttribute: (value: Message) => Attribute<Message>,
): ReadonlyArray<Attribute<Message>> =>
  value === undefined ? [] : [toAttribute(value)]

const optionalQueryAttribute = <Message>(
  config: CommandInputConfig<Message>,
): ReadonlyArray<Attribute<Message>> => {
  const h = html<Message>()

  if (config.onQueryChange === undefined) {
    return []
  }

  const { onQueryChange } = config

  return [h.OnInput(value => onQueryChange(value))]
}

const optionalKeyboardAttribute = <Message>(
  config: CommandInputConfig<Message>,
): ReadonlyArray<Attribute<Message>> => {
  const h = html<Message>()

  if (config.onKeyDown === undefined) {
    return []
  }

  const { onKeyDown } = config

  return [
    h.OnKeyDownPreventDefault((key, modifiers) => onKeyDown(key, modifiers)),
  ]
}

const commandAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): CommandAttributes<Message> => ({
  root: [
    h.DataAttribute('slot', 'command'),
    h.Class(commandClassName(config)),
    ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
    ...(config.attributes ?? []),
  ],
})

const commandInputAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: CommandInputConfig<Message>,
): CommandInputAttributes<Message> => ({
  wrapper: [
    h.DataAttribute('slot', 'command-input-wrapper'),
    h.Class(
      commandInputWrapperClassName({ className: config.wrapperClassName }),
    ),
  ],
  inputGroup: [
    h.Role('group'),
    h.DataAttribute('slot', 'input-group'),
    h.Class(
      commandInputGroupClassName({
        className: config.className,
        dir: config.dir,
      }),
    ),
    ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
  ],
  input: [
    h.DataAttribute('slot', 'command-input'),
    h.DataAttribute('cmdk-input', ''),
    h.Role('combobox'),
    h.AriaExpanded(true),
    h.AriaAutocomplete('list'),
    h.Type('text'),
    h.Autofocus(config.isAutofocus ?? false),
    h.Value(config.value ?? ''),
    h.Class(commandInputClassName()),
    ...optionalAttribute<Message>(config.placeholder, value =>
      h.Placeholder(value),
    ),
    ...optionalAttribute<Message>(config.ariaLabel, value =>
      h.AriaLabel(value),
    ),
    ...optionalQueryAttribute(config),
    ...optionalKeyboardAttribute(config),
    ...(config.attributes ?? []),
  ],
  addon: [],
})

const commandPartAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  slot: string,
  role: string | undefined,
  className: string,
  config: CommandPartConfig<Message>,
): CommandPartAttributes<Message> => ({
  root: [
    h.DataAttribute('slot', slot),
    ...(role === undefined ? [] : [h.Role(role)]),
    h.Class(className),
    ...(config.attributes ?? []),
  ],
})

const commandItemAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: CommandItemConfig<Message>,
): CommandItemAttributes<Message> => ({
  item: [
    h.DataAttribute('slot', 'command-item'),
    ...(config.value === undefined
      ? []
      : [h.DataAttribute('value', config.value)]),
    ...(config.isSelected === true ? [h.DataAttribute('selected', '')] : []),
    ...(config.isChecked === true ? [h.DataAttribute('checked', 'true')] : []),
    ...(config.isDisabled === true
      ? [h.DataAttribute('disabled', 'true'), h.AriaDisabled(true)]
      : []),
    h.Role('option'),
    h.AriaSelected(config.isSelected === true),
    h.Tabindex(config.isDisabled === true ? -1 : 0),
    h.Class(commandItemClassName(config)),
    ...optionalMessageAttribute<Message>(config.onSelect, value =>
      h.OnClick(value),
    ),
    ...(config.attributes ?? []),
  ],
})

const iconBase = <Message>(
  className: string,
  children: ReadonlyArray<Html>,
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
      h.Class(className),
    ],
    children,
  )
}

export const searchIcon = <Message>(): Html => {
  const h = html<Message>()

  return iconBase('lucide lucide-search', [
    h.circle([h.Cx('11'), h.Cy('11'), h.R('8')], []),
    h.path([h.D('m21 21-4.3-4.3')], []),
  ])
}

export const checkIcon = <Message>(
  dir: string | undefined = undefined,
): Html => {
  const h = html<Message>()

  return iconBase(
    dir === 'rtl' ? commandCheckIconRtlClassName : commandCheckIconClassName,
    [h.path([h.D('M20 6 9 17l-5-5')], [])],
  )
}

export const view = <Message>(config: ViewConfig<Message> = {}): Html => {
  const h = html<Message>()
  const attributes = commandAttributes(h, config)

  return config.toView === undefined
    ? h.div([...attributes.root], config.children ?? [])
    : config.toView(attributes)
}

export const Command = view

export const CommandInput = <Message>(
  config: CommandInputConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes = commandInputAttributes(h, config)

  if (config.toView !== undefined) {
    return config.toView(attributes)
  }

  return h.div(
    [...attributes.wrapper],
    [
      InputGroup.InputGroup<Message>({
        className: commandInputGroupClassName({
          className: config.className,
          dir: config.dir,
        }),
        dir: config.dir,
        children: [
          h.input([...attributes.input]),
          InputGroup.InputGroupAddon<Message>({
            children: [searchIcon<Message>()],
          }),
        ],
      }),
    ],
  )
}

export const CommandList = <Message>(
  config: CommandPartConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes = commandPartAttributes(
    h,
    'command-list',
    'listbox',
    commandListClassName(config),
    config,
  )

  return config.toView === undefined
    ? h.div([...attributes.root], config.children ?? [])
    : config.toView(attributes)
}

export const CommandEmpty = <Message>(
  config: CommandPartConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes = commandPartAttributes(
    h,
    'command-empty',
    undefined,
    commandEmptyClassName(config),
    config,
  )

  return config.toView === undefined
    ? h.div([...attributes.root], config.children ?? [])
    : config.toView(attributes)
}

export const CommandGroup = <Message>(
  config: CommandGroupConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes = commandPartAttributes(
    h,
    'command-group',
    'group',
    commandGroupClassName(config),
    config,
  )
  const heading =
    config.heading === undefined
      ? []
      : [
          h.div(
            [
              h.DataAttribute('slot', 'command-group-heading'),
              h.Attribute('cmdk-group-heading', ''),
            ],
            [config.heading],
          ),
        ]

  return config.toView === undefined
    ? h.div([...attributes.root], [...heading, ...(config.children ?? [])])
    : config.toView(attributes)
}

export const CommandSeparator = <Message>(
  config: CommandPartConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes = commandPartAttributes(
    h,
    'command-separator',
    'separator',
    commandSeparatorClassName(config),
    config,
  )

  return config.toView === undefined
    ? h.div([...attributes.root], [])
    : config.toView(attributes)
}

export const CommandItem = <Message>(
  config: CommandItemConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes = commandItemAttributes(h, config)

  return config.toView === undefined
    ? h.div(
        [...attributes.item],
        [...(config.children ?? []), checkIcon<Message>(config.dir)],
      )
    : config.toView(attributes)
}

export const CommandShortcut = <Message>(
  config: CommandShortcutConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes = commandPartAttributes(
    h,
    'command-shortcut',
    undefined,
    commandShortcutClassName(config),
    config,
  )

  return config.toView === undefined
    ? h.span([...attributes.root], config.children ?? [])
    : config.toView(attributes)
}

export const CommandDialog = <Message>(
  config: CommandDialogConfig<Message>,
): Html => {
  const h = html<Message>()
  const {
    children = [],
    contentClassName,
    title = 'Command Palette',
    description = 'Search for a command to run.',
    ...dialogConfig
  } = config

  return Dialog.view<Message>({
    ...dialogConfig,
    showCloseButton: false,
    contentClassName: commandDialogContentClassName({
      className: contentClassName,
    }),
    toView: attributes =>
      h.div(
        [...attributes.root],
        [
          h.dialog(
            [...attributes.dialog, h.Style(commandDialogShellStyle)],
            attributes.isMounted
              ? [
                  h.div([...attributes.backdrop.root], []),
                  h.div(
                    [...attributes.popup.root],
                    [
                      h.div(
                        [...attributes.header, h.Class('sr-only')],
                        [
                          h.h2([...attributes.title], [title]),
                          h.p([...attributes.description], [description]),
                        ],
                      ),
                      ...children,
                    ],
                  ),
                ]
              : [],
          ),
        ],
      ),
  })
}
