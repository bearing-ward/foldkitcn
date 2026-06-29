# Button Group

## Overview

Button Group is a Foldkit-native port of the shadcn base-nova Button Group helper. It groups related buttons, inputs, select triggers, popover triggers, dropdown triggers, text affordances, and separators while preserving the origin slot and class contracts.

## Foldkit Model

Button Group is a stateless render helper. It does not own a Model, Message, update function, or Command. Parent views provide children and event attributes, and state changes continue to flow through the parent Foldkit update function.

## Usage

Import the helper from the generated registry source and compose it inside a Foldkit view after binding the Html factory.

```ts
ButtonGroup<Message>({
  ariaLabel: 'Message actions',
  children: [
    Button.view<Message>({
      variant: 'outline',
      toView: attributes => h.button([...attributes.button], ['Archive']),
    }),
  ],
})
```

Use `orientation: 'vertical'` for stacked controls and `dir: 'rtl'` when rendering a right-to-left group.

## Examples

The registry includes live examples for nested action groups, dropdown triggers, input search groups, vertical orientation, popover triggers, RTL groups, select and input composition, separator groups, size rows, and split button groups.

Input-group dependent origin examples remain deferred until the local shadcn Input Group item is available.

## Accessibility

Button Group renders a `role="group"` root. Provide `ariaLabel` when the grouped controls need an accessible group name, and keep individual icon-only buttons labelled through their own `ariaLabel` values.

Separators are decorative inside grouped controls and use the local Separator helper to preserve orientation attributes.

## Foldkit Differences

The origin shadcn implementation composes React, Base UI React render hooks, CVA-style class composition, and icon packages. This registry item replaces those pieces with Foldkit Html, Effect Schema orientation literals, local class helpers, local registry dependencies, and inline SVG examples.

Those differences are accepted because installable source must stay Foldkit-native while preserving the origin visual structure and example behavior.
