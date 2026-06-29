# 074 - Implement shadcn Empty

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat e5534d56..HEAD -- plans/artifacts/070-next-component-selection/selection.md plans/artifacts/070-next-component-dossiers/shadcn-empty registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/070-implement-shadcn-item.md, plans/072-implement-shadcn-input-group.md, plans/073-implement-shadcn-spinner.md
- **Category**: direction
- **Planned at**: commit `e5534d56`, 2026-06-28

## Summary

Implement `shadcn/empty` as a local styled empty-state composition with media,
header, title, description, content, avatar/button/input-group/kbd/spinner
examples, and origin parity.

## Source Evidence

- Selection row: `plans/artifacts/070-next-component-selection/selection.md`
- Dossier: `plans/artifacts/070-next-component-dossiers/shadcn-empty/dossier.json`
- Preview: `plans/artifacts/070-next-component-dossiers/shadcn-empty/plan-preview.md`
- Origin docs: `https://ui.shadcn.com/docs/components/empty`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/empty.tsx`
- Origin examples: `repos/ui/apps/v4/examples/base/empty-*.tsx`
- Origin slots include `empty`, `empty-header`, `empty-icon`, `empty-title`,
  `empty-description`, and `empty-content`.

## Scope

- Add `registry-src/shadcn/empty/item.json`.
- Add `src/registry/shadcn/empty/index.ts`, `examples.ts`, and tests.
- Add `shadcn/empty` parity fixture coverage.
- Update generated registry/docs/progress artifacts.
- Fill any temporary `spinner-empty` or input-group/empty deviations left by
  plans 072 and 073 if those plans deferred examples awaiting Empty.

## Implementation Notes

- Replace CVA with Effect Schema literals for media variants and any display
  variants.
- Compose local `shadcn/avatar`, `shadcn/button`, `shadcn/input-group`,
  `shadcn/item`, `shadcn/kbd`, `shadcn/spinner`, and `utils/cn`.
- Replace `@tabler/icons-react`, `lucide-react`, and language selector runtime
  with local inline icons and deterministic RTL constants.
- Keep Empty structural helpers stateless unless an origin example clearly owns
  local Foldkit state.

## Testing

- Add tests for every exported helper, media variants, class canonicalization,
  slot attributes, and example structure.
- Add parity cases for all origin examples including avatar, background, card,
  input-group, outline, demo, and RTL variants.
- Run:
  - `bun run registry:build`
  - `bun run origin:components:write`
  - `bun run registry:check`
  - `bun run origin:components:check`
  - `bun run parity:check -- --grep empty --dry-run`
  - `bun run parity:check -- --grep empty`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if Empty examples require an unimplemented local registry dependency not
  listed in this plan's dependencies.
- Stop if parity requires importing Tabler, Lucide, React, CVA, or origin repo
  paths into installable source.
