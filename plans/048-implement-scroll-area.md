# 048 - Implement Base UI and shadcn Scroll Area

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat 96baac1d..HEAD -- plans/artifacts/040-next-component-selection/selection.md plans/artifacts/040-next-component-dossiers/scroll-area registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/019-add-origin-component-progress-tracker.md
- **Category**: direction
- **Planned at**: commit `96baac1d`, 2026-06-26

## Summary

Implement `base-ui/scroll-area` and `shadcn/scroll-area`, preserving the origin
structure and data attributes while keeping browser measurement/scroll behavior
behind deterministic tests and parity fixtures.

## Source Evidence

- Selection row: `plans/artifacts/040-next-component-selection/selection.md`
- Dossier: `plans/artifacts/040-next-component-dossiers/scroll-area/dossier.json`
- Preview: `plans/artifacts/040-next-component-dossiers/scroll-area/plan-preview.md`
- Origin docs:
  - `https://base-ui.com/react/components/scroll-area`
  - `https://ui.shadcn.com/docs/components/scroll-area`
- Key origin source: `repos/base-ui/packages/react/src/scroll-area/**`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/scroll-area.tsx`

## Scope

- Add `registry-src/base-ui/scroll-area/item.json`.
- Add `registry-src/shadcn/scroll-area/item.json`.
- Add `src/registry/base-ui/scroll-area/index.ts` and tests.
- Add `src/registry/shadcn/scroll-area/index.ts`, `examples.ts`, and tests.
- Add parity fixture coverage for both registry items.
- Preserve root, viewport/content, scrollbar, thumb, corner, orientation,
  visibility state, data attributes, and structure.

## Implementation Notes

- Keep installable source free of React and upstream scroll-area packages.
- DOM measurement and scroll position updates should be represented through
  Foldkit commands/messages if needed, with pure helpers for testability.
- shadcn Scroll Area composes local `base-ui/scroll-area` and `utils/cn`.

## Testing

- Port Base UI scroll area tests semantically for content, corner, root,
  scrollbar, thumb, orientation, visibility, and data attributes.
- Replicate shadcn Scroll Area examples.
- Add parity for dimensions, DOM structure, scrollbar/thumb rendering, and
  orientation.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep scroll-area --dry-run`
  - `bun run parity:check -- --grep scroll-area`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if scroll measurement requires a shared ResizeObserver/subscription layer
  that should be planned before this component lands.
