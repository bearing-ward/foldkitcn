# 057 - Implement shadcn Direction

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat 96baac1d..HEAD -- plans/artifacts/040-next-component-selection/selection.md plans/artifacts/040-next-component-dossiers/direction registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/019-add-origin-component-progress-tracker.md
- **Category**: direction
- **Planned at**: commit `96baac1d`, 2026-06-26

## Summary

Implement `shadcn/direction` from the shadcn origin evidence. This should remain
a small local utility/component row that supports direction-aware examples
without introducing React context or upstream runtime dependencies.

## Source Evidence

- Selection row: `plans/artifacts/040-next-component-selection/selection.md`
- Dossier: `plans/artifacts/040-next-component-dossiers/direction/dossier.json`
- Preview: `plans/artifacts/040-next-component-dossiers/direction/plan-preview.md`
- Origin docs: `https://ui.shadcn.com/docs/components/direction`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/direction.tsx`

## Scope

- Add `registry-src/shadcn/direction/item.json`.
- Add `src/registry/shadcn/direction/index.ts`, `examples.ts`, and tests.
- Add parity fixture coverage for `shadcn/direction` if the origin docs expose a
  renderable example.
- Preserve local direction API, examples, data attributes, and class behavior.

## Implementation Notes

- Model direction with Effect Schema literals such as `ltr` and `rtl`.
- Avoid React context; represent direction as explicit Foldkit model/view data or
  as a pure helper accepted by child renderers.
- Keep any docs-only behavior non-installable if the dossier reveals no real
  installable component source.

## Testing

- Replicate shadcn Direction examples from the dossier.
- Add tests for `ltr`/`rtl` output, local helper behavior, and composition with
  direction-aware examples.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep direction --dry-run`
  - `bun run parity:check -- --grep direction`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if the dossier proves this is docs-only rather than installable source;
  convert the plan to docs/example-only evidence instead of creating
  `registry-src/shadcn/direction`.
