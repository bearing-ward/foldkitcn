# Command

## Overview

Command is a Foldkit-native port of the shadcn base-nova Command helpers. It preserves the origin command shell, input, list, empty, group, separator, item, shortcut, and dialog slots while replacing `cmdk` with explicit Foldkit state helpers.

## Foldkit Model

Command ships with `CommandState`, fact-shaped messages, and `updateWithGroups` for the common query, highlight, keyboard, selection, and dialog-open workflow. Parent programs can use those helpers directly or keep their own model and treat the view helpers as presentational parts.

## Usage

Import the helpers from the generated registry source and drive state through Foldkit messages.

```ts
Command<Message>({
  children: [
    CommandInput<Message>({
      ariaLabel: 'Command search',
      value: model.command.query,
      onQueryChange: value => UpdatedCommandQuery({ value }),
      onKeyDown: key => commandKeyMessage(key),
    }),
    CommandList<Message>({
      children: groups.map(group =>
        CommandGroup<Message>({
          heading: group.heading,
          children: group.items.map(item =>
            CommandItem<Message>({
              value: item.value,
              isSelected: item.value === highlightedValue,
              onSelect: SelectedCommandItem({ value: item.value }),
              children: [item.label],
            }),
          ),
        }),
      ),
    }),
  ],
})
```

Use `filterCommandGroups` to derive visible groups from the query and `highlightedCommandItem` when selecting the current keyboard highlight.

## Examples

The registry includes live examples for the static command demo, basic closed dialog trigger, keyboard shortcut hint, grouped trigger, scrollable trigger, shortcuts trigger, and deterministic RTL command surface.

## Accessibility

Command renders a combobox-style input, a `listbox`, and `option` items with `aria-selected`, disabled item attributes, group headings, and shortcut text. Disabled items do not receive selection handlers and keyboard movement skips them.

## Foldkit Differences

The origin shadcn implementation composes `cmdk`, React state/hooks, Lucide React icons, and an app-level language selector. This registry item uses local Foldkit messages/update helpers, local inline SVGs, local Dialog/Input Group composition, and deterministic RTL strings so the installable source stays Foldkit-native.
