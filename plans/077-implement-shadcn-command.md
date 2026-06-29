# 077 - Implement shadcn Command

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat e5534d56..HEAD -- plans/artifacts/070-next-component-selection/selection.md plans/artifacts/070-next-component-dossiers/shadcn-command registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED
- **Depends on**: plans/033-implement-base-ui-and-shadcn-dialog.md, plans/072-implement-shadcn-input-group.md
- **Category**: direction
- **Planned at**: commit `e5534d56`, 2026-06-28

## Summary

Implement `shadcn/command` as a Foldkit-native command list and command dialog,
replacing `cmdk` with local state, messages, examples, and origin parity.

## Source Evidence

- Selection row: `plans/artifacts/070-next-component-selection/selection.md`
- Dossier: `plans/artifacts/070-next-component-dossiers/shadcn-command/dossier.json`
- Preview: `plans/artifacts/070-next-component-dossiers/shadcn-command/plan-preview.md`
- Origin docs: `https://ui.shadcn.com/docs/components/command`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/command.tsx`
- Origin examples: `repos/ui/apps/v4/examples/base/command-*.tsx`
- Origin slots include command root, dialog, input, list, empty, group,
  separator, item, and shortcut parts.

## Scope

- Add `registry-src/shadcn/command/item.json`.
- Add `src/registry/shadcn/command/index.ts`, `examples.ts`, and tests.
- Add `shadcn/command` parity fixture coverage.
- Update generated registry/docs/progress artifacts.

## Implementation Notes

- Replace `cmdk` with a local Foldkit model for input value, filtered groups,
  highlighted item, selected item, empty state, and keyboard navigation.
- Compose local `shadcn/button`, `shadcn/dialog`, `shadcn/input-group`, and
  `utils/cn`.
- Keep messages fact-shaped: `UpdatedCommandQuery`, `PressedCommandKey`,
  `SelectedCommandItem`, and dialog open/close facts are acceptable; do not
  hide state in imperative handlers.
- Replace `lucide-react` and language-selector runtime with inline icons and
  deterministic fixtures.
- Preserve visual class fidelity for basic, grouped, scrollable, shortcut,
  dialog, and RTL examples.

## Testing

- Add Story tests for query updates, filtering, highlighted-item movement,
  selection, empty state, and dialog open/close state.
- Add Scene tests for keyboard navigation, accessible roles, aria-selected,
  input labels, group labels, separators, and shortcuts.
- Replicate every origin command example and add origin/Foldkit parity cases.
- Run:
  - `bun run registry:build`
  - `bun run origin:components:write`
  - `bun run registry:check`
  - `bun run origin:components:check`
  - `bun run parity:check -- --grep command --dry-run`
  - `bun run parity:check -- --grep command`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if the implementation would require `cmdk`, React context, React hooks,
  or any upstream command runtime in installable source.
- Stop if the dialog example cannot compose the local Dialog without changing
  Dialog behavior outside this component.
