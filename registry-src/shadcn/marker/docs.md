# Marker

## Overview

Marker is a Foldkit-native port of the shadcn base-nova marker helper. It
renders inline notes, status rows, bordered rows, and labeled separators with a
small root/ icon/ content composition.

## Foldkit Model

Marker is a stateless render helper. It owns no Model, Message, update
function, or Command. Parent views decide what a marker means and render it as
a fact of the current UI state.

## Usage

Render the helper from a Foldkit view after binding `const h = html<Message>()`.
The root, icon, and content parts all accept `toView` seams when you need a
different tag.

```ts
Marker<Message>({
  variant: 'separator',
  children: [
    MarkerContent<Message>({
      children: ['Today'],
    }),
  ],
})
```

Use `variant: 'default' | 'separator' | 'border'` to match the origin shadcn
surface. The default variant covers inline notes, `separator` draws divider
lines on both sides of the label, and `border` adds a bottom rule for row
boundaries.

## Examples

The registry includes examples for default markers, loading status rows with
Spinner icons, border rows, separators, stacked icons, shimmer text, and
anchor/button rendering seams. The installable examples use local inline SVG
icons instead of `lucide-react`.

## Accessibility

Use `role="status"` for loading or streaming markers so assistive tech announces
the update when it appears. `MarkerIcon` is decorative by default and renders
`aria-hidden="true"`. Keep labeled separators short and readable.

## Foldkit Differences

The origin shadcn marker component imports React's `mergeProps` and `useRender`
helpers. This registry item replaces those dependencies with explicit Foldkit
attribute construction and `toView` seams, while keeping the same visible
marker footprint and class contract.

The origin notification example uses `sonner`. In the installable source, the
marker examples stay deterministic and local so they remain Foldkit-native.
