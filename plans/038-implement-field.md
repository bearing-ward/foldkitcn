# 038 - Implement Base UI and shadcn Field

## Summary

Implement Base UI Field and shadcn Field together. Field is a form composition
primitive and should land after local Input, Fieldset, and Label are available.

## Source Evidence

- Selection row: `plans/artifacts/020-next-component-selection/selection.md`
- Dossier: `plans/artifacts/007-remaining-component-dossiers/field/dossier.json`
- Preview: `plans/artifacts/007-remaining-component-dossiers/field/plan-preview.md`
- Origin docs:
  - `https://base-ui.com/react/components/field`
  - `https://ui.shadcn.com/docs/components/field`

## Scope

- Add `registry-src/base-ui/field/item.json`.
- Add `registry-src/shadcn/field/item.json`.
- Add `src/registry/base-ui/field/index.ts`.
- Add `src/registry/shadcn/field/index.ts`.
- Port root, item, label, control, description, error, validity, validation data
  combination, ARIA relationships, and shadcn base-nova styling.
- Add parity slots for `base-ui/field` and `shadcn/field`.

## Implementation Notes

- Validation state belongs in the consuming Foldkit model and should be encoded
  with Effect Schema tagged states.
- Preserve Base UI data attributes for valid, invalid, touched/dirty if present,
  disabled, required, and control relationships.
- Replace CVA with Effect Schema literals and pure class maps.
- For shadcn examples that reference components not yet implemented, use
  fixture-only shells or defer those examples explicitly; do not add runtime
  dependencies.

## Testing

- Port Base UI tests for control, description, error, item, label, root,
  validity, and combined validity data.
- Add Scene coverage for accessible descriptions, error messaging, validation
  state changes, and shadcn layout variants.
- Add parity for Base UI demos and dependency-complete shadcn examples.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep field`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`

## STOP Conditions

- Stop if plans 022, 035, or 036 are not landed.
- Stop if validation state needs a shared form architecture decision before
  implementation.
