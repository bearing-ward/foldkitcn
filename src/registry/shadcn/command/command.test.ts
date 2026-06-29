/// <reference types="vite/client" />

import { Option, Schema as S } from 'effect'
import { Scene, Story } from 'foldkit'
import { html, type Html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import {
  CommandDemo,
  CommandDialogDemo,
  CommandRtl,
  CommandWithGroups,
} from './examples'
import * as Command from './index'

const groups: ReadonlyArray<Command.CommandGroupDescriptor> = [
  {
    heading: 'Suggestions',
    items: [
      { value: 'calendar', label: 'Calendar' },
      { value: 'emoji', label: 'Search Emoji', keywords: ['smile'] },
      { value: 'calculator', label: 'Calculator', isDisabled: true },
    ],
  },
  {
    heading: 'Settings',
    items: [
      { value: 'profile', label: 'Profile', shortcut: '⌘P' },
      { value: 'billing', label: 'Billing', shortcut: '⌘B' },
    ],
  },
]

const initialState = (
  options: Command.CommandStateOptions = {},
): Command.CommandState => Command.commandState(groups, options)

const update = (
  state: Command.CommandState,
  message: Command.CommandMessage,
): Command.UpdateReturn => Command.updateWithGroups(groups, state, message)

const commandItemView = (
  state: Command.CommandState,
  item: Command.CommandItemDescriptor,
): Html => {
  const isHighlighted = Option.match(state.highlightedValue, {
    onNone: () => false,
    onSome: value => value === item.value,
  })
  const isSelected = Option.match(state.selectedValue, {
    onNone: () => false,
    onSome: value => value === item.value,
  })

  return Command.CommandItem<Command.CommandMessage>({
    value: item.value,
    ...(item.isDisabled === undefined ? {} : { isDisabled: item.isDisabled }),
    isSelected: isHighlighted,
    isChecked: isSelected,
    ...(item.isDisabled === true
      ? {}
      : { onSelect: Command.SelectedCommandItem({ value: item.value }) }),
    children: [
      item.label,
      ...(item.shortcut === undefined
        ? []
        : [
            Command.CommandShortcut<Command.CommandMessage>({
              children: [item.shortcut],
            }),
          ]),
    ],
  })
}

const commandGroupView = (
  state: Command.CommandState,
  group: Command.CommandGroupDescriptor,
): Html =>
  Command.CommandGroup<Command.CommandMessage>({
    ...(group.heading === undefined ? {} : { heading: group.heading }),
    children: group.items.map(item => commandItemView(state, item)),
  })

const view = (state: Command.CommandState): Html => {
  const filteredGroups = Command.filterCommandGroups(groups, state.query)

  return Command.Command<Command.CommandMessage>({
    children: [
      Command.CommandInput<Command.CommandMessage>({
        ariaLabel: 'Command search',
        value: state.query,
        placeholder: 'Type a command or search...',
        onQueryChange: value => Command.UpdatedCommandQuery({ value }),
        onKeyDown: key => Command.commandKeyMessage(key),
      }),
      Command.CommandList<Command.CommandMessage>({
        children:
          filteredGroups.length === 0
            ? [
                Command.CommandEmpty<Command.CommandMessage>({
                  children: ['No results found.'],
                }),
              ]
            : filteredGroups.map(group => commandGroupView(state, group)),
      }),
    ],
  })
}

describe('shadcn/command update', () => {
  test('filters query text and highlights the first enabled match', () => {
    Story.story(
      update,
      Story.with(initialState()),
      Story.message(Command.UpdatedCommandQuery({ value: 'bill' })),
      Story.Command.expectNone(),
      Story.model(model => {
        expect(model.query).toBe('bill')
        expect(model.highlightedValue).toStrictEqual(Option.some('billing'))
      }),
    )
  })

  test('keyboard movement skips disabled items and selects the highlight', () => {
    Story.story(
      update,
      Story.with(initialState({ highlightedValue: Option.some('emoji') })),
      Story.message(Command.PressedCommandKey({ key: 'ArrowDown' })),
      Story.model(model => {
        expect(model.highlightedValue).toStrictEqual(Option.some('profile'))
      }),
      Story.message(Command.PressedCommandKey({ key: 'Enter' })),
      Story.model(model => {
        expect(model.selectedValue).toStrictEqual(Option.some('profile'))
        expect(model.isDialogOpen).toBeFalsy()
      }),
    )
  })

  test('dialog open and escape close state without commands', () => {
    Story.story(
      update,
      Story.with(initialState()),
      Story.message(Command.OpenedCommandDialog()),
      Story.model(model => {
        expect(model.isDialogOpen).toBeTruthy()
      }),
      Story.message(Command.PressedCommandKey({ key: 'Escape' })),
      Story.Command.expectNone(),
      Story.model(model => {
        expect(model.isDialogOpen).toBeFalsy()
      }),
    )
  })
})

describe('shadcn/command view', () => {
  test('exports Effect Schema literals and origin class helpers', () => {
    expect(S.decodeUnknownSync(Command.CommandKey)('Enter')).toBe('Enter')
    expect(Command.commandClassName()).toBe(Command.commandBaseClassName)
    expect(Command.commandListClassName()).toBe(
      Command.commandListBaseClassName,
    )
    expect(Command.commandShortcutClassName({ dir: 'rtl' })).toContain(
      'ms-auto',
    )
  })

  test('renders input, groups, roles, selected state, and shortcuts', () => {
    expect(() => {
      Scene.scene(
        { update, view },
        Scene.with(initialState({ highlightedValue: Option.some('profile') })),
        Scene.expect(Scene.label('Command search')).toHaveValue(''),
        Scene.expect(Scene.role('listbox')).toExist(),
        Scene.expect(
          Scene.selector('[data-slot="command-group-heading"]'),
        ).toHaveText('Suggestions'),
        Scene.expect(Scene.role('option', { name: 'Profile⌘P' })).toHaveAttr(
          'data-selected',
          '',
        ),
        Scene.expect(
          Scene.selector('[data-slot="command-shortcut"]'),
        ).toHaveText('⌘P'),
      )
    }).not.toThrow()
  })

  test('typing filters the list and clicking selects an item', () => {
    expect(() => {
      Scene.scene(
        { update, view },
        Scene.with(initialState()),
        Scene.type(Scene.label('Command search'), 'emoji'),
        Scene.expect(Scene.role('option', { name: 'Search Emoji' })).toExist(),
        Scene.expect(Scene.role('option', { name: 'Calendar' })).not.toExist(),
        Scene.click(Scene.role('option', { name: 'Search Emoji' })),
        Scene.expect(Scene.role('option', { name: 'Search Emoji' })).toHaveAttr(
          'data-checked',
          'true',
        ),
      )
    }).not.toThrow()
  })

  test('renders dossier examples with origin-visible surfaces', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => CommandDemo() },
        Scene.with(initialState()),
        Scene.expect(Scene.selector('[data-slot="command"]')).toHaveAttr(
          'class',
          Command.commandClassName({ className: 'max-w-sm rounded-lg border' }),
        ),
        Scene.expect(Scene.role('option', { name: 'Billing⌘B' })).toExist(),
      )
      Scene.scene(
        { update, view: () => CommandWithGroups() },
        Scene.with(initialState()),
        Scene.expect(Scene.role('button', { name: 'Open Menu' })).toExist(),
      )
      Scene.scene(
        { update, view: () => CommandDialogDemo() },
        Scene.with(initialState()),
        Scene.expect(Scene.selector('p')).toHaveText('Press ⌘J'),
      )
      Scene.scene(
        { update, view: () => CommandRtl() },
        Scene.with(initialState()),
        Scene.expect(Scene.selector('[data-slot="command"]')).toHaveAttr(
          'dir',
          'rtl',
        ),
        Scene.expect(Scene.text('الفوترة')).toExist(),
      )
    }).not.toThrow()
  })

  test('renders controlled dialogs above neighboring docs content', () => {
    const h = html<never>()

    expect(() => {
      Scene.scene(
        {
          update,
          view: () =>
            Command.CommandDialog<never>({
              id: 'command-layer-test',
              open: true,
              children: [h.div([], ['Layered command content'])],
            }),
        },
        Scene.with(initialState()),
        Scene.expect(Scene.selector('#command-layer-test')).toHaveStyle(
          'zIndex',
          '1000',
        ),
        Scene.expect(Scene.selector('#command-layer-test')).toHaveStyle(
          'background',
          'transparent',
        ),
        Scene.expect(Scene.selector('#command-layer-test')).toHaveStyle(
          'maxWidth',
          'none',
        ),
      )
    }).not.toThrow()
  })

  test('renders CommandDialogDemo as a controlled dialog when provided a controller', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: () =>
            CommandDialogDemo({
              id: 'command-dialog-demo-test',
              isOpen: true,
            }),
        },
        Scene.with(initialState()),
        Scene.expect(Scene.selector('#command-dialog-demo-test')).toHaveAttr(
          'open',
        ),
        Scene.expect(Scene.role('option', { name: 'Calendar' })).toExist(),
      )
    }).not.toThrow()
  })
})
