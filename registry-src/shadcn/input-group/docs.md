# Input Group

## Overview

Input Group is a Foldkit-native port of the shadcn base-nova Input Group helper. It composes inputs, textareas, addons, buttons, labels, keyboard hints, and grouped controls while preserving the origin slot and class contracts.

## Foldkit Model

Input Group is a stateless render helper. It does not own a Model, Message, update function, or Command. Parent views provide children, event attributes, values, and side-effect messages.

## Usage

Import the helper from the generated registry source and compose it inside a Foldkit view after binding the Html factory.

```ts
InputGroup<Message>({
  children: [
    InputGroupInput<Message>({
      placeholder: 'Search...',
    }),
    InputGroupAddon<Message>({
      align: 'inline-end',
      children: [InputGroupText<Message>({ children: ['12 results'] })],
    }),
  ],
})
```

Use `align: 'block-start'` or `align: 'block-end'` for header and footer affordances. Use `dir: 'rtl'` on the group and addons when rendering right-to-left controls.

## Examples

The registry includes live examples for basic states, inline and block addons, buttons, Button Group composition, dropdown triggers, icons, keyboard hints, labels, spinner addons, text addons, textareas, card composition, and RTL layout.

Toast and clipboard examples are represented as static controls because those effects belong in parent Foldkit messages and commands.

## Accessibility

Input Group renders a `role="group"` root. Labels should still target the actual input or textarea id. Icon-only buttons should provide `ariaLabel`, and grouped controls should keep their individual accessible names.

## Foldkit Differences

The origin shadcn implementation composes React, CVA, icon packages, clipboard hooks, sonner toasts, and `react-textarea-autosize`. This registry item replaces those pieces with Foldkit Html, Effect Schema literals, local class helpers, local registry dependencies, inline SVG examples, and static textarea sizing.

Those differences are accepted because installable source must stay Foldkit-native while preserving the origin visual structure and composition behavior.
