# 021 - Implement Base UI and shadcn Avatar

## Summary

Implement the Foldkit-native Avatar primitive and its shadcn wrapper as one
batch. The shadcn item must compose the local `base-ui/avatar` implementation,
not the upstream React primitive.

## Source Evidence

- Selection row: `plans/artifacts/020-next-component-selection/selection.md`
- Dossier: `plans/artifacts/004-foundational-component-dossiers/avatar/dossier.json`
- Preview: `plans/artifacts/004-foundational-component-dossiers/avatar/plan-preview.md`
- Origin docs:
  - `https://base-ui.com/react/components/avatar`
  - `https://ui.shadcn.com/docs/components/avatar`

## Scope

- Add `registry-src/base-ui/avatar/item.json`.
- Add `registry-src/shadcn/avatar/item.json`.
- Add `src/registry/base-ui/avatar/index.ts`.
- Add `src/registry/shadcn/avatar/index.ts`.
- Port Base UI root, image, fallback parts, data attributes, and image loading
  status semantics.
- Add shadcn base-nova styling and every dependency-complete origin example.
- Add parity slots for `base-ui/avatar` and `shadcn/avatar`.

## Implementation Notes

- Derive public prop schemas with Effect Schema and keep state expressible as
  discriminated data rather than nullable flags.
- Preserve Base UI data attributes for loading, loaded, and error states.
- Treat image loading as modeled state updated by Foldkit messages in examples;
  installable source should expose render helpers, not hidden React effects.
- `shadcn/dropdown-menu`, language selector, and lucide icons from origin
  examples are not available yet. Use local fixture-only static shells or defer
  only those examples explicitly; do not add runtime dependencies for them.
- Use the existing `shadcn/button` item only where the dossier marks it as a
  registry-local dependency.

## Testing

- Port Base UI Avatar root, image, and fallback test scenarios semantically.
- Add image loaded/error/fallback Story or Scene coverage.
- Add visual parity for the Base UI hero demo and shadcn examples that can be
  represented with local dependencies.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep avatar`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`

## STOP Conditions

- Stop if image loading cannot be modeled without React lifecycle hooks.
- Stop if an origin example requires an unimplemented installable dependency and
  cannot be represented as a fixture-only shell.
- Stop if any installable manifest includes React, lucide-react, or upstream
  Base UI runtime packages.
