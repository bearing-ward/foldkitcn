# 036 - Implement shadcn Label

## Summary

Implement the Foldkit-native `shadcn/label` registry item. This plan is ordered
before Field because many shadcn form examples depend on a local Label item.

## Source Evidence

- Selection row: `plans/artifacts/020-next-component-selection/selection.md`
- Dossier: `plans/artifacts/007-remaining-component-dossiers/shadcn-label/dossier.json`
- Preview: `plans/artifacts/007-remaining-component-dossiers/shadcn-label/plan-preview.md`
- Origin docs: `https://ui.shadcn.com/docs/components/label`

## Scope

- Add `registry-src/shadcn/label/item.json`.
- Add `src/registry/shadcn/label/index.ts`.
- Port base-nova styles and examples.
- Add a parity slot for `shadcn/label`.

## Implementation Notes

- Prefer native `label` semantics and keep the API Foldkit-native.
- Use Effect Schema for props and exported types.
- Preserve disabled/error/group peer styling hooks used by the origin style pack.
- Keep class handling local and canonicalized through `cn`.

## Testing

- Add Scene coverage for `for`, nested control, disabled styling hooks, and
  accessible name behavior.
- Add parity fixtures for all origin examples.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep shadcn/label`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`

## STOP Conditions

- Stop if the current shadcn source row has no installable source and is now
  docs/example-only.
- Stop if implementation would need React Slot cloning.
