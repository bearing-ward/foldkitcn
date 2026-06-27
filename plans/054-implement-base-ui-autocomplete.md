# 054 - Implement Base UI Autocomplete

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat 96baac1d..HEAD -- plans/artifacts/040-next-component-selection/selection.md plans/artifacts/040-next-component-dossiers/autocomplete registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: HIGH
- **Depends on**: plans/053-implement-combobox.md
- **Category**: direction
- **Planned at**: commit `96baac1d`, 2026-06-26

## Summary

Implement `base-ui/autocomplete` using the local Combobox/Input/listbox
foundation while preserving the origin autocomplete-specific value and item
behavior.

## Source Evidence

- Selection row: `plans/artifacts/040-next-component-selection/selection.md`
- Dossier: `plans/artifacts/040-next-component-dossiers/autocomplete/dossier.json`
- Preview: `plans/artifacts/040-next-component-dossiers/autocomplete/plan-preview.md`
- Origin docs: `https://base-ui.com/react/components/autocomplete`
- Key origin source: `repos/base-ui/packages/react/src/autocomplete/**`

## Scope

- Add `registry-src/base-ui/autocomplete/item.json`.
- Add `src/registry/base-ui/autocomplete/index.ts` and colocated tests.
- Add parity fixture coverage for `base-ui/autocomplete`.
- Preserve root, value, item behavior, filtering/highlighting behavior, input
  relationships, popup/list structure if present, data attributes, and ARIA.

## Implementation Notes

- Reuse Combobox's collection, filtering, input, highlighted item, and selection
  conventions instead of creating a parallel autocomplete model.
- Do not add a shadcn wrapper in this plan; the selected row is Base UI only.
- Keep value and query state controlled by the consuming Foldkit model.

## Testing

- Port Autocomplete item/root/value tests semantically and cover origin specs via
  parity.
- Add Scene coverage for typing, filtering, highlighted item, selection, empty
  results, disabled items, data attributes, and ARIA.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep autocomplete --dry-run`
  - `bun run parity:check -- --grep autocomplete`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if plan 053 is not landed or Autocomplete would duplicate Combobox
  filtering, collection, or highlighted-item behavior.
