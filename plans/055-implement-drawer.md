# 055 - Implement Base UI and shadcn Drawer

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat 96baac1d..HEAD -- plans/artifacts/040-next-component-selection/selection.md plans/artifacts/040-next-component-dossiers/drawer registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED
- **Depends on**: plans/033-implement-dialog.md
- **Category**: direction
- **Planned at**: commit `96baac1d`, 2026-06-26

## Summary

Implement `base-ui/drawer` and `shadcn/drawer` as Foldkit-native modal drawer
components that reuse Dialog's portal, focus, dismiss, and scroll-lock
foundation.

## Source Evidence

- Selection row: `plans/artifacts/040-next-component-selection/selection.md`
- Dossier: `plans/artifacts/040-next-component-dossiers/drawer/dossier.json`
- Preview: `plans/artifacts/040-next-component-dossiers/drawer/plan-preview.md`
- Origin docs:
  - `https://base-ui.com/react/components/drawer`
  - `https://ui.shadcn.com/docs/components/drawer`
- Key origin source: `repos/base-ui/packages/react/src/drawer/**`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/drawer.tsx`

## Scope

- Add `registry-src/base-ui/drawer/item.json`.
- Add `registry-src/shadcn/drawer/item.json`.
- Add `src/registry/base-ui/drawer/index.ts` and tests.
- Add `src/registry/shadcn/drawer/index.ts`, `examples.ts`, and tests.
- Add parity fixture coverage for both registry items.
- Preserve root, trigger, portal, popup/content, backdrop, close, title,
  description, indent/indent background, placement/direction if present, modal
  behavior, focus restore, data attributes, and ARIA.

## Implementation Notes

- Reuse Dialog for modal lifecycle, portal, focus, escape/outside dismiss, and
  aria labeling.
- Drawer-specific placement, indentation, and styling should be represented as
  Effect Schema variants and pure class maps.
- shadcn Drawer composes local `base-ui/drawer` and `utils/cn`.

## Testing

- Port Drawer content, indent, indent background, popup, and root tests
  semantically.
- Replicate shadcn Drawer examples and theme/style variants.
- Add parity for placement, structure, dimensions, modal behavior, focus, and
  data attributes.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep drawer --dry-run`
  - `bun run parity:check -- --grep drawer`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if plan 033 is not landed or Drawer would fork Dialog's modal lifecycle,
  focus, portal, or dismiss behavior.
