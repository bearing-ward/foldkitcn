# base-ui/accordion + shadcn/accordion Dossier Preview

## Batch

- `base-ui/accordion`
- `shadcn/accordion`

This dossier does not implement registry source. It prepares a future improve plan for the local Foldkit registry.

## Origin Evidence

### Base UI Accordion

- Registry item: `base-ui/accordion`
- Origin kind: `base-ui`
- Docs URL: https://base-ui.com/react/components/accordion
- Local repo: `repos/base-ui`
- Pinned ref: `ea3818dec91923d4287b38be21322d2e5068d347`
- Source paths: `repos/base-ui/packages/react/src/accordion/header/AccordionHeader.tsx`, `repos/base-ui/packages/react/src/accordion/header/AccordionHeaderDataAttributes.ts`, `repos/base-ui/packages/react/src/accordion/index.parts.ts`, `repos/base-ui/packages/react/src/accordion/index.ts`, `repos/base-ui/packages/react/src/accordion/item/AccordionItem.tsx`, `repos/base-ui/packages/react/src/accordion/item/AccordionItemContext.ts`, `repos/base-ui/packages/react/src/accordion/item/AccordionItemDataAttributes.ts`, `repos/base-ui/packages/react/src/accordion/item/stateAttributesMapping.ts`, `repos/base-ui/packages/react/src/accordion/panel/AccordionPanel.tsx`, `repos/base-ui/packages/react/src/accordion/panel/AccordionPanelCssVars.ts`, `repos/base-ui/packages/react/src/accordion/panel/AccordionPanelDataAttributes.ts`, `repos/base-ui/packages/react/src/accordion/root/AccordionRoot.tsx`, `repos/base-ui/packages/react/src/accordion/root/AccordionRootContext.ts`, `repos/base-ui/packages/react/src/accordion/root/AccordionRootDataAttributes.ts`, `repos/base-ui/packages/react/src/accordion/trigger/AccordionTrigger.tsx`, `repos/base-ui/packages/react/src/accordion/trigger/AccordionTriggerDataAttributes.ts`
- Docs paths: `repos/base-ui/docs/src/app/(docs)/react/components/accordion/page.mdx`, `repos/base-ui/docs/src/app/(docs)/react/components/accordion/types.md`, `repos/base-ui/docs/src/app/(docs)/react/components/accordion/types.ts`
- Demo paths: `repos/base-ui/docs/src/app/(docs)/react/components/accordion/demos/_index.module.css`, `repos/base-ui/docs/src/app/(docs)/react/components/accordion/demos/hero/css-modules/index.tsx`, `repos/base-ui/docs/src/app/(docs)/react/components/accordion/demos/hero/index.ts`, `repos/base-ui/docs/src/app/(docs)/react/components/accordion/demos/hero/tailwind/index.tsx`, `repos/base-ui/docs/src/app/(docs)/react/components/accordion/demos/multiple/css-modules/index.tsx`, `repos/base-ui/docs/src/app/(docs)/react/components/accordion/demos/multiple/index.ts`, `repos/base-ui/docs/src/app/(docs)/react/components/accordion/demos/multiple/tailwind/index.tsx`
- Test/spec paths: `repos/base-ui/packages/react/src/accordion/header/AccordionHeader.test.tsx`, `repos/base-ui/packages/react/src/accordion/item/AccordionItem.test.tsx`, `repos/base-ui/packages/react/src/accordion/panel/AccordionPanel.test.tsx`, `repos/base-ui/packages/react/src/accordion/root/AccordionRoot.test.tsx`, `repos/base-ui/packages/react/src/accordion/trigger/AccordionTrigger.test.tsx`, `repos/base-ui/packages/react/src/accordion/root/AccordionRoot.spec.tsx`
- Style variants: `none`
- Runtime hints: `@base-ui-components/react/accordion`
- Registry hints: `none`
- Confidence: `high`

### shadcn Accordion

- Registry item: `shadcn/accordion`
- Origin kind: `shadcn`
- Docs URL: https://ui.shadcn.com/docs/components/accordion
- Local repo: `repos/ui`
- Pinned ref: `95471a0fb95b2b205e1850841e05d93f3fcae659`
- Source paths: `repos/ui/apps/v4/styles/base-nova/ui/accordion.tsx`
- Docs paths: `repos/ui/apps/v4/content/docs/components/base/accordion.mdx`, `repos/ui/apps/v4/content/docs/components/radix/accordion.mdx`
- Demo paths: `repos/ui/apps/v4/examples/base/accordion-basic.tsx`, `repos/ui/apps/v4/examples/base/accordion-borders.tsx`, `repos/ui/apps/v4/examples/base/accordion-card.tsx`, `repos/ui/apps/v4/examples/base/accordion-demo.tsx`, `repos/ui/apps/v4/examples/base/accordion-disabled.tsx`, `repos/ui/apps/v4/examples/base/accordion-multiple.tsx`, `repos/ui/apps/v4/examples/base/accordion-rtl.tsx`
- Test/spec paths: `none`
- Style variants: `repos/ui/apps/v4/styles/base-luma/ui/accordion.tsx`, `repos/ui/apps/v4/styles/base-lyra/ui/accordion.tsx`, `repos/ui/apps/v4/styles/base-maia/ui/accordion.tsx`, `repos/ui/apps/v4/styles/base-mira/ui/accordion.tsx`, `repos/ui/apps/v4/styles/base-nova/ui-rtl/accordion.tsx`, `repos/ui/apps/v4/styles/base-nova/ui/accordion.tsx`, `repos/ui/apps/v4/styles/base-rhea/ui/accordion.tsx`, `repos/ui/apps/v4/styles/base-sera/ui/accordion.tsx`, `repos/ui/apps/v4/styles/base-vega/ui/accordion.tsx`
- Runtime hints: `@/components/language-selector`, `@base-ui/react/accordion`, `lucide-react`, `react`
- Registry hints: `base-ui/accordion`, `shadcn/card`, `utils/cn`
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
- `@base-ui-components/react/accordion`: `replace-with-foldkit` -> `defer` (Replace the upstream React primitive with the local Foldkit registry implementation.)
- `@base-ui/react/accordion`: `replace-with-foldkit` -> `base-ui/accordion` (Replace the upstream React primitive with the local Foldkit registry implementation.)
- `base-ui/accordion`: `registry-local` -> `base-ui/accordion` (The styled shadcn item composes this local Base UI primitive.)
- `lucide-react`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `react`: `dev-or-fixture-only` -> `defer` (React is origin fixture evidence only, not installable Foldkit source.)
- `shadcn/card`: `registry-local` -> `shadcn/card` (Origin examples compose this local shadcn registry item.)
- `utils/cn`: `registry-local` -> `utils/cn` (Local shadcn class canonicalization and Tailwind conflict handling.)

## Origin Test Classification

- `repos/base-ui/packages/react/src/accordion/header/AccordionHeader.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/accordion/item/AccordionItem.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/accordion/panel/AccordionPanel.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/accordion/root/AccordionRoot.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/accordion/trigger/AccordionTrigger.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/accordion/root/AccordionRoot.spec.tsx`: `covered-by-parity` (DOM attributes and browser behavior belong in origin parity fixtures.)

## Future Improve Plan Shape

1. Create these registry items as dossier-backed implementation slices: `base-ui/accordion`, `shadcn/accordion`.
2. Add semantic Story and Scene tests for the Foldkit messages, state, accessibility, and view behavior each item owns.
3. Add local origin and Foldkit parity fixtures for each registry item.
4. Replace upstream React, Radix, Base UI React, and CVA dependencies with local Foldkit and Effect-native implementations.
5. Add theme token coverage and class canonicalization parity for shadcn items.
6. Run `bun run registry:check`, `bun run parity:check -- --grep <component> --dry-run`, `bun run test`, `bun run typecheck`, `bun run check`, and `bun run build`.
