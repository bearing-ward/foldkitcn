# Empty

## Overview

Empty is a Foldkit-native port of the shadcn base-nova Empty helper. It provides the origin empty-state slots for root, header, media, title, description, and content while keeping composition local to Foldkit Html.

## Foldkit Model

Empty is a stateless render helper. It owns no Model, Message, update function, or Command. Parent views decide when a collection or workflow is empty and render Empty as a fact of that state.

## Usage

Import the helpers from the generated registry source and compose the slots directly.

```ts
Empty<Message>({
  children: [
    EmptyHeader<Message>({
      children: [
        EmptyMedia<Message>({ variant: 'icon', children: [icon] }),
        EmptyTitle<Message>({ children: ['No projects yet'] }),
        EmptyDescription<Message>({ children: ['Create your first project.'] }),
      ],
    }),
    EmptyContent<Message>({ children: [action] }),
  ],
})
```

Use `className` on any slot for local layout adjustments. Use `dir` on `Empty` for RTL surfaces.

## Examples

The registry includes live examples for avatar media, avatar groups, muted and outlined empty states, card-like action groups, search with Input Group and Kbd, RTL content, and SpinnerEmpty composition.

## Accessibility

Empty preserves semantic content as normal Html nodes. Pair titles, descriptions, and controls in the slot order shown by the examples so screen readers encounter the same context before actions.

## Foldkit Differences

The origin shadcn examples import Tabler and Lucide React icons and use a runtime language selector for RTL. This registry item replaces those with local inline SVGs and deterministic Arabic RTL strings so installable source stays Foldkit-native while preserving the rendered footprint.
