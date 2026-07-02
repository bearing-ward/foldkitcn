# Toast

## Overview

Toast is the shadcn card-style wrapper around the local Foldkit toast primitive.
It keeps the notification lifecycle, pause and resume behavior, swipe handling,
and live-region semantics in the Base UI toast model while applying the
shadcn-style card surface on top.

## Foldkit Model

The installable source is message-driven, not hook-driven. Parent views own the
toast state, send facts back into their update function, and render the toaster
surface through `view` or `Toaster`.

## Usage

Render the wrapper from a Foldkit view after binding `const h = html<Message>()`.
Pass toast state from the parent and route action, close, swipe, and viewport
interaction messages back into the parent update function.

```ts
Toaster<Message>({
  id: 'notifications',
  state,
  onAction: press => PressedToastAction({ press }),
  onClose: request => RequestedToastClose({ request }),
  onViewportInteraction: interaction => ChangedViewport({ interaction }),
})
```

## Examples

The registry includes demo, simple, title, action, destructive, and stacked
examples. The stacked example keeps multiple toasts visible in the compact
state and expands the stack on viewport hover or focus.

## Accessibility

The toaster keeps the polite live region, dialog semantics, and close/action
controls from the local toast primitive. Use clear trigger labels and keep toast
copy short enough to scan quickly.

## Foldkit Differences

The origin shadcn Toast component wraps the React/Radix hook stack and a global
`useToast` store. This registry item replaces that architecture with the local
Base UI Toast primitive, explicit message routing, and shadcn card styling.

That difference is intentional. It keeps the installable source Foldkit-native
while preserving the origin card language and the stacked expansion treatment.

Because the pinned base-nova source file does not exist locally, the examples
and card styling here are derived from the public registry JSON and docs pages
rather than copied from an upstream runtime component.
