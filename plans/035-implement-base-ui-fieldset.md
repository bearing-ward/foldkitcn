# 035 - Implement Base UI Fieldset

## Summary

Implement the Foldkit-native Base UI Fieldset primitive. This is a base-only
form foundation and should land before Field/Form work that wants grouped form
semantics.

## Source Evidence

- Selection row: `plans/artifacts/020-next-component-selection/selection.md`
- Dossier: `plans/artifacts/007-remaining-component-dossiers/base-ui-fieldset/dossier.json`
- Preview: `plans/artifacts/007-remaining-component-dossiers/base-ui-fieldset/plan-preview.md`
- Origin docs: `https://base-ui.com/react/components/fieldset`

## Scope

- Add `registry-src/base-ui/fieldset/item.json`.
- Add `src/registry/base-ui/fieldset/index.ts`.
- Port root, legend, description/error parts where present, disabled/invalid
  state propagation, ARIA relationships, and data attributes.
- Add a parity slot for `base-ui/fieldset`.

## Implementation Notes

- Use native `fieldset` and `legend` semantics where they match Base UI.
- Derive prop schemas with Effect Schema.
- Keep grouped state explicit in props; do not infer it from DOM mutation.
- Preserve source data attributes for disabled, invalid, and required states.

## Testing

- Port Base UI fieldset tests semantically.
- Cover disabled propagation, legend/description/error relationships, and data
  attribute output.
- Add parity for origin demos.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep fieldset`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`

## STOP Conditions

- Stop if disabled propagation requires hidden runtime state that should instead
  be modeled by a shared form helper.
