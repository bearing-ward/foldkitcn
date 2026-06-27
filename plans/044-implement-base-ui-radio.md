# 044 - Implement Base UI Radio

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat 96baac1d..HEAD -- plans/artifacts/040-next-component-selection/selection.md plans/artifacts/040-next-component-dossiers/radio registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/026-implement-radio-group.md
- **Category**: direction
- **Planned at**: commit `96baac1d`, 2026-06-26

## Summary

Implement `base-ui/radio` as the standalone local radio primitive aligned with
the already-landed radio group conventions.

## Source Evidence

- Selection row: `plans/artifacts/040-next-component-selection/selection.md`
- Dossier: `plans/artifacts/040-next-component-dossiers/radio/dossier.json`
- Preview: `plans/artifacts/040-next-component-dossiers/radio/plan-preview.md`
- Origin docs: `https://base-ui.com/react/components/radio`
- Key origin source: `repos/base-ui/packages/react/src/radio/**`

## Scope

- Add `registry-src/base-ui/radio/item.json`.
- Add `src/registry/base-ui/radio/index.ts` and colocated tests.
- Add parity fixture coverage for `base-ui/radio`.
- Preserve root, indicator, checked/unchecked, disabled/read-only if present,
  data attributes, form attributes, and ARIA behavior.

## Implementation Notes

- Reuse the state naming and data attributes established by
  `base-ui/radio-group`.
- Keep individual radio state controlled by Foldkit model data.
- Do not create a shadcn wrapper in this plan; the selected row is Base UI only.

## Testing

- Port `RadioRoot.test.tsx`, `RadioIndicator.test.tsx`, and parity-covered spec
  expectations semantically.
- Add Scene coverage for checked state, disabled state, indicator rendering,
  keyboard/pointer activation, and data attributes.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep radio --dry-run`
  - `bun run parity:check -- --grep radio`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if implementing standalone Radio requires changing the public API of the
  landed Radio Group item.
