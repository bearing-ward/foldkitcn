# 075 - Implement shadcn Table

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat e5534d56..HEAD -- plans/artifacts/070-next-component-selection/selection.md plans/artifacts/070-next-component-dossiers/shadcn-table registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/019-add-origin-component-progress-tracker.md
- **Category**: direction
- **Planned at**: commit `e5534d56`, 2026-06-28

## Summary

Implement `shadcn/table` as the local styled table primitive with examples,
theme-local classes, docs artifacts, and shadcn origin parity.

## Source Evidence

- Selection row: `plans/artifacts/070-next-component-selection/selection.md`
- Dossier: `plans/artifacts/070-next-component-dossiers/shadcn-table/dossier.json`
- Preview: `plans/artifacts/070-next-component-dossiers/shadcn-table/plan-preview.md`
- Origin docs: `https://ui.shadcn.com/docs/components/table`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/table.tsx`
- Origin examples: `repos/ui/apps/v4/examples/base/table-*.tsx`
- Origin slots include `table-container`, `table`, `table-header`,
  `table-body`, `table-footer`, `table-row`, `table-head`, `table-cell`, and
  `table-caption`.

## Scope

- Add `registry-src/shadcn/table/item.json`.
- Add `src/registry/shadcn/table/index.ts`, `examples.ts`, and tests.
- Add `shadcn/table` parity fixture coverage.
- Update generated registry/docs/progress artifacts.

## Implementation Notes

- Keep this plan scoped to the presentational Table primitive. Do not implement
  `shadcn/data-table`, query state, sorting, filtering, or pagination here.
- Preserve the origin wrapper element, table semantics, caption/header/body/
  footer structure, row/cell slots, and responsive overflow behavior.
- Compose local `shadcn/button`, `shadcn/dropdown-menu`, and `utils/cn` for the
  action example; replace `lucide-react` and language-selector runtime with
  local deterministic fixture data or inline icons.
- Keep all style data local to `src/registry/shadcn/table` and represent any
  variant-like options with Effect Schema literals.

## Testing

- Add tests for every exported part, semantic table structure, slot attributes,
  custom class canonicalization, and example structure.
- Replicate origin table action, demo, footer, and RTL examples.
- Add origin and Foldkit parity cases for each replicated example.
- Run:
  - `bun run registry:build`
  - `bun run origin:components:write`
  - `bun run registry:check`
  - `bun run origin:components:check`
  - `bun run parity:check -- --grep table --dry-run`
  - `bun run parity:check -- --grep table`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if the implementation starts pulling in TanStack Table, data-table query
  behavior, or runtime sorting/filtering state.
- Stop if parity requires importing React, `lucide-react`, or origin repo paths
  into installable source.
