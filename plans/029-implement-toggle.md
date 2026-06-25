# 029 - Implement Base UI and shadcn Toggle

## Summary

Implement Base UI Toggle and shadcn Toggle together. Toggle should reuse the
local button conventions while preserving pressed state and data attributes.

## Source Evidence

- Selection row: `plans/artifacts/020-next-component-selection/selection.md`
- Dossier: `plans/artifacts/004-foundational-component-dossiers/toggle/dossier.json`
- Preview: `plans/artifacts/004-foundational-component-dossiers/toggle/plan-preview.md`
- Origin docs:
  - `https://base-ui.com/react/components/toggle`
  - `https://ui.shadcn.com/docs/components/toggle`

## Scope

- Add `registry-src/base-ui/toggle/item.json`.
- Add `registry-src/shadcn/toggle/item.json`.
- Add `src/registry/base-ui/toggle/index.ts`.
- Add `src/registry/shadcn/toggle/index.ts`.
- Preserve pressed/unpressed state, disabled behavior, ARIA pressed, keyboard
  activation, and data attributes.
- Add parity slots for `base-ui/toggle` and `shadcn/toggle`.

## Implementation Notes

- Pressed state belongs in the consuming Foldkit model.
- Compose button-like rendering from local Foldkit helpers, not React Slot or
  upstream Base UI runtime packages.
- Replace CVA-style variants with Effect Schema literals and pure class maps.
- Use `toView` or named part renderers for React `asChild`-style flexibility.

## Testing

- Port origin behavior tests for pressed state and disabled interaction.
- Add shadcn variant and size class coverage.
- Add parity for Base UI demos and shadcn examples.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep toggle`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`

## STOP Conditions

- Stop if Toggle cannot reuse the existing Button conventions without breaking
  Button parity.
