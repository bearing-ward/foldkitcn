# 037 - Implement Base UI Number Field

## Summary

Implement the Foldkit-native Base UI Number Field primitive. This is a complex
form control that should reuse the Input conventions from plan 022 and preserve
number parsing, formatting, clamping, step, scrub/increment controls, and data
attributes from origin evidence.

## Source Evidence

- Selection row: `plans/artifacts/020-next-component-selection/selection.md`
- Dossier: `plans/artifacts/007-remaining-component-dossiers/base-ui-number-field/dossier.json`
- Preview: `plans/artifacts/007-remaining-component-dossiers/base-ui-number-field/plan-preview.md`
- Origin docs: `https://base-ui.com/react/components/number-field`

## Scope

- Add `registry-src/base-ui/number-field/item.json`.
- Add `src/registry/base-ui/number-field/index.ts`.
- Port root, group, input, increment/decrement controls, scrub area if present,
  value normalization, min/max/step, locale/format policy from the dossier, and
  data attributes.
- Add a parity slot for `base-ui/number-field`.

## Implementation Notes

- Numeric value and text input state belong in the consuming Foldkit model.
- Use Effect Schema for parsed value state, empty state, invalid parse state, and
  constraints.
- Reuse local Input rendering conventions instead of creating a separate
  incompatible form-control model.
- Keep parsing and canonicalization deterministic so tests compare normalized
  values rather than raw entry order or locale noise.

## Testing

- Port Base UI number-field tests semantically for parsing, clamping, stepping,
  keyboard increments, disabled/read-only behavior, form value, and invalid
  input.
- Add parity for origin demos, including exact dimensions for grouped controls.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep number-field`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`

## STOP Conditions

- Stop if plan 022 is not landed.
- Stop if locale or formatting behavior needs a shared policy before the control
  can be accurately ported.
