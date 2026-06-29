# 080 - Implement shadcn Resizable

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat e5534d56..HEAD -- plans/artifacts/070-next-component-selection/selection.md plans/artifacts/070-next-component-dossiers/shadcn-resizable registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED
- **Depends on**: plans/019-add-origin-component-progress-tracker.md
- **Category**: direction
- **Planned at**: commit `e5534d56`, 2026-06-28

## Summary

Implement `shadcn/resizable` as a local split-panel primitive with pointer and
keyboard behavior, examples, docs artifacts, and parity.

## Source Evidence

- Selection row: `plans/artifacts/070-next-component-selection/selection.md`
- Dossier: `plans/artifacts/070-next-component-dossiers/shadcn-resizable/dossier.json`
- Preview: `plans/artifacts/070-next-component-dossiers/shadcn-resizable/plan-preview.md`
- Origin docs: `https://ui.shadcn.com/docs/components/resizable`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/resizable.tsx`
- Origin examples: `repos/ui/apps/v4/examples/base/resizable-*.tsx`
- Origin parts include panel group, panel, and handle.

## Scope

- Add `registry-src/shadcn/resizable/item.json`.
- Add `src/registry/shadcn/resizable/index.ts`, `examples.ts`, and tests.
- Add `shadcn/resizable` parity fixture coverage.
- Update generated registry/docs/progress artifacts.

## Implementation Notes

- Replace `react-resizable-panels` with a Foldkit-native model for group
  direction, panel ids, panel sizes, active drag handle, pointer delta, collapse
  state where supported, and keyboard resize steps.
- Keep side effects confined to commands/subscriptions if pointer capture or
  global pointer movement is needed; do not add raw listeners in view helpers.
- Preserve origin handle structure, optional handle icon, horizontal and
  vertical examples, and nested layout examples.
- Represent panel-size constraints with Effect Schema and pure normalization
  helpers.

## Testing

- Add Story tests for initial sizes, resize normalization, min/max constraints,
  collapse behavior if supported, and keyboard resize steps.
- Add Scene tests for separators, aria orientation/value attributes, keyboard
  controls, handle focus, and example structure.
- Replicate all origin resizable examples and add parity cases.
- Run:
  - `bun run registry:build`
  - `bun run origin:components:write`
  - `bun run registry:check`
  - `bun run origin:components:check`
  - `bun run parity:check -- --grep resizable --dry-run`
  - `bun run parity:check -- --grep resizable`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if robust pointer capture and keyboard resizing requires a reusable
  interaction foundation larger than this row.
- Stop if implementation requires `react-resizable-panels`, React hooks, or
  upstream runtime source in installable output.
