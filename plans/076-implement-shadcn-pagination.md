# 076 - Implement shadcn Pagination

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat e5534d56..HEAD -- plans/artifacts/070-next-component-selection/selection.md plans/artifacts/070-next-component-dossiers/shadcn-pagination registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/019-add-origin-component-progress-tracker.md, plans/038-implement-base-ui-and-shadcn-field.md, plans/042-implement-select.md
- **Category**: direction
- **Planned at**: commit `e5534d56`, 2026-06-28

## Summary

Implement `shadcn/pagination` as a local styled navigation component with
button/field/select examples and shadcn origin parity.

## Source Evidence

- Selection row: `plans/artifacts/070-next-component-selection/selection.md`
- Dossier: `plans/artifacts/070-next-component-dossiers/shadcn-pagination/dossier.json`
- Preview: `plans/artifacts/070-next-component-dossiers/shadcn-pagination/plan-preview.md`
- Origin docs: `https://ui.shadcn.com/docs/components/pagination`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/pagination.tsx`
- Origin examples: `repos/ui/apps/v4/examples/base/pagination-*.tsx`
- Origin slots include `pagination`, `pagination-content`,
  `pagination-item`, `pagination-link`, previous/next controls, and ellipsis.

## Scope

- Add `registry-src/shadcn/pagination/item.json`.
- Add `src/registry/shadcn/pagination/index.ts`, `examples.ts`, and tests.
- Add `shadcn/pagination` parity fixture coverage.
- Update generated registry/docs/progress artifacts.

## Implementation Notes

- Preserve origin nav/list semantics, current-page attributes, disabled states,
  icons-only rendering, simple rendering, and RTL examples.
- Compose local `shadcn/button`, `shadcn/field`, `shadcn/select`, and
  `utils/cn`.
- Replace `lucide-react` and language-selector runtime with local inline icons
  and deterministic RTL fixture data.
- Model link rendering through Foldkit `toView` or named part renderers instead
  of React `asChild` or Next Link cloning semantics.

## Testing

- Add tests for semantic navigation structure, current page, previous/next,
  ellipsis, disabled state, custom class canonicalization, and example output.
- Replicate origin demo, icons-only, RTL, and simple examples.
- Add origin and Foldkit parity cases for each replicated example.
- Run:
  - `bun run registry:build`
  - `bun run origin:components:write`
  - `bun run registry:check`
  - `bun run origin:components:check`
  - `bun run parity:check -- --grep pagination --dry-run`
  - `bun run parity:check -- --grep pagination`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if parity requires a router, Next Link, React Slot cloning, or upstream
  runtime dependency in installable source.
- Stop if a selected pagination example depends on a not-yet-local registry
  item not listed in this plan.
