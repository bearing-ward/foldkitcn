# shadcn/input-group Dossier Preview

## Batch

- `shadcn/input-group`

This dossier does not implement registry source. It prepares a future improve plan for the local Foldkit registry.

## Origin Evidence

### shadcn Input Group

- Registry item: `shadcn/input-group`
- Origin kind: `shadcn`
- Docs URL: https://ui.shadcn.com/docs/components/input-group
- Local repo: `repos/ui`
- Pinned ref: `40c7064532185f5556f6cbff7dca3544987c0fe1`
- Resolution status: `source-backed`
- Source paths: `repos/ui/apps/v4/styles/base-nova/ui/input-group.tsx`
- Missing primary source: `none`
- Docs paths: `repos/ui/apps/v4/content/docs/components/base/input-group.mdx`, `repos/ui/apps/v4/content/docs/components/radix/input-group.mdx`
- Demo paths: `repos/ui/apps/v4/examples/base/input-group-basic.tsx`, `repos/ui/apps/v4/examples/base/input-group-block-end.tsx`, `repos/ui/apps/v4/examples/base/input-group-block-start.tsx`, `repos/ui/apps/v4/examples/base/input-group-button-group.tsx`, `repos/ui/apps/v4/examples/base/input-group-button.tsx`, `repos/ui/apps/v4/examples/base/input-group-custom.tsx`, `repos/ui/apps/v4/examples/base/input-group-demo.tsx`, `repos/ui/apps/v4/examples/base/input-group-dropdown.tsx`, `repos/ui/apps/v4/examples/base/input-group-icon.tsx`, `repos/ui/apps/v4/examples/base/input-group-in-card.tsx`, `repos/ui/apps/v4/examples/base/input-group-inline-end.tsx`, `repos/ui/apps/v4/examples/base/input-group-inline-start.tsx`, `repos/ui/apps/v4/examples/base/input-group-kbd.tsx`, `repos/ui/apps/v4/examples/base/input-group-label.tsx`, `repos/ui/apps/v4/examples/base/input-group-rtl.tsx`, `repos/ui/apps/v4/examples/base/input-group-spinner.tsx`, `repos/ui/apps/v4/examples/base/input-group-text.tsx`, `repos/ui/apps/v4/examples/base/input-group-textarea-examples.tsx`, `repos/ui/apps/v4/examples/base/input-group-textarea.tsx`, `repos/ui/apps/v4/examples/base/input-group-tooltip.tsx`, `repos/ui/apps/v4/examples/base/input-group-with-addons.tsx`, `repos/ui/apps/v4/examples/base/input-group-with-buttons.tsx`, `repos/ui/apps/v4/examples/base/input-group-with-kbd.tsx`, `repos/ui/apps/v4/examples/base/input-group-with-tooltip.tsx`
- Test/spec paths: `none`
- Style variants: `repos/ui/apps/v4/styles/base-luma/ui/input-group.tsx`, `repos/ui/apps/v4/styles/base-lyra/ui/input-group.tsx`, `repos/ui/apps/v4/styles/base-maia/ui/input-group.tsx`, `repos/ui/apps/v4/styles/base-mira/ui/input-group.tsx`, `repos/ui/apps/v4/styles/base-nova/ui-rtl/input-group.tsx`, `repos/ui/apps/v4/styles/base-nova/ui/input-group.tsx`, `repos/ui/apps/v4/styles/base-rhea/ui/input-group.tsx`, `repos/ui/apps/v4/styles/base-sera/ui/input-group.tsx`, `repos/ui/apps/v4/styles/base-vega/ui/input-group.tsx`
- Public registry paths: `none`
- Runtime hints: `@/components/language-selector`, `@/hooks/use-copy-to-clipboard`, `@tabler/icons-react`, `class-variance-authority`, `lucide-react`, `react`, `react-textarea-autosize`, `sonner`
- Registry hints: `shadcn/button`, `shadcn/button-group`, `shadcn/card`, `shadcn/dropdown-menu`, `shadcn/field`, `shadcn/input`, `shadcn/kbd`, `shadcn/label`, `shadcn/popover`, `shadcn/spinner`, `shadcn/textarea`, `shadcn/tooltip`, `utils/cn`
- Blockers: `none`
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
- `@/hooks/use-copy-to-clipboard`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `@tabler/icons-react`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `class-variance-authority`: `reject-or-defer` -> `defer` (Replace CVA with Effect Schema literals and pure variant class maps.)
- `lucide-react`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `react`: `dev-or-fixture-only` -> `defer` (React is origin fixture evidence only, not installable Foldkit source.)
- `react-textarea-autosize`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `shadcn/button`: `registry-local` -> `shadcn/button` (Origin examples compose this local shadcn registry item.)
- `shadcn/button-group`: `registry-local` -> `shadcn/button-group` (Origin examples compose this local shadcn registry item.)
- `shadcn/card`: `registry-local` -> `shadcn/card` (Origin examples compose this local shadcn registry item.)
- `shadcn/dropdown-menu`: `registry-local` -> `shadcn/dropdown-menu` (Origin examples compose this local shadcn registry item.)
- `shadcn/field`: `registry-local` -> `shadcn/field` (Origin examples compose this local shadcn registry item.)
- `shadcn/input`: `registry-local` -> `shadcn/input` (Origin examples compose this local shadcn registry item.)
- `shadcn/kbd`: `registry-local` -> `shadcn/kbd` (Origin examples compose this local shadcn registry item.)
- `shadcn/label`: `registry-local` -> `shadcn/label` (Origin examples compose this local shadcn registry item.)
- `shadcn/popover`: `registry-local` -> `shadcn/popover` (Origin examples compose this local shadcn registry item.)
- `shadcn/spinner`: `registry-local` -> `shadcn/spinner` (Origin examples compose this local shadcn registry item.)
- `shadcn/textarea`: `registry-local` -> `shadcn/textarea` (Origin examples compose this local shadcn registry item.)
- `shadcn/tooltip`: `registry-local` -> `shadcn/tooltip` (Origin examples compose this local shadcn registry item.)
- `sonner`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `utils/cn`: `registry-local` -> `utils/cn` (Local shadcn class canonicalization and Tailwind conflict handling.)

## Origin Test Classification

- `none`: `not-applicable` (No origin tests or specs were discovered.)

## Future Improve Plan Shape

1. Create these registry items as dossier-backed implementation slices: `shadcn/input-group`.
2. Add semantic Story and Scene tests for the Foldkit messages, state, accessibility, and view behavior each item owns.
3. Add local origin and Foldkit parity fixtures for each registry item.
4. Replace upstream React, Radix, Base UI React, and CVA dependencies with local Foldkit and Effect-native implementations.
5. Add theme token coverage and class canonicalization parity for shadcn items.
6. Run `bun run registry:check`, `bun run parity:check -- --grep <component> --dry-run`, `bun run test`, `bun run typecheck`, `bun run check`, and `bun run build`.
