# 024 - Implement Base UI and shadcn Switch

## Summary

Implement Base UI Switch and shadcn Switch together. The Base UI primitive owns
the checked, disabled, read-only, required, invalid, thumb, and data-attribute
semantics; the shadcn item composes it with local styling.

## Source Evidence

- Selection row: `plans/artifacts/020-next-component-selection/selection.md`
- Dossier: `plans/artifacts/004-foundational-component-dossiers/switch/dossier.json`
- Preview: `plans/artifacts/004-foundational-component-dossiers/switch/plan-preview.md`
- Origin docs:
  - `https://base-ui.com/react/components/switch`
  - `https://ui.shadcn.com/docs/components/switch`

## Scope

- Add `registry-src/base-ui/switch/item.json`.
- Add `registry-src/shadcn/switch/item.json`.
- Add `src/registry/base-ui/switch/index.ts`.
- Add `src/registry/shadcn/switch/index.ts`.
- Port root and thumb parts plus Base UI data attributes.
- Add dependency-complete shadcn examples and fixture-only shells for examples
  that reference Field or Label before those plans land.
- Add parity slots for `base-ui/switch` and `shadcn/switch`.

## Implementation Notes

- Represent checked state with Effect Schema literals and explicit view props.
- Expose Foldkit message payload helpers for examples; do not store checked
  state inside installable component source.
- Preserve keyboard and pointer activation semantics through native button or
  input-backed rendering as appropriate for Base UI parity.
- Use local `cn` and replace upstream Base UI React imports with
  `base-ui/switch`.

## Testing

- Port Base UI root and thumb tests semantically.
- Cover checked/unchecked, disabled, read-only, required, invalid, keyboard
  activation, and form-value behavior.
- Add parity fixtures for Base UI demos and shadcn examples.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep switch`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`

## STOP Conditions

- Stop if native form behavior cannot match origin data attributes without a
  shared form-control helper.
- Stop if shadcn examples require installable Field or Label dependencies
  before those registry items exist.
