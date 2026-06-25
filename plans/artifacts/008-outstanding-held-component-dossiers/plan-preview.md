# Outstanding Held Component Dossier Preview

## Batch

- `shadcn/data-table`
- `shadcn/date-picker`
- `shadcn/toast`
- `shadcn/typography`
- `shadcn/chart`

This dossier does not implement registry source. It records the final
outstanding rows from the pinned shadcn origin surface and keeps them blocked
until the missing local foundations or resolver capabilities exist.

## Why These Rows Are Held

### `shadcn/data-table`

- Docs URL: https://ui.shadcn.com/docs/components/data-table
- Local repo: `repos/ui`
- Pinned ref: `95471a0fb95b2b205e1850841e05d93f3fcae659`
- Resolver status: missing `repos/ui/apps/v4/styles/base-nova/ui/data-table.tsx`
- Evidence paths:
  - `repos/ui/apps/v4/content/docs/components/base/data-table.mdx`
  - `repos/ui/apps/v4/content/docs/components/radix/data-table.mdx`
  - `repos/ui/apps/v4/examples/base/data-table-demo.tsx`
  - `repos/ui/apps/v4/examples/base/data-table-rtl.tsx`
  - `repos/ui/apps/v4/app/(app)/examples/tasks/components/data-table.tsx`
  - `repos/ui/apps/v4/app/(app)/examples/dashboard/components/data-table.tsx`
- Local dependencies to settle: table, checkbox, dropdown-menu, command,
  popover, select, drawer, tabs, chart, toast/sonner, badge, input, label,
  separator, and button.
- Deferred runtime hints: `@tanstack/react-table`, dnd-kit packages,
  `recharts`, `sonner`, `zod`, React, and React icon packages.

### `shadcn/date-picker`

- Docs URL: https://ui.shadcn.com/docs/components/date-picker
- Local repo: `repos/ui`
- Pinned ref: `95471a0fb95b2b205e1850841e05d93f3fcae659`
- Resolver status: missing `repos/ui/apps/v4/styles/base-nova/ui/date-picker.tsx`
- Evidence paths:
  - `repos/ui/apps/v4/content/docs/components/base/date-picker.mdx`
  - `repos/ui/apps/v4/content/docs/components/radix/date-picker.mdx`
  - `repos/ui/apps/v4/examples/base/date-picker-basic.tsx`
  - `repos/ui/apps/v4/examples/base/date-picker-demo.tsx`
  - `repos/ui/apps/v4/examples/base/date-picker-natural-language.tsx`
  - `repos/ui/apps/v4/examples/base/date-picker-range.tsx`
  - `repos/ui/apps/v4/examples/base/date-picker-time.tsx`
- Local dependencies to settle: calendar, popover, field, input, input-group,
  and button.
- Deferred runtime hints: `date-fns`, `chrono-node`, React DayPicker, React,
  and React icon packages.

### `shadcn/toast`

- Docs URL: https://ui.shadcn.com/docs/components/toast
- Local repo: `repos/ui`
- Pinned ref: `95471a0fb95b2b205e1850841e05d93f3fcae659`
- Resolver status: missing `repos/ui/apps/v4/styles/base-nova/ui/toast.tsx`
- Evidence paths:
  - `repos/ui/apps/v4/content/docs/components/base/toast.mdx`
  - `repos/ui/apps/v4/content/docs/components/radix/toast.mdx`
  - `repos/ui/apps/v4/public/r/styles/default/toast.json`
  - `repos/ui/apps/v4/public/r/styles/default/use-toast.json`
- Local dependencies to settle: `base-ui/toast`, `shadcn/button`, and the
  relationship between shadcn toast and `shadcn/sonner`.
- Deferred runtime hints: React hook-style toast APIs.

### `shadcn/typography`

- Docs URL: https://ui.shadcn.com/docs/components/typography
- Local repo: `repos/ui`
- Pinned ref: `95471a0fb95b2b205e1850841e05d93f3fcae659`
- Resolver status: missing `repos/ui/apps/v4/styles/base-nova/ui/typography.tsx`
- Evidence paths:
  - `repos/ui/apps/v4/content/docs/components/base/typography.mdx`
  - `repos/ui/apps/v4/content/docs/components/radix/typography.mdx`
  - `repos/ui/apps/v4/examples/base/typography-demo.tsx`
  - `repos/ui/apps/v4/examples/base/typography-h1.tsx`
  - `repos/ui/apps/v4/examples/base/typography-p.tsx`
  - `repos/ui/apps/v4/examples/base/typography-table.tsx`
- Local decision to settle: whether typography is a component, a family of
  style primitives, or docs/examples-only registry content.
- Deferred runtime hints: React is fixture-only; language selector is
  fixture-only for RTL examples.

### `shadcn/chart`

- Docs URL: https://ui.shadcn.com/docs/components/chart
- Local repo: `repos/ui`
- Pinned ref: `95471a0fb95b2b205e1850841e05d93f3fcae659`
- Resolver status: resolves today, but remains chart-foundation-gated.
- Evidence paths:
  - `repos/ui/apps/v4/styles/base-nova/ui/chart.tsx`
  - `repos/ui/apps/v4/content/docs/components/base/chart.mdx`
  - `repos/ui/apps/v4/examples/base/chart-demo.tsx`
  - `repos/ui/apps/v4/examples/base/chart-example.tsx`
  - `repos/ui/apps/v4/public/r/styles/default/chart.json`
- Local dependencies to settle: native chart foundation, chart namespace,
  chart example fixture harness, card, and `utils/cn`.
- Deferred runtime hints: `recharts` and React.

## Foldkit Mapping

- Keep these rows non-installable until local dependencies are available.
- Use docs/example-only resolution for rows without primary shadcn source.
- Keep React and origin registry paths fixture-only.
- Replace React composition with Foldkit messages, state, commands,
  subscriptions, Submodels, `toView`, or named part renderers as appropriate.
- Use Effect Schema to define any future boundary data, variants, row models,
  date models, chart config, and notification events.
- For chart, create the native chart foundation first; do not plan a direct
  Recharts wrapper as installable registry source.

## Future Improve Plan Shape

1. Extend the planning resolver to capture docs/example-only shadcn rows as
   blocked dossier evidence without creating component folders.
2. Decide whether `shadcn/typography` is installable component source,
   style-token primitives, or docs/examples registry content.
3. Add a local table/query model before promoting `shadcn/data-table`.
4. Add local date/calendar behavior before promoting `shadcn/date-picker`.
5. Settle the notification model across `base-ui/toast`, `shadcn/sonner`, and
   `shadcn/toast`.
6. Add a native chart foundation before promoting `shadcn/chart` or chart
   blocks.
7. Run `bun run check`, `bun run typecheck`, `bun run registry:check`, and
   `git diff --check -- plans scripts docs`.
