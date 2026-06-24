# base-ui/collapsible + shadcn/collapsible Dossier Preview

## Batch

- `base-ui/collapsible`
- `shadcn/collapsible`

This dossier does not implement registry source. It prepares a future improve plan for the local Foldkit registry.

## Origin Evidence

### Base UI Collapsible

- Registry item: `base-ui/collapsible`
- Origin kind: `base-ui`
- Docs URL: https://base-ui.com/react/components/collapsible
- Local repo: `repos/base-ui`
- Pinned ref: `ea3818dec91923d4287b38be21322d2e5068d347`
- Source paths: `repos/base-ui/packages/react/src/collapsible/index.parts.ts`, `repos/base-ui/packages/react/src/collapsible/index.ts`, `repos/base-ui/packages/react/src/collapsible/panel/CollapsiblePanel.tsx`, `repos/base-ui/packages/react/src/collapsible/panel/CollapsiblePanelCssVars.ts`, `repos/base-ui/packages/react/src/collapsible/panel/CollapsiblePanelDataAttributes.ts`, `repos/base-ui/packages/react/src/collapsible/panel/useCollapsiblePanel.ts`, `repos/base-ui/packages/react/src/collapsible/root/CollapsibleRoot.tsx`, `repos/base-ui/packages/react/src/collapsible/root/CollapsibleRootContext.ts`, `repos/base-ui/packages/react/src/collapsible/root/CollapsibleRootDataAttributes.ts`, `repos/base-ui/packages/react/src/collapsible/root/stateAttributesMapping.ts`, `repos/base-ui/packages/react/src/collapsible/root/useCollapsibleRoot.ts`, `repos/base-ui/packages/react/src/collapsible/trigger/CollapsibleTrigger.tsx`, `repos/base-ui/packages/react/src/collapsible/trigger/CollapsibleTriggerDataAttributes.ts`
- Docs paths: `repos/base-ui/docs/src/app/(docs)/react/components/collapsible/page.mdx`, `repos/base-ui/docs/src/app/(docs)/react/components/collapsible/types.md`, `repos/base-ui/docs/src/app/(docs)/react/components/collapsible/types.ts`
- Demo paths: `repos/base-ui/docs/src/app/(docs)/react/components/collapsible/demos/hero/css-modules/index.module.css`, `repos/base-ui/docs/src/app/(docs)/react/components/collapsible/demos/hero/css-modules/index.tsx`, `repos/base-ui/docs/src/app/(docs)/react/components/collapsible/demos/hero/index.ts`, `repos/base-ui/docs/src/app/(docs)/react/components/collapsible/demos/hero/tailwind/index.tsx`
- Test/spec paths: `repos/base-ui/packages/react/src/collapsible/panel/CollapsiblePanel.test.tsx`, `repos/base-ui/packages/react/src/collapsible/root/CollapsibleRoot.test.tsx`, `repos/base-ui/packages/react/src/collapsible/trigger/CollapsibleTrigger.test.tsx`, `repos/base-ui/packages/react/src/collapsible/root/CollapsibleRoot.spec.tsx`
- Style variants: `none`
- Runtime hints: `@base-ui-components/react/collapsible`
- Registry hints: `none`
- Confidence: `high`

### shadcn Collapsible

- Registry item: `shadcn/collapsible`
- Origin kind: `shadcn`
- Docs URL: https://ui.shadcn.com/docs/components/collapsible
- Local repo: `repos/ui`
- Pinned ref: `95471a0fb95b2b205e1850841e05d93f3fcae659`
- Source paths: `repos/ui/apps/v4/styles/base-nova/ui/collapsible.tsx`
- Docs paths: `repos/ui/apps/v4/content/docs/components/base/collapsible.mdx`, `repos/ui/apps/v4/content/docs/components/radix/collapsible.mdx`
- Demo paths: `repos/ui/apps/v4/examples/base/collapsible-basic.tsx`, `repos/ui/apps/v4/examples/base/collapsible-demo.tsx`, `repos/ui/apps/v4/examples/base/collapsible-file-tree.tsx`, `repos/ui/apps/v4/examples/base/collapsible-rtl.tsx`, `repos/ui/apps/v4/examples/base/collapsible-settings.tsx`
- Test/spec paths: `none`
- Style variants: `repos/ui/apps/v4/styles/base-luma/ui/collapsible.tsx`, `repos/ui/apps/v4/styles/base-lyra/ui/collapsible.tsx`, `repos/ui/apps/v4/styles/base-maia/ui/collapsible.tsx`, `repos/ui/apps/v4/styles/base-mira/ui/collapsible.tsx`, `repos/ui/apps/v4/styles/base-nova/ui-rtl/collapsible.tsx`, `repos/ui/apps/v4/styles/base-nova/ui/collapsible.tsx`, `repos/ui/apps/v4/styles/base-rhea/ui/collapsible.tsx`, `repos/ui/apps/v4/styles/base-sera/ui/collapsible.tsx`, `repos/ui/apps/v4/styles/base-vega/ui/collapsible.tsx`
- Runtime hints: `@/components/language-selector`, `@/registry/icons/__lucide__`, `@base-ui/react/collapsible`, `lucide-react`, `react`
- Registry hints: `base-ui/collapsible`, `shadcn/button`, `shadcn/card`, `shadcn/field`, `shadcn/input`, `shadcn/tabs`
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
- `@/registry/icons/__lucide__`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `@base-ui-components/react/collapsible`: `replace-with-foldkit` -> `defer` (Replace the upstream React primitive with the local Foldkit registry implementation.)
- `@base-ui/react/collapsible`: `replace-with-foldkit` -> `base-ui/collapsible` (Replace the upstream React primitive with the local Foldkit registry implementation.)
- `base-ui/collapsible`: `registry-local` -> `base-ui/collapsible` (The styled shadcn item composes this local Base UI primitive.)
- `lucide-react`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `react`: `dev-or-fixture-only` -> `defer` (React is origin fixture evidence only, not installable Foldkit source.)
- `shadcn/button`: `registry-local` -> `shadcn/button` (Origin examples compose this local shadcn registry item.)
- `shadcn/card`: `registry-local` -> `shadcn/card` (Origin examples compose this local shadcn registry item.)
- `shadcn/field`: `registry-local` -> `shadcn/field` (Origin examples compose this local shadcn registry item.)
- `shadcn/input`: `registry-local` -> `shadcn/input` (Origin examples compose this local shadcn registry item.)
- `shadcn/tabs`: `registry-local` -> `shadcn/tabs` (Origin examples compose this local shadcn registry item.)

## Origin Test Classification

- `repos/base-ui/packages/react/src/collapsible/panel/CollapsiblePanel.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/collapsible/root/CollapsibleRoot.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/collapsible/trigger/CollapsibleTrigger.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/collapsible/root/CollapsibleRoot.spec.tsx`: `covered-by-parity` (DOM attributes and browser behavior belong in origin parity fixtures.)

## Future Improve Plan Shape

1. Create these registry items as dossier-backed implementation slices: `base-ui/collapsible`, `shadcn/collapsible`.
2. Add semantic Story and Scene tests for the Foldkit messages, state, accessibility, and view behavior each item owns.
3. Add local origin and Foldkit parity fixtures for each registry item.
4. Replace upstream React, Radix, Base UI React, and CVA dependencies with local Foldkit and Effect-native implementations.
5. Add theme token coverage and class canonicalization parity for shadcn items.
6. Run `bun run registry:check`, `bun run parity:check -- --grep <component> --dry-run`, `bun run test`, `bun run typecheck`, `bun run check`, and `bun run build`.
