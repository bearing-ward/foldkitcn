# 026 - Implement Base UI and shadcn Radio Group

## Summary

Implement Base UI Radio Group and shadcn Radio Group together. This plan should
preserve group-level value semantics, item-level checked state, keyboard roving,
disabled handling, and form submission behavior.

## Source Evidence

- Selection row: `plans/artifacts/020-next-component-selection/selection.md`
- Dossier: `plans/artifacts/004-foundational-component-dossiers/radio-group/dossier.json`
- Preview: `plans/artifacts/004-foundational-component-dossiers/radio-group/plan-preview.md`
- Origin docs:
  - `https://base-ui.com/react/components/radio-group`
  - `https://ui.shadcn.com/docs/components/radio-group`

## Scope

- Add `registry-src/base-ui/radio-group/item.json`.
- Add `registry-src/shadcn/radio-group/item.json`.
- Add `src/registry/base-ui/radio-group/index.ts`.
- Add `src/registry/shadcn/radio-group/index.ts`.
- Port group, item, indicator, hidden input/form semantics, orientation, loop,
  disabled, required, and data attributes.
- Add parity slots for `base-ui/radio-group` and `shadcn/radio-group`.

## Implementation Notes

- Value is owned by the consuming Foldkit model; the component exposes render
  helpers and message payloads for examples.
- Preserve arrow-key movement and selection semantics from Base UI tests.
- Use Effect Schema for orientation, value, disabled, and item descriptors.
- Use local styling, `cn`, and local indicator rendering; no React or upstream
  Base UI runtime packages.

## Testing

- Port Base UI radio group tests semantically, especially keyboard navigation
  and disabled item behavior.
- Add Scene coverage for form value and ARIA checked state.
- Add parity fixtures for Base UI and shadcn examples.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep radio-group`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`

## STOP Conditions

- Stop if roving focus needs a shared focus-management helper that does not yet
  exist.
- Stop if shadcn examples require unimplemented installable dependencies.
