# 081 - Implement Base UI Toast

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat e5534d56..HEAD -- plans/artifacts/070-next-component-selection/selection.md plans/artifacts/070-next-component-dossiers/base-ui-toast registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: HIGH
- **Depends on**: plans/019-add-origin-component-progress-tracker.md
- **Category**: direction
- **Planned at**: commit `e5534d56`, 2026-06-28

## Summary

Implement `base-ui/toast` as the local unstyled notification foundation with
manager behavior, data attributes, semantic tests, examples, and origin parity.

## Source Evidence

- Selection row: `plans/artifacts/070-next-component-selection/selection.md`
- Dossier: `plans/artifacts/070-next-component-dossiers/base-ui-toast/dossier.json`
- Preview: `plans/artifacts/070-next-component-dossiers/base-ui-toast/plan-preview.md`
- Origin docs: `https://base-ui.com/react/components/toast`
- Base UI source: `repos/base-ui/packages/react/src/toast/**`
- Origin tests/specs: toast source tests and utilities listed in the dossier.
- Origin parts include provider, viewport, root, title, description, content,
  action, close, portal, positioner, arrow, store, and toast manager utilities.

## Scope

- Add `registry-src/base-ui/toast/item.json`.
- Add `src/registry/base-ui/toast/index.ts`, `examples.ts`, and tests.
- Add `base-ui/toast` parity fixture coverage.
- Update generated registry/docs/progress artifacts.

## Implementation Notes

- Port Base UI behavior into a Foldkit-friendly notification model: toast ids,
  lifecycle status, type, priority/order, duration, pause/resume, swipe/dismiss
  state, viewport position, and action/close messages.
- Use Effect Schema for public config, toast events, positions, promise result
  states, and data-attribute state.
- Keep the primitive unstyled. It should expose part renderers/data attributes
  and compose cleanly with future `shadcn/sonner` without shadcn classes here.
- Avoid a hidden mutable global singleton. If a manager is needed, represent the
  public boundary as Foldkit messages, commands, and deterministic state.
- Preserve Base UI data attributes and CSS custom properties where applicable.

## Testing

- Port origin semantic tests for open/close, actions, close control, viewport,
  positioning, promise resolution, timing, pause/resume, dismiss, and data
  attributes where they apply in Foldkit.
- Add Story and Scene tests for local toast lifecycle and accessibility.
- Add parity fixtures for the docs examples and any stable origin examples
  captured by the dossier.
- Run:
  - `bun run registry:build`
  - `bun run origin:components:write`
  - `bun run registry:check`
  - `bun run origin:components:check`
  - `bun run parity:check -- --grep toast --dry-run`
  - `bun run parity:check -- --grep toast`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if the notification architecture would require raw global mutation,
  React context, React hooks, or Base UI React runtime imports.
- Stop if the row needs a broader app-level command/subscription design
  decision before Base UI toast can be represented honestly.
