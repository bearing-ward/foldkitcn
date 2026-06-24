# base-ui/separator + shadcn/separator Dossier Preview

## Batch

- `base-ui/separator`
- `shadcn/separator`

This dossier does not implement registry source. It prepares a future improve plan for the local Foldkit registry.

## Origin Evidence

### Base UI Separator

- Registry item: `base-ui/separator`
- Origin kind: `base-ui`
- Docs URL: https://base-ui.com/react/components/separator
- Local repo: `repos/base-ui`
- Pinned ref: `ea3818dec91923d4287b38be21322d2e5068d347`
- Source paths: `repos/base-ui/packages/react/src/separator/index.ts`, `repos/base-ui/packages/react/src/separator/Separator.tsx`, `repos/base-ui/packages/react/src/separator/SeparatorDataAttributes.ts`
- Docs paths: `repos/base-ui/docs/src/app/(docs)/react/components/separator/page.mdx`, `repos/base-ui/docs/src/app/(docs)/react/components/separator/types.md`, `repos/base-ui/docs/src/app/(docs)/react/components/separator/types.ts`
- Demo paths: `repos/base-ui/docs/src/app/(docs)/react/components/separator/demos/hero/css-modules/index.module.css`, `repos/base-ui/docs/src/app/(docs)/react/components/separator/demos/hero/css-modules/index.tsx`, `repos/base-ui/docs/src/app/(docs)/react/components/separator/demos/hero/index.ts`, `repos/base-ui/docs/src/app/(docs)/react/components/separator/demos/hero/tailwind/index.tsx`
- Test/spec paths: `repos/base-ui/packages/react/src/separator/Separator.test.tsx`
- Style variants: `none`
- Runtime hints: `@base-ui-components/react/separator`
- Registry hints: `none`
- Confidence: `high`

### shadcn Separator

- Registry item: `shadcn/separator`
- Origin kind: `shadcn`
- Docs URL: https://ui.shadcn.com/docs/components/separator
- Local repo: `repos/ui`
- Pinned ref: `95471a0fb95b2b205e1850841e05d93f3fcae659`
- Source paths: `repos/ui/apps/v4/styles/base-nova/ui/separator.tsx`
- Docs paths: `repos/ui/apps/v4/content/docs/components/base/separator.mdx`, `repos/ui/apps/v4/content/docs/components/radix/separator.mdx`
- Demo paths: `repos/ui/apps/v4/examples/base/separator-demo.tsx`, `repos/ui/apps/v4/examples/base/separator-list.tsx`, `repos/ui/apps/v4/examples/base/separator-menu.tsx`, `repos/ui/apps/v4/examples/base/separator-rtl.tsx`, `repos/ui/apps/v4/examples/base/separator-vertical.tsx`
- Test/spec paths: `none`
- Style variants: `repos/ui/apps/v4/styles/base-luma/ui/separator.tsx`, `repos/ui/apps/v4/styles/base-lyra/ui/separator.tsx`, `repos/ui/apps/v4/styles/base-maia/ui/separator.tsx`, `repos/ui/apps/v4/styles/base-mira/ui/separator.tsx`, `repos/ui/apps/v4/styles/base-nova/ui-rtl/separator.tsx`, `repos/ui/apps/v4/styles/base-nova/ui/separator.tsx`, `repos/ui/apps/v4/styles/base-rhea/ui/separator.tsx`, `repos/ui/apps/v4/styles/base-sera/ui/separator.tsx`, `repos/ui/apps/v4/styles/base-vega/ui/separator.tsx`
- Runtime hints: `@/components/language-selector`, `@base-ui/react/separator`, `react`
- Registry hints: `base-ui/separator`, `utils/cn`
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
- `@base-ui-components/react/separator`: `replace-with-foldkit` -> `defer` (Replace the upstream React primitive with the local Foldkit registry implementation.)
- `@base-ui/react/separator`: `replace-with-foldkit` -> `base-ui/separator` (Replace the upstream React primitive with the local Foldkit registry implementation.)
- `base-ui/separator`: `registry-local` -> `base-ui/separator` (The styled shadcn item composes this local Base UI primitive.)
- `react`: `dev-or-fixture-only` -> `defer` (React is origin fixture evidence only, not installable Foldkit source.)
- `utils/cn`: `registry-local` -> `utils/cn` (Local shadcn class canonicalization and Tailwind conflict handling.)

## Origin Test Classification

- `repos/base-ui/packages/react/src/separator/Separator.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)

## Future Improve Plan Shape

1. Create these registry items as dossier-backed implementation slices: `base-ui/separator`, `shadcn/separator`.
2. Add semantic Story and Scene tests for the Foldkit messages, state, accessibility, and view behavior each item owns.
3. Add local origin and Foldkit parity fixtures for each registry item.
4. Replace upstream React, Radix, Base UI React, and CVA dependencies with local Foldkit and Effect-native implementations.
5. Add theme token coverage and class canonicalization parity for shadcn items.
6. Run `bun run registry:check`, `bun run parity:check -- --grep <component> --dry-run`, `bun run test`, `bun run typecheck`, `bun run check`, and `bun run build`.
