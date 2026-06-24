# base-ui/radio-group + shadcn/radio-group Dossier Preview

## Batch

- `base-ui/radio-group`
- `shadcn/radio-group`

This dossier does not implement registry source. It prepares a future improve plan for the local Foldkit registry.

## Origin Evidence

### Base UI Radio Group

- Registry item: `base-ui/radio-group`
- Origin kind: `base-ui`
- Docs URL: https://base-ui.com/react/components/radio-group
- Local repo: `repos/base-ui`
- Pinned ref: `ea3818dec91923d4287b38be21322d2e5068d347`
- Source paths: `repos/base-ui/packages/react/src/radio-group/index.ts`, `repos/base-ui/packages/react/src/radio-group/RadioGroup.tsx`, `repos/base-ui/packages/react/src/radio-group/RadioGroupContext.ts`, `repos/base-ui/packages/react/src/radio-group/RadioGroupDataAttributes.ts`
- Docs paths: `repos/base-ui/docs/src/app/(docs)/react/components/radio-group/types.md`, `repos/base-ui/docs/src/app/(docs)/react/components/radio-group/types.ts`
- Demo paths: `none`
- Test/spec paths: `repos/base-ui/packages/react/src/radio-group/RadioGroup.test.tsx`, `repos/base-ui/packages/react/src/radio-group/RadioGroup.spec.tsx`
- Style variants: `none`
- Runtime hints: `@base-ui-components/react/radio-group`
- Registry hints: `none`
- Confidence: `high`

### shadcn Radio Group

- Registry item: `shadcn/radio-group`
- Origin kind: `shadcn`
- Docs URL: https://ui.shadcn.com/docs/components/radio-group
- Local repo: `repos/ui`
- Pinned ref: `95471a0fb95b2b205e1850841e05d93f3fcae659`
- Source paths: `repos/ui/apps/v4/styles/base-nova/ui/radio-group.tsx`
- Docs paths: `repos/ui/apps/v4/content/docs/components/base/radio-group.mdx`, `repos/ui/apps/v4/content/docs/components/radix/radio-group.mdx`
- Demo paths: `repos/ui/apps/v4/examples/base/radio-group-choice-card.tsx`, `repos/ui/apps/v4/examples/base/radio-group-demo.tsx`, `repos/ui/apps/v4/examples/base/radio-group-description.tsx`, `repos/ui/apps/v4/examples/base/radio-group-disabled.tsx`, `repos/ui/apps/v4/examples/base/radio-group-fieldset.tsx`, `repos/ui/apps/v4/examples/base/radio-group-invalid.tsx`, `repos/ui/apps/v4/examples/base/radio-group-rtl.tsx`
- Test/spec paths: `none`
- Style variants: `repos/ui/apps/v4/styles/base-luma/ui/radio-group.tsx`, `repos/ui/apps/v4/styles/base-lyra/ui/radio-group.tsx`, `repos/ui/apps/v4/styles/base-maia/ui/radio-group.tsx`, `repos/ui/apps/v4/styles/base-mira/ui/radio-group.tsx`, `repos/ui/apps/v4/styles/base-nova/ui-rtl/radio-group.tsx`, `repos/ui/apps/v4/styles/base-nova/ui/radio-group.tsx`, `repos/ui/apps/v4/styles/base-rhea/ui/radio-group.tsx`, `repos/ui/apps/v4/styles/base-sera/ui/radio-group.tsx`, `repos/ui/apps/v4/styles/base-vega/ui/radio-group.tsx`
- Runtime hints: `@/components/language-selector`, `@base-ui/react/radio`, `@base-ui/react/radio-group`, `react`
- Registry hints: `base-ui/radio`, `base-ui/radio-group`, `shadcn/field`, `shadcn/label`, `utils/cn`
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
- `@base-ui-components/react/radio-group`: `replace-with-foldkit` -> `defer` (Replace the upstream React primitive with the local Foldkit registry implementation.)
- `@base-ui/react/radio`: `replace-with-foldkit` -> `base-ui/radio` (Replace the upstream React primitive with the local Foldkit registry implementation.)
- `@base-ui/react/radio-group`: `replace-with-foldkit` -> `base-ui/radio-group` (Replace the upstream React primitive with the local Foldkit registry implementation.)
- `base-ui/radio`: `registry-local` -> `base-ui/radio` (The styled shadcn item composes this local Base UI primitive.)
- `base-ui/radio-group`: `registry-local` -> `base-ui/radio-group` (The styled shadcn item composes this local Base UI primitive.)
- `react`: `dev-or-fixture-only` -> `defer` (React is origin fixture evidence only, not installable Foldkit source.)
- `shadcn/field`: `registry-local` -> `shadcn/field` (Origin examples compose this local shadcn registry item.)
- `shadcn/label`: `registry-local` -> `shadcn/label` (Origin examples compose this local shadcn registry item.)
- `utils/cn`: `registry-local` -> `utils/cn` (Local shadcn class canonicalization and Tailwind conflict handling.)

## Origin Test Classification

- `repos/base-ui/packages/react/src/radio-group/RadioGroup.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/radio-group/RadioGroup.spec.tsx`: `covered-by-parity` (DOM attributes and browser behavior belong in origin parity fixtures.)

## Future Improve Plan Shape

1. Create these registry items as dossier-backed implementation slices: `base-ui/radio-group`, `shadcn/radio-group`.
2. Add semantic Story and Scene tests for the Foldkit messages, state, accessibility, and view behavior each item owns.
3. Add local origin and Foldkit parity fixtures for each registry item.
4. Replace upstream React, Radix, Base UI React, and CVA dependencies with local Foldkit and Effect-native implementations.
5. Add theme token coverage and class canonicalization parity for shadcn items.
6. Run `bun run registry:check`, `bun run parity:check -- --grep <component> --dry-run`, `bun run test`, `bun run typecheck`, `bun run check`, and `bun run build`.
