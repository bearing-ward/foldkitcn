# base-ui/avatar + shadcn/avatar Dossier Preview

## Batch

- `base-ui/avatar`
- `shadcn/avatar`

This dossier does not implement registry source. It prepares a future improve plan for the local Foldkit registry.

## Origin Evidence

### Base UI Avatar

- Registry item: `base-ui/avatar`
- Origin kind: `base-ui`
- Docs URL: https://base-ui.com/react/components/avatar
- Local repo: `repos/base-ui`
- Pinned ref: `ea3818dec91923d4287b38be21322d2e5068d347`
- Source paths: `repos/base-ui/packages/react/src/avatar/fallback/AvatarFallback.tsx`, `repos/base-ui/packages/react/src/avatar/image/AvatarImage.tsx`, `repos/base-ui/packages/react/src/avatar/image/AvatarImageDataAttributes.ts`, `repos/base-ui/packages/react/src/avatar/image/useImageLoadingStatus.ts`, `repos/base-ui/packages/react/src/avatar/index.parts.ts`, `repos/base-ui/packages/react/src/avatar/index.ts`, `repos/base-ui/packages/react/src/avatar/root/AvatarRoot.tsx`, `repos/base-ui/packages/react/src/avatar/root/AvatarRootContext.ts`, `repos/base-ui/packages/react/src/avatar/root/stateAttributesMapping.ts`
- Docs paths: `repos/base-ui/docs/src/app/(docs)/react/components/avatar/page.mdx`, `repos/base-ui/docs/src/app/(docs)/react/components/avatar/types.md`, `repos/base-ui/docs/src/app/(docs)/react/components/avatar/types.ts`
- Demo paths: `repos/base-ui/docs/src/app/(docs)/react/components/avatar/demos/hero/css-modules/index.module.css`, `repos/base-ui/docs/src/app/(docs)/react/components/avatar/demos/hero/css-modules/index.tsx`, `repos/base-ui/docs/src/app/(docs)/react/components/avatar/demos/hero/index.ts`, `repos/base-ui/docs/src/app/(docs)/react/components/avatar/demos/hero/tailwind/index.tsx`
- Test/spec paths: `repos/base-ui/packages/react/src/avatar/fallback/AvatarFallback.test.tsx`, `repos/base-ui/packages/react/src/avatar/image/AvatarImage.test.tsx`, `repos/base-ui/packages/react/src/avatar/root/AvatarRoot.test.tsx`, `repos/base-ui/packages/react/src/avatar/Avatar.spec.tsx`
- Style variants: `none`
- Runtime hints: `@base-ui-components/react/avatar`
- Registry hints: `none`
- Confidence: `high`

### shadcn Avatar

- Registry item: `shadcn/avatar`
- Origin kind: `shadcn`
- Docs URL: https://ui.shadcn.com/docs/components/avatar
- Local repo: `repos/ui`
- Pinned ref: `95471a0fb95b2b205e1850841e05d93f3fcae659`
- Source paths: `repos/ui/apps/v4/styles/base-nova/ui/avatar.tsx`
- Docs paths: `repos/ui/apps/v4/content/docs/components/base/avatar.mdx`, `repos/ui/apps/v4/content/docs/components/radix/avatar.mdx`
- Demo paths: `repos/ui/apps/v4/examples/base/avatar-badge-icon.tsx`, `repos/ui/apps/v4/examples/base/avatar-badge.tsx`, `repos/ui/apps/v4/examples/base/avatar-basic.tsx`, `repos/ui/apps/v4/examples/base/avatar-demo.tsx`, `repos/ui/apps/v4/examples/base/avatar-dropdown.tsx`, `repos/ui/apps/v4/examples/base/avatar-group-count-icon.tsx`, `repos/ui/apps/v4/examples/base/avatar-group-count.tsx`, `repos/ui/apps/v4/examples/base/avatar-group.tsx`, `repos/ui/apps/v4/examples/base/avatar-rtl.tsx`, `repos/ui/apps/v4/examples/base/avatar-size.tsx`
- Test/spec paths: `none`
- Style variants: `repos/ui/apps/v4/styles/base-luma/ui/avatar.tsx`, `repos/ui/apps/v4/styles/base-lyra/ui/avatar.tsx`, `repos/ui/apps/v4/styles/base-maia/ui/avatar.tsx`, `repos/ui/apps/v4/styles/base-mira/ui/avatar.tsx`, `repos/ui/apps/v4/styles/base-nova/ui-rtl/avatar.tsx`, `repos/ui/apps/v4/styles/base-nova/ui/avatar.tsx`, `repos/ui/apps/v4/styles/base-rhea/ui/avatar.tsx`, `repos/ui/apps/v4/styles/base-sera/ui/avatar.tsx`, `repos/ui/apps/v4/styles/base-vega/ui/avatar.tsx`
- Runtime hints: `@/components/language-selector`, `@base-ui/react/avatar`, `lucide-react`, `react`
- Registry hints: `base-ui/avatar`, `shadcn/button`, `shadcn/dropdown-menu`, `utils/cn`
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
- `@base-ui-components/react/avatar`: `replace-with-foldkit` -> `defer` (Replace the upstream React primitive with the local Foldkit registry implementation.)
- `@base-ui/react/avatar`: `replace-with-foldkit` -> `base-ui/avatar` (Replace the upstream React primitive with the local Foldkit registry implementation.)
- `base-ui/avatar`: `registry-local` -> `base-ui/avatar` (The styled shadcn item composes this local Base UI primitive.)
- `lucide-react`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `react`: `dev-or-fixture-only` -> `defer` (React is origin fixture evidence only, not installable Foldkit source.)
- `shadcn/button`: `registry-local` -> `shadcn/button` (Origin examples compose this local shadcn registry item.)
- `shadcn/dropdown-menu`: `registry-local` -> `shadcn/dropdown-menu` (Origin examples compose this local shadcn registry item.)
- `utils/cn`: `registry-local` -> `utils/cn` (Local shadcn class canonicalization and Tailwind conflict handling.)

## Origin Test Classification

- `repos/base-ui/packages/react/src/avatar/fallback/AvatarFallback.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/avatar/image/AvatarImage.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/avatar/root/AvatarRoot.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/avatar/Avatar.spec.tsx`: `covered-by-parity` (DOM attributes and browser behavior belong in origin parity fixtures.)

## Future Improve Plan Shape

1. Create these registry items as dossier-backed implementation slices: `base-ui/avatar`, `shadcn/avatar`.
2. Add semantic Story and Scene tests for the Foldkit messages, state, accessibility, and view behavior each item owns.
3. Add local origin and Foldkit parity fixtures for each registry item.
4. Replace upstream React, Radix, Base UI React, and CVA dependencies with local Foldkit and Effect-native implementations.
5. Add theme token coverage and class canonicalization parity for shadcn items.
6. Run `bun run registry:check`, `bun run parity:check -- --grep <component> --dry-run`, `bun run test`, `bun run typecheck`, `bun run check`, and `bun run build`.
