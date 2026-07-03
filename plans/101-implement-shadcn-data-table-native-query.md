# Plan 101: Implement shadcn Data Table with native Foldkit query state

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report; do not improvise. When done, update the status row for this plan in
> `plans/README.md` unless a reviewer dispatched you and told you they maintain
> the index.
>
> **Drift check (run first)**:
> `git diff --stat bb57b4d0..HEAD -- registry-src/shadcn/data-table src/registry/shadcn/data-table src/live-examples.ts src/main.ts scripts/registry-common.ts docs/component-conversion-checklist.json docs/component-conversion-checklist.md registry plans/README.md`
>
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding. On a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: HIGH
- **Depends on**: Plan 075 (`shadcn/table`), Plan 076 (`shadcn/pagination`), Plan 077 (`shadcn/command`), Plan 043 (`shadcn/dropdown-menu`), Plan 025 (`shadcn/checkbox`), Plan 042 (`shadcn/select`), Plan 022 (`shadcn/input`), Plan 058 (`shadcn/card`)
- **Category**: direction
- **Planned at**: commit `bb57b4d0`, 2026-07-03

## Why this matters

`shadcn/data-table` is one of the last blocked shadcn rows. It is blocked
because the origin examples depend on TanStack Table and React state, while this
registry needs installable Foldkit-native source. The right target is not a
monolithic data grid component: the origin docs themselves describe Data Table
as a guide for composing a table from local primitives. This plan promotes the
row by adding a small local query model and examples that compose the existing
`shadcn/table`, `button`, `checkbox`, `dropdown-menu`, `input`, `select`,
`badge`, and `pagination` items without importing `@tanstack/react-table`,
`@dnd-kit`, `react`, `recharts`, `sonner`, or `zod`.

## Current state

- `docs/component-conversion-checklist.json` still marks `shadcn/data-table` as
  blocked and names the local foundation that must replace TanStack semantics:

```json
// docs/component-conversion-checklist.json:2296-2325
{
  "itemId": "shadcn/data-table",
  "originResolutionStatus": "docs-example-only",
  "hasOriginDocs": true,
  "hasOriginSource": false,
  "hasRegistryItem": false,
  "implementationStatus": "dossier-ready",
  "availability": "private",
  "blockers": [
    "No primary base-nova shadcn component source exists; use docs/example-only evidence for planning.",
    "A local table/query/sorting/filtering/pagination foundation must replace TanStack React Table semantics.",
    "Dashboard examples require local chart, drawer, tabs, toast, and drag-and-drop dependency decisions before parity can be accepted."
  ],
  "unresolvedQuestions": [
    "What Foldkit table/query model should own sorting, filtering, pagination, row selection, and drag-and-drop?",
    "Which dashboard dependencies should become local primitives before data-table can be planned as installable source?"
  ]
}
```

- The held-row dossier for Data Table is docs/example-only. There is no primary
  `styles/base-nova/ui/data-table.tsx` source file:

```md
<!-- plans/artifacts/098-blocked-component-foundation-preview/plan-preview.md:17-45 -->

- Docs URL: https://ui.shadcn.com/docs/components/data-table
- Local repo: `repos/ui`
- Pinned ref: `40c7064532185f5556f6cbff7dca3544987c0fe1`
- Resolution status: `docs-example-only`
- Missing primary source: `repos/ui/apps/v4/styles/base-nova/ui/data-table.tsx`
- Evidence paths:
  - `repos/ui/apps/v4/content/docs/components/base/data-table.mdx`
  - `repos/ui/apps/v4/examples/base/data-table-demo.tsx`
  - `repos/ui/apps/v4/app/(app)/examples/tasks/components/data-table.tsx`
  - `repos/ui/apps/v4/app/(app)/examples/dashboard/components/data-table.tsx`
- Runtime hints: `@dnd-kit/core`, `@dnd-kit/modifiers`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `@tanstack/react-table`, `lucide-react`, `react`, `recharts`, `sonner`, `zod`
- Registry hints: `shadcn/badge`, `shadcn/button`, `shadcn/checkbox`, `shadcn/command`, `shadcn/drawer`, `shadcn/dropdown-menu`, `shadcn/input`, `shadcn/label`, `shadcn/popover`, `shadcn/select`, `shadcn/separator`, `shadcn/table`, `shadcn/tabs`, `utils/cn`
- Blockers:
  - No primary base-nova shadcn component source exists; use docs/example-only evidence for planning.
  - A local table/query/sorting/filtering/pagination foundation must replace TanStack React Table semantics.
  - Dashboard examples require local chart, drawer, tabs, toast, and drag-and-drop dependency decisions before parity can be accepted.
```

- The origin docs explicitly say this is a composition guide, not a reusable
  one-size component:

```md
<!-- repos/ui/apps/v4/content/docs/components/base/data-table.mdx:18-26 -->

Every data table or datagrid I've created has been unique. They all behave differently, have specific sorting and filtering requirements, and work with different data sources.

It doesn't make sense to combine all of these variations into a single component.

So instead of a data-table component, I thought it would be more helpful to provide a guide on how to build your own.

We'll start with the basic `<Table />` component and build a complex data table from scratch.
```

- The origin simple demo uses React state and TanStack Table for sorting,
  filters, pagination, visibility, and selection:

```tsx
// repos/ui/apps/v4/examples/base/data-table-demo.tsx:175-201
export function DataTableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  })
}
```

- The origin table rendering surface is standard `Table`, `TableHeader`,
  `TableBody`, `TableRow`, `TableHead`, and `TableCell`, with selected rows
  marked by `data-state`:

```tsx
// repos/ui/apps/v4/examples/base/data-table-demo.tsx:243-289
<Table>
  <TableHeader>{/* header groups */}</TableHeader>
  <TableBody>
    {table.getRowModel().rows?.length ? (
      table.getRowModel().rows.map(row => (
        <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
          {row.getVisibleCells().map(cell => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))
    ) : (
      <TableRow>
        <TableCell colSpan={columns.length} className="h-24 text-center">
          No results.
        </TableCell>
      </TableRow>
    )}
  </TableBody>
</Table>
```

- The dashboard example adds DnD, drawer, chart, inline edit forms, toast, and
  tabs. Treat it as follow-up evidence, not first-slice parity:

```tsx
// repos/ui/apps/v4/app/(app)/examples/dashboard/components/data-table.tsx:483-531
<DndContext
  collisionDetection={closestCenter}
  modifiers={[restrictToVerticalAxis]}
  onDragEnd={handleDragEnd}
>
  <Table>
    <TableHeader className="sticky top-0 z-10 bg-muted">
      {/* headers */}
    </TableHeader>
    <TableBody className="**:data-[slot=table-cell]:first:w-8">
      {table.getRowModel().rows?.length ? (
        <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
          {table.getRowModel().rows.map(row => (
            <DraggableRow key={row.id} row={row} />
          ))}
        </SortableContext>
      ) : (
        <TableRow>{/* empty row */}</TableRow>
      )}
    </TableBody>
  </Table>
</DndContext>
```

- Native Foldkit `DragAndDrop` exists and should be used for any future row
  reorder example. It is headless and commits through an out-message:

```md
<!-- repos/foldkit/packages/website/src/page/ui/dragAndDropPage.ts:241-264 -->

DragAndDrop is different from other Foldkit UI components in two ways. First, it doesn't have a `view()` function. Instead, you spread `draggable()` and `droppable()` attributes onto your own elements. Second, its update function returns a three-tuple: `[model, commands, maybeOutMessage]`. You handle `Reordered` and `Cancelled` OutMessages to decide how to reorder your data.
```

- Native Foldkit `VirtualList` exists and should be used for any future large
  row-count example. It receives the full item array from the parent and needs a
  constrained-height scroll container:

```md
<!-- repos/foldkit/packages/website/src/page/ui/virtualListPage.ts:133-143, 287-306 -->

items: The full item array. Items live in your Model, not the component's; pass them fresh on each render. Swap, filter, sort, or paginate freely without sending Messages to the list.

VirtualList exposes a single subscription, `containerEvents`, that listens for `scroll` events on the container and observes its size with `ResizeObserver`.

The container needs a constrained height for virtualization to work.
```

- The existing `shadcn/table` item is deliberately structural. It must remain
  the table primitive that Data Table composes:

```md
<!-- registry-src/shadcn/table/docs.md:5-9 -->

Table is a Foldkit-native port of the shadcn base-nova Table helper. It provides the origin structural slots for container, table, caption, header, body, footer, row, head, and cell while keeping data and interaction behavior outside the primitive.

Table is a stateless render helper. It owns no Model, Message, update function, or Command. Parent views decide what rows exist, how they are keyed, and whether row actions compose another registry item such as Dropdown Menu.
```

- The existing table tests intentionally kept `data-table` and origin-only
  runtime dependencies out of `shadcn/table`; this plan should not remove that
  guard. Add new `shadcn/data-table` tests instead:

```ts
// src/registry/shadcn/table/table.test.ts:283-315
test('keeps data-table and origin-only runtime specifiers out of installable files', async () => {
  const forbiddenRuntimeSpecifiers = [
    '@tanstack/react-table',
    '@base-ui',
    'lucide-react',
    'react',
    'react-dom',
    '@/components/language-selector',
    '@/styles/',
    '@/lib/utils',
  ]
  // ...
  expect(
    forbiddenRuntimeSpecifiers.filter(specifier =>
      installableSourceText.includes(specifier),
    ),
  ).toStrictEqual([])
})
```

- Registry docs live examples are registered in two places. Add Data Table to
  both:

```ts
// scripts/registry-common.ts:623-628
'shadcn/table': new Set([
  'TableActions',
  'TableDemo',
  'TableFooterExample',
  'TableRtl',
]),
```

```ts
// src/live-examples.ts:2680-2684
[liveExampleKey('shadcn/table', 'TableActions')]: staticExample(TableActions),
[liveExampleKey('shadcn/table', 'TableDemo')]: staticExample(TableDemo),
[liveExampleKey('shadcn/table', 'TableFooterExample')]: staticExample(TableFooterExample),
[liveExampleKey('shadcn/table', 'TableRtl')]: staticExample(TableRtl),
```

## Commands you will need

| Purpose              | Command                            | Expected on success                                                                                     |
| -------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Registry status      | `bun run origin:components:status` | exits 0; after this plan, shadcn remaining count decreases and `shadcn/data-table` is no longer blocked |
| Typecheck            | `bun run typecheck`                | exits 0, no TypeScript errors                                                                           |
| Unit and scene tests | `bun run test`                     | exits 0, all Vitest suites pass                                                                         |
| Registry validation  | `bun run registry:check`           | exits 0, no manifest/docs validation errors                                                             |
| Docs artifact build  | `bun run registry:build`           | exits 0 and updates generated `registry/index.json` and `registry/docs/**` artifacts                    |
| Project check        | `bun run check`                    | exits 0, Ultracite reports no issues                                                                    |

Do not run `bun run format` or `bun run fix` unless the operator explicitly
allows broad formatting. Use narrow manual edits.

## Suggested executor toolkit

- Use the `foldkit` skill if available. This work must stay Foldkit-native:
  pure update, Schema-backed model fields, `m()` messages, `evo()` updates, and
  `html<Message>()` bound inside view functions.
- Read `repos/foldkit/examples/ui-showcase/src/ui/view/dragAndDrop.ts`,
  `repos/foldkit/examples/ui-showcase/src/ui/view/virtualList.ts`, and
  `repos/foldkit/packages/website/src/page/ui/subscriptions.ts` before adding
  any DnD or virtualization follow-up. For this plan, use them only to document
  the extension path.

## Scope

**In scope** (the only source files you should modify):

- `registry-src/shadcn/data-table/item.json` - new manifest
- `registry-src/shadcn/data-table/docs.md` - new sidecar docs
- `src/registry/shadcn/data-table/index.ts` - native query state and helper API
- `src/registry/shadcn/data-table/examples.ts` - payment/task/RTL examples
- `src/registry/shadcn/data-table/data-table.test.ts` - new tests
- `src/live-examples.ts` - live-preview registration and controller plumbing
- `src/main.ts` - docs live-preview state/messages for interactive data-table examples
- `scripts/registry-common.ts` - live-ready export names for generated example docs
- `docs/component-conversion-checklist.json` and `docs/component-conversion-checklist.md` - mark `shadcn/data-table` imported/current
- Generated registry artifacts under `registry/` from `bun run registry:build`
- `plans/README.md` - status update only when done

**Out of scope** (do not touch, even though related):

- Do not modify `src/registry/shadcn/table/**` except if a type export is
  absolutely required and reviewed first. Data Table must compose Table.
- Do not import or add dependencies on `@tanstack/react-table`, `@dnd-kit/*`,
  `react`, `react-dom`, `recharts`, `sonner`, `zod`, `lucide-react`, or origin
  alias imports.
- Do not implement the dashboard chart/drawer detail panel as part of this
  plan. It needs a separate chart/dashboard plan.
- Do not implement full row drag-and-drop or virtualization in this plan. Add
  explicit docs notes and API seams for future `DataTableReorder` and
  `DataTableVirtualized` examples, but leave those examples unregistered unless
  the operator explicitly broadens scope.
- Do not alter global docs shell styling or site navigation beyond generated
  registry/docs artifacts.

## Git workflow

- Branch: `codex/101-implement-shadcn-data-table-native-query`
- Commit style in this repo is short conventional-ish messages, for example
  `feat: add shadcn registry component batch` and
  `docs: record shadcn date picker plan`.
- Commit per logical unit if working manually; do not push or open a PR unless
  the operator explicitly asks.

## Steps

### Step 1: Confirm the row is still held and no source folder exists

Run:

```bash
test ! -d registry-src/shadcn/data-table
test ! -d src/registry/shadcn/data-table
bun run origin:components:status
```

Expected:

- both `test ! -d ...` commands exit 0;
- `origin:components:status` exits 0 and still reports `shadcn/data-table` as
  one of the remaining blocked/private rows.

If either source folder already exists, STOP and inspect the existing
implementation instead of overwriting it.

### Step 2: Add the native query model in `src/registry/shadcn/data-table/index.ts`

Create the folder and implement a small generic, headless table/query helper.
The helper should not render an entire table by itself. It should own the data
operations that replace the TanStack row models:

- Schema-backed state:
  - `DataTableSortDirection = 'asc' | 'desc'`
  - `DataTableSort = { columnId: string, direction: DataTableSortDirection }`
  - `DataTableState = { sorting: ReadonlyArray<DataTableSort>, filters: Record<string, string>, hiddenColumnIds: ReadonlyArray<string>, selectedRowIds: Record<string, boolean>, pageIndex: number, pageSize: number }`
- Generic column description:
  - `id`, `header`, `isHideable`, `isSortable`, `isFilterable`
  - `valueText(row)`, `sortValue(row)`, `filterValue(row)`, and `cell(row)`
  - keep this a plain TypeScript generic because row data and cell renderers are
    not app Model fields.
- Pure helpers:
  - `initialState({ pageSize })`
  - `visibleColumns(columns, state)`
  - `filteredRows(rows, columns, state)`
  - `sortedRows(rows, columns, state)`
  - `paginatedRows(rows, state)`
  - `rowModel({ rows, columns, state })` returning filtered rows, sorted rows,
    paginated rows, selected counts, total page count, canPreviousPage, and
    canNextPage.
  - `toggleSort`, `setFilter`, `clearFilters`, `toggleColumnVisibility`,
    `toggleRowSelection`, `toggleAllPageRowsSelection`, `setPageIndex`,
    `setPageSize`, `nextPage`, `previousPage`, `firstPage`, `lastPage`.

Use Effect modules (`Array`, `Option`, `Order`, `Record`, `String`) where the
repo normally uses them in pipelines. Use `evo()` for state updates when
transforming a state object. Clamp page indexes so filtering or page-size changes
cannot leave the UI on an empty out-of-range page.

Add class helper constants for data-table-specific layout only, for example:

- root: `w-full`
- toolbar: `flex items-center gap-2 py-4`
- table wrapper: `overflow-hidden rounded-md border`
- pagination row: `flex items-center justify-end gap-2 py-4`

Do not duplicate the existing `shadcn/table` classes. Import and compose the
existing `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, and
`TableCell` helpers in examples.

**Verify**:

```bash
bun run typecheck
```

Expected: exits 0.

### Step 3: Add query-model unit tests

Create `src/registry/shadcn/data-table/data-table.test.ts`. Model the file
shape on `src/registry/shadcn/table/table.test.ts`: direct unit tests first,
then Scene tests for rendered examples.

Unit coverage must include:

- filtering by email/title text is case-insensitive and resets/clamps
  pagination;
- sorting toggles from none to asc to desc to none;
- hidden columns are omitted from `visibleColumns`, except non-hideable columns;
- selecting a single row, selecting all page rows, and clearing selection;
- page navigation clamps at the first and last page;
- forbidden runtime specifiers are absent from `item.json`, `index.ts`, and
  `examples.ts`: `@tanstack/react-table`, `@dnd-kit`, `react`, `react-dom`,
  `recharts`, `sonner`, `zod`, `lucide-react`, `@/`, and `useReactTable`.

**Verify**:

```bash
bun run test -- src/registry/shadcn/data-table/data-table.test.ts
```

Expected: exits 0 and the new tests pass.

### Step 4: Add Foldkit-native examples

Create `src/registry/shadcn/data-table/examples.ts`. Provide at least these
exports:

- `DataTableDemo` - payments table matching the origin simple demo:
  - status, email, amount, actions columns;
  - email filter input;
  - column visibility menu;
  - row checkboxes and select-all checkbox;
  - email sort button;
  - action dropdown with "Copy payment ID", "View customer", and "View payment details";
  - previous/next pagination buttons;
  - selected-row count text;
  - empty row text "No results."
- `DataTableTasks` - task-style table matching the origin reusable-components
  flavor:
  - title filter;
  - status and priority faceted filters can be simple local dropdown/select
    controls for this first slice;
  - rows-per-page select;
  - first/previous/next/last page buttons;
  - badges for status/priority.
- `DataTableRtl` - RTL layout with deterministic local strings. Do not import
  origin language-selector code.

Use an optional controller pattern like other interactive examples:

```ts
export type DataTableExampleController<Message> = Readonly<{
  state?: DataTableState
  onDataTableMessage?: (message: DataTableExampleMessage) => Message
}>
```

Define `DataTableExampleMessage` with verb-first message names such as
`UpdatedDataTableFilter`, `ClickedDataTableSort`, `ClickedDataTableRowCheckbox`,
`ClickedDataTableSelectAll`, `ClickedDataTableColumnVisibility`,
`ClickedDataTablePreviousPage`, `ClickedDataTableNextPage`,
`SelectedDataTablePageSize`, and `ClickedDataTableAction`.

When no controller is passed, render from a deterministic default state so code
snippets and static scene tests still work. When a controller is passed, route
all interactions through `onDataTableMessage`.

Use local inline SVG icons when needed. Do not import `lucide-react` or
`@tabler/icons-react`.

**Verify**:

```bash
bun run test -- src/registry/shadcn/data-table/data-table.test.ts
```

Expected: exits 0 and Scene tests confirm:

- `DataTableDemo` renders the filter input, email header sort button, payment
  rows, actions dropdown trigger, selected count, and previous/next buttons;
- empty-state rendering can be reached by supplying a state filter that matches
  no rows;
- `DataTableRtl` renders `dir="rtl"` on the table/root and local RTL text.

### Step 5: Add registry manifest and docs sidecar

Create `registry-src/shadcn/data-table/item.json` following the shape of
`registry-src/shadcn/table/item.json` and `registry-src/shadcn/sonner/item.json`.

Manifest requirements:

- `id`: `shadcn/data-table`
- `namespace`: `shadcn`
- `name`: `Data Table`
- `kind`: `component`
- `installableSourcePaths` includes exactly:
  - `src/registry/shadcn/data-table/index.ts`
  - `src/registry/shadcn/data-table/examples.ts`
- `originProvenance` records:
  - docs URL `https://ui.shadcn.com/docs/components/data-table`
  - local repo `repos/ui`
  - git ref `40c7064532185f5556f6cbff7dca3544987c0fe1`
  - docs paths and example paths from the held-row dossier
  - no primary `sourceUrl` unless the schema requires a string; if required,
    use the docs URL and explain docs/example-only in `deviations`.
- registry dependencies:
  - `shadcn/badge`
  - `shadcn/button`
  - `shadcn/checkbox`
  - `shadcn/dropdown-menu`
  - `shadcn/input`
  - `shadcn/pagination`
  - `shadcn/select`
  - `shadcn/table`
  - `utils/cn`
- runtime dependencies:
  - `foldkit`
  - `effect`
  - `clsx`
  - `tailwind-merge`
- development dependencies:
  - `@tanstack/react-table`, `@dnd-kit/core`, `@dnd-kit/modifiers`,
    `@dnd-kit/sortable`, `@dnd-kit/utilities`, `react`, `react-dom`,
    `recharts`, `sonner`, `zod`, `lucide-react`, `@tabler/icons-react`
    classified as `dev-or-fixture-only` or `reject-or-defer` with reasons.
- lifecycle:
  - `implementationStatus`: `implemented`
  - `parityStatus`: `accepted`
  - `availability`: `installable`
  - `docsStatus`: `complete`
- deviations:
  - docs/example-only origin row, no primary source file;
  - local query model replaces TanStack Table;
  - dashboard DnD/chart/drawer details deferred;
  - local inline icons replace React icon packages.

Create `registry-src/shadcn/data-table/docs.md` with sections:

- Overview
- Foldkit Model
- Usage
- Examples
- Accessibility
- Foldkit Differences
- Follow-up: Native DragAndDrop and VirtualList

The Follow-up section must say:

- row reordering should use `@foldkit/ui/DragAndDrop` by adding a
  `DragAndDrop.Model`, lifted subscriptions, `draggable`/`droppable` attributes,
  and parent-owned `Reordered` handling;
- large row counts should use `@foldkit/ui/VirtualList` after filtering/sorting,
  with `VirtualList.Model`, `VirtualList.subscriptions.containerEvents`, stable
  row keys, and a constrained-height scroll container;
- neither behavior is part of first-slice Data Table acceptance.

**Verify**:

```bash
bun run registry:check
```

Expected: exits 0.

### Step 6: Wire live previews and docs generation

Update `scripts/registry-common.ts` by adding:

```ts
'shadcn/data-table': new Set([
  'DataTableDemo',
  'DataTableTasks',
  'DataTableRtl',
]),
```

Update `src/live-examples.ts`:

- import `DataTableDemo`, `DataTableTasks`, `DataTableRtl`, and
  `DataTableExampleMessage`/controller types;
- add a `DataTableExampleView` type near the other example view aliases;
- add `dataTableExample(...)` helper similar to `sonnerExample`,
  `sidebarExample`, or other controller-backed examples;
- add entries for:
  - `liveExampleKey('shadcn/data-table', 'DataTableDemo')`
  - `liveExampleKey('shadcn/data-table', 'DataTableTasks')`
  - `liveExampleKey('shadcn/data-table', 'DataTableRtl')`

Update `src/main.ts`:

- add a Schema-backed `liveExampleDataTableStates` field to `Model`;
- initialize it to an empty record;
- add one parent message that carries `exampleId` plus `DataTableExampleMessage`;
- update the live-example controller context so each rendered data-table example
  reads its state by example id and updates through the parent message;
- in `update`, pattern-match the data-table example message and call the pure
  helpers from `src/registry/shadcn/data-table/index.ts` to produce the next
  state with `evo()`.

Do not store row data in `src/main.ts`; examples own deterministic row fixtures.
The docs shell stores only per-example query state.

**Verify**:

```bash
bun run typecheck
bun run test -- src/story.test.ts src/scene.test.ts
```

Expected: both commands exit 0. The scene tests do not need to click every
table control, but they must confirm that generated live previews can render
the Data Table examples without missing preview registrations.

### Step 7: Regenerate registry and checklist artifacts

Run:

```bash
bun run registry:build
```

Expected: exits 0 and updates generated registry/docs artifacts for
`shadcn/data-table`.

Update the progress checklist files:

- in `docs/component-conversion-checklist.json`, set `shadcn/data-table` to:
  - `hasRegistryItem: true`
  - `paritySlotStatus: "accepted"` or the value used by comparable accepted rows
  - `implementationStatus: "implemented"`
  - `parityStatus: "accepted"`
  - `availability: "installable"`
  - `readiness: "imported"`
  - clear `blockers` and `unresolvedQuestions`
- update `docs/component-conversion-checklist.md` so the row no longer appears
  as blocked.

If the repo has a script that rewrites these reports, use that script. If no
script exists for this exact transition, make the narrow manual JSON/Markdown
edit and keep the formatting consistent with neighboring imported rows.

**Verify**:

```bash
bun run origin:components:status
```

Expected: exits 0, shadcn remaining count decreases by one, and
`shadcn/data-table` is no longer listed as blocked.

### Step 8: Run final gates

Run:

```bash
bun run typecheck
bun run test
bun run registry:check
bun run check
```

Expected: every command exits 0.

If `bun run check` reports only formatting differences in files you touched,
apply the smallest manual edits needed. Do not run broad formatters without
operator approval.

## Test plan

- `src/registry/shadcn/data-table/data-table.test.ts`
  - unit tests for filtering, sorting, visibility, row selection, pagination,
    page-size clamping, and forbidden dependency strings;
  - Scene tests for `DataTableDemo`, `DataTableTasks`, `DataTableRtl`, and a
    no-results state.
- `src/story.test.ts` or existing docs-shell state tests
  - add coverage for the parent docs live-preview message updating a
    data-table example state if there is already a comparable live-preview
    state test. If no comparable test exists, keep this to the data-table test
    file and verify through `src/scene.test.ts`.
- `src/scene.test.ts`
  - add or extend the component-route smoke to assert
    `/components/shadcn/data-table` can render the Examples section with live
    previews.

Use `src/registry/shadcn/table/table.test.ts` as the closest structural
pattern for class/helper tests, and use any controller-backed example tests
for the live-preview state shape.

## Done criteria

All must hold:

- [ ] `registry-src/shadcn/data-table/item.json` and `docs.md` exist.
- [ ] `src/registry/shadcn/data-table/index.ts`, `examples.ts`, and
      `data-table.test.ts` exist.
- [ ] Installable Data Table source contains no `@tanstack/react-table`,
      `@dnd-kit`, `react`, `react-dom`, `recharts`, `sonner`, `zod`,
      `lucide-react`, `@tabler/icons-react`, or origin alias imports.
- [ ] `DataTableDemo`, `DataTableTasks`, and `DataTableRtl` are live-ready in
      `scripts/registry-common.ts` and registered in `src/live-examples.ts`.
- [ ] `src/main.ts` stores only per-example Data Table query state, not row
      fixture data.
- [ ] `bun run typecheck` exits 0.
- [ ] `bun run test` exits 0.
- [ ] `bun run registry:check` exits 0.
- [ ] `bun run check` exits 0.
- [ ] `bun run origin:components:status` exits 0 and `shadcn/data-table` is no
      longer blocked.
- [ ] No files outside the in-scope list are modified, except generated
      registry artifacts from `bun run registry:build`.
- [ ] `plans/README.md` status row for Plan 101 is updated.

## STOP conditions

Stop and report back instead of improvising if:

- `registry-src/shadcn/data-table` or `src/registry/shadcn/data-table` already
  exists at the start of work.
- Any step appears to require importing TanStack Table, DnD Kit, React, Recharts,
  Zod, Sonner, or React icon packages into installable source.
- The local `shadcn/table`, `shadcn/checkbox`, `shadcn/dropdown-menu`,
  `shadcn/input`, `shadcn/select`, or `shadcn/pagination` APIs cannot support
  the first-slice examples without changing those components.
- You decide row drag-and-drop or virtualization must be included for first
  acceptance. They are follow-up features unless the operator broadens scope.
- Live-preview state changes in `src/main.ts` require a broad architecture
  rewrite rather than adding one state record and one message/update branch.
- `bun run registry:check`, `bun run typecheck`, or the focused data-table tests
  fail twice after reasonable fixes.

## Maintenance notes

- This plan intentionally resolves the base Data Table guide, not the full
  dashboard block. A follow-up plan should add `DataTableReorder` with native
  `@foldkit/ui/DragAndDrop` once the team decides how reorder interacts with
  active sort/filter/page state.
- A separate follow-up should add `DataTableVirtualized` with native
  `@foldkit/ui/VirtualList` for large row counts. It should run after the query
  model is stable because virtualization should consume the post-filter,
  post-sort row list.
- Reviewers should scrutinize page-index clamping, selected-row counting, and
  the installable dependency list. Those are the highest-risk places for subtle
  parity or architecture drift.
- The origin docs say users often customize data tables. Keep the public API
  small and compositional: query helpers plus examples, not a giant declarative
  table framework.
