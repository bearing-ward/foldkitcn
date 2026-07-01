# 084 - Implement shadcn Attachment

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat e5534d56..HEAD -- plans/artifacts/070-next-component-selection/selection.md plans/artifacts/070-next-component-dossiers/shadcn-attachment registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/033-implement-base-ui-and-shadcn-dialog.md, plans/073-implement-shadcn-spinner.md
- **Category**: direction
- **Planned at**: commit `e5534d56`, 2026-06-28

## Summary

Implement `shadcn/attachment` as a local styled attachment composition with
actions, trigger examples, a Foldkit-native FileDrop-backed attachment
workflow, spinner/dialog integration, docs artifacts, and origin parity.

## Source Evidence

- Selection row: `plans/artifacts/070-next-component-selection/selection.md`
- Dossier: `plans/artifacts/070-next-component-dossiers/shadcn-attachment/dossier.json`
- Preview: `plans/artifacts/070-next-component-dossiers/shadcn-attachment/plan-preview.md`
- Origin docs: `https://ui.shadcn.com/docs/components/attachment`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/attachment.tsx`
- Origin examples: `repos/ui/apps/v4/examples/base/attachment-*.tsx`
- Origin slots include attachment root, media, content, title, description,
  actions, action, trigger, and group.

## Scope

- Add `registry-src/shadcn/attachment/item.json`.
- Add `src/registry/shadcn/attachment/index.ts`, `examples.ts`, and tests.
- Add a FileDrop-backed attachment workflow helper that composes
  `@foldkit/ui` in parent-owned/Submodel style.
- Add `shadcn/attachment` parity fixture coverage.
- Update generated registry/docs/progress artifacts.

## Implementation Notes

- Replace CVA and `@base-ui-components/react/use-render`/merge-props helpers
  with Effect Schema variants and local Foldkit part-renderer composition.
- Compose local `shadcn/button`, `shadcn/dialog`, `shadcn/spinner`,
  `@foldkit/ui` FileDrop, and `utils/cn`.
- Preserve attachment variants, media/action layout, group spacing, trigger
  behavior, progress/loading examples, dialog examples, and the FileDrop
  workflow example.
- Keep the origin parity fixture blocked if it still fails on the vendored
  Base UI `@floating-ui/react-dom` gap.

## Testing

- Add tests for all exported parts, variant class maps, slot attributes,
  actions, trigger rendering, class canonicalization, FileDrop workflow
  delegation, and example structure.
- Replicate all origin attachment examples and add parity cases.
- Run:
  - `bun run registry:build`
  - `bun run origin:components:write`
  - `bun run registry:check`
  - `bun run origin:components:check`
  - `bun run parity:check -- --grep attachment --dry-run`
  - `bun run parity:check -- --grep attachment`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if source parity requires browser file APIs, upload side effects, or
  dialog behavior that is not already available locally.
- Stop if the implementation requires React, CVA, Base UI React helpers, or
  origin repo paths in installable source.
