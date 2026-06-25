# Outstanding Held Component Dossier Preview

## Batch

- `shadcn/data-table`
- `shadcn/date-picker`
- `shadcn/toast`
- `shadcn/typography`

This dossier does not implement registry source. It records the final
outstanding rows from the pinned shadcn origin surface and keeps them blocked
until the missing local foundations or resolver capabilities exist.

## Why These Rows Are Held

### `shadcn/data-table`

- Docs URL: https://ui.shadcn.com/docs/components/data-table
- Local repo: `repos/ui`
- Pinned ref: `95471a0fb95b2b205e1850841e05d93f3fcae659`
- Resolution status: `docs-example-only`
- Missing primary source: `repos/ui/apps/v4/styles/base-nova/ui/data-table.tsx`
- Evidence paths:
  - `repos/ui/apps/v4/content/docs/components/base/data-table.mdx`
  - `repos/ui/apps/v4/content/docs/components/radix/data-table.mdx`
  - `repos/ui/apps/v4/examples/base/data-table-demo.tsx`
  - `repos/ui/apps/v4/examples/base/data-table-rtl.tsx`
  - `repos/ui/apps/v4/examples/radix/data-table-demo.tsx`
  - `repos/ui/apps/v4/examples/radix/data-table-rtl.tsx`
  - `repos/ui/apps/v4/app/(app)/examples/tasks/components/data-table.tsx`
  - `repos/ui/apps/v4/app/(app)/examples/tasks/components/data-table-column-header.tsx`
  - `repos/ui/apps/v4/app/(app)/examples/tasks/components/data-table-faceted-filter.tsx`
  - `repos/ui/apps/v4/app/(app)/examples/tasks/components/data-table-pagination.tsx`
  - `repos/ui/apps/v4/app/(app)/examples/tasks/components/data-table-row-actions.tsx`
  - `repos/ui/apps/v4/app/(app)/examples/tasks/components/data-table-toolbar.tsx`
  - `repos/ui/apps/v4/app/(app)/examples/tasks/components/data-table-view-options.tsx`
  - `repos/ui/apps/v4/app/(app)/examples/dashboard/components/data-table.tsx`
  - `repos/ui/apps/v4/public/r/styles/default/data-table-demo.json`
- Runtime hints: `@dnd-kit/core`, `@dnd-kit/modifiers`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `@tanstack/react-table`, `lucide-react`, `react`, `recharts`, `sonner`, `zod`
- Registry hints: `shadcn/badge`, `shadcn/button`, `shadcn/checkbox`, `shadcn/command`, `shadcn/drawer`, `shadcn/dropdown-menu`, `shadcn/input`, `shadcn/label`, `shadcn/popover`, `shadcn/select`, `shadcn/separator`, `shadcn/table`, `shadcn/tabs`, `utils/cn`
- Blockers:
  - No primary base-nova shadcn component source exists; use docs/example-only evidence for planning.
  - A local table/query/sorting/filtering/pagination foundation must replace TanStack React Table semantics.
  - Dashboard examples require local chart, drawer, tabs, toast, and drag-and-drop dependency decisions before parity can be accepted.

### `shadcn/date-picker`

- Docs URL: https://ui.shadcn.com/docs/components/date-picker
- Local repo: `repos/ui`
- Pinned ref: `95471a0fb95b2b205e1850841e05d93f3fcae659`
- Resolution status: `docs-example-only`
- Missing primary source: `repos/ui/apps/v4/styles/base-nova/ui/date-picker.tsx`
- Evidence paths:
  - `repos/ui/apps/v4/content/docs/components/base/date-picker.mdx`
  - `repos/ui/apps/v4/content/docs/components/radix/date-picker.mdx`
  - `repos/ui/apps/v4/examples/base/date-picker-basic.tsx`
  - `repos/ui/apps/v4/examples/base/date-picker-demo.tsx`
  - `repos/ui/apps/v4/examples/base/date-picker-dob.tsx`
  - `repos/ui/apps/v4/examples/base/date-picker-input.tsx`
  - `repos/ui/apps/v4/examples/base/date-picker-natural-language.tsx`
  - `repos/ui/apps/v4/examples/base/date-picker-range.tsx`
  - `repos/ui/apps/v4/examples/base/date-picker-rtl.tsx`
  - `repos/ui/apps/v4/examples/base/date-picker-time.tsx`
  - `repos/ui/apps/v4/examples/radix/date-picker-basic.tsx`
  - `repos/ui/apps/v4/examples/radix/date-picker-demo.tsx`
  - `repos/ui/apps/v4/examples/radix/date-picker-dob.tsx`
  - `repos/ui/apps/v4/examples/radix/date-picker-input.tsx`
  - `repos/ui/apps/v4/examples/radix/date-picker-natural-language.tsx`
  - `repos/ui/apps/v4/examples/radix/date-picker-range.tsx`
  - `repos/ui/apps/v4/examples/radix/date-picker-rtl.tsx`
  - `repos/ui/apps/v4/examples/radix/date-picker-time.tsx`
  - `repos/ui/apps/v4/public/r/styles/default/date-picker-demo.json`
  - `repos/ui/apps/v4/public/r/styles/default/date-picker-form.json`
  - `repos/ui/apps/v4/public/r/styles/default/date-picker-with-presets.json`
  - `repos/ui/apps/v4/public/r/styles/default/date-picker-with-range.json`
- Runtime hints: `@/components/language-selector`, `chrono-node`, `date-fns`, `date-fns/locale`, `lucide-react`, `react`, `react-day-picker`, `react-day-picker/locale`
- Registry hints: `shadcn/button`, `shadcn/calendar`, `shadcn/field`, `shadcn/input`, `shadcn/input-group`, `shadcn/popover`
- Blockers:
  - No primary base-nova shadcn component source exists; use docs/example-only evidence for planning.
  - Local calendar/date behavior, popover, field, and input foundations must exist before installable source.
  - Range, time, locale, and natural-language parsing decisions must be modeled without React DayPicker runtime source.

### `shadcn/toast`

- Docs URL: https://ui.shadcn.com/docs/components/toast
- Local repo: `repos/ui`
- Pinned ref: `95471a0fb95b2b205e1850841e05d93f3fcae659`
- Resolution status: `docs-example-only`
- Missing primary source: `repos/ui/apps/v4/styles/base-nova/ui/toast.tsx`
- Evidence paths:
  - `repos/ui/apps/v4/content/docs/components/base/toast.mdx`
  - `repos/ui/apps/v4/content/docs/components/radix/toast.mdx`
  - `repos/ui/apps/v4/public/r/styles/default/toast-demo.json`
  - `repos/ui/apps/v4/public/r/styles/default/toast-destructive.json`
  - `repos/ui/apps/v4/public/r/styles/default/toast-simple.json`
  - `repos/ui/apps/v4/public/r/styles/default/toast-with-action.json`
  - `repos/ui/apps/v4/public/r/styles/default/toast-with-title.json`
  - `repos/ui/apps/v4/public/r/styles/default/toast.json`
  - `repos/ui/apps/v4/public/r/styles/default/use-toast.json`
- Runtime hints: `react`
- Registry hints: `base-ui/toast`, `shadcn/button`
- Blockers:
  - No primary base-nova shadcn component source exists; use docs/example-only and public registry JSON evidence for planning.
  - Notification architecture must be settled across base-ui/toast, shadcn/sonner, shadcn/toast, Foldkit messages, commands, and subscriptions.
  - The React hook-style origin API must be mapped to Foldkit messages, commands, and managed subscriptions.

### `shadcn/typography`

- Docs URL: https://ui.shadcn.com/docs/components/typography
- Local repo: `repos/ui`
- Pinned ref: `95471a0fb95b2b205e1850841e05d93f3fcae659`
- Resolution status: `docs-example-only`
- Missing primary source: `repos/ui/apps/v4/styles/base-nova/ui/typography.tsx`
- Evidence paths:
  - `repos/ui/apps/v4/content/docs/components/base/typography.mdx`
  - `repos/ui/apps/v4/content/docs/components/radix/typography.mdx`
  - `repos/ui/apps/v4/examples/base/typography-blockquote.tsx`
  - `repos/ui/apps/v4/examples/base/typography-demo.tsx`
  - `repos/ui/apps/v4/examples/base/typography-h1.tsx`
  - `repos/ui/apps/v4/examples/base/typography-h2.tsx`
  - `repos/ui/apps/v4/examples/base/typography-h3.tsx`
  - `repos/ui/apps/v4/examples/base/typography-h4.tsx`
  - `repos/ui/apps/v4/examples/base/typography-inline-code.tsx`
  - `repos/ui/apps/v4/examples/base/typography-large.tsx`
  - `repos/ui/apps/v4/examples/base/typography-lead.tsx`
  - `repos/ui/apps/v4/examples/base/typography-list.tsx`
  - `repos/ui/apps/v4/examples/base/typography-muted.tsx`
  - `repos/ui/apps/v4/examples/base/typography-p.tsx`
  - `repos/ui/apps/v4/examples/base/typography-rtl.tsx`
  - `repos/ui/apps/v4/examples/base/typography-small.tsx`
  - `repos/ui/apps/v4/examples/base/typography-table.tsx`
  - `repos/ui/apps/v4/public/r/styles/default/typography-blockquote.json`
  - `repos/ui/apps/v4/public/r/styles/default/typography-demo.json`
  - `repos/ui/apps/v4/public/r/styles/default/typography-h1.json`
  - `repos/ui/apps/v4/public/r/styles/default/typography-h2.json`
  - `repos/ui/apps/v4/public/r/styles/default/typography-h3.json`
  - `repos/ui/apps/v4/public/r/styles/default/typography-h4.json`
  - `repos/ui/apps/v4/public/r/styles/default/typography-inline-code.json`
  - `repos/ui/apps/v4/public/r/styles/default/typography-large.json`
  - `repos/ui/apps/v4/public/r/styles/default/typography-lead.json`
  - `repos/ui/apps/v4/public/r/styles/default/typography-list.json`
  - `repos/ui/apps/v4/public/r/styles/default/typography-muted.json`
  - `repos/ui/apps/v4/public/r/styles/default/typography-p.json`
  - `repos/ui/apps/v4/public/r/styles/default/typography-small.json`
  - `repos/ui/apps/v4/public/r/styles/default/typography-table.json`
- Runtime hints: `@/components/language-selector`, `react`
- Registry hints: `none`
- Blockers:
  - No primary base-nova shadcn component source exists; use docs/example-only evidence for planning.
  - Typography is docs/examples plus local style primitive evidence, not a single installable behavior component yet.
  - @/components/language-selector and react are origin fixture evidence only, not installable runtime dependencies.

## Dependency Policy

- `react`: `dev-or-fixture-only`
- `recharts`: `reject-or-defer`
- `@tanstack/react-table`: `reject-or-defer`
- `@dnd-kit/*`: `reject-or-defer`
- `sonner`: `reject-or-defer`
- `react-day-picker`: `reject-or-defer`
- `date-fns`: `reject-or-defer`
- `chrono-node`: `reject-or-defer`

## Foldkit Mapping

- Keep these rows non-installable until local dependencies are available.
- Use docs/example-only planning evidence for rows without primary shadcn source.
- Keep React and origin registry paths fixture-only.
- Replace React composition with Foldkit messages, state, commands,
  subscriptions, Submodels, `toView`, or named part renderers as appropriate.
- Use Effect Schema to define any future boundary data, variants, row models,
  date models, chart config, and notification events.
- Treat typography as local style or document primitives unless a later
  implementation plan proves a component boundary.
- For chart, create the native chart foundation first; do not plan a direct
  Recharts wrapper as installable registry source.

## Future Improve Plan Shape

1. Keep these rows visible as blocked intake: `shadcn/data-table`, `shadcn/date-picker`, `shadcn/toast`, `shadcn/typography`.
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
