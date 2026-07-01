# Sidebar

## Overview

Sidebar is a Foldkit-native shadcn shell for app navigation. It composes the
local Sheet, Collapsible, Dropdown Menu, Tooltip, Avatar, Input, Separator,
Skeleton, Button, and Direction registry items so the installable source stays
Effect- and Foldkit-native while preserving the origin surface.

## Foldkit Model

Sidebar is a controlled shell composition. The parent model owns the facts for
desktop open state, collapsed state, mobile sheet state, active item state, and
direction. There is no hidden React context, cookie-backed persistence, media
query hook, or ambient keyboard listener in the installable source.

## Usage

Bind `const h = html<Message>()` in the parent view and pass explicit sidebar
state into the shell helpers.

```ts
Sidebar.SidebarProvider<Message>({
  dir: model.direction,
  children: [
    Sidebar.Sidebar<Message>({
      id: 'app-sidebar',
      open: model.open,
      mobileOpen: model.mobileOpen,
      isMobile: model.isMobile,
      collapsible: 'offcanvas',
      children: [...],
    }),
    Sidebar.SidebarInset<Message>({
      children: [...],
    }),
  ],
})
```

Use the message layer to express user intent such as toggling the sidebar,
opening the mobile sheet, or selecting a navigation item. Keep persistence and
keyboard shortcuts explicit in the parent update function.

## Examples

The registry includes demo, controlled, footer, group action, group collapsible,
header, menu action, menu badge, menu collapsible, menu sub, menu, RSC, and RTL
examples. The examples cover the shell, grouped navigation, mobile sheet branch,
submenu composition, account menu composition, badges, and direction-aware
layout.

## Accessibility

The shell preserves button, link, list, and dialog semantics through local
Foldkit primitives. Use visible text for navigation items, keep the trigger and
rail buttons labeled, and provide descriptive submenu labels so collapsed or
mobile layouts still remain usable.

## Foldkit Differences

The origin shadcn sidebar relies on React context, a `useMobile` hook, cookies,
and a global keyboard shortcut. This registry item replaces those pieces with an
explicit parent-controlled model, local Foldkit primitives, and local class
helpers.

Those differences are intentional. They keep the installable source aligned with
Foldkit architecture while preserving the origin visual contract and the
supported example set.
