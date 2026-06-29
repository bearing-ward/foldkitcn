# Radio Group

## Overview

Radio Group is a styled Foldkit wrapper for shadcn's base-nova radio group. It
composes the local Base UI Radio Group primitive, adds shadcn slot classes, and
renders the checked indicator dot without importing upstream React primitives.

## Foldkit Model

Radio Group is model-owned. Pass the selected value from the parent model and
handle value-change facts in the parent update function.

## Usage

Import the helper from the generated registry source and call it inside a view
after binding `const h = html<Message>()`.

```ts
RadioGroup.view<Message>({
  value: model.density,
  items: densityItems,
  onValueChange: UpdatedDensity,
})
```

## Examples

The registry examples cover the default shadcn radio group, description rows,
choice cards, disabled items, fieldset composition, invalid state, and RTL
layout.

## Accessibility

Each item receives `role="radio"`, checked state, roving tab index, disabled and
invalid state, and a visually hidden input for form participation. Keep labels
associated with the generated input or with the visible radio through ARIA.

## Foldkit Differences

The origin shadcn implementation composes React, Base UI React Radio and Radio
Group, Field, Label, and CVA-style classes. This registry item keeps behavior in
the local Base UI Radio Group primitive, uses pure class maps, and keeps the
example Field and Label shapes local to the example source.
