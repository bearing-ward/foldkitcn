# Spinner

## Overview

Spinner is a Foldkit-native port of the shadcn base-nova Spinner helper. It renders the origin loader-circle SVG footprint with `data-slot="spinner"`, status semantics, and the `size-4 animate-spin` class contract.

## Foldkit Model

Spinner is a stateless render helper. It owns no Model, Message, update function, or Command. Parent views decide when loading is true and render Spinner as a fact of that state.

## Usage

Import the helper from the generated registry source and render it directly or through the `toView` seam.

```ts
Spinner<Message>({
  className: 'size-6',
})
```

Use `attributes` for extra SVG attributes such as `data-icon="inline-start"` when composing inside Button, Badge, Item, or Input Group examples.

## Examples

The registry includes live examples for basic Item composition, badges, disabled buttons, custom loader icons, Input Group composition, Empty composition, RTL content, and size overrides.

## Accessibility

Spinner renders `role="status"` and `aria-label="Loading"` by default. Use the optional `ariaLabel` when a parent needs more specific loading copy.

## Foldkit Differences

The origin shadcn implementation imports `Loader2Icon` from `lucide-react`. This registry item replaces that dependency with a local inline SVG path so installable source stays Foldkit-native while preserving the same root attributes and visual footprint.
