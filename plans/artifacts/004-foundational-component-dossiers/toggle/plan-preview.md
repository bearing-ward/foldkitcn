# base-ui/toggle + shadcn/toggle Dossier Preview

## Batch

- `base-ui/toggle`
- `shadcn/toggle`

This dossier does not implement registry source. It prepares a future improve plan for the local Foldkit registry.

## Origin Evidence

### Base UI Toggle

- Registry item: `base-ui/toggle`
- Origin kind: `base-ui`
- Docs URL: https://base-ui.com/react/components/toggle
- Local repo: `repos/base-ui`
- Pinned ref: `ea3818dec91923d4287b38be21322d2e5068d347`
- Source paths: `repos/base-ui/packages/react/src/toggle/index.ts`, `repos/base-ui/packages/react/src/toggle/Toggle.tsx`, `repos/base-ui/packages/react/src/toggle/ToggleDataAttributes.ts`
- Docs paths: `repos/base-ui/docs/src/app/(docs)/react/components/toggle/page.mdx`, `repos/base-ui/docs/src/app/(docs)/react/components/toggle/types.md`, `repos/base-ui/docs/src/app/(docs)/react/components/toggle/types.ts`
- Demo paths: `repos/base-ui/docs/src/app/(docs)/react/components/toggle/demos/hero/css-modules/index.module.css`, `repos/base-ui/docs/src/app/(docs)/react/components/toggle/demos/hero/css-modules/index.tsx`, `repos/base-ui/docs/src/app/(docs)/react/components/toggle/demos/hero/index.ts`, `repos/base-ui/docs/src/app/(docs)/react/components/toggle/demos/hero/tailwind/index.tsx`
- Test/spec paths: `repos/base-ui/packages/react/src/toggle/Toggle.test.tsx`
- Style variants: `none`
- Runtime hints: `@base-ui-components/react/toggle`
- Registry hints: `none`
- Confidence: `high`

### shadcn Toggle

- Registry item: `shadcn/toggle`
- Origin kind: `shadcn`
- Docs URL: https://ui.shadcn.com/docs/components/toggle
- Local repo: `repos/ui`
- Pinned ref: `95471a0fb95b2b205e1850841e05d93f3fcae659`
- Source paths: `repos/ui/apps/v4/styles/base-nova/ui/toggle.tsx`
- Docs paths: `repos/ui/apps/v4/content/docs/components/base/toggle.mdx`, `repos/ui/apps/v4/content/docs/components/radix/toggle.mdx`
- Demo paths: `repos/ui/apps/v4/examples/base/toggle-demo.tsx`, `repos/ui/apps/v4/examples/base/toggle-disabled.tsx`, `repos/ui/apps/v4/examples/base/toggle-outline.tsx`, `repos/ui/apps/v4/examples/base/toggle-rtl.tsx`, `repos/ui/apps/v4/examples/base/toggle-sizes.tsx`, `repos/ui/apps/v4/examples/base/toggle-text.tsx`
- Test/spec paths: `none`
- Style variants: `repos/ui/apps/v4/styles/base-luma/ui/toggle.tsx`, `repos/ui/apps/v4/styles/base-lyra/ui/toggle.tsx`, `repos/ui/apps/v4/styles/base-maia/ui/toggle.tsx`, `repos/ui/apps/v4/styles/base-mira/ui/toggle.tsx`, `repos/ui/apps/v4/styles/base-nova/ui-rtl/toggle.tsx`, `repos/ui/apps/v4/styles/base-nova/ui/toggle.tsx`, `repos/ui/apps/v4/styles/base-rhea/ui/toggle.tsx`, `repos/ui/apps/v4/styles/base-sera/ui/toggle.tsx`, `repos/ui/apps/v4/styles/base-vega/ui/toggle.tsx`
- Runtime hints: `@/components/language-selector`, `@base-ui/react/toggle`, `class-variance-authority`, `lucide-react`, `react`
- Registry hints: `base-ui/toggle`, `utils/cn`
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
- `@base-ui-components/react/toggle`: `replace-with-foldkit` -> `defer` (Replace the upstream React primitive with the local Foldkit registry implementation.)
- `@base-ui/react/toggle`: `replace-with-foldkit` -> `base-ui/toggle` (Replace the upstream React primitive with the local Foldkit registry implementation.)
- `base-ui/toggle`: `registry-local` -> `base-ui/toggle` (The styled shadcn item composes this local Base UI primitive.)
- `class-variance-authority`: `reject-or-defer` -> `defer` (Replace CVA with Effect Schema literals and pure variant class maps.)
- `lucide-react`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `react`: `dev-or-fixture-only` -> `defer` (React is origin fixture evidence only, not installable Foldkit source.)
- `utils/cn`: `registry-local` -> `utils/cn` (Local shadcn class canonicalization and Tailwind conflict handling.)

## Origin Test Classification

- `repos/base-ui/packages/react/src/toggle/Toggle.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)

## Future Improve Plan Shape

1. Create these registry items as dossier-backed implementation slices: `base-ui/toggle`, `shadcn/toggle`.
2. Add semantic Story and Scene tests for the Foldkit messages, state, accessibility, and view behavior each item owns.
3. Add local origin and Foldkit parity fixtures for each registry item.
4. Replace upstream React, Radix, Base UI React, and CVA dependencies with local Foldkit and Effect-native implementations.
5. Add theme token coverage and class canonicalization parity for shadcn items.
6. Run `bun run registry:check`, `bun run parity:check -- --grep <component> --dry-run`, `bun run test`, `bun run typecheck`, `bun run check`, and `bun run build`.
