# 025 - Implement Base UI and shadcn Checkbox

## Summary

Implement Base UI Checkbox and shadcn Checkbox together, preserving checked,
unchecked, and indeterminate behavior in Foldkit-native form-control terms.

## Source Evidence

- Selection row: `plans/artifacts/020-next-component-selection/selection.md`
- Dossier: `plans/artifacts/004-foundational-component-dossiers/checkbox/dossier.json`
- Preview: `plans/artifacts/004-foundational-component-dossiers/checkbox/plan-preview.md`
- Origin docs:
  - `https://base-ui.com/react/components/checkbox`
  - `https://ui.shadcn.com/docs/components/checkbox`

## Scope

- Add `registry-src/base-ui/checkbox/item.json`.
- Add `registry-src/shadcn/checkbox/item.json`.
- Add `src/registry/base-ui/checkbox/index.ts`.
- Add `src/registry/shadcn/checkbox/index.ts`.
- Port root, indicator, data attributes, ARIA state, hidden input/form semantics,
  and shadcn base-nova styling.
- Add parity slots for `base-ui/checkbox` and `shadcn/checkbox`.

## Implementation Notes

- Model checked state as a Schema union: checked, unchecked, indeterminate.
- Keep installable source stateless; examples can update Foldkit model state via
  messages.
- Preserve origin data attributes such as checked, unchecked, indeterminate,
  disabled, and invalid where present.
- Do not add lucide-react or React as runtime dependencies for indicators.

## Testing

- Port Base UI checkbox behavior tests semantically.
- Cover pointer and keyboard toggling, disabled behavior, form value behavior,
  indeterminate rendering, and ARIA checked values.
- Add origin parity for Base UI demos and shadcn examples.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep checkbox`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`

## STOP Conditions

- Stop if indeterminate state cannot be represented without DOM mutation in the
  installable source.
- Stop if dependency classification requires an unimplemented installable Field
  item rather than a fixture-only example shell.
