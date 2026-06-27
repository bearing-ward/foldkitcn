# 045 - Implement Base UI and shadcn Alert Dialog

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat 96baac1d..HEAD -- plans/artifacts/040-next-component-selection/selection.md plans/artifacts/040-next-component-dossiers/alert-dialog registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/033-implement-dialog.md
- **Category**: direction
- **Planned at**: commit `96baac1d`, 2026-06-26

## Summary

Implement `base-ui/alert-dialog` and `shadcn/alert-dialog` as modal
confirmation dialogs that reuse the local Dialog foundation while preserving the
origin alert-specific accessibility and dismissal rules.

## Source Evidence

- Selection row: `plans/artifacts/040-next-component-selection/selection.md`
- Dossier: `plans/artifacts/040-next-component-dossiers/alert-dialog/dossier.json`
- Preview: `plans/artifacts/040-next-component-dossiers/alert-dialog/plan-preview.md`
- Origin docs:
  - `https://base-ui.com/react/components/alert-dialog`
  - `https://ui.shadcn.com/docs/components/alert-dialog`
- Key origin source: `repos/base-ui/packages/react/src/alert-dialog/**`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/alert-dialog.tsx`

## Scope

- Add `registry-src/base-ui/alert-dialog/item.json`.
- Add `registry-src/shadcn/alert-dialog/item.json`.
- Add `src/registry/base-ui/alert-dialog/index.ts` and tests.
- Add `src/registry/shadcn/alert-dialog/index.ts`, `examples.ts`, and tests.
- Add parity fixture coverage for both registry items.
- Preserve root, trigger, portal, backdrop/overlay, popup/content, title,
  description, close/cancel/action parts, modal behavior, focus restore, data
  attributes, and ARIA semantics.

## Implementation Notes

- Reuse Dialog's portal, focus trap, escape handling, outside-dismiss policy,
  aria labeling, and scroll-lock conventions.
- Alert Dialog should keep destructive/action decisions in the consuming model;
  the registry item only renders and emits facts.
- shadcn Alert Dialog composes local `base-ui/alert-dialog`, `shadcn/button`,
  and `utils/cn`.

## Testing

- Port `AlertDialogRoot.test.tsx` semantically and cover the spec expectations
  with parity.
- Replicate shadcn Alert Dialog examples.
- Add tests for forced modality, focus handoff, cancel/action activation,
  labeling, dismiss restrictions, and data attributes.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep alert-dialog --dry-run`
  - `bun run parity:check -- --grep alert-dialog`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if plan 033 is not landed or Alert Dialog would need to fork Dialog's
  focus, portal, or dismiss behavior.
