# 034 - Implement Base UI and shadcn Popover

## Summary

Implement Base UI Popover and shadcn Popover together. Popover should reuse any
overlay, portal, dismiss, or focus conventions established by Dialog while
adding anchored positioning behavior.

## Source Evidence

- Selection row: `plans/artifacts/020-next-component-selection/selection.md`
- Dossier: `plans/artifacts/004-foundational-component-dossiers/popover/dossier.json`
- Preview: `plans/artifacts/004-foundational-component-dossiers/popover/plan-preview.md`
- Origin docs:
  - `https://base-ui.com/react/components/popover`
  - `https://ui.shadcn.com/docs/components/popover`

## Scope

- Add `registry-src/base-ui/popover/item.json`.
- Add `registry-src/shadcn/popover/item.json`.
- Add `src/registry/base-ui/popover/index.ts`.
- Add `src/registry/shadcn/popover/index.ts`.
- Port root, trigger, portal, positioner, popup/content, arrow if present,
  open/closed state, placement, collision behavior that can be represented, and
  data attributes.
- Add parity slots for `base-ui/popover` and `shadcn/popover`.

## Implementation Notes

- Open state belongs in the consuming Foldkit model.
- Use Dialog's settled conventions for escape/outside dismiss and focus restore.
- Treat positioning as deterministic view data where possible; isolate DOM
  measurement behind commands if needed.
- Keep shadcn styles local and do not depend on upstream floating/React runtime
  packages in installable source.

## Testing

- Port Base UI popover tests semantically for trigger behavior, dismiss rules,
  focus restore, placement attributes, and ARIA relationships.
- Add parity for Base UI demos and shadcn examples, including dimension and
  position tolerance where needed.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep popover`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`

## STOP Conditions

- Stop if plan 033 is not landed and Popover would duplicate overlay/focus
  behavior.
- Stop if anchored positioning requires a shared measurement service before it
  can be tested deterministically.
