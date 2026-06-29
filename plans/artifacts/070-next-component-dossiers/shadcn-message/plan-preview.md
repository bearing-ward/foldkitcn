# shadcn/message Dossier Preview

## Batch

- `shadcn/message`

This dossier does not implement registry source. It prepares a future improve plan for the local Foldkit registry.

## Origin Evidence

### shadcn Message

- Registry item: `shadcn/message`
- Origin kind: `shadcn`
- Docs URL: https://ui.shadcn.com/docs/components/message
- Local repo: `repos/ui`
- Pinned ref: `40c7064532185f5556f6cbff7dca3544987c0fe1`
- Resolution status: `source-backed`
- Source paths: `repos/ui/apps/v4/styles/base-nova/ui/message.tsx`
- Missing primary source: `none`
- Docs paths: `repos/ui/apps/v4/content/docs/components/base/message.mdx`, `repos/ui/apps/v4/content/docs/components/radix/message.mdx`
- Demo paths: `repos/ui/apps/v4/examples/base/message-actions.tsx`, `repos/ui/apps/v4/examples/base/message-attachment.tsx`, `repos/ui/apps/v4/examples/base/message-avatar.tsx`, `repos/ui/apps/v4/examples/base/message-demo.tsx`, `repos/ui/apps/v4/examples/base/message-group.tsx`, `repos/ui/apps/v4/examples/base/message-header-footer.tsx`, `repos/ui/apps/v4/examples/base/message-markdown.tsx`
- Test/spec paths: `none`
- Style variants: `repos/ui/apps/v4/styles/base-luma/ui/message.tsx`, `repos/ui/apps/v4/styles/base-lyra/ui/message.tsx`, `repos/ui/apps/v4/styles/base-maia/ui/message.tsx`, `repos/ui/apps/v4/styles/base-mira/ui/message.tsx`, `repos/ui/apps/v4/styles/base-nova/ui-rtl/message.tsx`, `repos/ui/apps/v4/styles/base-nova/ui/message.tsx`, `repos/ui/apps/v4/styles/base-rhea/ui/message.tsx`, `repos/ui/apps/v4/styles/base-sera/ui/message.tsx`, `repos/ui/apps/v4/styles/base-vega/ui/message.tsx`
- Public registry paths: `none`
- Runtime hints: `@/components/markdown`, `lucide-react`, `react`
- Registry hints: `shadcn/attachment`, `shadcn/avatar`, `shadcn/bubble`, `shadcn/button`, `shadcn/marker`, `utils/cn`
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

- `@/components/markdown`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `lucide-react`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `react`: `dev-or-fixture-only` -> `defer` (React is origin fixture evidence only, not installable Foldkit source.)
- `shadcn/attachment`: `registry-local` -> `shadcn/attachment` (Origin examples compose this local shadcn registry item.)
- `shadcn/avatar`: `registry-local` -> `shadcn/avatar` (Origin examples compose this local shadcn registry item.)
- `shadcn/bubble`: `registry-local` -> `shadcn/bubble` (Origin examples compose this local shadcn registry item.)
- `shadcn/button`: `registry-local` -> `shadcn/button` (Origin examples compose this local shadcn registry item.)
- `shadcn/marker`: `registry-local` -> `shadcn/marker` (Origin examples compose this local shadcn registry item.)
- `utils/cn`: `registry-local` -> `utils/cn` (Local shadcn class canonicalization and Tailwind conflict handling.)

## Origin Test Classification

- `none`: `not-applicable` (No origin tests or specs were discovered.)

## Future Improve Plan Shape

1. Create these registry items as dossier-backed implementation slices: `shadcn/message`.
2. Add semantic Story and Scene tests for the Foldkit messages, state, accessibility, and view behavior each item owns.
3. Add local origin and Foldkit parity fixtures for each registry item.
4. Replace upstream React, Radix, Base UI React, and CVA dependencies with local Foldkit and Effect-native implementations.
5. Add theme token coverage and class canonicalization parity for shadcn items.
6. Run `bun run registry:check`, `bun run parity:check -- --grep <component> --dry-run`, `bun run test`, `bun run typecheck`, `bun run check`, and `bun run build`.
