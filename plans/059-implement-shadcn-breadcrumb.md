# 059 - Implement shadcn Breadcrumb

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat 96baac1d..HEAD -- plans/artifacts/040-next-component-selection/selection.md plans/artifacts/040-next-component-dossiers/breadcrumb registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/019-add-origin-component-progress-tracker.md
- **Category**: direction
- **Planned at**: commit `96baac1d`, 2026-06-26

## Summary

Implement `shadcn/breadcrumb` as a local styled navigation component with
shadcn-origin examples and parity coverage.

## Source Evidence

- Selection row: `plans/artifacts/040-next-component-selection/selection.md`
- Dossier: `plans/artifacts/040-next-component-dossiers/breadcrumb/dossier.json`
- Preview: `plans/artifacts/040-next-component-dossiers/breadcrumb/plan-preview.md`
- Origin docs: `https://ui.shadcn.com/docs/components/breadcrumb`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/breadcrumb.tsx`

## Scope

- Add `registry-src/shadcn/breadcrumb/item.json`.
- Add `src/registry/shadcn/breadcrumb/index.ts`, `examples.ts`, and tests.
- Add parity fixture coverage for `shadcn/breadcrumb`.
- Preserve breadcrumb root/list, item, link, page, separator, ellipsis,
  accessibility semantics, class names, and examples.

## Implementation Notes

- Keep navigation semantics explicit with ordered list markup and current-page
  attributes matching the origin.
- Use local icon handling for ellipsis/separators; do not introduce runtime
  `lucide-react` imports into installable source.
- Use `utils/cn` and local style data.

## Testing

- Replicate shadcn Breadcrumb examples from the dossier.
- Add tests for semantic structure, current page, separators, ellipsis, class
  composition, and keyboard/link behavior.
- Add parity for DOM structure, dimensions, and styles.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep breadcrumb --dry-run`
  - `bun run parity:check -- --grep breadcrumb`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if Breadcrumb examples depend on a not-yet-local dropdown/menu component;
  defer only those examples or wait for plan 043 rather than importing upstream
  runtime dependencies.
