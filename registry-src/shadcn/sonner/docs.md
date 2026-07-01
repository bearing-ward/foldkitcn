# Sonner

## Overview

Sonner is a Foldkit-native shadcn wrapper for the base-nova toast surface. It
composes the local Base UI Toast primitive with local classes, local icons, and
an explicit theme option so the installable source stays Effect- and
Foldkit-native.

## Foldkit Model

Sonner is a stateless view helper. It does not own application state. Parent
views provide toast state, messages, and side-effect handlers, then render the
Toaster surface through `view` or `Toaster`.

## Usage

Render the wrapper from a Foldkit view after binding `const h = html<Message>()`.
Pass toast state from the parent and route action and close events back into the
parent update function.

```ts
Toaster<Message>({
  id: 'notifications',
  state,
  theme: 'system',
  onAction: press => PressedToastAction({ press }),
  onClose: request => RequestedToastClose({ request }),
})
```

Use `theme: '"'"'light'"'"' | '"'"'dark'"'"' | '"'"'system'"'"'` to mirror the origin `next-themes`
behavior without importing the upstream runtime.

## Examples

The registry includes demo, description, position, and types examples. The
types example covers the default, success, info, warning, error, and promise
toast states. The wrapper uses local inline SVG icons instead of `lucide-react`.

## Accessibility

The toaster renders a polite live region and preserves the Base UI toast dialog
semantics, including action and close buttons. Use visible labels for trigger
buttons and keep toast titles and descriptions short enough to scan quickly.

## Foldkit Differences

The origin shadcn Sonner component wraps the `sonner` package and reads theme
state from `next-themes`. This registry item replaces both with the local Base
UI Toast primitive, an explicit Effect Schema theme option, local class helpers,
and inline SVG icons.

Those differences are intentional. They keep the installable source
Foldkit-native while preserving the same shadcn surface and examples.
