# 073 - Implement shadcn Spinner

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat e5534d56..HEAD -- plans/artifacts/070-next-component-selection/selection.md plans/artifacts/070-next-component-dossiers/shadcn-spinner registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/070-implement-shadcn-item.md, plans/072-implement-shadcn-input-group.md
- **Category**: direction
- **Planned at**: commit `e5534d56`, 2026-06-28

## Summary

Implement `shadcn/spinner` as a local inline SVG helper with examples across
badges, buttons, items, input groups, RTL, size, and custom icon states.

## Source Evidence

- Selection row: `plans/artifacts/070-next-component-selection/selection.md`
- Dossier: `plans/artifacts/070-next-component-dossiers/shadcn-spinner/dossier.json`
- Preview: `plans/artifacts/070-next-component-dossiers/shadcn-spinner/plan-preview.md`
- Origin docs: `https://ui.shadcn.com/docs/components/spinner`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/spinner.tsx`
- Origin examples: `repos/ui/apps/v4/examples/base/spinner-*.tsx`
- Origin root slot: `spinner`.

## Scope

- Add `registry-src/shadcn/spinner/item.json`.
- Add `src/registry/shadcn/spinner/index.ts`, `examples.ts`, and tests.
- Add `shadcn/spinner` parity fixture coverage.
- Update generated registry/docs/progress artifacts.
- If plan 072 deferred spinner-specific Input Group examples, update those
  examples and parity cases after Spinner is local.

## Implementation Notes

- Preserve the origin `size-4 animate-spin` root class and `data-slot="spinner"`.
- Replace `lucide-react` loader icons with local inline SVGs carrying the same
  class and aria-hidden footprint.
- Compose local `shadcn/badge`, `shadcn/button`, `shadcn/input-group`,
  `shadcn/item`, and `utils/cn`.
- `shadcn/empty` is planned next. If the `spinner-empty` example cannot be
  represented without local Empty, record a temporary accepted deviation and
  have plan 074 fill it.

## Testing

- Add tests for root attributes, class canonicalization, SVG attributes, sizes,
  and example structure.
- Add parity cases for all implemented Spinner examples.
- Run:
  - `bun run registry:build`
  - `bun run origin:components:write`
  - `bun run registry:check`
  - `bun run origin:components:check`
  - `bun run parity:check -- --grep spinner --dry-run`
  - `bun run parity:check -- --grep spinner`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if Spinner parity would require importing `lucide-react` into
  installable source.
- Stop if a deferred example needs a not-yet-local registry component and cannot
  be represented as an accepted deviation.
