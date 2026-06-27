# 049 - Implement Base UI Toolbar

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat 96baac1d..HEAD -- plans/artifacts/040-next-component-selection/selection.md plans/artifacts/040-next-component-dossiers/toolbar registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/022-implement-input.md, plans/029-implement-toggle.md, plans/030-implement-toggle-group.md
- **Category**: direction
- **Planned at**: commit `96baac1d`, 2026-06-26

## Summary

Implement `base-ui/toolbar` as an unstyled Foldkit primitive for toolbar root,
groups, buttons, links, inputs, and keyboard navigation.

## Source Evidence

- Selection row: `plans/artifacts/040-next-component-selection/selection.md`
- Dossier: `plans/artifacts/040-next-component-dossiers/toolbar/dossier.json`
- Preview: `plans/artifacts/040-next-component-dossiers/toolbar/plan-preview.md`
- Origin docs: `https://base-ui.com/react/components/toolbar`
- Key origin source: `repos/base-ui/packages/react/src/toolbar/**`

## Scope

- Add `registry-src/base-ui/toolbar/item.json`.
- Add `src/registry/base-ui/toolbar/index.ts` and colocated tests.
- Add parity fixture coverage for `base-ui/toolbar`.
- Preserve root, group, button, link, input, orientation, roving focus,
  activation behavior, disabled state, data attributes, and ARIA.

## Implementation Notes

- Reuse existing local Button, Toggle, Toggle Group, and Input conventions when
  exposing toolbar parts.
- Toolbar state should be explicit model state where the app owns it; toolbar
  helpers should not smuggle mutable focus state through closures.
- Do not add a shadcn wrapper in this plan; the selected row is Base UI only.

## Testing

- Port Toolbar button/group/input/link/root tests semantically.
- Add Scene coverage for keyboard navigation, orientation, disabled controls,
  link/button/input rendering, and data attributes.
- Add parity for origin demos.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep toolbar --dry-run`
  - `bun run parity:check -- --grep toolbar`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if Toolbar requires a shared roving-focus abstraction that should be
  extracted for Menu, Menubar, Navigation Menu, Select, and Combobox first.
