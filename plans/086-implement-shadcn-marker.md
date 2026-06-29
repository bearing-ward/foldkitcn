# 086 - Implement shadcn Marker

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat e5534d56..HEAD -- plans/artifacts/070-next-component-selection/selection.md plans/artifacts/070-next-component-dossiers/shadcn-marker registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/073-implement-shadcn-spinner.md, plans/082-implement-shadcn-sonner.md
- **Category**: direction
- **Planned at**: commit `e5534d56`, 2026-06-28

## Summary

Implement `shadcn/marker` as a local styled status marker composition with
spinner/notification examples, docs artifacts, and origin parity.

## Source Evidence

- Selection row: `plans/artifacts/070-next-component-selection/selection.md`
- Dossier: `plans/artifacts/070-next-component-dossiers/shadcn-marker/dossier.json`
- Preview: `plans/artifacts/070-next-component-dossiers/shadcn-marker/plan-preview.md`
- Origin docs: `https://ui.shadcn.com/docs/components/marker`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/marker.tsx`
- Origin examples: `repos/ui/apps/v4/examples/base/marker-*.tsx`
- Origin slots include marker root, marker icon, and marker content.

## Scope

- Add `registry-src/shadcn/marker/item.json`.
- Add `src/registry/shadcn/marker/index.ts`, `examples.ts`, and tests.
- Add `shadcn/marker` parity fixture coverage.
- Update generated registry/docs/progress artifacts.

## Implementation Notes

- Represent marker tone, size, orientation, icon/content layout, and loading
  variants with Effect Schema literals and local class maps.
- Compose local `shadcn/spinner`, `shadcn/sonner`, and `utils/cn`.
- Replace `lucide-react` with local inline icons and deterministic fixture
  messages.
- Preserve origin status examples, spinner examples, notification examples, and
  slot attributes.

## Testing

- Add tests for exported parts, variants, icon/content layout, spinner
  composition, class canonicalization, and example structure.
- Replicate all origin marker examples and add origin/Foldkit parity cases.
- Run:
  - `bun run registry:build`
  - `bun run origin:components:write`
  - `bun run registry:check`
  - `bun run origin:components:check`
  - `bun run parity:check -- --grep marker --dry-run`
  - `bun run parity:check -- --grep marker`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if notification examples require nonlocal Sonner behavior or external
  runtime packages.
- Stop if source parity requires React, CVA, `lucide-react`, or origin repo
  paths in installable source.
