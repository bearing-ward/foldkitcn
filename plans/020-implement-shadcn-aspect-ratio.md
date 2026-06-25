# 020 - Implement shadcn Aspect Ratio

## Summary

Create the Foldkit-native `shadcn/aspect-ratio` registry item from the existing
dossier-ready row in the next-component selection. This is a shadcn-only
component with no Base UI behavior dependency, so it is a good independent first
item from the selection.

## Source Evidence

- Selection row: `plans/artifacts/020-next-component-selection/selection.md`
- Dossier: `plans/artifacts/004-foundational-component-dossiers/aspect-ratio/dossier.json`
- Preview: `plans/artifacts/004-foundational-component-dossiers/aspect-ratio/plan-preview.md`
- Origin docs: `https://ui.shadcn.com/docs/components/aspect-ratio`

## Scope

- Add `registry-src/shadcn/aspect-ratio/item.json`.
- Add `src/registry/shadcn/aspect-ratio/index.ts`.
- Add docs/example fixtures for every origin example recorded in the dossier.
- Add a parity slot for `shadcn/aspect-ratio`.
- Update generated registry output through the normal registry build.

## Implementation Notes

- Use Effect Schema literals for props and exported types.
- Preserve the origin API shape while translating React-only child composition
  into Foldkit `toView` or named renderer inputs.
- Keep all shadcn styling local to the component folder and use the local `cn`
  utility for class canonicalization.
- The component should render a stable ratio box without runtime React,
  `@radix-ui/react-aspect-ratio`, or browser mutation.

## Testing

- Port any documented structural expectations from the shadcn source and docs.
- Add fixture parity that compares the origin example DOM shape, dimensions, and
  computed styles against the Foldkit implementation.
- Run:
  - `bun run registry:check`
  - `bun run registry:build`
  - `bun run parity:check -- --grep shadcn/aspect-ratio`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`

## STOP Conditions

- Stop if the dossier no longer resolves to a shadcn source file.
- Stop if implementation would require a runtime React dependency.
- Stop if generated registry output drifts after `registry:build`.
