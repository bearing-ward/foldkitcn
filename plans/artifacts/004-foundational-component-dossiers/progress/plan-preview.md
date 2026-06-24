# base-ui/progress + shadcn/progress Dossier Preview

## Batch

- `base-ui/progress`
- `shadcn/progress`

This dossier does not implement registry source. It prepares a future improve plan for the local Foldkit registry.

## Origin Evidence

### Base UI Progress

- Registry item: `base-ui/progress`
- Origin kind: `base-ui`
- Docs URL: https://base-ui.com/react/components/progress
- Local repo: `repos/base-ui`
- Pinned ref: `ea3818dec91923d4287b38be21322d2e5068d347`
- Source paths: `repos/base-ui/packages/react/src/progress/index.parts.ts`, `repos/base-ui/packages/react/src/progress/index.ts`, `repos/base-ui/packages/react/src/progress/indicator/ProgressIndicator.tsx`, `repos/base-ui/packages/react/src/progress/indicator/ProgressIndicatorDataAttributes.ts`, `repos/base-ui/packages/react/src/progress/label/ProgressLabel.tsx`, `repos/base-ui/packages/react/src/progress/label/ProgressLabelDataAttributes.ts`, `repos/base-ui/packages/react/src/progress/root/ProgressRoot.tsx`, `repos/base-ui/packages/react/src/progress/root/ProgressRootContext.tsx`, `repos/base-ui/packages/react/src/progress/root/ProgressRootDataAttributes.ts`, `repos/base-ui/packages/react/src/progress/root/stateAttributesMapping.ts`, `repos/base-ui/packages/react/src/progress/track/ProgressTrack.tsx`, `repos/base-ui/packages/react/src/progress/track/ProgressTrackDataAttributes.ts`, `repos/base-ui/packages/react/src/progress/value/ProgressValue.tsx`, `repos/base-ui/packages/react/src/progress/value/ProgressValueDataAttributes.ts`
- Docs paths: `repos/base-ui/docs/src/app/(docs)/react/components/progress/page.mdx`, `repos/base-ui/docs/src/app/(docs)/react/components/progress/types.md`, `repos/base-ui/docs/src/app/(docs)/react/components/progress/types.ts`
- Demo paths: `repos/base-ui/docs/src/app/(docs)/react/components/progress/demos/hero/css-modules/index.module.css`, `repos/base-ui/docs/src/app/(docs)/react/components/progress/demos/hero/css-modules/index.tsx`, `repos/base-ui/docs/src/app/(docs)/react/components/progress/demos/hero/index.ts`, `repos/base-ui/docs/src/app/(docs)/react/components/progress/demos/hero/tailwind/index.tsx`
- Test/spec paths: `repos/base-ui/packages/react/src/progress/indicator/ProgressIndicator.test.tsx`, `repos/base-ui/packages/react/src/progress/label/ProgressLabel.test.tsx`, `repos/base-ui/packages/react/src/progress/root/ProgressRoot.test.tsx`, `repos/base-ui/packages/react/src/progress/track/ProgressTrack.test.tsx`, `repos/base-ui/packages/react/src/progress/value/ProgressValue.test.tsx`
- Style variants: `none`
- Runtime hints: `@base-ui-components/react/progress`
- Registry hints: `none`
- Confidence: `high`

### shadcn Progress

- Registry item: `shadcn/progress`
- Origin kind: `shadcn`
- Docs URL: https://ui.shadcn.com/docs/components/progress
- Local repo: `repos/ui`
- Pinned ref: `95471a0fb95b2b205e1850841e05d93f3fcae659`
- Source paths: `repos/ui/apps/v4/styles/base-nova/ui/progress.tsx`
- Docs paths: `repos/ui/apps/v4/content/docs/components/base/progress.mdx`, `repos/ui/apps/v4/content/docs/components/radix/progress.mdx`
- Demo paths: `repos/ui/apps/v4/examples/base/progress-controlled.tsx`, `repos/ui/apps/v4/examples/base/progress-demo.tsx`, `repos/ui/apps/v4/examples/base/progress-label.tsx`, `repos/ui/apps/v4/examples/base/progress-rtl.tsx`
- Test/spec paths: `none`
- Style variants: `repos/ui/apps/v4/styles/base-luma/ui/progress.tsx`, `repos/ui/apps/v4/styles/base-lyra/ui/progress.tsx`, `repos/ui/apps/v4/styles/base-maia/ui/progress.tsx`, `repos/ui/apps/v4/styles/base-mira/ui/progress.tsx`, `repos/ui/apps/v4/styles/base-nova/ui-rtl/progress.tsx`, `repos/ui/apps/v4/styles/base-nova/ui/progress.tsx`, `repos/ui/apps/v4/styles/base-rhea/ui/progress.tsx`, `repos/ui/apps/v4/styles/base-sera/ui/progress.tsx`, `repos/ui/apps/v4/styles/base-vega/ui/progress.tsx`
- Runtime hints: `@/components/language-selector`, `@base-ui/react/progress`, `react`
- Registry hints: `base-ui/progress`, `shadcn/slider`, `utils/cn`
- Confidence: `medium`

## Foldkit Mapping

- Keep Base UI origins as unstyled Foldkit behavior primitives or stateless render helpers according to the local component shape.
- Keep shadcn origins as styled Foldkit wrappers or compositions over local primitives.
- Map origin `render` and shadcn `asChild` support to Foldkit `toView` or named part-renderer composition.
- Use `cn` from `utils/cn` when a shadcn source imports `@/lib/utils`.
- Represent style variants with Effect Schema literals and pure class maps.
- Record consumed theme tokens before marking any shadcn item installable.

## Dependencies

- `@/components/language-selector`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `@base-ui-components/react/progress`: `replace-with-foldkit` -> `defer` (Replace the upstream React primitive with the local Foldkit registry implementation.)
- `@base-ui/react/progress`: `replace-with-foldkit` -> `base-ui/progress` (Replace the upstream React primitive with the local Foldkit registry implementation.)
- `base-ui/progress`: `registry-local` -> `base-ui/progress` (The styled shadcn item composes this local Base UI primitive.)
- `react`: `dev-or-fixture-only` -> `defer` (React is origin fixture evidence only, not installable Foldkit source.)
- `shadcn/slider`: `registry-local` -> `shadcn/slider` (Origin examples compose this local shadcn registry item.)
- `utils/cn`: `registry-local` -> `utils/cn` (Local shadcn class canonicalization and Tailwind conflict handling.)

## Origin Test Classification

- `repos/base-ui/packages/react/src/progress/indicator/ProgressIndicator.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/progress/label/ProgressLabel.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/progress/root/ProgressRoot.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/progress/track/ProgressTrack.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/progress/value/ProgressValue.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)

## Future Improve Plan Shape

1. Create these registry items as dossier-backed implementation slices: `base-ui/progress`, `shadcn/progress`.
2. Add semantic Story and Scene tests for the Foldkit messages, state, accessibility, and view behavior each item owns.
3. Add local origin and Foldkit parity fixtures for each registry item.
4. Replace upstream React, Radix, Base UI React, and CVA dependencies with local Foldkit and Effect-native implementations.
5. Add theme token coverage and class canonicalization parity for shadcn items.
6. Run `bun run registry:check`, `bun run parity:check -- --grep <component> --dry-run`, `bun run test`, `bun run typecheck`, `bun run check`, and `bun run build`.
