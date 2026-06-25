# 023 - Implement shadcn Textarea

## Summary

Implement the Foldkit-native `shadcn/textarea` registry item from the
dossier-ready shadcn row. This can run independently from Input, but should
mirror the same form-control conventions.

## Source Evidence

- Selection row: `plans/artifacts/020-next-component-selection/selection.md`
- Dossier: `plans/artifacts/004-foundational-component-dossiers/textarea/dossier.json`
- Preview: `plans/artifacts/004-foundational-component-dossiers/textarea/plan-preview.md`
- Origin docs: `https://ui.shadcn.com/docs/components/textarea`

## Scope

- Add `registry-src/shadcn/textarea/item.json`.
- Add `src/registry/shadcn/textarea/index.ts`.
- Port base-nova styles and examples.
- Add a parity slot for `shadcn/textarea`.

## Implementation Notes

- Use Effect Schema for props and exported types.
- Keep value and update handling in the consuming Foldkit program.
- Preserve native textarea attributes, disabled state, invalid state, sizing,
  placeholder behavior, and accessibility attributes.
- Keep styling local and route class merging through `cn`.

## Testing

- Add Scene coverage for rendered attributes, disabled/read-only behavior,
  invalid styling hooks, and multiline content.
- Add parity fixtures for all dependency-complete shadcn examples.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep shadcn/textarea`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`

## STOP Conditions

- Stop if the source row now depends on an unimplemented runtime primitive.
- Stop if any installable source would need React or CVA.
