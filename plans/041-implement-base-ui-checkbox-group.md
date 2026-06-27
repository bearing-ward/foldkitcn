# 041 - Implement Base UI Checkbox Group

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat 96baac1d..HEAD -- plans/artifacts/040-next-component-selection/selection.md plans/artifacts/040-next-component-dossiers/checkbox-group registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/025-implement-checkbox.md
- **Category**: direction
- **Planned at**: commit `96baac1d`, 2026-06-26

## Summary

Implement `base-ui/checkbox-group` as a Foldkit-native group behavior primitive
that composes the existing local checkbox conventions.

## Source Evidence

- Selection row: `plans/artifacts/040-next-component-selection/selection.md`
- Dossier: `plans/artifacts/040-next-component-dossiers/checkbox-group/dossier.json`
- Preview: `plans/artifacts/040-next-component-dossiers/checkbox-group/plan-preview.md`
- Origin docs: `https://base-ui.com/react/components/checkbox-group`
- Key origin source: `repos/base-ui/packages/react/src/checkbox-group/**`

## Scope

- Add `registry-src/base-ui/checkbox-group/item.json`.
- Add `src/registry/base-ui/checkbox-group/index.ts` and colocated tests.
- Add parity fixture coverage for `base-ui/checkbox-group`.
- Preserve group value modeling, checkbox parent coordination, disabled/read-only
  handling, orientation if present, data attributes, form-oriented attributes,
  and ARIA relationships.

## Implementation Notes

- Reuse the existing `base-ui/checkbox` checked/unchecked/indeterminate
  conventions rather than creating a second checkbox state model.
- Group selected values should be represented with Effect Schema-derived types
  and stable canonicalization for order-insensitive comparisons.
- Keep group mutation as Foldkit messages describing user facts, such as a value
  being checked or unchecked.

## Testing

- Port `CheckboxGroup.test.tsx` and `useCheckboxGroupParent.test.tsx`
  semantically.
- Add Scene coverage for keyboard and pointer selection, disabled items, group
  labeling, and data attributes.
- Add parity for the origin docs demos captured in the dossier.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep checkbox-group --dry-run`
  - `bun run parity:check -- --grep checkbox-group`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if plan 025 is not landed or Checkbox Group would need to change
  Checkbox's public registry API.
- Stop if origin behavior requires form serialization support that does not yet
  exist in the local registry foundation.
