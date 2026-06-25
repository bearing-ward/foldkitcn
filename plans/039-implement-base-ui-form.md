# 039 - Implement Base UI Form

## Summary

Implement the Foldkit-native Base UI Form primitive. This should be the final
form-foundation item from this selection because it should compose local Field
semantics rather than inventing a competing validation and submission model.

## Source Evidence

- Selection row: `plans/artifacts/020-next-component-selection/selection.md`
- Dossier: `plans/artifacts/007-remaining-component-dossiers/base-ui-form/dossier.json`
- Preview: `plans/artifacts/007-remaining-component-dossiers/base-ui-form/plan-preview.md`
- Origin docs: `https://base-ui.com/react/components/form`

## Scope

- Add `registry-src/base-ui/form/item.json`.
- Add `src/registry/base-ui/form/index.ts`.
- Port form root, submit/reset handling, validation reporting hooks that are
  framework-independent, disabled/invalid state relationships, and data
  attributes from origin evidence.
- Add a parity slot for `base-ui/form`.

## Implementation Notes

- Submission state, validation results, and effects belong in the consuming
  Foldkit program update/command flow.
- The registry item should expose view helpers and typed event payloads, not
  hidden imperative submission logic.
- Use Effect Schema for submit payload metadata and validation state helpers.
- Reuse local Field semantics from plan 038 wherever origin Form composes Field.

## Testing

- Port Base UI form tests semantically for submit, reset, validation state,
  disabled behavior, and event payload shape.
- Add origin parity fixtures for demos, including field/error structure.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep form`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`

## STOP Conditions

- Stop if plan 038 is not landed.
- Stop if origin Form requires imperative validation APIs that conflict with the
  Foldkit update/command architecture.
