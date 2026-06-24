# base-ui/toggle-group + shadcn/toggle-group Dossier Preview

## Batch

- `base-ui/toggle-group`
- `shadcn/toggle-group`

This dossier does not implement registry source. It prepares a future improve plan for the local Foldkit registry.

## Origin Evidence

### Base UI Toggle Group

- Registry item: `base-ui/toggle-group`
- Origin kind: `base-ui`
- Docs URL: https://base-ui.com/react/components/toggle-group
- Local repo: `repos/base-ui`
- Pinned ref: `ea3818dec91923d4287b38be21322d2e5068d347`
- Source paths: `repos/base-ui/packages/react/src/toggle-group/index.ts`, `repos/base-ui/packages/react/src/toggle-group/ToggleGroup.tsx`, `repos/base-ui/packages/react/src/toggle-group/ToggleGroupContext.ts`, `repos/base-ui/packages/react/src/toggle-group/ToggleGroupDataAttributes.ts`
- Docs paths: `repos/base-ui/docs/src/app/(docs)/react/components/toggle-group/page.mdx`, `repos/base-ui/docs/src/app/(docs)/react/components/toggle-group/types.md`, `repos/base-ui/docs/src/app/(docs)/react/components/toggle-group/types.ts`
- Demo paths: `repos/base-ui/docs/src/app/(docs)/react/components/toggle-group/demos/hero/css-modules/index.module.css`, `repos/base-ui/docs/src/app/(docs)/react/components/toggle-group/demos/hero/css-modules/index.tsx`, `repos/base-ui/docs/src/app/(docs)/react/components/toggle-group/demos/hero/index.ts`, `repos/base-ui/docs/src/app/(docs)/react/components/toggle-group/demos/hero/tailwind/index.tsx`, `repos/base-ui/docs/src/app/(docs)/react/components/toggle-group/demos/multiple/css-modules/index.module.css`, `repos/base-ui/docs/src/app/(docs)/react/components/toggle-group/demos/multiple/css-modules/index.tsx`, `repos/base-ui/docs/src/app/(docs)/react/components/toggle-group/demos/multiple/index.ts`, `repos/base-ui/docs/src/app/(docs)/react/components/toggle-group/demos/multiple/tailwind/index.tsx`
- Test/spec paths: `repos/base-ui/packages/react/src/toggle-group/ToggleGroup.test.tsx`, `repos/base-ui/packages/react/src/toggle-group/ToggleGroup.spec.tsx`
- Style variants: `none`
- Runtime hints: `@base-ui-components/react/toggle-group`
- Registry hints: `none`
- Confidence: `high`

### shadcn Toggle Group

- Registry item: `shadcn/toggle-group`
- Origin kind: `shadcn`
- Docs URL: https://ui.shadcn.com/docs/components/toggle-group
- Local repo: `repos/ui`
- Pinned ref: `95471a0fb95b2b205e1850841e05d93f3fcae659`
- Source paths: `repos/ui/apps/v4/styles/base-nova/ui/toggle-group.tsx`
- Docs paths: `repos/ui/apps/v4/content/docs/components/base/toggle-group.mdx`, `repos/ui/apps/v4/content/docs/components/radix/toggle-group.mdx`
- Demo paths: `repos/ui/apps/v4/examples/base/toggle-group-demo.tsx`, `repos/ui/apps/v4/examples/base/toggle-group-disabled.tsx`, `repos/ui/apps/v4/examples/base/toggle-group-font-weight-selector.tsx`, `repos/ui/apps/v4/examples/base/toggle-group-outline.tsx`, `repos/ui/apps/v4/examples/base/toggle-group-rtl.tsx`, `repos/ui/apps/v4/examples/base/toggle-group-sizes.tsx`, `repos/ui/apps/v4/examples/base/toggle-group-spacing.tsx`, `repos/ui/apps/v4/examples/base/toggle-group-vertical.tsx`
- Test/spec paths: `none`
- Style variants: `repos/ui/apps/v4/styles/base-luma/ui/toggle-group.tsx`, `repos/ui/apps/v4/styles/base-lyra/ui/toggle-group.tsx`, `repos/ui/apps/v4/styles/base-maia/ui/toggle-group.tsx`, `repos/ui/apps/v4/styles/base-mira/ui/toggle-group.tsx`, `repos/ui/apps/v4/styles/base-nova/ui-rtl/toggle-group.tsx`, `repos/ui/apps/v4/styles/base-nova/ui/toggle-group.tsx`, `repos/ui/apps/v4/styles/base-rhea/ui/toggle-group.tsx`, `repos/ui/apps/v4/styles/base-sera/ui/toggle-group.tsx`, `repos/ui/apps/v4/styles/base-vega/ui/toggle-group.tsx`
- Runtime hints: `@/components/language-selector`, `@base-ui/react/toggle`, `@base-ui/react/toggle-group`, `class-variance-authority`, `lucide-react`, `react`
- Registry hints: `base-ui/toggle`, `base-ui/toggle-group`, `shadcn/field`, `shadcn/toggle`, `utils/cn`
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
- `@base-ui-components/react/toggle-group`: `replace-with-foldkit` -> `defer` (Replace the upstream React primitive with the local Foldkit registry implementation.)
- `@base-ui/react/toggle`: `replace-with-foldkit` -> `base-ui/toggle` (Replace the upstream React primitive with the local Foldkit registry implementation.)
- `@base-ui/react/toggle-group`: `replace-with-foldkit` -> `base-ui/toggle-group` (Replace the upstream React primitive with the local Foldkit registry implementation.)
- `base-ui/toggle`: `registry-local` -> `base-ui/toggle` (The styled shadcn item composes this local Base UI primitive.)
- `base-ui/toggle-group`: `registry-local` -> `base-ui/toggle-group` (The styled shadcn item composes this local Base UI primitive.)
- `class-variance-authority`: `reject-or-defer` -> `defer` (Replace CVA with Effect Schema literals and pure variant class maps.)
- `lucide-react`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `react`: `dev-or-fixture-only` -> `defer` (React is origin fixture evidence only, not installable Foldkit source.)
- `shadcn/field`: `registry-local` -> `shadcn/field` (Origin examples compose this local shadcn registry item.)
- `shadcn/toggle`: `registry-local` -> `shadcn/toggle` (Origin examples compose this local shadcn registry item.)
- `utils/cn`: `registry-local` -> `utils/cn` (Local shadcn class canonicalization and Tailwind conflict handling.)

## Origin Test Classification

- `repos/base-ui/packages/react/src/toggle-group/ToggleGroup.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/toggle-group/ToggleGroup.spec.tsx`: `covered-by-parity` (DOM attributes and browser behavior belong in origin parity fixtures.)

## Future Improve Plan Shape

1. Create these registry items as dossier-backed implementation slices: `base-ui/toggle-group`, `shadcn/toggle-group`.
2. Add semantic Story and Scene tests for the Foldkit messages, state, accessibility, and view behavior each item owns.
3. Add local origin and Foldkit parity fixtures for each registry item.
4. Replace upstream React, Radix, Base UI React, and CVA dependencies with local Foldkit and Effect-native implementations.
5. Add theme token coverage and class canonicalization parity for shadcn items.
6. Run `bun run registry:check`, `bun run parity:check -- --grep <component> --dry-run`, `bun run test`, `bun run typecheck`, `bun run check`, and `bun run build`.
