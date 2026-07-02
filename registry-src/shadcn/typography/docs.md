# Typography

## Overview

Foldkit CN does not ship default typography styles or a Typography component.
This page demonstrates utility classes applied directly to semantic HTML, which
matches the origin guidance that prose styles are not included by default.

Use these examples as copyable markup patterns for headings, paragraphs,
blockquote content, tables, lists, inline code, supporting copy, and RTL text.

## Foldkit Model

Typography has no Model, Message, update function, Command, or installable
helper. Parent views own their semantic markup and choose the utility classes
that fit the surrounding page.

## Usage

Bind the Foldkit Html factory inside your view, then apply utility classes
directly to the semantic element you render:

```ts
const h = html<Message>()

h.h1(
  [h.Class('scroll-m-20 text-4xl font-extrabold tracking-tight')],
  ['Taxing Laughter: The Joke Tax Chronicles'],
)
```

Do not import from `shadcn/typography`; there is no generated helper module for
this docs-only row.

## Examples

The examples cover each origin Typography specimen with deterministic local
copy: h1, h2, h3, h4, paragraph, blockquote, table, list, inline code, lead,
large, small, muted, and RTL.

## Accessibility

Keep the semantic element that matches the content. Use heading levels in page
order, reserve blockquotes for quoted material, keep tables for tabular data,
and preserve readable contrast when using muted text.

## Foldkit Differences

React and the origin language selector are fixture evidence only. The Foldkit
examples render direct Html values and the local RTL example uses deterministic
text instead of importing the origin app language selector.
