# Button Dossier Preview

## Batch

- `base-ui/button`
- `shadcn/button`

This is a dependency-complete proving batch. It does not implement Button. It prepares the future improve plan for the local Foldkit registry.

## Origin Evidence

### Base UI Button

- Origin kind: `base-ui`
- Docs URL: https://base-ui.com/react/components/button
- Local repo: `repos/base-ui`
- Pinned ref: `ea3818dec91923d4287b38be21322d2e5068d347`
- Source paths: `repos/base-ui/packages/react/src/button/Button.tsx`, `repos/base-ui/packages/react/src/button/ButtonDataAttributes.tsx`, `repos/base-ui/packages/react/src/button/index.ts`, `repos/base-ui/packages/react/src/internals/use-button/useButton.ts`
- Docs paths: `repos/base-ui/docs/src/app/(docs)/react/components/button/page.mdx`, `repos/base-ui/docs/src/app/(docs)/react/components/button/types.md`, `repos/base-ui/docs/src/app/(docs)/react/components/button/types.ts`
- Demo paths: `repos/base-ui/docs/src/app/(docs)/react/components/button/demos/hero/tailwind/index.tsx`, `repos/base-ui/docs/src/app/(docs)/react/components/button/demos/loading/tailwind/index.tsx`, `repos/base-ui/docs/src/app/(docs)/react/components/button/demos/hero/css-modules/index.tsx`, `repos/base-ui/docs/src/app/(docs)/react/components/button/demos/loading/css-modules/index.tsx`
- Test/spec paths: `repos/base-ui/packages/react/src/button/Button.test.tsx`, `repos/base-ui/packages/react/src/button/Button.spec.tsx`
- Runtime hints: `@base-ui-components/react/button`
- Registry hints:
- Confidence: `high`

### shadcn Button

- Origin kind: `shadcn`
- Docs URL: https://ui.shadcn.com/docs/components/button
- Local repo: `repos/ui`
- Pinned ref: `95471a0fb95b2b205e1850841e05d93f3fcae659`
- Source paths: `repos/ui/apps/v4/styles/base-nova/ui/button.tsx`
- Docs paths: `repos/ui/apps/v4/content/docs/components/base/button.mdx`, `repos/ui/apps/v4/content/docs/components/radix/button.mdx`
- Demo paths: `repos/ui/apps/v4/examples/base/button-demo.tsx`, `repos/ui/apps/v4/examples/base/button-default.tsx`, `repos/ui/apps/v4/examples/base/button-destructive.tsx`, `repos/ui/apps/v4/examples/base/button-ghost.tsx`, `repos/ui/apps/v4/examples/base/button-outline.tsx`, `repos/ui/apps/v4/examples/base/button-render.tsx`, `repos/ui/apps/v4/examples/base/button-size.tsx`, `repos/ui/apps/v4/examples/base/button-spinner.tsx`, `repos/ui/apps/v4/examples/base/button-with-icon.tsx`
- Test/spec paths: `repos/ui/packages/tests/src/tests/add.test.ts`, `repos/ui/packages/tests/src/tests/view.test.ts`
- Runtime hints: `class-variance-authority`
- Registry hints: `base-ui/button`, `utils/cn`
- Confidence: `medium`

## Foldkit Mapping

- Preserve Base UI Button behavior as a Foldkit-native primitive with `Model`, `Message`, `init`, `update`, and `view` only if state is required; otherwise keep the Button surface as a stateless render helper.
- Map origin `render` and shadcn `asChild` support to Foldkit `toView` or named part-renderer composition.
- Preserve `focusableWhenDisabled`, `data-disabled`, keyboard behavior, and disabled click suppression.
- Use `cn` from `utils/cn` for class composition.
- Represent shadcn variants with Effect Schema literals and pure class maps.
- Record consumed theme tokens before marking `shadcn/button` installable.

## Dependencies

- `base-ui/button`: `registry-local` -> `base-ui/button` (shadcn/button composes the local Base UI Button primitive.)
- `utils/cn`: `registry-local` -> `utils/cn` (shadcn/button uses local class canonicalization and Tailwind conflict handling.)
- `class-variance-authority`: `reject-or-defer` -> `defer` (Replace CVA with Effect Schema literals and pure variant class maps.)

## Origin Test Classification

- `repos/base-ui/packages/react/src/button/Button.test.tsx`: `port-semantically` (Foldkit update/view tests should preserve disabled, focus, and click facts without React event internals.)
- `repos/base-ui/packages/react/src/button/Button.spec.tsx`: `covered-by-parity` (DOM attributes and browser behavior belong in parity fixtures.)
- `repos/ui/packages/tests/src/tests/add.test.ts`: `not-applicable` (shadcn CLI installation behavior is replaced by this registry workflow.)

## Future Improve Plan Shape

1. Create `base-ui/button` as the unstyled primitive dossier and implementation slice.
2. Add semantic Story/Scene tests for Button messages, disabled state, and focus behavior.
3. Add local origin and Foldkit parity fixtures for `base-ui/button`.
4. Create `shadcn/button` as a styled wrapper depending on `base-ui/button` and `utils/cn`.
5. Add theme token coverage and class canonicalization parity for `shadcn/button`.
6. Run `bun run registry:check`, `bun run parity:check -- --grep button --dry-run`, `bun run test`, `bun run typecheck`, `bun run check`, and `bun run build`.
