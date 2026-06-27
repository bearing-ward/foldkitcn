# 047 - Implement Base UI OTP Field and shadcn Input OTP

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat 96baac1d..HEAD -- plans/artifacts/040-next-component-selection/selection.md plans/artifacts/040-next-component-dossiers/otp-field-input-otp registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/022-implement-input.md
- **Category**: direction
- **Planned at**: commit `96baac1d`, 2026-06-26

## Summary

Implement `base-ui/otp-field` and `shadcn/input-otp` together. The Foldkit
primitive should preserve the origin multi-slot input behavior and the shadcn
wrapper should reproduce the local styled examples.

## Source Evidence

- Selection row: `plans/artifacts/040-next-component-selection/selection.md`
- Dossier: `plans/artifacts/040-next-component-dossiers/otp-field-input-otp/dossier.json`
- Preview: `plans/artifacts/040-next-component-dossiers/otp-field-input-otp/plan-preview.md`
- Origin docs:
  - `https://base-ui.com/react/components/otp-field`
  - `https://ui.shadcn.com/docs/components/input-otp`
- Key origin source: `repos/base-ui/packages/react/src/otp-field/**`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/input-otp.tsx`

## Scope

- Add `registry-src/base-ui/otp-field/item.json`.
- Add `registry-src/shadcn/input-otp/item.json`.
- Add `src/registry/base-ui/otp-field/index.ts` and tests.
- Add `src/registry/shadcn/input-otp/index.ts`, `examples.ts`, and tests.
- Add parity fixture coverage for both registry items.
- Preserve root, input/slot behavior, grouping, caret/focus movement, paste,
  deletion, value normalization, disabled state, data attributes, and ARIA.

## Implementation Notes

- Reuse Input's form-control conventions and class handling where possible.
- Value state belongs in the consuming Foldkit model. Expose helpers for slot
  projection rather than storing mutable slot state internally.
- shadcn Input OTP composes local `base-ui/otp-field`, `shadcn/input`, and
  `utils/cn` where applicable.

## Testing

- Port `OTPFieldRoot.test.tsx`, `OTPFieldInput.test.tsx`, `otp.test.ts`, and
  parity-covered specs semantically.
- Replicate shadcn Input OTP examples, including separator/group examples.
- Add Scene coverage for typing, pasting, deleting, focus movement, disabled
  state, complete/incomplete values, and data attributes.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep otp --dry-run`
  - `bun run parity:check -- --grep otp`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if the implementation requires low-level selection/focus commands that
  should be added as shared Foldkit DOM helpers first.
