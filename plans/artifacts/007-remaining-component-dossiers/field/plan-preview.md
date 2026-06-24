# base-ui/field + shadcn/field Dossier Preview

## Batch

- `base-ui/field`
- `shadcn/field`

This dossier does not implement registry source. It prepares a future improve plan for the local Foldkit registry.

## Origin Evidence

### Base UI Field

- Registry item: `base-ui/field`
- Origin kind: `base-ui`
- Docs URL: https://base-ui.com/react/components/field
- Local repo: `repos/base-ui`
- Pinned ref: `ea3818dec91923d4287b38be21322d2e5068d347`
- Source paths: `repos/base-ui/packages/react/src/field/control/FieldControl.tsx`, `repos/base-ui/packages/react/src/field/control/FieldControlDataAttributes.ts`, `repos/base-ui/packages/react/src/field/description/FieldDescription.tsx`, `repos/base-ui/packages/react/src/field/description/FieldDescriptionDataAttributes.ts`, `repos/base-ui/packages/react/src/field/error/FieldError.tsx`, `repos/base-ui/packages/react/src/field/error/FieldErrorDataAttributes.ts`, `repos/base-ui/packages/react/src/field/index.parts.ts`, `repos/base-ui/packages/react/src/field/index.ts`, `repos/base-ui/packages/react/src/field/item/FieldItem.tsx`, `repos/base-ui/packages/react/src/field/item/FieldItemContext.ts`, `repos/base-ui/packages/react/src/field/item/FieldItemDataAttributes.ts`, `repos/base-ui/packages/react/src/field/label/FieldLabel.tsx`, `repos/base-ui/packages/react/src/field/label/FieldLabelDataAttributes.ts`, `repos/base-ui/packages/react/src/field/root/FieldRoot.tsx`, `repos/base-ui/packages/react/src/field/root/FieldRootDataAttributes.ts`, `repos/base-ui/packages/react/src/field/root/useFieldValidation.ts`, `repos/base-ui/packages/react/src/field/utils/getCombinedFieldValidityData.ts`, `repos/base-ui/packages/react/src/field/validity/FieldValidity.tsx`
- Docs paths: `repos/base-ui/docs/src/app/(docs)/react/components/field/page.mdx`, `repos/base-ui/docs/src/app/(docs)/react/components/field/types.md`, `repos/base-ui/docs/src/app/(docs)/react/components/field/types.ts`
- Demo paths: `repos/base-ui/docs/src/app/(docs)/react/components/field/demos/hero/css-modules/index.module.css`, `repos/base-ui/docs/src/app/(docs)/react/components/field/demos/hero/css-modules/index.tsx`, `repos/base-ui/docs/src/app/(docs)/react/components/field/demos/hero/index.ts`, `repos/base-ui/docs/src/app/(docs)/react/components/field/demos/hero/tailwind/index.tsx`
- Test/spec paths: `repos/base-ui/packages/react/src/field/control/FieldControl.test.tsx`, `repos/base-ui/packages/react/src/field/description/FieldDescription.test.tsx`, `repos/base-ui/packages/react/src/field/error/FieldError.test.tsx`, `repos/base-ui/packages/react/src/field/item/FieldItem.test.tsx`, `repos/base-ui/packages/react/src/field/label/FieldLabel.test.tsx`, `repos/base-ui/packages/react/src/field/root/FieldRoot.test.tsx`, `repos/base-ui/packages/react/src/field/validity/FieldValidity.test.tsx`, `repos/base-ui/packages/react/src/field/control/FieldControl.spec.tsx`
- Style variants: `none`
- Runtime hints: `@base-ui-components/react/field`
- Registry hints: `none`
- Confidence: `high`

### shadcn Field

- Registry item: `shadcn/field`
- Origin kind: `shadcn`
- Docs URL: https://ui.shadcn.com/docs/components/field
- Local repo: `repos/ui`
- Pinned ref: `95471a0fb95b2b205e1850841e05d93f3fcae659`
- Source paths: `repos/ui/apps/v4/styles/base-nova/ui/field.tsx`
- Docs paths: `repos/ui/apps/v4/content/docs/components/base/field.mdx`, `repos/ui/apps/v4/content/docs/components/radix/field.mdx`
- Demo paths: `repos/ui/apps/v4/examples/base/field-checkbox.tsx`, `repos/ui/apps/v4/examples/base/field-choice-card.tsx`, `repos/ui/apps/v4/examples/base/field-demo.tsx`, `repos/ui/apps/v4/examples/base/field-fieldset.tsx`, `repos/ui/apps/v4/examples/base/field-group.tsx`, `repos/ui/apps/v4/examples/base/field-input.tsx`, `repos/ui/apps/v4/examples/base/field-radio.tsx`, `repos/ui/apps/v4/examples/base/field-responsive.tsx`, `repos/ui/apps/v4/examples/base/field-rtl.tsx`, `repos/ui/apps/v4/examples/base/field-select.tsx`, `repos/ui/apps/v4/examples/base/field-slider.tsx`, `repos/ui/apps/v4/examples/base/field-switch.tsx`, `repos/ui/apps/v4/examples/base/field-textarea.tsx`
- Test/spec paths: `none`
- Style variants: `repos/ui/apps/v4/styles/base-luma/ui/field.tsx`, `repos/ui/apps/v4/styles/base-lyra/ui/field.tsx`, `repos/ui/apps/v4/styles/base-maia/ui/field.tsx`, `repos/ui/apps/v4/styles/base-mira/ui/field.tsx`, `repos/ui/apps/v4/styles/base-nova/ui-rtl/field.tsx`, `repos/ui/apps/v4/styles/base-nova/ui/field.tsx`, `repos/ui/apps/v4/styles/base-rhea/ui/field.tsx`, `repos/ui/apps/v4/styles/base-sera/ui/field.tsx`, `repos/ui/apps/v4/styles/base-vega/ui/field.tsx`
- Runtime hints: `@/components/language-selector`, `class-variance-authority`, `react`
- Registry hints: `shadcn/button`, `shadcn/checkbox`, `shadcn/input`, `shadcn/label`, `shadcn/radio-group`, `shadcn/select`, `shadcn/separator`, `shadcn/slider`, `shadcn/switch`, `shadcn/textarea`, `utils/cn`
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
- `@base-ui-components/react/field`: `replace-with-foldkit` -> `defer` (Replace the upstream React primitive with the local Foldkit registry implementation.)
- `class-variance-authority`: `reject-or-defer` -> `defer` (Replace CVA with Effect Schema literals and pure variant class maps.)
- `react`: `dev-or-fixture-only` -> `defer` (React is origin fixture evidence only, not installable Foldkit source.)
- `shadcn/button`: `registry-local` -> `shadcn/button` (Origin examples compose this local shadcn registry item.)
- `shadcn/checkbox`: `registry-local` -> `shadcn/checkbox` (Origin examples compose this local shadcn registry item.)
- `shadcn/input`: `registry-local` -> `shadcn/input` (Origin examples compose this local shadcn registry item.)
- `shadcn/label`: `registry-local` -> `shadcn/label` (Origin examples compose this local shadcn registry item.)
- `shadcn/radio-group`: `registry-local` -> `shadcn/radio-group` (Origin examples compose this local shadcn registry item.)
- `shadcn/select`: `registry-local` -> `shadcn/select` (Origin examples compose this local shadcn registry item.)
- `shadcn/separator`: `registry-local` -> `shadcn/separator` (Origin examples compose this local shadcn registry item.)
- `shadcn/slider`: `registry-local` -> `shadcn/slider` (Origin examples compose this local shadcn registry item.)
- `shadcn/switch`: `registry-local` -> `shadcn/switch` (Origin examples compose this local shadcn registry item.)
- `shadcn/textarea`: `registry-local` -> `shadcn/textarea` (Origin examples compose this local shadcn registry item.)
- `utils/cn`: `registry-local` -> `utils/cn` (Local shadcn class canonicalization and Tailwind conflict handling.)

## Origin Test Classification

- `repos/base-ui/packages/react/src/field/control/FieldControl.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/field/description/FieldDescription.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/field/error/FieldError.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/field/item/FieldItem.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/field/label/FieldLabel.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/field/root/FieldRoot.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/field/validity/FieldValidity.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/field/control/FieldControl.spec.tsx`: `covered-by-parity` (DOM attributes and browser behavior belong in origin parity fixtures.)

## Future Improve Plan Shape

1. Create these registry items as dossier-backed implementation slices: `base-ui/field`, `shadcn/field`.
2. Add semantic Story and Scene tests for the Foldkit messages, state, accessibility, and view behavior each item owns.
3. Add local origin and Foldkit parity fixtures for each registry item.
4. Replace upstream React, Radix, Base UI React, and CVA dependencies with local Foldkit and Effect-native implementations.
5. Add theme token coverage and class canonicalization parity for shadcn items.
6. Run `bun run registry:check`, `bun run parity:check -- --grep <component> --dry-run`, `bun run test`, `bun run typecheck`, `bun run check`, and `bun run build`.
