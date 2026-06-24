# shadcn/badge Dossier Preview

## Batch

- `shadcn/badge`

This dossier does not implement registry source. It prepares a future improve plan for the local Foldkit registry.

## Origin Evidence

### shadcn Badge

- Registry item: `shadcn/badge`
- Origin kind: `shadcn`
- Docs URL: https://ui.shadcn.com/docs/components/badge
- Local repo: `repos/ui`
- Pinned ref: `95471a0fb95b2b205e1850841e05d93f3fcae659`
- Source paths: `repos/ui/apps/v4/styles/base-nova/ui/badge.tsx`
- Docs paths: `repos/ui/apps/v4/content/docs/components/base/badge.mdx`, `repos/ui/apps/v4/content/docs/components/radix/badge.mdx`
- Demo paths: `repos/ui/apps/v4/examples/base/badge-colors.tsx`, `repos/ui/apps/v4/examples/base/badge-demo.tsx`, `repos/ui/apps/v4/examples/base/badge-icon.tsx`, `repos/ui/apps/v4/examples/base/badge-link.tsx`, `repos/ui/apps/v4/examples/base/badge-rtl.tsx`, `repos/ui/apps/v4/examples/base/badge-spinner.tsx`, `repos/ui/apps/v4/examples/base/badge-variants.tsx`
- Test/spec paths: `none`
- Style variants: `repos/ui/apps/v4/styles/base-luma/ui/badge.tsx`, `repos/ui/apps/v4/styles/base-lyra/ui/badge.tsx`, `repos/ui/apps/v4/styles/base-maia/ui/badge.tsx`, `repos/ui/apps/v4/styles/base-mira/ui/badge.tsx`, `repos/ui/apps/v4/styles/base-nova/ui-rtl/badge.tsx`, `repos/ui/apps/v4/styles/base-nova/ui/badge.tsx`, `repos/ui/apps/v4/styles/base-rhea/ui/badge.tsx`, `repos/ui/apps/v4/styles/base-sera/ui/badge.tsx`, `repos/ui/apps/v4/styles/base-vega/ui/badge.tsx`
- Runtime hints: `@/components/language-selector`, `@base-ui/react/merge-props`, `@base-ui/react/use-render`, `class-variance-authority`, `lucide-react`, `react`
- Registry hints: `shadcn/spinner`, `utils/cn`
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
- `@base-ui/react/merge-props`: `replace-with-foldkit` -> `base-ui/merge-props` (Replace the upstream React primitive with the local Foldkit registry implementation.)
- `@base-ui/react/use-render`: `replace-with-foldkit` -> `base-ui/use-render` (Replace the upstream React primitive with the local Foldkit registry implementation.)
- `class-variance-authority`: `reject-or-defer` -> `defer` (Replace CVA with Effect Schema literals and pure variant class maps.)
- `lucide-react`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `react`: `dev-or-fixture-only` -> `defer` (React is origin fixture evidence only, not installable Foldkit source.)
- `shadcn/spinner`: `registry-local` -> `shadcn/spinner` (Origin examples compose this local shadcn registry item.)
- `utils/cn`: `registry-local` -> `utils/cn` (Local shadcn class canonicalization and Tailwind conflict handling.)

## Origin Test Classification

- `none`: `not-applicable` (No origin tests or specs were discovered.)

## Future Improve Plan Shape

1. Create these registry items as dossier-backed implementation slices: `shadcn/badge`.
2. Add semantic Story and Scene tests for the Foldkit messages, state, accessibility, and view behavior each item owns.
3. Add local origin and Foldkit parity fixtures for each registry item.
4. Replace upstream React, Radix, Base UI React, and CVA dependencies with local Foldkit and Effect-native implementations.
5. Add theme token coverage and class canonicalization parity for shadcn items.
6. Run `bun run registry:check`, `bun run parity:check -- --grep <component> --dry-run`, `bun run test`, `bun run typecheck`, `bun run check`, and `bun run build`.
