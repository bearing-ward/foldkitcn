# 058 - Implement shadcn Card

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat 96baac1d..HEAD -- plans/artifacts/040-next-component-selection/selection.md plans/artifacts/040-next-component-dossiers/card registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/019-add-origin-component-progress-tracker.md
- **Category**: direction
- **Planned at**: commit `96baac1d`, 2026-06-26

## Summary

Implement `shadcn/card` as a local styled structural component with examples,
theme token coverage, and parity against the shadcn origin.

## Source Evidence

- Selection row: `plans/artifacts/040-next-component-selection/selection.md`
- Dossier: `plans/artifacts/040-next-component-dossiers/card/dossier.json`
- Preview: `plans/artifacts/040-next-component-dossiers/card/plan-preview.md`
- Origin docs: `https://ui.shadcn.com/docs/components/card`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/card.tsx`

## Scope

- Add `registry-src/shadcn/card/item.json`.
- Add `src/registry/shadcn/card/index.ts`, `examples.ts`, and tests.
- Add parity fixture coverage for `shadcn/card`.
- Preserve card root, header, title, description, action, content, footer,
  class names, local style tokens, and examples.

## Implementation Notes

- Keep style data local to `src/registry/shadcn/card`.
- Use `utils/cn` for class canonicalization and Effect Schema for any variant or
  slot metadata.
- Do not introduce a Base UI item; Card is shadcn-only in this selection.

## Testing

- Replicate shadcn Card examples from the dossier.
- Add tests for all exported parts, class composition, theme token usage, and
  example structure.
- Add parity for dimensions, DOM structure, and class canonicalization.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep card --dry-run`
  - `bun run parity:check -- --grep card`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if Card now depends on a not-yet-local shadcn component in its examples;
  either add that dependency to the same plan if small or defer the example.
