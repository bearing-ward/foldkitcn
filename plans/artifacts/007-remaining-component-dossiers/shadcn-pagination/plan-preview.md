# shadcn/pagination Dossier Preview

## Batch

- `shadcn/pagination`

This dossier does not implement registry source. It prepares a future improve plan for the local Foldkit registry.

## Origin Evidence

### shadcn Pagination

- Registry item: `shadcn/pagination`
- Origin kind: `shadcn`
- Docs URL: https://ui.shadcn.com/docs/components/pagination
- Local repo: `repos/ui`
- Pinned ref: `95471a0fb95b2b205e1850841e05d93f3fcae659`
- Source paths: `repos/ui/apps/v4/styles/base-nova/ui/pagination.tsx`
- Docs paths: `repos/ui/apps/v4/content/docs/components/base/pagination.mdx`, `repos/ui/apps/v4/content/docs/components/radix/pagination.mdx`
- Demo paths: `repos/ui/apps/v4/examples/base/pagination-demo.tsx`, `repos/ui/apps/v4/examples/base/pagination-icons-only.tsx`, `repos/ui/apps/v4/examples/base/pagination-rtl.tsx`, `repos/ui/apps/v4/examples/base/pagination-simple.tsx`
- Test/spec paths: `none`
- Style variants: `repos/ui/apps/v4/styles/base-luma/ui/pagination.tsx`, `repos/ui/apps/v4/styles/base-lyra/ui/pagination.tsx`, `repos/ui/apps/v4/styles/base-maia/ui/pagination.tsx`, `repos/ui/apps/v4/styles/base-mira/ui/pagination.tsx`, `repos/ui/apps/v4/styles/base-nova/ui-rtl/pagination.tsx`, `repos/ui/apps/v4/styles/base-nova/ui/pagination.tsx`, `repos/ui/apps/v4/styles/base-rhea/ui/pagination.tsx`, `repos/ui/apps/v4/styles/base-sera/ui/pagination.tsx`, `repos/ui/apps/v4/styles/base-vega/ui/pagination.tsx`
- Runtime hints: `@/components/language-selector`, `lucide-react`, `react`
- Registry hints: `shadcn/button`, `shadcn/field`, `shadcn/select`, `utils/cn`
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
- `lucide-react`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `react`: `dev-or-fixture-only` -> `defer` (React is origin fixture evidence only, not installable Foldkit source.)
- `shadcn/button`: `registry-local` -> `shadcn/button` (Origin examples compose this local shadcn registry item.)
- `shadcn/field`: `registry-local` -> `shadcn/field` (Origin examples compose this local shadcn registry item.)
- `shadcn/select`: `registry-local` -> `shadcn/select` (Origin examples compose this local shadcn registry item.)
- `utils/cn`: `registry-local` -> `utils/cn` (Local shadcn class canonicalization and Tailwind conflict handling.)

## Origin Test Classification

- `none`: `not-applicable` (No origin tests or specs were discovered.)

## Future Improve Plan Shape

1. Create these registry items as dossier-backed implementation slices: `shadcn/pagination`.
2. Add semantic Story and Scene tests for the Foldkit messages, state, accessibility, and view behavior each item owns.
3. Add local origin and Foldkit parity fixtures for each registry item.
4. Replace upstream React, Radix, Base UI React, and CVA dependencies with local Foldkit and Effect-native implementations.
5. Add theme token coverage and class canonicalization parity for shadcn items.
6. Run `bun run registry:check`, `bun run parity:check -- --grep <component> --dry-run`, `bun run test`, `bun run typecheck`, `bun run check`, and `bun run build`.
