# 031 - Implement Base UI and shadcn Slider

## Summary

Implement Base UI Slider and shadcn Slider together. This is a high-fidelity
interaction primitive: value normalization, thumb movement, keyboard increments,
orientation, min/max/step, and form behavior all need source-backed coverage.

## Source Evidence

- Selection row: `plans/artifacts/020-next-component-selection/selection.md`
- Dossier: `plans/artifacts/004-foundational-component-dossiers/slider/dossier.json`
- Preview: `plans/artifacts/004-foundational-component-dossiers/slider/plan-preview.md`
- Origin docs:
  - `https://base-ui.com/react/components/slider`
  - `https://ui.shadcn.com/docs/components/slider`

## Scope

- Add `registry-src/base-ui/slider/item.json`.
- Add `registry-src/shadcn/slider/item.json`.
- Add `src/registry/base-ui/slider/index.ts`.
- Add `src/registry/shadcn/slider/index.ts`.
- Port root, track, range, thumb, hidden input/form semantics, orientation,
  direction, min/max/step, disabled, multiple thumbs if present in origin, and
  data attributes.
- Add parity slots for `base-ui/slider` and `shadcn/slider`.

## Implementation Notes

- Value belongs in the consuming Foldkit model; installable source exposes
  geometry and event helpers.
- Build a deterministic normalization helper so value arrays canonicalize before
  comparison, regardless of input order.
- Use pointer and keyboard behavior from Base UI tests as the source of truth.
- Keep shadcn styling local and route class merging through `cn`.

## Testing

- Port Base UI tests for normalization, clamping, step rounding, keyboard
  behavior, disabled state, orientation, and thumb ordering.
- Add visual parity that checks dimensions, thumb positions, track/range
  structure, and shadcn variants.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep slider`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`

## STOP Conditions

- Stop if pointer geometry requires shared DOM measurement infrastructure.
- Stop if range/multi-thumb parity cannot be tested deterministically.
