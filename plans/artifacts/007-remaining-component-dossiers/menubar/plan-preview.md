# base-ui/menubar + shadcn/menubar Dossier Preview

## Batch

- `base-ui/menubar`
- `shadcn/menubar`

This dossier does not implement registry source. It prepares a future improve plan for the local Foldkit registry.

## Origin Evidence

### Base UI Menubar

- Registry item: `base-ui/menubar`
- Origin kind: `base-ui`
- Docs URL: https://base-ui.com/react/components/menubar
- Local repo: `repos/base-ui`
- Pinned ref: `ea3818dec91923d4287b38be21322d2e5068d347`
- Source paths: `repos/base-ui/packages/react/src/menubar/index.ts`, `repos/base-ui/packages/react/src/menubar/Menubar.tsx`, `repos/base-ui/packages/react/src/menubar/MenubarContext.ts`, `repos/base-ui/packages/react/src/menubar/MenubarDataAttributes.ts`
- Docs paths: `repos/base-ui/docs/src/app/(docs)/react/components/menubar/page.mdx`, `repos/base-ui/docs/src/app/(docs)/react/components/menubar/types.md`, `repos/base-ui/docs/src/app/(docs)/react/components/menubar/types.ts`
- Demo paths: `repos/base-ui/docs/src/app/(docs)/react/components/menubar/demos/hero/css-modules/index.module.css`, `repos/base-ui/docs/src/app/(docs)/react/components/menubar/demos/hero/css-modules/index.tsx`, `repos/base-ui/docs/src/app/(docs)/react/components/menubar/demos/hero/index.ts`, `repos/base-ui/docs/src/app/(docs)/react/components/menubar/demos/hero/tailwind/index.tsx`
- Test/spec paths: `repos/base-ui/packages/react/src/menubar/Menubar.test.tsx`
- Style variants: `none`
- Runtime hints: `@base-ui-components/react/menubar`
- Registry hints: `none`
- Confidence: `high`

### shadcn Menubar

- Registry item: `shadcn/menubar`
- Origin kind: `shadcn`
- Docs URL: https://ui.shadcn.com/docs/components/menubar
- Local repo: `repos/ui`
- Pinned ref: `95471a0fb95b2b205e1850841e05d93f3fcae659`
- Source paths: `repos/ui/apps/v4/styles/base-nova/ui/menubar.tsx`
- Docs paths: `repos/ui/apps/v4/content/docs/components/base/menubar.mdx`, `repos/ui/apps/v4/content/docs/components/radix/menubar.mdx`
- Demo paths: `repos/ui/apps/v4/examples/base/menubar-checkbox.tsx`, `repos/ui/apps/v4/examples/base/menubar-demo.tsx`, `repos/ui/apps/v4/examples/base/menubar-icons.tsx`, `repos/ui/apps/v4/examples/base/menubar-radio.tsx`, `repos/ui/apps/v4/examples/base/menubar-rtl.tsx`, `repos/ui/apps/v4/examples/base/menubar-submenu.tsx`
- Test/spec paths: `none`
- Style variants: `repos/ui/apps/v4/styles/base-luma/ui/menubar.tsx`, `repos/ui/apps/v4/styles/base-lyra/ui/menubar.tsx`, `repos/ui/apps/v4/styles/base-maia/ui/menubar.tsx`, `repos/ui/apps/v4/styles/base-mira/ui/menubar.tsx`, `repos/ui/apps/v4/styles/base-nova/ui-rtl/menubar.tsx`, `repos/ui/apps/v4/styles/base-nova/ui/menubar.tsx`, `repos/ui/apps/v4/styles/base-rhea/ui/menubar.tsx`, `repos/ui/apps/v4/styles/base-sera/ui/menubar.tsx`, `repos/ui/apps/v4/styles/base-vega/ui/menubar.tsx`
- Runtime hints: `@/components/language-selector`, `@base-ui/react/menu`, `@base-ui/react/menubar`, `lucide-react`, `react`
- Registry hints: `base-ui/menu`, `base-ui/menubar`, `shadcn/dropdown-menu`, `utils/cn`
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
- `@base-ui-components/react/menubar`: `replace-with-foldkit` -> `defer` (Replace the upstream React primitive with the local Foldkit registry implementation.)
- `@base-ui/react/menu`: `replace-with-foldkit` -> `base-ui/menu` (Replace the upstream React primitive with the local Foldkit registry implementation.)
- `@base-ui/react/menubar`: `replace-with-foldkit` -> `base-ui/menubar` (Replace the upstream React primitive with the local Foldkit registry implementation.)
- `base-ui/menu`: `registry-local` -> `base-ui/menu` (The styled shadcn item composes this local Base UI primitive.)
- `base-ui/menubar`: `registry-local` -> `base-ui/menubar` (The styled shadcn item composes this local Base UI primitive.)
- `lucide-react`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `react`: `dev-or-fixture-only` -> `defer` (React is origin fixture evidence only, not installable Foldkit source.)
- `shadcn/dropdown-menu`: `registry-local` -> `shadcn/dropdown-menu` (Origin examples compose this local shadcn registry item.)
- `utils/cn`: `registry-local` -> `utils/cn` (Local shadcn class canonicalization and Tailwind conflict handling.)

## Origin Test Classification

- `repos/base-ui/packages/react/src/menubar/Menubar.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)

## Future Improve Plan Shape

1. Create these registry items as dossier-backed implementation slices: `base-ui/menubar`, `shadcn/menubar`.
2. Add semantic Story and Scene tests for the Foldkit messages, state, accessibility, and view behavior each item owns.
3. Add local origin and Foldkit parity fixtures for each registry item.
4. Replace upstream React, Radix, Base UI React, and CVA dependencies with local Foldkit and Effect-native implementations.
5. Add theme token coverage and class canonicalization parity for shadcn items.
6. Run `bun run registry:check`, `bun run parity:check -- --grep <component> --dry-run`, `bun run test`, `bun run typecheck`, `bun run check`, and `bun run build`.
