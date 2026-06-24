# base-ui/form Dossier Preview

## Batch

- `base-ui/form`

This dossier does not implement registry source. It prepares a future improve plan for the local Foldkit registry.

## Origin Evidence

### Base UI Form

- Registry item: `base-ui/form`
- Origin kind: `base-ui`
- Docs URL: https://base-ui.com/react/components/form
- Local repo: `repos/base-ui`
- Pinned ref: `ea3818dec91923d4287b38be21322d2e5068d347`
- Source paths: `repos/base-ui/packages/react/src/form/Form.tsx`, `repos/base-ui/packages/react/src/form/index.ts`
- Docs paths: `repos/base-ui/docs/src/app/(docs)/react/components/form/page.mdx`, `repos/base-ui/docs/src/app/(docs)/react/components/form/types.md`, `repos/base-ui/docs/src/app/(docs)/react/components/form/types.ts`
- Demo paths: `repos/base-ui/docs/src/app/(docs)/react/components/form/demos/form-action/css-modules/index.module.css`, `repos/base-ui/docs/src/app/(docs)/react/components/form/demos/form-action/css-modules/index.tsx`, `repos/base-ui/docs/src/app/(docs)/react/components/form/demos/form-action/index.ts`, `repos/base-ui/docs/src/app/(docs)/react/components/form/demos/form-action/tailwind/index.tsx`, `repos/base-ui/docs/src/app/(docs)/react/components/form/demos/hero/css-modules/index.module.css`, `repos/base-ui/docs/src/app/(docs)/react/components/form/demos/hero/css-modules/index.tsx`, `repos/base-ui/docs/src/app/(docs)/react/components/form/demos/hero/index.ts`, `repos/base-ui/docs/src/app/(docs)/react/components/form/demos/hero/tailwind/index.tsx`, `repos/base-ui/docs/src/app/(docs)/react/components/form/demos/zod/css-modules/index.module.css`, `repos/base-ui/docs/src/app/(docs)/react/components/form/demos/zod/css-modules/index.tsx`, `repos/base-ui/docs/src/app/(docs)/react/components/form/demos/zod/index.ts`, `repos/base-ui/docs/src/app/(docs)/react/components/form/demos/zod/tailwind/index.tsx`
- Test/spec paths: `repos/base-ui/packages/react/src/form/Form.test.tsx`, `repos/base-ui/packages/react/src/form/Form.spec.tsx`
- Style variants: `none`
- Runtime hints: `@base-ui-components/react/form`
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

- `@base-ui-components/react/form`: `replace-with-foldkit` -> `defer` (Replace the upstream React primitive with the local Foldkit registry implementation.)

## Origin Test Classification

- `repos/base-ui/packages/react/src/form/Form.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/form/Form.spec.tsx`: `covered-by-parity` (DOM attributes and browser behavior belong in origin parity fixtures.)

## Future Improve Plan Shape

1. Create these registry items as dossier-backed implementation slices: `base-ui/form`.
2. Add semantic Story and Scene tests for the Foldkit messages, state, accessibility, and view behavior each item owns.
3. Add local origin and Foldkit parity fixtures for each registry item.
4. Replace upstream React, Radix, Base UI React, and CVA dependencies with local Foldkit and Effect-native implementations.
5. Add theme token coverage and class canonicalization parity for shadcn items.
6. Run `bun run registry:check`, `bun run parity:check -- --grep <component> --dry-run`, `bun run test`, `bun run typecheck`, `bun run check`, and `bun run build`.
