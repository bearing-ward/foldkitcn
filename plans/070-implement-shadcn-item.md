# 070 - Implement shadcn Item

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat e5534d56..HEAD -- plans/artifacts/070-next-component-selection/selection.md plans/artifacts/070-next-component-dossiers/shadcn-item registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/019-add-origin-component-progress-tracker.md
- **Category**: direction
- **Planned at**: commit `e5534d56`, 2026-06-28

## Summary

Implement `shadcn/item` as a Foldkit-native styled structural component with
local class maps, examples, docs artifacts, and shadcn origin parity.

## Source Evidence

- Selection row: `plans/artifacts/070-next-component-selection/selection.md`
- Dossier: `plans/artifacts/070-next-component-dossiers/shadcn-item/dossier.json`
- Preview: `plans/artifacts/070-next-component-dossiers/shadcn-item/plan-preview.md`
- Origin docs: `https://ui.shadcn.com/docs/components/item`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/item.tsx`
- Origin examples: `repos/ui/apps/v4/examples/base/item-*.tsx`
- Origin slots include `item-group`, `item-separator`, `item`, `item-media`,
  `item-content`, `item-title`, `item-description`, `item-actions`,
  `item-header`, and `item-footer`.

## Scope

- Add `registry-src/shadcn/item/item.json`.
- Add `src/registry/shadcn/item/index.ts`, `examples.ts`, and tests.
- Add `shadcn/item` parity fixture coverage.
- Update generated registry/docs/progress artifacts.

## Implementation Notes

- Replace CVA with Effect Schema literals and pure local class maps for item
  variant, size, layout, and media variant metadata.
- Preserve origin `render` support through Foldkit `toView` or named
  part-renderer composition; do not expose React-style `asChild`.
- Replace `lucide-react` and `next/image` examples with local inline SVG and
  plain image shims that preserve DOM footprint and class/attribute parity.
- Use local `shadcn/avatar`, `shadcn/button`, `shadcn/dropdown-menu`,
  `shadcn/separator`, and `utils/cn`.
- Keep all style strings local to `src/registry/shadcn/item`.

## Testing

- Add tests for schema variants, every exported class helper, slot attributes,
  custom class canonicalization, and example structure.
- Replicate every origin `item-*` example, including avatar, dropdown, group,
  header, icon, image, link, RTL, size, and variant examples.
- Add origin and Foldkit parity cases for each replicated example.
- Run:
  - `bun run registry:build`
  - `bun run origin:components:write`
  - `bun run registry:check`
  - `bun run origin:components:check`
  - `bun run parity:check -- --grep item --dry-run`
  - `bun run parity:check -- --grep item`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if implementing `Item` requires importing `react`, `next/image`,
  `lucide-react`, `class-variance-authority`, `@base-ui/react/*`, or origin
  `repos/*` paths into installable source.
- Stop if a required origin example depends on a registry item that is not local
  and cannot be represented as fixture-only evidence.
