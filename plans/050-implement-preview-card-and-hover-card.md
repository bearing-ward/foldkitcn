# 050 - Implement Base UI Preview Card and shadcn Hover Card

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat 96baac1d..HEAD -- plans/artifacts/040-next-component-selection/selection.md plans/artifacts/040-next-component-dossiers/preview-card-hover-card registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED
- **Depends on**: plans/034-implement-popover.md, plans/040-implement-tooltip.md
- **Category**: direction
- **Planned at**: commit `96baac1d`, 2026-06-26

## Summary

Implement `base-ui/preview-card` and `shadcn/hover-card` together. Preview Card
should reuse the overlay/positioning work from Popover and delay/hover behavior
from Tooltip where applicable.

## Source Evidence

- Selection row: `plans/artifacts/040-next-component-selection/selection.md`
- Dossier: `plans/artifacts/040-next-component-dossiers/preview-card-hover-card/dossier.json`
- Preview: `plans/artifacts/040-next-component-dossiers/preview-card-hover-card/plan-preview.md`
- Origin docs:
  - `https://base-ui.com/react/components/preview-card`
  - `https://ui.shadcn.com/docs/components/hover-card`
- Key origin source: `repos/base-ui/packages/react/src/preview-card/**`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/hover-card.tsx`

## Scope

- Add `registry-src/base-ui/preview-card/item.json`.
- Add `registry-src/shadcn/hover-card/item.json`.
- Add `src/registry/base-ui/preview-card/index.ts` and tests.
- Add `src/registry/shadcn/hover-card/index.ts`, `examples.ts`, and tests.
- Add parity fixture coverage for both registry items.
- Preserve root, trigger, portal, positioner, popup, arrow, backdrop, delay,
  hover/focus behavior, data attributes, and ARIA relationships.

## Implementation Notes

- Reuse Popover's portal, positioning, dismiss, and focus conventions.
- Reuse Tooltip delay/hover-intent handling where the behavior matches.
- shadcn Hover Card composes local `base-ui/preview-card` and `utils/cn`.

## Testing

- Port Preview Card arrow/backdrop/popup/portal/positioner/root/trigger tests
  semantically.
- Replicate shadcn Hover Card examples.
- Add parity for hover/focus opening, placement, arrow, and dimensions.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep preview-card --dry-run`
  - `bun run parity:check -- --grep hover-card --dry-run`
  - `bun run parity:check -- --grep preview-card`
  - `bun run parity:check -- --grep hover-card`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if Tooltip delay behavior or Popover positioning is not landed.
- Stop if hover/focus timers need a shared command/subscription abstraction
  before Preview Card can be deterministic.
