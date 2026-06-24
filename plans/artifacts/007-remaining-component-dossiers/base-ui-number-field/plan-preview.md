# base-ui/number-field Dossier Preview

## Batch

- `base-ui/number-field`

This dossier does not implement registry source. It prepares a future improve plan for the local Foldkit registry.

## Origin Evidence

### Base UI Number Field

- Registry item: `base-ui/number-field`
- Origin kind: `base-ui`
- Docs URL: https://base-ui.com/react/components/number-field
- Local repo: `repos/base-ui`
- Pinned ref: `ea3818dec91923d4287b38be21322d2e5068d347`
- Source paths: `repos/base-ui/packages/react/src/number-field/decrement/NumberFieldDecrement.tsx`, `repos/base-ui/packages/react/src/number-field/decrement/NumberFieldDecrementDataAttributes.ts`, `repos/base-ui/packages/react/src/number-field/group/NumberFieldGroup.tsx`, `repos/base-ui/packages/react/src/number-field/group/NumberFieldGroupDataAttributes.ts`, `repos/base-ui/packages/react/src/number-field/increment/NumberFieldIncrement.tsx`, `repos/base-ui/packages/react/src/number-field/increment/NumberFieldIncrementDataAttributes.ts`, `repos/base-ui/packages/react/src/number-field/index.parts.ts`, `repos/base-ui/packages/react/src/number-field/index.ts`, `repos/base-ui/packages/react/src/number-field/input/NumberFieldInput.tsx`, `repos/base-ui/packages/react/src/number-field/input/NumberFieldInputDataAttributes.ts`, `repos/base-ui/packages/react/src/number-field/root/NumberFieldRoot.tsx`, `repos/base-ui/packages/react/src/number-field/root/NumberFieldRootContext.ts`, `repos/base-ui/packages/react/src/number-field/root/NumberFieldRootDataAttributes.ts`, `repos/base-ui/packages/react/src/number-field/root/useNumberFieldButton.ts`, `repos/base-ui/packages/react/src/number-field/root/useNumberFieldStepperButton.ts`, `repos/base-ui/packages/react/src/number-field/scrub-area-cursor/NumberFieldScrubAreaCursor.tsx`, `repos/base-ui/packages/react/src/number-field/scrub-area-cursor/NumberFieldScrubAreaCursorDataAttributes.ts`, `repos/base-ui/packages/react/src/number-field/scrub-area/NumberFieldScrubArea.tsx`, `repos/base-ui/packages/react/src/number-field/scrub-area/NumberFieldScrubAreaContext.ts`, `repos/base-ui/packages/react/src/number-field/scrub-area/NumberFieldScrubAreaDataAttributes.ts`, `repos/base-ui/packages/react/src/number-field/utils/constants.ts`, `repos/base-ui/packages/react/src/number-field/utils/getViewportRect.ts`, `repos/base-ui/packages/react/src/number-field/utils/parse.ts`, `repos/base-ui/packages/react/src/number-field/utils/stateAttributesMapping.ts`, `repos/base-ui/packages/react/src/number-field/utils/subscribeToVisualViewportResize.ts`, `repos/base-ui/packages/react/src/number-field/utils/types.ts`, `repos/base-ui/packages/react/src/number-field/utils/validate.ts`
- Docs paths: `repos/base-ui/docs/src/app/(docs)/react/components/number-field/page.mdx`, `repos/base-ui/docs/src/app/(docs)/react/components/number-field/types.md`, `repos/base-ui/docs/src/app/(docs)/react/components/number-field/types.ts`
- Demo paths: `repos/base-ui/docs/src/app/(docs)/react/components/number-field/demos/hero/css-modules/index.module.css`, `repos/base-ui/docs/src/app/(docs)/react/components/number-field/demos/hero/css-modules/index.tsx`, `repos/base-ui/docs/src/app/(docs)/react/components/number-field/demos/hero/index.ts`, `repos/base-ui/docs/src/app/(docs)/react/components/number-field/demos/hero/tailwind/index.tsx`
- Test/spec paths: `repos/base-ui/packages/react/src/number-field/decrement/NumberFieldDecrement.test.tsx`, `repos/base-ui/packages/react/src/number-field/group/NumberFieldGroup.test.tsx`, `repos/base-ui/packages/react/src/number-field/increment/NumberFieldIncrement.test.tsx`, `repos/base-ui/packages/react/src/number-field/input/NumberFieldInput.test.tsx`, `repos/base-ui/packages/react/src/number-field/root/NumberFieldRoot.test.tsx`, `repos/base-ui/packages/react/src/number-field/scrub-area-cursor/NumberFieldScrubAreaCursor.test.tsx`, `repos/base-ui/packages/react/src/number-field/scrub-area/NumberFieldScrubArea.test.tsx`, `repos/base-ui/packages/react/src/number-field/utils/parse.test.ts`, `repos/base-ui/packages/react/src/number-field/utils/validate.test.ts`, `repos/base-ui/packages/react/src/number-field/root/NumberFieldRoot.spec.tsx`
- Style variants: `none`
- Runtime hints: `@base-ui-components/react/number-field`
- Registry hints: `none`
- Confidence: `high`


## Foldkit Mapping

- Keep Base UI origins as unstyled Foldkit behavior primitives or stateless render helpers according to the local component shape.
- Keep shadcn origins as styled Foldkit wrappers or compositions over local primitives.
- Map origin `render` and shadcn `asChild` support to Foldkit `toView` or named part-renderer composition.
- Use `cn` from `utils/cn` when a shadcn source imports `@/lib/utils`.
- Represent style variants with Effect Schema literals and pure class maps.
- Record consumed theme tokens before marking any shadcn item installable.

## Dependencies

- `@base-ui-components/react/number-field`: `replace-with-foldkit` -> `defer` (Replace the upstream React primitive with the local Foldkit registry implementation.)

## Origin Test Classification

- `repos/base-ui/packages/react/src/number-field/decrement/NumberFieldDecrement.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/number-field/group/NumberFieldGroup.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/number-field/increment/NumberFieldIncrement.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/number-field/input/NumberFieldInput.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/number-field/root/NumberFieldRoot.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/number-field/scrub-area-cursor/NumberFieldScrubAreaCursor.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/number-field/scrub-area/NumberFieldScrubArea.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/number-field/utils/parse.test.ts`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/number-field/utils/validate.test.ts`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/number-field/root/NumberFieldRoot.spec.tsx`: `covered-by-parity` (DOM attributes and browser behavior belong in origin parity fixtures.)

## Future Improve Plan Shape

1. Create these registry items as dossier-backed implementation slices: `base-ui/number-field`.
2. Add semantic Story and Scene tests for the Foldkit messages, state, accessibility, and view behavior each item owns.
3. Add local origin and Foldkit parity fixtures for each registry item.
4. Replace upstream React, Radix, Base UI React, and CVA dependencies with local Foldkit and Effect-native implementations.
5. Add theme token coverage and class canonicalization parity for shadcn items.
6. Run `bun run registry:check`, `bun run parity:check -- --grep <component> --dry-run`, `bun run test`, `bun run typecheck`, `bun run check`, and `bun run build`.
