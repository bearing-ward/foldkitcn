# Message

## Overview

Message is a Foldkit-native shadcn wrapper for conversational rows. It
preserves the origin group, message, avatar, content, header, and footer slots
while composing local Attachment, Avatar, Bubble, Button, and Marker helpers.

## Foldkit Model

Message is a stateless view helper. It owns no application state, messages, or
commands. Parent models decide which messages exist, how they align, which role
they represent, and which local primitives render inside each message.

## Usage

Compose message parts from a Foldkit view after binding `const h =
html<Message>()`.

```ts
Message<Message>({
  align: 'end',
  role: 'user',
  children: [
    MessageContent<Message>({
      children: [
        Bubble<Message>({
          children: [
            BubbleContent<Message>({
              children: ['Can you share the exact error?'],
            }),
          ],
        }),
      ],
    }),
  ],
})
```

Use `MessageGroup` for consecutive rows, `MessageAvatar` for sender identity,
`MessageContent` for stacked bubbles and attachments, and `MessageHeader` or
`MessageFooter` for metadata and actions.

## Examples

The registry includes demos for the base message thread, grouped messages,
avatars, header/footer metadata, action buttons, attachments, and a static
markdown-style assistant response.

The markdown example is deterministic fixture markup. It preserves the visible
Message surface without adding a markdown runtime or AI package to this item.

## Accessibility

Message parts carry origin-compatible `data-slot` attributes. Keep footer
actions labeled, use `role="status"` for live typing markers when appropriate,
and provide avatar image alt text or fallback initials.

## Foldkit Differences

The origin shadcn component uses React and imports markdown and icon packages
in examples. This registry item replaces those pieces with Effect Schema
literals, pure class maps, Foldkit `toView` composition, local inline SVGs, and
static markdown-style markup.

Those differences are intentional. They keep Message installable in the local
Foldkit ecosystem while preserving the same component structure and visible
composition model.
