# 040 - Implement Base UI and shadcn Tooltip

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat 96baac1d..HEAD -- plans/artifacts/040-next-component-selection/selection.md plans/artifacts/040-next-component-dossiers/tooltip registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED
- **Depends on**: plans/034-implement-popover.md
- **Category**: direction
- **Planned at**: commit `96baac1d`, 2026-06-26

## Summary

Implement `base-ui/tooltip` and `shadcn/tooltip` together. Tooltip should be a
Foldkit-native behavior primitive with local styled shadcn composition, not a
React/Base UI runtime wrapper.

## Source Evidence

- Selection row: `plans/artifacts/040-next-component-selection/selection.md`
- Dossier: `plans/artifacts/040-next-component-dossiers/tooltip/dossier.json`
- Preview: `plans/artifacts/040-next-component-dossiers/tooltip/plan-preview.md`
- Origin docs:
  - `https://base-ui.com/react/components/tooltip`
  - `https://ui.shadcn.com/docs/components/tooltip`
- Key origin source: `repos/base-ui/packages/react/src/tooltip/**`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/tooltip.tsx`

## Scope

- Add `registry-src/base-ui/tooltip/item.json`.
- Add `registry-src/shadcn/tooltip/item.json`.
- Add `src/registry/base-ui/tooltip/index.ts` and colocated tests.
- Add `src/registry/shadcn/tooltip/index.ts`, `examples.ts`, and tests.
- Add parity fixture coverage in `tests/parity/slots.ts` and fixture runners.
- Preserve trigger, portal, positioner, popup, arrow, provider, viewport, delay,
  disabled, keyboard, detached-trigger, RTL, and side-placement behavior that is
  representable in Foldkit.

## Implementation Notes

- Reuse Popover's local overlay, portal, positioning, dismiss, and focus
  conventions where they apply.
- Open state belongs in the consuming Foldkit model; expose messages/facts and
  pure view helpers rather than imperative event handlers.
- Map origin `render` and shadcn `asChild` to Foldkit `toView` or named part
  renderers.
- Keep `@/components/language-selector`, `lucide-react`, and React-only
  imports fixture-only or replace them with existing local registry items.
- shadcn Tooltip composes local `base-ui/tooltip`, `shadcn/button`,
  `shadcn/kbd`, and `utils/cn`.

## Testing

- Port the Base UI tooltip unit/spec coverage semantically for root, trigger,
  popup, portal, provider, viewport, arrow, positioner, detached triggers,
  keyboard behavior, delay behavior, disabled behavior, data attributes, and
  ARIA relationships.
- Replicate shadcn examples from the dossier, including disabled, keyboard, RTL,
  and side demos.
- Add origin/Foldkit parity cases for both registry items.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep tooltip --dry-run`
  - `bun run parity:check -- --grep tooltip`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if plan 034 is not landed or Tooltip would duplicate Popover's portal,
  positioning, dismiss, or focus primitives.
- Stop if delay/hover intent requires a shared timer/subscription abstraction
  that is not yet available.
- Stop if any installable source needs React, Base UI React, Radix, or
  lucide-react runtime imports.
