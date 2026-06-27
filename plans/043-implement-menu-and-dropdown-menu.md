# 043 - Implement Base UI Menu and shadcn Dropdown Menu

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat 96baac1d..HEAD -- plans/artifacts/040-next-component-selection/selection.md plans/artifacts/040-next-component-dossiers/menu-dropdown-menu registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: HIGH
- **Depends on**: plans/029-implement-toggle.md, plans/034-implement-popover.md
- **Category**: direction
- **Planned at**: commit `96baac1d`, 2026-06-26

## Summary

Implement `base-ui/menu` and `shadcn/dropdown-menu` together. Menu is the shared
foundation for later context-menu and menubar work, so it must establish local
roving focus, nested submenus, checked items, radio groups, and popup behavior
without importing upstream React primitives.

## Source Evidence

- Selection row: `plans/artifacts/040-next-component-selection/selection.md`
- Dossier: `plans/artifacts/040-next-component-dossiers/menu-dropdown-menu/dossier.json`
- Preview: `plans/artifacts/040-next-component-dossiers/menu-dropdown-menu/plan-preview.md`
- Origin docs:
  - `https://base-ui.com/react/components/menu`
  - `https://ui.shadcn.com/docs/components/dropdown-menu`
- Key origin source: `repos/base-ui/packages/react/src/menu/**`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/dropdown-menu.tsx`

## Scope

- Add `registry-src/base-ui/menu/item.json`.
- Add `registry-src/shadcn/dropdown-menu/item.json`.
- Add `src/registry/base-ui/menu/index.ts` and tests.
- Add `src/registry/shadcn/dropdown-menu/index.ts`, `examples.ts`, and tests.
- Add parity fixture coverage for both registry items.
- Preserve root, trigger, portal, positioner, popup, item, group, group label,
  separator, checkbox item, radio item/group, submenus, arrow, backdrop,
  disabled state, keyboard navigation, typeahead, data attributes, and ARIA.

## Implementation Notes

- Treat Menu as the source of local conventions for Context Menu and Menubar.
- Reuse Popover's portal/position/dismiss/focus conventions instead of making a
  parallel overlay stack.
- Checked/radio item state belongs in the consuming Foldkit model and is updated
  through verb-first messages.
- shadcn Dropdown Menu composes local `base-ui/menu` and `utils/cn`; keep icon
  dependencies local or fixture-only.

## Testing

- Port the Base UI menu test suite semantically, especially checked items,
  radio groups, nested submenus, keyboard navigation, typeahead, disabled items,
  focus management, and popup dismissal.
- Replicate shadcn Dropdown Menu examples from the dossier.
- Add parity for origin demos, including nested menus and checked/radio states.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep menu --dry-run`
  - `bun run parity:check -- --grep menu`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if shared roving focus or collection navigation is needed and should be
  extracted before Select, Menubar, Context Menu, Navigation Menu, Combobox, or
  Autocomplete continue.
- Stop if nested submenu positioning cannot be tested deterministically with the
  existing parity harness.
