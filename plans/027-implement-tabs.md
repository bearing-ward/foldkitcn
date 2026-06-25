# 027 - Implement Base UI and shadcn Tabs

## Summary

Implement Base UI Tabs and shadcn Tabs together. Tabs is a behavior primitive
that needs strong parity around activation mode, orientation, disabled triggers,
keyboard navigation, and panel visibility.

## Source Evidence

- Selection row: `plans/artifacts/020-next-component-selection/selection.md`
- Dossier: `plans/artifacts/004-foundational-component-dossiers/tabs/dossier.json`
- Preview: `plans/artifacts/004-foundational-component-dossiers/tabs/plan-preview.md`
- Origin docs:
  - `https://base-ui.com/react/components/tabs`
  - `https://ui.shadcn.com/docs/components/tabs`

## Scope

- Add `registry-src/base-ui/tabs/item.json`.
- Add `registry-src/shadcn/tabs/item.json`.
- Add `src/registry/base-ui/tabs/index.ts`.
- Add `src/registry/shadcn/tabs/index.ts`.
- Port root, list, tab, panel, indicator where applicable, data attributes,
  orientation, activation mode, and disabled behavior.
- Add parity slots for `base-ui/tabs` and `shadcn/tabs`.

## Implementation Notes

- Selected tab value belongs in the Foldkit model.
- Expose part renderers for root, list, trigger, content/panel, and any
  indicator geometry required by origin parity.
- Use keyed view branches where active panel structure changes.
- Preserve WAI-ARIA tablist roles and keyboard behavior from the origin tests.

## Testing

- Port Base UI tabs tests semantically for selection, keyboard navigation,
  manual/automatic activation, orientation, disabled tabs, and ARIA attributes.
- Add parity for Base UI demos and shadcn examples.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep tabs`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`

## STOP Conditions

- Stop if tab focus management requires a reusable roving-focus module shared
  with Radio Group or Toolbar.
- Stop if panel mounting policy differs from origin and needs an ADR.
