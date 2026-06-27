# 052 - Implement Base UI and shadcn Navigation Menu

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat 96baac1d..HEAD -- plans/artifacts/040-next-component-selection/selection.md plans/artifacts/040-next-component-dossiers/navigation-menu registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: HIGH
- **Depends on**: plans/043-implement-menu-and-dropdown-menu.md, plans/050-implement-preview-card-and-hover-card.md
- **Category**: direction
- **Planned at**: commit `96baac1d`, 2026-06-26

## Summary

Implement `base-ui/navigation-menu` and `shadcn/navigation-menu`. This should
reuse the local menu/preview-card conventions for collection navigation,
positioned content, viewport, arrow, and popup interactions.

## Source Evidence

- Selection row: `plans/artifacts/040-next-component-selection/selection.md`
- Dossier: `plans/artifacts/040-next-component-dossiers/navigation-menu/dossier.json`
- Preview: `plans/artifacts/040-next-component-dossiers/navigation-menu/plan-preview.md`
- Origin docs:
  - `https://base-ui.com/react/components/navigation-menu`
  - `https://ui.shadcn.com/docs/components/navigation-menu`
- Key origin source: `repos/base-ui/packages/react/src/navigation-menu/**`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/navigation-menu.tsx`

## Scope

- Add `registry-src/base-ui/navigation-menu/item.json`.
- Add `registry-src/shadcn/navigation-menu/item.json`.
- Add `src/registry/base-ui/navigation-menu/index.ts` and tests.
- Add `src/registry/shadcn/navigation-menu/index.ts`, `examples.ts`, and tests.
- Add parity fixture coverage for both registry items.
- Preserve root, list, item, trigger, content, viewport, positioner, arrow,
  icon, backdrop, link, value/open state, keyboard navigation, data attributes,
  and ARIA.

## Implementation Notes

- Reuse any shared collection navigation from Menu and any hover/focus popup
  behavior from Preview Card.
- Treat active value and open content as Foldkit model state.
- shadcn Navigation Menu composes local `base-ui/navigation-menu` and `utils/cn`.

## Testing

- Port the Base UI Navigation Menu tests semantically for root/list/item,
  trigger/content, viewport, positioning, arrow, icon, link, backdrop, keyboard
  navigation, and data attributes.
- Replicate shadcn Navigation Menu examples.
- Add parity for viewport dimensions, content transitions, structure, and
  styling.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep navigation-menu --dry-run`
  - `bun run parity:check -- --grep navigation-menu`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if the required collection/navigation abstraction has not been settled by
  Menu or if Navigation Menu would fork the popup/viewport behavior from Preview
  Card.
