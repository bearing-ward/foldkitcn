# base-ui/fieldset Dossier Preview

## Batch

- `base-ui/fieldset`

This dossier does not implement registry source. It prepares a future improve plan for the local Foldkit registry.

## Origin Evidence

### Base UI Fieldset

- Registry item: `base-ui/fieldset`
- Origin kind: `base-ui`
- Docs URL: https://base-ui.com/react/components/fieldset
- Local repo: `repos/base-ui`
- Pinned ref: `ea3818dec91923d4287b38be21322d2e5068d347`
- Source paths: `repos/base-ui/packages/react/src/fieldset/index.parts.ts`, `repos/base-ui/packages/react/src/fieldset/index.ts`, `repos/base-ui/packages/react/src/fieldset/legend/FieldsetLegend.tsx`, `repos/base-ui/packages/react/src/fieldset/root/FieldsetRoot.tsx`, `repos/base-ui/packages/react/src/fieldset/root/FieldsetRootContext.ts`
- Docs paths: `repos/base-ui/docs/src/app/(docs)/react/components/fieldset/page.mdx`, `repos/base-ui/docs/src/app/(docs)/react/components/fieldset/types.md`, `repos/base-ui/docs/src/app/(docs)/react/components/fieldset/types.ts`
- Demo paths: `repos/base-ui/docs/src/app/(docs)/react/components/fieldset/demos/hero/css-modules/index.module.css`, `repos/base-ui/docs/src/app/(docs)/react/components/fieldset/demos/hero/css-modules/index.tsx`, `repos/base-ui/docs/src/app/(docs)/react/components/fieldset/demos/hero/index.ts`, `repos/base-ui/docs/src/app/(docs)/react/components/fieldset/demos/hero/tailwind/index.tsx`
- Test/spec paths: `repos/base-ui/packages/react/src/fieldset/legend/FieldsetLegend.test.tsx`, `repos/base-ui/packages/react/src/fieldset/root/FieldsetRoot.test.tsx`
- Style variants: `none`
- Runtime hints: `@base-ui-components/react/fieldset`
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

- `@base-ui-components/react/fieldset`: `replace-with-foldkit` -> `defer` (Replace the upstream React primitive with the local Foldkit registry implementation.)

## Origin Test Classification

- `repos/base-ui/packages/react/src/fieldset/legend/FieldsetLegend.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/fieldset/root/FieldsetRoot.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)

## Future Improve Plan Shape

1. Create these registry items as dossier-backed implementation slices: `base-ui/fieldset`.
2. Add semantic Story and Scene tests for the Foldkit messages, state, accessibility, and view behavior each item owns.
3. Add local origin and Foldkit parity fixtures for each registry item.
4. Replace upstream React, Radix, Base UI React, and CVA dependencies with local Foldkit and Effect-native implementations.
5. Add theme token coverage and class canonicalization parity for shadcn items.
6. Run `bun run registry:check`, `bun run parity:check -- --grep <component> --dry-run`, `bun run test`, `bun run typecheck`, `bun run check`, and `bun run build`.
