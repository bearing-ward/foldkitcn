# 032 - Implement Base UI and shadcn Accordion

## Summary

Implement Base UI Accordion and shadcn Accordion together. Accordion should build
on the local Collapsible behavior from plan 028 while preserving collection,
single/multiple value, disabled item, keyboard, and data-attribute semantics.

## Source Evidence

- Selection row: `plans/artifacts/020-next-component-selection/selection.md`
- Dossier: `plans/artifacts/004-foundational-component-dossiers/accordion/dossier.json`
- Preview: `plans/artifacts/004-foundational-component-dossiers/accordion/plan-preview.md`
- Origin docs:
  - `https://base-ui.com/react/components/accordion`
  - `https://ui.shadcn.com/docs/components/accordion`

## Scope

- Add `registry-src/base-ui/accordion/item.json`.
- Add `registry-src/shadcn/accordion/item.json`.
- Add `src/registry/base-ui/accordion/index.ts`.
- Add `src/registry/shadcn/accordion/index.ts`.
- Port root, item, header, trigger, panel/content, single/multiple selection,
  collapsible behavior, disabled items, orientation, and data attributes.
- Add parity slots for `base-ui/accordion` and `shadcn/accordion`.

## Implementation Notes

- Open item value state belongs in the consuming Foldkit model.
- Reuse Collapsible render conventions and data attributes where they match
  origin behavior.
- Use keyed view branches for mounted/unmounted panel content.
- Replace React `asChild` with `toView` or named part renderers.

## Testing

- Port Base UI accordion tests semantically for single/multiple selection,
  collapsible behavior, disabled items, keyboard navigation, and ARIA state.
- Add parity for Base UI demos and shadcn examples.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep accordion`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`

## STOP Conditions

- Stop if plan 028 is not landed.
- Stop if origin animation or mounting policy requires a shared transition ADR.
