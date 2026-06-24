# base-ui/input + shadcn/input Dossier Preview

## Batch

- `base-ui/input`
- `shadcn/input`

This dossier does not implement registry source. It prepares a future improve plan for the local Foldkit registry.

## Origin Evidence

### Base UI Input

- Registry item: `base-ui/input`
- Origin kind: `base-ui`
- Docs URL: https://base-ui.com/react/components/input
- Local repo: `repos/base-ui`
- Pinned ref: `ea3818dec91923d4287b38be21322d2e5068d347`
- Source paths: `repos/base-ui/packages/react/src/input/index.ts`, `repos/base-ui/packages/react/src/input/Input.tsx`, `repos/base-ui/packages/react/src/input/InputDataAttributes.ts`
- Docs paths: `repos/base-ui/docs/src/app/(docs)/react/components/input/page.mdx`, `repos/base-ui/docs/src/app/(docs)/react/components/input/types.md`, `repos/base-ui/docs/src/app/(docs)/react/components/input/types.ts`
- Demo paths: `repos/base-ui/docs/src/app/(docs)/react/components/input/demos/hero/css-modules/index.module.css`, `repos/base-ui/docs/src/app/(docs)/react/components/input/demos/hero/css-modules/index.tsx`, `repos/base-ui/docs/src/app/(docs)/react/components/input/demos/hero/index.ts`, `repos/base-ui/docs/src/app/(docs)/react/components/input/demos/hero/tailwind/index.tsx`
- Test/spec paths: `repos/base-ui/packages/react/src/input/Input.test.tsx`, `repos/base-ui/packages/react/src/input/Input.spec.tsx`
- Style variants: `none`
- Runtime hints: `@base-ui-components/react/input`
- Registry hints: `none`
- Confidence: `high`

### shadcn Input

- Registry item: `shadcn/input`
- Origin kind: `shadcn`
- Docs URL: https://ui.shadcn.com/docs/components/input
- Local repo: `repos/ui`
- Pinned ref: `95471a0fb95b2b205e1850841e05d93f3fcae659`
- Source paths: `repos/ui/apps/v4/styles/base-nova/ui/input.tsx`
- Docs paths: `repos/ui/apps/v4/content/docs/components/base/input.mdx`, `repos/ui/apps/v4/content/docs/components/radix/input.mdx`
- Demo paths: `repos/ui/apps/v4/examples/base/input-badge.tsx`, `repos/ui/apps/v4/examples/base/input-basic.tsx`, `repos/ui/apps/v4/examples/base/input-button-group.tsx`, `repos/ui/apps/v4/examples/base/input-demo.tsx`, `repos/ui/apps/v4/examples/base/input-disabled.tsx`, `repos/ui/apps/v4/examples/base/input-field.tsx`, `repos/ui/apps/v4/examples/base/input-fieldgroup.tsx`, `repos/ui/apps/v4/examples/base/input-file.tsx`, `repos/ui/apps/v4/examples/base/input-form.tsx`, `repos/ui/apps/v4/examples/base/input-grid.tsx`, `repos/ui/apps/v4/examples/base/input-inline.tsx`, `repos/ui/apps/v4/examples/base/input-input-group.tsx`, `repos/ui/apps/v4/examples/base/input-invalid.tsx`, `repos/ui/apps/v4/examples/base/input-required.tsx`, `repos/ui/apps/v4/examples/base/input-rtl.tsx`
- Test/spec paths: `none`
- Style variants: `repos/ui/apps/v4/styles/base-luma/ui/input.tsx`, `repos/ui/apps/v4/styles/base-lyra/ui/input.tsx`, `repos/ui/apps/v4/styles/base-maia/ui/input.tsx`, `repos/ui/apps/v4/styles/base-mira/ui/input.tsx`, `repos/ui/apps/v4/styles/base-nova/ui-rtl/input.tsx`, `repos/ui/apps/v4/styles/base-nova/ui/input.tsx`, `repos/ui/apps/v4/styles/base-rhea/ui/input.tsx`, `repos/ui/apps/v4/styles/base-sera/ui/input.tsx`, `repos/ui/apps/v4/styles/base-vega/ui/input.tsx`
- Runtime hints: `@/components/language-selector`, `@base-ui/react/input`, `lucide-react`, `react`
- Registry hints: `base-ui/input`, `shadcn/badge`, `shadcn/button`, `shadcn/button-group`, `shadcn/field`, `shadcn/input-group`, `shadcn/select`, `utils/cn`
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
- `@base-ui-components/react/input`: `replace-with-foldkit` -> `defer` (Replace the upstream React primitive with the local Foldkit registry implementation.)
- `@base-ui/react/input`: `replace-with-foldkit` -> `base-ui/input` (Replace the upstream React primitive with the local Foldkit registry implementation.)
- `base-ui/input`: `registry-local` -> `base-ui/input` (The styled shadcn item composes this local Base UI primitive.)
- `lucide-react`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `react`: `dev-or-fixture-only` -> `defer` (React is origin fixture evidence only, not installable Foldkit source.)
- `shadcn/badge`: `registry-local` -> `shadcn/badge` (Origin examples compose this local shadcn registry item.)
- `shadcn/button`: `registry-local` -> `shadcn/button` (Origin examples compose this local shadcn registry item.)
- `shadcn/button-group`: `registry-local` -> `shadcn/button-group` (Origin examples compose this local shadcn registry item.)
- `shadcn/field`: `registry-local` -> `shadcn/field` (Origin examples compose this local shadcn registry item.)
- `shadcn/input-group`: `registry-local` -> `shadcn/input-group` (Origin examples compose this local shadcn registry item.)
- `shadcn/select`: `registry-local` -> `shadcn/select` (Origin examples compose this local shadcn registry item.)
- `utils/cn`: `registry-local` -> `utils/cn` (Local shadcn class canonicalization and Tailwind conflict handling.)

## Origin Test Classification

- `repos/base-ui/packages/react/src/input/Input.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/input/Input.spec.tsx`: `covered-by-parity` (DOM attributes and browser behavior belong in origin parity fixtures.)

## Future Improve Plan Shape

1. Create these registry items as dossier-backed implementation slices: `base-ui/input`, `shadcn/input`.
2. Add semantic Story and Scene tests for the Foldkit messages, state, accessibility, and view behavior each item owns.
3. Add local origin and Foldkit parity fixtures for each registry item.
4. Replace upstream React, Radix, Base UI React, and CVA dependencies with local Foldkit and Effect-native implementations.
5. Add theme token coverage and class canonicalization parity for shadcn items.
6. Run `bun run registry:check`, `bun run parity:check -- --grep <component> --dry-run`, `bun run test`, `bun run typecheck`, `bun run check`, and `bun run build`.
