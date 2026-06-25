# 033 - Implement Base UI and shadcn Dialog

## Summary

Implement Base UI Dialog and shadcn Dialog together. This is a high-risk
interaction plan because focus management, modal semantics, portal behavior,
outside interaction, escape handling, and scroll locking must match origin
behavior as closely as Foldkit allows.

## Source Evidence

- Selection row: `plans/artifacts/020-next-component-selection/selection.md`
- Dossier: `plans/artifacts/004-foundational-component-dossiers/dialog/dossier.json`
- Preview: `plans/artifacts/004-foundational-component-dossiers/dialog/plan-preview.md`
- Origin docs:
  - `https://base-ui.com/react/components/dialog`
  - `https://ui.shadcn.com/docs/components/dialog`

## Scope

- Add `registry-src/base-ui/dialog/item.json`.
- Add `registry-src/shadcn/dialog/item.json`.
- Add `src/registry/base-ui/dialog/index.ts`.
- Add `src/registry/shadcn/dialog/index.ts`.
- Port root, trigger, portal, backdrop/overlay, popup/content, title,
  description, close, open state, modal/non-modal behavior, data attributes, and
  shadcn base-nova styles.
- Add parity slots for `base-ui/dialog` and `shadcn/dialog`.

## Implementation Notes

- Open state belongs in the consuming Foldkit model.
- Use Foldkit commands and the `Dom` module for focus, scroll lock, and modal DOM
  operations where side effects are required.
- Keep messages as facts: examples should emit clicked/opened/closed/completed
  messages, not imperative handlers.
- If a reusable overlay/focus foundation is needed, keep it local to this plan
  unless Popover or future overlays clearly require a shared module.

## Testing

- Port Base UI dialog tests semantically for open/close, focus trap, initial
  focus, restore focus, escape close, outside interaction, modal attributes,
  scroll lock, and ARIA title/description relationships.
- Add parity fixtures for Base UI demos and shadcn examples.
- Include browser smoke for focus flow and overlay layering if parity coverage
  cannot fully exercise it.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep dialog`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`

## STOP Conditions

- Stop if focus trap or portal behavior needs framework support outside the
  registry item.
- Stop if implementation would hide side effects inside render helpers.
