# 082 - Implement shadcn Sonner

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat e5534d56..HEAD -- plans/artifacts/070-next-component-selection/selection.md plans/artifacts/070-next-component-dossiers/shadcn-sonner registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/081-implement-base-ui-toast.md
- **Category**: direction
- **Planned at**: commit `e5534d56`, 2026-06-28

## Summary

Implement `shadcn/sonner` as a styled local toast wrapper over `base-ui/toast`,
with shadcn examples, theme-local classes, and origin parity.

## Source Evidence

- Selection row: `plans/artifacts/070-next-component-selection/selection.md`
- Dossier: `plans/artifacts/070-next-component-dossiers/shadcn-sonner/dossier.json`
- Preview: `plans/artifacts/070-next-component-dossiers/shadcn-sonner/plan-preview.md`
- Origin docs: `https://ui.shadcn.com/docs/components/sonner`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/sonner.tsx`
- Origin examples: `repos/ui/apps/v4/examples/base/sonner-*.tsx`
- Origin item exports a `Toaster`-style styled notification surface.

## Scope

- Add `registry-src/shadcn/sonner/item.json`.
- Add `src/registry/shadcn/sonner/index.ts`, `examples.ts`, and tests.
- Add `shadcn/sonner` parity fixture coverage.
- Update generated registry/docs/progress artifacts.

## Implementation Notes

- Compose the local `base-ui/toast` primitive from plan 081. Do not import the
  upstream `sonner` package into installable source.
- Replace `next-themes` with an explicit Effect Schema theme option or local
  docs fixture state that maps to the same class/data-attribute output.
- Preserve origin toast positions, rich colors, action/close styling, promise
  states where supported by `base-ui/toast`, and examples.
- Compose local `shadcn/button` and `utils/cn`; replace `lucide-react` with
  inline local icons.

## Testing

- Add tests for theme option mapping, toast type styling, positions, action and
  close styling, class canonicalization, and example structure.
- Add Scene tests for accessible live regions and interactive examples.
- Replicate origin sonner examples and add origin/Foldkit parity cases.
- Run:
  - `bun run registry:build`
  - `bun run origin:components:write`
  - `bun run registry:check`
  - `bun run origin:components:check`
  - `bun run parity:check -- --grep sonner --dry-run`
  - `bun run parity:check -- --grep sonner`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if plan 081 is not complete and the local `base-ui/toast` contract is
  unavailable.
- Stop if fidelity would require importing `sonner`, `next-themes`, React
  hooks, or origin repo paths into installable source.
