# 053 - Implement Base UI and shadcn Combobox

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat 96baac1d..HEAD -- plans/artifacts/040-next-component-selection/selection.md plans/artifacts/040-next-component-dossiers/combobox registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: HIGH
- **Depends on**: plans/034-implement-popover.md, plans/042-implement-select.md
- **Category**: direction
- **Planned at**: commit `96baac1d`, 2026-06-26

## Summary

Implement `base-ui/combobox` and `shadcn/combobox`. Combobox should reuse local
input, popup, collection, and selection conventions while preserving the origin
filtering, highlighted item, chips, and value behavior.

## Source Evidence

- Selection row: `plans/artifacts/040-next-component-selection/selection.md`
- Dossier: `plans/artifacts/040-next-component-dossiers/combobox/dossier.json`
- Preview: `plans/artifacts/040-next-component-dossiers/combobox/plan-preview.md`
- Origin docs:
  - `https://base-ui.com/react/components/combobox`
  - `https://ui.shadcn.com/docs/components/combobox`
- Key origin source: `repos/base-ui/packages/react/src/combobox/**`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/combobox.tsx`

## Scope

- Add `registry-src/base-ui/combobox/item.json`.
- Add `registry-src/shadcn/combobox/item.json`.
- Add `src/registry/base-ui/combobox/index.ts` and tests.
- Add `src/registry/shadcn/combobox/index.ts`, `examples.ts`, and tests.
- Add parity fixture coverage for both registry items.
- Preserve root, input, trigger, value, list, item, empty state, group/label,
  chip/chips/chip remove, popup, portal, positioner, arrow, backdrop, selection,
  highlighted item, filtering, disabled state, data attributes, and ARIA.

## Implementation Notes

- Reuse Select's collection/listbox/value conventions where they match.
- Reuse Popover's positioning and dismiss conventions.
- Query text, selected values, highlighted item, and chips should be model-owned
  data with Effect Schema-derived types.
- shadcn Combobox composes local `base-ui/combobox`, `shadcn/button`,
  `shadcn/input`, and `utils/cn` as needed.

## Testing

- Port the Base UI Combobox tests semantically for every part in the dossier,
  including chips, filtering, empty state, keyboard navigation, selection, and
  popup lifecycle.
- Replicate shadcn Combobox examples.
- Add parity for input/listbox structure, filtering states, selected values,
  chips, dimensions, and styles.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep combobox --dry-run`
  - `bun run parity:check -- --grep combobox`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if Select did not settle a reusable collection/listbox model.
- Stop if filtering/chips require a broader local collection architecture before
  Combobox can be implemented without duplication.
