# Item

## Overview

Item is a styled structural helper for arranging media, title, description, and actions in a compact content row. It preserves the shadcn base-nova slot and class contract while replacing the origin React, CVA, and render-prop assumptions with Foldkit Html helpers.

## Foldkit Model

Item is stateless. It does not own a Model, Message, update function, or Command. Parent views pass Foldkit Html children and parent-owned event attributes into the relevant slots.

## Usage

Bind `const h = html<Message>()` in the parent view, then compose Item parts with parent messages for actions.

```ts
Item({
  variant: 'outline',
  children: [
    ItemContent({
      children: [
        ItemTitle({ children: ['Project synced'] }),
        ItemDescription({ children: ['Your local copy is current.'] }),
      ],
    }),
  ],
})
```

Use `toView` when the Item root needs to render as an anchor or another named element.

## Examples

The registry includes examples for the origin demo, avatar, dropdown trigger, group, header image grid, icon media, image media, link, RTL, size, and variant previews.

Icon examples use local inline SVGs instead of `lucide-react`. Image examples use plain image elements instead of `next/image`.

## Accessibility

Use `ItemGroup` for related lists so the group receives `role="list"`. When an Item is rendered as a link, provide the same navigation attributes you would provide to a normal anchor. Icon-only Button actions should have accessible labels.

## Foldkit Differences

The origin implementation depends on React, Base UI React render helpers, and `class-variance-authority`. This registry item replaces those with Foldkit Html, `toView` composition, Effect Schema literals, and pure local class maps.
