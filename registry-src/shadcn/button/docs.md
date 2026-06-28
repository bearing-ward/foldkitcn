# Button

## Overview

Button is a styled Foldkit wrapper for shadcn's base-nova button treatment. It composes the local Base UI Button primitive for behavior and `utils/cn` for class composition, so installable source stays Foldkit-native while preserving the origin visual contract.

## Foldkit Model

Button is a stateless render helper. It does not own a Model, Message, update function, or Command. Call it from a view with Foldkit Html children and pass event attributes, disabled state, variant, and size from the parent model.

## Usage

Import the Button helper from the generated registry source and call it inside a view after binding `const h = html<Message>()`.

```ts
Button(
  {
    variant: 'default',
    size: 'default',
    attributes: [h.OnClick(ClickedSave())],
  },
  ['Save changes'],
)
```

Keep state transitions in the parent update function. The Button should report facts through messages such as `ClickedSave`, not perform imperative work itself.

## Examples

The registry includes examples for default, outline, secondary, ghost, destructive, link, icon-only, icon-with-text, size, rounded, spinner, render-as-anchor, and RTL button layouts.

Icon examples use local inline SVGs instead of origin icon packages. This keeps the component installable without adding `lucide-react` or `@tabler/icons-react` as runtime dependencies.

## Accessibility

Use Button for actions and provide clear visible text or an accessible label for icon-only buttons. Disabled buttons should pass disabled state through the helper instead of hiding click behavior in event handlers.

When rendering as a link-like control, make sure navigation still flows through Foldkit navigation messages so the application model remains the source of truth.

## Foldkit Differences

The origin shadcn implementation composes React, Base UI React behavior, CVA, and external icon packages. This registry item replaces those pieces with Foldkit Html, the local Base UI Button primitive, Effect Schema literals for variants and sizes, and `utils/cn`.

That difference is intentional and accepted: the installable source cannot depend on React-only primitives or icon packages, but it should preserve the same base-nova class contract and example coverage.
