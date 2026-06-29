# 088 - Implement shadcn Message Scroller

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat e5534d56..HEAD -- plans/artifacts/070-next-component-selection/selection.md plans/artifacts/070-next-component-dossiers/shadcn-message-scroller registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: HIGH
- **Depends on**: plans/072-implement-shadcn-input-group.md, plans/074-implement-shadcn-empty.md, plans/085-implement-shadcn-bubble.md, plans/086-implement-shadcn-marker.md, plans/087-implement-shadcn-message.md
- **Category**: direction
- **Planned at**: commit `e5534d56`, 2026-06-28

## Summary

Implement `shadcn/message-scroller` as a Foldkit-native chat viewport and
autoscroll composition over local message primitives, with examples, docs
artifacts, and parity.

## Source Evidence

- Selection row: `plans/artifacts/070-next-component-selection/selection.md`
- Dossier: `plans/artifacts/070-next-component-dossiers/shadcn-message-scroller/dossier.json`
- Preview: `plans/artifacts/070-next-component-dossiers/shadcn-message-scroller/plan-preview.md`
- Origin docs: `https://ui.shadcn.com/docs/components/message-scroller`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/message-scroller.tsx`
- Origin examples: `repos/ui/apps/v4/examples/base/message-scroller-*.tsx`
- Origin slots include provider, scroller root, viewport, content, item, and
  scroll button.

## Scope

- Add `registry-src/shadcn/message-scroller/item.json`.
- Add `src/registry/shadcn/message-scroller/index.ts`, `examples.ts`, and tests.
- Add `shadcn/message-scroller` parity fixture coverage.
- Update generated registry/docs/progress artifacts.

## Implementation Notes

- Replace `@shadcn/react/message-scroller`, AI SDK hooks, and message animation
  libraries with a Foldkit model for viewport scroll state, whether the view is
  pinned to bottom, pending/new message state, scroll button visibility, and
  deterministic message fixtures.
- Compose local `shadcn/bubble`, `shadcn/button`, `shadcn/card`,
  `shadcn/dropdown-menu`, `shadcn/empty`, `shadcn/hover-card`,
  `shadcn/input-group`, `shadcn/marker`, `shadcn/message`, `shadcn/select`,
  `shadcn/slider`, `shadcn/tabs`, `shadcn/toggle-group`,
  `shadcn/tooltip`, and `utils/cn`.
- Keep scrolling side effects in explicit commands such as `ScrollMessagesToEnd`
  with `CompletedScrollMessagesToEnd` results; do not call DOM APIs directly in
  view helpers.
- Treat AI streaming, animation-library demos, and live network examples as
  fixture-only or deferred unless existing local foundations cover them.

## Testing

- Add Story tests for pinned/unpinned state, new-message indicators, scroll
  button visibility, item append behavior, and command results.
- Add Scene tests for viewport structure, accessible button labels, keyboard
  reachability, deterministic examples, and scroll command wiring.
- Replicate all origin message-scroller examples that can be supported by local
  dependencies and add origin/Foldkit parity cases.
- Run:
  - `bun run registry:build`
  - `bun run origin:components:write`
  - `bun run registry:check`
  - `bun run origin:components:check`
  - `bun run parity:check -- --grep message-scroller --dry-run`
  - `bun run parity:check -- --grep message-scroller`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if local message, bubble, marker, input-group, or empty contracts are not
  complete.
- Stop if source parity requires AI SDK, live network calls, animation runtime,
  raw DOM scroll mutation in views, or `@shadcn/react/message-scroller`.
