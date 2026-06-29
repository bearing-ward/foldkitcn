# Table

## Overview

Table is a Foldkit-native port of the shadcn base-nova Table helper. It provides the origin structural slots for container, table, caption, header, body, footer, row, head, and cell while keeping data and interaction behavior outside the primitive.

## Foldkit Model

Table is a stateless render helper. It owns no Model, Message, update function, or Command. Parent views decide what rows exist, how they are keyed, and whether row actions compose another registry item such as Dropdown Menu.

## Usage

Import the helpers from the generated registry source and compose semantic table parts directly.

```ts
Table<Message>({
  children: [
    TableCaption<Message>({ children: ['A list of recent invoices.'] }),
    TableHeader<Message>({
      children: [
        TableRow<Message>({
          children: [
            TableHead<Message>({ children: ['Invoice'] }),
            TableHead<Message>({ children: ['Amount'] }),
          ],
        }),
      ],
    }),
    TableBody<Message>({
      children: rows.map(row =>
        TableRow<Message>({
          children: [
            TableCell<Message>({ children: [row.invoice] }),
            TableCell<Message>({ children: [row.amount] }),
          ],
        }),
      ),
    }),
  ],
})
```

Use `className` on table parts for local width, alignment, and font adjustments. Use `containerClassName` on `Table` when the responsive wrapper needs surrounding layout classes, and use `dir` for RTL tables.

## Examples

The registry includes live examples for invoice tables, footer totals, product action menus composed with local Button and Dropdown Menu helpers, and RTL invoice content.

## Accessibility

Table preserves native table semantics with real `table`, `caption`, `thead`, `tbody`, `tfoot`, `tr`, `th`, and `td` elements. Use captions for short summaries, keep header cells in `TableHead`, and pass attributes such as `colspan` or row keys through the `attributes` option when the data shape requires them.

## Foldkit Differences

The origin shadcn action example imports Lucide React and React Dropdown Menu composition. This registry item replaces the icon with a local inline SVG and composes existing Foldkit-native Button and Dropdown Menu helpers. The RTL example uses deterministic Arabic strings instead of the origin language-selector runtime dependency.
