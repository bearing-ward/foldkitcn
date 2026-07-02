# 098 - Implement shadcn Toast with stacked expansion

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat 88e28f16..HEAD -- plans/artifacts/098-blocked-component-foundation-preview docs/component-conversion-checklist.md registry-src/shadcn/toast registry-src/shadcn/sonner registry-src/base-ui/toast src/registry/base-ui/toast src/registry/shadcn/sonner src/registry/shadcn/toast scripts/registry-common.ts`
> If any in-scope file changed, compare this plan with the live files before
> proceeding. The intent is still: use Foldkit toast behavior, keep shadcn card
> styling, and add only the shadcn stacked/hover-expanded presentation needed
> for parity.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/081-implement-base-ui-toast.md, plans/082-implement-shadcn-sonner.md
- **Category**: direction
- **Planned at**: commit `88e28f16`, 2026-07-01

## Summary

Promote `shadcn/toast` from the held row into an installable local registry
component by composing the existing Foldkit-native toast implementation and
styling it like shadcn's toast cards. The only intended behavioral delta from
the current local toast wrappers is the shadcn/Sonner-style stacked visual
presentation: multiple toasts compact into layered cards and expand when the
toast viewport is hovered or focused.

## Why

`shadcn/toast` is still blocked even though the local foundations now exist.
The blocker is not a missing upstream package to install; the shadcn origin
implementation is a React/Radix hook stack, while this repo already has a
Foldkit-native toast model and a shadcn Sonner wrapper. The right implementation
path is to reuse the Foldkit behavior, preserve the origin card styling, and
add the stacked/expanded visual treatment shown in the current shadcn examples.

## Current State

- The held-row dossier records `shadcn/toast` as docs/example-only because
  `repos/ui/apps/v4/styles/base-nova/ui/toast.tsx` does not exist. It points to
  public registry JSON and says the architecture must be mapped to Foldkit
  messages, commands, and subscriptions instead of React hooks:
  `plans/artifacts/098-blocked-component-foundation-preview/plan-preview.md:84`.
- The checklist still marks `shadcn/toast` blocked with the same architecture
  concern: `docs/component-conversion-checklist.md:138`.
- Local origin evidence says the shadcn toast page is deprecated in favor of
  Sonner, and the public registry JSON uses `@radix-ui/react-toast`, React
  module state, and `useToast`: `repos/ui/apps/v4/content/docs/components/base/toast.mdx`,
  `repos/ui/apps/v4/public/r/styles/default/toast.json`,
  `repos/ui/apps/v4/public/r/styles/default/use-toast.json`.
- The local Base UI toast implementation already owns the runtime state:
  `ToastItem`, `ToastState`, viewport position, timers, hover/focus state, and
  stacking strategy live in `src/registry/base-ui/toast/index.ts:65` and
  `src/registry/base-ui/toast/index.ts:135`.
- Base toast already computes per-toast stack metadata and expansion state:
  `toastMetadata` and `isExpanded` are in
  `src/registry/base-ui/toast/index.ts:419`, and the view exposes
  `isExpanded`, viewport attributes, and toast attributes at
  `src/registry/base-ui/toast/index.ts:732`.
- Base toast already exposes viewport hover/focus interaction messages and
  data attributes for expansion: `src/registry/base-ui/toast/index.ts:915`.
- Base toast root attributes already support the compact shuffle transform,
  `foldkit-push`, stack index CSS variables, close/action handlers, and swipe
  hooks: `src/registry/base-ui/toast/index.ts:1009`.
- The existing `shadcn/sonner` wrapper proves the desired composition style:
  it imports `../../base-ui/toast`, applies shadcn card classes, defaults to
  `foldkit-push`, and renders provider/viewport/toast slots in
  `src/registry/shadcn/sonner/index.ts:6`,
  `src/registry/shadcn/sonner/index.ts:62`, and
  `src/registry/shadcn/sonner/index.ts:384`.
- The latest vendored Foldkit repo confirms the framework-level Toast model:
  `repos/foldkit/packages/website/src/page/ui/toastModule.ts:3` binds
  `Ui.Toast.make(PayloadSchema)`, and
  `repos/foldkit/packages/website/src/page/ui/toast.ts:61` renders card content
  through the consumer's entry renderer.

## Scope

In scope:

- Add `registry-src/shadcn/toast/item.json` and `docs.md`.
- Add `src/registry/shadcn/toast/index.ts`, `examples.ts`, and focused tests.
- Compose `src/registry/base-ui/toast` for state, metadata, hover/focus,
  action, close, timer, swipe, and accessibility behavior.
- Reuse the shadcn card/action/close visual language already present in
  `shadcn/sonner`, adjusted to match shadcn toast cards.
- Add compact stacked cards for multiple toasts and expanded cards on viewport
  hover/focus. This should be CSS/data-attribute driven from the existing
  `isExpanded`, `data-expanded`, `--toast-index`, `--toast-offset-y`, and
  `--toast-height` outputs whenever possible.
- Add live-ready examples for default, title, simple description, action,
  destructive, and stacked/expanded behavior.
- Update generated registry docs and origin/progress artifacts after source
  changes are complete.

Out of scope:

- Installing or importing `@radix-ui/react-toast`, `sonner`, `react`,
  `class-variance-authority`, or origin repo paths into installable source.
- Recreating `useToast` as a global hook or module-level listener store.
- Rewriting `base-ui/toast` lifecycle, timers, subscriptions, or swipe behavior
  unless the executor finds a narrow exported option is required for styling.
- Solving unrelated blocked rows (`data-table`, `date-picker`, `typography`,
  `chart`) or sidebar example issues.

## Implementation Steps

1. Reconfirm local origin evidence.
   - Run `bun run origin:resolve -- https://ui.shadcn.com/docs/components/toast`.
   - Inspect `repos/ui/apps/v4/public/r/styles/default/toast.json` and
     `repos/ui/apps/v4/public/r/styles/default/use-toast.json` only as evidence.
   - Confirm the local implementation must stay Foldkit-native.

2. Create the registry item.
   - Add `registry-src/shadcn/toast/item.json` with local dependencies on
     `base-ui/toast`, `shadcn/button`, and `utils/cn`.
   - Add docs copy that says the Foldkit version uses a model/message driven
     toast state instead of React hooks.
   - Keep generated/public `registry/` files out of hand edits; refresh them
     with the registry build command later.

3. Implement `src/registry/shadcn/toast/index.ts`.
   - Import `* as ToastPrimitive from '../../base-ui/toast'`.
   - Export the styled `Toaster`/`Toast`-style view helpers that this repo's
     registry convention expects; prefer the `shadcn/sonner` wrapper shape over
     copying React component names one-for-one when that would imply hooks.
   - Use shadcn toast card classes as the default style vocabulary:
     `rounded-md`, `border`, `bg-background`, `text-foreground`, `shadow-lg`,
     title `text-sm font-semibold`, description `text-sm opacity-90`, action
     `h-8 rounded-md border bg-transparent px-3`, close button positioned on
     the card edge.
   - Add a destructive variant that maps to the origin destructive card classes
     using local class strings and data attributes.

4. Add the stacked/expanded presentation.
   - Use the current Base UI toast `base-ui-shuffle` strategy or a shadcn-only
     class layer so stacked toasts render as visible card backs in the compact
     state.
   - In compact state, show the front toast at full size and place later toasts
     behind it with small vertical offsets, scale reduction, lower z-index, and
     a visible border/background/shadow like the provided screenshots.
   - On viewport hover or focus, rely on `ToastPrimitive.isExpanded` output via
     `data-expanded` to expand the stack into individually readable cards with
     normal spacing.
   - Keep pointer events usable only where needed: the front toast must be
     actionable while compact, and all expanded cards must expose action and
     close buttons.
   - Preserve pause-on-hover/focus behavior through
     `onViewportInteraction`; do not add DOM listeners or timers outside the
     Foldkit message flow.

5. Implement examples.
   - Port the public registry examples semantically:
     `ToastDemo`, `ToastSimple`, `ToastWithTitle`, `ToastWithAction`,
     `ToastDestructive`.
   - Add a `ToastStacked` or equivalent example that creates at least three
     toasts so the compact stack and hover expansion are visible in the docs.
   - Use local `shadcn/button` for triggers.
   - Keep example messages verb-first and wire close/action messages through the
     parent model the same way `shadcn/sonner/examples.ts` does.

6. Add tests.
   - Unit/story tests should assert adding, updating, action, close,
     destructive variant, and limit behavior through the Foldkit toast state.
   - View/scene tests should assert accessible title/description output,
     action and close buttons, `data-expanded` on hover/focus, compact stack
     attributes/classes before hover, and expanded stack attributes/classes
     after hover/focus.
   - Add a regression that proves multiple toasts remain present in the DOM
     while compact instead of being discarded like the origin `TOAST_LIMIT = 1`
     hook.

7. Register docs and live previews.
   - Add `shadcn/toast` examples to `liveReadyExampleExportsByItemId` in
     `scripts/registry-common.ts`.
   - Register the live examples in `src/live-examples.ts`.
   - Run the registry/docs generation commands and confirm the component page
     shows both snippets and `.live-example-preview` cards.

8. Refresh tracking.
   - Move `shadcn/toast` out of the blocked checklist only after the registry
     item, examples, tests, and docs page are passing.
   - Update generated progress artifacts with the standard commands.

## Verification

Run:

```bash
bun run registry:build
bun run origin:components:write
bun run registry:check
bun run origin:components:check
bun run docs:live-preview-gaps
bun run test -- src/registry/base-ui/toast src/registry/shadcn/sonner src/registry/shadcn/toast src/data.test.ts
bun run typecheck
bun run check
bun run build
```

Manual browser smoke:

- Open `/components/shadcn/toast#examples`.
- Trigger the default, title, simple, action, destructive, and stacked examples.
- Confirm the stacked example initially shows layered toast cards like the
  reference screenshots.
- Hover and keyboard-focus the toast viewport; confirm the stack expands and
  action/close controls are usable on each visible toast.
- Confirm hover/focus pauses dismissal and leaving/blur resumes dismissal.
- Confirm the card styling matches shadcn components, not the heavier Base UI
  demo border style.

## Done Criteria

- `shadcn/toast` has source, registry metadata, docs sidecar, generated docs,
  examples, and tests.
- The component composes local Foldkit/Base UI toast behavior and imports no
  React/Radix/Sonner runtime packages.
- Default card styling matches shadcn component styling.
- Stacked toasts compact visually and expand on mouse hover and keyboard focus.
- All examples render as live previews and keep generated code snippets.
- `docs/component-conversion-checklist.md` no longer lists `shadcn/toast` as
  blocked.

## STOP Conditions

Stop and report if:

- The local Base UI toast cannot expose the metadata or expanded state needed
  for stacked shadcn styling without a broad rewrite.
- The desired stack interaction requires hidden global listeners, module-level
  mutable stores, raw timers, or React-style hook semantics.
- The implementation appears to need an upstream runtime dependency instead of
  the local Foldkit toast.
- The live preview runtime cannot host a stateful toast viewport without
  leaking outside the example card.
- Origin evidence changes and a real base-nova shadcn toast source appears;
  re-plan against the new primary source before implementing.

## Maintenance Notes

- `shadcn/toast` and `shadcn/sonner` should continue sharing the local toast
  foundation. If a later change improves stack metadata or swipe semantics,
  land it in `base-ui/toast` first and keep both wrappers thin.
- Treat the origin React `useToast` file as evidence, not architecture. The
  Foldkit boundary is model/message/subscription driven.
- Keep visual-only stack tweaks in shadcn toast classes where possible so Base
  UI remains the behavior primitive and Sonner keeps its own visual contract.
