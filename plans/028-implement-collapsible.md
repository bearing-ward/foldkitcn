# 028 - Implement Base UI and shadcn Collapsible

## Summary

Implement Base UI Collapsible and shadcn Collapsible together. This is the local
foundation that Accordion can build on later.

## Source Evidence

- Selection row: `plans/artifacts/020-next-component-selection/selection.md`
- Dossier: `plans/artifacts/004-foundational-component-dossiers/collapsible/dossier.json`
- Preview: `plans/artifacts/004-foundational-component-dossiers/collapsible/plan-preview.md`
- Origin docs:
  - `https://base-ui.com/react/components/collapsible`
  - `https://ui.shadcn.com/docs/components/collapsible`

## Scope

- Add `registry-src/base-ui/collapsible/item.json`.
- Add `registry-src/shadcn/collapsible/item.json`.
- Add `src/registry/base-ui/collapsible/index.ts`.
- Add `src/registry/shadcn/collapsible/index.ts`.
- Port root, trigger, panel/content, open/closed data attributes, disabled
  trigger behavior, and mounting policy.
- Add parity slots for `base-ui/collapsible` and `shadcn/collapsible`.

## Implementation Notes

- Open state belongs in the consuming Foldkit model.
- Preserve origin attributes and ARIA expanded/controls relationships.
- Use keyed branches when mounted/unmounted content changes shape.
- Keep styling local and use `cn` for shadcn wrapper classes.

## Testing

- Port Base UI collapsible tests semantically.
- Cover trigger activation, disabled trigger behavior, ARIA state, and
  conditional content rendering.
- Add parity for Base UI demos and shadcn examples.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep collapsible`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`

## STOP Conditions

- Stop if origin requires animation measurement that needs a shared transition
  policy before implementation.
