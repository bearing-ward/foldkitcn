# base-ui/tabs + shadcn/tabs Dossier Preview

## Batch

- `base-ui/tabs`
- `shadcn/tabs`

This dossier does not implement registry source. It prepares a future improve plan for the local Foldkit registry.

## Origin Evidence

### Base UI Tabs

- Registry item: `base-ui/tabs`
- Origin kind: `base-ui`
- Docs URL: https://base-ui.com/react/components/tabs
- Local repo: `repos/base-ui`
- Pinned ref: `ea3818dec91923d4287b38be21322d2e5068d347`
- Source paths: `repos/base-ui/packages/react/src/tabs/index.parts.ts`, `repos/base-ui/packages/react/src/tabs/index.ts`, `repos/base-ui/packages/react/src/tabs/indicator/prehydrationScript.min.ts`, `repos/base-ui/packages/react/src/tabs/indicator/prehydrationScript.template.js`, `repos/base-ui/packages/react/src/tabs/indicator/TabsIndicator.tsx`, `repos/base-ui/packages/react/src/tabs/indicator/TabsIndicatorCssVars.ts`, `repos/base-ui/packages/react/src/tabs/indicator/TabsIndicatorDataAttributes.ts`, `repos/base-ui/packages/react/src/tabs/list/TabsList.tsx`, `repos/base-ui/packages/react/src/tabs/list/TabsListContext.ts`, `repos/base-ui/packages/react/src/tabs/list/TabsListDataAttributes.ts`, `repos/base-ui/packages/react/src/tabs/panel/TabsPanel.tsx`, `repos/base-ui/packages/react/src/tabs/panel/TabsPanelDataAttributes.ts`, `repos/base-ui/packages/react/src/tabs/root/stateAttributesMapping.ts`, `repos/base-ui/packages/react/src/tabs/root/TabsRoot.tsx`, `repos/base-ui/packages/react/src/tabs/root/TabsRootContext.ts`, `repos/base-ui/packages/react/src/tabs/root/TabsRootDataAttributes.ts`, `repos/base-ui/packages/react/src/tabs/tab/TabsTab.tsx`, `repos/base-ui/packages/react/src/tabs/tab/TabsTabDataAttributes.ts`
- Docs paths: `repos/base-ui/docs/src/app/(docs)/react/components/tabs/page.mdx`, `repos/base-ui/docs/src/app/(docs)/react/components/tabs/types.md`, `repos/base-ui/docs/src/app/(docs)/react/components/tabs/types.ts`
- Demo paths: `repos/base-ui/docs/src/app/(docs)/react/components/tabs/demos/hero/css-modules/index.module.css`, `repos/base-ui/docs/src/app/(docs)/react/components/tabs/demos/hero/css-modules/index.tsx`, `repos/base-ui/docs/src/app/(docs)/react/components/tabs/demos/hero/index.ts`, `repos/base-ui/docs/src/app/(docs)/react/components/tabs/demos/hero/tailwind/index.tsx`
- Test/spec paths: `repos/base-ui/packages/react/src/tabs/indicator/TabsIndicator.test.tsx`, `repos/base-ui/packages/react/src/tabs/list/TabsList.test.tsx`, `repos/base-ui/packages/react/src/tabs/panel/TabsPanel.test.tsx`, `repos/base-ui/packages/react/src/tabs/root/TabsRoot.test.tsx`, `repos/base-ui/packages/react/src/tabs/tab/TabsTab.test.tsx`
- Style variants: `none`
- Runtime hints: `@base-ui-components/react/tabs`
- Registry hints: `none`
- Confidence: `high`

### shadcn Tabs

- Registry item: `shadcn/tabs`
- Origin kind: `shadcn`
- Docs URL: https://ui.shadcn.com/docs/components/tabs
- Local repo: `repos/ui`
- Pinned ref: `95471a0fb95b2b205e1850841e05d93f3fcae659`
- Source paths: `repos/ui/apps/v4/styles/base-nova/ui/tabs.tsx`
- Docs paths: `repos/ui/apps/v4/content/docs/components/base/tabs.mdx`, `repos/ui/apps/v4/content/docs/components/radix/tabs.mdx`
- Demo paths: `repos/ui/apps/v4/examples/base/tabs-demo.tsx`, `repos/ui/apps/v4/examples/base/tabs-disabled.tsx`, `repos/ui/apps/v4/examples/base/tabs-icons.tsx`, `repos/ui/apps/v4/examples/base/tabs-line.tsx`, `repos/ui/apps/v4/examples/base/tabs-rtl.tsx`, `repos/ui/apps/v4/examples/base/tabs-vertical.tsx`
- Test/spec paths: `none`
- Style variants: `repos/ui/apps/v4/styles/base-luma/ui/tabs.tsx`, `repos/ui/apps/v4/styles/base-lyra/ui/tabs.tsx`, `repos/ui/apps/v4/styles/base-maia/ui/tabs.tsx`, `repos/ui/apps/v4/styles/base-mira/ui/tabs.tsx`, `repos/ui/apps/v4/styles/base-nova/ui-rtl/tabs.tsx`, `repos/ui/apps/v4/styles/base-nova/ui/tabs.tsx`, `repos/ui/apps/v4/styles/base-rhea/ui/tabs.tsx`, `repos/ui/apps/v4/styles/base-sera/ui/tabs.tsx`, `repos/ui/apps/v4/styles/base-vega/ui/tabs.tsx`
- Runtime hints: `@/components/language-selector`, `@base-ui/react/tabs`, `class-variance-authority`, `lucide-react`, `react`
- Registry hints: `base-ui/tabs`, `shadcn/card`, `utils/cn`
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
- `@base-ui-components/react/tabs`: `replace-with-foldkit` -> `defer` (Replace the upstream React primitive with the local Foldkit registry implementation.)
- `@base-ui/react/tabs`: `replace-with-foldkit` -> `base-ui/tabs` (Replace the upstream React primitive with the local Foldkit registry implementation.)
- `base-ui/tabs`: `registry-local` -> `base-ui/tabs` (The styled shadcn item composes this local Base UI primitive.)
- `class-variance-authority`: `reject-or-defer` -> `defer` (Replace CVA with Effect Schema literals and pure variant class maps.)
- `lucide-react`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `react`: `dev-or-fixture-only` -> `defer` (React is origin fixture evidence only, not installable Foldkit source.)
- `shadcn/card`: `registry-local` -> `shadcn/card` (Origin examples compose this local shadcn registry item.)
- `utils/cn`: `registry-local` -> `utils/cn` (Local shadcn class canonicalization and Tailwind conflict handling.)

## Origin Test Classification

- `repos/base-ui/packages/react/src/tabs/indicator/TabsIndicator.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/tabs/list/TabsList.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/tabs/panel/TabsPanel.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/tabs/root/TabsRoot.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/tabs/tab/TabsTab.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)

## Future Improve Plan Shape

1. Create these registry items as dossier-backed implementation slices: `base-ui/tabs`, `shadcn/tabs`.
2. Add semantic Story and Scene tests for the Foldkit messages, state, accessibility, and view behavior each item owns.
3. Add local origin and Foldkit parity fixtures for each registry item.
4. Replace upstream React, Radix, Base UI React, and CVA dependencies with local Foldkit and Effect-native implementations.
5. Add theme token coverage and class canonicalization parity for shadcn items.
6. Run `bun run registry:check`, `bun run parity:check -- --grep <component> --dry-run`, `bun run test`, `bun run typecheck`, `bun run check`, and `bun run build`.
