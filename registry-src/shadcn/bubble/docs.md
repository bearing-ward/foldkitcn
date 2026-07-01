# Bubble

## Overview

Bubble is a Foldkit-native shadcn wrapper for conversational message surfaces.
It preserves the grouped bubble layout, reaction row, alignment variants, and
the same lightweight composition points as the origin component while keeping
the installable source Effect- and Foldkit-native.

## Foldkit Model

Bubble is a stateless view helper. It owns no application state, messages, or
commands. Parent views decide which bubbles exist, where they align, and which
content or reactions each bubble renders.

## Usage

Compose the bubble parts from a Foldkit view after binding `const h =
html<Message>()`.

```ts
Bubble<Message>({
  align: 'end',
  variant: 'muted',
  children: [
    BubbleContent<Message>({
      children: ['I checked the registry output and removed the stale route.'],
    }),
  ],
})
```

Use `BubbleContent` for the message body, `BubbleReactions` for the anchored
reaction row, and `BubbleGroup` to cluster consecutive bubbles from the same
sender.

## Examples

The registry includes demos for the base conversation layout, grouped
messages, variants, alignment, clickable bubble content, reactions,
collapsible long content, tooltip metadata, popover details, and a
static markdown-style ghost bubble.

The markdown, collapsible, tooltip, and popover examples are static fixture
markup. They preserve the visible Bubble surfaces without adding a markdown
runtime, upstream `sonner`, or extra interactive dependencies to this item.

## Accessibility

Bubble parts carry `data-slot` attributes for every surface. Keep reaction
buttons labeled, keep tooltip and popover triggers visible, and use the bubble
text itself as the accessible name for clickable bubble content.

## Foldkit Differences

The origin shadcn component uses React, CVA, Base UI render helpers, and a
markdown runtime for one example. This registry item replaces those pieces with
Effect Schema literals, pure class maps, Foldkit `toView` composition, local
static controls, and static markdown-style markup in the installable example.

Those differences are intentional. They keep the bubble wrapper installable in
the local Foldkit ecosystem while preserving the same visible component shape.
