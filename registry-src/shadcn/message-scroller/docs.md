# Message Scroller

## Overview

Message Scroller is a Foldkit-native shadcn chat viewport. It preserves the
origin root, viewport, content, item, and button slots while moving scroll
intent into a Schema-backed model, Foldkit messages, and explicit DOM commands.

## Foldkit Model

The model stores whether the viewport is pinned to the end, whether unread
messages are waiting below the reader, the current message count, and the last
scroll direction. Appending messages is pure update logic. When the view is
already pinned, update returns `ScrollMessagesToEnd`; when the reader has
scrolled away, update preserves their place and activates the scroll button.

## Usage

Render `MessageScroller`, `MessageScrollerViewport`, `MessageScrollerContent`,
`MessageScrollerItem`, and `MessageScrollerButton` from a Foldkit view. Parent
apps can use the exported `init` and `update` helpers directly or embed the
state in a larger model.

```ts
const state = MessageScroller.init('chat-thread', messages.length)

MessageScroller<Message>({
  children: [
    MessageScrollerViewport<Message>({
      children: [
        MessageScrollerContent<Message>({
          children: messages.map(message =>
            MessageScrollerItem<Message>({
              scrollAnchor: message.role === 'user',
              children: [renderMessage(message)],
            }),
          ),
        }),
      ],
    }),
    MessageScrollerButton<Message>({
      isActive: shouldShowScrollButton(state),
      ariaLabel: 'Scroll to new messages',
    }),
  ],
})
```

## Examples

The registry includes deterministic examples for a basic chat, unread
messages, loading earlier context, opening position, and the empty state. These
examples compose local Message, Bubble, Marker, Input Group, Empty, Card, and
Button helpers.

## Accessibility

`MessageScrollerContent` renders as a polite log with `aria-relevant="additions"`
and `aria-busy` support. Scroll buttons are real buttons with labels and are
removed from the tab order when inactive.

## Foldkit Differences

The origin shadcn demos rely on `@shadcn/react/message-scroller`, AI SDK
streaming, animation helpers, React hooks, sonner, and lucide-react. This
registry item replaces those dependencies with local static fixtures, inline
SVGs, local registry primitives, and Foldkit commands for scroll side effects.

The examples are fixture-only where origin behavior depends on live AI
transport or animation runtime. That difference is intentional so the component
remains installable and deterministic in the Foldkit registry.
