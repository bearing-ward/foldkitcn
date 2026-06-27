# 042 - Implement Base UI and shadcn Select

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat 96baac1d..HEAD -- plans/artifacts/040-next-component-selection/selection.md plans/artifacts/040-next-component-dossiers/select registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: HIGH
- **Depends on**: plans/022-implement-input.md, plans/034-implement-popover.md
- **Category**: direction
- **Planned at**: commit `96baac1d`, 2026-06-26

## Summary

Implement `base-ui/select` and `shadcn/select` together. The Base UI primitive
owns selection, popup/listbox behavior, keyboard navigation, grouping, labels,
and value display; the shadcn wrapper composes it with local styles and examples.

## Source Evidence

- Selection row: `plans/artifacts/040-next-component-selection/selection.md`
- Dossier: `plans/artifacts/040-next-component-dossiers/select/dossier.json`
- Preview: `plans/artifacts/040-next-component-dossiers/select/plan-preview.md`
- Origin docs:
  - `https://base-ui.com/react/components/select`
  - `https://ui.shadcn.com/docs/components/select`
- Key origin source: `repos/base-ui/packages/react/src/select/**`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/select.tsx`

## Scope

- Add `registry-src/base-ui/select/item.json`.
- Add `registry-src/shadcn/select/item.json`.
- Add `src/registry/base-ui/select/index.ts` and tests.
- Add `src/registry/shadcn/select/index.ts`, `examples.ts`, and tests.
- Add parity fixture coverage for both registry items.
- Preserve root, trigger, value, portal, positioner, popup, item, group, group
  label, separator, arrow, scroll controls, icon, selection indicator, disabled
  state, placeholder, data attributes, and ARIA behavior.

## Implementation Notes

- Reuse Popover's portal/position/dismiss conventions.
- Model selected value and highlighted item in the consuming Foldkit model; do
  not hide selection in mutable component internals.
- Use Effect Schema literals/unions for value and variant shapes where the
  registry surface needs validation.
- shadcn Select must compose local `base-ui/select` and `utils/cn`; no Radix,
  Base UI React, or React runtime imports are allowed in installable source.

## Testing

- Port the Base UI select tests semantically for listbox navigation, typeahead,
  selected value, disabled items, grouping, popup lifecycle, focus restore,
  ARIA, data attributes, scroll buttons, and form-facing behavior.
- Replicate all shadcn Select examples and variants present in the dossier.
- Add parity for Base UI demos and shadcn examples.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep select --dry-run`
  - `bun run parity:check -- --grep select`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if Select requires a shared collection/listbox abstraction that should be
  built before implementing Combobox, Autocomplete, Navigation Menu, and Menu.
- Stop if the implementation would duplicate Popover positioning or create a
  competing focus/dismiss system.
