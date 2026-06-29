# Button

## Overview

Button is a Foldkit-native Base UI primitive for rendering native and non-native
buttons with consistent disabled, focusable disabled, type, and keyboard
activation semantics.

## Foldkit Model

Button is a stateless render helper. It does not own model state or commands.
Parent views decide which element to render through `toView`, and parent update
functions handle facts emitted by button events.

## Usage

Import the helper and call it from a view after binding `const h =
html<Message>()`.

```ts
Button.view<Message>({
  onClick: ClickedSave(),
  toView: attributes => h.button([...attributes.button], ['Save']),
})
```

Use `isNativeButton: false` when the visual element is not a native `button`.
The helper adds role and keyboard activation attributes for the non-native
shape.

## Examples

The registry examples cover enabled buttons, disabled and focusable disabled
buttons, non-native button rendering, native `button`/`submit`/`reset` types,
and a disabled busy-state button.

Base UI primitives are unstyled, so example-local classes are only there to make
the behavior easy to inspect in the documentation shell.

## Accessibility

Prefer native `button` elements for actions. Use non-native rendering only when
the element shape is required, and keep the accessible name visible or provided
with ARIA.

Disabled buttons suppress click, mouse, pointer, and synthetic keyboard
activation. Focusable disabled buttons remain reachable while still reporting
disabled state through ARIA and `data-disabled`.

## Foldkit Differences

The origin Base UI Button owns React event wiring and accepts a React `render`
prop. This registry primitive keeps behavior in Foldkit Html attributes and maps
custom rendering through `toView`, preserving unidirectional data flow without a
public `asChild` API.
