# 046 - Implement Base UI and shadcn Context Menu

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat 96baac1d..HEAD -- plans/artifacts/040-next-component-selection/selection.md plans/artifacts/040-next-component-dossiers/context-menu registry-src src/registry tests/parity`
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

Implement `base-ui/context-menu` and `shadcn/context-menu` using the local Menu
foundation, with context-trigger positioning and platform-aware keyboard/pointer
behavior.

## Source Evidence

- Selection row: `plans/artifacts/040-next-component-selection/selection.md`
- Dossier: `plans/artifacts/040-next-component-dossiers/context-menu/dossier.json`
- Preview: `plans/artifacts/040-next-component-dossiers/context-menu/plan-preview.md`
- Origin docs:
  - `https://base-ui.com/react/components/context-menu`
  - `https://ui.shadcn.com/docs/components/context-menu`
- Key origin source: `repos/base-ui/packages/react/src/context-menu/**`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/context-menu.tsx`

## Scope

- Add `registry-src/base-ui/context-menu/item.json`.
- Add `registry-src/shadcn/context-menu/item.json`.
- Add `src/registry/base-ui/context-menu/index.ts` and tests.
- Add `src/registry/shadcn/context-menu/index.ts`, `examples.ts`, and tests.
- Add parity fixture coverage for both registry items.
- Preserve trigger, popup positioning from context point, keyboard opening,
  platform-specific behavior, nested items/submenus, checked/radio items, data
  attributes, and ARIA.

## Implementation Notes

- Compose or reuse `base-ui/menu` item semantics and only add context-menu
  specific trigger/positioning behavior here.
- Keep pointer coordinates and open state in Foldkit model data or deterministic
  command results; do not hide them in mutable closures.
- shadcn Context Menu composes local `base-ui/context-menu` and `utils/cn`.

## Testing

- Port Base UI context menu tests semantically, including non-Mac behavior.
- Replicate shadcn Context Menu examples, including checkbox/radio/submenu
  cases where present.
- Add parity for right-click/context-key opening and menu structure.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep context-menu --dry-run`
  - `bun run parity:check -- --grep context-menu`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if plan 043 is not landed or Context Menu would need to duplicate Menu
  item, submenu, checked item, or roving focus behavior.
- Stop if platform-specific context-key behavior cannot be represented in the
  existing test harness.
