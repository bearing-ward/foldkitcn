# 022 - Implement Base UI and shadcn Input

## Summary

Implement the Foldkit-native Base UI Input primitive and shadcn Input wrapper.
This is a foundational form-control plan and should land before Field,
Number Field, and Form work consumes local input behavior.

## Source Evidence

- Selection row: `plans/artifacts/020-next-component-selection/selection.md`
- Dossier: `plans/artifacts/004-foundational-component-dossiers/input/dossier.json`
- Preview: `plans/artifacts/004-foundational-component-dossiers/input/plan-preview.md`
- Origin docs:
  - `https://base-ui.com/react/components/input`
  - `https://ui.shadcn.com/docs/components/input`

## Scope

- Add `registry-src/base-ui/input/item.json`.
- Add `registry-src/shadcn/input/item.json`.
- Add `src/registry/base-ui/input/index.ts`.
- Add `src/registry/shadcn/input/index.ts`.
- Preserve value, disabled, invalid, required, read-only, placeholder, name,
  id, type, and data attribute behavior from origin evidence.
- Add parity slots for `base-ui/input` and `shadcn/input`.

## Implementation Notes

- Keep installable source stateless and Foldkit-native: input state belongs in
  the consuming program model and messages, not hidden component state.
- Expose Effect Schema-driven props and helpers for view attributes.
- Compose shadcn Input from local Base UI Input plus local class maps and `cn`.
- Do not import React, CVA, or upstream Base UI runtime packages.
- Preserve Base UI accessibility and form attribute semantics exactly where
  they are framework-independent.

## Testing

- Port origin tests for attributes, disabled/read-only behavior, invalid state,
  focusability, and event payload shape as Foldkit Scene/Story tests.
- Add parity fixtures for Base UI and shadcn demos, including class and
  dimension checks.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep input`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`

## STOP Conditions

- Stop if the component needs uncontrolled internal mutable state.
- Stop if parity reveals a framework-level difference that needs an ADR or
  shared form-control policy before continuing.
