# Pagination

## Overview

Pagination is a Foldkit-native port of the shadcn base-nova Pagination helpers. It preserves the origin navigation, list, item, link, previous, next, and ellipsis slots while keeping routing decisions in the parent application model.

## Foldkit Model

Pagination is a stateless render helper. It owns no Model, Message, update function, or Command. Parent views decide which page is current, which links are disabled, and which navigation messages should be emitted.

## Usage

Import the helpers from the generated registry source and compose semantic pagination parts directly.

```ts
Pagination<Message>({
  children: [
    PaginationContent<Message>({
      children: [
        PaginationItem<Message>({
          children: [PaginationPrevious<Message>({ href: '#previous' })],
        }),
        PaginationItem<Message>({
          children: [
            PaginationLink<Message>({
              href: '#page-2',
              isActive: true,
              children: ['2'],
            }),
          ],
        }),
        PaginationItem<Message>({
          children: [PaginationNext<Message>({ href: '#next' })],
        }),
      ],
    }),
  ],
})
```

Use `isActive` to mark the current page and `isDisabled` when previous or next navigation is unavailable. Keep page changes flowing through Foldkit messages when links are used as app navigation controls.

## Examples

The registry includes live examples for the default pagination demo, icons-only controls paired with local Field and Select helpers, deterministic RTL content, and a simple numbered pagination layout.

## Accessibility

Pagination renders a real `nav` landmark with list semantics. Active page links receive `aria-current="page"`, disabled links receive disabled attributes from the local Button helper, and icon-only or direction controls keep accessible labels.

## Foldkit Differences

The origin shadcn implementation composes React render-element cloning, Lucide React icons, and an app-level language selector. This registry item replaces those with explicit Foldkit anchor rendering, local inline SVG helpers, and deterministic RTL fixture data so the installable source remains Foldkit-native.
