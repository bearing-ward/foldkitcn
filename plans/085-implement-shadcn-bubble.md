# 085 - Implement shadcn Bubble

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat e5534d56..HEAD -- plans/artifacts/070-next-component-selection/selection.md plans/artifacts/070-next-component-dossiers/shadcn-bubble registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/028-implement-base-ui-and-shadcn-collapsible.md, plans/034-implement-base-ui-and-shadcn-popover.md, plans/040-implement-tooltip.md, plans/082-implement-shadcn-sonner.md
- **Category**: direction
- **Planned at**: commit `e5534d56`, 2026-06-28

## Summary

Implement `shadcn/bubble` as a styled chat bubble composition with grouping,
content, reactions, examples, docs artifacts, and origin parity.

## Source Evidence

- Selection row: `plans/artifacts/070-next-component-selection/selection.md`
- Dossier: `plans/artifacts/070-next-component-dossiers/shadcn-bubble/dossier.json`
- Preview: `plans/artifacts/070-next-component-dossiers/shadcn-bubble/plan-preview.md`
- Origin docs: `https://ui.shadcn.com/docs/components/bubble`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/bubble.tsx`
- Origin examples: `repos/ui/apps/v4/examples/base/bubble-*.tsx`
- Origin slots include bubble group, bubble, bubble content, and bubble
  reactions.

## Scope

- Add `registry-src/shadcn/bubble/item.json`.
- Add `src/registry/shadcn/bubble/index.ts`, `examples.ts`, and tests.
- Add `shadcn/bubble` parity fixture coverage.
- Update generated registry/docs/progress artifacts.

## Implementation Notes

- Represent side, alignment, grouping, and reaction variants with Effect Schema
  literals and pure class maps.
- Compose local `shadcn/button`, `shadcn/collapsible`, `shadcn/popover`,
  `shadcn/sonner`, `shadcn/tooltip`, and `utils/cn`.
- Treat markdown rendering as fixture-only static markup unless a local
  markdown foundation already exists. Do not add a markdown runtime here.
- Preserve origin grouped-message spacing, incoming/outgoing variants,
  reaction affordances, and copied/sonner examples where local dependencies
  allow.

## Testing

- Add tests for exported parts, variants, grouping, reactions, slot attributes,
  custom class canonicalization, and example structure.
- Replicate all origin bubble examples that can be supported without a new
  markdown foundation and add origin/Foldkit parity cases.
- Run:
  - `bun run registry:build`
  - `bun run origin:components:write`
  - `bun run registry:check`
  - `bun run origin:components:check`
  - `bun run parity:check -- --grep bubble --dry-run`
  - `bun run parity:check -- --grep bubble`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if a required example depends on a markdown renderer, AI runtime, or
  upstream notification package that is not available locally.
- Stop if the implementation requires React, CVA, or origin repo paths in
  installable source.
