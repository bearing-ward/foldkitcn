# shadcn/button-group Dossier Preview

## Batch

- `shadcn/button-group`

This dossier does not implement registry source. It prepares a future improve plan for the local Foldkit registry.

## Origin Evidence

### shadcn Button Group

- Registry item: `shadcn/button-group`
- Origin kind: `shadcn`
- Docs URL: https://ui.shadcn.com/docs/components/button-group
- Local repo: `repos/ui`
- Pinned ref: `95471a0fb95b2b205e1850841e05d93f3fcae659`
- Source paths: `repos/ui/apps/v4/styles/base-nova/ui/button-group.tsx`
- Docs paths: `repos/ui/apps/v4/content/docs/components/base/button-group.mdx`, `repos/ui/apps/v4/content/docs/components/radix/button-group.mdx`
- Demo paths: `repos/ui/apps/v4/examples/base/button-group-demo.tsx`, `repos/ui/apps/v4/examples/base/button-group-dropdown.tsx`, `repos/ui/apps/v4/examples/base/button-group-input-group.tsx`, `repos/ui/apps/v4/examples/base/button-group-input.tsx`, `repos/ui/apps/v4/examples/base/button-group-nested.tsx`, `repos/ui/apps/v4/examples/base/button-group-orientation.tsx`, `repos/ui/apps/v4/examples/base/button-group-popover.tsx`, `repos/ui/apps/v4/examples/base/button-group-rtl.tsx`, `repos/ui/apps/v4/examples/base/button-group-select.tsx`, `repos/ui/apps/v4/examples/base/button-group-separator.tsx`, `repos/ui/apps/v4/examples/base/button-group-size.tsx`, `repos/ui/apps/v4/examples/base/button-group-split.tsx`
- Test/spec paths: `none`
- Style variants: `repos/ui/apps/v4/styles/base-luma/ui/button-group.tsx`, `repos/ui/apps/v4/styles/base-lyra/ui/button-group.tsx`, `repos/ui/apps/v4/styles/base-maia/ui/button-group.tsx`, `repos/ui/apps/v4/styles/base-mira/ui/button-group.tsx`, `repos/ui/apps/v4/styles/base-nova/ui-rtl/button-group.tsx`, `repos/ui/apps/v4/styles/base-nova/ui/button-group.tsx`, `repos/ui/apps/v4/styles/base-rhea/ui/button-group.tsx`, `repos/ui/apps/v4/styles/base-sera/ui/button-group.tsx`, `repos/ui/apps/v4/styles/base-vega/ui/button-group.tsx`
- Runtime hints: `@/components/language-selector`, `@base-ui/react/merge-props`, `@base-ui/react/use-render`, `@tabler/icons-react`, `class-variance-authority`, `lucide-react`, `react`
- Registry hints: `shadcn/button`, `shadcn/dropdown-menu`, `shadcn/field`, `shadcn/input`, `shadcn/input-group`, `shadcn/popover`, `shadcn/select`, `shadcn/separator`, `shadcn/textarea`, `shadcn/tooltip`, `utils/cn`
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
- `@tabler/icons-react`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `class-variance-authority`: `reject-or-defer` -> `defer` (Replace CVA with Effect Schema literals and pure variant class maps.)
- `lucide-react`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `react`: `dev-or-fixture-only` -> `defer` (React is origin fixture evidence only, not installable Foldkit source.)
- `shadcn/button`: `registry-local` -> `shadcn/button` (Origin examples compose this local shadcn registry item.)
- `shadcn/dropdown-menu`: `registry-local` -> `shadcn/dropdown-menu` (Origin examples compose this local shadcn registry item.)
- `shadcn/field`: `registry-local` -> `shadcn/field` (Origin examples compose this local shadcn registry item.)
- `shadcn/input`: `registry-local` -> `shadcn/input` (Origin examples compose this local shadcn registry item.)
- `shadcn/input-group`: `registry-local` -> `shadcn/input-group` (Origin examples compose this local shadcn registry item.)
- `shadcn/popover`: `registry-local` -> `shadcn/popover` (Origin examples compose this local shadcn registry item.)
- `shadcn/select`: `registry-local` -> `shadcn/select` (Origin examples compose this local shadcn registry item.)
- `shadcn/separator`: `registry-local` -> `shadcn/separator` (Origin examples compose this local shadcn registry item.)
- `shadcn/textarea`: `registry-local` -> `shadcn/textarea` (Origin examples compose this local shadcn registry item.)
- `shadcn/tooltip`: `registry-local` -> `shadcn/tooltip` (Origin examples compose this local shadcn registry item.)
- `utils/cn`: `registry-local` -> `utils/cn` (Local shadcn class canonicalization and Tailwind conflict handling.)

## Origin Test Classification

- `none`: `not-applicable` (No origin tests or specs were discovered.)

## Future Improve Plan Shape

1. Create these registry items as dossier-backed implementation slices: `shadcn/button-group`.
2. Add semantic Story and Scene tests for the Foldkit messages, state, accessibility, and view behavior each item owns.
3. Add local origin and Foldkit parity fixtures for each registry item.
4. Replace upstream React, Radix, Base UI React, and CVA dependencies with local Foldkit and Effect-native implementations.
5. Add theme token coverage and class canonicalization parity for shadcn items.
6. Run `bun run registry:check`, `bun run parity:check -- --grep <component> --dry-run`, `bun run test`, `bun run typecheck`, `bun run check`, and `bun run build`.
