# 051 - Implement Base UI and shadcn Menubar

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat 96baac1d..HEAD -- plans/artifacts/040-next-component-selection/selection.md plans/artifacts/040-next-component-dossiers/menubar registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: HIGH
- **Depends on**: plans/043-implement-menu-and-dropdown-menu.md
- **Category**: direction
- **Planned at**: commit `96baac1d`, 2026-06-26

## Summary

Implement `base-ui/menubar` and `shadcn/menubar`, reusing the local Menu
foundation for menu item semantics while adding menubar root navigation and
trigger behavior.

## Source Evidence

- Selection row: `plans/artifacts/040-next-component-selection/selection.md`
- Dossier: `plans/artifacts/040-next-component-dossiers/menubar/dossier.json`
- Preview: `plans/artifacts/040-next-component-dossiers/menubar/plan-preview.md`
- Origin docs:
  - `https://base-ui.com/react/components/menubar`
  - `https://ui.shadcn.com/docs/components/menubar`
- Key origin source: `repos/base-ui/packages/react/src/menubar/**`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/menubar.tsx`

## Scope

- Add `registry-src/base-ui/menubar/item.json`.
- Add `registry-src/shadcn/menubar/item.json`.
- Add `src/registry/base-ui/menubar/index.ts` and tests.
- Add `src/registry/shadcn/menubar/index.ts`, `examples.ts`, and tests.
- Add parity fixture coverage for both registry items.
- Preserve menubar root, menu triggers, menu popup composition, roving focus,
  keyboard navigation, checked/radio items, submenus, data attributes, and ARIA.

## Implementation Notes

- Reuse `base-ui/menu` behavior for item, group, checked, radio, submenu, and
  popup semantics.
- Menubar should own only the additional horizontal root and trigger navigation
  behavior.
- shadcn Menubar composes local `base-ui/menubar` and `utils/cn`.

## Testing

- Port `Menubar.test.tsx` semantically and cover menu composition through Scene
  tests.
- Replicate shadcn Menubar examples, including checkbox/radio/submenu cases.
- Add parity for root structure, keyboard navigation, menu opening, and styles.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep menubar --dry-run`
  - `bun run parity:check -- --grep menubar`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if plan 043 is not landed or Menubar would duplicate Menu item/submenu
  behavior.
