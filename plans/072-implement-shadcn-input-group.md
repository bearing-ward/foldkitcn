# 072 - Implement shadcn Input Group

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat e5534d56..HEAD -- plans/artifacts/070-next-component-selection/selection.md plans/artifacts/070-next-component-dossiers/shadcn-input-group registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED
- **Depends on**: plans/071-implement-shadcn-button-group.md
- **Category**: direction
- **Planned at**: commit `e5534d56`, 2026-06-28

## Summary

Implement `shadcn/input-group` as a local styled composition for grouped inputs,
addons, inline/block adornments, grouped buttons, text, and textarea controls.

## Source Evidence

- Selection row: `plans/artifacts/070-next-component-selection/selection.md`
- Dossier: `plans/artifacts/070-next-component-dossiers/shadcn-input-group/dossier.json`
- Preview: `plans/artifacts/070-next-component-dossiers/shadcn-input-group/plan-preview.md`
- Origin docs: `https://ui.shadcn.com/docs/components/input-group`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/input-group.tsx`
- Origin examples: `repos/ui/apps/v4/examples/base/input-group-*.tsx`
- Origin slots include `input-group`, `input-group-addon`,
  `input-group-control`, buttons, text, and textarea controls.

## Scope

- Add `registry-src/shadcn/input-group/item.json`.
- Add `src/registry/shadcn/input-group/index.ts`, `examples.ts`, and tests.
- Add `shadcn/input-group` parity fixture coverage.
- Update generated registry/docs/progress artifacts.
- If plan 071 deferred Button Group examples because Input Group was missing,
  update those `shadcn/button-group` examples and parity cases in the same
  narrow pass.

## Implementation Notes

- Replace CVA with Effect Schema literals for addon alignment and button size.
- Compose local `shadcn/button`, `shadcn/button-group`, `shadcn/card`,
  `shadcn/dropdown-menu`, `shadcn/field`, `shadcn/input`, `shadcn/kbd`,
  `shadcn/label`, `shadcn/popover`, `shadcn/textarea`, `shadcn/tooltip`, and
  `utils/cn`.
- `shadcn/spinner` is not local yet. Defer only spinner-specific examples
  (`input-group-spinner`, RTL spinner affordances, and similar) if needed; plan
  073 will unlock them.
- Replace `react-textarea-autosize` with Foldkit/native textarea sizing policy
  or a static example shape; do not import the package.
- Replace copy-to-clipboard hooks and `sonner` calls with Foldkit messages,
  commands, or fixture-only deterministic examples.

## Testing

- Add tests for addon alignment, button size, control slots, input/textarea
  composition, invalid/disabled attributes, and class canonicalization.
- Add parity cases for every implemented origin example.
- Add or update deferred-example deviations explicitly in manifests when a
  dependency is intentionally left for plan 073.
- Run:
  - `bun run registry:build`
  - `bun run origin:components:write`
  - `bun run registry:check`
  - `bun run origin:components:check`
  - `bun run parity:check -- --grep input-group --dry-run`
  - `bun run parity:check -- --grep input-group`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if real autosizing behavior is required for parity and cannot be modeled
  with local Foldkit state or a static fixture-safe example.
- Stop if implementing copy/toast example behavior requires upstream `sonner`
  runtime before base-ui toast or shadcn sonner are local.
