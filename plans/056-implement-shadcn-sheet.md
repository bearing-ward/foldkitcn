# 056 - Implement shadcn Sheet

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat 96baac1d..HEAD -- plans/artifacts/040-next-component-selection/selection.md plans/artifacts/040-next-component-dossiers/sheet registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/033-implement-dialog.md
- **Category**: direction
- **Planned at**: commit `96baac1d`, 2026-06-26

## Summary

Implement `shadcn/sheet` as a local styled composition over the existing
Foldkit-native Dialog foundation. This row is shadcn-only; do not create a Base
UI Sheet item unless new origin evidence requires it.

## Source Evidence

- Selection row: `plans/artifacts/040-next-component-selection/selection.md`
- Dossier: `plans/artifacts/040-next-component-dossiers/sheet/dossier.json`
- Preview: `plans/artifacts/040-next-component-dossiers/sheet/plan-preview.md`
- Origin docs: `https://ui.shadcn.com/docs/components/sheet`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/sheet.tsx`

## Scope

- Add `registry-src/shadcn/sheet/item.json`.
- Add `src/registry/shadcn/sheet/index.ts`, `examples.ts`, and tests.
- Add parity fixture coverage for `shadcn/sheet`.
- Preserve root, trigger, close, portal, overlay, content, header, footer, title,
  description, side variants, data attributes, ARIA, and example structure.

## Implementation Notes

- Compose local `shadcn/dialog` or `base-ui/dialog` conventions instead of
  importing Radix/Dialog React runtime.
- Keep side/style variants local to the component folder and derive variant
  types from Effect Schema.
- Use `utils/cn` for class canonicalization.

## Testing

- Replicate all shadcn Sheet examples and style variants from the dossier.
- Add tests for side variants, open/closed data attributes, focus behavior,
  dismiss behavior, and Dialog composition.
- Add parity for dimensions, structure, side placement, and styling.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep sheet --dry-run`
  - `bun run parity:check -- --grep sheet`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if Dialog is not landed or Sheet would need to fork Dialog's portal,
  focus, or dismiss behavior.
- Stop if shadcn Sheet now depends on Drawer-specific behavior that should be
  composed from plan 055 instead.
