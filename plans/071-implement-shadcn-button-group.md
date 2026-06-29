# 071 - Implement shadcn Button Group

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat e5534d56..HEAD -- plans/artifacts/070-next-component-selection/selection.md plans/artifacts/070-next-component-dossiers/shadcn-button-group registry-src src/registry tests/parity`
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

Implement `shadcn/button-group` as a local styled grouping helper for buttons,
inputs, selects, dropdowns, popovers, separators, and text affordances.

## Source Evidence

- Selection row: `plans/artifacts/070-next-component-selection/selection.md`
- Dossier: `plans/artifacts/070-next-component-dossiers/shadcn-button-group/dossier.json`
- Preview: `plans/artifacts/070-next-component-dossiers/shadcn-button-group/plan-preview.md`
- Origin docs: `https://ui.shadcn.com/docs/components/button-group`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/button-group.tsx`
- Origin examples: `repos/ui/apps/v4/examples/base/button-group-*.tsx`
- Origin slots include `button-group`, `button-group-text`, and
  `button-group-separator`.

## Scope

- Add `registry-src/shadcn/button-group/item.json`.
- Add `src/registry/shadcn/button-group/index.ts`, `examples.ts`, and tests.
- Add `shadcn/button-group` parity fixture coverage.
- Update generated registry/docs/progress artifacts.

## Implementation Notes

- Replace CVA with an Effect Schema-backed `orientation` option and pure class
  helper.
- Compose local `shadcn/button`, `shadcn/dropdown-menu`, `shadcn/field`,
  `shadcn/input`, `shadcn/popover`, `shadcn/select`, `shadcn/separator`,
  `shadcn/textarea`, `shadcn/tooltip`, and `utils/cn`.
- `shadcn/input-group` is not local yet. Preserve the core component and all
  examples that do not need `input-group`; defer only `button-group-input-group`
  and `button-group-nested` if implementing them would require upstream imports.
- Replace origin icon packages and language selector runtime with local fixture
  shims or local constants.

## Testing

- Add tests for orientation class composition, separator semantics, text slot
  attributes, and examples.
- Add parity cases for all implemented origin examples.
- If input-group examples are deferred, record an accepted deviation in
  `item.json` and document that plan 072 will unlock them.
- Run:
  - `bun run registry:build`
  - `bun run origin:components:write`
  - `bun run registry:check`
  - `bun run origin:components:check`
  - `bun run parity:check -- --grep button-group --dry-run`
  - `bun run parity:check -- --grep button-group`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if Button Group source cannot be kept independent of `shadcn/input-group`
  without losing the core installable item.
- Stop if any installable source would import React, CVA, icon packages,
  upstream shadcn aliases, or `repos/*` paths.
