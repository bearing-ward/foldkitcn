# 030 - Implement Base UI and shadcn Toggle Group

## Summary

Implement Base UI Toggle Group and shadcn Toggle Group together. This plan
depends on the local Toggle semantics from plan 029 and extends them to single
and multiple selection groups.

## Source Evidence

- Selection row: `plans/artifacts/020-next-component-selection/selection.md`
- Dossier: `plans/artifacts/004-foundational-component-dossiers/toggle-group/dossier.json`
- Preview: `plans/artifacts/004-foundational-component-dossiers/toggle-group/plan-preview.md`
- Origin docs:
  - `https://base-ui.com/react/components/toggle-group`
  - `https://ui.shadcn.com/docs/components/toggle-group`

## Scope

- Add `registry-src/base-ui/toggle-group/item.json`.
- Add `registry-src/shadcn/toggle-group/item.json`.
- Add `src/registry/base-ui/toggle-group/index.ts`.
- Add `src/registry/shadcn/toggle-group/index.ts`.
- Preserve root, item, single/multiple selection, disabled items, orientation,
  roving focus, ARIA pressed, and data attributes.
- Add parity slots for `base-ui/toggle-group` and `shadcn/toggle-group`.

## Implementation Notes

- Selection state belongs in the consuming Foldkit model.
- Use Effect Schema unions for selection mode and value shape.
- Compose each item through local Toggle/Button conventions and avoid React Slot.
- Replace CVA with pure class maps and local `cn`.

## Testing

- Port Base UI tests semantically for single and multiple selection, disabled
  items, keyboard navigation, and orientation.
- Add parity for Base UI demos and shadcn examples.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep toggle-group`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`

## STOP Conditions

- Stop if plan 029 is not landed.
- Stop if the shared roving-focus behavior diverges from Tabs or Radio Group and
  needs a common helper first.
