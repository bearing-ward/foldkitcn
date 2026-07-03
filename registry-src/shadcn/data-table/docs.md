# Data Table

## Overview

Data Table is a Foldkit-native translation of the shadcn guide, not a giant
one-size grid component. It pairs the local `shadcn/table` primitive with a
small query-state helper for filtering, sorting, pagination, column visibility,
and row selection.

## Foldkit Model

`DataTableState` is Schema-backed and owns only table-query concerns:
sorting, string filters, hidden columns, selected row ids, and pagination.
Row data stays in the parent model or in example fixtures. The helper functions
stay pure so a parent update function can handle every interaction as a fact.

## Usage

Import the query helpers and compose them with the local table parts.

```ts
const state = DataTable.initialState({ pageSize: 10 })
const model = DataTable.rowModel({
  rows,
  columns,
  state,
  rowId: row => row.id,
})
```

Render `model.visibleColumns` with `shadcn/table`, drive filter inputs with
`setFilter`, sorting buttons with `toggleSort`, row checkboxes with
`toggleRowSelection`, and pagination controls with `previousPage`, `nextPage`,
`firstPage`, `lastPage`, and `setPageSize`.

## Examples

The registry includes:

- `DataTableDemo` for payments with email filtering, selection, sorting, and pagination
- `DataTableTasks` for a denser task workflow with badges, column visibility, and rows-per-page controls
- `DataTableRtl` for Arabic copy and RTL table layout

## Accessibility

Examples keep native table semantics by composing real `table`, `thead`,
`tbody`, `tr`, `th`, and `td` elements from the local Table primitive. Row
selection uses accessible checkbox controls, and filter/page controls keep
visible text labels or aria labels for screen readers.

## Foldkit Differences

The origin guide uses TanStack React Table, React state, Lucide React icons,
and follow-up dashboard integrations. This registry item replaces the row-model
logic with local pure helpers, uses Foldkit messages as facts, and keeps
installable source free of React, TanStack, chart, drawer, toast, and drag
dependencies.

## Follow-up: Native DragAndDrop and VirtualList

Future reorder examples should use native `@foldkit/ui/DragAndDrop` and commit
row moves back through parent update logic.

Future large-row examples should use native `@foldkit/ui/VirtualList` inside a
constrained-height scrolling container.

Neither reorder nor virtualization is part of first-slice acceptance for this
Data Table item.
