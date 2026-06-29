# 079 - Implement shadcn Carousel

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat e5534d56..HEAD -- plans/artifacts/070-next-component-selection/selection.md plans/artifacts/070-next-component-dossiers/shadcn-carousel registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED
- **Depends on**: plans/058-implement-shadcn-card.md
- **Category**: direction
- **Planned at**: commit `e5534d56`, 2026-06-28

## Summary

Implement `shadcn/carousel` with a Foldkit-native carousel model, local
controls, examples, docs artifacts, and parity without Embla runtime imports.

## Source Evidence

- Selection row: `plans/artifacts/070-next-component-selection/selection.md`
- Dossier: `plans/artifacts/070-next-component-dossiers/shadcn-carousel/dossier.json`
- Preview: `plans/artifacts/070-next-component-dossiers/shadcn-carousel/plan-preview.md`
- Origin docs: `https://ui.shadcn.com/docs/components/carousel`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/carousel.tsx`
- Origin examples: `repos/ui/apps/v4/examples/base/carousel-*.tsx`
- Origin parts include carousel root, content, item, previous control, and next
  control.

## Scope

- Add `registry-src/shadcn/carousel/item.json`.
- Add `src/registry/shadcn/carousel/index.ts`, `examples.ts`, and tests.
- Add `shadcn/carousel` parity fixture coverage.
- Update generated registry/docs/progress artifacts.

## Implementation Notes

- Replace `embla-carousel-react` with local Foldkit state for selected index,
  orientation, item count, can-scroll-prev, can-scroll-next, and keyboard
  navigation.
- Compose local `shadcn/button`, `shadcn/card`, and `utils/cn`.
- Treat autoplay/plugin examples as fixture-only or explicitly deferred unless
  they can be represented with existing Foldkit commands and Effect time
  without a new plugin architecture.
- Preserve origin dimensions, transforms/overflow classes, aria labels, disabled
  control states, vertical examples, and RTL behavior.

## Testing

- Add Story tests for next/previous, boundary behavior, orientation, disabled
  controls, and keyboard input.
- Add Scene tests for accessible labels, focus order, control state, item
  structure, and parity fixture rendering.
- Replicate origin carousel examples, including card, orientation, spacing,
  API/status, and plugin examples only when local dependencies are satisfied.
- Add origin and Foldkit parity cases for each replicated example.
- Run:
  - `bun run registry:build`
  - `bun run origin:components:write`
  - `bun run registry:check`
  - `bun run origin:components:check`
  - `bun run parity:check -- --grep carousel --dry-run`
  - `bun run parity:check -- --grep carousel`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if implementation requires Embla packages, React hooks, or upstream
  carousel runtime source in installable output.
- Stop if plugin/autoplay parity needs a broader lifecycle-command foundation;
  defer those examples explicitly instead of smuggling timers into view code.
